import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Church, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/20">
            {/* Left side Form */}
            <div className="flex w-full flex-col justify-center px-8 sm:w-[450px] lg:px-12 z-10 bg-white/50 backdrop-blur-3xl shadow-2xl relative">
                <div className="mx-auto w-full max-w-sm space-y-8">
                    <div className="space-y-2 text-center sm:text-left flex flex-col items-center sm:items-start">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary mb-6 shadow-lg shadow-primary/20">
                            <Church className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Entrar na Central
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Gestão ágil para igrejas modernas.
                        </p>
                    </div>
                    <form className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                placeholder="nome@exemplo.com"
                                required
                                type="email"
                                className="h-11 rounded-full px-4 border-border/60 bg-secondary/50 focus-visible:ring-primary shadow-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Senha</Label>
                                <Link
                                    href="#"
                                    className="text-sm font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
                                >
                                    Esqueceu a senha?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                required
                                type="password"
                                className="h-11 rounded-full px-4 border-border/60 bg-secondary/50 focus-visible:ring-primary shadow-sm"
                            />
                        </div>
                        <Button type="button" className="w-full h-11 rounded-full shadow-md shadow-primary/20 text-md font-medium group">
                            Fazer Login
                        </Button>
                    </form>

                    <div className="space-y-4 pt-4 border-t border-border/40">
                        <div className="flex gap-2 items-center text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary" /> Conformidade com a LGPD
                        </div>
                        <div className="flex gap-2 items-center text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary" /> Sistema Seguro e Portável
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side Image / Illustration */}
            <div className="relative hidden w-full lg:flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
                {/* Abstract decorative blobs */}
                <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob" />
                <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-teal-300/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-primary/10 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000" />

                <div className="relative w-full max-w-2xl aspect-[4/3] m-8 z-10 transition-transform duration-500 hover:scale-105">
                    <Image
                        src="/images/auth-illustration.png"
                        alt="Colaboração na Igreja"
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                    />
                </div>

                {/* Floating Apple-like glass badge */}
                <div className="absolute bottom-12 right-12 z-20 glass-card p-4 rounded-2xl flex items-center gap-4 bg-white/70 backdrop-blur-md border border-white/50 shadow-xl max-w-[300px]">
                    <div className="h-10 w-10 shrink-0 bg-primary rounded-full flex justify-center items-center">
                        <Church className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">Central 3.0</p>
                        <p className="text-xs text-muted-foreground">O OS da Igreja Contemporânea.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
