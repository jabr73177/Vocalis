import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
// const isOrgSelectionRoute = createRouteMatcher(["/org-selection(.*)"]);
export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();
  // Allow market routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // protect non- public routes
  if (!userId) {
    await auth.protect();
  }
  // for all protected routes, ensure that org is selected
  if (userId && !orgId) {
    return NextResponse.redirect(new URL("/org-selection", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for Clerk's auto-proxy path
    "/__clerk/:path*",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
