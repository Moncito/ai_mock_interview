'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";



const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if (userRecord.exists) {
            return {
                sucess: false,
                message: "User Already Exist Please Sign-In"
            }
        }

        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: "Account created successfully. Please sign in.",
        };


    } catch (e: any) {
        console.error('Error Creating a User', e);

        if (e.code === 'auth/email-already-exist') {
            return {
                success: false,
                message: "This Email is Already in Use."
            }
        }
        return {
            success: false,
            message: "failed to create an Account"
        };
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if (!userRecord) {
            return {
                success: false,
                message: 'User does not Exist. Create an Account Instead'
            }
        }

        await setSessionCookie(idToken);

        return {
            success: true,
            message: 'Signed in successfully'
        };
    } catch (e) {
        console.log(e);

        return {
            success: false,
            message: 'failed to log into account.'
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000,
    });

    cookieStore.set('session', sessionCookie, {  // Corrected syntax
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    });
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        // 🔹 Check if user still exists in Firebase Auth
        try {
            await auth.getUser(decodedClaims.uid);
        } catch (authError: any) {
            if (authError.code === "auth/user-not-found") {
                return null;
            }
            throw authError;
        }

        // 🔹 Check Firestore for user data
        const userRecord = await db.collection("users").doc(decodedClaims.uid).get();
        if (!userRecord.exists) {
            return null;
        }

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (e: any) {
        // Silently return null for invalid session cookies (expected behavior)
        return null;
    }
}


export async function isAuthenticated() {
    "use server"; // ✅ Ensure it runs on the server

    const user = await getCurrentUser();

    return !!user; // Returns true if user exists, false otherwise
}
