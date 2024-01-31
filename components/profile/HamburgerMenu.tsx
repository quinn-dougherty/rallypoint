"use client";
import React, { useState } from "react";
import Link from "next/link";
import signOut from "@/utils/signOut";
import { useOutsideClick } from "@/utils/hooks";

interface Profile {
  lw_username: string;
  display_name: string;
  email: string;
  balance: number;
}

interface User {
  id: string;
}

interface ToggleProps {
  ref: React.RefObject<HTMLDivElement>;
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
  toggleMenu: React.MouseEventHandler<HTMLButtonElement>;
  user: User;
  profile: Profile;
}

function ToggleMenu({ user, profile, children }: ToggleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }
  const ref = useOutsideClick(() => {
    setIsOpen(false);
  });

  return children({ ref, isOpen, toggleMenu, user, profile });
}

function RenderMenuItems({ user, profile, toggleMenu }: RenderMenuItemsProps) {
  if (user) {
    return (
      <React.Fragment>
        <div>
          <h2>{profile.display_name}</h2>
          <ul>
            <li className="hamburger_menu_item">
              <p className="bg-btn-background rounded-md">{`Current balance: ${profile.balance}`}</p>
            </li>
            <li className="hamburger_menu_item">
              <Link
                className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
                onClick={() => toggleMenu}
                href={"/profile"}
              >
                My Profile
              </Link>
            </li>
            <li className="hamburger_menu_item">
              <Link
                className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
                onClick={() => toggleMenu}
                href={"/profile/edit"}
              >
                Edit Profile
              </Link>
            </li>
            <li>
              <div className="flex items-center gap-4">
                <form action={signOut}>
                  <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
                    Logout
                  </button>
                </form>
              </div>
            </li>
          </ul>
        </div>
      </React.Fragment>
    );
  } else {
    return <Link href="/login">Login or Sign Up</Link>;
  }
}

function toggler({ ref, isOpen, toggleMenu, user, profile }: ToggleProps) {
  return (
    <div ref={ref}>
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

      <span className={"hamburger_menu_items"}>
        {isOpen && (
          <div className="hamburger-menu">
            <RenderMenuItems
              profile={profile}
              user={user}
              toggleMenu={toggleMenu}
            />
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
