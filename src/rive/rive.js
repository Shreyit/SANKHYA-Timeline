// Rive — vector animation. Drop a canvas anywhere and it plays:
//
//   <canvas class="rive" data-rive="/rive/sprout.riv"
//           data-rive-sm="State Machine 1"      (optional: state machine to run)
//           data-rive-hover="isHovered"          (optional: boolean input toggled on hover)
//           data-rive-click="tap"                (optional: trigger input fired on click)
//           aria-label="…" role="img"></canvas>
//
// .riv files are made in the Rive editor (rive.app) and live in public/rive/.
// The runtime (~150 KB) is only downloaded on pages that actually contain a
// [data-rive] canvas. Each animation plays only while on screen, and is frozen
// on its first frame for reduced-motion users. If a file fails to load, the
// canvas gets .rive--failed so CSS can show a static fallback instead.
import { $$, reduce } from '../core/env.js';

export async function initRive() {
  const canvases = $$('canvas[data-rive]');
  if (!canvases.length) return;
  const { Rive, Layout, Fit, Alignment } = await import('@rive-app/canvas');

  canvases.forEach((canvas) => {
    const sm = canvas.dataset.riveSm || undefined;
    const r = new Rive({
      src: canvas.dataset.rive,
      canvas,
      stateMachines: sm,
      autoplay: !reduce,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      onLoad: () => { r.resizeDrawingSurfaceToCanvas(); canvas.classList.add('rive--ready'); },
      onLoadError: () => canvas.classList.add('rive--failed'),
    });

    const input = (name) => (sm && name ? r.stateMachineInputs(sm)?.find((i) => i.name === name) : null);
    const hover = canvas.dataset.riveHover;
    if (hover) {
      const host = canvas.closest('a, button, [data-rive-host]') || canvas;
      host.addEventListener('pointerenter', () => { const i = input(hover); if (i) i.value = true; });
      host.addEventListener('pointerleave', () => { const i = input(hover); if (i) i.value = false; });
    }
    const click = canvas.dataset.riveClick;
    if (click) canvas.addEventListener('click', () => input(click)?.fire());

    new ResizeObserver(() => r.resizeDrawingSurfaceToCanvas()).observe(canvas);
    if (!reduce) {
      new IntersectionObserver(([e]) => (e.isIntersecting ? r.play() : r.pause())).observe(canvas);
    }
  });
}
