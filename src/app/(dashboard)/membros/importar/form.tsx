"use client";

import { useState, useTransition, useCallback } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { importPeopleFromCSV } from "@/lib/actions/people-advanced";

type Step = "upload" | "preview" | "result";

export function ImportWizardForm() {
    const [step, setStep] = useState<Step>("upload");
    const [rows, setRows] = useState<Record<string, string>[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [fileName, setFileName] = useState("");
    const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);
    const [isPending, startTransition] = useTransition();

    const parseCSV = useCallback((text: string) => {
        const lines = text.split("\n").filter(l => l.trim().length > 0);
        if (lines.length < 2) return;

        // Detect separator (semicolon or comma)
        const sep = lines[0].includes(";") ? ";" : ",";
        const hdrs = lines[0].split(sep).map(h => h.replace(/^"/, "").replace(/"$/, "").trim());
        setHeaders(hdrs);

        const parsed = lines.slice(1).map(line => {
            const values = line.split(sep).map(v => v.replace(/^"/, "").replace(/"$/, "").trim());
            const row: Record<string, string> = {};
            hdrs.forEach((h, i) => {
                row[h] = values[i] || "";
            });
            return row;
        });

        setRows(parsed);
        setStep("preview");
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target?.result as string;
            parseCSV(text);
        };
        reader.readAsText(file, "UTF-8");
    };

    const handleImport = () => {
        startTransition(async () => {
            const res = await importPeopleFromCSV(rows);
            setResult(res);
            setStep("result");
        });
    };

    if (step === "upload") {
        return (
            <Card className="glass-card border-border/50">
                <CardContent className="p-8">
                    <label
                        htmlFor="csv-upload"
                        className="flex flex-col items-center gap-4 cursor-pointer rounded-2xl border-2 border-dashed border-border/50 p-12 transition-all hover:border-primary/50 hover:bg-primary/5"
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                            <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-lg">Arraste ou clique para enviar</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Arquivo CSV com separador vírgula ou ponto-e-vírgula
                            </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                            Formatos: .csv
                        </Badge>
                        <input
                            id="csv-upload"
                            type="file"
                            accept=".csv,.txt"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                    </label>

                    <div className="mt-6 rounded-xl bg-secondary/50 p-4">
                        <h3 className="font-semibold text-sm mb-2">Colunas esperadas:</h3>
                        <div className="flex flex-wrap gap-2">
                            {["Nome Completo *", "Telefone", "Email", "Bairro", "Cidade", "Estado", "Data Nascimento", "Gênero", "Status"].map(col => (
                                <Badge key={col} variant="secondary" className="text-[11px]">{col}</Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (step === "preview") {
        return (
            <div className="space-y-4">
                <Card className="glass-card border-border/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4 text-primary" />
                            Preview: {fileName}
                            <Badge variant="outline" className="ml-2">{rows.length} registros</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-[400px] overflow-auto rounded-lg border border-border/30">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-xs w-10">#</TableHead>
                                        {headers.slice(0, 6).map(h => (
                                            <TableHead key={h} className="text-xs">{h}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rows.slice(0, 20).map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                                            {headers.slice(0, 6).map(h => (
                                                <TableCell key={h} className="text-xs truncate max-w-[150px]">
                                                    {row[h] || "—"}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {rows.length > 20 && (
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                                Mostrando 20 de {rows.length} registros
                            </p>
                        )}
                    </CardContent>
                </Card>

                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => { setStep("upload"); setRows([]); }}>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                    </Button>
                    <Button onClick={handleImport} disabled={isPending} className="gap-2">
                        {isPending ? "Importando..." : (
                            <>
                                <ArrowRight className="h-4 w-4" />
                                Importar {rows.length} membros
                            </>
                        )}
                    </Button>
                </div>
            </div>
        );
    }

    // Result
    return (
        <Card className="glass-card border-border/50">
            <CardContent className="p-8 text-center">
                {result && result.imported > 0 ? (
                    <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 mx-auto mb-4">
                            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-bold">Importação Concluída!</h2>
                        <p className="text-muted-foreground mt-2">
                            {result.imported} membros importados com sucesso.
                        </p>
                    </>
                ) : (
                    <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 mx-auto mb-4">
                            <AlertTriangle className="h-8 w-8 text-amber-500" />
                        </div>
                        <h2 className="text-xl font-bold">Houve problemas na importação</h2>
                    </>
                )}

                {result?.errors && result.errors.length > 0 && (
                    <div className="mt-4 rounded-xl bg-destructive/10 p-4 text-left">
                        <p className="text-sm font-semibold text-destructive mb-2">Erros:</p>
                        {result.errors.map((err, i) => (
                            <p key={i} className="text-xs text-destructive/80">{err}</p>
                        ))}
                    </div>
                )}

                <div className="flex gap-3 justify-center mt-6">
                    <Button variant="outline" onClick={() => { setStep("upload"); setRows([]); setResult(null); }}>
                        Nova importação
                    </Button>
                    <Button asChild>
                        <a href="/membros">Ver membros</a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
