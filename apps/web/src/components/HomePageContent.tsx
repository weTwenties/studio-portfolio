"use client";

import { FormEvent, useEffect, useState } from "react";
import { useMessages } from "next-intl";
import type { CaseStudiesMap } from "@/types/content";
import type { Messages } from "@/types/messages";
import CaseStudyModal from "@/components/CaseStudyModal";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ProcessSection from "@/components/ProcessSection";
import ServicesSection from "@/components/ServicesSection";
import TeamSection from "@/components/TeamSection";
import WorksSection from "@/components/WorksSection";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

export default function HomePageContent() {
  const messages = useMessages() as Messages;
  const {
    Site: site,
    Hero: hero,
    Services: services,
    Works: works,
    Process: process,
    Team: team,
  } = messages;

  const caseStudies = messages.CaseStudies as CaseStudiesMap;

  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const activeCase = activeCaseId ? caseStudies[activeCaseId] ?? null : null;

  useRevealOnScroll();

  useEffect(() => {
    document.body.style.overflow = activeCase ? "hidden" : "";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveCaseId(null);
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeCase]);

  const toggleShowcase = () => setIsShowcaseOpen((open) => !open);

  const submitQuickContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const c = site.contact;
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const project = String(formData.get("project") ?? "");
    const brief = String(formData.get("brief") ?? "");

    const subject = encodeURIComponent(
      c.subjectTemplate.replace("{name}", name),
    );
    const body = encodeURIComponent(
      c.bodyTemplate
        .replace("{name}", name)
        .replace("{email}", email)
        .replace("{project}", project)
        .replace("{brief}", brief),
    );

    await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, project, brief }),
    }).catch(() => null);

    window.location.href = `mailto:${c.mailtoEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <Navbar site={site} />

      <main id="top">
        <Hero
          data={hero}
          isShowcaseOpen={isShowcaseOpen}
          onToggleShowcase={toggleShowcase}
        />

        <ServicesSection data={services} />

        <ProcessSection data={process} />

        <WorksSection
          data={works}
          onOpenCase={(id) => setActiveCaseId(id)}
        />

        <TeamSection data={team} />

        <ContactSection site={site} onSubmit={submitQuickContact} />
      </main>

      <Footer site={site} />

      <CaseStudyModal
        activeCase={activeCase}
        disclaimer={works.disclaimer}
        onClose={() => setActiveCaseId(null)}
      />
    </>
  );
}
