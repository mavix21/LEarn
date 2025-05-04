"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { Button } from "@skill-based/ui/components/button";

// import { useAppKit } from "@/app/_shared/config/wagmi.config";

export function ConnectButton() {
  // const { open } = useAppKit();
  const t = useTranslations("onboarding");
  // return <Button onClick={() => open({ view: "Connect" })}>{t("cta")}</Button>;
  return <Button>Connect</Button>;
}
