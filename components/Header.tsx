"use client";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { createClientSsr } from "@/utils/supabase/client";
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
  const { data: profile } = await supabaseSsr
      .from("profiles")
      .select()
      .match({ user_id: user.id })
      .single();
  return <HamburgerMenu user={user} profile={profile} />;
}

const Header = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkUser() {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      const { data: authData } = await supabase.auth.getUser();
      setUser(authData.user);
    }
    checkUser();
  }, []);

  return (
    <header className="bg-blue shadow fixed top-0 inset-x-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div>
          <Link href="/" className="text-lg font-semibold text-gray-800 hover:text-white transition-colors">Rallypoint</Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/create" className="text-base font-medium text-gray-600 hover:text-white transition-colors">Create</Link>
          {user ? renderHamburger(user) : <AuthButton />}
        </div>
      </nav>
    </header>
  );
};

export default Header;
