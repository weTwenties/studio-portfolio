"use client";

import type { HeroContent } from "@/types/messages";
import HeroShowcase from "@/components/HeroShowcase";

type HeroData = HeroContent;

type Props = {
  data: HeroData;
  isShowcaseOpen: boolean;
  onToggleShowcase: () => void;
};

export default function Hero({
  data,
  isShowcaseOpen,
  onToggleShowcase,
}: Props) {
  return (
    <section className="hero container">
      <div className="hero-grid">
        <div className="reveal">
          <p className="eyebrow">{data.eyebrow}</p>
          <h1 data-od-id={data.headlineDataOdId}>{data.headline}</h1>
          <p className="lead">{data.lead}</p>
          <div className="hero-actions">
            <a className="btn magnet" href={data.primaryCta.href}>
              {data.primaryCta.label}
            </a>
            <a
              className="btn secondary magnet"
              href="#works"
            >
              {data.viewProject}
            </a>
            <button
              className="btn secondary magnet"
              type="button"
              onClick={onToggleShowcase}
            >
              {data.showcaseButtonLabel}
            </button>
          </div>
          <div className="mini-stats" aria-label={data.miniStatsAriaLabel}>
            {data.miniStats.map((row) => (
              <div key={row.value + row.caption}>
                <strong>{row.value}</strong>
                <span>{row.caption}</span>
              </div>
            ))}
          </div>
        </div>

        <HeroShowcase
          data={data.showcase}
          isOpen={isShowcaseOpen}
          onToggle={onToggleShowcase}
        />
      </div>
    </section>
  );
}
