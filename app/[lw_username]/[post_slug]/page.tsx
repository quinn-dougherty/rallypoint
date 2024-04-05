import { createClientSsr } from "@/utils/supabase/client";
import PostPage from "@/components/posts/PostPage";
import { GetUser } from "@/utils/userData";

interface Tag {
  tag_id: string;
  tag: string;
}
const getTags = async (post_id: string) => {
  const supabase = createClientSsr();
  const { data, error } = await supabase
    .from("post_tags")
    .select()
    .match({ post_id });
  if (error) {
    return [];
  }
  if (!data) {
    return [];
  }

  return getTagsText(data);
};
const getTagsText = async (tags: Tag[]) => {
  const supabase = createClientSsr();
  const { data, error } = await supabase
    .from("tags")
    .select()
    .in(
      "tag_id",
      tags.map((tag) => tag.tag_id),
    );
  if (error) {
    return [];
  }
  return data;
};
const getComments = async (post_id: string) => {
  const supabase = createClientSsr();
  const { data, error } = await supabase
    .from("comments")
    .select()
    .match({ post_id, status: "public" });
  if (error) {
    return [];
  }
  if (!data) {
    return [];
  }
  return data;
};
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

  const tags = await getTags(post_id);
  const comments = await getComments(post_id);
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
  let userId = "";
  try {
    const user = await GetUser();
    userId = user.id;
  } catch (err) {
    userId = "";
  }
  return (
    <div>
      <PostPage
        post={data}
        tags={tags}
        comments={comments}
        claims={claims}
        loggedInAs={userId}
      />
    </div>
  );
}
