import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

interface DepositBalanceParams {
  amount: number;
  user_id: string;
}

/// This makes sense in escrow version, not so much otherwise
export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { amount, user_id }: DepositBalanceParams = await req.json();

  const { data, error } = await supabase
    .from("users")
    .select()
    .match({ user_id })
    .single();

  if (error) {
    return NextResponse.json({
      error: `DB transaction failed: ${error.message}`,
    });
  }

  if (!amount || !user_id) {
    return NextResponse.json({ error: "Missing required fields" });
  }

  return NextResponse.json({ data });
}
