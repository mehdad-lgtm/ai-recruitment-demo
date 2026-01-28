import { Card } from "@/components/ui";

export function InterviewsListSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-40 bg-muted rounded-lg mb-2"></div>
          <div className="h-4 w-72 bg-muted/70 rounded-lg"></div>
        </div>
        <div className="h-10 w-36 bg-muted rounded-lg"></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {["All", "Upcoming", "Completed", "Cancelled"].map((_, i) => (
          <div key={i} className="h-10 w-28 bg-muted rounded-lg"></div>
        ))}
      </div>

      {/* Calendar View */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="h-6 w-48 bg-muted rounded mb-4"></div>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-8 bg-muted rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="h-16 bg-muted/30 rounded"></div>
              ))}
            </div>
          </Card>
        </div>
        <div>
          <Card className="p-6">
            <div className="h-6 w-32 bg-muted rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
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
