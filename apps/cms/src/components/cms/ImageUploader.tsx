"use client";

import { useState } from "react";

type Props = {
  value?: string | null;
  onChange: (url: string) => void;
  prefix?: string;
  label?: string;
  maxFiles?: number;
  multiple?: boolean;
};

export function ImageUploader({ value, onChange, prefix, label = "Upload image", maxFiles = 1, multiple }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSelectMultiple = multiple ?? maxFiles > 1;
  const inputAccept = "image/*";

  async function uploadFile(file: File) {
    const presign = await fetch("/api/uploads/presign", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type, prefix, size: file.size }),
    });
    if (!presign.ok) throw new Error(await presign.text());
    const { uploadUrl, publicUrl } = (await presign.json()) as { uploadUrl: string; publicUrl: string };

    const put = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "content-type": file.type },
      body: file,
    });
    if (!put.ok) throw new Error(`Upload failed (${put.status})`);

    return publicUrl;
  }

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files).slice(0, Math.max(1, maxFiles));
    if (list.length === 0) return;

    setBusy(true);
    setError(null);
    try {
      const uploaded = await Promise.all(list.map((file) => uploadFile(file)));
      onChange(uploaded[0] ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {value ? (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }} />
          <button type="button" onClick={() => onChange("")} disabled={busy}>
            Remove
          </button>
        </div>
      ) : null}
      <label style={{ display: "inline-block" }}>
        <span className="btn">{busy ? "Uploading…" : label}</span>
        <input
          type="file"
          accept={inputAccept}
          hidden
          multiple={canSelectMultiple}
          disabled={busy}
          onChange={(event) => {
            const files = event.target.files;
            if (files) void handleFiles(files);
            event.target.value = "";
          }}
        />
      </label>
      <input
        type="url"
        placeholder="…or paste URL"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <p style={{ color: "crimson", fontSize: 12 }}>{error}</p> : null}
    </div>
  );
}
