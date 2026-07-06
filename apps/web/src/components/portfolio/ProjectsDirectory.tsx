"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProjectCard from "@/components/portfolio/ProjectCard";
import ProjectCaseModal from "@/components/portfolio/ProjectCaseModal";
import { membersForProject } from "@/lib/portfolio/relations";
import type { PortfolioDirectory, PortfolioProject } from "@/types/portfolio";

type Labels = {
  viewCase: string;
  modal: {
    close: string;
    problem: string;
    solution: string;
    result: string;
    openDemo: string;
  };
};

type Props = {
  directory: PortfolioDirectory;
  labels: Labels;
};

export default function ProjectsDirectory({ directory, labels }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectFromQuery = searchParams.get("project");

  const resolveProject = useCallback(
    (slugOrId: string | null): PortfolioProject | null => {
      if (!slugOrId) return null;
      return (
        directory.projects.find((p) => p.slug === slugOrId) ??
        directory.projects.find((p) => p.id === slugOrId) ??
        null
      );
    },
    [directory.projects],
  );

  const activeProject = resolveProject(projectFromQuery);

  const openProject = (project: PortfolioProject) => {
    router.replace(`/projects?project=${project.slug}`, { scroll: false });
  };

  const closeProject = () => {
    router.replace("/projects", { scroll: false });
  };

  const participants = useMemo(
    () => (activeProject ? membersForProject(directory, activeProject.id) : []),
    [activeProject, directory],
  );

  return (
    <>
      <section className="portfolio-container portfolio-project-grid" aria-label="Project cards">
        {directory.projects.length === 0 ? (
          <p className="portfolio-bio">No projects yet.</p>
        ) : (
          directory.projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              participants={membersForProject(directory, project.id)}
              viewCaseLabel={labels.viewCase}
              onOpen={() => openProject(project)}
            />
          ))
        )}
      </section>

      <ProjectCaseModal
        project={activeProject}
        participants={participants}
        labels={labels.modal}
        onClose={closeProject}
      />
    </>
  );
}
