import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GetUser } from "@/utils/userData";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the Auth Helpers package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-sign-in-with-code-exchange
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.exchangeCodeForSession(code);
    const user = await GetUser();

    if (user) {
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("lw_username")
        .eq("user_id", user.id)
        .single();

      if (userProfile?.lw_username === null) {
        return NextResponse.redirect(`${requestUrl.origin}/profile/create`);
      }

      return NextResponse.redirect(requestUrl.origin);
    }
  }
  return NextResponse.redirect(requestUrl.origin);
}
