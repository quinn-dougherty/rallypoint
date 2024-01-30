"use client";
import React, { useState } from "react";
import lesswrongLogo from "@/app/img/lesswrong.svg";
import { useRouter } from "next/navigation";

const LesswrongConnect = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/lesswrongAuth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        if (data.message === 'Already authenticated with Lesswrong') {
          setError("Already authenticated with Lesswrong");
        } else {
          setError("Invaliid username/password");
        }
      } else {
        router.push('/');
      }

    } catch (err) {
      setLoading(false);
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md px-6 py-8">
        <img src={lesswrongLogo} className="mx-auto h-12 mb-6" />
        <form
          className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground signup-form"
          onSubmit={handleSignIn}
        >
          <label className="text-md" htmlFor="username">
            Lesswrong Username
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className={`bg-green-700 rounded-md px-4 py-2 text-foreground mb-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Authenticate"}
          </button>
          {error && <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LesswrongConnect;
