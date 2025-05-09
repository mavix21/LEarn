import { Card, CardContent } from "@skill-based/ui/components/card";
import { Skeleton } from "@skill-based/ui/components/skeleton";

export function TalentTabSkeleton() {
  // Create 3 categories for the skeleton
  const categories = Array(3).fill(null);

  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-24" />
      <div>
        <div className="space-y-6">
          {categories.map((_, index) => (
            <Card key={index}>
              <CardContent>
                <Skeleton className="mb-4 h-7 w-48" />
                <div className="space-y-6">
                  {/* Create 2 credentials per category */}
                  {[1, 2].map((index) => (
                    <div
                      key={index}
                      className="space-y-3 rounded-lg border p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-6 w-24" />
                          </div>
                          <Skeleton className="mt-1 h-4 w-full" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                      </div>

                      <Skeleton className="h-3 w-32" />
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
