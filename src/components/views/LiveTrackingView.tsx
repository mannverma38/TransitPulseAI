import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { InteractiveMap } from '../InteractiveMap';
import { BusStop } from '../../types/transit';
import {
  MapPin,
  Bus,
  Gauge,
  Clock,
  AlertTriangle,
  ChevronRight,
  Filter,
  Navigation,
  Compass,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const LiveTrackingView: React.FC = () => {
  const { buses, selectedBus, setSelectedBusId, setActiveTab } = useTransit();
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);

  return (
    <div className="space-y-6 pb-16">
      {/* Header Bar */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping inline-block" />
            <h2 className="text-lg font-bold text-white">Live Roadways GPS Tracking</h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time coordinate pings from onboard AIS-140 GPS transceivers. Select any bus to view route geometry and stop progression.
          </p>
        </div>

        {/* Selected Bus Quick Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Tracking:</span>
          <select
            value={selectedBus.busId}
            onChange={(e) => {
              setSelectedBusId(e.target.value);
              setSelectedStop(null);
            }}
            className="bg-slate-950 border border-slate-700 text-white text-xs font-mono font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            {buses.map((b) => (
              <option key={b.busId} value={b.busId}>
                {b.busNumber} — {b.routeName}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Main Map + Route Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{selectedBus.routeName}</span>
                <span className="font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {selectedBus.busNumber}
                </span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 font-mono">
                <span>Speed: <strong className="text-slate-200">{selectedBus.speed} km/h</strong></span>
                <span>Traffic: <strong className="text-amber-400">{selectedBus.trafficDensity}%</strong></span>
              </div>
            </div>

            <InteractiveMap
              buses={buses}
              selectedBus={selectedBus}
              selectedStopId={selectedStop?.id}
              onSelectStop={(s) => setSelectedStop(s)}
              heightClass="h-[480px]"
            />
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs">
              <span className="text-slate-400 block font-medium">Want passenger-specific dynamic arrival calculations?</span>
              <span className="text-cyan-400 font-semibold">Switch to Passenger Journey View with custom stop selection.</span>
            </div>
            <button
              onClick={() => setActiveTab('my_bus')}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <span>Passenger Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Route Stops Timeline (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
              CORRIDOR STOP TIMELINE
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">Route Stops & Timetable</h3>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {selectedBus.routeStops?.map((stop, index) => {
              const isSelected = selectedStop?.id === stop.id;
              const isNextStop = selectedBus.nextStop.toLowerCase().includes(stop.name.toLowerCase());
              return (
                <div
                  key={stop.id}
                  onClick={() => setSelectedStop(stop)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950'
                      : isNextStop
                      ? 'bg-slate-850/80 border-cyan-700/60'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col items-center mt-1">
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        isNextStop
                          ? 'bg-cyan-400 border-white animate-ping'
                          : isSelected
                          ? 'bg-cyan-500 border-cyan-300'
                          : 'bg-slate-700 border-slate-600'
                      }`}
                    />
                    {index < (selectedBus.routeStops?.length || 0) - 1 && (
                      <div className="w-0.5 h-8 bg-slate-800 mt-1" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{stop.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400 font-semibold">{stop.estimatedTime}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                      <span>{stop.distanceKm} km from origin</span>
                      {isNextStop && (
                        <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          NEXT UP
                        </span>
                      )}
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
