import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

interface SearchQuery {
  query: string;
}
export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { query }: SearchQuery = await req.json();

  const { data, error } = await supabase
    .from("profiles")
    .select("display_name, lw_username, bio, user_id, profile_image_url")
    .like("display_name", "%" + query + "%");

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
