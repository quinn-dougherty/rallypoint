"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Dialog } from "@headlessui/react";
import { ProfilesModel, PostsModel, ClaimsModel } from "@/types/Models";
import ClaimCard from "@/components/claims/ClaimCard";
import createSlug from "@/utils/slug";
import { createClientSsr } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
interface Tag {
  tag_id: string;
  tag: string;
}
type PostPageProps = {
  post: PostsModel["Row"];
  claims: ClaimsModel["Row"][];
  tags: Tag[];
};

function PostPage({ post, claims, tags }: PostPageProps) {
  const [profile, setProfile] = useState<ProfilesModel["Row"] | null>(null);
  const [lwUsername, setLwUsername] = useState<string | null>(null);
  const { post_id, title, description, status, post_type, amount } = post;
  const [amountReactive, setAmount] = useState<number | null>(amount);
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState("");

  const supabase = createClientSsr();
  const router = useRouter();

  const HandleFund = async () => {
    setIsFundDialogOpen(false);
    const FundingAmount = parseFloat(fundAmount);

    if (isNaN(FundingAmount) || FundingAmount <= 0) {
      console.error("Please enter a valid funding amount.");
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
      router.refresh();

      console.log("Post successfully funded:", result.message);
    } catch (error) {
      console.error("Error funding post");
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
      <div className="border rounded-lg shadow-lg p-6 bg-background text-foreground duration-300 ease-in-out hover:shadow-xl">
        <h2 className="text-lg font-semibold mb-4">
          <Link
            href={`/${lw_username}/${post_slug}`}
            className="hover:underline"
          >
            {title}
          </Link>
        </h2>
        <p className="text-sm text-right mb-2">Filed by: {lw_username}</p>
        <div className="flex flex-row justify-between items-center mb-4">
          <span className="inline-block bg-btn-background hover:bg-btn-background-hover text-foreground font-medium py-1 px-3 rounded-full">
            {`${status?.toUpperCase()} ${post_type?.toUpperCase()}`}
          </span>
          <span className="font-semibold">{`$${amount} available`}</span>
        </div>
        <p className="mb-4">{description}</p>
        <div className={"flex flex-row gap-2 py-3 tags-list"}>
          {tags.map((tag) => (
            <Link
              key={tag.tag_id}
              className="bg-btn-background hover:bg-btn-background-hover text-foreground font-medium py-1 px-3 rounded-full"
              href={`/tags/${tag.tag}`}
            >
              {tag.tag}
            </Link>
          ))}
        </div>
        <Link
          href={`/${lw_username}/${post_slug}/claim`}
          className="inline-block bg-green-700 hover:bg-green-800 text-foreground py-2 px-4 rounded-md"
        >
          Make claim
        </Link>
        <button
          className="ml-4 bg-green-700 hover:bg-green-800 text-foreground py-2 px-4 rounded-md"
          onClick={() => setIsFundDialogOpen(true)}
        >
          Fund
        </button>
        <Dialog
          open={isFundDialogOpen}
          onClose={() => setIsFundDialogOpen(false)}
          className="animate-in fixed z-50 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <div className="inline-block align-middle bg-background rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full border-2 border-foreground/50">
              <div className="bg-background px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-foreground"
                    >
                      Fund Post
                    </Dialog.Title>
                    <div className="mt-2">
                      <input
                        type="number"
                        className="border-2 border-foreground/50 rounded-md shadow-sm mt-2 p-2 w-full text-foreground bg-background focus:ring-btn-background-hover focus:border-btn-background-hover transition duration-300"
                        placeholder="Amount ($)"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-background px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm transition duration-300"
                  onClick={HandleFund}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-background text-base font-medium text-foreground hover:bg-btn-background-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btn-background-hover sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition duration-300"
                  onClick={() => setIsFundDialogOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Dialog>

        <p className="mt-4 font-semibold">Standing claims:</p>
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
