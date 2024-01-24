import { createClientSsr } from "@/utils/supabase/client";
import Post from "@/components/posts/Post";

export default async function Page({
  params,
}: {
  params: { lw_username: string; post_id: string };
}) {
  const { lw_username, post_id } = params;
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

  const supabase_claim = createClientSsr();
  const { data: claims, error: claims_error } = await supabase_claim
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
      <Post post={data} claims={claims} />
    </div>
  );
}
