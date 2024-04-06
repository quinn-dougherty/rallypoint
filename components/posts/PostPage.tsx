"use client";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { Dialog } from "@headlessui/react";
import {
  ProfilesModel,
  PostsModel,
  ClaimsModel,
  Contributors,
} from "@/types/Models";
import ClaimCard from "@/components/claims/ClaimCard";
import createSlug from "@/utils/slug";
import { createClientSsr } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import "./postPage.css";
interface Tag {
  tag_id: string;
  tag: string;
}
interface Comments {
  comment_id: string;
  post_id: string;
  user_id: string;
  contents: string;
  created_at: string;
}
type PostPageProps = {
  post: PostsModel["Row"];
  claims: ClaimsModel["Row"][];
  tags: Tag[];
  comments: Comments[];
  loggedInAs: string | null;
};

function PostPage({ post, claims, tags, comments, loggedInAs }: PostPageProps) {
  const [profile, setProfile] = useState<ProfilesModel["Row"] | null>(null);
  const [lwUsername, setLwUsername] = useState<string | null>(null);
  const { post_id, title, description, status, post_type, amount } = post;
  const [amountReactive, setAmount] = useState<number | null>(amount);
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawContribution, setWithdrawContribution] = useState<string>("");
  const [fundAmount, setFundAmount] = useState("");
  const [newComment, setNewComment] = useState<string>("");
  const [contributors, setContributors] = useState<Contributors[]>([]);
  const [selectedTab, setSelectedTab] = useState("Bounty");
  const [terminateLoading, setTerminateLoading] = useState(false);
  const supabase = createClientSsr();
  const router = useRouter();
  const tabs = ["Bounty", "Claims"];
  const HandleFund = async () => {
    setIsFundDialogOpen(false);
    const FundingAmount = parseFloat(fundAmount);

    if (isNaN(FundingAmount) || FundingAmount <= 0) {
      console.error("Please enter a valid funding amount.");
      return;
    }

    try {
      await fetch("/api/fundPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: post_id,
          FundingAmount: FundingAmount,
        }),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error funding post ", error);
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

  const saveComment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: post_id,
          comment: newComment,
        }),
      });
      const result = await response.json();
      console.log("Comment posted:", result.message);
      router.refresh();
    } catch (error) {
      console.error("Error posting comment");
    }
  };
  React.useEffect(() => {
    if (contributors.length > 0) {
      return;
    }
    const getContributors = async () => {
      const response = await fetch("/api/fundPost/contributors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: post_id,
        }),
      });
      const result = await response.json();
      setContributors(result);
    };
    getContributors();
  }, [contributors]);

  const HandleWithdraw = async () => {
    setIsWithdrawOpen(false);
    try {
      await fetch("/api/fundPost/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          allocation_id: withdrawContribution,
        }),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error withdrawing contribution", error);
    }
  };
  const HandleTerminate = async () => {
    setTerminateLoading(true);
    try {
      for (const contribution of contributors) {
        await fetch("/api/fundPost/withdraw", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            allocation_id: contribution.allocation_id,
          }),
        });
      }
      await fetch("/api/fundPost/terminate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: post_id,
        }),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error terminating bounty", error);
    }
  };

  const isPastDeadline = new Date() >= new Date(post.deadline || new Date());

  if (profile === null) {
    return <div>Loading...</div>;
  } else {
    const lw_username = lwUsername as string;
    const post_slug = createSlug(title, post_id);
    return (
      <div className={"full-page"}>
        <div className={"post-header pb-8 pt-8"}>
          <h1 className="title">{` ${title}`}</h1>
          <h4>
            {tags.map((tag) => (
              <Link
                key={tag.tag_id}
                className="bg-btn-background hover:bg-btn-background-hover text-foreground font-medium py-1 px-3 rounded-full"
                href={`/tags/${tag.tag}`}
              >
                {tag.tag}
              </Link>
            ))}
          </h4>
        </div>
        <div className={"post-nav"}>
          <div className={"actions-left"}>
            {tabs.map((tab) => (
              <Link
                key={tab}
                onClick={() => setSelectedTab(tab)}
                href={``}
                className={`tab ${selectedTab === tab ? "active" : ""}`}
              >
                {tab}
                {tab == "Claims" && (
                  <span className="ml-2 text-sm text-foreground bg-green-800 floating">
                    {claims.length}
                  </span>
                )}
              </Link>
            ))}
          </div>
          <div className={"actions-right"}>
            {status === "unclaimed" && !isPastDeadline && (
              <>
                <Link
                  href={`/${lw_username}/${post_slug}/claim`}
                  className="inline-block bg-green-700 hover:bg-green-800 text-foreground py-2 px-4 rounded-md make-claim"
                >
                  Make claim
                </Link>
                <button
                  className="ml-4 bg-green-700 hover:bg-green-800 text-foreground py-2 px-4 rounded-md"
                  onClick={() => setIsFundDialogOpen(true)}
                >
                  Fund
                </button>
              </>
            )}
            {loggedInAs === post.owner_user_id && (
              <Link
                href={`/${lw_username}/${post_slug}/edit`}
                className="inline-block bg-btn-background hover:bg-yellow-950 text-foreground py-2 px-4 rounded-md ml-4 bg-yellow-900  edit-post"
              >
                Edit
              </Link>
            )}
          </div>
        </div>

        <div className="border rounded-lg shadow-lg p-6 bg-background text-foreground duration-300 ease-in-out hover:shadow-xl half-page post-body col-page">
          <div className={"post-contents"}>
            {selectedTab === "Bounty" && (
              <div className="" id={"post-details"} key={"post-details"}>
                <p className="text-sm text-right mb-2">
                  Filed by: {lw_username}
                </p>
                <div className="flex flex-row justify-between items-center mb-4">
                  <span className="text-sm">
                    Created:{" "}
                    {new Date(post.created_at!).toLocaleDateString("en-us", {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    <br />
                    Due:{" "}
                    {new Date(post.deadline!).toLocaleDateString("en-us", {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span
                    className={[
                      "inline-block bg-btn-background  text-foreground font-medium py-1 px-3 rounded-full",
                      status == "claimed" ? "bg-green-800" : "",
                      status == "closed" || isPastDeadline ? "bg-red-950" : "",
                    ].join(" ")}
                  >
                    {`${status?.toUpperCase()} ${post_type?.toUpperCase()}`}
                  </span>
                  <span className="font-semibold highlight-text">{`$${amount} available`}</span>
                </div>
		<ReactMarkdown className="mb-4">{String(description)}</ReactMarkdown>

                <hr className={"mt-4"} />
                <p className={"mt-4 font-semibold"}>Comments:</p>
                {comments.length === 0 && (
                  <p>Be the first one to post a comment.</p>
                )}
                {comments.map((comment) => {
                  return (
                    <div
                      key={comment.comment_id}
                      className="border rounded-lg p-2 mt-2"
                    >
                      <ReactMarkdown>{comment.contents}</ReactMarkdown>
                      <p className="text-sm text-right">
                        {new Date(comment.created_at).toLocaleDateString(
                          "en-us",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  );
                })}
                <form
                  className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground px-8 py-4"
                  onSubmit={saveComment}
                >
                  <label className="text-md" htmlFor="comment">
                    Write a comment
                  </label>
                  <textarea
                    className="rounded-md px-4 py-2 bg-inherit border mb-6"
                    name="comment"
                    placeholder="Comment"
                    required={true}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
                    Post Comment
                  </button>
                </form>
              </div>
            )}
            {selectedTab === "Claims" && (
              <>
                <p className="mt-4 font-semibold">Standing claims:</p>
                {claims.length === 0 && <p>No claims yet.</p>}
                {claims.map((claim: ClaimsModel["Row"]) => {
                  return (
                    <ClaimCard
                      key={claim.claim_id}
                      claim={claim}
                      poster_lw_username={lw_username}
                    />
                  );
                })}
              </>
            )}
          </div>
          <div className={"post-sidebar"}>
            <div className="" id={"contributions"} key={"contributions"}>
              <h2 className="text-lg font-semibold mb-4">Contributions</h2>
              {contributors.length === 0 ? (
                <p>No contributions yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 mt-4">
                  {contributors.map((contributor, index) => (
                    <div
                      key={index}
                      className="flex flex-row justify-between items-center bg-background rounded-lg p-4 bg-gray-500"
                    >
                      <div className="flex flex-row items-center">
                        <Link href={`/${contributor.lw_username}`}>
                          {contributor.display_name}
                        </Link>
                      </div>
                      <p className={"text-lg"}>
                        {contributor.amount}.00$
                        {contributor.user_id == loggedInAs &&
                          status === "unclaimed" && (
                            <button
                              className=""
                              onClick={() => {
                                setIsWithdrawOpen(true);
                                setWithdrawContribution(
                                  contributor.allocation_id,
                                );
                              }}
                            >
                              <svg
                                viewBox="0 8 24 8"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="#450a0a"
                                width="24"
                                height="24"
                                aria-hidden="true"
                                className={"remove-contribution"}
                              >
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g
                                  id="SVGRepo_tracerCarrier"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                  <path
                                    fill=""
                                    d="M16 8c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8 8-3.6 8-8zM7 6.4l-1.8 1.8-1.4-1.4 4.2-4.2 4.2 4.2-1.4 1.4-1.8-1.8v6.6h-2v-6.6z"
                                    data-darkreader-inline-fill=""
                                  ></path>
                                </g>
                              </svg>
                            </button>
                          )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <Dialog
          open={isWithdrawOpen}
          onClose={() => setIsWithdrawOpen(false)}
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
                      Withdraw Contribution
                    </Dialog.Title>
                  </div>
                </div>
              </div>
              {terminateLoading ? (
                <>Closing. Please wait...</>
              ) : (
                <div className="bg-background px-4 py-3 sm:px-6 sm center">
                  {loggedInAs === post.owner_user_id ? (
                    <>
                      <h3>
                        You cannot withdraw contributions from your own bounty.
                        <br />
                        You may however, terminate the bounty.
                      </h3>
                      <button
                        className={
                          "mt-4 bg-red-700 hover:bg-red-800 text-foreground py-2 px-4 rounded-md"
                        }
                        onClick={HandleTerminate}
                      >
                        CLOSE BOUNTY
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm transition duration-300"
                      onClick={HandleWithdraw}
                    >
                      Confirm
                    </button>
                  )}
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-background text-base font-medium text-foreground hover:bg-btn-background-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btn-background-hover sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition duration-300"
                    onClick={() => setIsWithdrawOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </Dialog>

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
      </div>
    );
  }
}
export default PostPage;
