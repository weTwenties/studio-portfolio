type Props = {
  kicker: string;
  title: string;
  lead: string;
};

export default function PortfolioHero({ kicker, title, lead }: Props) {
  return (
    <section className="portfolio-hero portfolio-container">
      <p className="portfolio-kicker">{kicker}</p>
      <h1>{title}</h1>
      <p className="portfolio-lead">{lead}</p>
    </section>
  );
}
