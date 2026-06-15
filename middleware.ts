import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Мок-режим включён по умолчанию; чтобы включить реальный вход — NEXT_PUBLIC_MOCK=false
const MOCK = process.env.NEXT_PUBLIC_MOCK !== "false";

export async function middleware(request: NextRequest) {
  if (MOCK || process.env.NEXT_PUBLIC_AUTH_STUB === "true") {
    if (request.nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
