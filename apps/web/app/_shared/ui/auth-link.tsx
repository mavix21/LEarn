"use client";

import Link from "next/link";
import { useConvexAuth } from "convex/react";

import { useAuthGateDialog } from "@/app/_shared/ui/auth-gate-dialog-context";

interface AuthLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function AuthLink({ href, children, className }: AuthLinkProps) {
  const { isAuthenticated } = useConvexAuth();
  const { open } = useAuthGateDialog();

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      open({ key: "othersProfile" });
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
