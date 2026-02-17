import { isAuthenticated } from "@/lib/actions/auth.action";
import { LogoutButton } from "@/components/LogoutButton";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const RootLayout = async ({ children }: { children: ReactNode }) => {
    const isUserAuthenticated = await isAuthenticated();

    if (!isUserAuthenticated) {
        redirect("/sign-in");
    }

    return (
        <div className="root-layout min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="flex items-center justify-between py-4 px-6">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="PrepSaint Logo" width={38} height={32} />
                    <h2 className="text-primary-100">PrepSaint</h2>
                </Link>

                <div className="flex items-center gap-8">
                    <Link
                        href="/"
                        className="text-gray-300 hover:text-white transition-colors"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/feedback"
                        className="text-gray-300 hover:text-white transition-colors"
                    >
                        Feedback
                    </Link>
                </div>

                <LogoutButton
                    variant="outline"
                    size="default"
                    showIcon
                    showText
                />
            </nav>

            {/* Page Content */}
            <main className="flex-1 px-6 py-4">{children}</main>
        </div>
    );
};

export default RootLayout;
