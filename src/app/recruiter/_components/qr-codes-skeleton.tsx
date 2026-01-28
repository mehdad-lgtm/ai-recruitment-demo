import { Card } from "@/components/ui";

export function QRCodesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-muted rounded-lg mb-2"></div>
          <div className="h-4 w-80 bg-muted/70 rounded-lg"></div>
        </div>
        <div className="h-10 w-40 bg-muted rounded-lg"></div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="h-4 w-32 bg-muted rounded mb-2"></div>
            <div className="h-8 w-16 bg-muted rounded"></div>
          </Card>
        ))}
      </div>

      {/* QR Codes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="aspect-square bg-muted/30 rounded-lg mb-4"></div>
            <div className="space-y-3">
              <div className="h-5 w-3/4 bg-muted rounded"></div>
              <div className="h-3 w-full bg-muted/70 rounded"></div>
              <div className="flex gap-2">
                <div className="h-8 flex-1 bg-muted rounded-lg"></div>
                <div className="h-8 w-8 bg-muted rounded-lg"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
