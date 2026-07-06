"use client";

import SectionExtendLink from "@/components/SectionExtendLink";
import type { WorksContent } from "@/types/messages";

type Data = WorksContent;

type Props = {
  data: Data;
  onOpenCase: (caseId: string) => void;
};

export default function WorksSection({ data, onOpenCase }: Props) {
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
        {data.disclaimer ? (
          <p className="section-disclaimer reveal">{data.disclaimer}</p>
        ) : null}
        <div className="work-grid" data-od-id={data.dataOdIdGrid}>
          {data.items.map((item) => (
            <button
              key={item.caseId}
              className="hover-card work-card reveal magnet"
              type="button"
              {...(item.revealDelayMs
                ? { "data-delay": item.revealDelayMs }
                : {})}
              onClick={() => onOpenCase(item.caseId)}
            >
              <div>
                <div
                  className="work-visual"
                  data-label={item.visualLabel}
                />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="meta">
                {item.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
        <SectionExtendLink href="/projects" label={data.extend.label} />
      </div>
    </section>
  );
}
