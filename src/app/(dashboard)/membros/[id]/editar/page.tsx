import { getPersonById } from "@/lib/actions/people";
import { notFound } from "next/navigation";
import EditarMembroForm from "./form";

export default async function EditarMembroPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const member = await getPersonById(id);

    if (!member) {
        notFound();
    }

    return <EditarMembroForm member={member} />;
}
