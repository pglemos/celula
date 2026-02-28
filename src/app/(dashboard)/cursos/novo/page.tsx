import { getPeople } from "@/lib/actions/people";
import NovoCursoForm from "./form";

export default async function NovoCursoPage() {
    const people = await getPeople();
    return <NovoCursoForm instructors={people} />;
}
