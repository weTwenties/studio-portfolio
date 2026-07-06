import { prisma, regenerateSnapshot } from "@wetwenties/db";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const body = (await request.json().catch(() => ({}))) as { status?: "DRAFT" | "PUBLISHED" };
    const current = await prisma.member.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const nextStatus = body.status ?? (current.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED");
    const member = await prisma.member.update({
      where: { id },
      data: {
        status: nextStatus,
        publishedAt: nextStatus === "PUBLISHED" ? new Date() : current.publishedAt,
      },
    });

    const result = await regenerateSnapshot();
    return NextResponse.json({ member, snapshot: result });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to toggle publish", error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
