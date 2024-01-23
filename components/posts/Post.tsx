import PostsModel from "@/types/Posts";
import Claim from "@/components/claims/Claim";
import { ClaimsModel } from "@/types/Models";

type PostProps = {
  post: PostsModel;
  lw_username: string;
  claims?: ClaimsModel["Row"][];
};

function Post({ post, lw_username, claims }: PostProps) {
  const { post_id, title, description, status, post_type, amount } = post;
  return (
    <div className="border">
      <h2>
        <a href={`/${lw_username}/${post_id}`}>{title}</a>
      </h2>
      <p>{`Filed by: ${lw_username}`}</p>
      <p>{description}</p>
      <p>{`${status} ${post_type}`}</p>
      <p>{`$${amount} available`}</p>
      {claims
        ? claims.map((claim: ClaimsModel["Row"]) => (
            <Claim
              key={claim.claim_id}
              claim={claim}
              poster_lw_username={lw_username}
            />
          ))
        : ""}
    </div>
  );
}
export default Post;
