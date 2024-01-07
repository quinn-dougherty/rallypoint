import Link from "next/link";
import Posts from "@/components/posts/Posts";

export type UserProfileProps = {
  profile: {
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
      <h1>{`${profile?.display_name || profile.email}'s Profile`}</h1>
      {privateView && (
        <div>
          <Link href="/profile/edit">Edit your profile</Link>
          <Link href={`/${profile.lw_username}`}>Sharelink</Link>
        </div>
      )}
      <p>Email: {profile.email}</p>
      <p>LW Username: {profile.lw_username}</p>
      <p>Bio: {profile.bio}</p>
      <div>
        <h2>Posts authored:</h2>
        <Posts lw_username={profile.lw_username} />
      </div>
    </div>
  );
};

export default UserProfile;
