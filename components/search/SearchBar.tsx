"use client";
import React, { useState } from "react";
import debounce from "lodash/debounce";
import "./searchBar.css";
import Link from "next/link";
import { useOutsideClick } from "@/utils/hooks";
import { ProfilesModel as User, PostsModel as Post } from "@/types/Models";

interface Tag {
  tag_id: number;
  tag: string;
}
interface Results {
  posts: Post["Row"][];
  tags: Tag[];
  users: User["Row"][];
}
async function searchPosts(query: string) {
  const response = await fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: query }),
  });
  return response.json();
}

async function searchTags(query: string) {
  const response = await fetch("/api/search/tags", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: query }),
  });
  return response.json();
}
async function searchUsers(query: string) {
  const response = await fetch("/api/search/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: query }),
  });
  return response.json();
}
export default function SearchBar() {
  const [results, setResults] = useState<Results>({
    posts: [],
    tags: [],
    users: [],
  });
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const ref = useOutsideClick(() => {
    setShow(false);
  });
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (query.length < 1) {
      setResults({ posts: [], tags: [], users: [] });
      setShow(false);
      return;
    }
    setLoading(true);
    const [posts, tags, users] = await Promise.all([
      searchPosts(query),
      searchTags(query),
      searchUsers(query),
    ]);
    setResults({ posts, tags, users });
    setShow(true);
    setLoading(false);
  };
  // const debouncedSearch =  debounce(handleSearch, 300);

  const debouncedResults = React.useMemo(() => {
    return debounce(handleSearch, 400);
  }, []);

  React.useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className={"searchbar-container"}>
        <svg
          id={"search"}
          className={"search-icon"}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M10.5 6a4.5 4.5 0 1 0-1 1l3.793 3.793a1 1 0 0 0 1.414-1.414L10.5 6z"
          />
        </svg>
        <input
          className={"searchbar"}
          type="text"
          onChange={debouncedResults}
          placeholder={"Search posts, tags, and users"}
        />
      </div>
      {show && (
        <div className={"search-results-container"} ref={ref}>
          {loading ? <div>Loading...</div> : searchResults(results, setShow)}
        </div>
      )}
    </form>
  );
}

const searchResults = (
  { posts, tags, users }: Results,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  return (
    <>
      {posts.length > 0 && (
        <div key={"results-posts"} className={"results"}>
          <p className={"results-header"}>Projects</p>
          {posts.map((post) => (
            <Link
              href={`/posts/${post.post_id}`}
              key={post.post_id}
              onClick={() => setShow(false)}
            >
              <div className={"search-entry"}>
                <h2>{post.title}</h2>
                <div>{post.description}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
      {tags.length > 0 && (
        <div key={"results-tags"} className={"results"}>
          <p className={"results-header"}>Tags</p>
          {tags.map((tag) => (
            <Link
              href={`/tags/${tag.tag}`}
              key={tag.tag_id}
              onClick={() => setShow(false)}
            >
              <div key={tag.tag_id} className={"search-entry"}>
                <h2>{tag.tag}</h2>
              </div>
            </Link>
          ))}
        </div>
      )}

      {users.length > 0 && (
        <div key={"results-users"} className={"results"}>
          <p className={"results-header"}>Users</p>
          {users.map((user) => (
            <Link
              href={`/${user.lw_username}`}
              key={user.user_id}
              onClick={() => setShow(false)}
            >
              <div key={user.user_id} className={"search-entry"}>
                <h2>{user.display_name}</h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};
