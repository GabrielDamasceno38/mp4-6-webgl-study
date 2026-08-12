# Architecture

The project separates the React interface, driving behavior and Three.js infrastructure into focused modules.

## Application flow

```text
Next.js route
    ↓
React feature component
    ↓
Three.js scene
    ↓
GLB model / input controller
    ↓
WebGL renderer
```

## `src/app/`

Contains App Router routes, metadata and global styles. Route files remain intentionally small and delegate behavior to feature components.

## `src/features/home/`

Owns the landing page presentation and its lightweight 3D scene. Editorial content is kept outside the UI components in `src/content/siteContent.ts`.

## `src/features/studio/`

Builds the interactive model viewer. `OrbitControls` is isolated to this feature because camera orbit behavior is specific to Studio mode.

## `src/features/drive/`

Driving logic is kept outside the React component.

- `KeyboardInput` encapsulates keyboard events and exposes a simple input state.
- `DriveController` owns speed, steering, position and wheel animation state.
- `updateChaseCamera` isolates camera-follow behavior.
- `drive.config.ts` centralizes tuning constants and avoids scattered magic numbers.

## `src/features/car3d/`

Contains everything that depends on the internal structure of the GLB asset.

- `car.config.ts` defines the model URL, target scale and wheel node mappings.
- `loadMcLarenModel.ts` loads and normalizes the model.
- `wheelRig.ts` applies steering and wheel rotation while keeping asset-specific details contained.

## `src/lib/three/`

Contains reusable Three.js helpers that do not know anything about the MP4/6 or driving rules:

- renderer creation;
- canvas resize handling;
- floor creation;
- geometry, material and texture disposal.

## Deployment boundary

The application is fully static. `next.config.ts` enables `output: "export"`, allowing GitHub Pages to host the generated HTML, CSS, JavaScript and WebGL assets without a Node.js server.

The GitHub Pages base path is determined at build time from GitHub Actions environment variables. This keeps local development at `/` while allowing project pages to run under `/<repository-name>/`.
