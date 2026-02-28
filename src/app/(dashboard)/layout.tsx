"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#f3f4f6] selection:bg-primary/20 p-4 gap-4 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#e4ebe9] to-[#f3f4f6] -z-10" />
            <div className="h-full z-10 flex flex-col shrink-0">
                <AppSidebar />
            </div>
            <div className="flex flex-1 flex-col transition-all duration-300 h-full overflow-y-auto relative custom-scrollbar z-10 bg-white/40 backdrop-blur-md rounded-[32px] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
                <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
                    <div className="pointer-events-auto">
                        <AppHeader />
                    </div>
                </div>
                <main className="flex-1 p-3 md:p-4 w-full mx-auto relative">{children}</main>
            </div>
        </div>
    );
}
