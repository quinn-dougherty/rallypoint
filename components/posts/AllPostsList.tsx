"use client";
import React, { useEffect, useState } from "react";
import { createClientSsr } from "@/utils/supabase/client";
import { PostsModel } from "@/types/Models";
import { Status } from "@/types/Enums";
import PostCard from "./PostCard";
import StatusFilter from "./StatusFilter";

function AllPostsList() {
  const supabase = createClientSsr();
  const [posts, setPosts] = useState<PostsModel["Row"][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([
    "unclaimed",
    "claimed",
  ]);

  const handleStatusChange = (statuses: Status[]) => {
    setSelectedStatuses(statuses);
  };

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
  const filteredPosts = posts.filter(
    (post) =>
      selectedStatuses.length === 0 || selectedStatuses.includes(post.status),
  );

  return (
    <div>
      <StatusFilter onChange={handleStatusChange} />
      {filteredPosts.map((post) => (
        <PostCard key={post.post_id} post={post} />
      ))}
    </div>
  );
}

export default AllPostsList;
