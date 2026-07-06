import { createHash } from "node:crypto";
import {
  translateBilingual as translateBilingualOpenRouter,
} from "../translate-openrouter.mjs";

export type Locale = "vi" | "en";

export async function translateBilingual<T extends Record<string, unknown>>(
  source: T,
  sourceLocale: Locale,
): Promise<{ vi: T; en: T }> {
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY ?? process.env.OPENROUTER);
  if (!hasOpenRouter) {
    const mirrored = structuredClone(source);
    return { vi: mirrored, en: mirrored };
  }

  return translateBilingualOpenRouter(source, sourceLocale) as Promise<{
    vi: T;
    en: T;
  }>;
}

export async function translateFields<T extends Record<string, unknown>>(
  source: T,
  fromLocale: Locale,
  toLocale: Locale,
): Promise<T> {
  if (fromLocale === toLocale) return source;
  const { vi, en } = await translateBilingual(source, fromLocale);
  return (toLocale === "vi" ? vi : en) as T;
}

export function hashContent(obj: unknown): string {
  return createHash("sha256").update(JSON.stringify(obj)).digest("hex").slice(0, 16);
}

export const otherLocale = (l: Locale): Locale => (l === "vi" ? "en" : "vi");
