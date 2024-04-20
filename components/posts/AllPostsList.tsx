"use client";
import React, { useEffect, useState } from "react";
import { createClientSsr } from "@/utils/supabase/client";
import { PostsModel } from "@/types/Models";
import { Status } from "@/types/Enums";
import PostCard from "./PostCard";
import StatusFilter from "./StatusFilter";
import useIsMobile from "@/utils/isMobile";

function AllPostsList() {
  const supabase = createClientSsr();
  const [posts, setPosts] = useState<PostsModel["Row"][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([
    "unclaimed",
    "claimed",
  ]);

  const mobile = useIsMobile();
  const handleStatusChange = (statuses: Status[]) => {
    console.log("Selected statuses:", statuses);
    setSelectedStatuses(statuses);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select()
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      } else {
        setPosts(data as PostsModel["Row"][]);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div className="statusFilterContainer">
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
          <PostCard key={post.post_id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default AllPostsList;
