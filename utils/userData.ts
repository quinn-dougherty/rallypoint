import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createClientSsr, supabase } from "@/utils/supabase/client";
import { UserProfileForm } from "@/types/Users";
import { UserResponse } from "@supabase/gotrue-js";

/* The cookies version-- rename to getUserWithCookies later? See #32 */
export async function GetUser() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data }: UserResponse = await supabase.auth.getUser();
  if (!data || !data.user) {
    console.error(`Failed to get authenticated user`);
    throw "error fetching data";
  } else {
    const user = data.user;
    console.log(user);
    return user;
  }
}

export async function getUser() {
  const supabase = createClientSsr();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Not authenticated:", error);
    throw error;
  }
  return data.user;
}

export async function UpdateUser(user: UserProfileForm) {
  console.log(`updateUser data`, user);
  const error = await supabase()
    .from("profiles")
    .update({
      display_name: user.displayName,
      lw_username: user.lwUsername,
      bio: user.bio,
    })
    .eq(`user_id`, user.user_id);
  if (error) {
    throw error;
  }
}
