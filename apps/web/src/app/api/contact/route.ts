import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const leadsFile = path.join(process.cwd(), ".local", "contact-leads.ndjson");

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      project?: string;
      brief?: string;
    };
    const lead = { name: String(body.name ?? "").trim(), email: String(body.email ?? "").trim(), project: String(body.project ?? "").trim(), brief: String(body.brief ?? "").trim(), createdAt: new Date().toISOString() };
    if (!lead.name || !lead.email) return NextResponse.json({ message: "Missing name or email" }, { status: 400 });
    await mkdir(path.dirname(leadsFile), { recursive: true });
    await appendFile(leadsFile, `${JSON.stringify(lead)}\n`, "utf8");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: "Failed to save contact lead", error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
