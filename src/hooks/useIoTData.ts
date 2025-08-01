import { useState, useEffect, useCallback } from 'react';

interface SensorReading {
  temperature: number;
  humidity: number;
  airQuality: number;
  ammonia: number;
  co2: number;
  dust: number;
  timestamp: Date;
}

interface Alert {
  id: string;
  type: 'temperature' | 'humidity' | 'air_quality';
  message: string;
  severity: 'warning' | 'critical';
  timestamp: Date;
}

interface IoTConnection {
  isConnected: boolean;
  ipAddress: string;
  isMockMode: boolean;
}

export const useIoTData = () => {
  const [connection, setConnection] = useState<IoTConnection>({
    isConnected: false,
    ipAddress: '',
    isMockMode: true,
  });
  
  const [sensorData, setSensorData] = useState<SensorReading>({
    temperature: 22.5,
    humidity: 65,
    airQuality: 85,
    ammonia: 12,
    co2: 400,
    dust: 25,
    timestamp: new Date(),
  });
  
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Mock data generator
  const generateMockData = useCallback((): SensorReading => {
    const baseTemp = 22 + Math.sin(Date.now() / 60000) * 3; // Oscillates between 19-25°C
    const baseHumidity = 65 + Math.random() * 10 - 5; // 60-70%
    const baseAirQuality = 80 + Math.random() * 20; // 80-100
    const baseAmmonia = 10 + Math.random() * 8; // 10-18 ppm
    const baseCO2 = 400 + Math.random() * 200; // 400-600 ppm
    const baseDust = 20 + Math.random() * 15; // 20-35 μg/m³
    
    return {
      temperature: Math.round(baseTemp * 10) / 10,
      humidity: Math.round(baseHumidity * 10) / 10,
      airQuality: Math.round(baseAirQuality),
      ammonia: Math.round(baseAmmonia * 10) / 10,
      co2: Math.round(baseCO2),
      dust: Math.round(baseDust * 10) / 10,
      timestamp: new Date(),
    };
  }, []);

  // Real IoT data fetcher
  const fetchIoTData = useCallback(async (ipAddress: string): Promise<SensorReading | null> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`http://${ipAddress}/api/sensors`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      return {
        temperature: data.temperature || 0,
        humidity: data.humidity || 0,
        airQuality: data.air_quality || 0,
        ammonia: data.ammonia || 0,
        co2: data.co2 || 0,
        dust: data.dust || 0,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('IoT data fetch error:', error);
      return null;
    }
  }, []);

  // Alert system
  const checkForAlerts = useCallback((data: SensorReading) => {
    const newAlerts: Alert[] = [];
    
    // Temperature alerts (optimal: 18-24°C)
    if (data.temperature < 18) {
      newAlerts.push({
        id: `temp-cold-${Date.now()}`,
        type: 'temperature',
        message: `Temperature too low: ${data.temperature}°C`,
        severity: data.temperature < 15 ? 'critical' : 'warning',
        timestamp: new Date(),
      });
    } else if (data.temperature > 24) {
      newAlerts.push({
        id: `temp-hot-${Date.now()}`,
        type: 'temperature',
        message: `Temperature too high: ${data.temperature}°C`,
        severity: data.temperature > 28 ? 'critical' : 'warning',
        timestamp: new Date(),
      });
    }
    
    // Humidity alerts (optimal: 50-70%)
    if (data.humidity < 50) {
      newAlerts.push({
        id: `humidity-low-${Date.now()}`,
        type: 'humidity',
        message: `Humidity too low: ${data.humidity}%`,
        severity: data.humidity < 40 ? 'critical' : 'warning',
        timestamp: new Date(),
      });
    } else if (data.humidity > 70) {
      newAlerts.push({
        id: `humidity-high-${Date.now()}`,
        type: 'humidity',
        message: `Humidity too high: ${data.humidity}%`,
        severity: data.humidity > 80 ? 'critical' : 'warning',
        timestamp: new Date(),
      });
    }
    
    // Air quality alerts (good: >80, moderate: 60-80, poor: <60)
    if (data.airQuality < 60) {
      newAlerts.push({
        id: `air-poor-${Date.now()}`,
        type: 'air_quality',
        message: `Poor air quality: ${data.airQuality}`,
        severity: data.airQuality < 40 ? 'critical' : 'warning',
        timestamp: new Date(),
      });
    }
    
    // Ammonia alerts (safe: <15 ppm)
    if (data.ammonia > 15) {
      newAlerts.push({
        id: `ammonia-high-${Date.now()}`,
        type: 'air_quality',
        message: `High ammonia levels: ${data.ammonia} ppm`,
        severity: data.ammonia > 25 ? 'critical' : 'warning',
        timestamp: new Date(),
      });
    }
    
    // CO2 alerts (normal: <500 ppm)
    if (data.co2 > 500) {
      newAlerts.push({
        id: `co2-high-${Date.now()}`,
        type: 'air_quality',
        message: `High CO₂ levels: ${data.co2} ppm`,
        severity: data.co2 > 800 ? 'critical' : 'warning',
        timestamp: new Date(),
      });
    }
    
    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 10)); // Keep only last 10 alerts
    }
  }, []);

  // Data update loop
  useEffect(() => {
    const interval = setInterval(async () => {
      let newData: SensorReading | null = null;
      
      if (connection.isMockMode) {
        newData = generateMockData();
      } else if (connection.isConnected && connection.ipAddress) {
        newData = await fetchIoTData(connection.ipAddress);
        
        if (!newData) {
          // Connection lost, switch to mock mode
          setConnection(prev => ({ ...prev, isConnected: false, isMockMode: true }));
          newData = generateMockData();
        }
      }
      
      if (newData) {
        setSensorData(newData);
        checkForAlerts(newData);
      }
    }, 2000); // Update every 2 seconds
    
    return () => clearInterval(interval);
  }, [connection, generateMockData, fetchIoTData, checkForAlerts]);

  const connect = useCallback((ipAddress: string) => {
    setConnection({
      isConnected: true,
      ipAddress,
      isMockMode: false,
    });
  }, []);

  const disconnect = useCallback(() => {
    setConnection(prev => ({
      ...prev,
      isConnected: false,
    }));
  }, []);

  const toggleMockMode = useCallback(() => {
    setConnection(prev => ({
      ...prev,
      isMockMode: !prev.isMockMode,
      isConnected: prev.isMockMode ? false : prev.isConnected,
    }));
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  return {
    connection,
    sensorData,
    alerts,
    connect,
    disconnect,
    toggleMockMode,
    dismissAlert,
  };
};