"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { Button } from "@skill-based/ui/components/button";

import { useAppKit } from "@/reown";

export function ConnectButton() {
  const { open } = useAppKit();
  const t = useTranslations("onboarding");
  return (
    <Button size="lg" onClick={() => open({ view: "Connect" })}>
      {t("cta")}
    </Button>
  );
}
