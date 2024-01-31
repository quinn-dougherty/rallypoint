import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import createSlug from "@/utils/slug";
import { createClientSsr } from "@/utils/supabase/client";

type CreatePostProps = {
  createPost: {
    title: string;
    description: string;
    amount: number;
  };
  disabledSubmit: boolean;
  setDisableSubmit: Dispatch<SetStateAction<boolean>>;
  titleOnChange: (newValue: React.ChangeEvent<HTMLInputElement>) => void;
  descriptionOnChange: (
    newValue: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  amountOnChange: (newValue: React.ChangeEvent<HTMLInputElement>) => void;
};
const supabase = createClientSsr();

async function getUser() {
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
  disabledSubmit,
  setDisableSubmit,
}: CreatePostProps) => {
  const { title, description, amount } = createPost;
  let failed = false;
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setDisableSubmit(true);
    try {
      const { id } = await getUser();

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("lw_username")
        .eq("user_id", id)
        .single();

      if (profileError || !profileData?.lw_username) {
        router.push("/profile/create");
        return;
      }

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

      const { lw_username } = (
        await supabase.from("profiles").select().match({ user_id: id }).single()
      ).data;
      const dbItems = await response.json();
      failed = false;
      if (lw_username) {
        const { post_id } = dbItems[0];
        const post_slug = createSlug(title, post_id);
        const newUrl = `/${lw_username}/${post_slug}`;
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
      <form
        className="animate-in flex-1 flex-col w-full justify-center gap-2 text-foreground flex items-center group"
        onSubmit={handleSubmit}
      >
        <p>
          <label className="text-md">
            <input
              className="rounded-md px-2 py-2 bg-inherit border mb-6"
              placeholder="Title"
              type="text"
              value={title}
              onChange={titleOnChange}
            />
          </label>
        </p>
        <p>
          <label className="text-md">
            <textarea
              className="rounded-md px-2 py-2 bg-inherit border mb-6"
              placeholder="Description"
              value={description}
              onChange={descriptionOnChange}
            />
          </label>
        </p>
        <p>
          <label className="text-md">
            Amount:{" "}
            <input
              className="rounded-md px-2 py-2 bg-inherit border mb-6"
              type="number"
              value={amount}
              onChange={amountOnChange}
            />
          </label>
        </p>
        <button
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          type="submit"
          disabled={disabledSubmit}
        >
          Create Post
        </button>
      </form>
    </div>
  );
};
export default CreatePost;
