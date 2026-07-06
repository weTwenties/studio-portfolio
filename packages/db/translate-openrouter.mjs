const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
const DEFAULT_MODEL = "baidu/cobuddy:free";

export const extractJson = (raw) => {
  const fence = raw.match(/```json\s*([\s\S]*?)```/i);
  return JSON.parse((fence ? fence[1] : raw).trim());
};

export const readOpenRouterConfig = () => {
  const apiKey = process.env.OPENROUTER_API_KEY ?? process.env.OPENROUTER;
  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY (or OPENROUTER) in environment");
  }

  return {
    apiKey,
    model: process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL,
    referer: process.env.OPENROUTER_HTTP_REFERER ?? "http://localhost:3000",
    title: process.env.OPENROUTER_APP_TITLE ?? "Studio Portfolio",
  };
};

/** @param {string} sourceLocale */
export const buildBilingualPrompt = (source, sourceLocale) => {
  const other = sourceLocale === "vi" ? "en" : "vi";
  return [
    "You are a bilingual localization engine.",
    "",
    "Return ONLY valid JSON (no markdown, no commentary) in this exact shape:",
    '{ "vi": <object>, "en": <object> }',
    "",
    "Rules:",
    "- Mirror the source JSON keys, nesting, and array lengths exactly in both vi and en.",
    `- sourceLocale is "${sourceLocale}": copy source string values unchanged into the "${sourceLocale}" object.`,
    `- Translate string values into ${other === "vi" ? "Vietnamese" : "English"} for the "${other}" object.`,
    "- Do not translate: URLs, slugs, IDs, emails, brand names (e.g. Studio Portfolio), person names.",
    "- Keep placeholders ({name}, {email}), \\n, and HTML tags unchanged.",
    "- Keep null and empty strings unchanged.",
    "- For { href, slug, id, name, email } fields: keep as in source unless clearly UI label text.",
    "",
    `sourceLocale: "${sourceLocale}"`,
    "source:",
    JSON.stringify(source, null, 2),
  ].join("\n");
};

/**
 * @template {Record<string, unknown>} T
 * @param {T} source
 * @param {"vi" | "en"} sourceLocale
 * @returns {Promise<{ vi: T, en: T }>}
 */
export const translateBilingual = async (source, sourceLocale) => {
  const config = readOpenRouterConfig();
  const prompt = buildBilingualPrompt(source, sourceLocale);

  const response = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": config.referer,
      "X-Title": config.title,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter request failed (${response.status}): ${await response.text()}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("OpenRouter returned no content");

  const parsed = extractJson(text);
  if (!parsed?.vi || !parsed?.en) {
    throw new Error('Expected JSON shape { "vi": {...}, "en": {...} }');
  }

  return { vi: parsed.vi, en: parsed.en };
};
