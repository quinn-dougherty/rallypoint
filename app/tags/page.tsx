import React from "react";
import Link from "next/link";
import { createClientSsr } from "@/utils/supabase/client";

export default async function Page() {
  const supabase = createClientSsr();
  const { data, error } = await supabase.from("tags").select();
  if (error) {
    return <div>{`No tags.`}</div>;
  }
  return (
    <div>
      <h1 className={"center pb-5 text-2xl"}>Tags</h1>
      <div className={"grid grid-cols-4 gap-8 pb-5"}>
        {data.map((tag) => (
          <Link key={tag.tag_id} href={`/tags/${tag.tag_id}`}>
            {tag.tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
