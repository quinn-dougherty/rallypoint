import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { createClientSsr } from "@/utils/supabase/client";
import HamburgerMenu from "./profile/HamburgerMenu";
import AuthButton from "./profile/AuthButton";
import { cookies } from "next/headers";

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
  const user: User | null = authData.user;

  return (
    <header className="fixed top-0 w-full z-50 bg-[hsl(var(--background))] shadow">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div>
          <Link
            href="/"
            className="text-lg font-semibold text-gray-800 hover:text-white transition-colors"
          >
            Rallypoint
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/create" className="visible-button">
            Create
          </Link>
          {user ? renderHamburger(user) : <AuthButton user={user} />}
        </div>
      </nav>
    </header>
  );
}
