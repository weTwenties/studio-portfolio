export type Timeline = { start: string; end: string } | null;

export type CasePoint = { label: string; text: string };

export type ProjectImageDraft = {
  url: string;
  isPrimary?: boolean;
  base64?: string;
  name?: string;
  type?: string;
};

export type ProjectMemberLink = { memberId: string; roleLabel: string | null };

export type ProjectDraft = {
  id: string;
  slug: string;
  sourceLocale: "vi" | "en";
  title: string;
  summary: string | null;
  coverUrl: string | null;
  demoUrl: string | null;
  tags: string[];
  timeline: Timeline;
  caseStudy: {
    kicker?: string;
    problem?: string;
    solution?: string;
    result?: string;
    points?: CasePoint[];
    images?: ProjectImageDraft[];
  } | null;
  memberProjects?: ProjectMemberLink[];
  sortOrder: number;
  status: "DRAFT" | "PUBLISHED";
};
