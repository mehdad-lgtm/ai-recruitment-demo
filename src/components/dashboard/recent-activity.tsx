import { cn } from "@/lib/utils";

interface RecentActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "success" | "warning" | "info" | "error";
}

interface RecentActivityProps {
  items: RecentActivityItem[];
  className?: string;
}

const typeColors = {
  success: "bg-green-500",
  warning: "bg-yellow-500",
  info: "bg-blue-500",
  error: "bg-red-500",
};

export function RecentActivity({ items, className }: RecentActivityProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-(--color-border) p-6 shadow-sm",
        className
      )}
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className={cn("w-2 h-2 rounded-full mt-2", typeColors[item.type])} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity
          </p>
        )}
      </div>
    </div>
  );
}
