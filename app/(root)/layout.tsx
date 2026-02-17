import { isAuthenticated } from "@/lib/actions/auth.action";
import { LogoutButton } from "@/components/LogoutButton";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const Rootlayout = async ({ children }: { children: ReactNode }) => {
    const isUserAuthenticated = await isAuthenticated();

    if (!isUserAuthenticated) redirect("/sign-in"); // ✅ Redirect to sign-in

    return (
        <div className="root-layout">
            <nav className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
                    <h2 className="text-primary-100">PrepSaint</h2>
                </Link>

                <LogoutButton
                    variant="outline"
                    size="default"
                    showIcon={true}
                    showText={true}
                />
            </nav>
            {children}
        </div>
    );
};

export default Rootlayout;
