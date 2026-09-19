import React, { useState, useMemo } from 'react';
import { useTransit } from '../../context/TransitContext';
import { BusTelemetry, DelayRiskLevel } from '../../types/transit';
import {
  Bus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Gauge,
  MapPin,
  X,
  Radio,
  Users,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const BusManagementView: React.FC = () => {
  const { buses, selectedBus, setSelectedBusId, setActiveTab } = useTransit();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [detailedBusModal, setDetailedBusModal] = useState<BusTelemetry | null>(null);

  // Filtering
  const filteredBuses = useMemo(() => {
    return buses.filter((b) => {
      const matchFilter =
        filterStatus === 'all'
          ? true
          : filterStatus === 'on_time'
          ? b.status === 'on_time'
          : filterStatus === 'delayed'
          ? b.status === 'delayed'
          : filterStatus === 'high_risk'
          ? b.status === 'high_risk'
          : filterStatus === 'critical'
          ? b.status === 'critical'
          : true;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.busNumber.toLowerCase().includes(q) ||
        b.routeName.toLowerCase().includes(q) ||
        b.driverName.toLowerCase().includes(q);

      return matchFilter && matchSearch;
    });
  }, [buses, filterStatus, searchQuery]);

  const getStatusBadge = (status: string, risk: DelayRiskLevel) => {
    switch (risk) {
      case 'low':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'medium':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'high':
        return 'bg-rose-950 text-rose-400 border-rose-800';
      case 'critical':
        return 'bg-red-950 text-red-400 border-red-800 animate-pulse';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Bus Fleet Management</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Monitor real-time GPS coordinates, driver duty rosters, telemetry health, and predicted delays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-slate-950 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl">
            {filteredBuses.length} Vehicles Displayed
          </span>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['all', 'on_time', 'delayed', 'high_risk', 'critical'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all border ${
                filterStatus === st
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-white'
              }`}
            >
              {st === 'all' && 'All Vehicles'}
              {st === 'on_time' && 'On Time'}
              {st === 'delayed' && 'Delayed'}
              {st === 'high_risk' && 'High Risk'}
              {st === 'critical' && 'Critical'}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bus, route, driver..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </section>

      {/* Fleet Table */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-3.5 px-4">Bus Number</th>
                <th className="py-3.5 px-4">Route</th>
                <th className="py-3.5 px-4">Current Stop</th>
                <th className="py-3.5 px-4">Speed</th>
                <th className="py-3.5 px-4">Traffic</th>
                <th className="py-3.5 px-4">Dynamic ETA</th>
                <th className="py-3.5 px-4">Risk Score</th>
                <th className="py-3.5 px-4">Predicted Delay</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredBuses.map((bus) => (
                <tr
                  key={bus.busId}
                  className="hover:bg-slate-850/50 transition-colors cursor-pointer group"
                  onClick={() => setDetailedBusModal(bus)}
                >
                  <td className="py-3 px-4 font-mono font-bold text-white flex items-center gap-2">
                    <Bus className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{bus.busNumber}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-[200px] truncate">{bus.routeName}</td>
                  <td className="py-3 px-4 text-slate-400">{bus.currentStop}</td>
                  <td className="py-3 px-4 font-mono text-slate-200">{bus.speed} km/h</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{bus.trafficDensity}%</td>
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{bus.etaMinutes} min</td>
                  <td className="py-3 px-4 font-mono text-amber-400">{bus.riskScore}</td>
                  <td className="py-3 px-4 font-mono font-bold text-rose-400">+{bus.predictedDelayMinutes} min</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(bus.status, bus.riskLevel)}`}>
                      {bus.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBusId(bus.busId);
                        setActiveTab('my_bus');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-slate-700 font-semibold transition-colors text-[11px]"
                    >
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bus Details Drawer / Modal */}
      {detailedBusModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-cyan-400">
                  VEHICLE TELEMETRY PROFILE
                </span>
                <h3 className="text-2xl font-black text-white font-mono">{detailedBusModal.busNumber}</h3>
              </div>
              <button
                onClick={() => setDetailedBusModal(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">OPERATOR DEPOT</span>
                <strong className="text-slate-200">{detailedBusModal.operator}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">DRIVER</span>
                <strong className="text-slate-200">{detailedBusModal.driverName}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">DRIVER CONTACT</span>
                <strong className="text-slate-200 font-mono">{detailedBusModal.driverPhone}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">GPS COORDINATES</span>
                <strong className="text-cyan-400 font-mono">
                  {detailedBusModal.latitude.toFixed(4)}, {detailedBusModal.longitude.toFixed(4)}
                </strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">OCCUPANCY</span>
                <strong className="text-slate-200">
                  {detailedBusModal.passengersCount} / {detailedBusModal.capacity} ({detailedBusModal.occupancyPercent}%)
                </strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">AIS-140 PING RATE</span>
                <strong className="text-emerald-400 font-mono">1.0 Hz (Every 1s)</strong>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Corridor Assessment</span>
              <p className="italic text-slate-300">“{detailedBusModal.reason}”</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setDetailedBusModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedBusId(detailedBusModal.busId);
                  setDetailedBusModal(null);
                  setActiveTab('my_bus');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md"
              >
                Open Live Passenger View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
