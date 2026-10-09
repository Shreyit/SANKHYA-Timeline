import { gsap } from '../core/gsap.js';
import logoSvg from '../assets/sankhya-popart.svg?raw';

// Instance IDs keep the nav, hero and footer clipping paths independent.
export function mountLogos({ reduce = false } = {}) {
  document.querySelectorAll('img.logo').forEach((img, i) => {
    const logo = document.createElement('span');
    logo.className = 'logo';
    logo.setAttribute('role', 'img');
    logo.setAttribute('aria-label', img.alt || 'Sankhya');
    logo.innerHTML = logoSvg.replaceAll('sk-', `sk${i}-`)
      .replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
    logo.querySelectorAll('[class]').forEach((el) => {
      el.setAttribute('class', el.getAttribute('class').replaceAll(`sk${i}-`, 'sk-'));
    });
    img.replaceWith(logo);
    if (reduce) return;

    const trigger = logo.closest('.logo-trigger');
    if (!trigger) return;
    const ornaments = [...logo.querySelectorAll('.sk-ornament')];
    let animation;
    const celebrate = () => {
      if (animation?.isActive()) return;
      animation = gsap.timeline();
      ornaments.forEach((el, j) => {
        const motion = el.dataset.motion;
        const at = (j % 5) * .055;
        gsap.set(el, { transformOrigin: '50% 50%' });
        if (motion === 'turn') {
          const turn = el.classList.contains('sk-ornament--flower') ? 60 : 90;
          animation.to(el, { rotation: turn, duration: .85, ease: 'power3.out' }, at)
            .set(el, { rotation: 0 }, at + .85);
        } else {
          animation.to(el, {
            rotation: motion === 'sway' ? -12 : 0,
            scale: motion === 'bloom' ? 1.18 : 1.05,
            duration: .32, ease: 'power2.out',
          }, at).to(el, { rotation: 0, scale: 1, duration: .6, ease: 'power3.out' }, at + .32);
        }
      });
    };
    trigger.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') celebrate(); });
    trigger.addEventListener('focusin', celebrate);
    if (logo.closest('.hero__logo')) {
      ornaments.forEach((el) => el.addEventListener('pointerenter', () => {
        if (animation?.isActive()) return;
        gsap.fromTo(el, { scale: 1 }, {
          scale: 1.17, transformOrigin: '50% 50%', duration: .3,
          ease: 'power2.out', yoyo: true, repeat: 1,
        });
      }));
    }
  });
}
