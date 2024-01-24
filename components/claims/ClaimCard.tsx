import React, { useState, useEffect } from "react";
import { createClientSsr } from "@/utils/supabase/client";
import { ClaimsModel } from "@/types/Models";

type ClaimsProps = {
  claim: ClaimsModel["Row"];
  poster_lw_username: string;
};

function Claim({ claim, poster_lw_username }: ClaimsProps) {
  const [claimant_lw_username, setClaimantLwUsername] = useState<string | null>(
    null,
  );
  useEffect(() => {
    const supabase = createClientSsr();
    const { claimant_user_id } = claim;
    supabase
      .from("profiles")
      .select()
      .match({ user_id: claimant_user_id })
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching lw_username");
        } else {
          setClaimantLwUsername(data.lw_username);
        }
      });
  }, [claim]);
  if (claimant_lw_username === null) {
    return <div>Loading...</div>;
  }

  const { claim_id, post_id, description, status, is_resolved } = claim;
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
    </div>
  );
}

export default Claim;
