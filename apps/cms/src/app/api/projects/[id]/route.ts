import { prisma, regenerateSnapshot } from "@wetwenties/db";
import { NextResponse } from "next/server";
import { deserializeProject, invalidateTranslationCache, projectInputToData } from "@/lib/serialize";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { memberProjects: { include: { member: true } } },
  });
  if (!project) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ project: deserializeProject(project) });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const body = await request.json() as { memberProjects?: { memberId: string; roleLabel: string | null }[] };
    const data = projectInputToData(body);
    const project = await prisma.$transaction(async (tx) => {
      const updated = await tx.project.update({
        where: { id },
        data: { ...data, ...invalidateTranslationCache() },
      });
      if (Array.isArray(body.memberProjects)) {
        await tx.memberProject.deleteMany({ where: { projectId: id } });
        if (body.memberProjects.length > 0) {
          await tx.memberProject.createMany({
            data: body.memberProjects.map((link) => ({ projectId: id, memberId: link.memberId, roleLabel: link.roleLabel || null })),
          });
        }
      }
      return updated;
    });
    const refreshed = await prisma.project.findUnique({ where: { id }, include: { memberProjects: { include: { member: true } } } });
    if (project.status === "PUBLISHED") {
      await regenerateSnapshot();
    }
    return NextResponse.json({ project: deserializeProject(refreshed ?? project) });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update project", error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const project = await prisma.project.delete({ where: { id } });
    if (project.status === "PUBLISHED") {
      await regenerateSnapshot();
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete project", error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
