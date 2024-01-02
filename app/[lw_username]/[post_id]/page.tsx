import { createClientSsr } from "@/utils/supabase/client";
import Post from "@/components/Post";

export default async function Page({
  params,
}: {
  params: { post_id: string };
}) {
  const { post_id } = params;
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
      <Post post={data} lw_username={"quinn-dougherty"} />
    </div>
  );
}
