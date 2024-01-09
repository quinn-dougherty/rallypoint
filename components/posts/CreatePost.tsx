import { useRouter } from "next/navigation";
// import PostsModel from "@/types/Posts";
import { createClientSsr } from "@/utils/supabase/client";

type CreatePostProps = {
  createPost: {
    title: string;
    description: string;
    amount: number;
  };
  titleOnChange: (newValue: React.ChangeEvent<HTMLInputElement>) => void;
  descriptionOnChange: (
    newValue: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  amountOnChange: (newValue: React.ChangeEvent<HTMLInputElement>) => void;
};

async function getUser() {
  const supabase = createClientSsr();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Not authenticated:", error);
    throw error;
  }
  return data.user;
}

const CreatePost: React.FC<CreatePostProps> = ({
  createPost,
  titleOnChange,
  descriptionOnChange,
  amountOnChange,
}: CreatePostProps) => {
  const { title, description, amount } = createPost;
  let failed = false;
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const { id } = await getUser();
      const response = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner_user_id: id,
          title,
          description,
          amount,
        }),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Error creating post");
      }

      if (response.status == 200) {
        console.log("success");
      }

      const supabase = createClientSsr();
      const { lw_username } = (
        await supabase.from("profiles").select().match({ user_id: id }).single()
      ).data;
      const dbItems = await response.json();
      failed = false;
      if (lw_username) {
        const newUrl = `/${lw_username}/${dbItems[0].post_id}`;
        router.push(newUrl);
      } else {
        console.log("Failed to redirect, but successfully made new post");
      }
    } catch (error) {
      console.error("Failed somewhere:", error);
    }
  };
  return failed ? (
    <div>Failed</div>
  ) : (
      <div>
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" value={title} onChange={titleOnChange} />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={descriptionOnChange} />
      </label>
      <label>
        Amount: <input type="number" value={amount} onChange={amountOnChange} />
      </label>
      <button type="submit">Create Post</button>
    </form>
      </div>
  );
};
export default CreatePost;
