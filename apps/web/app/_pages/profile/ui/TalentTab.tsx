import { Badge } from "@skill-based/ui/components/badge";
import { Card, CardContent } from "@skill-based/ui/components/card";
import { Progress } from "@skill-based/ui/components/progress";

import { env } from "@/src/env";
import { tryCatch } from "@/src/lib/try-catch";

import type { TalentsResponse } from "../model/talent-protocol";

type Credential = TalentsResponse["credentials"][number];
type CredentialsByCategory = Record<string, Credential[]>;

export async function TalentTab({ address }: { address: `0x${string}` }) {
  const result = await tryCatch(
    fetch(
      `https://api.talentprotocol.com/credentials?id=${address}&accountSource=wallet`,
      {
        headers: {
          "X-API-KEY": env.TALENT_API_KEY,
        },
      },
    ),
  );

  if (result.error) {
    return <div>No talent credentials found!</div>;
  }

  const { credentials }: TalentsResponse = await result.data.json();

  if (credentials.every((credential) => credential.points === 0)) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Talent</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
            <h3 className="text-xl font-semibold">
              No Talent Credentials Found
            </h3>
            <p className="text-muted-foreground max-w-md">
              Start building your on-chain reputation and showcase your skills
              with Talent Protocol. Get verified credentials and stand out in
              the web3 ecosystem.
            </p>
            <a
              href="https://www.talentprotocol.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
            >
              Build Your Builder Score
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

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
