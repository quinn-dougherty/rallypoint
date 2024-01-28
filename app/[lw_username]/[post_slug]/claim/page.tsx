"use client";
import React, { useState, useEffect } from "react";
import CreateClaim from "@/components/claims/CreateClaim";

export default function Create({
  params,
}: {
  params: { lw_username: string; post_slug: string };
}) {
  const { post_slug } = params;
  const post_id = post_slug.substring(post_slug.length - 36);
  const [description, setDescription] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(false);
  useEffect(() => {}, [description]);
  function descriptionOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDescription(e.target.value);
  }
  return (
    <div>
      <CreateClaim
        claim={{ description, post_id }}
        post_id={post_id}
        descriptionOnChange={descriptionOnChange}
        disabledSubmit={disableSubmit}
        setDisableSubmit={setDisableSubmit}
      />
    </div>
  );
}
