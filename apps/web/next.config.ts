import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

function getStorageBase(): string {
  const raw = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";
  if (!raw || raw === ".") return "http://localhost:9000/we-twenties";
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw.replace(/\/+$/, "");
  }
  return "http://localhost:9000/we-twenties";
}

const storageBase = getStorageBase();

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  transpilePackages: ["@wetwenties/db"],
  async rewrites() {
    return [
      {
        source: "/isometric/:path*",
        destination: `${storageBase}/isometric/:path*`,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
