import { NextRequest, NextResponse } from "next/server";
import PostsModel from "@/types/Posts";
// import { createClientSsr } from "@/utils/supabase/client";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  // const supabase = createClientSsr();

  // Type the request body
  const { owner_user_id, title, description, amount }: PostsModel =
    await req.json();
  console.log(owner_user_id, title, description, amount);
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
    return NextResponse.error(error);
  }
  //if (error) {
  //   return res.json({ error: error.message });
  //}

  console.log("FROM API:", data);
  // return res.json(data);
  return NextResponse.json(data);
}
