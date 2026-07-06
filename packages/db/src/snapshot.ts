import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "./client";
import { getPublishedDataDir } from "./publishedDataDir";
import { hashContent, otherLocale, translateBilingual, type Locale } from "./translate";

export type I18nString = { vi: string; en: string };

const safe = (v: unknown) => (typeof v === "string" ? v : "");

const buildI18nField = (sourceLocale: Locale, sourceValue: string, translatedValue: string): I18nString =>
  sourceLocale === "vi"
    ? { vi: sourceValue, en: translatedValue }
    : { vi: translatedValue, en: sourceValue };

type CachedTranslations = Record<string, Record<string, unknown>>;

async function getOrTranslate<T extends Record<string, unknown>>(
  current: T,
  sourceLocale: Locale,
  cachedHash: string | null,
  cachedTranslations: string | null,
): Promise<{ translations: CachedTranslations; hash: string; changed: boolean }> {
  const hash = hashContent(current);

  let cache: CachedTranslations | null = null;
  try {
    cache = cachedTranslations ? JSON.parse(cachedTranslations) : null;
  } catch {
    cache = null;
  }

  if (cachedHash === hash && cache?.vi && cache?.en) {
    return { translations: cache, hash, changed: false };
  }

  const { vi, en } = await translateBilingual(current, sourceLocale);
  return { translations: { vi, en }, hash, changed: true };
}

async function expandMember(member: any) {
  const sourceLocale = (member.sourceLocale ?? "vi") as Locale;
  const fields = { role: safe(member.role), bio: safe(member.bio) };

  const { translations, hash, changed } = await getOrTranslate(
    fields,
    sourceLocale,
    member.translationHash,
    member.translations,
  );

  if (changed) {
    await prisma.member.update({
      where: { id: member.id },
      data: { translations: JSON.stringify(translations), translationHash: hash },
    });
  }

  const target = otherLocale(sourceLocale);
  const translated = (translations[target] ?? {}) as Record<string, string>;

  return {
    id: member.id,
    slug: member.slug,
    name: member.name,
    avatarUrl: member.avatarUrl,
    cvUrl: member.cvUrl,
    socials: member.socials ? JSON.parse(member.socials) : [],
    sortOrder: member.sortOrder,
    publishedAt: member.publishedAt,
    role: buildI18nField(sourceLocale, fields.role, safe(translated.role)),
    bio: buildI18nField(sourceLocale, fields.bio, safe(translated.bio)),
    projects: (member.memberProjects ?? []).map((mp: any) => ({
      id: mp.project?.id,
      slug: mp.project?.slug,
    })),
  };
}

async function expandProject(project: any) {
  const sourceLocale = (project.sourceLocale ?? "vi") as Locale;
  const caseStudy = project.caseStudy ? JSON.parse(project.caseStudy) : null;
  const fields = {
    title: safe(project.title),
    summary: safe(project.summary),
    caseStudy: caseStudy ?? {},
  };

  const { translations, hash, changed } = await getOrTranslate(
    fields,
    sourceLocale,
    project.translationHash,
    project.translations,
  );

  if (changed) {
    await prisma.project.update({
      where: { id: project.id },
      data: { translations: JSON.stringify(translations), translationHash: hash },
    });
  }

  const target = otherLocale(sourceLocale);
  const translated = (translations[target] ?? {}) as any;

  return {
    id: project.id,
    slug: project.slug,
    coverUrl: project.coverUrl,
    demoUrl: project.demoUrl,
    tags: project.tags ? JSON.parse(project.tags) : [],
    sortOrder: project.sortOrder,
    publishedAt: project.publishedAt,
    title: buildI18nField(sourceLocale, fields.title, safe(translated.title)),
    summary: buildI18nField(sourceLocale, fields.summary, safe(translated.summary)),
    caseStudy: caseStudy
      ? {
          [sourceLocale]: caseStudy,
          [target]: translated.caseStudy ?? caseStudy,
        }
      : null,
    members: (project.memberProjects ?? []).map((mp: any) => ({
      id: mp.member?.id,
      slug: mp.member?.slug,
      roleLabel: mp.roleLabel,
    })),
  };
}

async function expandSite(site: any) {
  if (!site) return null;
  const sourceLocale = (site.sourceLocale ?? "vi") as Locale;
  const navLinks = site.navLinks ? JSON.parse(site.navLinks) : [];
  const fields = {
    brand: safe(site.brand),
    footerText: safe(site.footerText),
    seoTitle: safe(site.seoTitle),
    seoDescription: safe(site.seoDescription),
    navLinks,
  };

  const { translations, hash, changed } = await getOrTranslate(
    fields,
    sourceLocale,
    site.translationHash,
    site.translations,
  );

  if (changed) {
    await prisma.siteSettings.update({
      where: { id: site.id },
      data: { translations: JSON.stringify(translations), translationHash: hash },
    });
  }

  const target = otherLocale(sourceLocale);
  const translated = (translations[target] ?? {}) as any;

  return {
    contactEmail: site.contactEmail,
    brand: buildI18nField(sourceLocale, fields.brand, safe(translated.brand)),
    footerText: buildI18nField(sourceLocale, fields.footerText, safe(translated.footerText)),
    seoTitle: buildI18nField(sourceLocale, fields.seoTitle, safe(translated.seoTitle)),
    seoDescription: buildI18nField(sourceLocale, fields.seoDescription, safe(translated.seoDescription)),
    navLinks: {
      [sourceLocale]: navLinks,
      [target]: translated.navLinks ?? navLinks,
    },
  };
}

export async function regenerateSnapshot() {
  const dir = getPublishedDataDir();
  await mkdir(dir, { recursive: true });

  const [members, projects, site] = await Promise.all([
    prisma.member.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
      include: { memberProjects: { include: { project: true } } },
    }),
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
      include: { memberProjects: { include: { member: true } } },
    }),
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
  ]);

  const [membersOut, projectsOut, siteOut] = await Promise.all([
    Promise.all(members.map(expandMember)),
    Promise.all(projects.map(expandProject)),
    expandSite(site),
  ]);

  await Promise.all([
    writeFile(path.join(dir, "members.json"), JSON.stringify(membersOut, null, 2)),
    writeFile(path.join(dir, "projects.json"), JSON.stringify(projectsOut, null, 2)),
    writeFile(path.join(dir, "site.json"), JSON.stringify(siteOut, null, 2)),
  ]);

  return { members: membersOut.length, projects: projectsOut.length, site: siteOut !== null };
}
