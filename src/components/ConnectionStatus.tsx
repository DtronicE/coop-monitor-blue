import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff, Settings } from "lucide-react";
import { useState } from "react";

interface ConnectionStatusProps {
  isConnected: boolean;
  ipAddress: string;
  onConnect: (ip: string) => void;
  onDisconnect: () => void;
  isMockMode: boolean;
  onToggleMockMode: () => void;
  className?: string;
}

export const ConnectionStatus = ({
  isConnected,
  ipAddress,
  onConnect,
  onDisconnect,
  isMockMode,
  onToggleMockMode,
  className
}: ConnectionStatusProps) => {
  const [inputIp, setInputIp] = useState(ipAddress);
  const [showSettings, setShowSettings] = useState(false);

  const handleConnect = () => {
    if (inputIp.trim()) {
      onConnect(inputIp.trim());
      setShowSettings(false);
    }
  };

  return (
    <Card className={cn(
      "glass-card p-4 transition-all duration-300",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isConnected ? (
            <Wifi className="h-5 w-5 text-success animate-pulse" />
          ) : (
            <WifiOff className="h-5 w-5 text-muted-foreground" />
          )}
          
          <div>
            <h3 className="font-semibold">
              {isMockMode ? 'Mock Data Mode' : 'IoT Device Connection'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isConnected 
                ? `Connected to ${ipAddress}` 
                : 'Not connected'
              }
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="hover:bg-white/10"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      
      {showSettings && (
        <div className="space-y-4 pt-4 border-t border-white/10 animate-slide-up">
          <div className="space-y-2">
            <Label htmlFor="ip-address">Device IP Address</Label>
            <Input
              id="ip-address"
              value={inputIp}
              onChange={(e) => setInputIp(e.target.value)}
              placeholder="192.168.1.100"
              className="glass border-white/20 bg-background/20"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleConnect}
              disabled={!inputIp.trim() || isMockMode}
              variant="default"
              size="sm"
              className="flex-1"
            >
              Connect
            </Button>
            
            {isConnected && (
              <Button
                onClick={onDisconnect}
                variant="destructive"
                size="sm"
                className="flex-1"
              >
                Disconnect
              </Button>
            )}
          </div>
          
          <Button
            onClick={onToggleMockMode}
            variant={isMockMode ? "destructive" : "secondary"}
            size="sm"
            className="w-full"
          >
            {isMockMode ? 'Disable Mock Mode' : 'Enable Mock Mode'}
          </Button>
        </div>
      )}
    </Card>
  );
};