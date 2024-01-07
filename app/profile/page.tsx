import { createClientSsr } from "@/utils/supabase/client";
import UserProfile from "@/components/profile/UserProfile";
import {GetUser} from "@/utils/userData";

export default async function Page() {
  const user = await GetUser();
  console.log("User data: ", user)
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
      <UserProfile profile={data} privateView={true} />
    </div>
  );
}
