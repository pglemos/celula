"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { generateAILesson } from "@/lib/actions/ai-lessons";
import { useRouter } from "next/navigation";

export function GenerateLessonDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [topic, setTopic] = useState("");
    const [scripture, setScripture] = useState("");
    const router = useRouter();

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const lesson = await generateAILesson(topic, scripture);
            setOpen(false);
            router.push(`/licoes/${lesson.id}`);
        } catch (error: any) {
            alert(error.message || "Erro ao gerar lição.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Sparkles className="h-4 w-4" /> Gerar com IA
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-500" /> Gerar Roteiro de Estudo
                    </DialogTitle>
                    <DialogDescription>
                        Informe um tema ou texto bíblico e nossa IA criará um estudo completo para sua célula.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="topic">Tema da Lição</Label>
                        <Input 
                            id="topic" 
                            placeholder="Ex: Gratidão, Perseverança, Salvação..." 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="scripture">Referência Bíblica (Opcional)</Label>
                        <Input 
                            id="scripture" 
                            placeholder="Ex: João 3:16, Salmo 23..." 
                            value={scripture}
                            onChange={(e) => setScripture(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button 
                        disabled={!topic || loading} 
                        onClick={handleGenerate}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Gerando...</> : "Gerar Agora"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
