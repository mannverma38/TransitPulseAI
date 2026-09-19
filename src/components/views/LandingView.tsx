import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { CITIES } from '../../data/mockTransitData';
import {
  Navigation,
  Activity,
  Cpu,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Zap,
  MapPin,
  Radio,
  Clock,
  Sparkles,
  BarChart3,
  TrendingUp,
} from 'lucide-react';

export const LandingView: React.FC = () => {
  const { buses, selectedCity, setActiveTab, setSelectedBusId, setIsTourOpen } = useTransit();

  // Statistics
  const totalBuses = buses.length;
  const onTimeCount = buses.filter((b) => b.riskLevel === 'low').length;
  const highRiskCount = buses.filter((b) => b.riskLevel === 'high' || b.riskLevel === 'critical').length;
  const citiesCount = CITIES.length;

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        {/* Glow ambient decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 bg-cyan-950/70 border border-cyan-800/60 px-3.5 py-1.5 rounded-full text-xs font-semibold text-cyan-400 mb-6 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Track. Predict. Alert. Move Smarter.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight mb-4 font-sans">
            From Reactive Tracking to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
              Predictive Public Transport
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl">
            Track government roadways buses in real time, predict future delays before they happen using machine
            learning, and receive intelligent early warnings for congestion, accidents, and route disruptions.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 mb-10">
            <button
              onClick={() => setActiveTab('my_bus')}
              className="flex items-center gap-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 hover:scale-[1.02]"
            >
              <Navigation className="w-4 h-4 text-slate-950" />
              <span>Track My Bus</span>
              <ArrowRight className="w-4 h-4 text-slate-950 ml-1" />
            </button>

            <button
              onClick={() => setActiveTab('live_tracking')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 font-semibold px-5 py-3.5 rounded-xl text-sm transition-all hover:border-slate-600"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>View Live Map</span>
            </button>

            <button
              onClick={() => setActiveTab('fleet_dashboard')}
              className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-850 text-slate-300 border border-slate-800 font-medium px-5 py-3.5 rounded-xl text-sm transition-all"
            >
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>Admin Dashboard</span>
            </button>
          </div>

          {/* Key Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/70">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{totalBuses * 3}</span>
              <p className="text-xs text-slate-400 mt-1 font-medium">Active Buses (Fleet)</p>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/70">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                {Math.round((onTimeCount / totalBuses) * 100)}%
              </span>
              <p className="text-xs text-slate-400 mt-1 font-medium">Buses On Time</p>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/70">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">{highRiskCount}</span>
              <p className="text-xs text-slate-400 mt-1 font-medium">High Risk Corridors</p>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/70">
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">{citiesCount}</span>
              <p className="text-xs text-slate-400 mt-1 font-medium">Cities Connected</p>
            </div>
          </div>
        </div>
      </section>

      {/* Central Innovation Banner */}
      <section className="bg-gradient-to-r from-cyan-950/50 via-slate-900 to-indigo-950/50 rounded-2xl border border-cyan-800/40 p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase font-extrabold text-cyan-400 tracking-widest font-mono">
            Core Technological Innovation
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            “Existing GPS systems tell <span className="underline decoration-cyan-500">WHERE</span> the bus is.{' '}
            <br className="hidden sm:inline" />
            TransitPulse AI predicts <span className="text-cyan-400 underline decoration-cyan-400">WHAT MAY HAPPEN NEXT</span>.”
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-3 text-xs sm:text-sm font-mono font-bold text-slate-200">
            <span className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-lg">CURRENT LOCATION</span>
            <span className="text-cyan-400">+</span>
            <span className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-lg">TRAFFIC DATA</span>
            <span className="text-cyan-400">+</span>
            <span className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-lg">HISTORICAL PATTERNS</span>
            <span className="text-cyan-400">+</span>
            <span className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-lg text-cyan-300">AI PREDICTION</span>
            <span className="text-cyan-400">=</span>
            <span className="bg-gradient-to-r from-rose-500 to-red-600 text-white px-3.5 py-1.5 rounded-lg shadow-md">
              FUTURE DELAY RISK
            </span>
          </div>
        </div>
      </section>

      {/* Feature Navigation Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">Interactive Platform Modules</h3>
          <span className="text-xs text-slate-400">Competition Demo Ready</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: What-If Simulator */}
          <div
            onClick={() => setActiveTab('what_if')}
            className="group cursor-pointer bg-slate-900/70 hover:bg-slate-850 p-6 rounded-2xl border border-slate-800 hover:border-cyan-600/50 transition-all shadow-lg hover:scale-[1.01]"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Sliders className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                What-If Traffic Simulator
              </h4>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.5 rounded font-bold">
                KEY INNOVATION
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Simulate Normal Traffic, Heavy Congestion, Accident Ahead, and Road Blockages with real-time ETA delta
              recalculations and dynamic risk meter animations.
            </p>
            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
              Launch Simulator <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 2: AI Delay Prediction Engine */}
          <div
            onClick={() => setActiveTab('ai_prediction')}
            className="group cursor-pointer bg-slate-900/70 hover:bg-slate-850 p-6 rounded-2xl border border-slate-800 hover:border-blue-600/50 transition-all shadow-lg hover:scale-[1.01]"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-700/50 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                AI Prediction Engine
              </h4>
              <span className="text-[10px] font-mono bg-blue-950 text-blue-400 border border-blue-800 px-1.5 py-0.5 rounded font-bold">
                ML CORE
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Inspect multi-variable features (GPS, speed deficit, traffic density, historical patterns) with
              transparent probability confidence scores and Scikit-learn architecture.
            </p>
            <span className="text-xs font-semibold text-blue-400 flex items-center gap-1">
              Explore Model Architecture <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 3: Physical Hardware Integration */}
          <div
            onClick={() => setActiveTab('hardware')}
            className="group cursor-pointer bg-slate-900/70 hover:bg-slate-850 p-6 rounded-2xl border border-slate-800 hover:border-emerald-600/50 transition-all shadow-lg hover:scale-[1.01]"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Radio className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                ESP32 + GPS Hardware
              </h4>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-bold">
                IoT VLT
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Real-time telemetry pipeline connecting ESP32 microcontroller, NEO-6M GPS module, and 4G LTE transceiver
              into cloud FastAPI endpoints with AIS-140 compliance.
            </p>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              View Hardware Stream <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* Featured Buses Live Preview */}
      <section className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Live Government Fleet Spotlight</h3>
            <p className="text-xs text-slate-400">Click any bus to jump straight into Passenger Tracking view</p>
          </div>
          <button
            onClick={() => setActiveTab('live_tracking')}
            className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
          >
            View All ({buses.length}) <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {buses.slice(0, 3).map((bus) => (
            <div
              key={bus.busId}
              onClick={() => {
                setSelectedBusId(bus.busId);
                setActiveTab('my_bus');
              }}
              className="cursor-pointer bg-slate-950/80 hover:bg-slate-850 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-white group-hover:text-cyan-400 text-sm">
                  {bus.busNumber}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    bus.riskLevel === 'low'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : bus.riskLevel === 'medium'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {bus.riskLevel} Risk
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium truncate mb-2">{bus.routeName}</p>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-850">
                <span>ETA: <strong className="text-cyan-400">{bus.etaMinutes} min</strong></span>
                <span>Speed: <strong className="text-slate-200">{bus.speed} km/h</strong></span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
