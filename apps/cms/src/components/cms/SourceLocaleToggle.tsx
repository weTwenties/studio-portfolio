"use client";

export type SourceLocale = "vi" | "en";

type SourceLocaleToggleProps = {
  value: SourceLocale;
  onChange: (next: SourceLocale) => void;
  className?: string;
};

export default function SourceLocaleToggle({
  value,
  onChange,
  className = "btn",
}: SourceLocaleToggleProps) {
  const next = value === "vi" ? "en" : "vi";

  return (
    <button
      type="button"
      className={className}
      onClick={() => onChange(next)}
      title={`Switch source locale to ${next.toUpperCase()}`}
      aria-label={`Source locale is ${value.toUpperCase()}, switch to ${next.toUpperCase()}`}
    >
      Source locale: {value.toUpperCase()}
    </button>
  );
}
