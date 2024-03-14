import Link from "next/link";
import ProfilePostsList from "@/components/posts/ProfilePostsList";
import ProfileClaimsList from "@/components/claims/ProfileClaimsList";
export type UserProfileProps = {
  profile: {
    balance: number;
    display_name: string;
    email: string;
    lw_username: string;
    bio: string;
  };
  privateView: boolean; // this will need to verify auth to make sense.
}; // TODO: centralize models/ dir, issue #5

const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  privateView,
}: UserProfileProps) => {
  return (
    <div>
      <h1 className="title">Profile:{` ${profile.display_name}`}</h1>
      {privateView && (
        <div>
          <Link
            className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
            href="/profile/edit"
          >
            Edit your profile
          </Link>
          <Link
            className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
            href={`/${profile.lw_username}`}
          >
            Sharelink
          </Link>
          <p>
            Balance: {profile.balance}
            <Link
              className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
              href={"/profile/deposit"}
            >
              Deposit
            </Link>
          </p>
        </div>
      )}
      <p>Email: {profile.email}</p>
      <p>
        LW Username:{" "}
        <a href={`https://lesswrong.com/users/${profile.lw_username}`}>
          {profile.lw_username}
        </a>
      </p>
      <p>Bio: {profile.bio}</p>
      <div className="flex flex-row gap-x-8">
        <ProfilePostsList lw_username={profile.lw_username} />
        <ProfileClaimsList lw_username={profile.lw_username} />
      </div>
    </div>
  );
};

export default UserProfile;
