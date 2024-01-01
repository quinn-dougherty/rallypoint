"use client";
import React, { useEffect, useState } from "react";
import { createClientSsr } from "@/utils/supabase/client";
import Post from "@/components/Post";

type Post = {
  post_id: string;
  owner_user_id: string;
  title: string;
  description: string | null;
  post_type: "bounty" | "dac";
  amount: number;
  status: "unclaimed" | "claimed" | "finished";
  deadline: string | null;
  created_at: string;
  updated_at: string;
};

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const supabase = createClientSsr();
    supabase
      .from("posts")
      .select()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching posts:", error);
          setLoading(false);
        } else {
          setPosts(data as Post[]);
          setLoading(false);
        }
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!posts) {
    return <div>Posts not found</div>;
  }
  console.log(posts);
  return (
    <div>
      {posts.map((post) => (
        <Post key={post.post_id} post={post} />
      ))}
    </div>
  );
}

export default Posts;
