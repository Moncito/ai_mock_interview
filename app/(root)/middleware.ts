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
    } catch (e: any) {
        // Clear the invalid session cookie
        const response = NextResponse.redirect(new URL("/sign-in", req.url));
        response.cookies.delete("session");
        return response;
    }
}

// Apply middleware only to protected pages
export const config = {
    matcher: ["/interview/:path*", "/dashboard/:path*", "/profile/:path*"], // Protected routes
};
