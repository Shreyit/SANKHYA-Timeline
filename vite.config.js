import { defineConfig } from 'vite';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// dist/ is wiped on every build. This guard refuses to build if dist/ holds any
// file the build didn't put there (i.e. not under assets/, not one of the HTML
// entries, and not a copy of something in public/) — so hand-placed files such
// as photos are never silently deleted. Put assets in public/ instead.
function protectDist() {
  const walk = (dir) => readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
  return {
    name: 'protect-dist',
    apply: 'build',
    buildStart() {
      if (!existsSync('dist')) return;
      const stray = walk('dist').map((p) => relative('dist', p)).filter((f) =>
        !f.startsWith('assets/') && !/^[^/]+\.html$/.test(f) && !existsSync(join('public', f)));
      if (stray.length) {
        this.error(`dist/ contains files the build did not create and would delete:\n  ${stray.join('\n  ')}\n` +
          'Move them into public/ (e.g. public/img/recap/) and build again.');
      }
    },
  };
}

export default defineConfig({
  plugins: [protectDist()],
  build: {
    // three.js ships as one ~570 kB chunk; it is lazy-loaded at idle (mascot/), never on first paint
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        main: 'index.html',
        recap: 'recap.html',
      },
    },
  },
});
