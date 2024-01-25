import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const EditPost = ({ post }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [description, setDescription] = useState(post?.description || '');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updatePost = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/edit', {
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

      router.push(`/${post.lw_username}/${post.post_id}`);
    } catch (error) {
      console.error("Error updating post:", error.message);
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
