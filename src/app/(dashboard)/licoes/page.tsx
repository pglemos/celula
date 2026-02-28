import { getCellLessons } from "@/lib/actions/cell-advanced";
import { LessonList } from "./lesson-list";
import { GenerateLessonDialog } from "./generate-dialog";

export default async function LicoesPage() {
    const lessons = await getCellLessons();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Lições de Célula</h1>
                    <p className="text-muted-foreground">Roteiros de estudo semanais para as reuniões.</p>
                </div>
                <GenerateLessonDialog />
            </div>
            
            <LessonList lessons={lessons} />
        </div>
    );
}
