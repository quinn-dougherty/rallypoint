import React, { useEffect, useState } from "react";
import { createClientSsr } from "@/utils/supabase/client";
import { CommentsModel } from "@/types/Models";
import Link from "next/link";
interface ProfileCommentsListProps {
  user_id: string;
}
interface CommentTitles {
  post_id: string;
  title: string;
}
const getPostTitle = async (post_id: string) => {
  const supabase = createClientSsr();
  const { data, error } = await supabase
    .from("posts")
    .select("title")
    .match({ post_id })
    .single();
  if (error) {
    return "";
  }
  if (!data) {
    return "";
  }
  return data.title;
};
export default function ProfileCommentsList({
  user_id,
}: ProfileCommentsListProps) {
  const supabase = createClientSsr();
  const [comments, setComments] = useState<CommentsModel["Row"][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [commentTitles, setCommentTitles] = useState<CommentTitles[]>([]);
  useEffect(() => {
    if (!loading) return;
    supabase
      .from("comments")
      .select()
      .match({ user_id })
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching comments:", error);
        } else {
          setComments(data as CommentsModel["Row"][]);
        }
        setLoading(false);
      });
  }, [loading]);

  React.useEffect(() => {
    if (comments.length === 0) return;
    comments.forEach(async (comment) => {
      const title = await getPostTitle(comment.post_id!);
      setCommentTitles((prev) => [
        ...prev,
        { post_id: comment.post_id!, title },
      ]);
    });
  }, [comments]);

  return (
    <div className={"flex flex-col"}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={""}>
          {comments.map((comment) => (
            <div
              key={comment.comment_id}
              className="border shadow-lg rounded-lg overflow-hidden w-full my-5"
            >
              <div className="p-5">
                <div className={"comment-quote"}>&ldquo;</div>
                <div className={"comment-body"}>
                  <p className={"text-xl"}>{comment.contents}</p>
                  <p className="text-sm">
                    {new Date(comment.created_at).toLocaleDateString("en-us", {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    on{" "}
                    <Link href={`/posts/${comment.post_id}`}>
                      <b>
                        {
                          commentTitles.find(
                            (title) => title.post_id === comment.post_id,
                          )?.title
                        }
                      </b>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
