"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import CmsBreadcrumbs from "@/components/cms/CmsBreadcrumbs";
import { useCmsEditorStore } from "@/store/cmsEditorStore";
import { clearExpiredProjectImages, dataUrlToFile, getProjectImagesFromCache, saveProjectImagesToCache } from "@/lib/projectImageCache";
import { useCmsTopbarSlot } from "@/components/cms/CmsTopbarSlot";
import SourceLocaleToggle from "@/components/cms/SourceLocaleToggle";
import { projectFormSchema, type ProjectFormValues } from "@/lib/projectFormSchema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type MemberOption = { id: string; avatarUrl: string | null; name: string; role: string | null };
type ProjectOption = { id: string; title: string; tags: string[] };
type CaseTab = "problem" | "solution" | "result";

function emptyProject(): ProjectFormValues {
  return {
    id: "",
    slug: "",
    sourceLocale: "vi",
    title: "",
    summary: "",
    coverUrl: null,
    demoUrl: null,
    tags: [],
    timeline: null,
    caseStudy: null,
    memberProjects: [],
    sortOrder: 0,
    status: "DRAFT",
  };
}

type ProjectFormInput = {
  id?: string;
  slug?: string;
  sourceLocale?: "vi" | "en";
  title?: string;
  summary?: string | null;
  coverUrl?: string | null;
  demoUrl?: string | null;
  tags?: string[];
  timeline?: { start?: string; end?: string } | null;
  caseStudy?: {
    kicker?: string;
    problem?: string;
    solution?: string;
    result?: string;
    points?: { label?: string; text?: string }[];
    images?: { url?: string; isPrimary?: boolean; base64?: string; name?: string; type?: string }[];
  } | null;
  memberProjects?: { memberId?: string; roleLabel?: string | null }[];
  sortOrder?: number;
  status?: "DRAFT" | "PUBLISHED";
};

function normalizeTimeline(timeline: ProjectFormInput["timeline"]): ProjectFormValues["timeline"] {
  if (timeline == null) return null;
  const start = timeline.start ?? "";
  const end = timeline.end ?? "";
  if (!start && !end) return null;
  return { start, end };
}

function normalizeProject(project: ProjectFormInput): ProjectFormValues {
  const base = emptyProject();
  return {
    ...base,
    ...project,
    summary: project.summary ?? "",
    demoUrl: project.demoUrl ?? null,
    coverUrl: project.coverUrl ?? null,
    tags: project.tags ?? [],
    timeline: normalizeTimeline(project.timeline),
    caseStudy: project.caseStudy
      ? {
        kicker: project.caseStudy.kicker ?? "",
        problem: project.caseStudy.problem ?? "",
        solution: project.caseStudy.solution ?? "",
        result: project.caseStudy.result ?? "",
        points: (project.caseStudy.points ?? []).map((point) => ({
          label: point.label ?? "",
          text: point.text ?? "",
        })),
        images: (project.caseStudy.images ?? []).map((img) => ({
          url: img.url ?? "",
          isPrimary: img.isPrimary,
          base64: img.base64,
          name: img.name,
          type: img.type,
        })),
      }
      : null,
    memberProjects: (project.memberProjects ?? []).map((link) => ({
      memberId: link.memberId ?? "",
      roleLabel: link.roleLabel ?? null,
    })),
  };
}

function hydratedImages(images: NonNullable<ProjectFormValues["caseStudy"]>["images"] | undefined) {
  return (images ?? []).map((img) => ({ ...img, base64: img.base64 ?? img.url }));
}

