type PostProps = {
  post: {
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
  };
};

function Post(post: PostProps) {
  const { title, owner_user_id, description, status, post_type, amount } =
    post.post;
  return (
    <div className="border">
      <h2>{title}</h2>
      <p>{`Filed by: ${owner_user_id}`}</p>
      <p>{description}</p>
      <p>{`${status} ${post_type}`}</p>
      <p>{`\$${amount} available`}</p>
    </div>
  );
}
export default Post;
