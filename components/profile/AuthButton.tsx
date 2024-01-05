import Link from "next/link";
import signOut from "@/utils/signOut";

interface User {
  id: string;
}

interface AuthButtonProps {
  user: User | null;
}

export default async function AuthButton({ user }: AuthButtonProps) {
  if (!user) {
    // Handle the case where user is null
    console.error("User is not logged in");
    return (
      <Link
        href="/login"
        className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        Login or Sign Up
      </Link>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link href="/login">Login</Link>
  );
}
