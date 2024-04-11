"use client";
import React, { useState, useEffect } from "react";
import CreatePost from "@/components/posts/CreatePost";
import { useRouter } from "next/navigation";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {}, [title, description, amount]);
  function titleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }
  function descriptionOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDescription(e.target.value);
  }
  function amountOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (!val) {
      setAmount(parseFloat(val));
    } else {
      setAmount(parseFloat(val));
    }
  }
  React.useEffect(() => {
    if (loading) {
      fetch("/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        res.json().then((data) => {
          if (data.status !== "success") {
            router.push("/login");
          }
          setLoading(false);
        });
      });
    }
  }, []);
  if (loading) {
    return <div>Loading...</div>;
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
