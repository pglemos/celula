"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Download, ShieldCheck, Mail, Database, MessageSquare, Zap, QrCode } from "lucide-react";
import { updateTenantSettings, getTenantSettings } from "@/lib/actions/settings";
import { WhatsAppConnection } from "@/components/settings/whatsapp-connection";
import { AutomationBuilder } from "@/components/settings/automation-builder";
import { getWhatsAppSession } from "@/lib/actions/whatsapp";
import { getAutomationRules } from "@/lib/actions/automations";
import { useEffect } from "react";

interface Tenant {
    id: string;
    name: string;
    slug: string;
    primary_color: string | null;
    cell_term: string;
    timezone: string;
    lgpd_dpo_email: string | null;
}

interface WhatsAppSession {
    id: string;
    status: string;
    qr_code?: string;
}

interface AutomationRule {
    id: string;
    name: string;
    trigger_type: string;
    target_audience: string;
    is_active: boolean;
}

export function SettingsTabs({ tenant }: { tenant: Tenant }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [whatsappSession, setWhatsappSession] = useState<WhatsAppSession | null>(null);
    const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);

    useEffect(() => {
        // Load additional data for integrations
        async function loadIntegrations() {
            try {
                const [session, rules] = await Promise.all([
                    getWhatsAppSession(),
                    getAutomationRules()
                ]);
                setWhatsappSession(session);
                setAutomationRules(rules);
            } catch (err) {
                console.error("Error loading integrations:", err);
            }
        }
        loadIntegrations();
    }, []);

    async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const formData = new FormData(e.currentTarget);
            await updateTenantSettings(formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao atualizar configurações");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Tabs defaultValue="geral" className="animate-fade-in-up">
            <TabsList className="bg-secondary/50 flex flex-wrap h-auto p-1 max-w-2xl">
                <TabsTrigger value="geral" className="flex-1 text-xs sm:text-sm">Geral</TabsTrigger>
                <TabsTrigger value="integracoes" className="flex-1 text-xs sm:text-sm">Integrações</TabsTrigger>
                <TabsTrigger value="permissoes" className="flex-1 text-xs sm:text-sm">Permissões</TabsTrigger>
                <TabsTrigger value="lgpd" className="flex-1 text-xs sm:text-sm">LGPD</TabsTrigger>
                <TabsTrigger value="dados" className="flex-1 text-xs sm:text-sm">Dados</TabsTrigger>
            </TabsList>

            {error && (
                <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-400">
                    Configurações salvas com sucesso!
                </div>
            )}

            {/* GERAL */}
            <TabsContent value="geral" className="mt-4 space-y-4">
                <Card className="glass-card border-border/50 max-w-3xl">
                    <CardHeader>
                        <CardTitle>Dados da Igreja</CardTitle>
                        <CardDescription>Configure como a igreja e o sistema serão apresentados.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2 sm:col-span-2">
                                    <Label>Nome da Igreja</Label>
                                    <Input name="name" defaultValue={tenant.name} required className="bg-secondary border-none" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Subdomínio / Slug</Label>
                                    <Input name="slug" defaultValue={tenant.slug} required className="bg-secondary border-none" />
                                    <p className="text-[10px] text-muted-foreground">{tenant.slug}.centralos.com</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Termo para Rede/Grupo</Label>
                                    <Input name="cell_term" defaultValue={tenant.cell_term} placeholder="Ex: Célula, PG, GC" required className="bg-secondary border-none" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Fuso Horário (Timezone)</Label>
                                    <Input name="timezone" defaultValue={tenant.timezone} required className="bg-secondary border-none" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Cor Primária (Hex)</Label>
                                    <div className="flex gap-2">
                                        <Input name="primary_color" defaultValue={tenant.primary_color || "#7d30cf"} className="bg-secondary border-none flex-1" />
                                        <div className="w-10 h-10 rounded border" style={{ backgroundColor: tenant.primary_color || "#7d30cf" }} />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" disabled={loading} className="w-full sm:w-auto gap-2">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Salvar Configurações
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* INTEGRAÇÕES */}
            <TabsContent value="integracoes" className="mt-4 space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-6">
                        <Card className="glass-card border-border/50">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-emerald-400" />
                                    <CardTitle>WhatsApp Web</CardTitle>
                                </div>
                                <CardDescription>Conecte o WhatsApp para enviar notificações automáticas.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <WhatsAppConnection initialSession={whatsappSession} />
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-border/50">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-amber-400" />
                                    <CardTitle>Dicas de Automação</CardTitle>
                                </div>
                                <CardDescription>Como aproveitar ao máximo as notificações.</CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm space-y-3 text-muted-foreground">
                                <p>• <b>Hierarquia:</b> Mensagens podem ser enviadas para Liderados, Supervisores ou Coordenadores.</p>
                                <p>• <b>Indicadores:</b> Use frequência, visitantes e relatórios atrasados como gatilhos.</p>
                                <p>• <b>Variáveis:</b> Use {"{nome}"} e {"{celula}"} no seu modelo de mensagem.</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="glass-card border-border/50">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-blue-400" />
                                <CardTitle>Regras de Automação</CardTitle>
                            </div>
                            <CardDescription>Configure como e quando as mensagens serão enviadas.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AutomationBuilder initialRules={automationRules} />
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            {/* PERMISSÕES */}
            <TabsContent value="permissoes" className="mt-4 space-y-4">
                <Card className="glass-card border-border/50 max-w-3xl">
                    <CardHeader>
                        <CardTitle>Esquema de Permissões</CardTitle>
                        <CardDescription>O Central 3.0 adota uma estrutura hierárquica baseada em redes, sem necessidade de RBAC complexo.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-foreground/80">
                        <div className="space-y-3">
                            <div className="flex gap-3 items-start border-b border-border/30 pb-3">
                                <ShieldCheck className="h-5 w-5 text-emerald-400 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-foreground">Administrativo / Pastores</h4>
                                    <p className="text-muted-foreground text-xs mt-0.5">Visão global 360º. Relatórios de todas as redes, edição de células, exportação de dados DPO.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start border-b border-border/30 pb-3">
                                <ShieldCheck className="h-5 w-5 text-blue-400 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-foreground">Gestor de Rede / Supervisor</h4>
                                    <p className="text-muted-foreground text-xs mt-0.5">Visão filtrada à própria rede. Verificam desempenho e saúde das células vinculadas a eles abaixo.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start pb-1">
                                <ShieldCheck className="h-5 w-5 text-amber-400 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-foreground">Líder e Co-Líder de Célula</h4>
                                    <p className="text-muted-foreground text-xs mt-0.5">Visão limitada apenas aos membros do seu grupo. Envio de relatórios, presenças, novos membros visitantes do seu grupo.</p>
                                </div>
                            </div>
                        </div>
                        <div className="pt-2 rounded p-3 bg-secondary/30 text-xs">
                            <p>Gerenciamento ativo em breve no módulo de Login / Autorização Auth0 (Sprints Finais).</p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* LGPD */}
            <TabsContent value="lgpd" className="mt-4 space-y-4">
                <Card className="glass-card border-border/50 max-w-3xl">
                    <CardHeader>
                        <CardTitle>LGPD (Lei Geral de Proteção de Dados)</CardTitle>
                        <CardDescription>Conformidade e encarregado de dados.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Email do DPO (Encarregado de Dados Pessoais)</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input name="lgpd_dpo_email" defaultValue={tenant.lgpd_dpo_email || ""} placeholder="privacidade@igreja.com" className="pl-9 bg-secondary border-none" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Contato exposto para remoção/rastreio de contas sob a requisição do titular.</p>
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="gap-2">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Salvar Política
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* DADOS E BACKUP */}
            <TabsContent value="dados" className="mt-4 space-y-4">
                <Card className="glass-card border-border/50 max-w-3xl border-rose-500/10">
                    <CardHeader>
                        <CardTitle>Portabilidade e Segurança</CardTitle>
                        <CardDescription>Seus dados pertencem totalmente à Igreja. Exporte quando precisar.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center rounded-lg border border-border/40 p-4 bg-secondary/20">
                            <div className="space-y-1 max-w-[400px]">
                                <h4 className="font-semibold flex items-center gap-2"><Database className="h-4 w-4" /> Exportação Completa</h4>
                                <p className="text-xs text-muted-foreground">Faça o donwload (Dump Backup CSV/JSON) de todos os membros, reuniões e histórico presencial de sua base (Apenas Admins).</p>
                            </div>
                            <Button variant="outline" className="gap-2 border-primary/20 text-primary">
                                <Download className="h-4 w-4" />
                                Baixar Backup
                            </Button>
                        </div>

                        <div className="rounded p-3 bg-red-400/10 text-xs text-red-400 mt-6 border border-red-400/20">
                            <p className="font-semibold text-sm">Zona de Perigo</p>
                            <p className="mt-1">Apagar banco de dados ou destruir conta será irreversível. Para proceder, contate o suporte.</p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

        </Tabs>
    );
}
