import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createClientSsr } from "@/utils/supabase/client";
import UserProfile from "@/components/profile/UserProfile";

async function getUser() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data }: { data: { user: { id: string } } } =
    await supabase.auth.getUser();
  if (!data) {
    console.error(`Failed to get authenticated user`);
  } else {
    const user = data.user;
    console.log(user);
    return user;
  }
}

export default async function Page() {
  const user = getUser();
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
