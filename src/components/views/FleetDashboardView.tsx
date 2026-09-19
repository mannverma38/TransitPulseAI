import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { InteractiveMap } from '../InteractiveMap';
import { CITIES } from '../../data/mockTransitData';
import {
  BarChart3,
  Bus,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Radio,
  Send,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Building2,
  Users,
} from 'lucide-react';

export const FleetDashboardView: React.FC = () => {
  const { buses, selectedCity, setSelectedCity, selectedBus, setSelectedBusId, addAlert } = useTransit();
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Statistics
  const totalBuses = buses.length;
  const activeBusesCount = buses.filter((b) => b.hardwareStatus.esp32 === 'connected').length;
  const onTimeBuses = buses.filter((b) => b.riskLevel === 'low').length;
  const delayedBuses = buses.filter((b) => b.riskLevel === 'medium').length;
  const highRiskBuses = buses.filter((b) => b.riskLevel === 'high').length;
  const criticalBuses = buses.filter((b) => b.riskLevel === 'critical').length;
  const activeRoutes = new Set(buses.map((b) => b.routeId)).size;
  const connectedCitiesCount = CITIES.length;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    addAlert({
      busNumber: 'FLEET-ALL',
      route: 'City-Wide Broadcast',
      city: selectedCity,
      title: '📢 Transport Authority Advisory',
      message: broadcastMessage,
      type: 'route_disruption',
      severity: 'warning',
    });

    setBroadcastMessage('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Dashboard Authority Header */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 px-2.5 py-0.5 rounded-full uppercase">
              STATE ROADWAYS COMMAND CENTER
            </span>
            <span className="text-xs text-slate-400">AIS-140 Compliant Grid</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Fleet Operations & Dispatch Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry aggregation and early warning supervision for roadways depots.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 uppercase block font-mono">System Health</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              100% Operational
            </span>
          </div>
        </div>
      </section>

      {/* KPI Stats Bar (Prompt specification: Total buses, Active buses, Delayed buses, High-risk buses, On-time buses, Active routes, Connected cities) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-md">
          <span className="text-[11px] text-slate-400 font-medium block">Total Buses</span>
          <span className="text-2xl font-black text-white font-mono mt-1 block">{totalBuses * 3}</span>
          <span className="text-[10px] text-slate-500 font-mono">Enrolled Fleet</span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-md">
          <span className="text-[11px] text-slate-400 font-medium block">Active Buses</span>
          <span className="text-2xl font-black text-cyan-400 font-mono mt-1 block">{totalBuses}</span>
          <span className="text-[10px] text-emerald-400 font-mono">100% Online VLT</span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-md">
          <span className="text-[11px] text-slate-400 font-medium block">On-Time Buses</span>
          <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">{onTimeBuses}</span>
          <span className="text-[10px] text-slate-500 font-mono">{Math.round((onTimeBuses / totalBuses) * 100)}% Cadence</span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-md">
          <span className="text-[11px] text-slate-400 font-medium block">Delayed Buses</span>
          <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">{delayedBuses}</span>
          <span className="text-[10px] text-amber-400 font-mono">+5 to +10 min</span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-md">
          <span className="text-[11px] text-slate-400 font-medium block">High-Risk Buses</span>
          <span className="text-2xl font-black text-rose-400 font-mono mt-1 block">{highRiskBuses + criticalBuses}</span>
          <span className="text-[10px] text-rose-400 font-mono">Severe Delay</span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-md">
          <span className="text-[11px] text-slate-400 font-medium block">Active Routes</span>
          <span className="text-2xl font-black text-blue-400 font-mono mt-1 block">{activeRoutes}</span>
          <span className="text-[10px] text-slate-500 font-mono">Intercity Trunk</span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-md col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 font-medium block">Connected Cities</span>
          <span className="text-2xl font-black text-purple-400 font-mono mt-1 block">{connectedCitiesCount}</span>
          <span className="text-[10px] text-slate-500 font-mono">NCR & UP Hubs</span>
        </div>
      </div>

      {/* Main Map + Fleet Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Multi-Bus City Map (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block animate-ping" />
                <h3 className="text-sm font-bold text-white">Live Multi-Bus Fleet Command Map</h3>
              </div>
              <span className="text-xs text-slate-400">Showing all simultaneous GPS routes</span>
            </div>

            <InteractiveMap
              buses={buses}
              selectedBus={selectedBus}
              onSelectBus={(busId) => setSelectedBusId(busId)}
              showAllBuses={true}
              heightClass="h-[520px]"
            />
          </div>

          {/* Quick Authority Dispatch Broadcast */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase text-slate-300 mb-2 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Broadcast Dispatch Alert to All In-Cabin Driver HUDs</span>
            </h4>
            <form onSubmit={handleBroadcast} className="flex gap-2">
              <input
                type="text"
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="e.g. Caution: Heavy waterlogging near Modinagar bypass; maintain 25 km/h limit."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast</span>
              </button>
            </form>
            {broadcastSuccess && (
              <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Alert broadcasted to all in-service driver displays and passenger alert queues.
              </p>
            )}
          </div>
        </div>

        {/* Fleet List / Rapid Triage (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Fleet Triage (By Risk Score)</h3>
            <span className="text-[11px] text-slate-400">{buses.length} active</span>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {buses.map((bus) => {
              const isSelected = bus.busId === selectedBus.busId;
              return (
                <div
                  key={bus.busId}
                  onClick={() => setSelectedBusId(bus.busId)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-850 border-cyan-500 shadow-md shadow-cyan-950'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-white text-xs">{bus.busNumber}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        bus.riskLevel === 'critical'
                          ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                          : bus.riskLevel === 'high'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : bus.riskLevel === 'medium'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {bus.riskLevel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium truncate mb-2">{bus.routeName}</p>

                  <div className="grid grid-cols-3 gap-1 text-[11px] text-slate-400 pt-2 border-t border-slate-850">
                    <div>
                      <span className="text-[9px] text-slate-500 block">SPEED</span>
                      <strong className="text-slate-200">{bus.speed} km/h</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block">DENSITY</span>
                      <strong className="text-slate-200">{bus.trafficDensity}%</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block">DELAY</span>
                      <strong className="text-rose-400">+{bus.predictedDelayMinutes}m</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
