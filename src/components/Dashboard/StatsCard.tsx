import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning";
}

export const StatsCard = ({ title, value, icon: Icon, trend, variant = "default" }: StatsCardProps) => {
  const variantStyles = {
    default: "text-primary",
    success: "text-success",
    warning: "text-destructive",
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <p
                className={cn("text-sm font-medium", trend.isPositive ? "text-success" : "text-destructive")}
              >
                {trend.isPositive ? "+" : "-"}
                {trend.value}
              </p>
            )}
          </div>
          <div
            className={cn(
              "rounded-xl p-3",
              variant === "success"
                ? "bg-success/10"
                : variant === "warning"
                ? "bg-destructive/10"
                : "bg-primary/10"
            )}
          >
            <Icon className={cn("h-6 w-6", variantStyles[variant])} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
