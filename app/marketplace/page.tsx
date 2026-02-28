import { MarketplaceClient } from "@/components/MarketplaceClient";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function MarketplacePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return <MarketplaceClient />;
}
