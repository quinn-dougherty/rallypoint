/// TODO: refactor everywhere to use `Models.ts`

export default interface PostsModel {
  post_id: string;
  owner_user_id: string;
  title: string;
  description: string | null;
  post_type: "bounty" | "dac";
  amount: number;
  status: "unclaimed" | "claimed" | "finished";
  deadline: string | null;
  created_at: string;
  updated_at: string;
}
