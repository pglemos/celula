import { Home, BookOpen, Users, CircleDot, UserCircle } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // In a real app, you'd check active path to highlight the current tab
    return (
        <div className="flex flex-col h-[100dvh] bg-background text-foreground overflow-hidden">
            {/* Top Bar for Mobile App */}
            <header className="flex h-16 items-center justify-center border-b border-border/20 px-4 bg-background/80 backdrop-blur-md z-10 shrink-0">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Minha Central
                </h1>
            </header>

            {/* Main Content Area (scrollable) */}
            <main className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-24">
                {children}
            </main>

            {/* Bottom Tab Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-xl border-t border-border/20 flex items-center justify-around px-2 z-50">
                <Link href="/app" className="flex flex-col items-center justify-center gap-1 w-16 h-full text-primary">
                    <Home className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Início</span>
                </Link>
                <Link href="/app/celula" className="flex flex-col items-center justify-center gap-1 w-16 h-full text-muted-foreground hover:text-foreground transition-colors">
                    <CircleDot className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Célula</span>
                </Link>
                <Link href="/app/devocional" className="flex flex-col items-center justify-center gap-1 w-16 h-full text-muted-foreground hover:text-foreground transition-colors">
                    <BookOpen className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Devocional</span>
                </Link>
                <Link href="/app/perfil" className="flex flex-col items-center justify-center gap-1 w-16 h-full text-muted-foreground hover:text-foreground transition-colors">
                    <UserCircle className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Perfil</span>
                </Link>
            </nav>
        </div>
    );
}
