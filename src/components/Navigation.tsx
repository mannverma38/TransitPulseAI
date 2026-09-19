import React from 'react';
import { useTransit, NavigationTab } from '../context/TransitContext';
import {
  Home,
  Navigation as NavIcon,
  Smartphone,
  Cpu,
  Sliders,
  AlertTriangle,
  MonitorCheck,
  BarChart3,
  Flame,
  Bus,
  Radio,
  Database,
} from 'lucide-react';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, alerts } = useTransit();
  const alertCount = alerts.length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'live_tracking', label: 'Live Bus Tracking', icon: NavIcon },
    { id: 'my_bus', label: 'My Bus (Passenger)', icon: Smartphone },
    { id: 'what_if', label: 'What-If Simulator', icon: Sliders, badge: 'Innovation', badgeColor: 'bg-cyan-500/20 text-cyan-300' },
    { id: 'ai_prediction', label: 'Delay Prediction', icon: Cpu },
    { id: 'driver_mode', label: 'Driver Mode', icon: MonitorCheck },
    { id: 'fleet_dashboard', label: 'Fleet Dashboard', icon: BarChart3 },
    { id: 'traffic_heatmap', label: 'Traffic Heatmap', icon: Flame },
    { id: 'fleet_management', label: 'Fleet Management', icon: Bus },
    { id: 'hardware', label: 'Hardware & IoT', icon: Radio, badge: 'ESP32', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: alertCount > 0 ? `${alertCount}` : undefined, badgeColor: 'bg-rose-500/20 text-rose-300' },
    { id: 'architecture', label: 'API & Schemas', icon: Database },
  ];

  return (
    <nav className="w-full bg-slate-900/60 border-b border-slate-800/80 sticky top-[61px] z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all select-none ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border border-current/20 font-bold ${
                      item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
