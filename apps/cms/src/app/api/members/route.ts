import { prisma } from "@wetwenties/db";
import { NextResponse } from "next/server";
import { deserializeMember, memberInputToData } from "@/lib/serialize";

export async function GET() {
  const members = await prisma.member.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    include: { memberProjects: { include: { project: true } } },
  });
  return NextResponse.json({ members: members.map(deserializeMember) });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.slug || !body.name) {
      return NextResponse.json({ message: "Missing slug or name" }, { status: 400 });
    }
    const member = await prisma.member.create({ data: memberInputToData(body) });
    return NextResponse.json({ member: deserializeMember(member) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const isReadonlyDb = message.toLowerCase().includes("readonly database");
    return NextResponse.json(
      {
        message: isReadonlyDb ? "Failed to create member: database is read-only. Check DATABASE_URL file permissions." : "Failed to create member",
        error: message,
      },
      { status: 500 },
    );
  }
}
