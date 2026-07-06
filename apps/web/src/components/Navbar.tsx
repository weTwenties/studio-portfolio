"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { SiteContent } from "@/types/messages";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export type NavLinkItem = { href: string; label: string };

type Props = {
  site: SiteContent;
  /** Mặc định: anchor links trên landing (`Site.nav.links`) */
  links?: NavLinkItem[];
  brandHref?: string;
  navAriaLabel?: string;
};

function isLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar({ site, links, brandHref = "#top", navAriaLabel }: Props) {
  const { brand, nav } = site;
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const displayLinks = links ?? nav.links;
  const ariaLabel = navAriaLabel ?? nav.ariaLabel;
  const isHomeBrand = brandHref.startsWith("#");

  useEffect(() => {
    if (!isMenuOpen) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const brandClassName = "brand magnet";
  const brandContent = (
    <>
      <span className="brand-mark">{brand.mark}</span>
      <span>{brand.name}</span>
    </>
  );

  const renderNavLink = (link: NavLinkItem, className: string, onNavigate?: () => void) => {
    const active = isLinkActive(pathname, link.href);
    const combinedClass = [className, active ? "is-active" : ""].filter(Boolean).join(" ");

    if (link.href.startsWith("#") || link.href.startsWith("mailto:")) {
      return (
        <a key={link.href} className={combinedClass} href={link.href} onClick={onNavigate}>
          {link.label}
        </a>
      );
    }

    return (
      <Link key={link.href} className={combinedClass} href={link.href} onClick={onNavigate}>
        {link.label}
      </Link>
    );
  };

  return (
    <header className="topbar">
      <div className="container nav">
        {isHomeBrand ? (
          <a className={brandClassName} href={brandHref} aria-label={brand.homeAriaLabel}>
            {brandContent}
          </a>
        ) : (
          <Link className={brandClassName} href={brandHref} aria-label={brand.homeAriaLabel}>
            {brandContent}
          </Link>
        )}

        <nav className="nav-links" aria-label={ariaLabel}>
          {displayLinks.map((link) => renderNavLink(link, "magnet"))}
        </nav>

        <div className="nav-end">
          <LocaleSwitcher />
          {nav.cta.href.startsWith("#") ? (
            <a className="btn magnet" href={nav.cta.href}>
              {nav.cta.label}
            </a>
          ) : (
            <Link className="btn magnet" href={nav.cta.href}>
              {nav.cta.label}
            </Link>
          )}
        </div>

        <button
          type="button"
          className={`nav-toggle${isMenuOpen ? " is-open" : ""}`}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        className={`mobile-nav-backdrop${isMenuOpen ? " is-open" : ""}`}
        onClick={closeMenu}
      />

      <div
        id="mobile-nav-drawer"
        className={`mobile-nav-drawer${isMenuOpen ? " is-open" : ""}`}
        aria-hidden={!isMenuOpen}
      >
        <nav className="mobile-nav-links" aria-label={`${ariaLabel} mobile`}>
          {displayLinks.map((link) => renderNavLink(link, "", closeMenu))}
        </nav>
        <div className="mobile-nav-footer">
          <LocaleSwitcher />
          {nav.cta.href.startsWith("#") ? (
            <a className="btn" href={nav.cta.href} onClick={closeMenu}>
              {nav.cta.label}
            </a>
          ) : (
            <Link className="btn" href={nav.cta.href} onClick={closeMenu}>
              {nav.cta.label}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
