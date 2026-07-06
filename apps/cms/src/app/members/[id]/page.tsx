"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CmsBreadcrumbs from "@/components/cms/CmsBreadcrumbs";
import { ImageUploader } from "@/components/cms/ImageUploader";
import SourceLocaleToggle from "@/components/cms/SourceLocaleToggle";
import { useCmsTopbarSlot } from "@/components/cms/CmsTopbarSlot";

type Social = { platform: string; url: string };
type ProjectMemberLite = { id: string; name: string; avatarUrl: string | null };
type ProjectRef = { id: string; slug: string; title: string; coverUrl: string | null; status: "DRAFT" | "PUBLISHED"; members?: ProjectMemberLite[] };
type MemberProjectRef = { projectId: string; roleLabel: string | null; project: ProjectRef };

type Member = {
  id: string;
  slug: string;
  sourceLocale: "vi" | "en";
  name: string;
  role: string | null;
  bio: string | null;
  avatarUrl: string | null;
  cvUrl: string | null;
  socials: Social[];
  memberProjects?: MemberProjectRef[];
  sortOrder: number;
  status: "DRAFT" | "PUBLISHED";
};

export default function MemberEditPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState("");
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [memberProjects, setMemberProjects] = useState<MemberProjectRef[]>([]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  useEffect(() => {
    void params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    void (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/members/${id}`);
        const data = (await res.json()) as { member: Member };
        setMember(data.member);
        setMemberProjects(data.member.memberProjects ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function saveDraft() {
    if (!member) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/members/${member.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...member, memberProjects }),
      });
      if (res.ok) {
        const data = (await res.json()) as { member: Member };
        setMember(data.member);
        setMemberProjects(data.member.memberProjects ?? []);
        showToast("Draft saved");
      } else showToast("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish() {
    if (!member) return;
    setPublishing(true);
    try {
      const target = member.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      const res = await fetch(`/api/members/${member.id}/publish`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: target }),
      });
      if (res.ok) {
        const data = await res.json();
        setMember((prev) => (prev ? { ...prev, status: data.member.status } : prev));
        showToast(target === "PUBLISHED" ? "Published. Translation queued." : "Moved to draft.");
      } else {
        showToast("Action failed");
      }
    } finally {
      setPublishing(false);
    }
  }

  function updateSocial(index: number, field: keyof Social, value: string) {
    if (!member) return;
    setMember({
      ...member,
      socials: member.socials.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    });
  }

  function removeSocial(index: number) {
    if (!member) return;
    setMember({ ...member, socials: member.socials.filter((_, i) => i !== index) });
  }

  const isPublished = member?.status === "PUBLISHED";

  useCmsTopbarSlot(
    member ? (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/members" className="btn" style={{ minHeight: 32, padding: "0 10px" }}>← Back</Link>
          <CmsBreadcrumbs crumbs={[{ label: "Content" }, { label: "Team" }, { label: <strong>Edit member</strong> }]} />
          <span className="tag" style={{
            borderColor: isPublished ? "var(--success)" : "var(--warning)",
            color: isPublished ? "var(--success)" : "var(--warning)",
          }}>
            {isPublished ? "Published" : "Draft"}
          </span>
        </div>
        <div className="actions">
          <button className="btn" disabled={saving} onClick={() => void saveDraft()}>
            {saving ? "Saving…" : "Save draft"}
          </button>
          <button className="btn primary" disabled={publishing} onClick={() => void togglePublish()}>
            {publishing ? "Working…" : isPublished ? "Move to draft" : "Publish"}
          </button>
        </div>
      </div>
    ) : null,
    [isPublished, saving, publishing, member],
  );

  if (loading) {
    return (
      <section className="workspace">
        <div style={{ padding: "48px 0", textAlign: "center", color: "var(--muted)" }}>Loading…</div>
      </section>
    );
  }

  if (!member) {
    return (
      <section className="workspace">
        <div style={{ padding: "48px 0", textAlign: "center", color: "var(--muted)" }}>Member not found.</div>
      </section>
    );
  }

  return (
    <section className="workspace">
      <section className="panel">
        <div className="panel-head">
          <div><h2>{member.name}</h2><p>/{member.slug}</p></div>
          <SourceLocaleToggle value={member.sourceLocale} onChange={(sourceLocale) => setMember({ ...member, sourceLocale })} />
        </div>
        <div className="form">
          <div className="split">
            <div className="field">
              <label htmlFor="m-name">Name</label>
              <input id="m-name" value={member.name} onChange={(e) => setMember({ ...member, name: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="m-slug">Slug</label>
              <input id="m-slug" value={member.slug} onChange={(e) => setMember({ ...member, slug: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="m-role">Role ({member.sourceLocale})</label>
            <input id="m-role" placeholder="Creative Developer" value={member.role ?? ""} onChange={(e) => setMember({ ...member, role: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="m-bio">Bio ({member.sourceLocale})</label>
            <textarea id="m-bio" rows={4} placeholder="Short bio in the source language…" value={member.bio ?? ""} onChange={(e) => setMember({ ...member, bio: e.target.value })} />
          </div>
          <div className="split">
            <div className="field">
              <label>Avatar</label>
              <ImageUploader value={member.avatarUrl} onChange={(url) => setMember({ ...member, avatarUrl: url })} prefix="members" />
            </div>
            <div className="field">
              <label htmlFor="m-cv">CV / Portfolio URL</label>
              <input id="m-cv" type="url" placeholder="https://…" value={member.cvUrl ?? ""} onChange={(e) => setMember({ ...member, cvUrl: e.target.value })} />
            </div>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div><h2>Social links</h2><p>Platform handles and profile URLs.</p></div>
          <button className="btn" type="button" onClick={() => setMember({ ...member, socials: [...(member.socials ?? []), { platform: "", url: "" }] })}>
            + Add link
          </button>
        </div>
        <div className="form">
          {(member.socials ?? []).length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: 13 }}>No social links yet.</p>
          ) : (member.socials ?? []).map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: 10, alignItems: "end" }}>
              <div className="field">
                {i === 0 && <label>Platform</label>}
                <input placeholder="github" value={s.platform} onChange={(e) => updateSocial(i, "platform", e.target.value)} />
              </div>
              <div className="field">
                {i === 0 && <label>URL</label>}
                <input type="url" placeholder="https://github.com/…" value={s.url} onChange={(e) => updateSocial(i, "url", e.target.value)} />
              </div>
              <button className="icon-btn" style={{ color: "var(--danger)", marginBottom: i === 0 ? 0 : 0 }} onClick={() => removeSocial(i)}>✕</button>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div><h2>Project members</h2><p>Projects this member has participated in.</p></div>
        </div>
        <div className="form">
          {memberProjects.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: 13 }}>No project participation yet.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {memberProjects.map((entry) => (
                <div key={entry.projectId} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "center", padding: 12, border: "1px solid var(--border)", borderRadius: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", marginLeft: 8 }}>
                    {(entry.project.members ?? []).slice(0, 5).map((m, index) => (
                      <div key={`${entry.projectId}-${m.id}`} title={m.name} style={{ width: 34, height: 34, borderRadius: 999, overflow: "hidden", border: "2px solid var(--surface)", marginLeft: index === 0 ? 0 : -12, background: "var(--surface-2)" }}>
                        {m.avatarUrl ? <img src={m.avatarUrl} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
                      </div>
                    ))}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <strong>{entry.project.title}</strong>
                      <span className="tag">{entry.project.status}</span>
                    </div>
                    <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: 13 }}>
                      /{entry.project.slug}{entry.roleLabel ? ` · ${entry.roleLabel}` : ""}
                    </p>
                  </div>
                  <span className="tag">Participant</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {toast && (
        <div className="toast">
          <span className="dot success" />
          {toast}
        </div>
      )}
    </section>
  );
}
