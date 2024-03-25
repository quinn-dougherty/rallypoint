import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { PostsModel } from "@/types/Models";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const dataReq = await req.json();
  const { owner_user_id, title, description, amount }: PostsModel["Row"] =
    dataReq;
  const tags: string[] = dataReq.tags;
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
      error: error.message,
    });
  }
  try {
    await tags.forEach(async (tag_id) => {
      const { error } = await supabase
        .from("post_tags")
        .insert({ post_id: data[0].post_id, tag_id: tag_id });

      if (error) {
        return NextResponse.json({
          error: error.message,
        });
      }
    });
  } catch (error) {
    console.error("error THROW from insert tags", error);
  }
  return NextResponse.json(data);
}
