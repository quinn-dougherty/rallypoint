import { Database } from "@/types/supabase";

type Tables = Database["public"]["Tables"];

export type ClaimsModel = Tables["claims"];
export type PostsModel = Tables["posts"];
export type ProfilesModel = Tables["profiles"];
