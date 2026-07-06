import { prisma, regenerateSnapshot } from "@wetwenties/db";
import { NextResponse } from "next/server";
import { deserializeMember, invalidateTranslationCache, memberInputToData } from "@/lib/serialize";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      memberProjects: {
        include: {
          project: {
            include: {
              memberProjects: { include: { member: true } },
            },
          },
        },
      },
    },
  });
  if (!member) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ member: deserializeMember(member) });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const body = await request.json() as { memberProjects?: { projectId: string; roleLabel: string | null }[] };
    const data = memberInputToData(body);
    const member = await prisma.$transaction(async (tx) => {
      const updated = await tx.member.update({
        where: { id },
        data: { ...data, ...invalidateTranslationCache() },
      });
      if (Array.isArray(body.memberProjects)) {
        await tx.memberProject.deleteMany({ where: { memberId: id } });
        if (body.memberProjects.length > 0) {
          await tx.memberProject.createMany({
            data: body.memberProjects.map((link) => ({ memberId: id, projectId: link.projectId, roleLabel: link.roleLabel || null })),
          });
        }
      }
      return updated;
    });
    const refreshed = await prisma.member.findUnique({ where: { id }, include: { memberProjects: { include: { project: true } } } });
    if (member.status === "PUBLISHED") {
      await regenerateSnapshot();
    }
    return NextResponse.json({ member: deserializeMember(refreshed ?? member) });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update member", error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const member = await prisma.member.delete({ where: { id } });
    if (member.status === "PUBLISHED") {
      await regenerateSnapshot();
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete member", error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
