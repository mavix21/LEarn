"use client";

import { Badge } from "@skill-based/ui/components/badge";
import { Card, CardContent } from "@skill-based/ui/components/card";
import { Progress } from "@skill-based/ui/components/progress";

import { useTalents } from "../api/useTalents";

export function TalentTab() {
  const { status, data, error, isFetching } = useTalents(
    "0x7C4ee08F32D1d3e99F29bE598986e7219b3c73ef",
    "wallet",
  );

  // Group credentials by category
  const credentialsByCategory = data?.reduce(
    (acc, credential) => {
      if (!acc[credential.category]) {
        acc[credential.category] = [];
      }
      acc[credential.category]!.push(credential);
      return acc;
    },
    {} as Record<string, typeof data>,
  );

  return (
    <div>
      <h1>Talent</h1>
      <div>
        {status === "pending" ? (
          "Loading..."
        ) : status === "error" ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <div>
              {data.map((talent) => (
                <Card key={talent.category}>
                  <CardContent className="pt-6">
                    <h3 className="mb-4 text-xl font-semibold">
                      {talent.category} Skills
                    </h3>
                    <div className="space-y-6">
                      {credentialsByCategory![talent.category].map(
                        (credential, index) => (
                          <div
                            key={index}
                            className="space-y-3 rounded-lg border p-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <h4 className="font-medium">
                                    {credential.name}
                                  </h4>
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
                                  <span className="text-sm font-medium">
                                    Score:
                                  </span>
                                  <span className="text-sm">
                                    {credential.points}/{credential.max_score}{" "}
                                    points
                                  </span>
                                </div>
                                <span className="text-sm font-medium">
                                  {credential.calculating_score}
                                </span>
                              </div>
                              <Progress
                                value={
                                  (credential.points / credential.max_score) *
                                  100
                                }
                                className="h-2"
                              />
                            </div>

                            <div className="text-muted-foreground text-xs">
                              Last updated: {credential.last_calculated_at}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
                // <div key={talent.name}>
                //   {talent.name} + {talent.points}
                // </div>
              ))}
            </div>
            <div>{isFetching ? "Background Updating..." : " "}</div>
          </>
        )}
      </div>
    </div>
  );
}
