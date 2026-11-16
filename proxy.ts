import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["fr", "ar", "en"];

// Français par défaut ; on ne suit que le choix explicite du visiteur (cookie posé par le sélecteur FR · ع · EN).
function pickLocale(req: NextRequest) {
  const saved = req.cookies.get("NEXT_LOCALE")?.value;
  return saved && LOCALES.includes(saved) ? saved : "fr";
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;
  const url = req.nextUrl.clone();
  url.pathname = `/${pickLocale(req)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|media|fonts|icon|apple-icon|og\.jpg|logo|robots\.txt|sitemap\.xml|llms\.txt|.*\..*).*)"],
};
