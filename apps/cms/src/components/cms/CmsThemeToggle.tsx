"use client";

import { useSyncExternalStore } from "react";

const THEME_KEY = "studio-portfolio-cms-theme";
const THEME_EVENT = "studio-portfolio-cms-theme-change";

type CmsThemePreference = "system" | "light" | "dark";

function resolveTheme(stored: string | null): "light" | "dark" {
  if (stored === "dark") return "dark";
  if (stored === "light") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyThemeFromStorage() {
  const stored = localStorage.getItem(THEME_KEY);
  document.documentElement.setAttribute(
    "data-theme",
    resolveTheme(stored),
  );
}

function setPreference(next: CmsThemePreference) {
  if (next === "system") {
    localStorage.removeItem(THEME_KEY);
  } else {
    localStorage.setItem(THEME_KEY, next);
  }
  applyThemeFromStorage();
  window.dispatchEvent(new Event(THEME_EVENT));
}

function subscribe(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onMq = () => {
    if (localStorage.getItem(THEME_KEY) != null) return;
    applyThemeFromStorage();
    onStoreChange();
  };
  mq.addEventListener("change", onMq);
  window.addEventListener(THEME_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    mq.removeEventListener("change", onMq);
    window.removeEventListener(THEME_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot(): CmsThemePreference {
  const s = localStorage.getItem(THEME_KEY);
  return s === "light" || s === "dark" ? s : "system";
}

function getServerSnapshot(): CmsThemePreference {
  return "system";
}

export default function CmsThemeToggle() {
  const preference = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
      <span className="hidden sm:inline">Theme</span>
      <select
        className="cursor-pointer rounded-lg border px-2 py-1.5 text-xs outline-none [border-color:var(--strong-border)] [background:var(--surface)] [color:var(--fg)]"
        value={preference}
        onChange={(e) => {
          setPreference(e.target.value as CmsThemePreference);
        }}
        aria-label="Theme"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
