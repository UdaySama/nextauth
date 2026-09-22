import {
  asgardeoMiddleware,
  createRouteMatcher,
} from "@asgardeo/nextjs/middleware";

const isProtectedRoutes = createRouteMatcher([
  "/dashboard",
  "/profile",
  "/admin",
]);

export const proxy = asgardeoMiddleware(async (asgardeo, req) => {
  if (isProtectedRoutes(req)) {
    return await asgardeo.protectRoute();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
