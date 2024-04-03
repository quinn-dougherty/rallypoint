import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { post_id } = await req.json();

  if (!post_id) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const { data, error } = await supabase
    .from("posts")
    .update({ status: "closed" })
    .eq("post_id", post_id)
    .select();
  if (error) {
    return NextResponse.json({
      error: `DB transaction failed: ${error.message}`,
    });
  }

  return NextResponse.json(data);
}
