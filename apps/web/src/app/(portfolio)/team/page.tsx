import { Suspense } from "react";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import Navbar from "@/components/Navbar";
import { buildPortfolioNavLinks } from "@/lib/portfolio/navLinks";
import TeamDirectory from "@/components/portfolio/TeamDirectory";
import { buildTeamPageDirectory } from "@/lib/portfolio/buildTeamDirectory";
import { siteForPortfolioNav } from "@/lib/portfolio/siteForNav";
import { readProjectsSnapshot } from "@/lib/snapshot";
import type { Messages } from "@/types/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const t = await getTranslations("Portfolio.team");
  return { title: t("metaTitle") };
}

export default async function TeamPage() {
  const locale = (await getLocale()) as "vi" | "en";
  const [messages, t, tNav, projects] = await Promise.all([
    getMessages(),
    getTranslations("Portfolio.team"),
    getTranslations("Portfolio.nav"),
    readProjectsSnapshot(),
  ]);

  const portfolioMessages = messages as Messages;
  const site = portfolioMessages.Site;
  const squad = portfolioMessages.Portfolio.team.members;
  const directory = buildTeamPageDirectory(squad, projects, locale);

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
          <TeamDirectory
            directory={directory}
            labels={{
              joinedProjects: t("joinedProjects"),
              detail: {
                bio: t("detail.bio"),
                skills: t("detail.skills"),
                relatedProjects: t("detail.relatedProjects"),
                openCv: t("detail.openCv"),
                viewProjects: t("detail.viewProjects"),
              },
            }}
          />
        </Suspense>
      </main>
    </>
  );
}
