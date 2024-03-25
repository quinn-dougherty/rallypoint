"use client";
import React from "react";
import Link from "next/link";
import ProfilePostsList from "@/components/posts/ProfilePostsList";
import ProfileClaimsList from "@/components/claims/ProfileClaimsList";
import "./profile.css";
export type UserProfileProps = {
  profile: {
    balance: number;
    display_name: string;
    email: string;
    lw_username: string;
    bio: string;
    stripe_account_id: string;
    website: string;
    location: string;
    created_at: string;
    postCount: number;
  };
  privateView: boolean; // this will need to verify auth to make sense.
}; // TODO: centralize models/ dir, issue #5

const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  privateView,
}: UserProfileProps) => {
  const [selectedTab, setSelectedTab] = React.useState("about");
  const tabs = ["about", "projects", "claims", "comments"];
  const date = new Date(profile.created_at);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const prettyDate = months[date.getMonth()] + " " + date.getFullYear();
  return (
    <div className={"full-page"}>
      <div className={"profile-header pb-8 pt-8"}>
        <h1 className="title">{` ${profile.display_name}`}</h1>
        <h4>
          Projects: {profile.postCount}
          <span> · </span>
          {profile.location}
          <span> · </span>
          {prettyDate}
        </h4>
      </div>

      <div className={"profile-nav"}>
        {tabs.map((tab) => (
          <Link
            key={tab}
            onClick={() => setSelectedTab(tab)}
            href={``}
            className={`tab ${selectedTab === tab ? "active" : ""}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Link>
        ))}
      </div>
      <div className={"pb-5 mt-5"}>
        {selectedTab === "about" && (
          <div className={"profile-about"}>
            {privateView && (
              <>
                <div className={"grid grid-cols-2"}>
                  <div className={""}>Balance:</div>

                  <div className={"grid grid-cols-2"}>
                    ${profile.balance}
                    {profile.stripe_account_id ? (
                      <div className={"composite-buttons"}>
                        <Link
                          className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover button"
                          href={"/profile/deposit"}
                        >
                          Deposit
                        </Link>
                        <Link
                          className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover button"
                          href={"/profile/withdrawStripe"}
                        >
                          Withdraw
                        </Link>
                      </div>
                    ) : (
                      <Link
                        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
                        href={"/profile/connectStripe"}
                      >
                        Connect
                      </Link>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className={"grid grid-cols-2"}>
              <div>Email:</div>
              <div>{profile.email}</div>
            </div>

            <div className={"grid grid-cols-2"}>
              <div>LW Username: </div>
              <div>
                <a
                  href={`https://lesswrong.com/users/${profile.lw_username}`}
                  rel="noreferrer"
                  target={"_blank"}
                >
                  {profile.lw_username}
                </a>
              </div>
            </div>
            <div className={"grid grid-cols-2"}>
              <div>Bio:</div>
              <div>{profile.bio}</div>
            </div>
            <div className={"grid grid-cols-2"}>
              <div className={""}>Website:</div>
              <div>{profile.website}</div>
            </div>
            {privateView ? (
              <div className={"composite-buttons py-8 center"}>
                <Link
                  className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover button "
                  href="/profile/edit"
                >
                  Edit your profile
                </Link>

                {profile.stripe_account_id ? (
                  <Link
                    className={
                      "py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover button"
                    }
                    href={"/profile/bank"}
                  >
                    Bank Details
                  </Link>
                ) : null}
                <Link
                  className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover button "
                  href={`/${profile.lw_username}`}
                >
                  Copy public Profile link
                </Link>
              </div>
            ) : null}
          </div>
        )}
        {selectedTab === "projects" && (
          <div className={"profile-projects"}>
            <ProfilePostsList lw_username={profile.lw_username} />
          </div>
        )}
        {selectedTab === "claims" && (
          <div className={"profile-claims"}>
            <ProfileClaimsList lw_username={profile.lw_username} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
