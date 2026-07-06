"use client";

import Link from "next/link";
import { useEffect } from "react";
import PortfolioAvatar from "@/components/portfolio/PortfolioAvatar";
import type { PortfolioMember, PortfolioProject } from "@/types/portfolio";

type Participant = PortfolioMember & { contributionRole: string };

type Labels = {
  close: string;
  problem: string;
  solution: string;
  result: string;
  openDemo: string;
  disclaimer?: string;
};

type Props = {
  project: PortfolioProject | null;
  participants: Participant[];
  labels: Labels;
  onClose: () => void;
};

export default function ProjectCaseModal({ project, participants, labels, onClose }: Props) {
  useEffect(() => {
    if (!project) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <div
      className={`portfolio-case-modal${project ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolioCaseTitle"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article className="portfolio-glass portfolio-case-panel">
        {project ? (
          <>
            <div className="portfolio-case-top">
              <span className="portfolio-chip">{project.category}</span>
              <button
                className="portfolio-case-close"
                type="button"
                aria-label={labels.close}
                onClick={onClose}
              >
                ×
              </button>
            </div>
            <h2 id="portfolioCaseTitle">{project.title}</h2>
            <p className="portfolio-lead">{project.description}</p>
            <div className="portfolio-case-body">
              <div className="portfolio-case-block">
                <h3>{labels.problem}</h3>
                <p>{project.problem || "—"}</p>
              </div>
              <div className="portfolio-case-block">
                <h3>{labels.solution}</h3>
                <p>{project.solution || "—"}</p>
              </div>
              <div className="portfolio-case-block">
                <h3>{labels.result}</h3>
                <p>{project.result || "—"}</p>
              </div>
            </div>
            <div className="portfolio-participant-list">
              {participants.map((member) => (
                <Link
                  key={member.id}
                  className="portfolio-participant"
                  href={`/team?member=${member.slug}`}
                >
                  <PortfolioAvatar member={member} size="xs" />
                  <span>
                    <strong>{member.name}</strong>
                    <br />
                    <small>{member.contributionRole}</small>
                  </span>
                </Link>
              ))}
            </div>
            {project.demoLink ? (
              <div className="portfolio-participant-list">
                <a className="portfolio-btn" href={project.demoLink} target="_blank" rel="noreferrer">
                  {labels.openDemo}
                </a>
              </div>
            ) : null}
            {labels.disclaimer ? (
              <p className="modal-disclaimer">{labels.disclaimer}</p>
            ) : null}
          </>
        ) : null}
      </article>
    </div>
  );
}
