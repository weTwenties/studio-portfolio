import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import CustomCursor from "@/components/CustomCursor";
import { pickLocale, readSiteSnapshot } from "@/lib/snapshot";
import "./globals.css";

export async function generateMetadata() {
  const [t, locale, site] = await Promise.all([getTranslations("Metadata"), getLocale(), readSiteSnapshot()]);
  const safeLocale = locale as "vi" | "en";

  return {
    title: pickLocale(site?.seoTitle, safeLocale) || t("title"),
    description: pickLocale(site?.seoDescription, safeLocale) || t("description"),
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CustomCursor />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
