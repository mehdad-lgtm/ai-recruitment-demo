import { Card } from "@/components/ui";

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-muted rounded-lg"></div>
        <div className="h-4 w-96 bg-muted/70 rounded-lg"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-10 w-10 bg-muted rounded-xl"></div>
            </div>
            <div className="h-8 w-20 bg-muted rounded mb-2"></div>
            <div className="h-3 w-32 bg-muted/70 rounded"></div>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="h-6 w-40 bg-muted rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-muted rounded"></div>
                    <div className="h-3 w-1/2 bg-muted/70 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="h-6 w-40 bg-muted rounded mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-4 bg-muted/30 rounded-xl">
                  <div className="h-10 w-10 bg-muted rounded-lg mb-3"></div>
                  <div className="h-4 w-24 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
