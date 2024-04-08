import { createClientSsr } from "@/utils/supabase/client";
import UserProfile from "@/components/profile/UserProfile";
import { GetUser } from "@/utils/userData";
import ReactMarkdown from "react-markdown";

export default async function Page() {
  const user = await GetUser();
  console.log("User data: ", user);

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

  let count = 0;
  const { data: postsData, error: postsError } = await supabase
    .from("posts")
    .select("post_id")
    .eq("owner_user_id", user.id);

  if (!postsError) {
    count = postsData.length;
  }

  data.postCount = count;

  return (
    <div>
      <UserProfile
        profile={{
          ...data,
          bio: (
            <ReactMarkdown className={"whitespace-pre-wrap"}>
              {data.bio}
            </ReactMarkdown>
          ),
        }}
        privateView={true}
      />
    </div>
  );
}
