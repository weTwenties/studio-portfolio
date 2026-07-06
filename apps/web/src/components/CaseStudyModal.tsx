"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { CaseStudy } from "@/types/content";

type Props = {
  activeCase: CaseStudy | null;
  disclaimer?: string;
  onClose: () => void;
};

function CaseStudyGallery({ images }: { images: { url: string }[] }) {
  const gallery = useMemo(() => images.map((item) => item.url).filter(Boolean), [images]);
  const [index, setIndex] = useState(0);

  if (gallery.length === 0) return null;

  return (
    <div style={{ marginBottom: 12 }}>
      <img src={gallery[index] ?? ""} alt="" style={{ width: "100%", maxHeight: 280, objectFit: "cover", borderRadius: 12 }} />
      {gallery.length > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <button className="btn" type="button" onClick={() => setIndex((i) => (i - 1 + gallery.length) % gallery.length)}>←</button>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>{index + 1}/{gallery.length}</span>
          <button className="btn" type="button" onClick={() => setIndex((i) => (i + 1) % gallery.length)}>→</button>
        </div>
      )}
    </div>
  );
}

export default function CaseStudyModal({ activeCase, disclaimer, onClose }: Props) {
  const t = useTranslations("Ui");
  const galleryKey = activeCase?.title ?? "closed";

  return (
    <div
      className={`modal${activeCase ? " is-open" : ""}`}
      id="caseModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-panel">
        <div className="modal-top">
          <span className="tag" id="modalKicker">
            {activeCase?.kicker ?? t("caseStudy")}
          </span>
          <button
            className="modal-close magnet"
            type="button"
            aria-label={t("closeCaseStudy")}
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          {activeCase?.images?.length ? (
            <CaseStudyGallery key={galleryKey} images={activeCase.images} />
          ) : null}
          <h2 id="modalTitle">{activeCase?.title ?? t("caseStudy")}</h2>
          <p id="modalText">{activeCase?.text}</p>
          <div className="modal-points" id="modalPoints">
            {activeCase?.points.map((row) => {
              const label = row[0] ?? "";
              const text = row[1] ?? "";
              return (
                <div key={label}>
                  <strong>{label}</strong>
                  <span>{text}</span>
                </div>
              );
            })}
          </div>
          {disclaimer ? <p className="modal-disclaimer">{disclaimer}</p> : null}
        </div>
      </div>
    </div>
  );
}
