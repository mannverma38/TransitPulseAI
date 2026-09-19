import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { CITIES } from '../data/mockTransitData';
import { CityId, ScenarioType } from '../types/transit';
import {
  Activity,
  MapPin,
  Play,
  Pause,
  Compass,
  Bell,
  Sparkles,
  Zap,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    selectedCity,
    setSelectedCity,
    activeScenario,
    triggerScenarioForSelectedBus,
    simulationRunning,
    setSimulationRunning,
    alerts,
    setActiveTab,
    setIsTourOpen,
  } = useTransit();

  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [scenarioDropdownOpen, setScenarioDropdownOpen] = useState(false);

  const activeCityInfo = CITIES.find((c) => c.id === selectedCity) || CITIES[0];
  const unreadAlertsCount = alerts.filter((a) => !a.acknowledged).length;

  const scenarioLabels: Record<ScenarioType, { label: string; color: string }> = {
    normal: { label: 'Normal Traffic', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
    heavy_congestion: { label: 'Heavy Congestion', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
    accident_ahead: { label: 'Accident Ahead', color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
    road_blockage: { label: 'Road Blockage', color: 'bg-red-500/20 text-red-400 border-red-500/40' },
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Tagline */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg lg:text-xl font-extrabold tracking-tight text-white font-sans">
                Transit<span className="text-cyan-400">Pulse</span> <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-700/50 px-1.5 py-0.5 rounded">AI</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide font-medium hidden sm:block">
              “Track. Predict. Alert. Move Smarter.”
            </p>
          </div>
        </div>

        {/* Action Controls & City Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* City Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setCityDropdownOpen(!cityDropdownOpen);
                setScenarioDropdownOpen(false);
              }}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-sm"
              title="Select City"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold">{activeCityInfo.name}</span>
              <span className="text-slate-500 text-xs hidden md:inline">({activeCityInfo.activeBusCount} buses)</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {cityDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Select Roadways Network
                </div>
                {CITIES.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      setSelectedCity(city.id as CityId);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                      selectedCity === city.id
                        ? 'bg-cyan-950/60 text-cyan-300 font-semibold border-l-2 border-cyan-400'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <span className="block font-medium">{city.name}</span>
                      <span className="text-[10px] text-slate-500">{city.state}</span>
                    </div>
                    <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                      {city.activeBusCount}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Scenario Trigger Quick Switch */}
          <div className="relative hidden md:block">
            <button
              onClick={() => {
                setScenarioDropdownOpen(!scenarioDropdownOpen);
                setCityDropdownOpen(false);
              }}
              className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${scenarioLabels[activeScenario].color}`}
              title="Simulate Real-Time Traffic Conditions"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Scenario: {scenarioLabels[activeScenario].label}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {scenarioDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Simulate Incident / Traffic
                </div>
                {(['normal', 'heavy_congestion', 'accident_ahead', 'road_blockage'] as ScenarioType[]).map((sc) => (
                  <button
                    key={sc}
                    onClick={() => {
                      triggerScenarioForSelectedBus(sc);
                      setScenarioDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors my-0.5 ${
                      activeScenario === sc
                        ? 'bg-cyan-950/70 text-cyan-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{scenarioLabels[sc].label}</span>
                      {activeScenario === sc && <span className="text-[10px] text-cyan-400 font-mono">ACTIVE</span>}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {sc === 'normal' && 'Nominal speed & schedule.'}
                      {sc === 'heavy_congestion' && '+8 to +14 min predicted delay.'}
                      {sc === 'accident_ahead' && '+20 min bottleneck & lane block.'}
                      {sc === 'road_blockage' && '+35 min critical reroute alert.'}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Simulation Play / Pause */}
          <button
            onClick={() => setSimulationRunning(!simulationRunning)}
            className={`p-2 rounded-xl border text-xs font-medium transition-all ${
              simulationRunning
                ? 'bg-slate-900 text-emerald-400 border-slate-800 hover:bg-slate-800'
                : 'bg-amber-950/30 text-amber-400 border-amber-800 hover:bg-amber-900/40'
            }`}
            title={simulationRunning ? 'Pause GPS Simulation' : 'Resume Live GPS Simulation'}
          >
            {simulationRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Alerts Bell */}
          <button
            onClick={() => setActiveTab('alerts')}
            className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 transition-colors"
            title="Early Alerts Center"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Competition Demo Tour Button */}
          <button
            onClick={() => setIsTourOpen(true)}
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-md shadow-cyan-500/25 transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Demo Flow (18 Steps)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
