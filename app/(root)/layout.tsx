import { isAuthenticated } from "@/lib/actions/auth.action";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const Rootlayout = async ({ children }: { children: ReactNode }) => {
    const isUserAuthenticated = await isAuthenticated();

    if (!isUserAuthenticated) redirect("/sign-in"); // ✅ Redirect to sign-in

    return (
        <div className="root-layout">
            <nav className="flex items-center justify-between py-4 px-6">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
                    <h2 className="text-primary-100">PrepSaint</h2>
                </Link>
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                    <Link href="/feedback" className="text-gray-300 hover:text-white transition-colors">Feedback</Link>
                </div>
            </nav>
            {children}
        </div>
    );
};

export default Rootlayout;
