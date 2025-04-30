import {
  Cpu,
  Fingerprint,
  Pencil,
  Settings2,
  Sparkles,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";

const FEATURES = [
  "verifiable",
  "base",
  "privacy",
  "profile",
  "networking",
  "ai",
] as const;

const FeatureIcons = {
  verifiable: Zap,
  base: Cpu,
  privacy: Fingerprint,
  profile: Pencil,
  networking: Settings2,
  ai: Sparkles,
} as const;

export function Features() {
  const t = useTranslations("landing.features");

  return (
    <section id="features" className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-balance text-4xl font-medium lg:text-5xl">
            {t("title")}
          </h2>
          <p>{t("description")}</p>
        </div>

        <div className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = FeatureIcons[feature];
            return (
              <div key={feature} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="size-4" />
                  <h3 className="text-sm font-medium">
                    {t(`items.${feature}.title`)}
                  </h3>
                </div>
                <p className="text-sm">{t(`items.${feature}.description`)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
