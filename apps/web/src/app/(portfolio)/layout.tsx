import type { ReactNode } from "react";
import PortfolioBodyClass from "@/components/portfolio/PortfolioBodyClass";
import "@/styles/portfolio.css";

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="portfolio-page">
      <PortfolioBodyClass />
      {children}
    </div>
  );
}
