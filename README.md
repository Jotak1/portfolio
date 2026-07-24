# Portafolio — Juan Pablo Ausensi

Sitio personal con **Bun + Astro**: doble vista **Expediente** (resumen GSAP) + **Resonancia** (juego + audio reactivo + View Transitions).

Deploy: [jotak1.github.io/portfolio](https://jotak1.github.io/portfolio/)

## Requisitos

- [Bun](https://bun.sh) ≥ 1.1
- Node ≥ 22 (Astro lo pide)

## Arranque

```bash
bun install
bun run dev
```

Abre `http://localhost:4321/portfolio/` (el `base` apunta a GitHub Pages).

| Ruta | Qué es |
|---|---|
| `/portfolio/` | Launcher (dos vistas) |
| `/portfolio/expediente/` | Resumen + trayectoria con ScrollTrigger |
| `/portfolio/resonancia/` | Juego de sintonía GSAP + Web Audio |

## Scripts

```bash
bun run dev        # Astro dev
bun run build      # salida en apps/web/dist
bun run preview    # preview del build
bun run deploy     # build + gh-pages → rama gh-pages
```

## Estructura

```
portfolio/
├── apps/web/                 # Astro site
│   ├── src/pages/            # index, expediente, resonancia
│   ├── src/scripts/          # motion + boot + page logic
│   ├── src/styles/pages/     # CSS
│   └── src/content/          # profile.ts (CV estructurado)
└── packages/content-schema/  # tipos compartidos
```

## Deploy (mismo repo)

El CRA antiguo quedó en la rama `legacy-cra`. En `main` vive Astro con `base: '/portfolio/'`.

```bash
bun run deploy
```

Publica `apps/web/dist` a la rama `gh-pages` (incluye `.nojekyll`).

## Origen del diseño

Prototipado en Open Design (Expediente + Resonancia + GSAP) y montado aquí para desplegar en el mismo GitHub Pages de siempre.
