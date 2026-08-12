# 3D model integration

The project loads `public/models/mclaren_mp46.glb` through Three.js `GLTFLoader`.

## Model normalization

When the file is loaded, the application:

1. calculates the model bounding box;
2. scales it to a reference vehicle length;
3. centers it on the X and Z axes;
4. places the model base at Y = 0;
5. enables mesh shadows.

## Wheel animation

The GLB has a more complex hierarchy than four objects simply named `wheel`. The node mappings used for animation are centralized in:

```text
src/features/car3d/car.config.ts
```

The wheel rig applies:

- Y-axis rotation for front-wheel steering;
- X-axis rotation for rolling animation.

Keeping these mappings in one file makes the rest of the application independent from the model's internal node names.

## GitHub Pages asset path

Files inside `public/` are normally referenced from the site root. GitHub project pages are hosted under a repository subpath, so the model URL is prefixed with `NEXT_PUBLIC_BASE_PATH` during the GitHub Actions build.

Locally:

```text
/models/mclaren_mp46.glb
```

On a project page:

```text
/mp4-6-webgl-study/models/mclaren_mp46.glb
```

The repository name is resolved automatically at build time.

## Replacing the model

If a different GLB is introduced, review `car.config.ts` first. Wheel node names, reference scale and model-specific assumptions may need to be updated before Drive mode can animate the new asset correctly.
