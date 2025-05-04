import { useTranslations } from "next-intl";

import { Card } from "@skill-based/ui/components/card";

import { ConnectButton } from "@/app/_shared/ui/connect-button";

export function ConnectCard() {
  const t = useTranslations("onboarding");

  return (
    <Card className="bg-card text-card-foreground mx-auto flex w-full max-w-sm flex-col items-center gap-6 rounded-xl p-8 shadow-md">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-foreground text-center text-2xl font-bold">
          {t("title")}
        </h2>
        <p className="text-muted-foreground text-center text-sm">
          {t("description")}
        </p>
      </div>
      <ConnectButton />
    </Card>
  );
}

export default ConnectCard;
