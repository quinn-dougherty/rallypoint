import { createClient } from "@/utils/supabase/server";
import { createClientSsr } from "@/utils/supabase/client";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type PublicUser = {
  lw_username: string;
  display_name: string;
};

export default async function AuthButton() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    // Handle the case where user is null
    console.error("User is not logged in");
    return (
      <Link
        href="/login"
        className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        Login or Sign Up
      </Link>
    );
  }

  const user = authData.user;
  const supabaseSsr = createClientSsr();
  const public_user: PublicUser = (
    await supabaseSsr
      .from("profiles")
      .select()
      .match({ user_id: user.id })
      .single()
  ).data;

  const signOut = async () => {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center gap-4">
      <a href={`/${public_user.lw_username}`}>
        {public_user.display_name} profile
      </a>
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
