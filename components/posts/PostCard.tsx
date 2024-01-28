"use client";
import React, { useEffect, useState } from "react";
import { PostsModel, ProfilesModel } from "@/types/Models";
import createSlug from "@/utils/slug";
import { createClientSsr } from "@/utils/supabase/client";

type PostCardProps = {
  post: PostsModel["Row"];
};

function PostCard({ post }: PostCardProps) {
  const [profile, setProfile] = useState<ProfilesModel["Row"] | null>(null);
  const [lwUsername, setLwUsername] = useState<string | null>(null);
  const { post_id, title, status, post_type, amount } = post;
  const supabase = createClientSsr();
  useEffect(() => {
    const { owner_user_id } = post;
    supabase
      .from("profiles")
      .select()
      .match({ user_id: owner_user_id })
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching lw_username");
        } else {
          setProfile(data as ProfilesModel["Row"]);
        }
      });
  }, [post]);
  useEffect(() => {
    if (profile) {
      setLwUsername(profile.lw_username);
    }
  }, [profile]);
  if (profile === null) {
    return <div>Loading...</div>;
  } else {
    const lw_username = lwUsername as string;
    const post_slug = createSlug(title, post_id);
    return (
      <div className="border card">
        <h2>
          <a href={`/${lw_username}/${post_slug}`}>{title}</a>
        </h2>
        <p>{`Filed by: ${lw_username}`}</p>
        <p>{`${status} ${post_type}`}</p>
        <p>{`$${amount} available`}</p>
      </div>
    );
  }
}
export default PostCard;
