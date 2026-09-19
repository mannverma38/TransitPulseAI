import React, { useState, useMemo } from 'react';
import { BusTelemetry, BusStop, DelayRiskLevel } from '../types/transit';
import {
  Navigation,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Crosshair,
  Layers,
  MapPin,
  Clock,
  Gauge,
  Activity,
} from 'lucide-react';

interface InteractiveMapProps {
  buses: BusTelemetry[];
  selectedBus: BusTelemetry;
  onSelectBus?: (busId: string) => void;
  selectedStopId?: string;
  onSelectStop?: (stop: BusStop) => void;
  showAllBuses?: boolean;
  heightClass?: string;
  allowLayerToggle?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  buses,
  selectedBus,
  onSelectBus,
  selectedStopId,
  onSelectStop,
  showAllBuses = false,
  heightClass = 'h-[520px]',
  allowLayerToggle = true,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showTrafficLayer, setShowTrafficLayer] = useState(true);
  const [showStopsLayer, setShowStopsLayer] = useState(true);
  const [hoveredBus, setHoveredBus] = useState<BusTelemetry | null>(null);

  // Geographic bounds calculation for current route/buses
  const activeBuses = showAllBuses ? buses : [selectedBus];

  // Derive center and scale bounding box
  const bounds = useMemo(() => {
    let minLat = 90,
      maxLat = -90,
      minLng = 180,
      maxLng = -180;

    const coordsToInclude: [number, number][] = [];

    activeBuses.forEach((b) => {
      coordsToInclude.push([b.latitude, b.longitude]);
      if (b.routeCoordinates) {
        coordsToInclude.push(...b.routeCoordinates);
      }
      if (b.routeStops) {
        b.routeStops.forEach((s) => coordsToInclude.push([s.lat, s.lng]));
      }
    });

    if (coordsToInclude.length === 0) {
      coordsToInclude.push([selectedBus.latitude, selectedBus.longitude]);
    }

    coordsToInclude.forEach(([lat, lng]) => {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    });

    // Add 10% padding
    const latPadding = Math.max(0.04, (maxLat - minLat) * 0.15);
    const lngPadding = Math.max(0.04, (maxLng - minLng) * 0.15);

    return {
      minLat: minLat - latPadding,
      maxLat: maxLat + latPadding,
      minLng: minLng - lngPadding,
      maxLng: maxLng + lngPadding,
    };
  }, [activeBuses, selectedBus]);

  // Coordinate projection to SVG 0-1000 x 0-700
  const project = (lat: number, lng: number): { x: number; y: number } => {
    const latSpan = Math.max(0.001, bounds.maxLat - bounds.minLat);
    const lngSpan = Math.max(0.001, bounds.maxLng - bounds.minLng);

    // X: lng from min to max (0 to 1000)
    const normX = (lng - bounds.minLng) / lngSpan;
    // Y: lat from max to min (0 to 700) (SVG inverted Y)
    const normY = (bounds.maxLat - lat) / latSpan;

    return {
      x: 80 + normX * 840,
      y: 60 + normY * 580,
    };
  };

  const getRiskColor = (risk: DelayRiskLevel) => {
    switch (risk) {
      case 'low':
        return '#10b981'; // emerald
      case 'medium':
        return '#f59e0b'; // amber
      case 'high':
        return '#f43f5e'; // rose
      case 'critical':
        return '#e11d48'; // crimson
      default:
        return '#38bdf8';
    }
  };

  // Convert route coordinates to SVG path string
  const routePaths = useMemo(() => {
    const busList = showAllBuses ? buses : [selectedBus];
    return busList.map((bus) => {
      if (!bus.routeCoordinates || bus.routeCoordinates.length < 2) return null;
      const points = bus.routeCoordinates.map(([lat, lng]) => project(lat, lng));
      const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`, '');
      return {
        busId: bus.busId,
        busNumber: bus.busNumber,
        pathD,
        risk: bus.riskLevel,
        density: bus.trafficDensity,
        isSelected: bus.busId === selectedBus.busId,
      };
    }).filter(Boolean);
  }, [showAllBuses, buses, selectedBus, bounds]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className={`relative w-full ${heightClass} bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden select-none`}>
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {showAllBuses ? `Active Fleet (${buses.length} Buses)` : `Tracking ${selectedBus.busNumber}`}
          </span>
        </div>
        <div className="h-4 w-px bg-slate-700 mx-1" />
        <span className="text-xs text-slate-400 font-mono">
          {selectedBus.source.split(' ')[0]} → {selectedBus.destination.split(' ')[0]}
        </span>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-xl">
        <button
          onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.25))}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Recenter Map"
        >
          <Crosshair className="w-4 h-4" />
        </button>
        {allowLayerToggle && (
          <button
            onClick={() => setShowTrafficLayer(!showTrafficLayer)}
            className={`p-2 rounded-lg transition-colors ${
              showTrafficLayer ? 'text-cyan-400 bg-cyan-950/50' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Toggle Traffic Flow"
          >
            <Layers className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Map Canvas / SVG Viewport */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full transition-transform duration-75"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeOpacity="0.45" />
            </pattern>
            {/* Glow Filter */}
            <filter id="bus-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="pulse-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background grid */}
          <rect width="1000" height="700" fill="#030712" />
          <rect width="1000" height="700" fill="url(#grid)" />

          {/* Simulated Geographic Highway / Arterial Roads Network */}
          <g opacity="0.35" stroke="#334155" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 50,220 Q 300,260 550,230 T 950,290" fill="none" strokeWidth="6" />
            <path d="M 120,80 Q 400,350 820,620" fill="none" strokeWidth="8" />
            <path d="M 280,680 Q 360,400 420,50" fill="none" strokeWidth="6" />
            <path d="M 680,60 L 620,380 Q 590,520 740,680" fill="none" strokeWidth="5" />
            <path d="M 80,480 C 260,460 480,520 880,470" fill="none" strokeWidth="4" />
          </g>

          {/* Route Lines */}
          {routePaths.map((rp) => {
            if (!rp) return null;
            const riskColor = getRiskColor(rp.risk);
            return (
              <g key={`route-${rp.busId}`}>
                {/* Route Base / Outer Shadow */}
                <path
                  d={rp.pathD}
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth={rp.isSelected ? '14' : '10'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Traffic Overlay */}
                {showTrafficLayer && (
                  <path
                    d={rp.pathD}
                    fill="none"
                    stroke={riskColor}
                    strokeWidth={rp.isSelected ? '7' : '4'}
                    strokeOpacity={rp.isSelected ? '0.85' : '0.45'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={rp.density > 75 ? '10, 6' : undefined}
                    className={rp.density > 75 ? 'animate-pulse' : ''}
                  />
                )}
                {/* Core route line */}
                <path
                  d={rp.pathD}
                  fill="none"
                  stroke={rp.isSelected ? '#38bdf8' : '#64748b'}
                  strokeWidth={rp.isSelected ? '3' : '2'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}

          {/* Route Stops (for selected bus or active routes) */}
          {showStopsLayer &&
            selectedBus.routeStops?.map((stop) => {
              const pt = project(stop.lat, stop.lng);
              const isSelected = selectedStopId === stop.id;
              const isNextStop = selectedBus.nextStop.includes(stop.name) || stop.name.includes(selectedBus.nextStop);

              return (
                <g
                  key={stop.id}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() => onSelectStop && onSelectStop(stop)}
                >
                  {/* Outer pulse for next stop */}
                  {isNextStop && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="14"
                      fill="#38bdf8"
                      fillOpacity="0.2"
                      className="animate-ping"
                    />
                  )}
                  {/* Stop Marker Circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected || isNextStop ? '7' : '5'}
                    fill={stop.passed ? '#475569' : isNextStop ? '#38bdf8' : '#f8fafc'}
                    stroke={isNextStop ? '#0284c7' : '#1e293b'}
                    strokeWidth="2.5"
                  />
                  {/* Stop Label Text */}
                  <text
                    x={pt.x + 10}
                    y={pt.y + 4}
                    fill={isNextStop ? '#38bdf8' : '#cbd5e1'}
                    fontSize="11"
                    fontWeight={isNextStop ? '700' : '500'}
                    className="select-none pointer-events-none drop-shadow"
                  >
                    {stop.name}
                    {stop.estimatedTime && !stop.passed && (
                      <tspan fill="#94a3b8" fontSize="9" dx="5">
                        ({stop.estimatedTime})
                      </tspan>
                    )}
                  </text>
                </g>
              );
            })}

          {/* Bus Location Markers */}
          {activeBuses.map((bus) => {
            const pt = project(bus.latitude, bus.longitude);
            const isSelected = bus.busId === selectedBus.busId;
            const riskColor = getRiskColor(bus.riskLevel);

            return (
              <g
                key={bus.busId}
                className="cursor-pointer"
                onClick={() => onSelectBus && onSelectBus(bus.busId)}
                onMouseEnter={() => setHoveredBus(bus)}
                onMouseLeave={() => setHoveredBus(null)}
              >
                {/* Pulsing ring for high risk or critical buses */}
                {(bus.riskLevel === 'high' || bus.riskLevel === 'critical') && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="22"
                    fill={riskColor}
                    fillOpacity="0.25"
                    className="animate-ping"
                  />
                )}

                {/* Selected bus highlight halo */}
                {isSelected && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="18"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="4, 3"
                    className="animate-spin"
                    style={{ animationDuration: '8s', transformOrigin: `${pt.x}px ${pt.y}px` }}
                  />
                )}

                {/* Bus Pin Base */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="13"
                  fill="#090d16"
                  stroke={riskColor}
                  strokeWidth="3"
                  filter="url(#bus-glow)"
                />

                {/* Direction Heading Indicator */}
                <g transform={`translate(${pt.x}, ${pt.y}) rotate(${bus.heading})`}>
                  <path d="M -5,-3 L 0,-10 L 5,-3 Z" fill={riskColor} />
                </g>

                {/* Bus Icon Inside Marker */}
                <text
                  x={pt.x}
                  y={pt.y + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="9"
                  fontWeight="800"
                  className="select-none pointer-events-none font-mono"
                >
                  BUS
                </text>

                {/* Bus Badge Callout */}
                <g transform={`translate(${pt.x - 45}, ${pt.y - 38})`}>
                  <rect
                    width="90"
                    height="24"
                    rx="6"
                    fill="#0f172a"
                    stroke={isSelected ? '#38bdf8' : '#334155'}
                    strokeWidth="1.5"
                    className="shadow-lg"
                  />
                  <text
                    x="45"
                    y="16"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="700"
                    className="font-mono tracking-tight"
                  >
                    {bus.busNumber}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Hover Card */}
      {hoveredBus && (
        <div className="absolute bottom-4 left-4 z-30 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 shadow-2xl min-w-[260px] pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
            <span className="font-bold text-white font-mono text-sm">{hoveredBus.busNumber}</span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
              style={{
                backgroundColor: `${getRiskColor(hoveredBus.riskLevel)}20`,
                color: getRiskColor(hoveredBus.riskLevel),
              }}
            >
              {hoveredBus.riskLevel} Risk ({hoveredBus.delayProbability}%)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-slate-400 text-[10px]">Speed</p>
              <p className="font-semibold text-slate-200">{hoveredBus.speed} km/h</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px]">Traffic Density</p>
              <p className="font-semibold text-slate-200">{hoveredBus.trafficDensity}%</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px]">Next Stop</p>
              <p className="font-semibold text-slate-200 truncate">{hoveredBus.nextStop}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px]">Dynamic ETA</p>
              <p className="font-semibold text-cyan-400">{hoveredBus.etaMinutes} min</p>
            </div>
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[11px] flex items-center gap-3 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          <span className="text-slate-400">On Time</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          <span className="text-slate-400">Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
          <span className="text-slate-400">High Risk</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block animate-pulse" />
          <span className="text-slate-400">Critical</span>
        </div>
      </div>
    </div>
  );
};
