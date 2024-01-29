"use client";
import React, { useState, useEffect } from "react";
import { createClientSsr } from "@/utils/supabase/client";
import PercentageInput from "@/components/PercentageInput";

interface ClaimResolutionProps {
  claim_id: string;
  post_id: string;
}

function ClaimResolution({ claim_id, post_id }: ClaimResolutionProps) {
  const [claimantUserId, setClaimantUserId] = useState<string>("");
  const [posterUserId, setPosterUserId] = useState<string>("");
  const [percentage, setPercentage] = useState<number>(100);

  const handlePercentageChange = (newPercentage: number) => {
    setPercentage(newPercentage);
  };

  useEffect(() => {
    const supabase = createClientSsr();
    supabase
      .from("claims")
      .select()
      .match({ claim_id })
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching claimant user id");
        } else {
          setClaimantUserId(data.claimant_user_id);
        }
      });
    supabase
      .from("posts")
      .select()
      .match({ post_id })
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching poster user id: ${error.message}");
        } else {
          setPosterUserId(data.owner_user_id);
        }
      });
  }, [claim_id, post_id]);

  async function handleSubmit() {
    try {
      const response = await fetch("/api/resolveClaim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimant_user_id: claimantUserId,
          poster_user_id: posterUserId,
          percentageAward: percentage,
          claim_id,
          post_id,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("success:", data);
        window.location.reload();
      } else {
        console.error("error:", data);
      }
    } catch (error) {
      console.error("Failed to update balances:", error);
    }
  }

  return (
    <div>
      <PercentageInput value={percentage} onChange={handlePercentageChange} />
      <button
        className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
        onClick={handleSubmit}
      >
        Submit Resolution
      </button>
    </div>
  );
}

export default ClaimResolution;
