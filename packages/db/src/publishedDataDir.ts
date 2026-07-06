import path from "node:path";
import { fileURLToPath } from "node:url";

/** Published snapshot JSON (members, projects, site) — shared by CMS and web. */
export function getPublishedDataDir(): string {
  if (process.env.PUBLISHED_DATA_DIR) {
    return path.isAbsolute(process.env.PUBLISHED_DATA_DIR)
      ? process.env.PUBLISHED_DATA_DIR
      : path.resolve(process.cwd(), process.env.PUBLISHED_DATA_DIR);
  }
  return path.join(path.dirname(fileURLToPath(import.meta.url)), "../../../data");
}
