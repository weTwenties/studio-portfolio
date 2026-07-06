import { NextResponse } from "next/server";
import {
  defaultLocale,
  isValidLocale,
  localeCookieName,
  type AppLocale,
} from "@/i18n/config";

type LocaleRequest = {
  locale?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LocaleRequest;
  const requestedLocale = body.locale ?? "";
  const locale: AppLocale = isValidLocale(requestedLocale)
    ? requestedLocale
    : defaultLocale;

  const response = NextResponse.json({ ok: true, locale });
  response.cookies.set(localeCookieName, locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
