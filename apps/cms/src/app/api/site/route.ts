import { prisma, regenerateSnapshot } from "@wetwenties/db";
import { NextResponse } from "next/server";
import { deserializeSite, invalidateTranslationCache, siteInputToData } from "@/lib/serialize";

export async function GET() {
  const site = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return NextResponse.json({ site: deserializeSite(site) });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const data = siteInputToData(body);
    const previous = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

    const site = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...data, ...invalidateTranslationCache() },
      update: { ...data, ...invalidateTranslationCache() },
    });

    if (previous?.translationHash || previous?.translations || previous) {
      await regenerateSnapshot();
    }

    return NextResponse.json({ site: deserializeSite(site) });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update site", error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
