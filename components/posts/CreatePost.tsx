import React, { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import createSlug from "@/utils/slug";
import { createClientSsr } from "@/utils/supabase/client";
import Select from "react-select";
import "./createPost.css";
interface Tag {
  tag_id: string;
  tag: string;
}
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
  const [errorApi, setErrorMessage] = React.useState<string>("");
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([]);
  const [deadline, setDeadline] = React.useState<string>("");
  React.useEffect(() => {
    if (tags.length > 0) {
      return;
    }
    fetch("/api/tags", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setTags(data);
      });
  }, [tags]);
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
        router.push("/profile/edit");
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
          tags: selectedTags.map((tag) => tag.tag_id),
          deadline,
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
      if (dbItems.error) {
        setErrorMessage(dbItems.error);
        setDisableSubmit(false);
        return;
      }
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
      setErrorMessage("Failed to create post, please try again.");
      setDisableSubmit(false);
    }
  };

  return failed ? (
    <div>Failed</div>
  ) : (
    <>
      {tags.length == 0 ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3>Create Post</h3>
          {errorApi && <h4 className={"error-api"}>{errorApi}</h4>}

          <form
            className="animate-in flex-1 flex-col w-full justify-center gap-2 text-foreground flex items-center group"
            onSubmit={handleSubmit}
          >
            <div
              className={
                "animate-in flex-1 flex-col w-full justify-center gap-2 text-foreground flex items-center group"
              }
            >
              <div className={"grid grid-cols-2 gap-6"}>
                <label className="text-md">Title</label>
                <input
                  className="rounded-md px-2 py-2 bg-inherit border mb-6"
                  placeholder="Title"
                  type="text"
                  value={title}
                  onChange={titleOnChange}
                />
                <label className="text-md">Description</label>
                <textarea
                  className="rounded-md px-2 py-2 bg-inherit border mb-6"
                  placeholder="Description"
                  value={description}
                  onChange={descriptionOnChange}
                />

                <label className="text-md">Amount</label>
                <input
                  className="rounded-md px-2 py-2 bg-inherit border mb-6"
                  type="number"
                  value={amount}
                  onChange={amountOnChange}
                />

                <label className="text-md">Tags</label>
                <Select
                  isMulti={true}
                  name={"tags"}
                  options={tags}
                  onChange={(selectedTags) => {
                    const tags = selectedTags as Tag[];
                    setSelectedTags(tags);
                  }}
                  getOptionLabel={(option: Tag) => option.tag}
                  classNamePrefix="react-select"
                  getOptionValue={(option: Tag) => option.tag_id}
                />
                <label className="text-md">Deadline</label>
                <input
                  name={"deadline"}
                  className="rounded-md px-2 py-2 bg-inherit border mb-6"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setDeadline(e.target.value);
                  }}
                />
                <button
                  className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
                  type="submit"
                  disabled={disabledSubmit}
                >
                  Create Post
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
export default CreatePost;
