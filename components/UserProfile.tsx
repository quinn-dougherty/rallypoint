import Header from "@/components/Header";
import Posts from "@/components/Posts";

export type UserProfileProps = {
  profile: {
    display_name: string;
    email: string;
    lw_username: string;
    bio: string;
  };
};

const UserProfile: React.FC<UserProfileProps> = ({
  profile,
}: UserProfileProps) => {
  return (
    <div>
      <Header />
      <h1>{`${profile.display_name}'s Profile`}</h1>
      <p>Email: {profile.email}</p>
      <p>LW Username: {profile.lw_username}</p>
      <p>Bio: {profile.bio}</p>
      <div>
        <h2>Posts authored:</h2>
        <Posts />
      </div>
    </div>
  );
};

export default UserProfile;
