"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { registerDecision } from "@/lib/actions/consolidation";
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function RegisterDecisionModal() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, reset } = useForm({
        defaultValues: {
            fullName: "",
            phone: "",
            decisionDate: new Date().toISOString().split('T')[0],
            decisionType: "accept",
            neighborhood: "",
            gender: "male",
            context: ""
        }
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            await registerDecision(data);
            toast.success("Decisão registrada com sucesso!");
            setOpen(false);
            reset();
        } catch (error) {
            toast.error("Não foi possível registrar a decisão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all hover:scale-105">
                    <Plus className="w-4 h-4" /> Registrar Decisão
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900">Nova Decisão</DialogTitle>
                    <DialogDescription>
                        Registre uma nova decisão de fé para iniciar o processo de consolidação.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="fullName">Nome Completo</Label>
                            <Input id="fullName" {...register("fullName")} required placeholder="Nome do novo convertido" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">WhatsApp / Telefone</Label>
                            <Input id="phone" {...register("phone")} placeholder="(00) 00000-0000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="decisionDate">Data da Decisão</Label>
                            <Input id="decisionDate" type="date" {...register("decisionDate")} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="decisionType">Tipo de Decisão</Label>
                            <Select onValueChange={(val) => setValue("decisionType", val)} defaultValue="accept">
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="accept">Aceitou a Jesus</SelectItem>
                                    <SelectItem value="reconcile">Reconciliação</SelectItem>
                                    <SelectItem value="visit">Visitante (Interesse)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="neighborhood">Bairro</Label>
                            <Input id="neighborhood" {...register("neighborhood")} placeholder="Ex: Centro" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="context">Contexto / Observações</Label>
                        <Textarea id="context" {...register("context")} placeholder="Onde a decisão foi tomada? (Culto, Célula, Rua...)" />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Salvar e Iniciar Consolidação
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
