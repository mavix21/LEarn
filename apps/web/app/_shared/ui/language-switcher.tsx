"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@skill-based/ui/components/button";
import { locales } from "../i18n/locales";

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLocale = () => {
        const nextLocale = locale === "en" ? "es" : "en";
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLocale}
            className="h-9 w-9 px-0"
        >
            <span className="sr-only">Toggle language</span>
            {locale === "en" ? "ES" : "EN"}
        </Button>
    );
} 