import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createClientSsr, supabase } from "@/utils/supabase/client";
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

export async function UpdateUser(user: {
  user_id: string;
  lw_username: string;
  display_name: string;
  bio: string;
}) {
  console.log(`updateUser data`, user);
  const { lw_username, display_name, bio } = user;
  const error = await supabase()
    .from("profiles")
    .update({
      display_name,
      lw_username,
      bio,
    })
    .eq(`user_id`, user.user_id);
  if (error) {
    throw error;
  }
}

export async function InsertDeposit(deposit: {
  stripe_payment_id: string;
  user_id: string;
  status: string;
  amnt: number;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { stripe_payment_id, status, user_id, amnt } = deposit;
  const amount = amnt / 100;

  const alreadyExists = await supabase
    .from("payments_deposit")
    .select("deposit_id")
    .eq("stripe_payment_id", stripe_payment_id)
    .select();

  if (alreadyExists.data!.length > 0) {
    throw "Deposit already exists";
  } else {
    const error = await supabase
      .from("payments_deposit")
      .insert([{ user_id, amount, stripe_payment_id, status }])
      .select();
    if (error.error) {
      throw error;
    }

    const userBalance = await supabase
      .from("profiles")
      .select("balance")
      .eq("user_id", user_id)
      .single();

    const error2 = await supabase
      .from("profiles")
      .update({ balance: userBalance.data!.balance + amount })
      .eq("user_id", user_id);
    if (error2.error) {
      throw error2;
    }
  }
}
