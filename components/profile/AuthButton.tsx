"use client";
import Link from "next/link";
import useIsMobile from "@/utils/isMobile";

interface User {
  id: string;
}

interface AuthButtonProps {
  user: User | null;
}

export default function AuthButton({ user }: AuthButtonProps) {
  const mobile = useIsMobile();
  if (!user) {
    // Handle the case where user is null
    console.error("User is not logged in");
    return (
      <Link
        href="/login"
        className={[
          mobile ? "" : "px-3",
          "py-2 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover",
        ].join(" ")}
      >
        Login
      </Link>
    );
  }
}
