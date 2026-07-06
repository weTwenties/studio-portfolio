"use client";

import { useEffect, useState } from "react";
import CmsThemeToggle from "@/components/cms/CmsThemeToggle";

type NavLink = { label: string; href: string };
type Site = {
  sourceLocale: "vi" | "en";
  brand: string | null;
  navLinks: NavLink[];
  footerText: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  contactEmail: string | null;
};

const defaultSite: Site = {
  sourceLocale: "vi",
  brand: "",
  navLinks: [],
  footerText: "",
  seoTitle: "",
  seoDescription: "",
  contactEmail: "",
};

export default function SettingsPage() {
  const [site, setSite] = useState<Site>(defaultSite);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/site", { cache: "no-store" });
        const data = (await res.json()) as { site?: Site | null };
        if (data.site) setSite({ ...defaultSite, ...data.site });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/site", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(site),
      });
      if (res.ok) showToast("Settings saved");
      else showToast("Save failed");
    } finally {
      setSaving(false);
    }
  }

  function updateNavLink(i: number, field: keyof NavLink, value: string) {
    setSite({ ...site, navLinks: site.navLinks.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)) });
  }

  function removeNavLink(i: number) {
    setSite({ ...site, navLinks: site.navLinks.filter((_, idx) => idx !== i) });
  }

  if (loading) {
    return <section className="workspace"><div style={{ padding: "48px 0", textAlign: "center", color: "var(--muted)" }}>Loading…</div></section>;
  }

  return (
    <section className="workspace">
      <div className="page-title">
        <div>
          <p className="kicker">Settings</p>
          <h1>Control the CMS workspace.</h1>
          <p>Set the studio profile, publishing defaults, contact routing, integrations, theme behavior, and teammate access for the landing content workflow.</p>
        </div>
        <button className="btn primary" disabled={saving} onClick={() => void save()}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>

      <section className="panel">
        <div className="panel-head">
          <div><h2>Brand & Identity</h2><p>Site name, locale, and contact.</p></div>
        </div>
        <div className="form">
          <div className="triple">
            <div className="field">
              <label htmlFor="s-locale">Source locale</label>
              <select id="s-locale" value={site.sourceLocale} onChange={(e) => setSite({ ...site, sourceLocale: e.target.value as "vi" | "en" })}>
                <option value="vi">Vietnamese (vi)</option>
                <option value="en">English (en)</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="s-brand">Brand name</label>
              <input id="s-brand" placeholder="Studio Portfolio" value={site.brand ?? ""} onChange={(e) => setSite({ ...site, brand: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="s-email">Contact email</label>
              <input id="s-email" type="email" placeholder="hello@example.com" value={site.contactEmail ?? ""} onChange={(e) => setSite({ ...site, contactEmail: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="s-footer">Footer text ({site.sourceLocale})</label>
            <input id="s-footer" placeholder="© 2026 Studio Portfolio" value={site.footerText ?? ""} onChange={(e) => setSite({ ...site, footerText: e.target.value })} />
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div><h2>SEO Metadata</h2><p>Page title and meta description in the source locale. Auto-translated on publish.</p></div>
        </div>
        <div className="form">
          <div className="field">
            <label htmlFor="s-seo-title">SEO title ({site.sourceLocale})</label>
            <input id="s-seo-title" placeholder="Studio Portfolio" value={site.seoTitle ?? ""} onChange={(e) => setSite({ ...site, seoTitle: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="s-seo-desc">SEO description ({site.sourceLocale})</label>
            <textarea id="s-seo-desc" rows={3} placeholder="A dual-surface portfolio platform with a public website and lightweight CMS." value={site.seoDescription ?? ""} onChange={(e) => setSite({ ...site, seoDescription: e.target.value })} />
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div><h2>Theme & appearance</h2><p>CMS workspace theme. Public site is unaffected.</p></div>
          <span className="tag">Local only</span>
        </div>
        <div className="form">
          <div className="field">
            <label>CMS theme</label>
            <CmsThemeToggle />
            <p style={{ color: "var(--muted)", fontSize: 12, margin: 0 }}>
              Lựa chọn áp dụng riêng cho trình duyệt hiện tại (lưu trong localStorage).
            </p>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div><h2>Navigation links</h2><p>Top-bar links shown on the public site.</p></div>
          <button className="btn" type="button" onClick={() => setSite({ ...site, navLinks: [...site.navLinks, { label: "", href: "" }] })}>
            + Add link
          </button>
        </div>
        <div className="form">
          {site.navLinks.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: 13 }}>No nav links yet.</p>
          ) : site.navLinks.map((link, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: 10, alignItems: "end" }}>
              <div className="field">
                {i === 0 && <label>Label</label>}
                <input placeholder="Works" value={link.label} onChange={(e) => updateNavLink(i, "label", e.target.value)} />
              </div>
              <div className="field">
                {i === 0 && <label>Href</label>}
                <input placeholder="/#works" value={link.href} onChange={(e) => updateNavLink(i, "href", e.target.value)} />
              </div>
              <button className="icon-btn" style={{ color: "var(--danger)" }} onClick={() => removeNavLink(i)}>✕</button>
            </div>
          ))}
        </div>
      </section>

      <div className="editor-foot" style={{ border: 0, padding: 0 }}>
        <button className="btn primary" disabled={saving} onClick={() => void save()}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>

      {toast && (
        <div className="toast">
          <span className="dot success" />
          {toast}
        </div>
      )}
    </section>
  );
}
