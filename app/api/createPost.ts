import { NextApiRequest, NextApiResponse } from "next";
import PostsModel from "@/types/Posts";
import { createClientSsr } from "@/utils/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const supabase = createClientSsr();

    // Type the request body
    const { owner_user_id, title, description, amount }: PostsModel = req.body;

    console.log(owner_user_id, title, description, amount);
    // Data validation
    if (!owner_user_id || !title || !description || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert data into Supabase
    const { data, error } = await supabase
      .from("posts")
      .insert({ owner_user_id, title, description, amount })
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    console.log("FROM API:", data);
    return res.status(200).json(data);
  } else {
    // Handle non-POST requests
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
