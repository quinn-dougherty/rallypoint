import { createClient } from "@/utils/supabase/server";
import { createClientSsr } from "@/utils/supabase/client";
import Link from "next/link";
import { cookies } from "next/headers";
import HamburgerMenu from "./profile/HamburgerMenu";
import AuthButton from "./profile/AuthButton";

interface Profile {
  lw_username: string;
  email:string;
  display_name: string;
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
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <ul className="top-bar">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/create">Create</Link>
          </li>
          {user ?
         ( <li> {renderHamburger(user)}  <div />
          </li>)
              :(
          <li>
            <AuthButton user={user} />
          </li>
              )          }
        </ul>
      </nav>
    </div>
  );
}
// <div className="flex flex-col gap-16 items-center">
//   <div className="flex gap-8 justify-center items-center"></div>
//   <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
//   <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
//     The fastest way to build apps with{" "}
//     <a
//       href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
//       target="_blank"
//       className="font-bold hover:underline"
//       rel="noreferrer"
//     >
//       Supabase
//     </a>{" "}
//     and{" "}
//     <a
//       href="https://nextjs.org/"
//       target="_blank"
//       className="font-bold hover:underline"
//       rel="noreferrer"
//     >
//       Next.js
//     </a>
//   </p>
//   <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
// </div>
