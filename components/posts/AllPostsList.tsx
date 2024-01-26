"use client";
import React, { useEffect, useState } from "react";
import { createClientSsr } from "@/utils/supabase/client";
import { PostsModel } from "@/types/Models";
import PostCard from "./PostCard";

function AllPostsList() {
  const supabase = createClientSsr();
  const [posts, setPosts] = useState<PostsModel["Row"][]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    supabase
      .from("posts")
      .select()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching posts:", error);
        } else {
          setPosts(data as PostsModel["Row"][]);
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!posts) {
    return <div>Posts not found</div>;
  }
  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.post_id} post={post} />
      ))}
    </div>
  );
}

export default AllPostsList;
