"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Bookmark, Home, User } from "lucide-react";

import { AnimatedBackground } from "@skill-based/ui/components/animated-background";
import { AnimatedBellIcon } from "@skill-based/ui/components/animated-bell";
import { AnimatedHomeIcon } from "@skill-based/ui/components/animated-home";
import { AnimatedSearchIcon } from "@skill-based/ui/components/animated-search";
import { AnimatedUserIcon } from "@skill-based/ui/components/animated-user";

const navItems = [
  {
    href: "/feed",
    icon: AnimatedHomeIcon,
    label: "Home",
  },
  {
    href: "/profile",
    icon: AnimatedUserIcon,
    label: "Profile",
  },
  {
    href: "/notifications",
    icon: AnimatedBellIcon,
    label: "Notifications",
  },
  {
    href: "/search",
    icon: AnimatedSearchIcon,
    label: "Search",
  },
];

export default function NavBar() {
  const pathname = usePathname();
  const lastPath = `/${pathname.split("/").pop()}`;

  return (
    <div className="flex h-12 items-center justify-center gap-6 border-t p-4 backdrop-blur-sm lg:border-b lg:border-t-0">
      <AnimatedBackground
        defaultValue={lastPath}
        className="active-nav-item bg-active rounded-xl"
        transition={{
          type: "spring",
          bounce: 0.2,
          duration: 0.3,
        }}
      >
        {navItems.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            data-id={item.href}
            className="text-muted-foreground hover:text-active-foreground p-1.5 transition-colors"
          >
            <item.icon size={26} />
          </Link>
        ))}
      </AnimatedBackground>
    </div>
  );
}
