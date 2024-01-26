import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { post_id, title, description } = await req.json();

  const { data, error } = await supabase
    .from('posts')
    .update({
      title,
      description,
    })
    .eq('post_id', post_id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

