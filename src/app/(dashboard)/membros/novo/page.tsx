"use client";

import { useState } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createPerson } from "@/lib/actions/people";
import { MapPicker } from "@/components/ui/map-picker";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState as useReactState } from "react";

export default function NovoMembroPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [address, setAddress] = useState("");
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

    // Watch address fields to trigger geocoding in MapPicker
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [zip, setZip] = useState("");

    useEffect(() => {
        const fullAddress = `${street}${number ? `, ${number}` : ""} - ${neighborhood}, Belo Horizonte - MG, ${zip}`;
        setAddress(fullAddress);
    }, [street, number, neighborhood, zip]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData(e.currentTarget);
            await createPerson(formData);
            router.push("/membros");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao cadastrar membro");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-4">
                <Link href="/membros">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Novo Membro</h1>
                    <p className="text-sm text-muted-foreground">Preencha os dados da pessoa</p>
                </div>
            </div>

            {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dados Pessoais */}
                <Card className="glass-card border-border/50 animate-fade-in-up">
                    <CardHeader><CardTitle className="text-base">👤 Dados Pessoais</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2">
                                <Label>Nome completo *</Label>
                                <Input name="full_name" required placeholder="Nome completo" className="bg-secondary border-none" />
                            </div>
                            <div className="space-y-2">
                                <Label>Nome preferido</Label>
                                <Input name="preferred_name" placeholder="Como prefere ser chamado" className="bg-secondary border-none" />
                            </div>
                            <div className="space-y-2">
                                <Label>Data de nascimento</Label>
                                <Input name="birth_date" type="date" className="bg-secondary border-none" />
                            </div>
                            <div className="space-y-2">
                                <Label>Gênero</Label>
                                <Select name="gender">
                                    <SelectTrigger className="bg-secondary border-none"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="M">Masculino</SelectItem>
                                        <SelectItem value="F">Feminino</SelectItem>
                                        <SelectItem value="other">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Estado civil</Label>
                                <Select name="marital_status">
                                    <SelectTrigger className="bg-secondary border-none"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="single">Solteiro(a)</SelectItem>
                                        <SelectItem value="married">Casado(a)</SelectItem>
                                        <SelectItem value="divorced">Divorciado(a)</SelectItem>
                                        <SelectItem value="widowed">Viúvo(a)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contato */}
                <Card className="glass-card border-border/50 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                    <CardHeader><CardTitle className="text-base">📱 Contato</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Telefone</Label>
                                <Input name="phone" type="tel" placeholder="(31) 99999-9999" className="bg-secondary border-none" />
                            </div>
                            <div className="space-y-2">
                                <Label>WhatsApp</Label>
                                <Input name="whatsapp" type="tel" placeholder="(31) 99999-9999" className="bg-secondary border-none" />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label>Email</Label>
                                <Input name="email" type="email" placeholder="email@exemplo.com" className="bg-secondary border-none" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Endereço */}
                <Card className="glass-card border-border/50 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                    <CardHeader><CardTitle className="text-base">📍 Endereço</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2">
                                <Label>Rua</Label>
                                <Input name="address_street" placeholder="Rua, Avenida..." className="bg-secondary border-none" onChange={(e) => setStreet(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Número</Label>
                                <Input name="address_number" placeholder="123" className="bg-secondary border-none" onChange={(e) => setNumber(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Complemento</Label>
                                <Input name="address_complement" placeholder="Apto, Bloco..." className="bg-secondary border-none" />
                            </div>
                            <div className="space-y-2">
                                <Label>Bairro</Label>
                                <Input name="address_neighborhood" placeholder="Bairro" className="bg-secondary border-none" onChange={(e) => setNeighborhood(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Input name="address_zip" placeholder="30000-000" className="bg-secondary border-none" onChange={(e) => setZip(e.target.value)} />
                            </div>
                            <input type="hidden" name="address_city" value="Belo Horizonte" />
                            <input type="hidden" name="address_state" value="MG" />
                            <input type="hidden" name="latitude" value={location?.lat || ""} />
                            <input type="hidden" name="longitude" value={location?.lng || ""} />

                            <div className="sm:col-span-2 pt-2">
                                <Label className="mb-3 block">Localização no Mapa</Label>
                                <MapPicker
                                    address={address}
                                    onLocationSelect={(lat, lng) => setLocation({ lat, lng })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Membresia */}
                <Card className="glass-card border-border/50 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                    <CardHeader><CardTitle className="text-base">⛪ Membresia</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Status de membresia</Label>
                            <Select name="membership_status" defaultValue="visitor">
                                <SelectTrigger className="bg-secondary border-none"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="visitor">Visitante</SelectItem>
                                    <SelectItem value="non_baptized">Não Batizado</SelectItem>
                                    <SelectItem value="baptized_non_member">Batizado (Não Membro)</SelectItem>
                                    <SelectItem value="member">Membro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Observações</Label>
                            <Textarea name="notes" placeholder="Observações sobre o membro..." className="bg-secondary border-none min-h-[80px]" />
                        </div>
                    </CardContent>
                </Card>

                {/* LGPD */}
                <Card className="glass-card border-border/50 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
                    <CardHeader><CardTitle className="text-base">🔒 LGPD</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-start gap-3">
                            <Checkbox id="lgpd" name="lgpd_consent" value="true" />
                            <label htmlFor="lgpd" className="text-xs text-muted-foreground leading-relaxed">
                                Declaro que obtive o consentimento desta pessoa para armazenamento e tratamento de seus dados pessoais,
                                em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full gap-2 bg-primary hover:bg-primary/90 h-12 text-base font-semibold"
                >
                    {loading ? (
                        <><Loader2 className="h-5 w-5 animate-spin" />Salvando...</>
                    ) : (
                        <><Save className="h-5 w-5" />Cadastrar Membro</>
                    )}
                </Button>
            </form>
        </div>
    );
}
