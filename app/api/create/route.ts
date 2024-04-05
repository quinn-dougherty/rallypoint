import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { PostsModel } from "@/types/Models";
import { GetUserBalance } from "@/utils/userData";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const dataReq = await req.json();
  const {
    owner_user_id,
    title,
    description,
    amount,
    deadline,
  }: PostsModel["Row"] = dataReq;
  const tags: string[] = dataReq.tags;
  // Data validation
  if (!owner_user_id || !title || !description || !amount || !deadline) {
    return NextResponse.json({ error: "Missing required fields" });
  }
  const amountNum = Number(amount);
  const balance = await GetUserBalance(owner_user_id);
  if (amountNum > balance) {
    return NextResponse.json({ error: "Insufficient balance" });
  }

  // Insert data into Supabase
  const { data, error } = await supabase
    .from("posts")
    .insert({ owner_user_id, title, description, amount, deadline })
    .select();

  if (error) {
    if (
      error.message.includes("duplicate key value violates unique constraint")
    ) {
      return NextResponse.json({
        error: "Title already exists. Please choose a different title.",
      });
    }
    return NextResponse.json({
      error: error.message,
    });
  }
  const { error: errorBalance } = await supabase
    .from("profiles")
    .update({ balance: balance - amountNum })
    .eq("user_id", owner_user_id);
  if (errorBalance) {
    // Rollback post creation
    await supabase.from("posts").delete().eq("post_id", data[0].post_id);

    return NextResponse.json({
      error: errorBalance.message,
    });
  }

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
  return NextResponse.json(data);
}
