import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ClaimsModel } from "@/types/Models";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    claimant_user_id,
    post_id,
    description,
    completion,
  }: ClaimsModel["Row"] = await req.json();

  // Data validation
  if (!claimant_user_id || !description || !post_id) {
    return NextResponse.json({ error: "Missing required fields" });
  }

  // Insert data into Supabase
  const { data, error } = await supabase
    .from("claims")
    .insert({ claimant_user_id, post_id, description, completion })
    .select();

  if (error) {
    return NextResponse.json({
      error: `DB transaction on claims failed: ${error.message}`,
    });
  }
  const { data: postData, error: postError } = await supabase
    .from("posts")
    .update({ status: "claimed" })
    .match({ post_id });
  if (postError) {
    return NextResponse.json({
      error: `DB transaction on posts failed: ${postError.message}`,
    });
  }

  return NextResponse.json({ claimData: data, postData });
}
