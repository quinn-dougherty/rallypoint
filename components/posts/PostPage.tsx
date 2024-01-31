"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProfilesModel, PostsModel, ClaimsModel } from "@/types/Models";
import ClaimCard from "@/components/claims/ClaimCard";
import createSlug from "@/utils/slug";
import { createClientSsr } from "@/utils/supabase/client";

type PostPageProps = {
  post: PostsModel["Row"];
  claims: ClaimsModel["Row"][];
};

function PostPage({ post, claims }: PostPageProps) {
  const [profile, setProfile] = useState<ProfilesModel["Row"] | null>(null);
  const [lwUsername, setLwUsername] = useState<string | null>(null);
  const { post_id, title, description, status, post_type, amount } = post;
  const [amountReactive, setAmount] = useState<number | null>(amount);

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
  useEffect(() => {
    const supabase = createClientSsr();
    supabase
      .from("posts")
      .select("amount")
      .match({ post_id })
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching post to update amount");
        } else {
          setAmount(data.amount);
        }
      });
  }, [amountReactive]);

  if (profile === null) {
    return <div>Loading...</div>;
  } else {
    const lw_username = lwUsername as string;
    const post_slug = createSlug(title, post_id);
    return (
      <div className="border">
        <h2 className="title">
          <Link href={`/${lw_username}/${post_slug}`}>{title}</Link>
        </h2>
        <p className="text-right">{`Filed by: ${lw_username}`}</p>
        <p>{description}</p>
        <div className="flex flex-row">
          <p className="border rounded-lg text-left">{`${status} ${post_type}`}</p>
          <p className="test-right">{`$${amount} available`}</p>
        </div>
        <p className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2 text-center">
          <Link href={`/${lw_username}/${post_slug}/claim`}>Make claim</Link>
        </p>
        Standing claims:
        {claims.map((claim: ClaimsModel["Row"]) => {
          return (
            <ClaimCard
              key={claim.claim_id}
              claim={claim}
              poster_lw_username={lw_username}
            />
          );
        })}
      </div>
    );
  }
}
export default PostPage;
