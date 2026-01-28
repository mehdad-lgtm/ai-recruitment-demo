import { Card } from "@/components/ui";

export function BriefsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-64 bg-muted rounded-lg mb-2"></div>
          <div className="h-4 w-96 bg-muted/70 rounded-lg"></div>
        </div>
        <div className="h-10 w-32 bg-muted rounded-lg"></div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 w-28 bg-muted rounded-lg"></div>
        ))}
      </div>

      {/* Briefs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-16 w-16 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 bg-muted rounded"></div>
                <div className="h-3 w-1/2 bg-muted/70 rounded"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-6 w-24 bg-muted rounded-full"></div>
              <div className="h-3 w-full bg-muted/70 rounded"></div>
              <div className="h-3 w-5/6 bg-muted/70 rounded"></div>
              <div className="flex gap-2 pt-2">
                <div className="h-8 flex-1 bg-muted rounded-lg"></div>
                <div className="h-8 w-20 bg-muted rounded-lg"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
