import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SensorData {
  label: string;
  value: number;
  unit: string;
  icon: string;
  status: 'normal' | 'warning' | 'critical';
  threshold?: { min: number; max: number };
}

interface SensorCardProps {
  data: SensorData;
  className?: string;
}

export const SensorCard = ({ data, className }: SensorCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-success border-success/20 bg-success/5';
      case 'warning':
        return 'text-warning border-warning/20 bg-warning/5';
      case 'critical':
        return 'text-destructive border-destructive/20 bg-destructive/5';
      default:
        return 'text-foreground border-border/20';
    }
  };

  const getValueColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'critical':
        return 'text-destructive';
      default:
        return 'text-foreground';
    }
  };

  return (
    <Card className={cn(
      "glass-card p-6 transition-all duration-300 hover:scale-105 animate-bounce-in",
      getStatusColor(data.status),
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{data.icon}</div>
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          getStatusColor(data.status)
        )}>
          {data.status.toUpperCase()}
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        {data.label}
      </h3>
      
      <div className="flex items-baseline gap-1">
        <span className={cn(
          "text-3xl font-bold animate-pulse-slow",
          getValueColor(data.status)
        )}>
          {data.value}
        </span>
        <span className="text-sm text-muted-foreground">
          {data.unit}
        </span>
      </div>
      
      {data.threshold && (
        <div className="mt-3 text-xs text-muted-foreground">
          Range: {data.threshold.min} - {data.threshold.max} {data.unit}
        </div>
      )}
    </Card>
  );
};