import { Card } from "@/components/ui";

export function SettingsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-32 bg-muted rounded-lg mb-2"></div>
        <div className="h-4 w-96 bg-muted/70 rounded-lg"></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-28 bg-muted rounded-lg"></div>
        ))}
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar */}
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-lg"></div>
          ))}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="h-6 w-48 bg-muted rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded"></div>
                  <div className="h-10 bg-muted/50 rounded-lg"></div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="h-6 w-56 bg-muted rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="h-4 w-48 bg-muted rounded"></div>
                  <div className="h-6 w-12 bg-muted rounded-full"></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
