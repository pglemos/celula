import { getCellById } from "@/lib/actions/cells";
import { MeetingForm } from "./form";

export default async function MeetingPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const cell = await getCellById(id);

    const members = (cell.cell_members || [])
        .filter((m: { person: unknown }) => m.person)
        .map((m: { person: { id: string; full_name: string } }) => ({
            id: m.person.id,
            full_name: m.person.full_name,
        }));

    return (
        <MeetingForm
            cellId={id}
            cellName={cell.name}
            leaderId={cell.leader?.id || ""}
            members={members}
        />
    );
}
