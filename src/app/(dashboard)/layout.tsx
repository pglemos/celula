"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex flex-1 flex-col pl-[260px] transition-all duration-300">
                <AppHeader />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
