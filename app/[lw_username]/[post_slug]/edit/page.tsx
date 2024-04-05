"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import EditPost from "@/components/posts/EditPost";
import { createClientSsr } from "@/utils/supabase/client";

interface Tag {
  tag_id: string;
  tag: string;
}
const getTags = async (post_id: string) => {
  const supabase = createClientSsr();
  const { data, error } = await supabase
    .from("post_tags")
    .select()
    .match({ post_id });
  if (error) {
    return [];
  }
  if (!data) {
    return [];
  }

  return getTagsText(data);
};
const getTagsText = async (tags: Tag[]) => {
  const supabase = createClientSsr();
  const { data, error } = await supabase
    .from("tags")
    .select()
    .in(
      "tag_id",
      tags.map((tag) => tag.tag_id),
    );
  if (error) {
    return [];
  }
  return data;
};

export default function EditPage() {
  const pathname = usePathname();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const post_id = pathSegments[1].split("_").pop();

    if (!post_id) {
      console.error("post_id is missing.", post_id);
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      setLoading(true);

      const tags = await getTags(post_id);
      setTags(tags);
      const supabaseClient = createClientSsr();
      const { data, error } = await supabaseClient
        .from("posts")
        .select("*")
        .eq("post_id", post_id)
        .single();

      if (error) {
        console.error("Error fetching post:", error, "post_id:", post_id);
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [pathname]);

  if (loading) return <div>Loading post...</div>;
  if (!post) return <div>Post not found or error loading post.</div>;

  return <EditPost post={post} tags={tags} />;
}
