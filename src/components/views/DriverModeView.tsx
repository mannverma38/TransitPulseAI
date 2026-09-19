import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import {
  AlertTriangle,
  ShieldCheck,
  Ban,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Compass,
  Gauge,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const DriverModeView: React.FC = () => {
  const { selectedBus, activeScenario, triggerScenarioForSelectedBus } = useTransit();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  // Driver mode warnings
  const getDriverWarning = () => {
    switch (activeScenario) {
      case 'heavy_congestion':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-amber-400 animate-bounce" />,
          title: '⚠ CONGESTION AHEAD',
          subtitle: 'Heavy queuing reported on NH-58 near Modinagar.',
          bg: 'bg-amber-950/80 border-amber-500 text-amber-100',
        };
      case 'accident_ahead':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-rose-400 animate-bounce" />,
          title: '⚠ ACCIDENT / LANE BLOCK AHEAD',
          subtitle: 'Caution: Slow down to 20 km/h. Emergency crews on site.',
          bg: 'bg-rose-950/80 border-rose-500 text-rose-100',
        };
      case 'road_blockage':
        return {
          icon: <Ban className="w-8 h-8 text-red-500 animate-pulse" />,
          title: '🚧 ROADBLOCK AHEAD',
          subtitle: 'Advisory: Prepare to divert via Eastern Peripheral Expressway.',
          bg: 'bg-red-950/90 border-red-500 text-red-100 animate-pulse',
        };
      default:
        return {
          icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
          title: 'MAINTAIN SCHEDULE',
          subtitle: 'All sectors green. Proceed safely at designated cruise speed.',
          bg: 'bg-emerald-950/60 border-emerald-600/60 text-emerald-100',
        };
    }
  };

  const warning = getDriverWarning();

  const playTone = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // Ignore if audio is restricted by browser policy
    }
  };

  return (
    <div className={`space-y-6 pb-16 transition-colors duration-200 ${highContrast ? 'bg-black p-4 rounded-3xl' : ''}`}>
      {/* HUD Header Bar */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-3.5 w-3.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase">
            DRIVER CABIN HUD (DISTRACTION FREE)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playTone();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5"
            title="Audio Alert Tone"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Audio Alert ON' : 'Muted'}</span>
          </button>

          <button
            onClick={() => setHighContrast(!highContrast)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5"
            title="Toggle High Contrast Night HUD"
          >
            {highContrast ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
            <span className="hidden sm:inline">{highContrast ? 'Night Mode' : 'Standard'}</span>
          </button>
        </div>
      </div>

      {/* Prominent Driver Warning Card */}
      <section
        className={`p-6 sm:p-8 rounded-3xl border-2 shadow-2xl transition-all ${warning.bg}`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex-shrink-0">
            {warning.icon}
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest opacity-80 block">Active Road Advisory</span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">{warning.title}</h2>
            <p className="text-sm sm:text-base opacity-90 mt-1">{warning.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Primary HUD Readouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* BUS & ROUTE */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">BUS</span>
          <p className="text-3xl font-black text-white font-mono">{selectedBus.busNumber}</p>
          <div className="pt-2 border-t border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase block">ROUTE</span>
            <p className="text-lg font-bold text-cyan-400">{selectedBus.routeName}</p>
          </div>
        </div>

        {/* NEXT STOP */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">NEXT STOP</span>
          <p className="text-3xl font-black text-white">{selectedBus.nextStop}</p>
          <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400 font-mono">
            <span>Distance: <strong className="text-slate-200">{selectedBus.nextStopDistanceKm} km</strong></span>
            <span>Arrival: <strong className="text-cyan-400">{selectedBus.predictedArrivalTime}</strong></span>
          </div>
        </div>

        {/* TRAFFIC & DELAY RISK */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">TRAFFIC</span>
            <span
              className={`text-xs font-mono font-extrabold uppercase px-2.5 py-1 rounded-lg border ${
                selectedBus.trafficDensity > 75
                  ? 'bg-red-950 text-red-400 border-red-800'
                  : selectedBus.trafficDensity > 50
                  ? 'bg-amber-950 text-amber-400 border-amber-800'
                  : 'bg-emerald-950 text-emerald-400 border-emerald-800'
              }`}
            >
              {selectedBus.trafficDensity > 75 ? 'HEAVY' : selectedBus.trafficDensity > 50 ? 'MODERATE' : 'CLEAR'}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-800">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase block">DELAY RISK</span>
              <p
                className={`text-xl font-black uppercase font-mono ${
                  selectedBus.riskLevel === 'high' || selectedBus.riskLevel === 'critical'
                    ? 'text-rose-400'
                    : selectedBus.riskLevel === 'medium'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {selectedBus.riskLevel.toUpperCase()}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-slate-400 uppercase block">PREDICTED DELAY</span>
              <p className="text-2xl font-black text-rose-400 font-mono">
                +{selectedBus.predictedDelayMinutes} min
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Speed & Compliance Gauge */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <Gauge className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase block">CURRENT SPEED</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white font-mono">{selectedBus.speed}</span>
                <span className="text-sm font-bold text-slate-400">km/h</span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  SPEED LIMIT: {selectedBus.speedLimit} km/h
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono space-y-1 sm:text-right">
            <div>Driver: <strong className="text-slate-200">{selectedBus.driverName}</strong></div>
            <div>GPS Satellite Lock: <strong className="text-emerald-400">11 Birds (AIS-140 Live)</strong></div>
          </div>
        </div>
      </section>

      {/* Scenario switcher inside Driver Mode for demo */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Driver Cockpit Simulation Tester:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              triggerScenarioForSelectedBus('normal');
              playTone();
            }}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold"
          >
            Normal
          </button>
          <button
            onClick={() => {
              triggerScenarioForSelectedBus('heavy_congestion');
              playTone();
            }}
            className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-lg font-semibold"
          >
            Congestion
          </button>
          <button
            onClick={() => {
              triggerScenarioForSelectedBus('road_blockage');
              playTone();
            }}
            className="px-3 py-1 bg-red-950 text-red-300 border border-red-800 rounded-lg font-semibold"
          >
            Roadblock
          </button>
        </div>
      </div>
    </div>
  );
};
