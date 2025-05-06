"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Authenticated, Unauthenticated } from "convex/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { AnimatedBackground } from "@skill-based/ui/components/animated-background";
import { AnimatedBellIcon } from "@skill-based/ui/components/animated-bell";
import { AnimatedHomeIcon } from "@skill-based/ui/components/animated-home";
import { AnimatedSearchIcon } from "@skill-based/ui/components/animated-search";
import { AnimatedUserIcon } from "@skill-based/ui/components/animated-user";

import { normalizePath } from "@/app/_shared/lib/normalizePath";
import { AuthGateDialog } from "@/app/_shared/ui/auth-gate-dialog";

export default function NavBar() {
  const { data: session } = useSession();
  const userId = session?.userId;

  const pathname = usePathname();
  const router = useRouter();
  const [dialogKey, setDialogKey] = useState<string | null>(null);
  const [openAuthDialog, setOpenAuthDialog] = useState(false);
  const t = useTranslations("onboarding");

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
  ];

  // Handler for nav item clicks
  const handleNavClick = (
    e: React.MouseEvent,
    item: (typeof navItems)[number],
  ) => {
    if (item.gate && item.dialogKey) {
      setOpenAuthDialog(true);
      setDialogKey(item.dialogKey);
      e.preventDefault();
    }
  };

  const lastPath = normalizePath(pathname);

  // i18n modal messages
  const dialogMessages: Record<string, { title: string; description: string }> =
    {
      profile: {
        title: t("profile.title", {
          default: "Build your profile with SkillBased",
        }),
        description: t("profile.description", {
          default:
            "Join SkillShare to create your professional identity, showcase your skills, and connect with others on-chain.",
        }),
      },
      notifications: {
        title: t("notifications.title", { default: "Stay up to date" }),
        description: t("notifications.description", {
          default:
            "Sign in to SkillShare to receive notifications about your network and activity.",
        }),
      },
    };

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
        <AuthGateDialog
          open={openAuthDialog}
          onOpenChange={setOpenAuthDialog}
          title={
            dialogKey && dialogMessages[dialogKey]
              ? dialogMessages[dialogKey].title
              : ""
          }
          description={
            dialogKey && dialogMessages[dialogKey]
              ? dialogMessages[dialogKey].description
              : ""
          }
        />
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
