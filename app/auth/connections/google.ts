'use client'
import {supabase} from "@/utils/supabase/client";

export async function signInGoogle() {

    await supabase().auth.signInWithOAuth(({
        provider: "google",
        options: {
            redirectTo: `${location.origin}/auth/callback`,
        },

    }));

}