import { getPeople } from "@/lib/actions/people";
import NovoConvertidoForm from "./form";

export default async function NovoConvertidoPage() {
    const people = await getPeople();
    return <NovoConvertidoForm consolidators={people} />;
}
