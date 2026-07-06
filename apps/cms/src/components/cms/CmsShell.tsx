"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCmsEditorStore } from "@/store/cmsEditorStore";
import type { ReactNode } from "react";
import CmsPreviewModal from "./CmsPreviewModal";
import { CmsTopbarSlotProvider } from "./CmsTopbarSlot";

const contentNav = [
  { href: "/", label: "Portfolio", count: "3" },
  { href: "/projects", label: "Projects", count: "3" },
  { href: "/members", label: "Team", count: "4" },
  { href: "/services", label: "Services", count: "3" },
  { href: "/cta", label: "CTA", count: "1" },
];

const publishingNav = [
  { href: "/seo", label: "SEO metadata", count: "82" },
  { href: "/preview-queue", label: "Preview queue", count: "5" },
  { href: "/versions", label: "Version history", count: "12" },
];

const systemNav = [{ href: "/settings", label: "Settings", count: "6" }];

function getBreadcrumb(pathname: string): [string, string] {
  if (pathname === "/") return ["Landing page", "Content Studio"];
  if (pathname === "/members") return ["Content", "Team"];
  if (pathname.startsWith("/members/")) return ["Team", "Edit member"];
  if (pathname === "/projects") return ["Content", "Projects"];
  if (pathname.startsWith("/projects/")) return ["Projects", "Edit project"];
  if (pathname === "/services") return ["Content", "Services"];
  if (pathname === "/cta") return ["Content", "CTA"];
  if (pathname === "/seo") return ["Publishing", "SEO metadata"];
  if (pathname === "/preview-queue") return ["Publishing", "Preview queue"];
  if (pathname === "/versions") return ["Publishing", "Version history"];
  if (pathname === "/settings") return ["System", "Settings"];
  return ["CMS", "Studio Portfolio"];
}

function getPageDescription(pathname: string): string {
  if (pathname === "/") {
    return "Dashboard tổng quan: bảng Portfolio, Services, SEO snapshot, editor project nhanh, team activity và CTA config.";
  }
  if (pathname === "/projects") {
    return "Quản lý danh sách Projects: tạo mới, sắp xếp lại thứ tự, xóa và điều hướng vào trang chỉnh sửa chi tiết.";
  }
  if (pathname.startsWith("/projects/")) {
    return "Chỉnh sửa chi tiết một project: tiêu đề, ảnh bìa, gallery, tags, demo URL, case study (Problem / Solution / Result).";
  }
  if (pathname === "/members") {
    return "Quản lý danh sách thành viên: tạo, sắp xếp, xóa và mở trang chỉnh sửa profile.";
  }
  if (pathname.startsWith("/members/")) {
    return "Chỉnh sửa profile member: avatar, bio (VI/EN), kỹ năng, social, link CV, trạng thái draft / publish.";
  }
  if (pathname === "/services") {
    return "Cấu hình ba thẻ Services hiển thị trên landing: tiêu đề, label, mô tả, dự án liên kết, trạng thái và thứ tự.";
  }
  if (pathname === "/cta") {
    return "Cấu hình khối CTA cuối trang: headline, supporting copy, button text, contact email, submission mode và success message.";
  }
  if (pathname === "/seo") {
    return "Quản lý metadata SEO: page title, meta description, canonical URL, OG image, kèm thanh readiness theo từng tiêu chí.";
  }
  if (pathname === "/preview-queue") {
    return "Theo dõi pipeline draft theo trạng thái Edited / Needs preview / Ready trước khi publish landing page.";
  }
  if (pathname === "/versions") {
    return "Lịch sử các phiên bản đã publish: xem lại, restore, hoặc tạo snapshot mới phục vụ rollback và client review.";
  }
  if (pathname === "/settings") {
    return "Cấu hình workspace: brand, locale, footer, SEO mặc định, navigation links và theme cho CMS.";
  }
  return "Studio Portfolio CMS workspace.";
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function CmsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [section, page] = getBreadcrumb(pathname);
  const description = getPageDescription(pathname);
  const isRootPage = pathname === "/";
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [published, setPublished] = useState(false);
  const [topbarSlot, setTopbarSlot] = useState<ReactNode | null>(null);
  const resetEditorState = useCmsEditorStore((s) => s.resetEditorState);

  useEffect(() => {
    resetEditorState();
  }, [pathname, resetEditorState]);

  const publishChanges = () => {
    setPublished(true);
    setIsPreviewOpen(false);
  };

  return (
    <div className="shell">
      <aside className="sidebar" aria-label="CMS navigation">
        <div className="brand">
          <div className="mark">SP</div>
          <div>
            <strong>Studio Portfolio CMS</strong>
            <span>Landing content manager</span>
          </div>
        </div>

        <nav className="nav-group">
          <p className="nav-title">Content</p>
          {contentNav.map(({ href, label, count }) => {
            const active = isActive(pathname, href);
            return (
              <Link key={href} href={href} className={`nav-item${active ? " is-active" : ""}`}>
                <span>{label}</span>
                <span className="count">{count}</span>
              </Link>
            );
          })}
        </nav>

        <nav className="nav-group">
          <p className="nav-title">Publishing</p>
          {publishingNav.map(({ href, label, count }) => {
            const active = isActive(pathname, href);
            return (
              <Link key={href} href={href} className={`nav-item${active ? " is-active" : ""}`}>
                <span>{label}</span>
                <span className="count">{count}</span>
              </Link>
            );
          })}
        </nav>

        <nav className="nav-group">
          <p className="nav-title">System</p>
          {systemNav.map(({ href, label, count }) => {
            const active = isActive(pathname, href);
            return (
              <Link key={href} href={href} className={`nav-item${active ? " is-active" : ""}`}>
                <span>{label}</span>
                <span className="count">{count}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <strong>Draft guard</strong>
          <p>5 edited fields are staged. Review preview before publishing to the landing page.</p>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          {isRootPage ? (
            <>
              <div className="breadcrumbs">
                <span>{section}</span>
                <span>/</span>
                <strong>{page}</strong>
                <button
                  type="button"
                  className="info-btn"
                  data-tooltip={description}
                  aria-label={`About ${page}`}
                  title={description}
                >
                  i
                </button>
              </div>
              <div className="top-actions">
                <span className="status-pill">
                  <span className={`dot${published ? " success" : ""}`} />
                  {published ? "Published just now" : "Draft changes pending"}
                </span>
                <button className="btn ghost" type="button" onClick={() => setIsPreviewOpen(true)}>
                  Open live preview
                </button>
                <button className="btn primary" type="button" onClick={publishChanges}>
                  Publish changes
                </button>
              </div>
            </>
          ) : topbarSlot ? (
            topbarSlot
          ) : (
            <div className="breadcrumbs">
              <span>{section}</span>
              <span>/</span>
              <strong>{page}</strong>
            </div>
          )}
        </header>
        <CmsTopbarSlotProvider onSlotChange={setTopbarSlot}>
          {children}
        </CmsTopbarSlotProvider>
      </main>
      <CmsPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onPublish={publishChanges}
      />
    </div>
  );
}
