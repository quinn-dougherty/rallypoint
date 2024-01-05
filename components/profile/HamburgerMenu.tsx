"use client";
import React, { useState } from "react";
import Link from "next/link";

interface Profile {
  lw_username: string;
  display_name: string;
}

interface User {
  id: string;
}

interface ToggleProps {
  isOpen: boolean;
  toggleMenu: React.MouseEventHandler<HTMLButtonElement>;
  user: User;
  profile: Profile;
}

interface ToggleMenuProps {
  user: User;
  profile: Profile;
  children: (toggleProps: ToggleProps) => React.ReactNode;
}

interface RenderMenuItemsProps {
  user: User;
  profile: Profile;
}

function ToggleMenu({ user, profile, children }: ToggleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  return children({ isOpen, toggleMenu, user, profile });
}

function RenderMenuItems({ user, profile }: RenderMenuItemsProps) {
  if (user) {
    return (
      <React.Fragment>
        <ul>
          <li>
            <Link href={`/${profile.lw_username}`}>
              View {profile.display_name} Profile
            </Link>
          </li>
          <li>
            <Link href="/profile/edit">Edit Profile</Link>
          </li>
        </ul>
      </React.Fragment>
    );
  } else {
    return <Link href="/login">Login or Sign Up</Link>;
  }
}

function toggler({ isOpen, toggleMenu, user, profile }: ToggleProps) {
  return (
    <div>
      <button onClick={toggleMenu} className="hamburger-button">
        <svg
          style={{ filter: "invert(100%)" }}
          width="30"
          height="30"
          viewBox="0 0 30 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="6" width="30" height="3" rx="1.5" />
          <rect y="13.5" width="30" height="3" rx="1.5" />
          <rect y="21" width="30" height="3" rx="1.5" />
        </svg>
      </button>

      <span>
        {isOpen && (
          <div className="hamburger-menu">
            <RenderMenuItems profile={profile} user={user} />
          </div>
        )}
      </span>
    </div>
  );
}

interface HamburgerMenuProps {
  user: User;
  profile: Profile;
}

export default function HamburgerMenu({ user, profile }: HamburgerMenuProps) {
  return (
    <ToggleMenu user={user} profile={profile}>
      {toggler}
    </ToggleMenu>
  );
}
