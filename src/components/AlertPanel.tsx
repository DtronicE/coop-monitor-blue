import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, X } from "lucide-react";

interface Alert {
  id: string;
  type: 'temperature' | 'humidity' | 'air_quality';
  message: string;
  severity: 'warning' | 'critical';
  timestamp: Date;
}

interface AlertPanelProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
  className?: string;
}

export const AlertPanel = ({ alerts, onDismiss, className }: AlertPanelProps) => {
  if (alerts.length === 0) return null;

  return (
    <Card className={cn(
      "glass-card p-4 animate-slide-up",
      className
    )}>
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-warning animate-pulse" />
        <h3 className="font-semibold text-warning">
          Active Alerts ({alerts.length})
        </h3>
      </div>
      
      <div className="space-y-3 max-h-40 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "flex items-start justify-between p-3 rounded-lg glass border-l-4 animate-bounce-in",
              alert.severity === 'critical' 
                ? "border-l-destructive bg-destructive/10" 
                : "border-l-warning bg-warning/10"
            )}
          >
            <div className="flex-1">
              <p className={cn(
                "text-sm font-medium",
                alert.severity === 'critical' ? "text-destructive" : "text-warning"
              )}>
                {alert.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {alert.timestamp.toLocaleTimeString()}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismiss(alert.id)}
              className="h-6 w-6 p-0 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};