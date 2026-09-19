export type DelayRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type TrafficCondition = 'clear' | 'moderate' | 'heavy' | 'severe';

export type BusStatus = 'on_time' | 'delayed' | 'high_risk' | 'critical';

export type CityId = 'meerut' | 'ghaziabad' | 'delhi' | 'noida' | 'lucknow' | 'agra';

export interface CityInfo {
  id: CityId;
  name: string;
  state: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  description: string;
  activeBusCount: number;
}

export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  estimatedTime?: string;
  passed?: boolean;
  distanceKmFromStart: number;
}

export interface RouteSegment {
  fromStopId: string;
  toStopId: string;
  distanceKm: number;
  typicalTravelMinutes: number;
  currentTrafficDensity: number; // 0 - 100%
  historicalRiskIndex: number; // 0.0 - 1.0
  condition: TrafficCondition;
}

export interface BusTelemetry {
  busId: string;
  busNumber: string; // e.g. "UPSRTC-204"
  operator: string; // "UPSRTC" | "DTC" | "UPSRTC Heritage"
  routeId: string;
  routeName: string; // e.g. "Meerut Bhaisali → Ghaziabad Old Bus Stand"
  source: string;
  destination: string;
  city: CityId;
  latitude: number;
  longitude: number;
  heading: number; // 0 - 360 deg
  speed: number; // km/h
  speedLimit: number;
  trafficDensity: number; // percentage 0 - 100
  currentStop: string;
  nextStop: string;
  nextStopDistanceKm: number;
  etaMinutes: number;
  predictedArrivalTime: string;
  baseArrivalTime: string;
  delayProbability: number; // percentage 0 - 100
  predictedDelayMinutes: number;
  riskScore: number; // 0.0 to 10.0
  riskLevel: DelayRiskLevel;
  status: BusStatus;
  occupancyPercent: number;
  passengersCount: number;
  capacity: number;
  driverName: string;
  driverPhone: string;
  routeStops: BusStop[];
  routeCoordinates: [number, number][];
  currentSegmentIndex: number;
  reason: string;
  hardwareStatus: {
    esp32: 'connected' | 'reconnecting' | 'offline';
    gps: 'connected' | 'searching' | 'offline';
    lte: 'connected' | 'poor' | 'offline';
    lastPingSecondsAgo: number;
    satelliteCount: number;
  };
}

export type ScenarioType = 'normal' | 'heavy_congestion' | 'accident_ahead' | 'road_blockage';

export interface WhatIfScenarioData {
  id: ScenarioType;
  title: string;
  description: string;
  riskLevel: DelayRiskLevel;
  statusText: string;
  trafficDensity: number;
  speedImpactKmH: number;
  additionalDelayMinutes: number;
  delayProbability: number;
  recommendedAction: string;
  iconName: string;
}

export interface EarlyAlert {
  id: string;
  busNumber: string;
  route: string;
  city: CityId;
  title: string;
  message: string;
  type: 'delay_risk' | 'heavy_traffic' | 'accident' | 'road_blockage' | 'route_disruption' | 'approaching_stop';
  severity: 'info' | 'warning' | 'high' | 'critical';
  timestamp: string;
  predictedDelayMinutes?: number;
  acknowledged?: boolean;
}

export interface CorridorHeatmapSegment {
  id: string;
  corridorName: string;
  city: CityId;
  route: string;
  startCoords: [number, number];
  endCoords: [number, number];
  riskLevel: DelayRiskLevel;
  congestionScore: number; // 0 - 10
  currentSpeedKmH: number;
  bottleneckReason: string;
  timeSlot: 'morning_peak' | 'afternoon_normal' | 'evening_rush' | 'late_night';
}

export interface TelemetryPacket {
  packetId: string;
  timestamp: string;
  busNumber: string;
  lat: number;
  lng: number;
  speed: number;
  satellites: number;
  hdop: number;
  signalStrengthDbm: number;
  nmeaSentence: string;
  mqttTopic: string;
}
