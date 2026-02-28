import { getPeople } from "@/lib/actions/people";
import { enrollInCourse } from "@/lib/actions/courses";
import ClientEnrollForm from "./client-form";

export default async function EnrollPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const people = await getPeople();

    return <ClientEnrollForm courseId={id} people={people} enrollAction={enrollInCourse} />;
}
