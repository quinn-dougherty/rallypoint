import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
// import { ProfilesModel } from "@/types/Models";
import { createClient } from "@/utils/supabase/server";

interface ClaimResolutionParams {
  claimant_user_id: string;
  poster_user_id: string;
  percentageAward: number;
  post_id: string;
  claim_id: string;
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    claimant_user_id,
    poster_user_id,
    percentageAward,
    post_id,
    claim_id,
  }: ClaimResolutionParams = await req.json();

  if (
    !claimant_user_id ||
    !poster_user_id ||
    !percentageAward ||
    !post_id ||
    !claim_id
  ) {
    return NextResponse.json({ error: "Missing required fields" });
  }
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select()
    .match({ post_id })
    .single();
  if (fetchError) {
    console.error("Error fetching post:", fetchError);
    return NextResponse.json({ error: "Failed to fetch post" });
  }

  const award = post.amount * (percentageAward / 100);

  const { data, error } = await supabase
    .rpc("resolve_claim", {
      award,
      claimant_user_id,
      poster_user_id,
      resolving_claim_id: claim_id,
    })
    .select();

  if (error) {
    return NextResponse.json({
      error: `DB transaction failed: ${error.message}`,
    });
  }
  return NextResponse.json(data);
}
