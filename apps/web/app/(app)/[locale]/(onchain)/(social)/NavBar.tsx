"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Authenticated, Unauthenticated } from "convex/react";
import { useSession } from "next-auth/react";

import { AnimatedBackground } from "@skill-based/ui/components/animated-background";
import { AnimatedBellIcon } from "@skill-based/ui/components/animated-bell";
import { AnimatedHomeIcon } from "@skill-based/ui/components/animated-home";
import { AnimatedMessageCircleMoreIcon } from "@skill-based/ui/components/animated-message-circle-more";
import { AnimatedSearchIcon } from "@skill-based/ui/components/animated-search";
import { AnimatedUserIcon } from "@skill-based/ui/components/animated-user";

import { normalizePath } from "@/app/_shared/lib/normalizePath";
import { useAuthGateDialog } from "@/app/_shared/ui/auth-gate-dialog-context";

export default function NavBar() {
  const { data: session } = useSession();
  const userId = session?.userId;

  const pathname = usePathname();
  const router = useRouter();
  const { open } = useAuthGateDialog();

  // Dynamically set navItems so Profile href uses userId if available
  const navItems = [
    {
      href: "/feed",
      icon: AnimatedHomeIcon,
      gate: false,
      label: "Home",
    },
    {
      href: userId ? `/profile/${userId}` : "/profile",
      icon: AnimatedUserIcon,
      gate: true,
      dialogKey: "profile",
      label: "Profile",
    },
    {
      href: "/notifications",
      icon: AnimatedBellIcon,
      gate: true,
      dialogKey: "notifications",
      label: "Notifications",
    },
    {
      href: "/search",
      icon: AnimatedSearchIcon,
      gate: false,
      label: "Search",
    },
    {
      href: "/chat",
      icon: AnimatedMessageCircleMoreIcon,
      gate: true,
      dialogKey: "chat",
      label: "Chat",
    },
  ] as const;

  // Handler for nav item clicks
  const handleNavClick = (
    e: React.MouseEvent,
    item: (typeof navItems)[number],
  ) => {
    if (item.gate && item.dialogKey) {
      open({ key: item.dialogKey });
      e.preventDefault();
    }
  };

  const lastPath = normalizePath(pathname);

  return (
    <div className="flex h-12 items-center justify-center gap-6 border-t p-4 backdrop-blur-sm lg:border-b lg:border-t-0">
      <Unauthenticated>
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
            <button
              key={item.href}
              onMouseDown={(e) => {
                if (item.gate) {
                  handleNavClick(e, item);
                } else {
                  router.push(item.href);
                }
              }}
              data-id={item.href}
              className="text-muted-foreground hover:text-active-foreground p-1.5 transition-colors"
              type="button"
            >
              <item.icon size={26} />
            </button>
          ))}
        </AnimatedBackground>
      </Unauthenticated>
      <Authenticated>
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
      </Authenticated>
    </div>
  );
}
