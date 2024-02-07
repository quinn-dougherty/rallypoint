"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Dialog } from "@headlessui/react";
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
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState("");

  const supabase = createClientSsr();

  const HandleFund = async () => {
    setIsFundDialogOpen(false);
    console.log("Funding with amount: ", fundAmount);
    const FundingAmount = parseFloat(fundAmount);

    if (isNaN(FundingAmount) || FundingAmount <= 0) {
      alert("Please enter a valid funding amount."); // css
      return;
    }

    try {
      const response = await fetch("/api/fundPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          post_id: post_id,
          FundingAmount: FundingAmount,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("error funding post", result.error);
        throw new Error("Error funding post");
      }

      console.log("Post successfully funded:", result.message);
    } catch (error) {
      console.error("Failed somewhere", error);
    }
  };

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
        <p className="font-bold bg-green-700 rounded-md px-4 py-2 text-foreground mb-2 text-center">
          <Link href={`/${lw_username}/${post_slug}/claim`}>Make claim</Link>
        </p>
        <button
          className="font-bold bg-green-700 rounded-md px-4 py-2 text-foreground mb-2 text-center"
          onClick={() => setIsFundDialogOpen(true)}
        >
          Fund
        </button>
        <Dialog
          open={isFundDialogOpen}
          onClose={() => setIsFundDialogOpen(false)}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded shadow-lg">
              <Dialog.Title>Fund Post</Dialog.Title>
              <input
                type="number"
                className="mt-2 border p-2 w-full"
                placeholder="Amount ($)"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                  onClick={() => setIsFundDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={HandleFund}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
        <p>Standing claims:</p>
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
