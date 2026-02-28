"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, QrCode, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { connectWhatsApp, disconnectWhatsApp } from "@/lib/actions/whatsapp";
import { toast } from "sonner";

interface WhatsAppSession {
    id: string;
    status: string;
    qr_code?: string;
}

export function WhatsAppConnection({ initialSession }: { initialSession: WhatsAppSession | null }) {
    const [loading, setLoading] = useState(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [status, setStatus] = useState<string>(initialSession?.status || "disconnected");

    async function handleConnect() {
        setLoading(true);
        try {
            const result = await connectWhatsApp();
            setQrCode(result.qrCode);
            setStatus("pairing");
            toast.success("QR Code gerado! Escaneie no seu WhatsApp.");
        } catch (err) {
            toast.error("Erro ao conectar");
        } finally {
            setLoading(false);
        }
    }

    async function handleDisconnect() {
        if (!confirm("Tem certeza que deseja desconectar o WhatsApp?")) return;
        setLoading(true);
        try {
            await disconnectWhatsApp();
            setQrCode(null);
            setStatus("disconnected");
            toast.success("WhatsApp desconectado");
        } catch (err) {
            toast.error("Erro ao desconectar");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/40">
                <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${status === 'connected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                            status === 'pairing' ? 'bg-amber-500 animate-pulse' :
                                'bg-rose-500'
                        }`} />
                    <div>
                        <p className="text-sm font-medium">
                            {status === 'connected' ? 'Conectado' :
                                status === 'pairing' ? 'Aguardando Escaneamento' :
                                    'Desconectado'}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Status da Sessão</p>
                    </div>
                </div>

                {status !== 'disconnected' && (
                    <Button variant="ghost" size="sm" onClick={handleDisconnect} disabled={loading} className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Desconectar"}
                    </Button>
                )}
            </div>

            {status === 'disconnected' && (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border/50 rounded-2xl bg-secondary/10 space-y-4">
                    <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400">
                        <QrCode className="h-10 w-10" />
                    </div>
                    <div className="text-center space-y-1">
                        <h4 className="font-semibold">Nenhuma conta vinculada</h4>
                        <p className="text-sm text-muted-foreground max-w-[240px]">Conecte seu WhatsApp para habilitar as automações de mensagens.</p>
                    </div>
                    <Button onClick={handleConnect} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                        Gerar QR Code
                    </Button>
                </div>
            )}

            {status === 'pairing' && qrCode && (
                <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-white rounded-2xl">
                    <div className="p-2 bg-white border-4 border-emerald-500/20 rounded-xl">
                        {/* In a real app, use a proper QRCode component. Mocking with layout for now */}
                        <div className="w-48 h-48 bg-slate-100 flex items-center justify-center overflow-hidden rounded-lg relative">
                            <QrCode className="h-32 w-32 text-slate-800 opacity-20" />
                            <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] break-all p-4 text-center text-slate-900 font-bold">
                                {qrCode}
                            </div>
                            <div className="absolute top-0 right-0 p-1">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 text-center">
                        Abra o WhatsApp {'>'} Configurações {'>'} Aparelhos Conectados {'>'} Conectar um Aparelho
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setStatus('connected')} className="text-emerald-600 border-emerald-600/20">
                        Simular Conexão (Demo)
                    </Button>
                </div>
            )}

            {status === 'connected' && (
                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center space-y-4">
                    <div className="p-4 rounded-full bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <div className="text-center">
                        <h4 className="font-bold text-emerald-400">Vínculo Ativo</h4>
                        <p className="text-sm text-muted-foreground">O sistema agora está pronto para enviar mensagens.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
