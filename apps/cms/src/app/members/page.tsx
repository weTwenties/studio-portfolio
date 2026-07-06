"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Member = {
  id: string;
  slug: string;
  name: string;
  role: string | null;
  avatarUrl: string | null;
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

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [sourceLocale, setSourceLocale] = useState<"vi" | "en">("vi");
  const [toast, setToast] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const canCreate = useMemo(() => name.trim() && normalizeSlug(slug).trim(), [name, slug]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/members", { cache: "no-store" });
      const data = (await res.json()) as { members?: Member[] };
      setMembers(data.members ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  async function createMember() {
    if (!canCreate) return;
    setCreating(true);
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: normalizeSlug(slug),
          sourceLocale,
          role: role.trim() || null,
          bio: bio.trim() || null,
        }),
      });
      if (!res.ok) { showToast("Failed to create member"); return; }
      setName("");
      setSlug("");
      setRole("");
      setBio("");
      setSourceLocale("vi");
      setShowCreateModal(false);
      showToast("Member created");
      await load();
    } finally {
      setCreating(false);
    }
  }

  async function deleteMember(id: string, memberName: string) {
    if (!confirm(`Delete "${memberName}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Member deleted"); await load(); }
    else showToast("Delete failed");
  }

  async function persistOrder(nextMembers: Member[]) {
    const res = await fetch("/api/members/reorder", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: nextMembers.map((member) => member.id) }),
    });
    if (!res.ok) throw new Error("Failed to reorder members");
  }

  async function moveMember(dragId: string, targetId: string) {
    if (dragId === targetId) return;
    const from = members.findIndex((m) => m.id === dragId);
    const to = members.findIndex((m) => m.id === targetId);
    if (from < 0 || to < 0) return;

    const next = [...members];
    const [dragged] = next.splice(from, 1);
    next.splice(to, 0, dragged);
    const normalized = next.map((m, i) => ({ ...m, sortOrder: i }));
    setMembers(normalized);
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
            <h2>Team Members</h2>
            <p>Manage bios, avatars, social links, and CV references.</p>
          </div>
          <button className="btn primary" type="button" onClick={() => setShowCreateModal(true)}>
            + New member
          </button>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 52 }}></th>
                <th>Member</th>
                <th>Role</th>
                <th>Locale</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: "32px 18px", color: "var(--muted)", textAlign: "center" }}>Loading…</td></tr>
              ) : members.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "32px 18px", color: "var(--muted)", textAlign: "center" }}>No members yet. Click &quot;New member&quot; to create.</td></tr>
              ) : members.map((m) => (
                <tr
                  key={m.id}
                  draggable
                  onDragStart={() => setDraggingId(m.id)}
                  onDragEnd={() => setDraggingId(null)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggingId) void moveMember(draggingId, m.id);
                  }}
                >
                  <td style={{ color: "var(--muted)", cursor: "grab", userSelect: "none", fontSize: 16 }}>⋮⋮</td>
                  <td>
                    <div className="row-title">
                      {m.avatarUrl
                        ? <img src={m.avatarUrl} alt={m.name} className="thumb" style={{ width: 44, height: 44, borderRadius: 10 }} />
                        : <span className="thumb" />
                      }
                      <div>
                        <strong>{m.name}</strong>
                        <span>/{m.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "var(--muted)", fontSize: 13 }}>{m.role ?? <span style={{ opacity: 0.4 }}>—</span>}</td>
                  <td><span className="tag">{m.sourceLocale}</span></td>
                  <td>
                    <span className="tag" style={{ borderColor: m.status === "PUBLISHED" ? "var(--success)" : "var(--border)", color: m.status === "PUBLISHED" ? "var(--success)" : "var(--muted)" }}>
                      {m.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/members/${m.id}`} className="icon-btn" title="Edit">✎</Link>
                      <button className="icon-btn" title="Delete" onClick={() => void deleteMember(m.id, m.name)} style={{ color: "var(--danger)" }}>✕</button>
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
              <div><h2>Add member</h2><p>Create a new draft — fill details on the edit page.</p></div>
              <button className="icon-btn" onClick={() => setShowCreateModal(false)} aria-label="Close">✕</button>
            </div>
            <div className="form">
              <div className="split">
                <div className="field">
                  <label htmlFor="new-name">Name</label>
                  <input
                    id="new-name"
                    placeholder="Nguyen Van A"
                    value={name}
                    onChange={(e) => {
                      const v = e.target.value;
                      setName(v);
                      if (!slug) setSlug(normalizeSlug(v));
                    }}
                  />
                </div>
                <div className="field">
                  <label htmlFor="new-slug">Slug</label>
                  <input
                    id="new-slug"
                    placeholder="nguyen-van-a"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    onBlur={(e) => setSlug(normalizeSlug(e.target.value))}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="new-role">Role ({sourceLocale})</label>
                <input id="new-role" placeholder="Creative Developer" value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="new-bio">Bio ({sourceLocale})</label>
                <textarea id="new-bio" rows={3} placeholder="Short bio in the source language…" value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
              <div className="editor-foot" style={{ padding: 0, border: 0, justifyContent: "space-between" }}>
                <button className="btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button className="btn primary" disabled={!canCreate || creating} onClick={() => void createMember()}>
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
