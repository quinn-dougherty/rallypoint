import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { post_id, title, description, deadline, tags } = await req.json();

  const { data, error } = await supabase
    .from("posts")
    .update({
      title,
      description,
      deadline,
    })
    .eq("post_id", post_id);

  await supabase.from("post_tags").delete().eq("post_id", post_id);

  const tagsM = tags as string[];
  await tagsM.forEach(async (tag_id) => {
    const { error } = await supabase
      .from("post_tags")
      .insert({ post_id: post_id, tag_id: tag_id });

    if (error) {
      return NextResponse.json({
        error: error.message,
      });
    }
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
