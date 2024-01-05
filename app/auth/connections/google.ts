"use client";
import { createClientSsr } from "@/utils/supabase/client";

export async function signInGoogle() {
  const supabase = createClientSsr();
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${location.origin}/auth/callback`,
    },
  });
}
