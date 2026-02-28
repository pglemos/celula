import { ArrowLeft, User, Globe, Bell, CreditCard, Smartphone, LogOut, ChevronRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

export default function SettingsPage() {
    return (
        <div className="space-y-8 pb-20 max-w-5xl mx-auto">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 px-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-800">Configurações</h1>
                    <p className="text-base font-medium text-slate-500 mt-1">
                        Gerencie sua conta, preferências e o aplicativo
                    </p>
                </div>
            </div>

            <Tabs defaultValue="conta" className="w-full px-4">
                <TabsList className="bg-slate-100/50 p-1 rounded-2xl h-14 w-full justify-start overflow-x-auto h-auto md:h-14">
                    <TabsTrigger value="conta" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
                        <User className="h-4 w-4" /> CONTA
                    </TabsTrigger>
                    <TabsTrigger value="idioma" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
                        <Globe className="h-4 w-4" /> IDIOMA
                    </TabsTrigger>
                    <TabsTrigger value="notificacoes" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
                        <Bell className="h-4 w-4" /> NOTIFICAÇÕES
                    </TabsTrigger>
                    <TabsTrigger value="pagamentos" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
                        <CreditCard className="h-4 w-4" /> PAGAMENTOS
                    </TabsTrigger>
                    <TabsTrigger value="app" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
                        <Smartphone className="h-4 w-4" /> APP
                    </TabsTrigger>
                </TabsList>

                {/* Tab 1: Conta */}
                <TabsContent value="conta" className="mt-8 space-y-6">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-xl rounded-[32px] overflow-hidden">
                        <CardHeader className="p-8">
                            <CardTitle className="text-xl font-bold">Segurança da Conta</CardTitle>
                            <CardDescription>Atualize seu e-mail e senha de acesso</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">E-mail</Label>
                                    <Input defaultValue="pedro@celula.in" className="h-12 bg-slate-50 border-none rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Nova Senha</Label>
                                    <Input type="password" placeholder="••••••••" className="h-12 bg-slate-50 border-none rounded-xl" />
                                </div>
                            </div>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-8 rounded-xl border-none">
                                Salvar Alterações
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-rose-50 rounded-[32px] overflow-hidden">
                        <CardContent className="p-8 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-rose-900">Excluir Conta</h3>
                                <p className="text-sm text-rose-700/70">Esta ação é permanente e removerá todos os seus dados.</p>
                            </div>
                            <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-100 font-bold rounded-xl h-12">
                                Encerrar Conta
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 2: Idioma */}
                <TabsContent value="idioma" className="mt-8">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-xl rounded-[32px] overflow-hidden">
                        <CardHeader className="p-8">
                            <CardTitle className="text-xl font-bold">Preferências Globais</CardTitle>
                            <CardDescription>Defina o idioma e fuso horário do sistema</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Idioma</Label>
                                    <Select defaultValue="pt-BR">
                                        <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                                            <SelectItem value="en">English (US)</SelectItem>
                                            <SelectItem value="es">Español</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Moeda Padrão</Label>
                                    <Select defaultValue="BRL">
                                        <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BRL">Real (BRL)</SelectItem>
                                            <SelectItem value="USD">Dólar (USD)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 3: Notificações */}
                <TabsContent value="notificacoes" className="mt-8">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-xl rounded-[32px] overflow-hidden">
                        <CardHeader className="p-8">
                            <CardTitle className="text-xl font-bold">Centro de Avisos</CardTitle>
                            <CardDescription>Controle como você deseja ser notificado</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-2">
                            {[
                                { title: "Push Notifications", desc: "Avisos importantes sobre células e cursos diretamente no celular." },
                                { title: "WhatsApp Automations", desc: "Envio automático de frequências e relatórios via WhatsApp." },
                                { title: "E-mail de Resumo Mensal", desc: "Relatório de desempenho da sua rede e supervisão por e-mail." },
                                { title: "Alertas de Aniversário", desc: "Lembretes de aniversários de membros da sua célula." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl">
                                    <div>
                                        <p className="font-bold text-slate-900 leading-none">{item.title}</p>
                                        <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 4: Pagamentos */}
                <TabsContent value="pagamentos" className="mt-8">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-xl rounded-[32px] overflow-hidden">
                        <CardHeader className="p-8">
                            <CardTitle className="text-xl font-bold">Assinaturas e Faturas</CardTitle>
                            <CardDescription>Gerencie seus métodos de pagamento e plano</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <div className="p-6 bg-slate-900 rounded-[24px] text-white flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
                                        <ShieldCheck className="h-6 w-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black tracking-widest opacity-70">Plano Atual</p>
                                        <h4 className="font-bold text-lg leading-none">PROFISSIONAL (Anual)</h4>
                                    </div>
                                </div>
                                <Button className="bg-white text-slate-900 hover:bg-white/90 font-bold rounded-xl px-6 h-10 border-none">
                                    Upgrade
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 5: App */}
                <TabsContent value="app" className="mt-8 space-y-6">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-xl rounded-[32px] overflow-hidden">
                        <CardHeader className="p-8">
                            <CardTitle className="text-xl font-bold">Sobre o Aplicativo</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl">
                                <p className="font-bold text-slate-900">Versão do App</p>
                                <Badge className="bg-indigo-500/10 text-indigo-500 border-none px-4 py-1.5 rounded-full font-bold">v3.42.0 (Premium)</Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl">
                                <p className="font-bold text-slate-900">Build Signature</p>
                                <p className="text-xs text-slate-400 font-mono">2026-02-28-REL-01</p>
                            </div>
                            <button className="w-full flex items-center justify-between p-6 bg-rose-500 text-white rounded-[24px] font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200 mt-4">
                                <div className="flex items-center gap-3">
                                    <LogOut className="h-5 w-5" />
                                    ENCERRAR SESSÃO
                                </div>
                                <ChevronRight className="h-5 w-5 opacity-50" />
                            </button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
