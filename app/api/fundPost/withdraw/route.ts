import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import {
  GetPostAmount,
  GetUserBalance,
  GetUserBalanceOffered,
} from "@/utils/userData";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { allocation_id } = await req.json();

  if (!allocation_id) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const { data, error } = await supabase
    .from("payments_allocation")
    .update({ status: "withdrawn" })
    .eq("allocation_id", allocation_id)
    .select();
  if (error) {
    return NextResponse.json({
      error: `DB transaction failed: ${error.message}`,
    });
  }
  const PostAmount = await GetPostAmount(data[0].post_id);
  await supabase
    .from("posts")
    .update({ amount: PostAmount - data[0].amount })
    .eq("post_id", data[0].post_id);

  const balanceOffered = await GetUserBalanceOffered(data[0].user_id);
  const balance = await GetUserBalance(data[0].user_id);
  await supabase
    .from("profiles")
    .update({
      balance: balance + data[0].amount,
      balance_offered: balanceOffered - data[0].amount,
    })
    .eq("user_id", data[0].user_id);

  return NextResponse.json(data);
}
