import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, LOCALE_COOKIE, getLocaleFromHeader, isValidLocale } from "./lib/i18n/config";

/**
 * i18n Middleware — KinetixFitt Web
 * - Detecta locale por cookie (NEXT_LOCALE) -> Accept-Language header -> default 'es'
 * - Redirect en "/" según Accept-Language -> /en o /es
 * - Prefija cookie y header x-locale cuando ya hay locale en pathname
 * - Ignora _next, api, archivos estáticos
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Bypass static assets, API, Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_vercel") ||
    // files with extension: favicon.ico, manifest.json, .png, .jpg, etc
    /\.[^/]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // If pathname already has locale prefix, persist cookie + header
  const hasLocalePrefix = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocalePrefix) {
    const locale = pathname.split("/")[1];
    if (isValidLocale(locale)) {
      const res = NextResponse.next();
      // persist choice 1 year
      res.cookies.set(LOCALE_COOKIE, locale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
      res.headers.set("x-locale", locale);
      res.headers.set("x-middleware-cache", "no-cache");
      return res;
    }
    return NextResponse.next();
  }

  // Resolve locale: cookie -> Accept-Language -> default
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const acceptLanguage = request.headers.get("accept-language");
  const locale =
    isValidLocale(cookieLocale ?? null) ? (cookieLocale as typeof locales[number]) : getLocaleFromHeader(acceptLanguage);

  // Only auto-redirect root "/" to locale -> /en or /es
  // This satisfies Accept-Language -> /en /es routing without breaking /legal/* etc.
  // If you need all routes prefixed, uncomment the generic redirect below.
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    // preserve search params
    const res = NextResponse.redirect(url, 307);
    res.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    res.headers.set("x-locale", locale);
    return res;
  }

  // For non-root without locale, we do NOT force-redirect to avoid 404 on existing
  // non-prefixed routes (/legal/*, /auth/*, /dashboard etc).
  // We just set a header so server components can read preferred locale.
  const res = NextResponse.next();
  res.headers.set("x-locale", locale);
  // Also set Vary header for correct caching per language
  res.headers.set("Vary", "Accept-Language, Cookie");
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api
     * - _next/static, _next/image
     * - favicon, manifest, sw, icons, opengraph-image, twitter-image etc (handled by bypass regex anyway)
     * But keep "/" and "/en/*" "/es/*" for locale logic.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons|opengraph-image|twitter-image|robots.txt|sitemap.xml).*)",
  ],
};
