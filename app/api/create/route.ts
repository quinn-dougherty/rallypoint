import { NextRequest, NextResponse } from "next/server";
import PostsModel from "@/types/Posts";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { owner_user_id, title, description, amount }: PostsModel =
    await req.json();

  // Data validation
  if (!owner_user_id || !title || !description || !amount) {
    return NextResponse.json({ error: "Missing required fields" });
  }

  // Insert data into Supabase
  const { data, error } = await supabase
    .from("posts")
    .insert({ owner_user_id, title, description, amount })
    .select();

  if (error) {
    return NextResponse.json({
      error: `DB transaction failed: ${error.message}`,
    });
  }

  return NextResponse.json(data);
}
