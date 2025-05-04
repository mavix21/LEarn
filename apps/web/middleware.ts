import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";

import { locales, routing } from "./i18n/routing";

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
    console.log("****************** middleware ******************");
    const token = await getToken({ req });
    const isAuth = !!token;
    const { pathname, search } = req.nextUrl;

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
    // Skip Next.js internals and all static files, unless found in search params
    // "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
