import { Card } from "@/components/ui";

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-56 bg-muted rounded-lg"></div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-muted rounded-lg"></div>
          <div className="h-10 w-32 bg-muted rounded-lg"></div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="h-4 w-28 bg-muted rounded"></div>
              <div className="h-8 w-8 bg-muted rounded-lg"></div>
            </div>
            <div className="h-10 w-24 bg-muted rounded mb-2"></div>
            <div className="h-3 w-full bg-muted/70 rounded"></div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="h-6 w-48 bg-muted rounded mb-6"></div>
          <div className="h-64 bg-muted/30 rounded-lg"></div>
        </Card>
        <Card className="p-6">
          <div className="h-6 w-48 bg-muted rounded mb-6"></div>
          <div className="h-64 bg-muted/30 rounded-lg"></div>
        </Card>
      </div>

      {/* Large Chart */}
      <Card className="p-6">
        <div className="h-6 w-56 bg-muted rounded mb-6"></div>
        <div className="h-96 bg-muted/30 rounded-lg"></div>
      </Card>
    </div>
  );
}
