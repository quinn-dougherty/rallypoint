import React from "react";
import { createClientSsr } from "@/utils/supabase/client";
import UserProfile from "@/components/UserProfile";

export default async function Page({
  params,
}: {
  params: { lw_username: string };
}) {
  const { lw_username } = params;
  const supabase = createClientSsr();
  const { data, error } = await supabase
    .from("users")
    .select()
    .match({ lw_username })
    .single();

  if (error) {
    return <div>{`Probably dropped or couldn't load somehow`}</div>;
  }
  if (!data) {
    return <div>Loading... (forever probably)</div>;
  }

  // return <div>{lw_username}</div>;
  return (
    <div>
      <UserProfile profile={data} />
    </div>
  );
}
