import type { Metadata } from "next";
import "./globals.css";
import CmsShell from "@/components/cms/CmsShell";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Studio Portfolio CMS",
  description: "Landing content manager",
};

const themeInitScript = `
(function () {
  try {
    var k = "studio-portfolio-cms-theme";
    var s = localStorage.getItem(k);
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var resolved = s === "dark" ? "dark" : s === "light" ? "light" : prefersDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", resolved);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning>
        <CmsShell>
          {children}
          <Toaster richColors position="top-center" />
        </CmsShell>
      </body>
    </html>
  );
}
