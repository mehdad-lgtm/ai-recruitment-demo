import { Card } from "@/components/ui";

export function AvailabilitySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-56 bg-muted rounded-lg mb-2"></div>
          <div className="h-4 w-80 bg-muted/70 rounded-lg"></div>
        </div>
        <div className="h-10 w-32 bg-muted rounded-lg"></div>
      </div>

      {/* Calendar */}
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 w-40 bg-muted rounded"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-muted rounded"></div>
                <div className="h-8 w-8 bg-muted rounded"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-8 bg-muted rounded text-center"></div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="h-20 bg-muted/30 rounded"></div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="h-6 w-32 bg-muted rounded mb-3"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-muted/30 rounded-lg"></div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="h-6 w-28 bg-muted rounded mb-3"></div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted/70 rounded"></div>
              <div className="h-3 w-3/4 bg-muted/70 rounded"></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
