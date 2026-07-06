import type { PortfolioDirectory, PortfolioMember, PortfolioProject } from "@/types/portfolio";

export function projectsForMember(
  directory: PortfolioDirectory,
  memberId: string,
): Array<PortfolioProject & { contributionRole: string }> {
  return directory.projectMembers
    .filter((link) => link.memberId === memberId)
    .map((link) => {
      const project = directory.projects.find((item) => item.id === link.projectId);
      if (!project) return null;
      return { ...project, contributionRole: link.contributionRole };
    })
    .filter((item): item is PortfolioProject & { contributionRole: string } => item !== null);
}

export function membersForProject(
  directory: PortfolioDirectory,
  projectId: string,
): Array<PortfolioMember & { contributionRole: string }> {
  return directory.projectMembers
    .filter((link) => link.projectId === projectId)
    .map((link) => {
      const member = directory.members.find((item) => item.id === link.memberId);
      if (!member) return null;
      return { ...member, contributionRole: link.contributionRole };
    })
    .filter((item): item is PortfolioMember & { contributionRole: string } => item !== null);
}
