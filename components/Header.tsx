// import { createClient } from "@/utils/supabase/server";
// import { cookies } from "next/headers";
import AuthButton from "./AuthButton";

export default function Header() {
  // const cookieStore = cookies();
  // const canInitSupabaseClient = () => {
  //   // This function is just for the interactive tutorial.
  //   // Feel free to remove it once you have Supabase connected.
  //   try {
  //     createClient(cookieStore);
  //     return true;
  //   } catch (e) {
  //     return false;
  //   }
  // };
  // const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <ul>
          <li>
            <a href="/">Home</a>
            <a href="/create">Create</a>
            <AuthButton />
          </li>
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
