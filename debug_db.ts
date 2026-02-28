import { createClient } from "./src/lib/supabase/server";
import { TENANT_ID } from "./src/lib/constants";

async function debug() {
    const supabase = await createClient();
    console.log("Checking Tenant ID:", TENANT_ID);

    const { data: tenants, error: tError } = await supabase.from("tenants").select("id, name");
    console.log("Active Tenants in DB:", tenants);

    const { data: events, error: eError } = await supabase.from("events").select("*").limit(5);
    console.log("Events Sample (no filter):", events);
    if (eError) console.error("Error fetching events:", eError);

    const { data: er, error: erError } = await supabase.from("event_registrations").select("id").limit(1);
    console.log("Event Registrations Table exists?", er !== null, erError?.message);
}

debug();
