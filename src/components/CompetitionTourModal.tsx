import React, { useState } from 'react';
import { useTransit, NavigationTab } from '../context/TransitContext';
import {
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface TourStep {
  step: number;
  title: string;
  category: string;
  description: string;
  targetTab: NavigationTab;
  highlightAction?: () => void;
}

export const CompetitionTourModal: React.FC = () => {
  const { isTourOpen, setIsTourOpen, setActiveTab, triggerScenarioForSelectedBus } = useTransit();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isTourOpen) return null;

  const tourSteps: TourStep[] = [
    {
      step: 1,
      title: 'Welcome to TransitPulse AI',
      category: 'Platform Overview',
      description: '“Track. Predict. Alert. Move Smarter.” Built for state roadways networks (UPSRTC) to predict delay risk before queues form.',
      targetTab: 'dashboard',
    },
    {
      step: 2,
      title: 'Core Innovation vs Normal GPS',
      category: 'Innovation Concept',
      description: 'Standard trackers show WHERE the bus is. TransitPulse AI predicts WHAT MAY HAPPEN NEXT using multi-parameter sensor fusion.',
      targetTab: 'dashboard',
    },
    {
      step: 3,
      title: 'Live Roadways Bus Tracking',
      category: 'Real-Time Telemetry',
      description: 'Observe active government roadways buses moving along coordinates with live velocity, heading, and stop progression.',
      targetTab: 'live_tracking',
    },
    {
      step: 4,
      title: 'Passenger Journey Search',
      category: 'Passenger Experience',
      description: 'Search buses by registration number (UPSRTC-204), corridor, source, or intermediate stop names.',
      targetTab: 'my_bus',
    },
    {
      step: 5,
      title: 'Dynamic ETA Recalculation',
      category: 'Dynamic Prediction',
      description: 'Unlike static timetables, Dynamic ETA adjusts in real-time as traffic density increases or GPS speed drops.',
      targetTab: 'my_bus',
    },
    {
      step: 6,
      title: 'Four-Tier Delay Risk Meter',
      category: 'AI Risk Engine',
      description: 'Categorizes transit risk into LOW, MEDIUM, HIGH, and CRITICAL with confidence probability and delay delta in minutes.',
      targetTab: 'my_bus',
    },
    {
      step: 7,
      title: 'What-If Traffic Simulator',
      category: 'Key Innovation',
      description: 'Select preset scenarios (Normal, Congestion, Accident Ahead, Road Blockage) to see simulated AI reactions.',
      targetTab: 'what_if',
    },
    {
      step: 8,
      title: 'Congestion Scenario Simulation',
      category: 'Live Simulation',
      description: 'Triggering Heavy Congestion: Notice the delay delta jumps to +8-14 min and dynamic ETA pushes backward.',
      targetTab: 'what_if',
      highlightAction: () => triggerScenarioForSelectedBus('heavy_congestion'),
    },
    {
      step: 9,
      title: 'Fine-Grained Variable Controls',
      category: 'What-If Playground',
      description: 'Manually tweak traffic density sliders, observed speed deficit, and weather multipliers to test non-linear model output.',
      targetTab: 'what_if',
    },
    {
      step: 10,
      title: 'AI Delay Prediction Engine',
      category: 'Machine Learning',
      description: 'Inspect multi-target Gradient Boosting Regressor and Random Forest Classifier architecture with SHAP feature weights.',
      targetTab: 'ai_prediction',
    },
    {
      step: 11,
      title: 'Python / Scikit-Learn Integration',
      category: 'ML Engineering',
      description: 'View the production-ready Python training script and model persistence logic ready to plug into FastAPI.',
      targetTab: 'ai_prediction',
    },
    {
      step: 12,
      title: 'Driver Cabin HUD',
      category: 'Driver Operations',
      description: 'Distraction-free high-contrast cabin display with large legible fonts, road blockage advisories, and audio alert tone.',
      targetTab: 'driver_mode',
    },
    {
      step: 13,
      title: 'Fleet Authority Command Center',
      category: 'Operations Dashboard',
      description: 'Command center for roadways depots showing active bus count, delayed buses, high-risk vehicles, and on-time cadence.',
      targetTab: 'fleet_dashboard',
    },
    {
      step: 14,
      title: 'Live Fleet Dispatch Broadcast',
      category: 'Authority Dispatch',
      description: 'Broadcast urgent traffic advisories or reroute instructions directly to all in-cabin driver displays.',
      targetTab: 'fleet_dashboard',
    },
    {
      step: 15,
      title: 'City-Wide Traffic Heatmap',
      category: 'Spatial Analytics',
      description: 'Spatial corridor congestion index across Delhi, Ghaziabad, Meerut, Noida, and Lucknow roadways routes.',
      targetTab: 'traffic_heatmap',
    },
    {
      step: 16,
      title: 'Fleet & Vehicle Telemetry Grid',
      category: 'Fleet Management',
      description: 'Filter buses by On-Time, Delayed, High Risk, or Critical, and inspect individual driver profiles and hardware pings.',
      targetTab: 'fleet_management',
    },
    {
      step: 17,
      title: 'Physical IoT / Hardware Integration',
      category: 'Hardware & IoT',
      description: 'ESP32 controller + NEO-6M GPS module + 4G LTE transceiver architecture with live NMEA 0183 packet streaming.',
      targetTab: 'hardware',
    },
    {
      step: 18,
      title: 'FastAPI & PostgreSQL Backend Architecture',
      category: 'Cloud Engineering',
      description: 'Complete PostgreSQL schema DDL with PostGIS geospatial indexing and FastAPI endpoint definitions ready for deployment.',
      targetTab: 'architecture',
    },
  ];

  const currentStep = tourSteps[currentStepIndex];

  const goToStep = (index: number) => {
    if (index < 0 || index >= tourSteps.length) return;
    setCurrentStepIndex(index);
    const target = tourSteps[index];
    setActiveTab(target.targetTab);
    if (target.highlightAction) {
      target.highlightAction();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-700/60">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                EVALUATION WALKTHROUGH • STEP {currentStep.step} OF {tourSteps.length}
              </span>
              <h3 className="text-lg font-black text-white">{currentStep.category}</h3>
            </div>
          </div>
          <button
            onClick={() => setIsTourOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="space-y-3 py-2">
          <h4 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{currentStep.title}</span>
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
            {currentStep.description}
          </p>
        </div>

        {/* Modal Controls Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={() => goToStep(currentStepIndex - 1)}
            disabled={currentStepIndex === 0}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
              currentStepIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-xs font-mono text-slate-500">
            {currentStepIndex + 1} / {tourSteps.length}
          </div>

          {currentStepIndex < tourSteps.length - 1 ? (
            <button
              onClick={() => goToStep(currentStepIndex + 1)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsTourOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-md transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Walkthrough</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
