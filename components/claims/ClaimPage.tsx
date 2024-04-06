import { ClaimsModel } from "@/types/Models";
import { createClientSsr } from "@/utils/supabase/client";
import ClaimResolution from "./ClaimResolution";
import PostCard from "./../posts/PostCard";
import createSlug from "@/utils/slug";
import { GetUser } from "@/utils/userData";
import ReactMarkdown from "react-markdown";

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
  const postSlug = createSlug(post.title, post.post_id);
  return (
    <div className="page">
      <h1>
        <a href={`/${poster_lw_username}/${postSlug}/${claim_id}`}>
          Claim details
        </a>
      </h1>
      <p>Claimant: {claimant_lw_username}</p>
      <p>
        <a href={`/${poster_lw_username}/${postSlug}`}>claim of post:</a>
      </p>
      <PostCard post={post} />
      <p>
        Evidence: <ReactMarkdown className="mb-4">{description}</ReactMarkdown>
      </p>
      <p>{is_resolved ? "Resolved" : "Unresolved"}</p>
      {isPoster && !is_resolved ? (
        <ClaimResolution claim_id={claim_id} post_id={post_id} />
      ) : (
        ""
      )}
    </div>
  );
}

export default Claim;
