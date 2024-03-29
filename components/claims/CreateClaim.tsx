import { createClientSsr } from "@/utils/supabase/client";
import { ClaimsModel } from "@/types/Models";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

type CreateClaimProps = {
  claim: ClaimsModel["Insert"];
  post_id: string;
  disabledSubmit: boolean;
  setDisableSubmit: Dispatch<SetStateAction<boolean>>;
  descriptionOnChange: (
    newValue: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
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

const CreateClaim: React.FC<CreateClaimProps> = ({
  claim,
  post_id,
  descriptionOnChange,
  disabledSubmit,
  setDisableSubmit,
}: CreateClaimProps) => {
  const { description } = claim;
  let failed = false;
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setDisableSubmit(true);
    try {
      const { id } = await getUser();
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          claimant_user_id: id,
          description,
          post_id,
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
      const { claimData } = await response.json();
      failed = false;
      if (lw_username) {
        const { claim_id } = claimData[0];
        const newUrl = `/${lw_username}/${post_id}/${claim_id}`;
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
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground profile-form"
        onSubmit={handleSubmit}
      >
        <textarea
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          placeholder="Evidence"
          value={description}
          onChange={descriptionOnChange}
        />
        <button
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          type="submit"
          disabled={disabledSubmit}
        >
          Make claim
        </button>
      </form>
    </div>
  );
};

export default CreateClaim;
