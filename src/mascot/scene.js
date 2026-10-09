// Sanku — the Sankhya '27 mascot, built procedurally in three.js (no model
// file to download). A marigold bean with indigo eyes, a crimson sprout
// and a small indigo ornament in orbit.
//
// API: createSanku(canvas, { reduce }) → { lookAt(x, y), react(mood), hop(),
//      squash(), setActive(bool), dispose() }
import * as THREE from 'three';
import { gsap } from '../core/gsap.js';

const C = {
  body: 0xFFD129, belly: 0xF4E7C3, socket: 0x25152E, iris: 0x3B1CF4, pupil: 0x0B0B0B,
  leaf: 0xE61E25, leafDeep: 0x8B0F14, stem: 0x8B0F14, planet: 0x3B1CF4, ring: 0xF4E7C3,
  cheek: 0xE61E25,
};

export function createSanku(canvas, { reduce = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 0.35, 7.4);
  camera.lookAt(0, 0.25, 0);

  // ── light: warm key, maroon ground bounce, indigo rim
  scene.add(new THREE.HemisphereLight(0xFFF3D6, 0x431519, 1.15));
  const key = new THREE.DirectionalLight(0xFFE7B8, 2.1); key.position.set(-3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x8673FF, 2.4); rim.position.set(3, 2, -4); scene.add(rim);

  const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0, ...o });

  // ── rig: root (bob/hop) → body (squash) → head features (look)
  const root = new THREE.Group(); scene.add(root);
  const bodyG = new THREE.Group(); root.add(bodyG);

  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), mat(C.body, { roughness: 0.48 }));
  body.scale.set(1, 1.1, 0.94);
  bodyG.add(body);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 48), mat(C.belly, { roughness: 0.6 }));
  belly.scale.set(0.46, 0.34, 0.2); belly.position.set(0, -0.72, 0.62);
  bodyG.add(belly);

  const face = new THREE.Group(); bodyG.add(face);   // turns toward the pointer

  // eyes: dark almond socket, green iris with a slit pupil + catchlight (the logo's eye)
  const eyes = [-1, 1].map((side) => {
    const g = new THREE.Group();
    g.position.set(side * 0.36, 0.2, 0.86);
    g.rotation.y = side * 0.32;
    g.rotation.z = side * -0.12;
    const socket = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32), mat(C.socket, { roughness: 0.3 }));
    socket.scale.set(1.15, 0.78, 0.35);
    const irisG = new THREE.Group(); irisG.position.z = 0.085;
    const iris = new THREE.Mesh(new THREE.CircleGeometry(0.15, 40), mat(C.iris, { emissive: C.iris, emissiveIntensity: 0.35, roughness: 0.25 }));
    const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.11, 32), mat(C.pupil, { roughness: 0.2 }));
    pupil.scale.set(0.28, 1, 1); pupil.position.z = 0.002;
    const glint = new THREE.Mesh(new THREE.CircleGeometry(0.035, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    glint.position.set(-0.06, 0.06, 0.004);
    irisG.add(iris, pupil, glint);
    g.add(socket, irisG);
    face.add(g);
    return { g, socket, irisG };
  });

  // cheeks
  [-1, 1].forEach((side) => {
    const m = new THREE.Mesh(new THREE.CircleGeometry(0.11, 24), new THREE.MeshBasicMaterial({ color: C.cheek, transparent: true, opacity: 0.45, depthWrite: false }));
    m.position.set(side * 0.62, -0.08, 0.76); m.rotation.y = side * 0.62; m.scale.set(1.3, 0.8, 1);
    face.add(m);
  });

  // little smile
  const smileCurve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-0.12, -0.13, 0.955), new THREE.Vector3(0, -0.22, 0.985), new THREE.Vector3(0.12, -0.13, 0.955));
  const smile = new THREE.Mesh(new THREE.TubeGeometry(smileCurve, 20, 0.022, 8), mat(C.socket));
  face.add(smile);

  // sprout: curved stem + two leaves (extruded bezier shape, bevelled)
  const sprout = new THREE.Group(); sprout.position.set(0.04, 1.02, 0); bodyG.add(sprout);
  const stemCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, -0.15, 0), new THREE.Vector3(0.02, 0.18, 0), new THREE.Vector3(-0.04, 0.42, 0)]);
  sprout.add(new THREE.Mesh(new THREE.TubeGeometry(stemCurve, 24, 0.045, 10), mat(C.stem)));
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.bezierCurveTo(0.18, 0.1, 0.36, 0.22, 0.58, 0.06);
  leafShape.bezierCurveTo(0.38, -0.16, 0.16, -0.12, 0, 0);
  const leafGeo = new THREE.ExtrudeGeometry(leafShape, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 3, curveSegments: 24 });
  leafGeo.translate(0, 0, -0.02);
  const leaves = [
    { side: 1, tilt: 0.55, color: C.leaf }, { side: -1, tilt: 0.75, color: C.leafDeep },
  ].map(({ side, tilt, color }) => {
    const pivot = new THREE.Group(); pivot.position.set(-0.04, 0.42, 0);
    const leaf = new THREE.Mesh(leafGeo, mat(color, { roughness: 0.35, side: THREE.DoubleSide }));
    leaf.scale.set(side, 1, 1);
    pivot.rotation.z = side * tilt; pivot.userData.base = side * tilt;
    pivot.add(leaf); sprout.add(pivot);
    return pivot;
  });

  // orbiting planet + faint ring (the logo's comet motif)
  const orbit = new THREE.Group(); orbit.rotation.set(1.2, 0, -0.35); root.add(orbit);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.008, 6, 120), new THREE.MeshBasicMaterial({ color: C.ring, transparent: true, opacity: 0.35 }));
  orbit.add(ring);
  const planet = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 24), mat(C.planet, { emissive: C.planet, emissiveIntensity: 0.4, roughness: 0.3 }));
  orbit.add(planet);

  // soft contact shadow
  const sh = document.createElement('canvas'); sh.width = sh.height = 128;
  const sx = sh.getContext('2d'); const gr = sx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(0,0,0,0.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  sx.fillStyle = gr; sx.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.7), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sh), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.45; scene.add(shadow);

  // ── state
  const look = { x: 0, y: 0 };          // target, -1..1
  const cur = { x: 0, y: 0 };
  const motion = { hop: 0, squash: 0, spin: 0, lean: 0, flutter: 0 };
  let active = true, raf = 0, t0 = performance.now(), nextBlink = 2;

  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height; camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(() => { resize(); if (reduce) render(0); });
  ro.observe(canvas);

  const blink = () => eyes.forEach(({ socket, irisG }) => {
    gsap.timeline()
      .to([socket.scale, irisG.scale], { y: 0.08, duration: 0.09, ease: 'power2.in' })
      .to(socket.scale, { y: 0.78, duration: 0.16, ease: 'power3.out' })
      .to(irisG.scale, { y: 1, duration: 0.16, ease: 'power3.out' }, '<');
  });

  function render(t) {
    // smooth follow of the pointer
    cur.x += (look.x - cur.x) * 0.08; cur.y += (look.y - cur.y) * 0.08;
    face.rotation.y = cur.x * 0.35; face.rotation.x = -cur.y * 0.2;
    bodyG.rotation.y = cur.x * 0.18 + motion.spin;
    bodyG.rotation.z = -motion.lean;
    eyes.forEach(({ irisG }) => irisG.position.set(cur.x * 0.06, cur.y * 0.04, 0.085));

    const bob = reduce ? 0 : Math.sin(t * 1.6) * 0.07;
    const breathe = reduce ? 0 : Math.sin(t * 2.2) * 0.015;
    root.position.y = bob + motion.hop;
    const sq = motion.squash;
    bodyG.scale.set(1 + sq + breathe, 1 - sq * 1.1 - breathe, 1 + sq);
    shadow.scale.setScalar(1 - (bob + motion.hop) * 0.6);
    shadow.material.opacity = 0.9 - motion.hop * 0.8;

    leaves.forEach((p, i) => { p.rotation.z = p.userData.base + (reduce ? 0 : Math.sin(t * 2.4 + i * 1.3) * 0.08) + motion.flutter * (i ? -1 : 1); });
    const a = reduce ? 2.2 : t * 0.9;
    planet.position.set(Math.cos(a) * 1.55, Math.sin(a) * 1.55, 0);

    renderer.render(scene, camera);
  }

  function loop(now) {
    const t = (now - t0) / 1000;
    if (t > nextBlink) { blink(); nextBlink = t + 2.4 + Math.random() * 3.6; }
    render(t);
    raf = active ? requestAnimationFrame(loop) : 0;
  }
  // reduced motion: no loop — re-render only when something changes
  const kick = () => { if (reduce) requestAnimationFrame(() => render(0)); };
  if (reduce) render(0); else raf = requestAnimationFrame(loop);

  return {
    lookAt(x, y) { look.x = Math.max(-1, Math.min(1, x)); look.y = Math.max(-1, Math.min(1, y)); if (reduce) { cur.x = look.x; cur.y = look.y; kick(); } },
    lean(v) { if (!reduce) gsap.to(motion, { lean: Math.max(-0.25, Math.min(0.25, v)), duration: 0.4, ease: 'power2.out', overwrite: 'auto' }); },
    hop() {
      if (reduce) return;
      gsap.timeline()
        .to(motion, { squash: 0.12, duration: 0.12, ease: 'power2.in' })
        .to(motion, { squash: -0.08, hop: 0.45, duration: 0.28, ease: 'power2.out' })
        .to(motion, { squash: 0.08, hop: 0, duration: 0.3, ease: 'power2.in' })
        .to(motion, { squash: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
      gsap.fromTo(motion, { flutter: 0.35 }, { flutter: 0, duration: 1.1, ease: 'elastic.out(1, 0.3)' });
    },
    spin() {
      if (reduce) return;
      gsap.fromTo(motion, { spin: 0 }, { spin: Math.PI * 2, duration: 0.9, ease: 'power3.inOut', onComplete: () => { motion.spin = 0; } });
      this.hop();
    },
    squash(on) { if (!reduce) gsap.to(motion, { squash: on ? 0.06 : 0, duration: 0.35, ease: on ? 'power2.out' : 'elastic.out(1, 0.4)' }); },
    react(mood) {
      if (mood === 'excited') this.spin();
      else this.hop();
      if (mood === 'proud') gsap.fromTo(eyes.map((e) => e.irisG.scale), { x: 1, y: 1 }, { x: 1.25, y: 1.25, duration: 0.25, yoyo: true, repeat: 1 });
      blink();
    },
    setActive(on) {
      active = on;
      if (on && !raf && !reduce) { t0 = performance.now() - 1000; raf = requestAnimationFrame(loop); }
    },
    dispose() {
      active = false; cancelAnimationFrame(raf); ro.disconnect();
      scene.traverse((o) => { o.geometry?.dispose(); o.material?.map?.dispose(); o.material?.dispose(); });
      renderer.dispose();
    },
  };
}
