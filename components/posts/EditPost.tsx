import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import PostsModel from '@/types/Posts';

type EditPostProps = {
  post: PostsModel;
};

const EditPost: React.FC<EditPostProps> = ({ post }) => {
  const [title, setTitle] = useState(post.title || '');
  const [description, setDescription] = useState(post.description || '');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const updatePost = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/editPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: post.post_id,
          title,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Post updated successfully:", result);

      const newPath = pathname.replace(/\/edit$/, '');

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
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <button onClick={updatePost} disabled={loading}>
        Update Post
      </button>
    </div>
  );
};

export default EditPost;
