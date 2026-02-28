import { getVisitorFollowups } from "@/lib/actions/settings";
import { FollowUpList } from "./list";

export default async function VisitorsPage() {
    const followups = await getVisitorFollowups();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Visitantes e Follow-up</h1>
                <p className="text-muted-foreground">Acompanhe e consolide as pessoas que visitaram as células recentemente.</p>
            </div>
            
            <FollowUpList followups={followups} />
        </div>
    );
}
