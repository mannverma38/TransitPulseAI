import React, { useState, useMemo } from 'react';
import { useTransit } from '../../context/TransitContext';
import { CORRIDOR_HEATMAP_DATA, CITIES } from '../../data/mockTransitData';
import { CityId, DelayRiskLevel } from '../../types/transit';
import {
  Flame,
  Filter,
  MapPin,
  Clock,
  Gauge,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const TrafficHeatmapView: React.FC = () => {
  const { selectedCity, setSelectedCity } = useTransit();
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('all');

  // Filtered heatmap segments
  const filteredCorridors = useMemo(() => {
    return CORRIDOR_HEATMAP_DATA.filter((c) => {
      const matchCity = selectedCity === 'all' || c.city === selectedCity;
      const matchRisk = selectedRiskFilter === 'all' || c.riskLevel === selectedRiskFilter;
      const matchTime = selectedTimeSlot === 'all' || c.timeSlot === selectedTimeSlot;
      return matchCity && matchRisk && matchTime;
    });
  }, [selectedCity, selectedRiskFilter, selectedTimeSlot]);

  const getRiskBadge = (risk: DelayRiskLevel) => {
    switch (risk) {
      case 'low':
        return 'bg-emerald-950 text-emerald-400 border-emerald-700/60';
      case 'medium':
        return 'bg-amber-950 text-amber-400 border-amber-700/60';
      case 'high':
        return 'bg-rose-950 text-rose-400 border-rose-700/60';
      case 'critical':
        return 'bg-red-950 text-red-400 border-red-700/80 animate-pulse';
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-rose-950/80 border border-rose-800/60 px-3 py-1 rounded-full text-xs font-semibold text-rose-400 mb-3">
            <Flame className="w-3.5 h-3.5" />
            <span>Corridor Risk Visualization</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            City-Wide Traffic Risk Heatmap
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Dynamic congestion indexing across interstate highways, junction bottlenecks, and urban arterial roadway corridors.
          </p>
        </div>
      </section>

      {/* Filter Control Bar (City, Route, Time, Risk Level) */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Heatmap Filter Matrix</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* City Filter */}
          <div>
            <label className="text-[11px] text-slate-400 font-semibold block mb-1">Target City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value as CityId)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
          </div>

          {/* Time Slot Filter */}
          <div>
            <label className="text-[11px] text-slate-400 font-semibold block mb-1">Time Profile</label>
            <select
              value={selectedTimeSlot}
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Time Slots</option>
              <option value="morning_peak">Morning Peak (08:00 - 11:30)</option>
              <option value="afternoon_normal">Afternoon Normal (12:00 - 16:30)</option>
              <option value="evening_rush">Evening Rush (17:00 - 21:30)</option>
              <option value="late_night">Late Night (22:00 - 06:00)</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <label className="text-[11px] text-slate-400 font-semibold block mb-1">Risk Severity</label>
            <select
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk (Green)</option>
              <option value="medium">Medium Risk (Amber)</option>
              <option value="high">High Risk (Rose)</option>
              <option value="critical">Critical Risk (Crimson)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Visual Heatmap Canvas Mock */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-base font-bold text-white">Spatial Risk Density Map</h3>
            <p className="text-xs text-slate-400">Color gradient indicates live and predicted corridor congestion factor</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Low</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Medium</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> High</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block animate-pulse" /> Critical</span>
          </div>
        </div>

        {/* Heatmap Graphic Viewport */}
        <div className="relative h-72 w-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-6">
          <svg className="w-full h-full" viewBox="0 0 800 240">
            {/* Ambient heat gradient blobs */}
            <circle cx="200" cy="110" r="70" fill="#10b981" fillOpacity="0.2" filter="blur(25px)" />
            <circle cx="380" cy="130" r="85" fill="#f59e0b" fillOpacity="0.25" filter="blur(30px)" />
            <circle cx="560" cy="90" r="95" fill="#f43f5e" fillOpacity="0.3" filter="blur(35px)" />
            <circle cx="680" cy="150" r="60" fill="#e11d48" fillOpacity="0.35" filter="blur(25px)" />

            {/* Simulated Road Arteries */}
            <path d="M 60,180 Q 220,160 380,120 T 720,80" fill="none" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
            <path d="M 60,180 Q 220,160 380,120 T 720,80" fill="none" stroke="#f43f5e" strokeWidth="5" strokeDasharray="12, 6" />

            <path d="M 120,50 Q 320,140 500,180 T 760,190" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
            <path d="M 120,50 Q 320,140 500,180 T 760,190" fill="none" stroke="#10b981" strokeWidth="3" />

            {/* Junction Hotspots */}
            <circle cx="380" cy="120" r="9" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
            <text x="380" y="105" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="700">Modinagar Toll (8.4/10)</text>

            <circle cx="560" cy="95" r="11" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
            <text x="560" y="78" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="700">Mohan Nagar Flyover (9.1/10)</text>
          </svg>
        </div>
      </section>

      {/* Corridor Breakdown Cards */}
      <section className="space-y-3">
        <h3 className="text-base font-bold text-white">Corridor Congestion Directory ({filteredCorridors.length} Sectors)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCorridors.map((c) => (
            <div
              key={c.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">{c.corridorName}</h4>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRiskBadge(c.riskLevel)}`}>
                  {c.riskLevel.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 block">RISK SCORE</span>
                  <span className="font-mono font-bold text-amber-400">{c.congestionScore} / 10</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 block">AVG SPEED</span>
                  <span className="font-mono font-bold text-slate-200">{c.currentSpeedKmH} km/h</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-850">
                  <span className="text-[10px] text-slate-500 block">TIME SLOT</span>
                  <span className="font-mono font-bold text-cyan-400 capitalize">{c.timeSlot.replace('_', ' ')}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 italic">
                “{c.bottleneckReason}”
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
