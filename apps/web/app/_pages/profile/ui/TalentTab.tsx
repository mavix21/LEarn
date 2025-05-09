import { redirect } from "next/navigation";

import { Badge } from "@skill-based/ui/components/badge";
import { Card, CardContent } from "@skill-based/ui/components/card";
import { Progress } from "@skill-based/ui/components/progress";

import { auth } from "@/auth";
import { env } from "@/src/env";

import type { TalentsResponse } from "../model/talent-protocol";

type Credential = TalentsResponse["credentials"][number];
type CredentialsByCategory = Record<string, Credential[]>;

export async function TalentTab() {
  const session = await auth();

  if (!session) redirect("/feed");

  const { address } = session;

  const data = await fetch(
    `https://api.talentprotocol.com/credentials?id=${address}&accountSource=wallet`,
    {
      headers: {
        "X-API-KEY": env.TALENT_API_KEY,
      },
    },
  );

  const { credentials }: TalentsResponse = await data.json();

  // Group credentials by category and filter out zero points
  const credentialsByCategory = credentials.reduce<CredentialsByCategory>(
    (acc, credential) => {
      if (credential.points === 0) return acc;
      const category = credential.category;
      acc[category] ??= [];
      acc[category].push(credential);
      return acc;
    },
    {},
  );

  // Get unique categories for mapping
  const categories = Object.keys(credentialsByCategory);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Talent</h1>
      <div>
        <div className="space-y-6">
          {categories.map((category) => (
            <Card key={category}>
              <CardContent>
                <h3 className="mb-4 text-xl font-semibold">
                  {category} Skills
                </h3>
                <div className="space-y-6">
                  {credentialsByCategory[category]?.map((credential) => (
                    <div
                      key={credential.slug}
                      className="space-y-3 rounded-lg border p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium">{credential.name}</h4>
                            <Badge variant="outline" className="ml-2">
                              {credential.data_issuer_name}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mt-1 text-sm">
                            {credential.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Score:</span>
                            <span className="text-sm">
                              {credential.points}/{credential.max_score} points
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {credential.calculating_score}
                          </span>
                        </div>
                        <Progress
                          value={
                            (credential.points / credential.max_score) * 100
                          }
                          className="h-2"
                        />
                      </div>

                      <div className="text-muted-foreground text-xs">
                        Last updated: {credential.last_calculated_at}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
