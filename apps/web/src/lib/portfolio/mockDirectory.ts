import type { PortfolioDirectory } from "@/types/portfolio";

/** Empty fallback when no published snapshot exists — canonical demo data lives in `data/*.json`. */
export const emptyPortfolioDirectory: PortfolioDirectory = {
  members: [],
  projects: [],
  projectMembers: [],
};
