import { createClientSsr } from "@/utils/supabase/client";
import { ClaimsModel } from "@/types/Models";
import { Dispatch, SetStateAction } from "react";
import { redirect, useRouter } from "next/navigation";
import { Range } from "react-range";
import React from "react";

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
    redirect("/login");
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
  const [values, setValues] = React.useState([100]);
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
          completion: values[0],
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
        <div
          className={
            "animate-in flex-1 flex-col w-full justify-center gap-2 text-foreground flex items-center group"
          }
        >
          <div className={"grid grid-cols-2 gap-6"}>
            <label className="text-md">Completion</label>
            <Range
              step={50}
              min={0}
              max={100}
              values={values}
              onChange={(values) => setValues(values)}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "6px",
                    width: "100%",
                    backgroundColor: "#ccc",
                  }}
                >
                  {children}
                </div>
              )}
              renderMark={({ props, index }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "16px",
                    width: "5px",
                    backgroundColor:
                      index * 50 < values[0] ? "#548BF4" : "#ccc",
                  }}
                />
              )}
              renderThumb={({ props, isDragged }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "24px",
                    width: "24px",
                    borderRadius: "4px",
                    backgroundColor: "#FFF",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0px 2px 6px #AAA",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-28px",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "14px",
                      fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                      padding: "4px",
                      borderRadius: "4px",
                      backgroundColor: "#548BF4",
                    }}
                  >
                    {values[0].toFixed(1)}%
                  </div>
                  <div
                    style={{
                      height: "16px",
                      width: "5px",
                      backgroundColor: isDragged ? "#548BF4" : "#CCC",
                    }}
                  />
                </div>
              )}
            />
            <label className="text-md">Description</label>
            <textarea
              className="rounded-md px-4 py-2 bg-inherit border mb-6"
              placeholder="Evidence"
              value={description}
              onChange={descriptionOnChange}
            />
          </div>
        </div>
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
