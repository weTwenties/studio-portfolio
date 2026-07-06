import { prisma } from "@wetwenties/db";
import { NextResponse } from "next/server";

type ReorderBody = {
  ids?: string[];
};

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as ReorderBody;
    if (!Array.isArray(body.ids) || body.ids.some((id) => typeof id !== "string" || !id.trim())) {
      return NextResponse.json({ message: "Invalid member order payload" }, { status: 400 });
    }

    await prisma.$transaction(
      body.ids.map((id, sortOrder) =>
        prisma.member.update({
          where: { id },
          data: { sortOrder },
        }),
      ),
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: "Failed to reorder members", error: message }, { status: 500 });
  }
}
