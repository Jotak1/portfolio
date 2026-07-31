import { defineConfig } from 'astro/config';

// Deploy: https://jotak1.github.io/portfolio/
export default defineConfig({
  site: 'https://jotak1.github.io',
  base: '/portfolio/',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  vite: {
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger'],
    },
  },
});
