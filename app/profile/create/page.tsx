import React from "react";
import LesswrongLink from "@/components/profile/LesswrongLink";

const CreateProfilePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold text-center mb-6">
        Create Your Profile
      </h1>
      <p className="text-center mb-4">
        Connect with LessWrong to create your profile.
      </p>
      <LesswrongLink />
    </div>
  );
};

export default CreateProfilePage;
