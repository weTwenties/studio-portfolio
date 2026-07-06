import type { SiteContent } from "@/types/messages";

/** Chuyển anchor trên landing (#contact) thành đường dẫn tuyệt đối từ /team hoặc /projects */
export function siteForPortfolioNav(site: SiteContent): SiteContent {
  const href = site.nav.cta.href;
  if (!href.startsWith("#")) return site;

  return {
    ...site,
    nav: {
      ...site.nav,
      cta: { ...site.nav.cta, href: `/${href}` },
    },
  };
}
