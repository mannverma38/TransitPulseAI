import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { EarlyAlert } from '../../types/transit';
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Trash2,
  Volume2,
  Filter,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AlertsView: React.FC = () => {
  const { alerts, dismissAlert, selectedCity, setSelectedCity } = useTransit();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredAlerts = alerts.filter((a) => {
    const matchCity = selectedCity === 'all' || a.city === selectedCity || a.city === 'all';
    const matchSeverity = filterSeverity === 'all' || a.severity === filterSeverity;
    return matchCity && matchSeverity;
  });

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertOctagon className="w-5 h-5 text-red-400 flex-shrink-0 animate-pulse" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-950 text-red-400 border-red-800 animate-pulse';
      case 'high':
        return 'bg-rose-950 text-rose-400 border-rose-800';
      case 'warning':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      default:
        return 'bg-cyan-950 text-cyan-400 border-cyan-800';
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-950/80 border border-amber-800/60 px-3 py-1 rounded-full text-xs font-semibold text-amber-400 mb-3">
            <Bell className="w-3.5 h-3.5" />
            <span>Autonomous Incident Notification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Early Warning Alert Center
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            AI-synthesized notifications alerting commuters and transit operations teams before severe bottlenecks materialize.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-2">
          {(['all', 'warning', 'high', 'critical'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border ${
                filterSeverity === sev
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-850'
              }`}
            >
              {sev === 'all' ? 'All Alerts' : sev}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-400">
          {filteredAlerts.length} Active System Advisories
        </span>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">All Clear Across Monitored Corridors</h3>
            <p className="text-xs text-slate-400 mt-1">
              No active delay anomalies or critical bottlenecks detected.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border shadow-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                alert.severity === 'critical'
                  ? 'bg-red-950/30 border-red-800/80'
                  : alert.severity === 'high'
                  ? 'bg-rose-950/30 border-rose-800/80'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5">{getAlertIcon(alert.severity)}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">{alert.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      Bus: {alert.busNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono pt-1">
                    <span>Route: {alert.route}</span>
                    <span>City: {alert.city.toUpperCase()}</span>
                    <span>Generated: {alert.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                  title="Dismiss alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
