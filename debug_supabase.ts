
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const tenantId = "00000000-0000-0000-0000-000000000001";

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
    console.log("Checking Supabase Connection...");

    // Check tenants
    const { data: tenants, error: tError } = await supabase.from("tenants").select("id, name");
    if (tError) {
        console.error("Error fetching tenants:", tError.message);
    } else {
        console.log("Active Tenants in DB:", tenants);
    }

    // Check courses
    const { data: courses, error: cError } = await supabase
        .from("courses")
        .select(`
            *,
            instructor:people(id, full_name),
            course_enrollments (id, status),
            course_classes (id, class_date)
        `)
        .eq("tenant_id", tenantId);

    if (cError) {
        console.error("Error fetching courses:", cError.message);
    } else {
        console.log("Courses found:", courses?.length);
        if (courses && courses.length > 0) {
            console.log("Sample Course Instructor:", courses[0].instructor);
        }
    }

    // Check events
    const { data: events, error: eError } = await supabase
        .from("events")
        .select(`
            *,
            event_registrations (id, status)
        `)
        .eq("tenant_id", tenantId);

    if (eError) {
        console.error("Error fetching events:", eError.message);
    } else {
        console.log("Events found:", events?.length);
    }
}

debug();
