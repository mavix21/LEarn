import { headers } from "next/headers";
import { Asterisk } from "lucide-react";

import { ThemeSwitcher } from "@/app/_shared/ui/theme-switcher";

import { ConvexClientProvider, OnchainProviders } from "../../../_providers";
import NavBar from "./NavBar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = (await headers()).get("cookie");

  return (
    <OnchainProviders cookie={cookie}>
      <ConvexClientProvider>
        <div className="grid h-svh grid-cols-1 grid-rows-[1fr_3rem] lg:grid-cols-[1fr_2fr_1fr] lg:grid-rows-[3rem_1fr]">
          <div className="col-span-1 col-start-1 row-start-1 hidden items-center justify-center gap-2 border-b lg:flex">
            <Asterisk />
            <span className="font-semibold">SkillBased</span>
          </div>

          <div className="col-span-1 col-start-3 row-start-1 hidden items-center justify-center gap-2 border-b lg:flex">
            <ThemeSwitcher />
          </div>

          <div className="col-start-1 row-start-2 border-x lg:col-start-2 lg:row-start-1">
            <NavBar />
          </div>

          {children}
        </div>
      </ConvexClientProvider>
    </OnchainProviders>
  );
}
