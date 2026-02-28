import { ProjectsClient } from "@/components/ProjectsClient";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return <ProjectsClient />;
}
