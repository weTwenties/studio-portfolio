"use client";

import Image from "next/image";
import type { TeamContent } from "@/types/messages";
// import SectionExtendLink from "@/components/SectionExtendLink";

type Data = TeamContent;

export default function TeamSection({ data }: { data: Data }) {
  return (
    <section className="section" id={data.sectionId}>
      <div className="container">
        <div className="section-head reveal">
          <div>
            <p className="eyebrow">{data.section.eyebrow}</p>
            <h2>{data.section.heading}</h2>
          </div>
          <p>{data.section.aside}</p>
        </div>
        <div className="team-grid" data-od-id={data.dataOdId}>
          {data.members.map((member) => (
            <article
              key={member.role}
              className="character hover-card reveal magnet"
              {...(member.revealDelayMs
                ? { "data-delay": member.revealDelayMs }
                : {})}
            >
              <div
                className={`portrait${member.initial.startsWith("/") && member.initial.length > 1 ? " is-wide" : ""}`}
              >
                {member.initial.startsWith("/") ? (
                  <Image src={member.initial} alt={member.role} width={200} height={200} className="w-full h-full object-cover" />
                ) : (
                  <span aria-hidden="true">{member.initial}</span>
                )}
              </div>
              <h3>{member.role}</h3>
              <p>{member.bio}</p>
            </article>
          ))}
        </div>

        {/* TODO: Add link to team page */}
        {/* <SectionExtendLink href="/team" label={data.extend.label} /> */}

      </div>
    </section>
  );
}
