import { pickLocale, type SnapshotMember, type SnapshotProject } from "@/lib/snapshot";
import { emptyPortfolioDirectory } from "@/lib/portfolio/mockDirectory";
import type { PortfolioDirectory, PortfolioMember, PortfolioProject, ProjectMemberLink } from "@/types/portfolio";

const avatarInitial = (name: string) => {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
};

const mapMember = (member: SnapshotMember, locale: "vi" | "en"): PortfolioMember => ({
  id: member.id,
  slug: member.slug,
  name: member.name,
  role: pickLocale(member.role, locale) || "—",
  avatar: avatarInitial(member.name),
  avatarUrl: member.avatarUrl ?? null,
  bio: pickLocale(member.bio, locale),
  skills: [],
  cvUrl: member.cvUrl ?? null,
});

const mapProject = (project: SnapshotProject, locale: "vi" | "en"): PortfolioProject => {
  const caseStudy = project.caseStudy?.[locale] ?? project.caseStudy?.vi ?? project.caseStudy?.en;
  const tags = project.tags ?? [];
  const category = tags[0] ?? caseStudy?.kicker ?? "Project";

  return {
    id: project.id,
    slug: project.slug,
    title: pickLocale(project.title, locale) || project.slug,
    category,
    coverUrl: project.coverUrl ?? null,
    description: pickLocale(project.summary, locale),
    problem: caseStudy?.problem ?? "",
    solution: caseStudy?.solution ?? "",
    result: caseStudy?.result ?? "",
    demoLink: project.demoUrl ?? null,
  };
};

const buildLinksFromSnapshots = (
  members: SnapshotMember[],
  projects: SnapshotProject[],
): ProjectMemberLink[] => {
  const links: ProjectMemberLink[] = [];

  for (const project of projects) {
    for (const entry of project.members ?? []) {
      links.push({
        projectId: project.id,
        memberId: entry.id,
        contributionRole: entry.roleLabel ?? "",
      });
    }
  }

  for (const member of members) {
    for (const ref of member.projects ?? []) {
      const exists = links.some(
        (link) => link.projectId === ref.id && link.memberId === member.id,
      );
      if (!exists) {
        links.push({
          projectId: ref.id,
          memberId: member.id,
          contributionRole: "",
        });
      }
    }
  }

  return links;
};

export function buildPortfolioDirectory(
  members: SnapshotMember[],
  projects: SnapshotProject[],
  locale: "vi" | "en",
): PortfolioDirectory {
  if (members.length === 0 && projects.length === 0) {
    return emptyPortfolioDirectory;
  }

  return {
    members: members.map((member) => mapMember(member, locale)),
    projects: projects.map((project) => mapProject(project, locale)),
    projectMembers: buildLinksFromSnapshots(members, projects),
  };
}
