# GitHub Pages deployment

This project is configured for static deployment to GitHub Pages.

## Why static export

GitHub Pages hosts static files. Next.js generates those files when `output: "export"` is enabled in `next.config.ts`.

Running:

```bash
npm run build
```

creates:

```text
out/
```

The `out/` directory contains the generated HTML, CSS, JavaScript and static assets used by the site.

## Repository configuration

After uploading the repository to GitHub:

1. open **Settings**;
2. open **Pages** under **Code and automation**;
3. set **Source** to **GitHub Actions**.

No `gh-pages` branch is required.

## Deployment workflow

`.github/workflows/deploy-pages.yml` runs whenever `main` receives a push.

The workflow:

1. checks out the repository;
2. installs Node.js 22;
3. installs npm dependencies;
4. runs `npm run typecheck`;
5. runs `npm run build`;
6. uploads `out/` as the GitHub Pages artifact;
7. deploys the artifact.

## Base path

A project page is usually served from:

```text
https://USERNAME.github.io/REPOSITORY/
```

The Next.js configuration reads `GITHUB_REPOSITORY` during the Actions build and sets the correct `basePath` automatically.

If the repository itself is named `USERNAME.github.io`, the configuration detects a user/organization page and keeps the base path empty.

## Verifying a deployment

Open the repository's **Actions** tab and select **Deploy to GitHub Pages**.

A successful run shows both jobs as completed:

```text
build   ✓
deploy  ✓
```

The deployment URL is also available from **Settings → Pages** and from the deployment environment shown by GitHub Actions.
