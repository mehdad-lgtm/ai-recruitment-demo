import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-card/70 backdrop-blur-md rounded-2xl border border-border/50 p-6 shadow-sm transition-all duration-300",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase text-[10px]">{title}</p>
          <p className="text-3xl font-extrabold text-foreground mt-2 tracking-tight">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 font-medium">{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5 mt-3 px-2 py-1 rounded-full bg-muted/50 w-fit">
              <span
                className={cn(
                  "text-xs font-bold",
                  trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">vs last month</span>
            </div>
          )}
        </div>
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 shadow-inner">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </motion.div>
  );
}
