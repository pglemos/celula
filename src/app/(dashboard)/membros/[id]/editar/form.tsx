"use client";

import { useState } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updatePerson } from "@/lib/actions/people";
import { MapPicker } from "@/components/ui/map-picker";
import { useEffect, useState as useReactState } from "react";

export default function EditarMembroForm({ member }: { member: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(
        member.latitude && member.longitude ? { lat: member.latitude, lng: member.longitude } : null
    );
    const [address, setAddress] = useState("");

    // Watch address fields to trigger geocoding in MapPicker
    const [street, setStreet] = useState(member.address_street || "");
    const [number, setNumber] = useState(member.address_number || "");
    const [neighborhood, setNeighborhood] = useState(member.address_neighborhood || "");
    const [zip, setZip] = useState(member.address_zip || "");

    useEffect(() => {
        const fullAddress = `${street}${number ? `, ${number}` : ""} - ${neighborhood}, Belo Horizonte - MG, ${zip}`;
        setAddress(fullAddress);
    }, [street, number, neighborhood, zip]);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        try {
            await updatePerson(member.id, formData);
            router.push(`/membros/${member.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao atualizar membro");
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/membros/${member.id}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Editar Perfil</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Atualize os dados de {member.full_name}
                    </p>
                </div>
            </div>

            <form onSubmit={onSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="glass-card md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Dados Pessoais</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {error && (
                                <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Nome Completo *</Label>
                                    <Input id="full_name" name="full_name" defaultValue={member.full_name} required className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="preferred_name">Como prefere ser chamado?</Label>
                                    <Input id="preferred_name" name="preferred_name" defaultValue={member.preferred_name || ""} className="bg-secondary border-none" />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="birth_date">Data de Nascimento</Label>
                                    <Input id="birth_date" name="birth_date" type="date" defaultValue={member.birth_date ? member.birth_date.split('T')[0] : ""} className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gênero</Label>
                                    <Select name="gender" defaultValue={member.gender || undefined}>
                                        <SelectTrigger className="bg-secondary border-none">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="M">Masculino</SelectItem>
                                            <SelectItem value="F">Feminino</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="marital_status">Estado Civil</Label>
                                    <Select name="marital_status" defaultValue={member.marital_status || undefined}>
                                        <SelectTrigger className="bg-secondary border-none">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                                            <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                                            <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                                            <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-border/30">
                                <div className="space-y-2">
                                    <Label htmlFor="cpf">CPF</Label>
                                    <Input id="cpf" name="cpf" defaultValue={member.cpf || ""} placeholder="000.000.000-00" className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rg">RG / Identidade</Label>
                                    <Input id="rg" name="rg" defaultValue={member.rg || ""} className="bg-secondary border-none" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Dados Sociais e Profissionais</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="occupation">Profissão</Label>
                                    <Input id="occupation" name="occupation" defaultValue={member.occupation || ""} className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="education_level">Escolaridade</Label>
                                    <Select name="education_level" defaultValue={member.education_level || undefined}>
                                        <SelectTrigger className="bg-secondary border-none">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fundamental">Fundamental</SelectItem>
                                            <SelectItem value="medio">Médio</SelectItem>
                                            <SelectItem value="superior">Superior</SelectItem>
                                            <SelectItem value="pos">Pós / MBA / Mestre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="instagram">Instagram</Label>
                                    <Input id="instagram" name="instagram" defaultValue={member.instagram || ""} placeholder="@usuario" className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                                    <Input id="linkedin" name="linkedin" defaultValue={member.linkedin || ""} className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="facebook">Facebook</Label>
                                    <Input id="facebook" name="facebook" defaultValue={member.facebook || ""} className="bg-secondary border-none" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Contato e Endereço</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Celular</Label>
                                    <Input id="phone" name="phone" defaultValue={member.phone || ""} className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp">WhatsApp</Label>
                                    <Input id="whatsapp" name="whatsapp" defaultValue={member.whatsapp || ""} className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" defaultValue={member.email || ""} className="bg-secondary border-none" />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-4">
                                <div className="space-y-2 sm:col-span-1">
                                    <Label htmlFor="address_zip">CEP</Label>
                                    <Input id="address_zip" name="address_zip" defaultValue={member.address_zip || ""} className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2 sm:col-span-3">
                                    <Label htmlFor="address_street">Endereço (Rua, Av)</Label>
                                    <Input id="address_street" name="address_street" defaultValue={member.address_street || ""} className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2 sm:col-span-1">
                                    <Label htmlFor="address_number">Número</Label>
                                    <Input id="address_number" name="address_number" defaultValue={member.address_number || ""} className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2 sm:col-span-1">
                                    <Label htmlFor="address_complement">Complemento</Label>
                                    <Input id="address_complement" name="address_complement" defaultValue={member.address_complement || ""} className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="address_neighborhood">Bairro</Label>
                                    <Input id="address_neighborhood" name="address_neighborhood" defaultValue={member.address_neighborhood || ""} className="bg-secondary border-none" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Informações Eclesiásticas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="membership_status">Status na Igreja</Label>
                                    <Select name="membership_status" defaultValue={member.membership_status || "visitor"}>
                                        <SelectTrigger className="bg-secondary border-none">
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="member">Membro Ativo</SelectItem>
                                            <SelectItem value="baptized_non_member">Batizado (Não Membro)</SelectItem>
                                            <SelectItem value="non_baptized">Frequente (Não Batizado)</SelectItem>
                                            <SelectItem value="visitor">Visitante</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="baptism_date">Data de Batismo</Label>
                                    <Input id="baptism_date" name="baptism_date" type="date" defaultValue={member.baptism_date ? member.baptism_date.split('T')[0] : ""} className="bg-secondary border-none" />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="converted_at">Data de Conversão</Label>
                                    <Input id="converted_at" name="converted_at" type="date" defaultValue={member.converted_at ? member.converted_at.split('T')[0] : ""} className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="origin_church">Igreja de Origem</Label>
                                    <Input id="origin_church" name="origin_church" defaultValue={member.origin_church || ""} className="bg-secondary border-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Observações Pastorais</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    defaultValue={member.notes || ""}
                                    className="bg-secondary border-none min-h-[100px]"
                                    placeholder="Ex: Veio transferido da igreja XYZ. Histórico de liderança..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4 md:col-span-2 justify-end mt-4">
                        <Button variant="outline" type="button" onClick={() => router.back()} className="border-border/50">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="gap-2">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Salvar Alterações
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
