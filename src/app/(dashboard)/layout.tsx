"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen mesh-bg p-4 sm:p-6 gap-6 overflow-hidden selection:bg-primary/20">
            <AppSidebar />
            <div className="flex flex-1 flex-col transition-all duration-300 h-full overflow-y-auto relative custom-scrollbar">
                <AppHeader />
                <main className="flex-1 p-6 lg:p-10">{children}</main>
            </div>
        </div>
    );
}
