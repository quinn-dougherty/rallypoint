import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClientSsr } from "@/utils/supabase/client";
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

const UserProfile: React.FC<UserProfileProps> = ({ profile }) => {
  return (
    <div>
      <Header />
      <h1>{profile.display_name}'s Profile</h1>
      <p>Email: {profile.email}</p>
      <p>LW Username: {profile.lw_username}</p>
      <p>Bio: {profile.bio}</p>
      <Posts />
    </div>
  );
};

export default UserProfile;
