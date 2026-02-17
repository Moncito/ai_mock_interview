"use client";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "./ui/form";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";


import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { useState } from "react";


// Define FormType to avoid TypeScript errors
type FormType = "sign-in" | "sign-up" | "forgot-password";

// Define Schema Function
const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: type === "forgot-password" ? z.string().optional() : z.string().min(3),
    });
};

const AuthForm = ({ type: initialType }: { type: "sign-in" | "sign-up" }) => {
    const router = useRouter();
    const [type, setType] = useState<FormType>(initialType);
    const formSchema = authFormSchema(type);

    // Initialize Form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: type === "sign-up" ? "" : undefined,
            email: "",
            password: "",
        },
    });

    // Submit Handler
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (type === "sign-up") {
                const { name, email, password } = values;

                const userCredentials = await createUserWithEmailAndPassword(auth, email!, password!);

                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email: email!,
                    password: password!,
                });

                if (!result?.success) {
                    toast.error(result?.message);
                    return;
                }

                toast.success("Account Created Successfully. Please Sign-in");
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setType("sign-in");

            } else if (type === "sign-in") {
                const { email, password } = values;

                const userCredential = await signInWithEmailAndPassword(auth, email!, password!);

                const idToken = await userCredential.user.getIdToken();

                if (!idToken) {
                    toast.error('Sign in Failed');
                    return;
                }

                const result = await signIn({
                    email: email!, idToken
                })

                if (!result?.success) {
                    toast.error(result?.message);
                    return;
                }

                toast.success("Sign-in Successfully");
                await new Promise((resolve) => setTimeout(resolve, 1000));
                router.push("/");
            } else if (type === "forgot-password") {
                await sendPasswordResetEmail(auth, values.email!);
                toast.success("Password reset email sent! Check your inbox.");
                setType("sign-in");
            }
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.code === 'auth/user-not-found'
                ? "User not found."
                : error.code === 'auth/wrong-password'
                    ? "Incorrect password."
                    : error.message;
            toast.error(`Error: ${errorMessage}`);
        }
    }

    const isSignIn = type === "sign-in";
    const isForgotPassword = type === "forgot-password";

    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" height={32} width={38} />
                    <h2 className="text-primary-100">PrepSaint</h2>
                </div>
                <h3 className="text-center">
                    {isForgotPassword ? "Reset Your Password" : "Practice Job Interview With A.I"}
                </h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                        {type === "sign-up" && (
                            <FormField
                                control={form.control}
                                name="name"
                                label="Name"
                                placeholder="Your Name"
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Your Email Address"
                            type="email"
                        />

                        {!isForgotPassword && (
                            <div className="flex flex-col gap-2">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    label="Password"
                                    placeholder="Enter your Password"
                                    type="password"
                                />
                                {isSignIn && (
                                    <button
                                        type="button"
                                        onClick={() => setType("forgot-password")}
                                        className="text-sm text-primary-200 hover:underline text-right w-full"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                        )}

                        <Button type="submit" className="btn">
                            {type === "sign-in" ? "Sign in" : type === "sign-up" ? "Create an Account" : "Reset Password"}
                        </Button>
                    </form>
                </Form>

                <p className="text-center">
                    {isForgotPassword ? (
                        <button onClick={() => setType("sign-in")} className="font-bold text-user-primary">
                            Back to Sign In
                        </button>
                    ) : (
                        <>
                            {isSignIn ? "No account yet? " : "Have an account Already?"}
                            <Link
                                href={type === "sign-up" ? "/sign-in" : "/sign-up"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setType(type === "sign-up" ? "sign-in" : "sign-up");
                                }}
                                className="font-bold text-user-primary ml-1"
                            >
                                {type === "sign-up" ? "Sign In" : "Sign Up"}
                            </Link>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default AuthForm;


