"use client";

import type { ServicesContent } from "@/types/messages";

type Data = ServicesContent;

export default function ServicesSection({ data }: { data: Data }) {
  return (
    <section
      className="section"
      id={data.sectionId}
      data-od-id={data.dataOdId}
    >
      <div className="container">
        <div className="section-head reveal">
          <div>
            <p className="eyebrow">{data.section.eyebrow}</p>
            <h2>{data.section.heading}</h2>
          </div>
          <p>{data.section.aside}</p>
        </div>
        <div className="grid-3">
          {data.cards.map((card) => (
            <article
              key={card.indexLabel}
              className="hover-card reveal magnet"
              {...(card.revealDelayMs
                ? { "data-delay": card.revealDelayMs }
                : {})}
            >
              <span className="card-index">{card.indexLabel}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
