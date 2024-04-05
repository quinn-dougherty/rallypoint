import { Database } from "@/types/supabase";

type Tables = Database["public"]["Tables"];

export type ClaimsModel = Tables["claims"];
export type PostsModel = Tables["posts"];
export type ProfilesModel = Tables["profiles"];
export type CommentsModel = Tables["comments"];

export type Contributors = {
  allocation_id: string;
  user_id: string;
  amount: number;
  created_at: string;
  display_name?: string;
  lw_username?: string;
};
