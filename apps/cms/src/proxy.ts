import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const REALM = 'Basic realm="Studio Portfolio CMS", charset="UTF-8"';

const unauthorized = () =>
  new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": REALM },
  });

export function proxy(request: NextRequest) {
  const user = process.env.CMS_USER;
  const password = process.env.CMS_PASSWORD;

  if (user && password) {
    const header = request.headers.get("authorization");
    if (!header?.startsWith("Basic ")) return unauthorized();

    const decoded = atob(header.slice(6));
    const sep = decoded.indexOf(":");
    const providedUser = sep === -1 ? decoded : decoded.slice(0, sep);
    const providedPass = sep === -1 ? "" : decoded.slice(sep + 1);

    if (providedUser !== user || providedPass !== password) return unauthorized();
  }

  const response = NextResponse.next();
  response.headers.set("x-app-name", "cms");
  response.headers.set("x-request-host", request.nextUrl.host);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
