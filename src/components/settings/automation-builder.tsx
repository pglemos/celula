"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Zap, Save, Loader2 } from "lucide-react";
import { saveAutomationRule, deleteAutomationRule } from "@/lib/actions/automations";
import { toast } from "sonner";

interface AutomationRule {
    id: string;
    name: string;
    trigger_type: string;
    target_audience: string;
    is_active: boolean;
}

export function AutomationBuilder({ initialRules }: { initialRules: AutomationRule[] }) {
    const [loading, setLoading] = useState(false);
    const [rules, setRules] = useState(initialRules);
    const [isAdding, setIsAdding] = useState(false);

    async function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            await saveAutomationRule(formData);
            toast.success("Regra salva com sucesso!");
            setIsAdding(false);
            // In a real app, refresh data
        } catch (err) {
            toast.error("Erro ao salvar regra");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Excluir esta regra?")) return;
        setLoading(true);
        try {
            await deleteAutomationRule(id);
            toast.success("Regra excluída");
            // In a real app, refresh data
        } catch (err) {
            toast.error("Erro ao excluir");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            {!isAdding && (
                <Button onClick={() => setIsAdding(true)} className="w-full gap-2 border-dashed border-2 h-auto py-6 bg-transparent hover:bg-secondary/50 text-foreground border-primary/30">
                    <Plus className="h-5 w-5 text-primary" />
                    Nova Regra de Integração
                </Button>
            )}

            {isAdding && (
                <div className="p-6 rounded-2xl bg-secondary/30 border border-primary/20 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-400" />
                            Configurar Nova Automação
                        </h4>
                        <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>Cancelar</Button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nome da Automação</Label>
                                <Input name="name" placeholder="Ex: Aviso de Relatório Atrasado" required className="bg-background/50 border-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Gatilho (Indicador)</Label>
                                    <Select name="trigger_type" defaultValue="missing_report">
                                        <SelectTrigger className="bg-background/50 border-none">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="missing_report">Relatório Atrasado</SelectItem>
                                            <SelectItem value="low_attendance">Frequência Baixa</SelectItem>
                                            <SelectItem value="new_convert">Novo Decidido</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Frequência / % Alvo</Label>
                                    <Input name="indicator_threshold" type="number" placeholder="Ex: 70" className="bg-background/50 border-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Público Alvo (Quem recebe?)</Label>
                                <Select name="target_audience" defaultValue="cell_leaders">
                                    <SelectTrigger className="bg-background/50 border-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cell_leaders">Líderes de Célula</SelectItem>
                                        <SelectItem value="supervisors">Supervisores</SelectItem>
                                        <SelectItem value="coordinators">Coordenadores</SelectItem>
                                        <SelectItem value="direct_reports">Liderados Diretos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Mensagem (Modelo)</Label>
                                <Textarea
                                    name="message_template"
                                    placeholder="Olá {nome}, notamos que o relatório da {celula} ainda não foi enviado..."
                                    className="bg-background/50 border-none min-h-[100px]"
                                    required
                                />
                                <p className="text-[10px] text-muted-foreground">Use {"{nome}"} para o nome do destinatário e {"{celula}"} para o nome do grupo.</p>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/40">
                                <Label className="cursor-pointer" htmlFor="is_active">Ativar Imediatamente</Label>
                                <Checkbox id="is_active" name="is_active" defaultChecked />
                            </div>
                        </div>

                        <Button type="submit" className="w-full gap-2" disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Salvar Automação
                        </Button>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {rules.length === 0 && !isAdding && (
                    <div className="text-center py-10 opacity-40">
                        <Zap className="h-10 w-10 mx-auto mb-2" />
                        <p className="text-sm">Nenhuma automação configurada.</p>
                    </div>
                )}
                {rules.map((rule) => (
                    <div key={rule.id} className="p-4 rounded-xl bg-secondary/20 border border-border/30 hover:border-primary/30 transition-all group">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${rule.is_active ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                                    <h5 className="font-semibold text-sm">{rule.name}</h5>
                                </div>
                                <p className="text-xs text-muted-foreground">{rule.trigger_type === 'missing_report' ? 'Relatório Atrasado' : rule.trigger_type} → {rule.target_audience}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(rule.id)}
                                className="h-8 w-8 text-muted-foreground hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
