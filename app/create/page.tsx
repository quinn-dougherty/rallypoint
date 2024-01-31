"use client";
import React, { useState, useEffect } from "react";
import CreatePost from "@/components/posts/CreatePost";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [disableSubmit, setDisableSubmit] = useState(false);
  useEffect(() => {}, [title, description, amount]);
  function titleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }
  function descriptionOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDescription(e.target.value);
  }
  function amountOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === "") {
      return;
    }
    setAmount(parseFloat(e.target.value));
  }
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <CreatePost
        createPost={{ title, description, amount }}
        titleOnChange={titleOnChange}
        descriptionOnChange={descriptionOnChange}
        amountOnChange={amountOnChange}
        disabledSubmit={disableSubmit}
        setDisableSubmit={setDisableSubmit}
      />
    </div>
  );
}
