import { getPublishedDataDir } from "@wetwenties/db/published-data-dir";
import { readFile } from "node:fs/promises";
import path from "node:path";

export type I18nField = { vi?: string; en?: string };

export type SnapshotCaseStudy = {
  kicker?: string;
  problem?: string;
  solution?: string;
  result?: string;
  points?: { label: string; text: string }[];
  images?: { url: string }[];
};

export type SnapshotMember = {
  id: string;
  slug: string;
  name: string;
  avatarUrl?: string | null;
  cvUrl?: string | null;
  socials?: unknown[];
  sortOrder?: number;
  publishedAt?: string;
  role?: I18nField;
  bio?: I18nField;
  projects?: { id: string; slug: string }[];
};

export type SnapshotProjectMember = {
  id: string;
  slug: string;
  roleLabel: string | null;
};

export type SnapshotProject = {
  id: string;
  slug: string;
  coverUrl?: string | null;
  demoUrl?: string | null;
  tags?: string[];
  sortOrder?: number;
  publishedAt?: string;
  title?: I18nField;
  summary?: I18nField;
  caseStudy?: { vi?: SnapshotCaseStudy; en?: SnapshotCaseStudy } | null;
  members?: SnapshotProjectMember[];
};

export type SnapshotSite = {
  seoTitle?: I18nField;
  seoDescription?: I18nField;
  contactEmail?: string;
  brand?: I18nField;
  footerText?: I18nField;
};

const dataDir = getPublishedDataDir();

async function readJson<T>(name: string, fallback: T): Promise<T> {
  try {
    const file = path.join(dataDir, name);
    const raw = await readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function readMembersSnapshot() {
  return readJson<SnapshotMember[]>("members.json", []);
}

export async function readProjectsSnapshot() {
  return readJson<SnapshotProject[]>("projects.json", []);
}

export async function readSiteSnapshot() {
  return readJson<SnapshotSite | null>("site.json", null);
}

export function pickLocale(field: I18nField | null | undefined, locale: "vi" | "en") {
  if (!field) return "";
  return field[locale] ?? field.vi ?? field.en ?? "";
}
