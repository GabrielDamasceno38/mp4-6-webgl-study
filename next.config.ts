import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER ?? "";
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const isUserPage = repositoryName === `${repositoryOwner}.github.io`;

const basePath = isGitHubActions && !isUserPage ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
