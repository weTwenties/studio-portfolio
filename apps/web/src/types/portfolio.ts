export type PortfolioMember = {
  id: string;
  slug: string;
  name: string;
  role: string;
  avatar: string;
  avatarUrl: string | null;
  bio: string;
  skills: string[];
  cvUrl: string | null;
};

export type PortfolioProject = {
  id: string;
  slug: string;
  title: string;
  category: string;
  coverUrl: string | null;
  description: string;
  problem: string;
  solution: string;
  result: string;
  demoLink: string | null;
};

export type ProjectMemberLink = {
  projectId: string;
  memberId: string;
  contributionRole: string;
};

export type PortfolioDirectory = {
  members: PortfolioMember[];
  projects: PortfolioProject[];
  projectMembers: ProjectMemberLink[];
};
