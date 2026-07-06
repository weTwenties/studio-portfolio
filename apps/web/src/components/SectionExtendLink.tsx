import Link from "next/link";

type Props = {
  href: string;
  label: string;
};

export default function SectionExtendLink({ href, label }: Props) {
  return (
    <div className="section-extend reveal">
      <Link className="btn secondary magnet section-extend-btn" href={href}>
        <span>{label}</span>
        <span className="section-extend-icon" aria-hidden>
          →
        </span>
      </Link>
    </div>
  );
}
