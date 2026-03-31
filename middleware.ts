import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const sessionCookie = req.cookies.get("session")?.value;

    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/interview",
        "/interview/:path*",
    ],
};
