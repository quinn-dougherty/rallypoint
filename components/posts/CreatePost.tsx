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
  // const cookieStore = cookies();
  // const supabase = createClient(cookieStore);
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
      // Handle success (maybe redirect or show a success message)
    } catch (error) {
      console.error("Failed to create post:", error);
      // Handle error (show error message)
    }
  };
  return (
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
  );
};
export default CreatePost;
