import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  BusTelemetry,
  CityId,
  ScenarioType,
  EarlyAlert,
  TelemetryPacket,
} from '../types/transit';
import {
  INITIAL_BUSES,
  CITIES,
  INITIAL_ALERTS,
  SAMPLE_HARDWARE_PACKETS,
  WHAT_IF_SCENARIOS,
} from '../data/mockTransitData';
import { calculateAIPrediction } from '../services/aiPredictionEngine';

export type NavigationTab =
  | 'dashboard'
  | 'live_tracking'
  | 'my_bus'
  | 'what_if'
  | 'ai_prediction'
  | 'driver_mode'
  | 'fleet_dashboard'
  | 'traffic_heatmap'
  | 'fleet_management'
  | 'hardware'
  | 'alerts'
  | 'architecture';

interface TransitContextType {
  buses: BusTelemetry[];
  selectedCity: CityId;
  setSelectedCity: (city: CityId) => void;
  selectedBusId: string;
  setSelectedBusId: (busId: string) => void;
  selectedBus: BusTelemetry;
  activeScenario: ScenarioType;
  setActiveScenario: (scenario: ScenarioType) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  alerts: EarlyAlert[];
  dismissAlert: (id: string) => void;
  addAlert: (alert: Omit<EarlyAlert, 'id' | 'timestamp'>) => void;
  simulationRunning: boolean;
  setSimulationRunning: React.Dispatch<React.SetStateAction<boolean>>;
  triggerScenarioForSelectedBus: (scenario: ScenarioType) => void;
  isTourOpen: boolean;
  setIsTourOpen: (open: boolean) => void;
  currentTourStep: number;
  setCurrentTourStep: (step: number) => void;
  livePackets: TelemetryPacket[];
  resetDemoToDefault: () => void;
}

const TransitContext = createContext<TransitContextType | null>(null);

