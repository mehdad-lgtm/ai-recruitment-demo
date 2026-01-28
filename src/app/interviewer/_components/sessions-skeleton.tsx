import { Card } from "@/components/ui";

export function SessionsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-muted rounded-lg mb-2"></div>
          <div className="h-4 w-80 bg-muted/70 rounded-lg"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-muted rounded-lg"></div>
          <div className="h-10 w-32 bg-muted rounded-lg"></div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["All", "Today", "Upcoming", "Past"].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-muted rounded-lg"></div>
        ))}
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start gap-6">
              <div className="text-center">
                <div className="h-12 w-16 bg-muted rounded-lg mb-2"></div>
                <div className="h-3 w-16 bg-muted/70 rounded"></div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-6 w-2/3 bg-muted rounded"></div>
                    <div className="h-4 w-1/2 bg-muted/70 rounded"></div>
                  </div>
                  <div className="h-8 w-24 bg-muted rounded-full"></div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-muted rounded"></div>
                    <div className="h-3 w-32 bg-muted/70 rounded"></div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <div className="h-9 w-28 bg-muted rounded-lg"></div>
                  <div className="h-9 w-32 bg-muted rounded-lg"></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
