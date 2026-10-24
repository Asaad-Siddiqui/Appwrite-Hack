import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/ask-question", "/collection", "/profile/edit"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("appwrite-session");

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !session?.value) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If already logged in and visiting sign-in or sign-up, redirect to home
  if ((pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) && session?.value) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
