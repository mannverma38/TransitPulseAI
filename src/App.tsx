import React from 'react';
import { TransitProvider, useTransit } from './context/TransitContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CompetitionTourModal } from './components/CompetitionTourModal';

// Views
import { LandingView } from './components/views/LandingView';
import { LiveTrackingView } from './components/views/LiveTrackingView';
import { PassengerView } from './components/views/PassengerView';
import { WhatIfSimulatorView } from './components/views/WhatIfSimulatorView';
import { AIPredictionView } from './components/views/AIPredictionView';
import { DriverModeView } from './components/views/DriverModeView';
import { FleetDashboardView } from './components/views/FleetDashboardView';
import { TrafficHeatmapView } from './components/views/TrafficHeatmapView';
import { BusManagementView } from './components/views/BusManagementView';
import { HardwareView } from './components/views/HardwareView';
import { AlertsView } from './components/views/AlertsView';
import { BackendArchitectureView } from './components/views/BackendArchitectureView';

const MainContent: React.FC = () => {
  const { activeTab, tickCount, simulationRunning, selectedBus } = useTransit();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <LandingView />;
      case 'live_tracking':
        return <LiveTrackingView />;
      case 'my_bus':
        return <PassengerView />;
      case 'what_if':
        return <WhatIfSimulatorView />;
      case 'ai_prediction':
        return <AIPredictionView />;
      case 'driver_mode':
        return <DriverModeView />;
      case 'fleet_dashboard':
        return <FleetDashboardView />;
      case 'traffic_heatmap':
        return <TrafficHeatmapView />;
      case 'fleet_management':
        return <BusManagementView />;
      case 'hardware':
        return <HardwareView />;
      case 'alerts':
        return <AlertsView />;
      case 'architecture':
        return <BackendArchitectureView />;
      default:
        return <LandingView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Header />
      <Navigation />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {renderActiveView()}
      </main>

      {/* Live System Telemetry Status Bar */}
      <footer className="w-full bg-slate-950 border-t border-slate-800/80 py-3 px-4 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span
                className={`w-2 h-2 rounded-full inline-block ${
                  simulationRunning ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                }`}
              />
              {simulationRunning ? 'AIS-140 GPS SYNC ACTIVE' : 'SIMULATION PAUSED'}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Pings: #{tickCount}</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">Active Target: {selectedBus.busNumber}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
            <span>Model: GradientBoosting v2.4</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400">TransitPulse AI © 2025</span>
          </div>
        </div>
      </footer>

      {/* 18-step Competition Tour Modal */}
      <CompetitionTourModal />
    </div>
  );
};

export default function App() {
  return (
    <TransitProvider>
      <MainContent />
    </TransitProvider>
  );
}
