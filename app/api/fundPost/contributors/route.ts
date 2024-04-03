import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Contributors } from "@/types/Models";
export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const dataReq = await req.json();
  const { post_id } = dataReq;

  const { data, error } = await supabase
    .from("payments_allocation")
    .select("allocation_id,user_id,amount,created_at")
    .neq("status", "withdrawn")
    .match({ post_id: post_id });
  if (error) {
    return NextResponse.json({ error: error.message });
  }
  const contributors: Contributors[] = data!;
  if (data) {
    for (let i = 0; i < contributors.length; i++) {
      const { data: user } = await supabase
        .from("profiles")
        .select("display_name, lw_username")
        .eq("user_id", contributors[i].user_id)
        .single();
      if (user) {
        contributors[i].display_name = user.display_name;
        contributors[i].lw_username = user.lw_username;
      }
    }
  }

  return NextResponse.json(contributors);
}
