"use client";

import type { HeroContent } from "@/types/messages";

type ShowcaseData = HeroContent["showcase"];

type Props = {
  data: ShowcaseData;
  isOpen: boolean;
  onToggle: () => void;
};

export default function HeroShowcase({ data, isOpen, onToggle }: Props) {
  return (
    <div className="showcase-wrap reveal" data-delay={data.wrapRevealDelayMs}>
      <article
        className={`showcase-card${isOpen ? " is-open" : ""}`}
        id={data.cardId}
        data-od-id={data.dataOdId}
        aria-label={data.ariaLabel}
        onClick={(event) => {
          if (!(event.target as HTMLElement).closest("button")) {
            onToggle();
          }
        }}
      >
        <div className="lid" />
        <div className="base" />
        <div className="box-label">
          {data.boxLabel.line1}
          <br />
          {data.boxLabel.line2}
        </div>
        <div className="prize">
          <h3>{data.prize.title}</h3>
          <p>{data.prize.body}</p>
        </div>
        <button className="btn box-button magnet" type="button" onClick={onToggle}>
          {data.openButtonLabel}
        </button>
      </article>
    </div>
  );
}
