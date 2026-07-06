import { S3Client } from "@aws-sdk/client-s3";

const r2AccountId = process.env.R2_ACCOUNT_ID ?? "";
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID ?? "";
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? "";

export const hasR2Credentials = Boolean(r2AccountId && r2AccessKeyId && r2SecretAccessKey);

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
  },
});

export const r2Bucket = process.env.R2_BUCKET ?? "";
export const r2PublicUrl = process.env.R2_PUBLIC_URL ?? "";
