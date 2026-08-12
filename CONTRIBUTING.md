# Contributing

This is a deliberately small frontend study. Changes should preserve the project's limited scope and separation of responsibilities.

Before opening a pull request, run:

```bash
npm run typecheck
npm run build
```

Guidelines:

- keep changes small and focused;
- keep GLB-specific code inside `src/features/car3d`;
- keep generic Three.js helpers inside `src/lib/three`;
- keep driving behavior outside React presentation components;
- avoid adding application complexity without a clear learning or product reason.
