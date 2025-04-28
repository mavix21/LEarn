"use client";

import * as React from "react";
import { IconCheck, IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";

import { Button } from "@skill-based/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@skill-based/ui/components/dropdown-menu";
import { cn } from "@skill-based/ui/lib/utils";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="scale-95 rounded-full">
          <IconSun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <IconMoon className="rotate-360 -dark:rotate-360 absolute size-[1.2rem] scale-0 transition-all dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light{" "}
          <IconCheck
            size={14}
            className={cn("ml-auto", theme !== "light" && "hidden")}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
          <IconCheck
            size={14}
            className={cn("ml-auto", theme !== "dark" && "hidden")}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
          <IconCheck
            size={14}
            className={cn("ml-auto", theme !== "system" && "hidden")}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
