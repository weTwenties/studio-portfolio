"use client";

import { useEffect, useMemo, useState } from "react";

type CmsPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
};

type PreviewRoute = {
  id: string;
  label: string;
  path: string;
};

type PreviewViewport = "desktop" | "mobile";

const routes: PreviewRoute[] = [
  { id: "home", label: "Home", path: "/" },
  { id: "team", label: "Team", path: "/team" },
];

function getPreviewBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_PREVIEW_URL;
  if (fromEnv && fromEnv.length > 0) return fromEnv.replace(/\/$/, "");
  return "http://localhost:3000";
}

export default function CmsPreviewModal({
  isOpen,
  onClose,
  onPublish,
}: CmsPreviewModalProps) {
  const [activeRouteId, setActiveRouteId] = useState<string>(routes[0].id);
  const [viewport, setViewport] = useState<PreviewViewport>("desktop");
  const [reloadKey, setReloadKey] = useState(0);

  const baseUrl = useMemo(() => getPreviewBaseUrl(), []);
  const activeRoute = routes.find((route) => route.id === activeRouteId) ?? routes[0];
  const previewUrl = `${baseUrl}${activeRoute.path}`;

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="preview-modal is-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
      onMouseDown={onClose}
    >
      <div className="preview-panel" onMouseDown={(event) => event.stopPropagation()}>
        <div className="preview-top">
          <div className="preview-top-meta">
            <strong id="preview-title">Live preview</strong>
            <span className="tag">Draft v13</span>
            <span className="preview-url" title={previewUrl}>{previewUrl}</span>
          </div>

          <div className="preview-toolbar">
            <div className="tabs preview-tabs">
              {routes.map((route) => (
                <button
                  key={route.id}
                  type="button"
                  className={`tab${activeRouteId === route.id ? " is-active" : ""}`}
                  onClick={() => setActiveRouteId(route.id)}
                >
                  {route.label}
                </button>
              ))}
            </div>

            <div className="tabs preview-tabs">
              <button
                type="button"
                className={`tab${viewport === "desktop" ? " is-active" : ""}`}
                onClick={() => setViewport("desktop")}
              >
                Desktop
              </button>
              <button
                type="button"
                className={`tab${viewport === "mobile" ? " is-active" : ""}`}
                onClick={() => setViewport("mobile")}
              >
                Mobile
              </button>
            </div>

            <div className="actions">
              <button
                className="btn"
                type="button"
                onClick={() => setReloadKey((value) => value + 1)}
              >
                Reload
              </button>
              <a className="btn" href={previewUrl} target="_blank" rel="noreferrer">
                Open in tab
              </a>
              <button className="btn" type="button" onClick={onClose}>
                Close
              </button>
              <button className="btn primary" type="button" onClick={onPublish}>
                Publish from preview
              </button>
            </div>
          </div>
        </div>

        <div className={`preview-frame is-${viewport}`}>
          <div className="preview-stage">
            <iframe
              key={`${activeRoute.id}-${viewport}-${reloadKey}`}
              src={previewUrl}
              title={`Studio Portfolio ${activeRoute.label} preview`}
              className="preview-iframe"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
