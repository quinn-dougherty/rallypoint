import { ClaimsModel } from "@/types/Models";
import { createClientSsr } from "@/utils/supabase/client";

type ClaimsProps = {
  claim: ClaimsModel["Row"];
  poster_lw_username: string;
};

async function Claim({ claim, poster_lw_username }: ClaimsProps) {
  const {
    claim_id,
    post_id,
    description,
    status,
    is_resolved,
    claimant_user_id,
  } = claim;
  const supabase = createClientSsr();
  const claimant_lw_username = (
    await supabase
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
      <p>Description: {description}</p>
      <p>Status: {status}</p>
      <p>Resolved: {is_resolved}</p>
      {/* Render other claim details as needed */}
    </div>
  );
}

export default Claim;
