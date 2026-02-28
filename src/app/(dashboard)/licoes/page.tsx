import { getCellLessons } from "@/lib/actions/cell-advanced";
import { LessonList } from "./lesson-list";
import { GenerateLessonDialog } from "./generate-dialog";

export default async function LicoesPage() {
    const lessons = await getCellLessons();

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pl-4">
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-slate-800">Lições de Célula</h1>
                    <p className="text-base font-medium text-slate-500 mt-1">
                        Roteiros de estudo semanais para as reuniões.
                    </p>
                </div>
                <GenerateLessonDialog />
            </div>

            <LessonList lessons={lessons} />
        </div>
    );
}
