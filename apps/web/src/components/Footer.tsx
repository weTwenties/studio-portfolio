"use client";

import type { SiteContent } from "@/types/messages";

type Site = SiteContent;

export default function Footer({ site }: { site: Site }) {
  return (
    <footer className="footer">
      <div className="container">
        <span>{site.footer.line1}</span>
        <span>{site.footer.line2}</span>
      </div>
    </footer>
  );
}
