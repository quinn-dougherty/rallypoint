import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { PostsModel } from "@/types/Models";

type EditPostProps = {
  post: PostsModel["Row"];
};

const EditPost: React.FC<EditPostProps> = ({ post }) => {
  const [title, setTitle] = useState(post.title || "");
  const [description, setDescription] = useState(post.description || "");
  const [loading, setLoading] = useState(false);
  const [deadline, setDeadline] = useState(
    post.deadline || new Date().toISOString().split("T")[0],
  );
  const router = useRouter();
  const pathname = usePathname();

  const updatePost = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/editPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: post.post_id,
          title,
          description,
          deadline,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Post updated successfully:", result);

      const newPath = pathname.replace(/\/edit$/, "");

      router.push(newPath);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error updating post:", error.message);
      } else {
        console.error("Error updating post: An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Edit Post</h1>

      <div
        className={
          "animate-in flex-1 flex-col w-full justify-center gap-2 text-foreground flex items-center group"
        }
      >
        <div className={"grid grid-cols-2 gap-6"}>
          <label className={"text-md"}>Title</label>
          <input
            type="text"
            className="rounded-md px-2 py-2 bg-inherit border mb-6"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="description">Description</label>
          <textarea
            placeholder="Description"
            className="rounded-md px-2 py-2 bg-inherit border mb-6"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <label htmlFor="deadline">Deadline</label>
          <input
            type="date"
            className="rounded-md px-2 py-2 bg-inherit border mb-6"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button
            className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2 center"
            onClick={updatePost}
            disabled={loading}
          >
            Update Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
