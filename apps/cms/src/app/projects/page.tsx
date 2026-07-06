"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SourceLocaleToggle from "@/components/cms/SourceLocaleToggle";

type Project = {
  id: string;
  slug: string;
  title: string;
  tags: string[];
  coverUrl: string | null;
  status: "DRAFT" | "PUBLISHED";
  sourceLocale: "vi" | "en";
  sortOrder: number;
};

function toSlug(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
const normalizeSlug = (value: string) => toSlug(value).replace(/-+/g, "-");

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [sourceLocale, setSourceLocale] = useState<"vi" | "en">("vi");
  const [toast, setToast] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const canCreate = useMemo(() => title.trim() && normalizeSlug(slug).trim(), [title, slug]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      const data = (await res.json()) as { projects?: Project[] };
      setProjects(data.projects ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  async function createProject() {
    if (!canCreate) return;
    setCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: normalizeSlug(slug),
          sourceLocale,
          summary: summary.trim() || null,
        }),
      });
      if (!res.ok) { showToast("Failed to create project"); return; }
      setTitle("");
      setSlug("");
      setSummary("");
      setSourceLocale("vi");
      setShowCreateModal(false);
      showToast("Project created");
      await load();
    } finally {
      setCreating(false);
    }
  }

  async function deleteProject(id: string, projectTitle: string) {
    if (!confirm(`Delete "${projectTitle}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Project deleted"); await load(); }
    else showToast("Delete failed");
  }

  async function persistOrder(nextProjects: Project[]) {
    const res = await fetch("/api/projects/reorder", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: nextProjects.map((project) => project.id) }),
    });
    if (!res.ok) throw new Error("Failed to reorder projects");
  }

  async function moveProject(dragId: string, targetId: string) {
    if (dragId === targetId) return;
    const from = projects.findIndex((p) => p.id === dragId);
    const to = projects.findIndex((p) => p.id === targetId);
    if (from < 0 || to < 0) return;

    const next = [...projects];
    const [dragged] = next.splice(from, 1);
    next.splice(to, 0, dragged);
    const normalized = next.map((p, i) => ({ ...p, sortOrder: i }));
    setProjects(normalized);
    try {
      await persistOrder(normalized);
      showToast("Order updated");
    } catch {
      showToast("Failed to update order");
      await load();
    }
  }

  return (
    <section className="workspace">
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Projects</h2>
            <p>Portfolio case studies, cover images, tags, and demo links.</p>
          </div>
          <button className="btn primary" type="button" onClick={() => setShowCreateModal(true)}>
            + New project
          </button>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 52 }}></th>
                <th>Project</th>
                <th>Tags</th>
                <th>Locale</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: "32px 18px", color: "var(--muted)", textAlign: "center" }}>Loading…</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "32px 18px", color: "var(--muted)", textAlign: "center" }}>No projects yet. Click &quot;New project&quot; to create.</td></tr>
              ) : projects.map((p) => (
                <tr
                  key={p.id}
                  draggable
                  onDragStart={() => setDraggingId(p.id)}
                  onDragEnd={() => setDraggingId(null)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggingId) void moveProject(draggingId, p.id);
                  }}
                >
                  <td style={{ color: "var(--muted)", cursor: "grab", userSelect: "none", fontSize: 16 }}>⋮⋮</td>
                  <td>
                    <div className="row-title">
                      {p.coverUrl
                        ? <img src={p.coverUrl} alt={p.title} className="thumb" style={{ width: 44, height: 44, borderRadius: 10 }} />
                        : <span className="thumb" />
                      }
                      <div>
                        <strong>{p.title}</strong>
                        <span>/{p.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="tags">
                      {p.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                      {p.tags.length > 3 && <span className="tag">+{p.tags.length - 3}</span>}
                      {p.tags.length === 0 && <span style={{ color: "var(--muted)", opacity: 0.5 }}>—</span>}
                    </div>
                  </td>
                  <td><span className="tag">{p.sourceLocale}</span></td>
                  <td>
                    <span className="tag" style={{
                      borderColor: p.status === "PUBLISHED" ? "var(--success)" : "var(--border)",
                      color: p.status === "PUBLISHED" ? "var(--success)" : "var(--muted)",
                    }}>
                      {p.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/projects/${p.id}`} className="icon-btn" title="Edit">✎</Link>
                      <button className="icon-btn" title="Delete" onClick={() => void deleteProject(p.id, p.title)} style={{ color: "var(--danger)" }}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showCreateModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(2, 6, 23, 0.55)", zIndex: 1000, display: "grid", placeItems: "center", padding: 16 }}>
          <section className="panel" style={{ width: "min(760px, 100%)", margin: 0 }}>
            <div className="panel-head">
              <div><h2>Add project</h2><p>Create a new draft — fill details on the edit page.</p></div>
              <button className="icon-btn" onClick={() => setShowCreateModal(false)} aria-label="Close">✕</button>
            </div>
            <div className="form">
              <div className="split">
                <div className="field">
                  <label htmlFor="new-title">Title</label>
                  <input
                    id="new-title"
                    placeholder="atlas-commerce"
                    value={title}
                    onChange={(e) => {
                      const v = e.target.value;
                      setTitle(v);
                      if (!slug) setSlug(normalizeSlug(v));
                    }}
                  />
                </div>
                <div className="field">
                  <label htmlFor="new-slug">Slug</label>
                  <input
                    id="new-slug"
                    placeholder="atlas-commerce"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    onBlur={(e) => setSlug(normalizeSlug(e.target.value))}
                  />
                </div>
              </div>
              <div className="field">
                <label>Source locale</label>
                <SourceLocaleToggle value={sourceLocale} onChange={setSourceLocale} />
              </div>
              <div className="field">
                <label htmlFor="new-summary">Summary ({sourceLocale})</label>
                <textarea id="new-summary" rows={3} placeholder="Short description of the project…" value={summary} onChange={(e) => setSummary(e.target.value)} />
              </div>
              <div className="editor-foot" style={{ padding: 0, border: 0, justifyContent: "space-between" }}>
                <button className="btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button className="btn primary" disabled={!canCreate || creating} onClick={() => void createProject()}>
                  {creating ? "Creating…" : "Create draft"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {toast && (
        <div className="toast">
          <span className="dot success" />
          {toast}
        </div>
      )}
    </section>
  );
}
