import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

interface Tag {
  tag_id: string;
  tag: string;
}
export async function GET() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data, error } = await supabase.from("tags").select("tag_id, tag");

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
  } catch (error) {
    console.error("error THROW from search", error);
  }
}
