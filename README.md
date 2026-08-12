# MP4/6 WebGL Study

A focused frontend study built with **Next.js**, **React**, **TypeScript** and **Three.js**, centered on an interactive 3D model of the McLaren MP4/6.

The project intentionally keeps a small scope and concentrates on code quality, real-time 3D rendering and clear separation of responsibilities.

## Live Demo

https://gabrieldamasceno38.github.io/mp4-6-webgl-study/

### Drive

A minimal free-drive experience in an open white space. There are no laps, objectives or game systems; the focus is direct interaction with the car.

### Studio

An orbital 3D viewer for inspecting the model with mouse rotation and zoom.

## Tech stack

- Next.js
- React
- TypeScript
- Three.js
- WebGL
- CSS Modules
- GitHub Actions
- GitHub Pages

This repository contains **frontend code only**. There is no backend, database or authentication layer.

The workflow automatically adapts the base path to the repository name, so the project can also be renamed without hardcoding a deployment path in the source code.

## Drive controls

| Key | Action |
| --- | --- |
| `W` / `↑` | Accelerate |
| `S` / `↓` | Brake / reverse |
| `A` / `←` | Steer left |
| `D` / `→` | Steer right |
| `R` | Reset position |

## Project structure

```text
src/
├── app/                    # Next.js routes and global styles
├── components/             # Shared interface components
├── content/                # Static editorial content
├── features/
│   ├── car3d/              # GLB loading and wheel animation
│   ├── drive/              # Keyboard input and driving behavior
│   ├── home/               # Landing page and home 3D scene
│   └── studio/             # Orbit-based 3D viewer
└── lib/three/              # Generic Three.js utilities
```

More details are available in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Running locally

### Requirements

- Node.js 20.9 or newer
- npm

### Install

```bash
npm install
```

### Development server

```bash
npm run dev
```

Open `http://localhost:3000`.

On Windows, if PowerShell blocks `npm.ps1`, use:

```cmd
npm.cmd install
npm.cmd run dev
```

## Quality checks

```bash
npm run typecheck
npm run build
```

`npm run build` creates a static export in the `out/` directory because the project is configured with Next.js `output: "export"`.

## GitHub Pages deployment

Deployment is defined in:

```text
.github/workflows/deploy-pages.yml
```

On every push to `main`, GitHub Actions:

1. installs the dependencies;
2. runs the TypeScript type check;
3. builds the static Next.js export;
4. uploads the `out/` directory as a Pages artifact;
5. deploys the artifact to GitHub Pages.

The only repository-side setup required is selecting **GitHub Actions** as the Pages source under **Settings → Pages**.

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the full deployment notes.

## 3D model integration

The model is loaded from:

```text
public/models/mclaren_mp46.glb
```

Asset-specific node names and wheel mappings are isolated in `src/features/car3d/car.config.ts`. This prevents model-specific details from leaking into the rest of the application.

See [`docs/3D_MODEL.md`](docs/3D_MODEL.md) for implementation details.

## Historical context

The page copy references the 1991 McLaren MP4/6 and Ayrton Senna's championship season. Historical information was checked against official McLaren Racing and Formula 1 sources:

- McLaren Racing Heritage — MP4/6
- Formula 1 — 1991 race results
- Formula 1 — Ayrton Senna Hall of Fame profile

## Asset notice

The software source code and the 3D model are separate project assets. Review [`ASSET_NOTICE.md`](ASSET_NOTICE.md) before redistributing or relicensing the 3D model.

## Disclaimer

This is an independent educational and portfolio project. It is not affiliated with, endorsed by, or sponsored by McLaren Racing, Honda, Formula 1, or the Ayrton Senna brand and related entities.
