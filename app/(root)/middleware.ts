import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/firebase/admin";

export async function middleware(req: NextRequest) {
    const sessionCookie = req.cookies.get("session")?.value;

    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    try {
        await auth.verifySessionCookie(sessionCookie, true);
        return NextResponse.next();
    } catch (e) {
        console.error("Session verification failed:", e);
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }
}

// Apply middleware only to protected pages
export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*"], // Change these to your protected routes
};
