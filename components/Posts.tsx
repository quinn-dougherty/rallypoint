"use client";
import React, { useEffect, useState } from "react";
import { createClientSsr } from "@/utils/supabase/client";
import Post from "@/components/Post";
import PostsModel from "@/models/Posts";
import UsersModel from "@/models/Users";

type PostsProps = {
  lw_username: string | null;
};

function Posts({ lw_username }: PostsProps) {
  const [posts, setPosts] = useState<PostsModel[]>([]);
  const [user, setUser] = useState<UsersModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (lw_username !== null) {
      const supabase = createClientSsr();
      supabase
        .from("users")
        .select()
        .match({ lw_username })
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching user:", error);
          } else {
            setUser(data as UsersModel);
          }
        });
    }
  }, [lw_username]);

  useEffect(() => {
    if (user) {
      const supabase = createClientSsr();
      supabase
        .from("posts")
        .select()
        .match({ owner_user_id: user.user_id })
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching posts:", error);
          } else {
            setPosts(data as PostsModel[]);
          }
          setLoading(false);
        });
    } else {
      const supabase = createClientSsr();
      supabase
        .from("posts")
        .select()
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching posts:", error);
          } else {
            setPosts(data as PostsModel[]);
          }
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!posts) {
    return <div>Posts not found</div>;
  }
  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post.post_id}
          post={post}
          lw_username={lw_username || "quinn-dougherty"}
        />
      ))}
    </div>
  );
}

export default Posts;
