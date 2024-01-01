"use client";
import React, { useEffect, useState } from "react";
import { createClientSsr } from "@/utils/supabase/client";
import Post from "@/components/Post";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClientSsr();
    supabase
      .from("posts")
      .select()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching posts:", error);
          setError(error);
        } else {
          setPosts(data);
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
  return (
    <div>
      {posts.map((post) => (
        <Post data={post} />
      ))}
    </div>
  );
}

export default Posts;
