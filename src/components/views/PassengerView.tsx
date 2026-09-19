import React, { useState, useMemo } from 'react';
import { useTransit } from '../../context/TransitContext';
import { InteractiveMap } from '../InteractiveMap';
import { BusStop, DelayRiskLevel } from '../../types/transit';
import {
  Search,
  MapPin,
  Clock,
  AlertTriangle,
  Users,
  Gauge,
  Navigation,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Compass,
  Sparkles,
  Zap,
} from 'lucide-react';

export const PassengerView: React.FC = () => {
  const { buses, selectedBus, setSelectedBusId, alerts, triggerScenarioForSelectedBus, activeScenario } = useTransit();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);

  // Filtered buses based on search criteria
  const filteredBuses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return buses;
    return buses.filter(
      (b) =>
        b.busNumber.toLowerCase().includes(q) ||
        b.routeName.toLowerCase().includes(q) ||
        b.source.toLowerCase().includes(q) ||
        b.destination.toLowerCase().includes(q) ||
        b.currentStop.toLowerCase().includes(q) ||
        b.nextStop.toLowerCase().includes(q) ||
        b.routeStops?.some((s) => s.name.toLowerCase().includes(q))
    );
  }, [buses, searchQuery]);

  // Specific alerts for this bus
  const busAlerts = alerts.filter(
    (a) => a.busNumber === selectedBus.busNumber || a.city === selectedBus.city
  );

  const getRiskBadge = (risk: DelayRiskLevel) => {
    switch (risk) {
      case 'low':
        return {
          label: 'LOW RISK',
          bg: 'bg-emerald-950/70 text-emerald-400 border-emerald-700/60',
          barColor: 'bg-emerald-500',
          meterWidth: '25%',
        };
      case 'medium':
        return {
          label: 'MEDIUM RISK',
          bg: 'bg-amber-950/70 text-amber-400 border-amber-700/60',
          barColor: 'bg-amber-500',
          meterWidth: '50%',
        };
      case 'high':
        return {
          label: 'HIGH DELAY RISK',
          bg: 'bg-rose-950/70 text-rose-400 border-rose-700/60',
          barColor: 'bg-rose-500',
          meterWidth: '78%',
        };
      case 'critical':
        return {
          label: 'CRITICAL RISK',
          bg: 'bg-red-950/80 text-red-400 border-red-700/80 animate-pulse',
          barColor: 'bg-red-600',
          meterWidth: '95%',
        };
    }
  };

  const riskMeta = getRiskBadge(selectedBus.riskLevel);

  return (
    <div className="space-y-6 pb-12">
      {/* Search Header Bar */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white mb-1">Passenger Journey Assistant</h2>
            <p className="text-xs text-slate-400">
              Search government roadways buses by bus number, route, origin, destination or stop name.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. UPSRTC-204, Meerut, Modinagar..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Quick bus pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 mt-3 border-t border-slate-800/80 no-scrollbar">
          <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">Suggested:</span>
          {filteredBuses.slice(0, 6).map((bus) => (
            <button
              key={bus.busId}
              onClick={() => {
                setSelectedBusId(bus.busId);
                setSelectedStop(null);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap border ${
                selectedBus.busId === bus.busId
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/70 font-bold'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {bus.busNumber} ({bus.routeId.split('-')[1]?.toUpperCase() || 'UP'})
            </button>
          ))}
        </div>
      </section>

      {/* Main Grid: Live Map & Dynamic Delay Risk Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Interactive Live Map */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
                <h3 className="text-sm font-bold text-white">Live Route & Bus Geometry</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Lat: {selectedBus.latitude.toFixed(4)}, Lng: {selectedBus.longitude.toFixed(4)}
              </span>
            </div>

            {/* Interactive Map Component */}
            <InteractiveMap
              buses={buses}
              selectedBus={selectedBus}
              selectedStopId={selectedStop?.id}
              onSelectStop={(stop) => setSelectedStop(stop)}
              heightClass="h-[440px]"
            />

            {/* Selected stop guidance */}
            <div className="mt-3 flex items-center justify-between text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-300 font-medium">
                  {selectedStop ? `Selected Stop: ${selectedStop.name}` : `Target: ${selectedBus.nextStop}`}
                </span>
              </div>
              <span className="text-cyan-400 font-mono font-semibold">
                {selectedStop?.estimatedTime || selectedBus.predictedArrivalTime}
              </span>
            </div>
          </div>

          {/* Early Alerts Section */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Intelligent Early Alerts</h3>
              </div>
              <span className="text-[11px] text-slate-400">Generated by AI Sensor Fusion</span>
            </div>

            {busAlerts.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No active critical alerts on this route corridor.</p>
            ) : (
              <div className="space-y-2">
                {busAlerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                      alert.severity === 'critical'
                        ? 'bg-red-950/40 border-red-800/60 text-red-200'
                        : alert.severity === 'high'
                        ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                        : 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                    }`}
                  >
                    <div className="mt-0.5">
                      {alert.severity === 'critical' || alert.severity === 'high' ? (
                        <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{alert.title}</span>
                        <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Dynamic ETA, Delay Risk Meter, Bus Details */}
        <div className="lg:col-span-5 space-y-4">
          {/* Dynamic ETA Hero Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 tracking-wider">
                  DYNAMIC ETA PREDICTION
                </span>
                <h3 className="text-xl font-black text-white font-mono">{selectedBus.busNumber}</h3>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${riskMeta.bg}`}>
                {riskMeta.label}
              </span>
            </div>

            {/* ETA Primary Highlight */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
              <div>
                <p className="text-xs text-slate-400 font-medium">Dynamic ETA</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-extrabold text-cyan-400 font-mono">
                    {selectedBus.etaMinutes}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">min</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Arriving in {selectedBus.etaMinutes} min</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium">Predicted Arrival</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-white font-mono">
                    {selectedBus.predictedArrivalTime}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Scheduled: <span className="line-through text-slate-600">{selectedBus.baseArrivalTime}</span>
                </p>
              </div>
            </div>

            {/* Delay Risk Meter */}
            <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/70">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white uppercase tracking-wide">Delay Risk Meter</span>
                <span className="font-mono font-extrabold text-rose-400">
                  {selectedBus.delayProbability}% Probability
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${riskMeta.barColor}`}
                  style={{ width: `${selectedBus.delayProbability}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Predicted Delay</span>
                  <span className="text-base font-extrabold text-rose-400 font-mono">
                    +{selectedBus.predictedDelayMinutes} min
                  </span>
                </div>
                <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Risk Score</span>
                  <span className="text-base font-extrabold text-amber-400 font-mono">
                    {selectedBus.riskScore} / 10.0
                  </span>
                </div>
              </div>

              {/* Reason Explanation */}
              <div className="bg-slate-900/70 p-2.5 rounded-lg border border-slate-800/60 text-xs text-slate-300">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Delay Reason</span>
                <p className="italic text-slate-300">“{selectedBus.reason}”</p>
              </div>
            </div>

            {/* Bus Operational Details */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Operational Telemetry</h4>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Current Speed</span>
                  <span className="text-sm font-bold text-white font-mono">{selectedBus.speed} km/h</span>
                  <span className="text-[10px] text-slate-500 block">Limit: {selectedBus.speedLimit} km/h</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Traffic Density</span>
                  <span className="text-sm font-bold text-white font-mono">{selectedBus.trafficDensity}%</span>
                  <span className="text-[10px] text-slate-500 block">Live Roadway Index</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Current Stop</span>
                  <span className="text-xs font-semibold text-slate-200 truncate block">{selectedBus.currentStop}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Next Stop</span>
                  <span className="text-xs font-semibold text-cyan-400 truncate block">{selectedBus.nextStop}</span>
                  <span className="text-[10px] text-slate-500 block">{selectedBus.nextStopDistanceKm} km away</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 col-span-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400 text-[10px]">Passenger Occupancy</span>
                    <span className="font-mono font-bold text-slate-200">
                      {selectedBus.passengersCount} / {selectedBus.capacity} ({selectedBus.occupancyPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${selectedBus.occupancyPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick simulation tester for competition demo */}
            <div className="bg-cyan-950/30 border border-cyan-800/40 p-3 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                Live Demonstration Scenario Trigger
              </span>
              <p className="text-[11px] text-slate-300">
                Observe how Dynamic ETA and Delay Probability update immediately when conditions worsen:
              </p>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  onClick={() => triggerScenarioForSelectedBus('normal')}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold border ${
                    activeScenario === 'normal'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Normal Flow
                </button>
                <button
                  onClick={() => triggerScenarioForSelectedBus('heavy_congestion')}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold border ${
                    activeScenario === 'heavy_congestion'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Congestion
                </button>
                <button
                  onClick={() => triggerScenarioForSelectedBus('accident_ahead')}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold border ${
                    activeScenario === 'accident_ahead'
                      ? 'bg-rose-500 text-slate-950 border-rose-400 font-bold'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Accident
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
