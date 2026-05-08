import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({ title, value, icon: Icon, trend, trendUp }: StatCardProps) {
  const isPositive = trendUp ?? (trend ? !trend.startsWith("-") : undefined);

  return (
    <div className="rounded-xl border bg-card p-4 card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground font-medium">
            {title}
          </p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {trend && (
            <div className={cn(
              "mt-1 flex items-center gap-1 text-xs font-medium",
              isPositive === true && "text-emerald-600 dark:text-emerald-400",
              isPositive === false && "text-red-600 dark:text-red-400",
              isPositive === undefined && "text-muted-foreground",
            )}>
              {isPositive === true && <TrendingUp className="h-3.5 w-3.5" />}
              {isPositive === false && <TrendingDown className="h-3.5 w-3.5" />}
              {trend}
            </div>
          )}
        </div>

        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
