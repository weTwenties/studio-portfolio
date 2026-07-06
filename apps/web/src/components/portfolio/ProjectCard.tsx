import Link from "next/link";
import PortfolioAvatar from "@/components/portfolio/PortfolioAvatar";
import type { PortfolioMember, PortfolioProject } from "@/types/portfolio";

type Participant = PortfolioMember & { contributionRole: string };

type Props = {
  project: PortfolioProject;
  participants: Participant[];
  viewCaseLabel: string;
  onOpen: () => void;
};

export default function ProjectCard({ project, participants, viewCaseLabel, onOpen }: Props) {
  return (
    <article
      className="portfolio-glass portfolio-project-card"
      role="button"
      tabIndex={0}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a")) return;
        onOpen();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <div className={`portfolio-cover${project.coverUrl ? " has-image" : ""}`}>
        {project.coverUrl ? <img src={project.coverUrl} alt="" /> : null}
        <span>{project.category}</span>
      </div>
      <span className="portfolio-chip">{project.category}</span>
      <h2>{project.title}</h2>
      <p className="portfolio-bio">{project.description}</p>
      <div className="portfolio-avatar-row" aria-label="Participating members">
        {participants.map((member) => (
          <Link
            key={member.id}
            href={`/team?member=${member.slug}`}
            title={member.name}
            aria-label={member.name}
            onClick={(event) => event.stopPropagation()}
          >
            <PortfolioAvatar member={member} size="xs" />
          </Link>
        ))}
      </div>
      <span className="portfolio-btn is-secondary">{viewCaseLabel}</span>
    </article>
  );
}
