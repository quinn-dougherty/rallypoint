import { ClaimsModel } from "@/types/Models";
import { createClientSsr } from "@/utils/supabase/client";
import ClaimResolution from "./ClaimResolution";
import PostCard from "./../posts/PostCard";
import { GetUser } from "@/utils/userData";

interface ClaimsProps {
  claim: ClaimsModel["Row"];
  poster_lw_username: string;
}

async function Claim({ claim, poster_lw_username }: ClaimsProps) {
  const { claim_id, post_id, description, is_resolved, claimant_user_id } =
    claim;
  let isPoster;
  let post;
  try {
    const user = await GetUser();
    const supabasePosts = createClientSsr();
    const { data, error } = await supabasePosts
      .from("posts")
      .select()
      .match({ post_id })
      .single();
    if (error) {
      throw new Error(`couldn't retrieve user's posts: ${error.message}`);
    }
    isPoster = data.owner_user_id === user.id;
    post = data;
  } catch {
    isPoster = false;
  }
  const supabase_profiles = createClientSsr();
  const claimant_lw_username = (
    await supabase_profiles
      .from("profiles")
      .select()
      .match({ user_id: claimant_user_id })
      .single()
  ).data.lw_username;
  return (
    <div>
      <h1>
        <a href={`/${poster_lw_username}/${post_id}/${claim_id}`}>
          Claim details
        </a>
      </h1>
      <p>Claimant: {claimant_lw_username}</p>
      <p>
        <a href={`/${poster_lw_username}/${post_id}`}>claim of post:</a>
        <PostCard post={post} />
      </p>
      <p>Description: {description}</p>
      <p>Resolved: {is_resolved ? "YES" : "NO"}</p>
      {isPoster && !is_resolved ? (
        <ClaimResolution claim_id={claim_id} post_id={post_id} />
      ) : (
        ""
      )}
    </div>
  );
}

export default Claim;
