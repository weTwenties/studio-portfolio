import Link from "next/link";
import PortfolioAvatar from "@/components/portfolio/PortfolioAvatar";
import type { PortfolioMember, PortfolioProject } from "@/types/portfolio";

type JoinedProject = PortfolioProject & { contributionRole: string };

type Labels = {
  bio: string;
  skills: string;
  relatedProjects: string;
  openCv: string;
  viewProjects: string;
};

type Props = {
  member: PortfolioMember;
  joinedProjects: JoinedProject[];
  labels: Labels;
};

export default function MemberDetailPanel({ member, joinedProjects, labels }: Props) {
  return (
    <aside className="portfolio-glass portfolio-detail" aria-live="polite">
      <div className="portfolio-detail-top">
        <PortfolioAvatar member={member} size="sm" />
        <div>
          <h2>{member.name}</h2>
          <p className="portfolio-role">{member.role}</p>
        </div>
      </div>

      {member.bio ? (
        <section className="portfolio-detail-section">
          <h3>{labels.bio}</h3>
          <p className="portfolio-bio">{member.bio}</p>
        </section>
      ) : null}

      {member.skills.length > 0 ? (
        <section className="portfolio-detail-section">
          <h3>{labels.skills}</h3>
          <div className="portfolio-chips">
            {member.skills.map((skill) => (
              <span key={skill} className="portfolio-chip">
                {skill}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section className="portfolio-detail-section">
        <h3>{labels.relatedProjects}</h3>
        <div className="portfolio-project-list">
          {joinedProjects.length === 0 ? (
            <p className="portfolio-bio">—</p>
          ) : (
            joinedProjects.map((project) => (
              <Link
                key={project.id}
                className="portfolio-glass portfolio-project-link"
                href={`/projects?project=${project.slug}`}
              >
                <strong>{project.title}</strong>
                <span>
                  {project.category}
                  {project.contributionRole ? ` / ${project.contributionRole}` : ""}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="portfolio-detail-section portfolio-detail-actions">
        {member.cvUrl ? (
          <a className="portfolio-btn" href={member.cvUrl} target="_blank" rel="noreferrer">
            {labels.openCv}
          </a>
        ) : null}
        <Link className="portfolio-btn is-secondary" href="/projects">
          {labels.viewProjects}
        </Link>
      </section>
    </aside>
  );
}
