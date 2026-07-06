import type { PortfolioMember } from "@/types/portfolio";

type Size = "md" | "sm" | "xs";

type Props = {
  member: Pick<PortfolioMember, "name" | "avatar" | "avatarUrl">;
  size?: Size;
  className?: string;
};

const sizeClass: Record<Size, string> = {
  md: "portfolio-avatar",
  sm: "portfolio-avatar is-sm",
  xs: "portfolio-avatar is-xs",
};

export default function PortfolioAvatar({ member, size = "md", className = "" }: Props) {
  const isWide = member.avatar.length > 1;
  const classes = [sizeClass[size], isWide ? "is-wide" : "", className].filter(Boolean).join(" ");

  if (member.avatarUrl) {
    return (
      <div className={classes} aria-hidden>
        <img src={member.avatarUrl} alt="" />
      </div>
    );
  }

  return (
    <div className={classes} aria-hidden>
      {member.avatar}
    </div>
  );
}
