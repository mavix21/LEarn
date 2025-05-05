import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";

import { locales } from "./app/_shared/i18n/locales";
import { routing } from "./i18n/routing";

const PUBLIC_PATHS = [
  "/landing",
  "/feed",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/unauthorized",
  "/contact",
  "/about",
  "/help",
  "/privacy-policy",
  "/terms-of-service",
  "/cookie-policy",
  "/end-user-license-agreement",
];

const PROTECTED_PATHS = [
  // Fill this array with the routes you want to protect, e.g.:
  "/dashboard",
  "/settings",
  "/profile",
  // Add more protected routes as needed
];

const i18nMiddleware = createMiddleware(routing);

const publicPathRegex = RegExp(
  `^(/(${locales.join("|")}))?(${PUBLIC_PATHS.map((p) => (p === "/" ? "" : p)).join("|")})/?$`,
  "i",
);

const isAuthPage = (pathname: string) =>
  pathname.startsWith("/login") || pathname.startsWith("/register");

// Helper to strip locale prefix from pathname
const stripLocale = (pathname: string) => {
  const localePattern = new RegExp(`^/(${locales.join("|")})`);
  return pathname.replace(localePattern, "");
};

const isProtectedRoute = (pathname: string) => {
  const pathWithoutLocale = stripLocale(pathname);
  return PROTECTED_PATHS.some(
    (protectedPath) =>
      pathWithoutLocale === protectedPath ||
      pathWithoutLocale.startsWith(`${protectedPath}/`),
  );
};

const withAuthMiddleware = withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const { pathname, search } = req.nextUrl;
    console.log("****************** middleware ******************");

    // 1. Auth pages: redirect to /feed if already authenticated
    if (isAuthPage(pathname)) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/feed", req.url));
      }
      return null;
    }

    // 2. Public pages: always allow (with i18n)
    if (publicPathRegex.test(pathname)) {
      return i18nMiddleware(req);
    }

    // 3. Protected pages: redirect to /login if not authenticated
    if (isProtectedRoute(pathname) && !isAuth) {
      let from = pathname;
      if (search) from += search;
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url),
      );
    }

    // 4. Authenticated and not public: allow (with i18n)
    return i18nMiddleware(req);
  },
  {
    callbacks: {
      async authorized() {
        // Always call the middleware function above
        return true;
      },
    },
  },
);

export default withAuthMiddleware;

export const config = {
  matcher: [
    // Exclude static, api, _next, _vercel, src, exports, and files with extensions
    "/((?!api|trpc|_next|_vercel|src|exports|public|assets|static|.*\\..*).*)",
  ],
};
