import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function resolveDatabaseUrl(): string | undefined {
  const configured = process.env.DATABASE_URL;
  if (!configured?.startsWith("file:")) return configured;

  const configuredPath = configured.slice("file:".length);
  if (path.isAbsolute(configuredPath)) return configured;

  const fromCwd = path.resolve(process.cwd(), configuredPath);
  if (existsSync(fromCwd)) return `file:${fromCwd}`;

  const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const monorepoDb = path.join(repoRoot, "apps/cms/data", path.basename(configuredPath));
  if (existsSync(monorepoDb)) return `file:${monorepoDb}`;

  return configured;
}

const databaseUrl = resolveDatabaseUrl();
if (databaseUrl) {
  process.env.DATABASE_URL = databaseUrl;
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