export const TransitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buses, setBuses] = useState<BusTelemetry[]>(INITIAL_BUSES);
  const [selectedCity, setSelectedCity] = useState<CityId>('meerut');
  const [selectedBusId, setSelectedBusId] = useState<string>('bus-upsrtc-204');
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('normal');
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [alerts, setAlerts] = useState<EarlyAlert[]>(INITIAL_ALERTS);
  const [simulationRunning, setSimulationRunning] = useState<boolean>(true);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const [livePackets, setLivePackets] = useState<TelemetryPacket[]>(SAMPLE_HARDWARE_PACKETS);

  // Selected bus object
  const selectedBus = useMemo(() => {
    const found = buses.find((b) => b.busId === selectedBusId);
    return found || buses[0];
  }, [buses, selectedBusId]);

  // When city changes, update selected bus to one from that city if possible
  const handleSelectCity = useCallback(
    (cityId: CityId) => {
      setSelectedCity(cityId);
      const busInCity = buses.find((b) => b.city === cityId);
      if (busInCity) {
        setSelectedBusId(busInCity.busId);
      }
    },
    [buses]
  );

  // Trigger scenario updates AI prediction for the bus immediately
  const triggerScenarioForSelectedBus = useCallback(
    (scenario: ScenarioType) => {
      setActiveScenario(scenario);
      const scenarioConfig = WHAT_IF_SCENARIOS[scenario];

      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          if (bus.busId !== selectedBusId) return bus;

          const aiResult = calculateAIPrediction({
            busSpeedKmH: bus.speed,
            speedLimitKmH: bus.speedLimit,
            trafficDensityPercent: scenarioConfig.trafficDensity,
            historicalCongestionIndex: 0.72,
            timeOfDayHours: 10,
            remainingDistanceKm: bus.nextStopDistanceKm + 15,
            remainingStopsCount: 3,
            activeScenario: scenario,
          });

          // Generate updated arrival time
          const now = new Date();
          now.setMinutes(now.getMinutes() + aiResult.dynamicEtaMinutes);
          const formattedArrival = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return {
            ...bus,
            trafficDensity: scenarioConfig.trafficDensity,
            speed: Math.max(8, bus.speed + scenarioConfig.speedImpactKmH),
            delayProbability: aiResult.delayProbability,
            predictedDelayMinutes: aiResult.predictedDelayMinutes,
            riskScore: aiResult.riskScore,
            riskLevel: aiResult.riskLevel,
            status:
              aiResult.riskLevel === 'critical'
                ? 'critical'
                : aiResult.riskLevel === 'high'
                ? 'high_risk'
                : aiResult.riskLevel === 'medium'
                ? 'delayed'
                : 'on_time',
            reason: aiResult.reason,
            etaMinutes: aiResult.dynamicEtaMinutes,
            predictedArrivalTime: formattedArrival,
          };
        })
      );

      // Add a live alert when scenario is triggered
      if (scenario !== 'normal') {
        const newAlert: EarlyAlert = {
          id: `alert-${Date.now()}`,
          busNumber: selectedBus.busNumber,
          route: selectedBus.routeName,
          city: selectedBus.city,
          title:
            scenario === 'heavy_congestion'
              ? '⚠ Heavy Congestion Delay Warning'
              : scenario === 'accident_ahead'
              ? '⚠ Accident / Lane Incident Ahead'
              : '🚧 Road Blockage & Re-Route Advisory',
          message:
            scenario === 'heavy_congestion'
              ? `Traffic congestion may delay ${selectedBus.busNumber} by approx ${scenarioConfig.additionalDelayMinutes} minutes.`
              : scenario === 'accident_ahead'
              ? `Emergency services clearing lane ahead. Predicted delay +${scenarioConfig.additionalDelayMinutes} min.`
              : `Major carriageway obstruction. Alternative peripheral corridor suggested.`,
          type:
            scenario === 'heavy_congestion'
              ? 'heavy_traffic'
              : scenario === 'accident_ahead'
              ? 'accident'
              : 'road_blockage',
          severity: scenario === 'road_blockage' ? 'critical' : 'high',
          timestamp: 'Just now',
          predictedDelayMinutes: scenarioConfig.additionalDelayMinutes,
        };

        setAlerts((prev) => [newAlert, ...prev]);
      }
    },
    [selectedBusId, selectedBus]
  );

  // Automatic live movement simulation
  useEffect(() => {
    if (!simulationRunning) return;

    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          const coords = bus.routeCoordinates;
          if (!coords || coords.length < 2) return bus;

          const nextIndex = (bus.currentSegmentIndex + 1) % coords.length;
          const [currentLat, currentLng] = coords[bus.currentSegmentIndex];
          const [targetLat, targetLng] = coords[nextIndex];

          // Tiny step interpolation towards next coordinate
          const stepFraction = 0.08;
          const newLat = currentLat + (targetLat - currentLat) * stepFraction;
          const newLng = currentLng + (targetLng - currentLng) * stepFraction;

          // Jitter speed slightly for realism
          const speedVariance = (Math.random() - 0.5) * 3;
          const newSpeed = Math.max(10, Math.min(bus.speedLimit, Math.round(bus.speed + speedVariance)));

          // Recalculate AI prediction
          const aiResult = calculateAIPrediction({
            busSpeedKmH: newSpeed,
            speedLimitKmH: bus.speedLimit,
            trafficDensityPercent: bus.trafficDensity,
            historicalCongestionIndex: 0.65,
            timeOfDayHours: 10,
            remainingDistanceKm: Math.max(1.2, bus.nextStopDistanceKm - 0.1),
            remainingStopsCount: 2,
            activeScenario,
          });

          return {
            ...bus,
            latitude: Number(newLat.toFixed(6)),
            longitude: Number(newLng.toFixed(6)),
            speed: newSpeed,
            delayProbability: aiResult.delayProbability,
            predictedDelayMinutes: aiResult.predictedDelayMinutes,
            riskScore: aiResult.riskScore,
            riskLevel: aiResult.riskLevel,
            hardwareStatus: {
              ...bus.hardwareStatus,
              lastPingSecondsAgo: 1,
            },
          };
        })
      );

      // Also append a fresh live telemetry packet for the hardware inspector
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0')}`;
      
      const newPacket: TelemetryPacket = {
        packetId: `PKT-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: timeStr,
        busNumber: 'UPSRTC-204',
        lat: 28.845 + (Math.random() - 0.5) * 0.002,
        lng: 77.618 + (Math.random() - 0.5) * 0.002,
        speed: Math.round(18 + (Math.random() - 0.5) * 4),
        satellites: 11,
        hdop: 0.88,
        signalStrengthDbm: -70 - Math.floor(Math.random() * 6),
        nmeaSentence: `$GPRMC,${timeStr.replace(/:/g, '')},A,2850.7007,N,07737.0827,E,09.93,215.2,110926,,,A*7F`,
        mqttTopic: 'vlt/upsrtc/meerut/upsrtc-204/telemetry',
      };

      setLivePackets((prev) => [newPacket, ...prev.slice(0, 19)]);
    }, 2800);

    return () => clearInterval(interval);
  }, [simulationRunning, activeScenario]);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const addAlert = useCallback((alertData: Omit<EarlyAlert, 'id' | 'timestamp'>) => {
    const alert: EarlyAlert = {
      ...alertData,
      id: `alt-${Date.now()}`,
      timestamp: 'Just now',
    };
    setAlerts((prev) => [alert, ...prev]);
  }, []);

  const resetDemoToDefault = useCallback(() => {
    setBuses(INITIAL_BUSES);
    setSelectedCity('meerut');
    setSelectedBusId('bus-upsrtc-204');
    setActiveScenario('normal');
    setActiveTab('dashboard');
    setCurrentTourStep(0);
    setIsTourOpen(false);
  }, []);

  const value = {
    buses,
    selectedCity,
    setSelectedCity: handleSelectCity,
    selectedBusId,
    setSelectedBusId,
    selectedBus,
    activeScenario,
    setActiveScenario,
    activeTab,
    setActiveTab,
    alerts,
    dismissAlert,
    addAlert,
    simulationRunning,
    setSimulationRunning,
    triggerScenarioForSelectedBus,
    isTourOpen,
    setIsTourOpen,
    currentTourStep,
    setCurrentTourStep,
    livePackets,
    resetDemoToDefault,
  };

  return <TransitContext.Provider value={value}>{children}</TransitContext.Provider>;
};

export function useTransit() {
  const context = useContext(TransitContext);
  if (!context) {
    throw new Error('useTransit must be used within a TransitProvider');
  }
  return context;
}
