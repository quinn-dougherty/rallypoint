import { createClient } from "@/utils/supabase/server";
import { createClientSsr } from "@/utils/supabase/client";
import Link from "next/link";
import { cookies } from "next/headers";
import HamburgerMenu from "./profile/HamburgerMenu";
import AuthButton from "./profile/AuthButton";

interface Profile {
  lw_username: string;
  email: string;
  display_name: string;
  balance: number;
}

interface User {
  id: string;
}

async function renderHamburger(user: User) {
  const supabaseSsr = createClientSsr();
  const profile: Profile = (
    await supabaseSsr
      .from("profiles")
      .select()
      .match({ user_id: user.id })
      .single()
  ).data;
  return <HamburgerMenu user={user} profile={profile} />;
}

export default async function Header() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  return (
    <div className="fixed top-0 flex-1 w-full flex flex-col gap-20 text-xl items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-24">
        <ul className="top-bar">
          <li className="bg-btn-background hover:underline rounded-md px-4 py-2 text-foreground mb-2">
            <Link href="/">Rallypoint</Link>
          </li>
          <li className="py-2 px-4 rounded-md hover:underline bg-green-700 hover:bg-btn-background-hover">
            <Link href="/create">Create</Link>
          </li>
          {user ? (
            <li>
              {" "}
              {await renderHamburger(user)} <div />
            </li>
          ) : (
            <li>
              <AuthButton user={user} />
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
