import { Card } from "@/components/ui";

export function InterviewerDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-80 bg-muted rounded-lg"></div>
        <div className="h-4 w-96 bg-muted/70 rounded-lg"></div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="h-4 w-28 bg-muted rounded"></div>
              <div className="h-8 w-8 bg-muted rounded-lg"></div>
            </div>
            <div className="h-8 w-16 bg-muted rounded mb-2"></div>
            <div className="h-3 w-32 bg-muted/70 rounded"></div>
          </Card>
        ))}
      </div>

      {/* Schedule & Activity */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="h-6 w-48 bg-muted rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="h-16 w-16 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-muted rounded"></div>
                    <div className="h-3 w-1/2 bg-muted/70 rounded"></div>
                  </div>
                  <div className="h-8 w-24 bg-muted rounded-full"></div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="h-6 w-40 bg-muted rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-3 bg-muted/30 rounded-lg space-y-2">
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-3 w-3/4 bg-muted/70 rounded"></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
