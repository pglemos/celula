import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ImportWizardForm } from "./form";

export default function ImportarMembrosPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/membros">
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Importar Membros</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Upload de planilha CSV para importação em massa
                    </p>
                </div>
            </div>

            <ImportWizardForm />
        </div>
    );
}
