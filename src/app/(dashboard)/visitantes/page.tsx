import { getVisitorFollowups } from "@/lib/actions/settings";
import { FollowUpList } from "./list";

export default async function VisitorsPage() {
    const followups = await getVisitorFollowups();

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pl-4">
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-slate-800">Visitantes e Follow-up</h1>
                    <p className="text-base font-medium text-slate-500 mt-1">
                        Acompanhe e consolide as pessoas que visitaram as células recentemente.
                    </p>
                </div>
            </div>

            <FollowUpList followups={followups} />
        </div>
    );
}
