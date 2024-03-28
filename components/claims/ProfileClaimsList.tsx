"use client";
import React, { useEffect, useState } from "react";
import { createClientSsr } from "@/utils/supabase/client";
import { ProfilesModel, ClaimsModel } from "@/types/Models";
import ClaimCard from "./ClaimCard";
import ResolvednessFilter, { Status } from "./ResolvednessFilter";

interface ProfileClaimsListProps {
  lw_username: string;
}

interface ClaimItemProps {
  claim: ClaimsModel["Row"];
}

const ClaimItem: React.FC<ClaimItemProps> = ({ claim }) => {
  const [poster, setPoster] = useState<ProfilesModel["Row"] | null>(null);
  const supabase = createClientSsr();
  useEffect(() => {
    const fetchPoster = async () => {
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select()
        .match({ post_id: claim.post_id })
        .single();

      if (postError) {
        console.error("Error fetching post to make url", postError.message);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select()
        .match({ user_id: postData.owner_user_id })
        .single();

      if (profileError) {
        console.error("Error fetching lw_username", profileError);
        return;
      }

      setPoster(profileData as ProfilesModel["Row"]);
    };

    fetchPoster();
  }, [claim, supabase]);

  if (!poster || !poster.lw_username) {
    return <div>Loading...</div>;
  }

  return (
    <ClaimCard
      key={claim.claim_id}
      claim={claim}
      poster_lw_username={poster.lw_username}
    />
  );
};

function ProfileClaimsList({ lw_username }: ProfileClaimsListProps) {
  const supabase = createClientSsr();
  const [claims, setClaims] = useState<ClaimsModel["Row"][]>([]);
  const [profile, setProfile] = useState<ProfilesModel["Row"] | null>(null);
  const [checkedUser, setCheckStatus] = useState(false);
  const [resolvedness, setResolvedness] = useState<Status[]>([true, false]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleResolvednessChange = (resolvednesses: Status[]) => {
    setResolvedness(resolvednesses);
  };

  useEffect(() => {
    supabase
      .from("profiles")
      .select()
      .match({ lw_username })
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching user:", error);
        } else {
          setProfile(data as ProfilesModel["Row"]);
          setCheckStatus(true);
        }
      });
  }, [lw_username]);

  useEffect(() => {
    if (!checkedUser) {
      return;
    }
    if (profile) {
      supabase
        .from("claims")
        .select()
        .match({ claimant_user_id: profile.user_id })
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching claims:", error);
          } else {
            setClaims(data as ClaimsModel["Row"][]);
          }
          setLoading(false);
        });
    }
  }, [checkedUser]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!claims) {
    return <div>Claims not found</div>;
  }

  const filteredClaims = claims.filter((claim) => {
    if (claim.is_resolved === null) {
      return true;
    } else {
      return (
        resolvedness.length === 0 || resolvedness.includes(claim.is_resolved)
      );
    }
  });

  return (
    <div className="flex flex-col ">
      <ResolvednessFilter onChange={handleResolvednessChange} />
      <div className={"profile-projects-grid"}>
        {filteredClaims.map((claim) => (
          <ClaimItem key={claim.claim_id} claim={claim} />
        ))}
      </div>
    </div>
  );
}

export default ProfileClaimsList;
