import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { GetUser } from "@/utils/userData";
interface PostData {
  post_id: string;
  comment: string;
}
export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await GetUser();
  const dataReq: PostData = await req.json();

  if (!user.id || !dataReq.comment || !dataReq.post_id) {
    return NextResponse.json({ error: "Missing required fields" });
  }

  // Insert data into Supabase
  const { data, error } = await supabase
    .from("comments")
    .insert({
      user_id: user.id,
      post_id: dataReq.post_id,
      contents: dataReq.comment,
      status: "public",
    })
    .select();
  if (error) {
    return NextResponse.json({
      error: error.message,
    });
  }
  return NextResponse.json(data);
}
