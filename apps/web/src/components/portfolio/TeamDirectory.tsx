"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MemberCard from "@/components/portfolio/MemberCard";
import MemberDetailPanel from "@/components/portfolio/MemberDetailPanel";
import { projectsForMember } from "@/lib/portfolio/relations";
import type { PortfolioDirectory } from "@/types/portfolio";

type Labels = {
  joinedProjects: string;
  detail: {
    bio: string;
    skills: string;
    relatedProjects: string;
    openCv: string;
    viewProjects: string;
  };
};

type Props = {
  directory: PortfolioDirectory;
  labels: Labels;
};

export default function TeamDirectory({ directory, labels }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberFromQuery = searchParams.get("member");

  const resolveMemberId = useCallback(
    (slugOrId: string | null) => {
      if (!slugOrId) return directory.members[0]?.id ?? null;
      const bySlug = directory.members.find((m) => m.slug === slugOrId);
      if (bySlug) return bySlug.id;
      const byId = directory.members.find((m) => m.id === slugOrId);
      return byId?.id ?? directory.members[0]?.id ?? null;
    },
    [directory.members],
  );

  const selectedId = resolveMemberId(memberFromQuery);

  const selectedMember = useMemo(
    () => directory.members.find((m) => m.id === selectedId) ?? directory.members[0],
    [directory.members, selectedId],
  );

  const selectMember = (memberId: string) => {
    const member = directory.members.find((m) => m.id === memberId);
    if (!member) return;
    router.replace(`/team?member=${member.slug}`, { scroll: false });
  };

  if (!selectedMember) {
    return (
      <section className="portfolio-container portfolio-team-layout">
        <p className="portfolio-bio">No team members yet.</p>
      </section>
    );
  }

  const joined = projectsForMember(directory, selectedMember.id);

  return (
    <section className="portfolio-container portfolio-team-layout">
      <div className="portfolio-team-grid" aria-label="Member cards">
        {directory.members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            joinedProjects={projectsForMember(directory, member.id)}
            isSelected={member.id === selectedMember.id}
            joinedLabel={labels.joinedProjects}
            onSelect={() => selectMember(member.id)}
          />
        ))}
      </div>
      <MemberDetailPanel
        member={selectedMember}
        joinedProjects={joined}
        labels={labels.detail}
      />
    </section>
  );
}
