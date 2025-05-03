import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

const i18nMiddleware = createMiddleware(routing);

const withAuthMiddleware = withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register");

    console.log("middleware", { token, isAuth, isAuthPage });

    if (isAuthPage) {
      if (isAuth) {
        return i18nMiddleware(req);
        // return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return null;
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return i18nMiddleware(req);
      // return NextResponse.redirect(
      //   new URL(`/login?from=${encodeURIComponent(from)}`, req.url),
      // );
    }

    return i18nMiddleware(req);
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true;
      },
    },
  },
);

export default withAuthMiddleware;

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: [
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
    "/([\\w-]+)?/profile/(.+)",
  ],
};
