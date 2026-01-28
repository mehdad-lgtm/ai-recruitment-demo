import { Card } from "@/components/ui";

export function CommunicationsListSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-muted rounded-lg"></div>
        <div className="h-10 w-36 bg-muted rounded-lg"></div>
      </div>

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversations List */}
        <Card className="p-4">
          <div className="h-10 w-full bg-muted rounded-lg mb-4"></div>
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/30 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-32 bg-muted rounded"></div>
                    <div className="h-3 w-24 bg-muted/70 rounded"></div>
                  </div>
                </div>
                <div className="h-3 w-full bg-muted/70 rounded"></div>
              </div>
            ))}
          </div>
        </Card>

        {/* Message View */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-[600px] flex flex-col">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="h-12 w-12 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-muted rounded"></div>
                <div className="h-3 w-24 bg-muted/70 rounded"></div>
              </div>
            </div>
            <div className="flex-1 py-4 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${i % 2 === 0 ? 'bg-muted' : 'bg-muted/50'}`}>
                    <div className="h-4 w-48 bg-muted/70 rounded mb-2"></div>
                    <div className="h-3 w-32 bg-muted/70 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-12 bg-muted rounded-lg"></div>
          </Card>
        </div>
      </div>
    </div>
  );
}
