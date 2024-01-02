import { createClientSsr } from "@/utils/supabase/client";
import Post from "@/components/Post";

export default async function Page({
  params,
}: {
  params: { lw_username: string; post_id: string };
}) {
  const { lw_username, post_id } = params;
  const supabase = createClientSsr();
  const { data, error } = await supabase
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
  return (
    <div>
      <Post post={data} lw_username={lw_username} />
    </div>
  );
}
