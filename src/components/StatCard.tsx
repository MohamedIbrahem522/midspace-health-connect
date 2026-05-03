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
    <div className="group relative overflow-hidden rounded-xl border bg-card p-5 transition-all duration-300 card-shadow hover:card-shadow-hover hover:-translate-y-0.5">
      {/* Subtle top border accent on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3">
        {/* Left: text */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight">
            {value}
          </p>
          {trend && (
            <div className={cn(
              "mt-1.5 flex items-center gap-1 text-xs font-medium",
              isPositive === true  && "text-secondary",
              isPositive === false && "text-destructive",
              isPositive === undefined && "text-muted-foreground",
            )}>
              {isPositive === true  && <TrendingUp  className="h-3 w-3" />}
              {isPositive === false && <TrendingDown className="h-3 w-3" />}
              {trend}
            </div>
          )}
        </div>

        {/* Right: icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 ring-1 ring-primary/12 transition-colors duration-300 group-hover:bg-primary/14">
          <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}