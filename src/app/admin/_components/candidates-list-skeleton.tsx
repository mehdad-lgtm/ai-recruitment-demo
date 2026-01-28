import { Card } from "@/components/ui";

export function CandidatesListSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-muted rounded-lg mb-2"></div>
          <div className="h-4 w-64 bg-muted/70 rounded-lg"></div>
        </div>
        <div className="h-10 w-32 bg-muted rounded-lg"></div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-28 bg-muted rounded-lg"></div>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex gap-4">
            <div className="h-10 flex-1 bg-muted rounded-lg"></div>
            <div className="h-10 w-40 bg-muted rounded-lg"></div>
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-muted rounded"></div>
                <div className="h-3 w-32 bg-muted/70 rounded"></div>
              </div>
              <div className="h-6 w-20 bg-muted rounded-full"></div>
              <div className="h-8 w-24 bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
