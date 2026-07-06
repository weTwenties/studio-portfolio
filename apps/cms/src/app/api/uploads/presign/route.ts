import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { hasR2Credentials, r2, r2Bucket, r2PublicUrl } from "@/lib/r2";

const ALLOWED_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_PREFIXES = new Set(["members", "projects", "site"]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const PRESIGN_EXPIRY_SECONDS = 300;

const extensionForContentType = (contentType: string) => {
  if (contentType === "image/jpeg") return ".jpg";
  if (contentType === "image/png") return ".png";
  if (contentType === "image/webp") return ".webp";
  return "";
};

export async function POST(request: Request) {
  const body = (await request.json()) as {
    filename?: string;
    contentType?: string;
    prefix?: string;
    size?: number;
  };
  const filename = body.filename?.trim();
  const contentType = body.contentType?.trim();
  const size = body.size;

  if (!filename || !contentType) {
    return NextResponse.json({ error: "filename and contentType required" }, { status: 400 });
  }

  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
  }

  if (typeof size !== "number" || !Number.isFinite(size) || size <= 0 || size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: `File size must be between 1 byte and ${MAX_FILE_SIZE_BYTES} bytes` }, { status: 400 });
  }

  const prefix = body.prefix?.trim() || "projects";
  if (!ALLOWED_PREFIXES.has(prefix)) {
    return NextResponse.json({ error: "Invalid upload prefix" }, { status: 400 });
  }

  if (!hasR2Credentials || !r2Bucket || !r2PublicUrl) {
    return NextResponse.json(
      {
        error:
          "R2 not configured. Required envs: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL",
      },
      { status: 503 },
    );
  }

  const ext = filename.includes(".") ? filename.slice(filename.lastIndexOf(".")) : extensionForContentType(contentType);
  const key = `${prefix}/${Date.now()}-${crypto.randomUUID()}${ext}`;

  const uploadUrl = await getSignedUrl(
    r2,
    new PutObjectCommand({ Bucket: r2Bucket, Key: key, ContentType: contentType }),
    { expiresIn: PRESIGN_EXPIRY_SECONDS },
  );

  const publicUrl = `${r2PublicUrl.replace(/\/$/, "")}/${key}`;
  return NextResponse.json({ uploadUrl, publicUrl, key });
}
