import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";

export async function GetUser() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data }: { data: { user: { id: string } } } =
        await supabase.auth.getUser();
    if (!data) {
        console.error(`Failed to get authenticated user`);
    } else {
        const user = data.user;
        console.log(user);
        return user;
    }
}