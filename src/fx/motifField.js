import { MOTIFS } from '../brand/motifs.js';

// A textile-like field: stable motifs reveal colour and gently turn in a
// pointer spotlight. Idle motifs stay still and cost no animation frames.
export function mountMotifField(root, canvas, { footer = false } = {}) {
  const ctx = canvas?.getContext('2d');
  if (!ctx || !root) return { destroy() {} };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const paths = MOTIFS.map((motif) => new Path2D(motif.path));
  const inks = ['#FFD129', '#F4E7C3', '#3B1CF4', '#8B0F14'];
  let width = 0, height = 0, cell = 82, visible = false, raf = 0, last = 0;
  const pointer = { x: -1000, y: -1000, active: false };
  const spot = { x: -1000, y: -1000, strength: 0 };
  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    for (let row = 0; row * cell < height + cell; row++) {
      for (let col = 0; col * cell < width + cell; col++) {
        const x = col * cell + (row % 2 ? cell / 2 : 0);
        const y = row * cell + cell / 2;
        const seed = row * 17 + col * 31;
        const distance = Math.hypot(x - spot.x, y - spot.y);
        const hot = Math.exp(-(distance * distance) / (210 * 210)) * spot.strength;
        const size = cell * (.31 + hot * .16);
        ctx.save(); ctx.translate(x, y);
        ctx.rotate(((seed % 3) - 1) * .13 + (reduced ? 0 : hot * .25));
        ctx.scale(size / 100, size / 100); ctx.translate(-50, -50);
        ctx.globalAlpha = (footer ? .055 : .065) + hot * .55;
        ctx.fillStyle = hot > .08 ? inks[seed % inks.length] : (footer ? '#F4E7C3' : '#8B0F14');
        ctx.fill(paths[seed % paths.length], 'evenodd'); ctx.restore();
      }
    }
  };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const frame = (time) => {
    raf = requestAnimationFrame(frame);
    if (time - last < 32) return;
    last = time;
    if (pointer.active) {
      spot.x += (pointer.x - spot.x) * .14;
      spot.y += (pointer.y - spot.y) * .14;
    }
    spot.strength += ((pointer.active ? 1 : 0) - spot.strength) * .14;
    draw();
    if (!pointer.active && spot.strength < .005) { spot.strength = 0; draw(); stop(); }
    else if (pointer.active && Math.hypot(pointer.x - spot.x, pointer.y - spot.y) < .1 && 1 - spot.strength < .001) stop();
  };
  const start = () => {
    if (!raf && !reduced && visible && !document.hidden) raf = requestAnimationFrame(frame);
  };
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width; height = rect.height; cell = width < 640 ? 64 : 82;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw();
  };
  const move = (e) => {
    if (!fine || e.pointerType === 'touch') return;
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left; pointer.y = e.clientY - rect.top;
    if (!pointer.active) { spot.x = pointer.x; spot.y = pointer.y; }
    pointer.active = true;
    if (reduced) { spot.x = pointer.x; spot.y = pointer.y; spot.strength = 1; draw(); }
    else start();
  };
  const leave = () => {
    pointer.active = false;
    if (reduced) { spot.strength = 0; draw(); } else start();
  };
  const visibility = () => { if (document.hidden) stop(); else if (pointer.active) start(); };
  const ro = new ResizeObserver(resize); ro.observe(canvas);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && pointer.active) start();
    else if (!visible) { pointer.active = false; spot.strength = 0; stop(); draw(); }
  });
  io.observe(root);
  root.addEventListener('pointermove', move, { passive: true });
  root.addEventListener('pointerleave', leave);
  document.addEventListener('visibilitychange', visibility); resize();
  return { destroy() {
    stop(); ro.disconnect(); io.disconnect();
    root.removeEventListener('pointermove', move); root.removeEventListener('pointerleave', leave);
    document.removeEventListener('visibilitychange', visibility);
  } };
}
