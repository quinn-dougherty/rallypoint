import { createClientSsr } from "@/utils/supabase/client";
import Claim from "@/components/claims/Claim";

export default async function Page({
  params,
}: {
  params: { lw_username: string; post_id: string; claim_id: string };
}) {
  const { lw_username, claim_id } = params;
  const supabase_claims = createClientSsr();
  const { data, error } = await supabase_claims
    .from("claims")
    .select()
    .match({ claim_id })
    .single();
  if (error) {
    return (
      <div>{`No claim. Probably dropped or couldn't load somehow: ${error.message}`}</div>
    );
  }
  if (!data) {
    return <div>Loading... (forever probably)</div>;
  }

  // const supabase_profiles = createClientSsr();
  // const { data: claimant_data, error: claimant_error } = await supabase_profiles
  //   .from("profiles")
  //   .select()
  //   .match({ user_id: data.claimant_user_id })
  //   .single();
  // if (claimant_error) {
  //   return <div>{`No claimant user info: ${claimant_error.message}`}</div>;
  // }
  // if (!claimant_data) {
  //   return <div>Loading... (forever probably)</div>;
  // }
  // const claimant_lw_username = claimant_data.lw_username;

  return (
    <div>
      <Claim claim={data} poster_lw_username={lw_username} />
    </div>
  );
}
