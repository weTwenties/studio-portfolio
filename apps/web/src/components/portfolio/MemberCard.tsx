import PortfolioAvatar from "@/components/portfolio/PortfolioAvatar";
import type { PortfolioMember, PortfolioProject } from "@/types/portfolio";

type Props = {
  member: PortfolioMember;
  joinedProjects: PortfolioProject[];
  isSelected: boolean;
  joinedLabel: string;
  onSelect: () => void;
};

export default function MemberCard({
  member,
  joinedProjects,
  isSelected,
  joinedLabel,
  onSelect,
}: Props) {
  return (
    <button
      type="button"
      className={`portfolio-glass portfolio-member-card${isSelected ? " is-selected" : ""}`}
      onClick={onSelect}
    >
      <PortfolioAvatar member={member} />
      <div>
        <h2>{member.name}</h2>
        <p className="portfolio-role">{member.role}</p>
      </div>
      {member.bio ? <p className="portfolio-bio">{member.bio}</p> : null}
      {member.skills.length > 0 ? (
        <div className="portfolio-chips">
          {member.skills.map((skill) => (
            <span key={skill} className="portfolio-chip">
              {skill}
            </span>
          ))}
        </div>
      ) : null}
      <div className="portfolio-joined">
        <strong>{joinedLabel}</strong>
        <span>
          {joinedProjects.length > 0
            ? joinedProjects.map((project) => project.title).join(" / ")
            : "—"}
        </span>
      </div>
    </button>
  );
}
