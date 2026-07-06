import { prisma } from "@wetwenties/db";
import { NextResponse } from "next/server";
import { deserializeProject, projectInputToData } from "@/lib/serialize";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    include: { memberProjects: { include: { member: true } } },
  });
  return NextResponse.json({ projects: projects.map(deserializeProject) });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.slug || !body.title) {
      return NextResponse.json({ message: "Missing slug or title" }, { status: 400 });
    }
    const project = await prisma.project.create({ data: projectInputToData(body) });
    return NextResponse.json({ project: deserializeProject(project) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const isReadonlyDb = message.toLowerCase().includes("readonly database");
    return NextResponse.json(
      {
        message: isReadonlyDb ? "Failed to create project: database is read-only. Check DATABASE_URL file permissions." : "Failed to create project",
        error: message,
      },
      { status: 500 },
    );
  }
}
