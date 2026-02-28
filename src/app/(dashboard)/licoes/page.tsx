import { getCellLessons } from "@/lib/actions/cell-advanced";
import { LessonList } from "./lesson-list";
import { GenerateLessonDialog } from "./generate-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Heart, LayoutGrid } from "lucide-react";

export default async function LicoesPage() {
    const lessons = await getCellLessons();

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pl-4">
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-slate-800">Lições / Extras</h1>
                    <p className="text-base font-medium text-slate-500 mt-1">
                        Roteiros e materiais de apoio para suas reuniões
                    </p>
                </div>
                <GenerateLessonDialog />
            </div>

            <div className="px-4">
                <Tabs defaultValue="todos" className="w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <TabsList className="bg-slate-100/50 p-1 rounded-2xl h-12">
                            <TabsTrigger value="todos" className="rounded-xl px-8 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
                                <LayoutGrid className="h-4 w-4" /> TODOS
                            </TabsTrigger>
                            <TabsTrigger value="favoritos" className="rounded-xl px-8 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
                                <Heart className="h-4 w-4" /> FAVORITOS
                            </TabsTrigger>
                        </TabsList>

                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Buscar lição..."
                                className="pl-11 h-12 bg-white border-slate-100 rounded-2xl shadow-sm focus-visible:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <TabsContent value="todos">
                        <LessonList lessons={lessons} />
                    </TabsContent>

                    <TabsContent value="favoritos">
                        <div className="py-20 text-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200">
                            <Heart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900">Sem favoritos</h3>
                            <p className="text-slate-500">Marque as lições que você mais gosta para acessá-las rapidamente.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