export default function ProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState("");
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [caseTab, setCaseTab] = useState<CaseTab>("problem");
  const [tagInput, setTagInput] = useState("");
  const setProjectDraft = useCmsEditorStore((s) => s.setProjectDraft);

  const { control, register, setValue, reset, handleSubmit, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: emptyProject(),
  });
  const { fields, append, remove, replace } = useFieldArray({ control, name: "caseStudy.points" });

  const watched = useWatch({ control });
  const project = useMemo(
    () => normalizeProject({ ...emptyProject(), ...watched }),
    [watched],
  );
  const images = useWatch({ control, name: "caseStudy.images" }) ?? [];
  const selectedMemberIds = useWatch({ control, name: "memberProjects" })?.map((link) => link.memberId) ?? [];
  const isPublished = project.status === "PUBLISHED";

  useEffect(() => { void params.then((p) => setId(p.id)); }, [params]);

  useEffect(() => { void clearExpiredProjectImages(); }, []);

  useEffect(() => {
    void (async () => {
      try {
        const [membersRes, projectsRes] = await Promise.all([
          fetch("/api/members", { cache: "no-store" }),
          fetch("/api/projects", { cache: "no-store" }),
        ]);
        const membersData = (await membersRes.json()) as { members?: MemberOption[] };
        const projectsData = (await projectsRes.json()) as { projects?: ProjectOption[] };
        setMembers(membersData.members ?? []);
        setTagOptions(Array.from(new Set((projectsData.projects ?? []).flatMap((project) => project.tags ?? []))).sort((a, b) => a.localeCompare(b)));
      } catch {
        setMembers([]);
        setTagOptions([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (!id) return;
    void (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${id}`, { cache: "no-store" });
        const data = (await res.json()) as { project: ProjectFormValues };
        const cached = await getProjectImagesFromCache(data.project.id);
        const next = normalizeProject({
          ...data.project,
          caseStudy: data.project.caseStudy ? { ...data.project.caseStudy, images: cached.length > 0 ? cached.map((item) => ({ url: item.dataUrl, isPrimary: item.isPrimary, base64: item.dataUrl, name: item.name, type: item.type })) : hydratedImages(data.project.caseStudy.images) } : null,
        });
        reset(next);
        replace(next.caseStudy?.points ?? []);
        setProjectDraft(next.id, next);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, reset, replace, setProjectDraft]);

  const tagChips = useMemo(() => project.tags ?? [], [project.tags]);
  const availableTagOptions = useMemo(() => tagOptions.filter((tag) => !tagChips.includes(tag)), [tagOptions, tagChips]);

  function persistablePayload(values: ProjectFormValues): ProjectFormValues {
    return {
      ...values,
      summary: values.summary ?? "",
      demoUrl: values.demoUrl ?? null,
      coverUrl: values.coverUrl ?? null,
      caseStudy: values.caseStudy
        ? { ...values.caseStudy, images: (values.caseStudy.images ?? []).map((img) => ({ url: img.url, isPrimary: img.isPrimary, name: img.name, type: img.type })) }
        : null,
    };
  }

  async function uploadImagesFromCache(values: ProjectFormValues) {
    const cached = await getProjectImagesFromCache(values.id);
    if (cached.length === 0 && (values.caseStudy?.images?.length ?? 0) === 0) return values;
    setUploadingImages(true);
    try {
      const source = cached.length > 0 ? cached : (values.caseStudy?.images ?? []).map((img, index) => ({ projectId: values.id, id: `${values.id}:fallback:${index}`, name: img.name ?? `project-image-${index}.png`, type: img.type ?? "image/png", dataUrl: img.url, isPrimary: img.isPrimary, createdAt: Date.now(), expiresAt: Date.now() + 86400000 }));
      const uploaded = await Promise.all(source.map(async (img) => {
        const file = dataUrlToFile(img.dataUrl, img.name);
        const presign = await fetch("/api/uploads/presign", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type, prefix: "projects", size: file.size }),
        });
        if (!presign.ok) throw new Error(await presign.text());
        const { uploadUrl, publicUrl } = (await presign.json()) as { uploadUrl: string; publicUrl: string };
        const put = await fetch(uploadUrl, { method: "PUT", headers: { "content-type": file.type }, body: file });
        if (!put.ok) throw new Error(`Upload failed (${put.status})`);
        return { url: publicUrl, isPrimary: img.isPrimary };
      }));
      const coverUrl = uploaded.find((img) => img.isPrimary)?.url ?? uploaded[0]?.url ?? values.coverUrl;
      return { ...values, coverUrl, caseStudy: values.caseStudy ? { ...values.caseStudy, images: uploaded } : null };
    } finally {
      setUploadingImages(false);
    }
  }

  async function onSubmit(values: ProjectFormValues, status: ProjectFormValues["status"]) {
    setSaving(status === "DRAFT");
    setPublishing(status === "PUBLISHED");
    try {
      const uploaded = await uploadImagesFromCache(values);
      const payload = persistablePayload({ ...uploaded, status });
      const res = await fetch(`/api/projects/${values.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      reset(payload);
      setProjectDraft(payload.id, payload);
      toast.success(status === "PUBLISHED" ? "Published" : "Draft saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  }

  useCmsTopbarSlot(
    id ? (
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/projects" className="btn min-h-8 px-2.5">← Back</Link>
          <CmsBreadcrumbs crumbs={[{ label: "Content" }, { label: "Projects" }, { label: <strong>Edit project</strong> }]} />
          <span className={`tag ${isPublished ? "border-[color:var(--success)] text-[color:var(--success)]" : "border-[color:var(--warning)] text-[color:var(--warning)]"}`}>{isPublished ? "Published" : "Draft"}</span>
        </div>
        <div className="actions">
          <button className="btn" disabled={saving || publishing} onClick={() => void handleSubmit((values) => onSubmit(values, "DRAFT"))()}>{saving ? "Saving…" : "Save draft"}</button>
          <button className="btn primary" disabled={saving || publishing} onClick={() => void handleSubmit((values) => onSubmit(values, "PUBLISHED"))()}>{publishing ? "Working…" : isPublished ? "Update & keep published" : "Publish"}</button>
        </div>
      </div>
    ) : null,
    [id, isPublished, saving, publishing, handleSubmit],
  );

  if (loading) return <section className="workspace"><div className="py-12 text-center text-[color:var(--muted)]">Loading…</div></section>;
  if (!id) return <section className="workspace"><div className="py-12 text-center text-[color:var(--muted)]">Project not found.</div></section>;

  function toggleMember(memberId: string) {
    const current = project.memberProjects;
    const next = current.some((link) => link.memberId === memberId)
      ? current.filter((link) => link.memberId !== memberId)
      : [...current, { memberId, roleLabel: null }];
    setValue("memberProjects", next, { shouldDirty: true, shouldValidate: true });
  }

  async function handleImageSelection(files: FileList | null) {
    if (!files?.length || !project.id) return;
    const selected = Array.from(files).slice(0, 5);
    await saveProjectImagesToCache(project.id, selected, 0);
    const cached = await getProjectImagesFromCache(project.id);
    const nextImages = cached.map((item) => ({ url: item.dataUrl, isPrimary: item.isPrimary, base64: item.dataUrl, name: item.name, type: item.type }));
    setValue("caseStudy.images", nextImages, { shouldDirty: true, shouldValidate: true });
    setValue("coverUrl", nextImages.find((img) => img.isPrimary)?.url ?? nextImages[0]?.url ?? project.coverUrl, { shouldDirty: true });
  }

  function addTag(tag: string) {
    const normalized = tag.trim();
    if (!normalized) return;
    if (!tagChips.includes(normalized)) {
      setValue("tags", [...tagChips, normalized], { shouldDirty: true, shouldValidate: true });
      setTagInput("");
      setTagOptions((prev) => Array.from(new Set([...prev, normalized])).sort((a, b) => a.localeCompare(b)));
    }
  }

  function removeTag(tag: string) {
    setValue("tags", tagChips.filter((item) => item !== tag), { shouldDirty: true, shouldValidate: true });
  }

  function updateTimeline(start: string, end: string) {
    if (!start && !end) {
      setValue("timeline", null, { shouldDirty: true, shouldValidate: true });
      return;
    }
    setValue("timeline", { start, end }, { shouldDirty: true, shouldValidate: true });
  }

  return (
    <section className="workspace">
      <section className="panel" title="Chỉnh sửa thông tin chính, tag, timeline và ảnh của dự án">
        <div className="panel-head" title="Cập nhật thông tin cốt lõi của dự án: tiêu đề, slug, tóm tắt, tags, timeline và ảnh đại diện.">
          <div><h2>{project.title || "Edit project"}</h2><p>/{project.slug}</p></div>
          <SourceLocaleToggle value={project.sourceLocale} onChange={(sourceLocale) => setValue("sourceLocale", sourceLocale, { shouldDirty: true })} />
        </div>

        <div className="form">
          <div className="triple">
            <div className="field">
              <label htmlFor="p-title">Title ({project.sourceLocale})</label>
              <input id="p-title" {...register("title")} />
              {errors.title ? <p style={{ color: "var(--danger)" }}>{errors.title.message}</p> : null}
            </div>
            <div className="field">
              <label htmlFor="p-slug">Slug</label>
              <input id="p-slug" {...register("slug")} />
            </div>
            <div className="field">
              <label htmlFor="p-demo">Demo URL</label>
              <input id="p-demo" type="url" placeholder="https://…" {...register("demoUrl")} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="p-tags">Tags</label>
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input
                  id="p-tags"
                  className="flex-1"
                  list="project-tags"
                  placeholder="Web, Dashboard, CMS"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                />
                <button type="button" className="btn" onClick={() => addTag(tagInput)}>Add tag</button>
              </div>
              <datalist id="project-tags">
                {availableTagOptions.map((tag) => <option key={tag} value={tag} />)}
              </datalist>
              <div className="tags" style={{ marginTop: 0 }}>
                {tagChips.map((tag) => <button key={tag} type="button" className="tag dark" onClick={() => removeTag(tag)} style={{ cursor: "pointer" }} title="Remove tag">{tag} ×</button>)}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {availableTagOptions.slice(0, 12).map((tag) => <button key={tag} type="button" className="tag" onClick={() => addTag(tag)} title="Use this tag">+ {tag}</button>)}
              </div>
            </div>
          </div>

          <div className="field">
            <label htmlFor="p-summary">Summary ({project.sourceLocale})</label>
            <textarea id="p-summary" rows={3} placeholder="Short description of the project…" {...register("summary")} />
          </div>

          <div className="field" title="Timeline theo tháng/năm, có thể để trống">
            <label>Timeline</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto", gap: 10, alignItems: "center" }}>
              <input type="month" value={project.timeline?.start ?? ""} onChange={(e) => updateTimeline(e.target.value, project.timeline?.end ?? "")} />
              <span style={{ color: "var(--muted)" }}>-</span>
              <input type="month" value={project.timeline?.end ?? ""} onChange={(e) => updateTimeline(project.timeline?.start ?? "", e.target.value)} />
              <button className="btn" type="button" onClick={() => setValue("timeline", null, { shouldDirty: true, shouldValidate: true })}>Clear</button>
            </div>
          </div>

          <div className="field" title="Ảnh được cache local 1 ngày, chỉ upload lên R2 khi bấm Save draft hoặc Publish">
            <label>Add project images</label>
            <input type="file" accept="image/*" multiple hidden id="project-image-input" onChange={(e) => { void handleImageSelection(e.target.files); e.target.value = ""; }} />
            <label htmlFor="project-image-input" className="btn" style={{ display: "inline-flex", width: "fit-content" }}>{uploadingImages ? "Uploading…" : "UPLOAD IMAGE"}</label>
            <p style={{ color: "var(--muted)", fontSize: 12, margin: "6px 0 0" }}>Images stay local until submit.</p>
          </div>

          <div className="field">
            <label>Gallery images</label>
            {images.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: 13 }}>No images yet.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                {images.map((img, i) => (
                  <div key={`${img.url}-${i}`} className="gallery-card" style={{ position: "relative", aspectRatio: "16 / 9", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                    <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button type="button" title="Remove image" onClick={() => {
                      const next = images.filter((_, idx) => idx !== i).map((item, idx) => idx === 0 ? { ...item, isPrimary: true } : item);
                      setValue("caseStudy.images", next, { shouldDirty: true, shouldValidate: true });
                      setValue("coverUrl", next.find((item) => item.isPrimary)?.url ?? next[0]?.url ?? null, { shouldDirty: true });
                    }} style={{ position: "absolute", top: 8, right: 8, opacity: 0, transition: "opacity .2s", background: "rgba(2,6,23,.85)", color: "white", border: 0, borderRadius: 999, width: 32, height: 32, display: "grid", placeItems: "center", cursor: "pointer" }} className="gallery-trash">
                      <Trash2 size={16} />
                    </button>
                    {img.isPrimary && <span className="tag" style={{ position: "absolute", top: 8, left: 8 }}>Cover</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="panel" title="Soạn nội dung case study theo cấu trúc problem, solution, result">
        <div className="panel-head" title="Phần case study dùng để kể câu chuyện dự án theo cấu trúc problem → solution → result."><div><h2>Case study ({project.sourceLocale})</h2><p>Structured narrative: problem → solution → result.</p></div></div>
        <div className="form">
          <div className="field">
            <label htmlFor="cs-kicker">Kicker / tagline</label>
            <input id="cs-kicker" placeholder="A short, punchy subtitle" {...register("caseStudy.kicker")} />
          </div>
          <div className="tabs">
            {(["problem", "solution", "result"] as CaseTab[]).map((tab) => <button key={tab} type="button" className={`tab${caseTab === tab ? " is-active" : ""}`} onClick={() => setCaseTab(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>)}
          </div>
          {caseTab === "problem" && <div className="field"><label htmlFor="cs-problem">Problem</label><textarea id="cs-problem" rows={4} placeholder="What challenge needed solving?" {...register("caseStudy.problem")} /></div>}
          {caseTab === "solution" && <div className="field"><label htmlFor="cs-solution">Solution</label><textarea id="cs-solution" rows={4} placeholder="What approach did you take?" {...register("caseStudy.solution")} /></div>}
          {caseTab === "result" && <div className="field"><label htmlFor="cs-result">Result</label><textarea id="cs-result" rows={4} placeholder="What was the outcome?" {...register("caseStudy.result")} /></div>}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span className="kicker">Key points</span>
            <button className="btn" type="button" onClick={() => append({ label: "", text: "" })}>+ Add point</button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: 10, alignItems: "end" }}>
              <div className="field">{index === 0 && <label>Label</label>}<input placeholder="Users reached" {...register(`caseStudy.points.${index}.label` as const)} /></div>
              <div className="field">{index === 0 && <label>Text</label>}<input placeholder="50,000+ in 2 weeks" {...register(`caseStudy.points.${index}.text` as const)} /></div>
              <button className="icon-btn" type="button" style={{ color: "var(--danger)" }} onClick={() => remove(index)}>✕</button>
            </div>
          ))}
        </div>
      </section>

      <section className="panel" title="Chọn checkbox để gán member cho dự án">
        <div className="panel-head" title="Liên kết dự án với các thành viên liên quan và ghi chú vai trò của từng người."><div><h2>Project members</h2><p>Select team members involved in this project.</p></div></div>
        <div className="form">
          {members.length === 0 ? <p style={{ color: "var(--muted)", fontSize: 13 }}>No members available.</p> : (
            <div style={{ display: "grid", gap: 12 }}>
              {members.map((member) => {
                const checked = selectedMemberIds.includes(member.id);
                const linkedProject = project.memberProjects?.find((item) => item.memberId === member.id);
                return (
                  <label key={member.id} style={{ display: "grid", gridTemplateColumns: "auto auto 1fr auto", gap: 12, alignItems: "center", padding: 12, border: "1px solid var(--border)", borderRadius: 14, background: checked ? "rgba(59, 130, 246, 0.08)" : "transparent", cursor: "pointer" }}>
                    <input type="checkbox" checked={checked} onChange={() => toggleMember(member.id)} style={{ width: 18, height: 18 }} />
                    <div className="size-[52px] rounded-full overflow-hidden bg-bg">
                      <Avatar className="size-[52px]">
                        <AvatarImage src={member.avatarUrl ?? undefined} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><strong>{member.name}</strong>{member.role ? <span className="tag">{member.role}</span> : null}</div>
                      <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: 13 }}>{linkedProject?.roleLabel || "Project member"}</p>
                    </div>
                    <span className="tag">{checked ? "Linked" : "Not linked"}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
