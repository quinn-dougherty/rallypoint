"use client";
import React, { useEffect, useState } from "react";
import { createClientSsr } from "@/utils/supabase/client";
import { PostsModel } from "@/types/Models";
import { Status } from "@/types/Enums";
import PostCard from "@/components/posts/PostCard";
import StatusFilter from "@/components/posts/StatusFilter";
import useIsMobile from "@/utils/isMobile";
export default function Page() {
  const supabase = createClientSsr();
  const [posts, setPosts] = useState<PostsModel["Row"][]>([]);
  const [tagID, setTagID] = useState<string>("");
  const [postIDs, setPostIDs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([
    "unclaimed",
    "claimed",
  ]);

  const handleStatusChange = (statuses: Status[]) => {
    console.log("Selected statuses:", statuses);
    setSelectedStatuses(statuses);
  };

  const mobile = useIsMobile();

  React.useEffect(() => {
    if (tagID !== "") return;
    const tagText = window.location.pathname.split("/").pop();
    const fetchTagID = async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("tag_id")
        .match({ tag: tagText })
        .single();
      if (error) {
        console.error("Error fetching tagID:", error);
      } else {
        setTagID(data.tag_id);
      }
    };

    fetchTagID();
  }, [tagID]);

  React.useEffect(() => {
    if (tagID === "") return;
    const fetchPostIDs = async () => {
      const { data, error } = await supabase
        .from("post_tags")
        .select("post_id")
        .match({ tag_id: tagID });
      if (error) {
        console.error("Error fetching postIDs:", error);
        setLoading(false);
      } else {
        setPostIDs(data.map((post) => post.post_id));
      }
    };

    fetchPostIDs();
  }, [tagID]);

  useEffect(() => {
    if (postIDs.length === 0) return;
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select()
        .in("post_id", postIDs);
      if (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      } else {
        setPosts(data as PostsModel["Row"][]);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [postIDs]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!posts || posts.length === 0) {
    return <div>No posts found</div>;
  }

  const filteredPosts = posts.filter((post) => {
    if (selectedStatuses.length === 0) return true;

    if (post.status === null) {
      return false;
    }

    return selectedStatuses.includes(post.status);
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-10 post-list-container">
      <div className="statusFilterContainer border">
        <StatusFilter
          onChange={handleStatusChange}
          selectedStatuses={selectedStatuses}
        />
      </div>
      <div
        className={[
          "grid gap-4 mt-8",
          mobile ? "grid-cols-1" : "grid-cols-3",
        ].join(" ")}
      >
	{filteredPosts.map((post) => (
          <PostCard
      	    key={post.post_id}
      	    post={post}
      	    style={{ minWidth: "25vw" }}
    	  />
        ))}
      </div>
    </div>
  );
}
