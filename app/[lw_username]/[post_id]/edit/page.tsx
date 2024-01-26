'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import EditPost from '@/components/posts/EditPost';
import { createClientSsr } from '@/utils/supabase/client';

export default function EditPage() {
  const pathname = usePathname();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const post_id = pathSegments[1];

    if (!post_id) {
      console.error("post_id is missing.");
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      const supabaseClient = createClientSsr();
      const { data, error } = await supabaseClient
        .from('posts')
        .select('*')
        .eq('post_id', post_id)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [pathname]);

  if (loading) return <div>Loading post...</div>;
  if (!post) return <div>Post not found or error loading post.</div>;

  return (
    <EditPost post={post} />
  );
}
