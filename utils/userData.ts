import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";
import {UserProfileForm} from "@/types/Users";
import {supabase} from "@/utils/supabase/client";

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
export async function UpdateUser(user:UserProfileForm){
console.log(`updateUser data`,user)
const error = await supabase()
    .from('profiles')
    .update({
        display_name:user.displayName,
        lw_username:user.lwUsername,
        bio:user.bio
    })
    .eq(`user_id`,user.user_id);
    if(error){
        throw error;
    }
}