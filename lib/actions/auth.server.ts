"use server"; // ✅ Ensure it runs only on the server

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

export async function getCurrentUser() {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection("users").doc(decodedClaims.uid).get();

        if (!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (e: any) {
        // Silently return null for invalid session cookies (expected behavior)
        return null;
    }
}
