"use client";
import React, { useState, useEffect } from "react";
import CreatePost from "@/components/posts/CreatePost";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  // const [handleSubmit, setHandleSubmit] = useState(null);
  useEffect(() => {
    // setHandleSubmit(CreatePost({ createPost: { title, description, amount } }));
  }, [title, description, amount]);
  function titleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }
  function descriptionOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDescription(e.target.value);
  }
  function amountOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAmount(parseFloat(e.target.value));
  }
  return (
    <div>
      <CreatePost
        createPost={{ title, description, amount }}
        titleOnChange={titleOnChange}
        descriptionOnChange={descriptionOnChange}
        amountOnChange={amountOnChange}
      />
    </div>
  );
}
