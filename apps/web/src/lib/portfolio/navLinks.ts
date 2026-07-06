export type PortfolioNavLabels = {
  home: string;
  team: string;
  projects: string;
  navAria: string;
};

export function buildPortfolioNavLinks(
  labels: Pick<PortfolioNavLabels, "home" | "team" | "projects">,
) {
  return [
    { href: "/", label: labels.home },
    { href: "/team", label: labels.team },
    { href: "/projects", label: labels.projects },
  ];
}
