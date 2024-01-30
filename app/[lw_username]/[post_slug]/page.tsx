import { createClientSsr } from "@/utils/supabase/client";
import PostPage from "@/components/posts/PostPage";

export default async function Page({
  params,
}: {
  params: { lw_username: string; post_slug: string };
}) {
  const { post_slug } = params;
  const post_id = post_slug.substring(post_slug.length - 36);
  const supabase_post = createClientSsr();
  const { data, error } = await supabase_post
    .from("posts")
    .select()
    .match({ post_id })
    .single();

  if (error) {
    return <div>{`No post. Probably dropped or couldn't load somehow`}</div>;
  }
  if (!data) {
    return <div>Loading... (forever probably)</div>;
  }

  const supabase_claims = createClientSsr();
  const { data: claims, error: claims_error } = await supabase_claims
    .from("claims")
    .select()
    .match({ post_id });

  if (claims_error) {
    return <div>{`No claims. ${claims_error.message}`}</div>;
  }
  if (!claims) {
    return <div>Loading... (forever probably)</div>;
  }

  return (
    <div>
      <PostPage post={data} claims={claims} />
    </div>
  );
}
