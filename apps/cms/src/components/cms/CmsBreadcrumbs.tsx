import type { ReactNode } from "react";

type Crumb = {
  label: ReactNode;
};

type Props = {
  crumbs: Crumb[];
  trailing?: ReactNode;
};

export default function CmsBreadcrumbs({ crumbs, trailing }: Props) {
  return (
    <div className="breadcrumbs">
      {crumbs.map((crumb, index) => (
        <span key={index}>
          {crumb.label}
          {index < crumbs.length - 1 ? <span> / </span> : null}
        </span>
      ))}
      {trailing}
    </div>
  );
}
