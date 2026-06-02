import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const MetricCard = React.memo(({ title, value, subtext, icon: Icon, iconClassName, trend, trendValue }) => {
  return (
    <Card className="premium-dashboard-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-muted-foreground description-text">
              {title}
            </p>
            <div className="flex items-baseline space-x-2">
              <h2 className="card-value tracking-tight text-foreground">{value}</h2>
              {trend && (
                <span className={cn(
                  "text-xs font-medium",
                  trend === 'up' ? "text-emerald-500" : trend === 'down' ? "text-red-500" : "text-muted-foreground description-text"
                )}>
                  {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendValue}
                </span>
              )}
            </div>
            {subtext && (
              <p className="text-xs text-muted-foreground description-text">
                {subtext}
              </p>
            )}
          </div>
          {Icon && (
            <div className={cn("w-14 h-14 rounded-full bg-primary/10 text-primary shrink-0 flex items-center justify-center", iconClassName)}>
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
