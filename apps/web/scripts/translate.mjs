import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { translateBilingual } from "../../../packages/db/translate-openrouter.mjs";

const ROOT = process.cwd();
const MESSAGES_DIR = path.join(ROOT, "messages");

const parseSourceLocale = () => {
  const arg = process.argv.find((a) => a.startsWith("--source-locale="));
  const value = arg?.replace("--source-locale=", "").trim();
  if (value === "vi" || value === "en") return value;
  return "en";
};

const parseSourceFile = (sourceLocale) => {
  const arg = process.argv.find((a) => a.startsWith("--source-file="));
  if (arg) return arg.replace("--source-file=", "").trim();
  return path.join(MESSAGES_DIR, `${sourceLocale}.json`);
};

const run = async () => {
  const sourceLocale = parseSourceLocale();
  const sourceArg = parseSourceFile(sourceLocale);
  const sourcePath = path.isAbsolute(sourceArg) ? sourceArg : path.join(ROOT, sourceArg);

  const source = JSON.parse(await readFile(sourcePath, "utf8"));
  console.log(`OpenRouter bilingual translate (sourceLocale=${sourceLocale})`);

  const { vi, en } = await translateBilingual(source, sourceLocale);

  const viPath = path.join(MESSAGES_DIR, "vi.json");
  const enPath = path.join(MESSAGES_DIR, "en.json");

  await Promise.all([
    writeFile(viPath, `${JSON.stringify(vi, null, 2)}\n`, "utf8"),
    writeFile(enPath, `${JSON.stringify(en, null, 2)}\n`, "utf8"),
  ]);

  console.log(`Wrote ${viPath}`);
  console.log(`Wrote ${enPath}`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
