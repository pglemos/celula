"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#f5f5f7] p-3 gap-3 overflow-hidden">
            <div className="h-full z-10 flex flex-col shrink-0">
                <AppSidebar />
            </div>
            <div className="flex flex-1 flex-col h-full overflow-hidden rounded-[24px] bg-white/50 backdrop-blur-sm border border-white/60 shadow-sm">
                <AppHeader />
                <main className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
