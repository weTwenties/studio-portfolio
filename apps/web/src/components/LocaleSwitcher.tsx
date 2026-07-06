"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { AppLocale } from "@/i18n/config";

export default function LocaleSwitcher() {
  const t = useTranslations("Ui");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: AppLocale) => {
    startTransition(async () => {
      await fetch("/api/locale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locale: next }),
      });
      router.refresh();
    });
  };

  return (
    <div className="locale-switch" role="group" aria-label={t("language")}>
      <button
        type="button"
        className={`locale-switch-btn magnet${locale === "vi" ? " is-active" : ""}`}
        aria-pressed={locale === "vi"}
        aria-label={t("switchToVi")}
        disabled={isPending}
        onClick={() => switchTo("vi")}
      >
        VI
      </button>
      <button
        type="button"
        className={`locale-switch-btn magnet${locale === "en" ? " is-active" : ""}`}
        aria-pressed={locale === "en"}
        aria-label={t("switchToEn")}
        disabled={isPending}
        onClick={() => switchTo("en")}
      >
        EN
      </button>
    </div>
  );
}
