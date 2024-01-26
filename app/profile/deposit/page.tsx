import { createClientSsr } from "@/utils/supabase/client";
import DepositBalance from "@/components/profile/DepositBalance";
import { GetUser } from "@/utils/userData";

// This makes sense in the escrow version, not so much otherwise
export default async function Page() {
  const user = await GetUser();
  const supabase = createClientSsr();
  const { data, error } = await supabase
    .from("profiles")
    .select()
    .match({ user_id: user.id })
    .single();

  if (error) {
    return <div>{`No profile. Couldn't load somehow: ${error.message}`}</div>;
  }
  if (!data) {
    return <div>Loading... (forever probably)</div>;
  }

  return (
    <div>
      <DepositBalance profile={data} amount={100} />
    </div>
  );
}
