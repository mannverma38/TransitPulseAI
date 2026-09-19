import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { WHAT_IF_SCENARIOS } from '../../data/mockTransitData';
import { ScenarioType, DelayRiskLevel } from '../../types/transit';
import { calculateAIPrediction } from '../../services/aiPredictionEngine';
import {
  Sliders,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Ban,
  Clock,
  TrendingUp,
  Activity,
  ArrowRight,
  Sparkles,
  Zap,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

export const WhatIfSimulatorView: React.FC = () => {
  const { selectedBus, activeScenario, triggerScenarioForSelectedBus } = useTransit();

  // Custom simulation slider states
  const [customDensity, setCustomDensity] = useState<number>(selectedBus.trafficDensity);
  const [customSpeed, setCustomSpeed] = useState<number>(selectedBus.speed);
  const [customWeather, setCustomWeather] = useState<'clear' | 'rain' | 'fog'>('clear');
  const [selectedPreset, setSelectedPreset] = useState<ScenarioType>(activeScenario);

  // Weather multipliers
  const weatherMultipliers = {
    clear: 1.0,
    rain: 1.35,
    fog: 1.2,
  };

  // Run real-time prediction for custom controls
  const customPrediction = calculateAIPrediction({
    busSpeedKmH: customSpeed,
    speedLimitKmH: selectedBus.speedLimit,
    trafficDensityPercent: customDensity,
    historicalCongestionIndex: 0.70,
    timeOfDayHours: 10,
    remainingDistanceKm: 18,
    remainingStopsCount: 3,
    roadConditionMultiplier: weatherMultipliers[customWeather],
    activeScenario: selectedPreset,
  });

  const getScenarioIcon = (id: ScenarioType) => {
    switch (id) {
      case 'normal':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'heavy_congestion':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'accident_ahead':
        return <AlertOctagon className="w-5 h-5 text-rose-400" />;
      case 'road_blockage':
        return <Ban className="w-5 h-5 text-red-500" />;
    }
  };

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

  // Baseline time for ETA demonstration
  const baseMinutes = 20;

  const scenariosList = [
    {
      id: 'normal' as ScenarioType,
      title: 'NORMAL TRAFFIC',
      risk: 'Low',
      riskLevel: 'low' as DelayRiskLevel,
      status: 'On Schedule',
      additionalDelay: '+0 min',
      additionalDelayNumber: 0,
      eta: '10:30 AM',
      density: '35%',
      color: 'emerald',
      description: 'Nominal traffic conditions without bottlenecks.',
    },
    {
      id: 'heavy_congestion' as ScenarioType,
      title: 'HEAVY CONGESTION',
      risk: 'Medium',
      riskLevel: 'medium' as DelayRiskLevel,
      status: 'Moderate Delay',
      additionalDelay: '+8 min',
      additionalDelayNumber: 8,
      eta: '10:38 AM',
      density: '75%',
      color: 'amber',
      description: 'Peak volume queueing at Modinagar junction.',
    },
    {
      id: 'accident_ahead' as ScenarioType,
      title: 'ACCIDENT AHEAD',
      risk: 'High',
      riskLevel: 'high' as DelayRiskLevel,
      status: 'High Delay Risk',
      additionalDelay: '+20 min',
      additionalDelayNumber: 20,
      eta: '10:50 AM',
      density: '88%',
      color: 'rose',
      description: 'Two-lane collision blocking primary carriage-way.',
    },
    {
      id: 'road_blockage' as ScenarioType,
      title: 'ROAD BLOCKAGE',
      risk: 'Critical',
      riskLevel: 'critical' as DelayRiskLevel,
      status: 'Advisory Alert',
      additionalDelay: '+35 min',
      additionalDelayNumber: 35,
      eta: '11:05 AM',
      density: '96%',
      color: 'red',
      description: 'Full blockage; automatic peripheral reroute suggested.',
    },
  ];

  const handleApplyPreset = (sc: ScenarioType) => {
    setSelectedPreset(sc);
    const scData = WHAT_IF_SCENARIOS[sc];
    setCustomDensity(scData.trafficDensity);
    setCustomSpeed(Math.max(10, selectedBus.speedLimit + scData.speedImpactKmH));
    triggerScenarioForSelectedBus(sc);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <section className="relative bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-cyan-950/80 border border-cyan-800/60 px-3 py-1 rounded-full text-xs font-semibold text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Key Innovation Feature</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            What-If Traffic Simulator
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Test and simulate dynamic road condition scenarios to see how AI calculates future delay risk, alters
            dynamic ETA in real time, and triggers automated dispatch advisories.
          </p>
          <div className="flex items-center gap-2 mt-4 text-xs font-mono text-slate-400">
            <span>Simulating Target:</span>
            <span className="font-bold text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              {selectedBus.busNumber} ({selectedBus.routeName})
            </span>
          </div>
        </div>
      </section>

      {/* Preset Scenario Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight">Preset Incident Scenarios</h3>
          <span className="text-xs text-slate-400">Click a card to apply to live bus telemetry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scenariosList.map((sc) => {
            const isSelected = selectedPreset === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => handleApplyPreset(sc.id)}
                className={`relative cursor-pointer rounded-2xl p-5 border transition-all shadow-lg flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/20 shadow-cyan-500/10 scale-[1.02]'
                    : 'bg-slate-950/90 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-700/60 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    ACTIVE
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    {getScenarioIcon(sc.id)}
                    <h4 className="text-xs font-black tracking-wider text-white font-mono uppercase">
                      {sc.title}
                    </h4>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Risk Level:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getRiskBadge(sc.riskLevel)}`}>
                        {sc.risk}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Status:</span>
                      <span className="font-semibold text-slate-200">{sc.status}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Additional Delay:</span>
                      <span className="font-mono font-extrabold text-rose-400 text-sm">{sc.additionalDelay}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Predicted ETA:</span>
                      <span className="font-mono font-bold text-cyan-400">{sc.eta}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <p>{sc.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive What-If Variable Control Deck */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Fine-Grained Variable Playground</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust traffic density, speed deficit, and weather to observe non-linear AI delay prediction reactions.
            </p>
          </div>
          <button
            onClick={() => handleApplyPreset('normal')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors w-fit"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Nominal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sliders Area (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Slider 1: Traffic Density */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Corridor Traffic Density</span>
                <span className="font-mono font-extrabold text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  {customDensity}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={customDensity}
                onChange={(e) => setCustomDensity(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10% (Free Flow)</span>
                <span>50% (Moderate)</span>
                <span>100% (Gridlock)</span>
              </div>
            </div>

            {/* Slider 2: Bus Operating Speed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Observed GPS Speed</span>
                <span className="font-mono font-extrabold text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  {customSpeed} km/h (Limit: {selectedBus.speedLimit} km/h)
                </span>
              </div>
              <input
                type="range"
                min="5"
                max={selectedBus.speedLimit}
                value={customSpeed}
                onChange={(e) => setCustomSpeed(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5 km/h (Crawling)</span>
                <span>30 km/h (Dense City)</span>
                <span>{selectedBus.speedLimit} km/h (Highway Speed)</span>
              </div>
            </div>

            {/* Weather / Road Surface Conditions */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Weather & Surface Condition</span>
              <div className="grid grid-cols-3 gap-3">
                {(['clear', 'rain', 'fog'] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setCustomWeather(w)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition-all ${
                      customWeather === w
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    {w === 'clear' && '☀ Clear (1.0x)'}
                    {w === 'rain' && '🌧 Heavy Rain (1.35x)'}
                    {w === 'fog' && '🌫 Dense Fog (1.2x)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Dynamic AI Output Card (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  AI SIMULATED OUTCOME
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRiskBadge(customPrediction.riskLevel)}`}>
                  {customPrediction.statusText}
                </span>
              </div>
              <h4 className="text-xl font-bold text-white mt-1">Predicted Delay Telemetry</h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Predicted Delay</span>
                <span className="text-2xl font-black text-rose-400 font-mono">
                  +{customPrediction.predictedDelayMinutes} min
                </span>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Delay Probability</span>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  {customPrediction.delayProbability}%
                </span>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Risk Score</span>
                <span className="text-xl font-bold text-white font-mono">
                  {customPrediction.riskScore} / 10.0
                </span>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Dynamic ETA</span>
                <span className="text-xl font-bold text-cyan-400 font-mono">
                  {customPrediction.dynamicEtaMinutes} min
                </span>
              </div>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">AI Analytical Diagnosis</span>
              <p className="leading-relaxed italic">“{customPrediction.reason}”</p>
            </div>
          </div>
        </div>
      </section>

      {/* Side-by-Side Comparison Matrix */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-white">Scenario Comparison Matrix (Cross-Condition Analysis)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-3 px-4">Scenario Mode</th>
                <th className="py-3 px-4">Traffic Density</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Delay Probability</th>
                <th className="py-3 px-4">Predicted Delay</th>
                <th className="py-3 px-4">Dynamic ETA</th>
                <th className="py-3 px-4">Authority Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {scenariosList.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-slate-850/50 transition-colors ${
                    selectedPreset === row.id ? 'bg-cyan-950/20' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-white font-mono flex items-center gap-2">
                    {getScenarioIcon(row.id)}
                    <span>{row.title}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">{row.density}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRiskBadge(row.riskLevel)}`}>
                      {row.risk}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-amber-300">
                    {row.id === 'normal' ? '18%' : row.id === 'heavy_congestion' ? '68%' : row.id === 'accident_ahead' ? '86%' : '95%'}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-rose-400">{row.additionalDelay}</td>
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{row.eta}</td>
                  <td className="py-3 px-4 text-slate-400">
                    {row.id === 'normal' && 'Nominal monitoring'}
                    {row.id === 'heavy_congestion' && 'Passenger early warnings'}
                    {row.id === 'accident_ahead' && 'Tow dispatch & lane guidance'}
                    {row.id === 'road_blockage' && 'Emergency corridor reroute'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
