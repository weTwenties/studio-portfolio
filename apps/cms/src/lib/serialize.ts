type JsonRecord = Record<string, unknown>;

const toJson = (v: unknown) =>
  v === undefined || v === null || (Array.isArray(v) && v.length === 0) ? null : JSON.stringify(v);

const str = (v: unknown): string => (typeof v === "string" ? v : String(v ?? ""));
const strOrNull = (v: unknown): string | null => (v == null || v === "" ? null : String(v));
const numOrZero = (v: unknown): number => (typeof v === "number" ? v : 0);

export const memberInputToData = (body: JsonRecord) => ({
  slug: str(body.slug),
  sourceLocale: str(body.sourceLocale || "vi"),
  name: str(body.name),
  role: strOrNull(body.role),
  bio: strOrNull(body.bio),
  avatarUrl: strOrNull(body.avatarUrl),
  cvUrl: strOrNull(body.cvUrl),
  socials: toJson(body.socials),
  sortOrder: numOrZero(body.sortOrder),
});

export const projectInputToData = (body: JsonRecord) => ({
  slug: str(body.slug),
  sourceLocale: str(body.sourceLocale || "vi"),
  title: str(body.title),
  summary: strOrNull(body.summary),
  coverUrl: strOrNull(body.coverUrl),
  demoUrl: strOrNull(body.demoUrl),
  tags: toJson(body.tags),
  caseStudy: toJson(body.caseStudy),
  sortOrder: numOrZero(body.sortOrder),
});

export const siteInputToData = (body: JsonRecord) => ({
  sourceLocale: str(body.sourceLocale || "vi"),
  brand: strOrNull(body.brand),
  navLinks: toJson(body.navLinks),
  footerText: strOrNull(body.footerText),
  seoTitle: strOrNull(body.seoTitle),
  seoDescription: strOrNull(body.seoDescription),
  contactEmail: strOrNull(body.contactEmail),
});

type SerializedWithJson = { socials?: string | null; tags?: string | null; caseStudy?: string | null; navLinks?: string | null } & JsonRecord;

export const deserializeMember = (m: SerializedWithJson) => ({
  ...m,
  socials: m.socials ? JSON.parse(m.socials) : [],
});

export const deserializeProject = (p: SerializedWithJson) => ({
  ...p,
  tags: p.tags ? JSON.parse(p.tags) : [],
  caseStudy: p.caseStudy ? JSON.parse(p.caseStudy) : null,
});

export const deserializeSite = (s: SerializedWithJson | null) =>
  s
    ? {
        ...s,
        navLinks: s.navLinks ? JSON.parse(s.navLinks) : [],
      }
    : null;

/** Invalidate translation cache by clearing hash. Call when source content fields change. */
export const invalidateTranslationCache = () => ({ translationHash: null });
