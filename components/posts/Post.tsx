import PostsModel from "@/types/Posts";

type PostProps = {
  post: PostsModel;
  lw_username: string;
};

function Post({ post, lw_username }: PostProps) {
  const { post_id, title, description, status, post_type, amount } = post;
  return (
    <div className="border">
      <h2>
        <a href={`/${lw_username}/${post_id}`}>{title}</a>
      </h2>
      <p>{`Filed by: ${lw_username}`}</p>
      <p>{description}</p>
      <p>{`${status} ${post_type}`}</p>
      <p>{`$${amount} available`}</p>
    </div>
  );
}
export default Post;
