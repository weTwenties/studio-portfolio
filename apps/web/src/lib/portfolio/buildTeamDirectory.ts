import { buildPortfolioDirectory } from "@/lib/portfolio/buildDirectory";
import type { SnapshotProject } from "@/lib/snapshot";
import type { PortfolioDirectory, PortfolioMember } from "@/types/portfolio";

export type TeamSquadMemberMessage = {
  id: string;
  slug: string;
  initial: string;
  name: string;
  role: string;
  bio: string;
};

const mapSquadMember = (member: TeamSquadMemberMessage): PortfolioMember => ({
  id: member.id,
  slug: member.slug,
  name: member.name,
  role: member.role,
  avatar: member.initial,
  avatarUrl: null,
  bio: member.bio,
  skills: [],
  cvUrl: null,
});

/** Trang /team: squad cố định từ i18n; projects/links từ snapshot hoặc mock. */
export function buildTeamPageDirectory(
  squad: TeamSquadMemberMessage[],
  projects: SnapshotProject[],
  locale: "vi" | "en",
): PortfolioDirectory {
  const base = buildPortfolioDirectory([], projects, locale);
  const squadIds = new Set(squad.map((m) => m.id));

  return {
    members: squad.map(mapSquadMember),
    projects: base.projects,
    projectMembers: base.projectMembers.filter(
      (link) => squadIds.has(link.memberId) && base.projects.some((p) => p.id === link.projectId),
    ),
  };
}
