import { useIoTData } from "@/hooks/useIoTData";
import { SensorCard } from "@/components/SensorCard";
import { AlertPanel } from "@/components/AlertPanel";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { Card } from "@/components/ui/card";

const Index = () => {
  const {
    connection,
    sensorData,
    alerts,
    connect,
    disconnect,
    toggleMockMode,
    dismissAlert,
  } = useIoTData();

  const getSensorStatus = (value: number, min: number, max: number): 'normal' | 'warning' | 'critical' => {
    if (value < min || value > max) {
      return value < min * 0.8 || value > max * 1.2 ? 'critical' : 'warning';
    }
    return 'normal';
  };

  const sensorCards = [
    {
      label: 'Temperature',
      value: sensorData.temperature,
      unit: '°C',
      icon: '🌡️',
      status: getSensorStatus(sensorData.temperature, 18, 24),
      threshold: { min: 18, max: 24 },
    },
    {
      label: 'Humidity',
      value: sensorData.humidity,
      unit: '%',
      icon: '💧',
      status: getSensorStatus(sensorData.humidity, 50, 70),
      threshold: { min: 50, max: 70 },
    },
    {
      label: 'Air Quality',
      value: sensorData.airQuality,
      unit: 'AQI',
      icon: '🍃',
      status: (sensorData.airQuality > 80 ? 'normal' : sensorData.airQuality > 60 ? 'warning' : 'critical') as 'normal' | 'warning' | 'critical',
      threshold: { min: 80, max: 100 },
    },
    {
      label: 'Ammonia',
      value: sensorData.ammonia,
      unit: 'ppm',
      icon: '⚗️',
      status: (sensorData.ammonia <= 15 ? 'normal' : sensorData.ammonia <= 25 ? 'warning' : 'critical') as 'normal' | 'warning' | 'critical',
      threshold: { min: 0, max: 15 },
    },
    {
      label: 'CO₂ Level',
      value: sensorData.co2,
      unit: 'ppm',
      icon: '🫁',
      status: (sensorData.co2 <= 500 ? 'normal' : sensorData.co2 <= 800 ? 'warning' : 'critical') as 'normal' | 'warning' | 'critical',
      threshold: { min: 300, max: 500 },
    },
    {
      label: 'Dust Particles',
      value: sensorData.dust,
      unit: 'μg/m³',
      icon: '🌪️',
      status: (sensorData.dust <= 30 ? 'normal' : sensorData.dust <= 50 ? 'warning' : 'critical') as 'normal' | 'warning' | 'critical',
      threshold: { min: 0, max: 30 },
    },
  ];

  return (
    <div className="min-h-screen p-4 pb-safe-area-inset-bottom">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-bounce-in">
          <h1 className="text-4xl font-bold text-gradient">
            🐔 ChickFarm Monitor
          </h1>
          <p className="text-muted-foreground">
            Real-time environmental monitoring for optimal chicken health
          </p>
          <p className="text-xs text-muted-foreground">
            Last updated: {sensorData.timestamp.toLocaleString()}
          </p>
        </div>

        {/* Connection Status */}
        <ConnectionStatus
          isConnected={connection.isConnected}
          ipAddress={connection.ipAddress}
          onConnect={connect}
          onDisconnect={disconnect}
          isMockMode={connection.isMockMode}
          onToggleMockMode={toggleMockMode}
        />

        {/* Alerts Panel */}
        {alerts.length > 0 && (
          <AlertPanel
            alerts={alerts}
            onDismiss={dismissAlert}
          />
        )}

        {/* Sensor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensorCards.map((sensor, index) => (
            <SensorCard
              key={sensor.label}
              data={sensor}
              className={`delay-${index * 100}`}
            />
          ))}
        </div>

        {/* Quick Stats */}
        <Card className="glass-card p-6">
          <h3 className="font-semibold mb-4 text-center">Farm Status Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-success">
                {sensorCards.filter(s => s.status === 'normal').length}
              </div>
              <div className="text-sm text-muted-foreground">Normal</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">
                {sensorCards.filter(s => s.status === 'warning').length}
              </div>
              <div className="text-sm text-muted-foreground">Warning</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-destructive">
                {sensorCards.filter(s => s.status === 'critical').length}
              </div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {alerts.length}
              </div>
              <div className="text-sm text-muted-foreground">Active Alerts</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
