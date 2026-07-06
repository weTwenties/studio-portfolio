"use client";

import type { ProcessContent } from "@/types/messages";

type Data = ProcessContent;

export default function ProcessSection({ data }: { data: Data }) {
  return (
    <section className="section" id={data.sectionId}>
      <div className="container">
        <div className="section-head reveal">
          <div>
            <p className="eyebrow">{data.section.eyebrow}</p>
            <h2 dangerouslySetInnerHTML={{ __html: data.section.heading }} />
          </div>
          <p>{data.section.aside}</p>
        </div>
        <div className="process reveal" data-od-id={data.dataOdId}>
          {data.steps.map((step) => (
            <article key={step.num} className="step magnet">
              <div className="step-num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
