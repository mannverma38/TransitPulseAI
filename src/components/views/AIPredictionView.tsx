import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { calculateAIPrediction, getPythonModelArchitectureSnippet } from '../../services/aiPredictionEngine';
import {
  Cpu,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Code2,
  BookOpen,
  ArrowRight,
  Layers,
  Sparkles,
  BarChart,
  Gauge,
  Clock,
  Zap,
} from 'lucide-react';

export const AIPredictionView: React.FC = () => {
  const { selectedBus } = useTransit();
  const [activeTab, setActiveTab] = useState<'interactive' | 'python_code' | 'model_spec'>('interactive');

  // Interactive input overrides
  const [busSpeed, setBusSpeed] = useState<number>(18);
  const [trafficDensity, setTrafficDensity] = useState<number>(82);
  const [historicalRisk, setHistoricalRisk] = useState<number>(0.75);
  const [timeHour, setTimeHour] = useState<number>(10);
  const [remainingKm, setRemainingKm] = useState<number>(14);

  // Compute live prediction
  const prediction = calculateAIPrediction({
    busSpeedKmH: busSpeed,
    speedLimitKmH: 60,
    trafficDensityPercent: trafficDensity,
    historicalCongestionIndex: historicalRisk,
    timeOfDayHours: timeHour,
    remainingDistanceKm: remainingKm,
    remainingStopsCount: 3,
  });

  const pythonSnippet = getPythonModelArchitectureSnippet();

  return (
    <div className="space-y-8 pb-16">
      {/* Engine Header */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-950/80 border border-blue-800/60 px-3 py-1 rounded-full text-xs font-semibold text-blue-400 mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Machine Learning Inference Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            AI Delay Prediction Engine
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Multi-target Gradient Boosting Regressor & Random Forest Classifier trained on GPS velocity series,
            sensor telemetry, and historical urban corridor bottlenecks.
          </p>

          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={() => setActiveTab('interactive')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'interactive'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              Interactive Feature Inspector
            </button>
            <button
              onClick={() => setActiveTab('python_code')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'python_code'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Python / Scikit-Learn Code</span>
            </button>
            <button
              onClick={() => setActiveTab('model_spec')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'model_spec'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              Pipeline Architecture
            </button>
          </div>
        </div>
      </section>

      {activeTab === 'interactive' && (
        <div className="space-y-8">
          {/* Main Example Callout from Prompt */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Live Benchmark Inference</h3>
                <p className="text-xs text-slate-400">Target bus: {selectedBus.busNumber} on NH-58 corridor</p>
              </div>
              <span className="text-xs font-mono bg-slate-950 text-cyan-400 border border-slate-800 px-3 py-1 rounded-lg">
                Model: Ensemble v2.4
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Col: Model Inputs */}
              <div className="lg:col-span-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Telemetry & Corridor Feature Inputs</span>
                </h4>

                <div className="space-y-3 bg-slate-950/90 p-4 rounded-2xl border border-slate-800/80">
                  {/* Bus Speed */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Bus Speed (GPS)</span>
                      <span className="font-mono font-bold text-rose-400">{busSpeed} km/h ↓ (Slow)</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="70"
                      value={busSpeed}
                      onChange={(e) => setBusSpeed(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded accent-cyan-400"
                    />
                  </div>

                  {/* Traffic Density */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Traffic Density</span>
                      <span className="font-mono font-bold text-rose-400">{trafficDensity}% ↑ (Heavy)</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={trafficDensity}
                      onChange={(e) => setTrafficDensity(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded accent-cyan-400"
                    />
                  </div>

                  {/* Historical Congestion Risk */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Historical Congestion Index</span>
                      <span className="font-mono font-bold text-amber-400">
                        {historicalRisk > 0.6 ? 'HIGH' : historicalRisk > 0.3 ? 'MEDIUM' : 'LOW'} ({(historicalRisk * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={historicalRisk}
                      onChange={(e) => setHistoricalRisk(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded accent-cyan-400"
                    />
                  </div>

                  {/* Time of Day */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Time of Day (Rush Factor)</span>
                      <span className="font-mono font-bold text-slate-200">
                        {timeHour.toString().padStart(2, '0')}:00 hrs ({timeHour >= 8 && timeHour <= 11 ? 'Peak Morning Rush' : 'Off-Peak'})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="23"
                      value={timeHour}
                      onChange={(e) => setTimeHour(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded accent-cyan-400"
                    />
                  </div>
                </div>

                {/* Feature Importance weights */}
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-2.5">
                  <span className="text-[11px] uppercase font-bold text-slate-400 block">
                    Feature Contribution Breakdown (SHAP Weights)
                  </span>
                  {prediction.featureContributions.map((fc, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300">{fc.feature}</span>
                        <span className="font-mono text-cyan-400">{(fc.weight * 100).toFixed(0)}% weight</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full"
                          style={{ width: `${fc.weight * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{fc.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Col: Model Output */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Inference Results</span>
                </h4>

                <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs text-slate-400 font-semibold uppercase">Prediction Output</span>
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full uppercase border ${
                        prediction.riskLevel === 'critical'
                          ? 'bg-red-950 text-red-400 border-red-800 animate-pulse'
                          : prediction.riskLevel === 'high'
                          ? 'bg-rose-950 text-rose-400 border-rose-800'
                          : prediction.riskLevel === 'medium'
                          ? 'bg-amber-950 text-amber-400 border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      }`}
                    >
                      {prediction.statusText}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 font-medium block">Delay Probability</span>
                      <span className="text-3xl font-black text-rose-400 font-mono mt-1 block">
                        {prediction.delayProbability}%
                      </span>
                      <span className="text-[10px] text-slate-500">Confidence interval: ±3.2%</span>
                    </div>

                    <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 font-medium block">Predicted Delay</span>
                      <span className="text-3xl font-black text-rose-400 font-mono mt-1 block">
                        +{prediction.predictedDelayMinutes} min
                      </span>
                      <span className="text-[10px] text-slate-500">Baseline timetable delta</span>
                    </div>

                    <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 font-medium block">Risk Score</span>
                      <span className="text-2xl font-bold text-amber-400 font-mono mt-1 block">
                        {prediction.riskScore} / 10.0
                      </span>
                      <span className="text-[10px] text-slate-500">Composite bottleneck index</span>
                    </div>

                    <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 font-medium block">Dynamic ETA</span>
                      <span className="text-2xl font-bold text-cyan-400 font-mono mt-1 block">
                        {prediction.dynamicEtaMinutes} min
                      </span>
                      <span className="text-[10px] text-slate-500">Includes traffic friction</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Reasoning & Context
                    </span>
                    <p className="italic leading-relaxed">“{prediction.reason}”</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'python_code' && (
        <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Scikit-Learn Microservice Script</h3>
              <p className="text-xs text-slate-400">
                Directly pluggable into FastAPI endpoint <code>/api/v1/predict/delay</code>
              </p>
            </div>
            <span className="text-xs font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2.5 py-1 rounded-lg">
              Python 3.11 + Scikit-Learn 1.4
            </span>
          </div>

          <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed shadow-inner">
            {pythonSnippet}
          </pre>
        </section>
      )}

      {activeTab === 'model_spec' && (
        <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <h3 className="text-lg font-bold text-white">Prediction Engine Mathematical Pipeline</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-cyan-400 font-bold block">01. INGESTION LAYER</span>
              <h4 className="text-sm font-bold text-white">AIS-140 GPS Telemetry</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ingests speed, heading, and coordinate pings at 1Hz frequency via 4G LTE MQTT brokers.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-blue-400 font-bold block">02. FUSION LAYER</span>
              <h4 className="text-sm font-bold text-white">Corridor Historical Matrix</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aggregates 30-day moving average transit speeds for highway toll plazas, bottleneck junctions, and peak hours.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-emerald-400 font-bold block">03. INFERENCE LAYER</span>
              <h4 className="text-sm font-bold text-white">Gradient Boosting & RF</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computes delay delta in minutes via regression, and classifies risk severity (Low, Medium, High, Critical).
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
