import { prisma } from "@wetwenties/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, database: "reachable" });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        database: "error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 503 },
    );
  }
}
