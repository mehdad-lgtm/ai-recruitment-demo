import { Card } from "@/components/ui";

export function RecruiterDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-72 bg-muted rounded-lg"></div>
        <div className="h-4 w-96 bg-muted/70 rounded-lg"></div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 w-32 bg-muted rounded"></div>
              <div className="h-8 w-8 bg-muted rounded-lg"></div>
            </div>
            <div className="h-8 w-16 bg-muted rounded mb-2"></div>
            <div className="h-3 w-24 bg-muted/70 rounded"></div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="h-6 w-40 bg-muted rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 bg-muted/30 rounded-xl space-y-2">
                <div className="h-10 w-10 bg-muted rounded-lg"></div>
                <div className="h-4 w-24 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="h-6 w-40 bg-muted rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
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
    </div>
  );
}
