"use client";
import React, { useEffect, useState } from "react";
import { createClientSsr } from "@/utils/supabase/client";
import PostCard from "./PostCard";
import StatusFilter from "./StatusFilter";
import PostsModel from "@/types/Posts";
import UsersModel from "@/types/Users";
import { Status } from "@/types/Enums";

interface ProfilePostsProps {
  lw_username: string;
}

function ProfilePostsList({ lw_username }: ProfilePostsProps) {
  const supabase = createClientSsr();
  const [posts, setPosts] = useState<PostsModel[]>([]);
  const [user, setUser] = useState<UsersModel | null>(null);
  const [checkedUser, setCheckStatus] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([
    "unclaimed",
    "claimed",
  ]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleStatusChange = (statuses: Status[]) => {
    setSelectedStatuses(statuses);
  };

  useEffect(() => {
    supabase
      .from("profiles")
      .select()
      .match({ lw_username })
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching user:", error);
        } else {
          setUser(data as UsersModel);
          setCheckStatus(true);
        }
      });
  }, [lw_username]);

  useEffect(() => {
    if (!checkedUser) {
      return;
    }
    if (user) {
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
  }, [checkedUser]);

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

export default ProfilePostsList;
