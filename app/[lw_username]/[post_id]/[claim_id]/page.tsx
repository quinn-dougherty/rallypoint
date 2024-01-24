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

  return (
    <div>
      <Claim claim={data} poster_lw_username={lw_username} />
    </div>
  );
}
