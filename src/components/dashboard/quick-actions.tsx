import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color?: "primary" | "secondary" | "success" | "warning";
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

const colorStyles = {
  primary: "bg-primary/10 text-primary hover:bg-primary/20",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  success: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20",
};

export function QuickActions({ actions, className }: QuickActionsProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-(--color-border) p-6 shadow-sm",
        className
      )}
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg transition-colors",
                colorStyles[action.color || "primary"]
              )}
            >
              <div className="shrink-0">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{action.label}</p>
                <p className="text-sm opacity-80">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
