import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ClaimsModel } from "@/types/Models";

type ClaimsProps = {
  claim: ClaimsModel["Row"];
  poster_lw_username: string;
  claimant_lw_username: string;
};

function Claim({
  claim,
  claimant_lw_username,
  poster_lw_username,
}: ClaimsProps) {
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
      {/* Render other claim details as needed */}
    </div>
  );
}

export default Claim;
