import { Suspense } from "react";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import Navbar from "@/components/Navbar";
import { buildPortfolioNavLinks } from "@/lib/portfolio/navLinks";
import ProjectsDirectory from "@/components/portfolio/ProjectsDirectory";
import { buildPortfolioDirectory } from "@/lib/portfolio/buildDirectory";
import { siteForPortfolioNav } from "@/lib/portfolio/siteForNav";
import { readMembersSnapshot, readProjectsSnapshot } from "@/lib/snapshot";
import type { Messages } from "@/types/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const t = await getTranslations("Portfolio.projects");
  return { title: t("metaTitle") };
}

export default async function ProjectsPage() {
  const locale = (await getLocale()) as "vi" | "en";
  const [messages, t, tNav, members, projects] = await Promise.all([
    getMessages(),
    getTranslations("Portfolio.projects"),
    getTranslations("Portfolio.nav"),
    readMembersSnapshot(),
    readProjectsSnapshot(),
  ]);

  const site = (messages as Messages).Site;
  const directory = buildPortfolioDirectory(members, projects, locale);

  return (
    <>
      <Navbar
        site={siteForPortfolioNav(site)}
        links={buildPortfolioNavLinks({
          home: tNav("home"),
          team: tNav("team"),
          projects: tNav("projects"),
        })}
        brandHref="/"
        navAriaLabel={tNav("ariaLabel")}
      />
      <main>
        <PortfolioHero kicker={t("kicker")} title={t("title")} lead={t("lead")} />
        <Suspense fallback={<section className="portfolio-container portfolio-bio">…</section>}>
          <ProjectsDirectory
            directory={directory}
            labels={{
              viewCase: t("viewCase"),
              modal: {
                close: t("modal.close"),
                problem: t("modal.problem"),
                solution: t("modal.solution"),
                result: t("modal.result"),
                openDemo: t("modal.openDemo"),
              },
            }}
          />
        </Suspense>
      </main>
    </>
  );
}
