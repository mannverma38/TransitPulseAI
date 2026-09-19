import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import {
  Radio,
  Cpu,
  Wifi,
  Satellite,
  Activity,
  CheckCircle2,
  Terminal,
  ArrowRight,
  ArrowDown,
  Server,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

export const HardwareView: React.FC = () => {
  const { selectedBus, livePackets } = useTransit();
  const [activeTab, setActiveTab] = useState<'architecture' | 'live_packets' | 'spec'>('architecture');

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 mb-3">
            <Radio className="w-3.5 h-3.5" />
            <span>IoT & VLT Telemetry Hardware</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Physical GPS / IoT Module Integration
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Standardized AIS-140 in-vehicle location tracker architecture coupling an ESP32 microcontroller,
            u-blox NEO-6M satellite receiver, and high-speed 4G LTE transceiver module.
          </p>
        </div>
      </section>

      {/* Hardware Status Quad Indicators (Prompt: GPS: CONNECTED, 4G: CONNECTED, ESP32: CONNECTED, Data Sync: LIVE) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* GPS */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">NEO-6M GPS MODULE</span>
            <span className="text-sm font-extrabold text-emerald-400 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              GPS: CONNECTED
            </span>
            <span className="text-[10px] text-slate-500 font-mono">11 Satellites Lock</span>
          </div>
        </div>

        {/* 4G LTE */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">SIMCOM 4G LTE</span>
            <span className="text-sm font-extrabold text-emerald-400 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              4G: CONNECTED
            </span>
            <span className="text-[10px] text-slate-500 font-mono">-72 dBm (Excellent)</span>
          </div>
        </div>

        {/* ESP32 */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">ESP32 WROOM-32</span>
            <span className="text-sm font-extrabold text-emerald-400 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              ESP32: CONNECTED
            </span>
            <span className="text-[10px] text-slate-500 font-mono">240 MHz Dual Core</span>
          </div>
        </div>

        {/* Data Sync */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">MQTT TELEMETRY BROKER</span>
            <span className="text-sm font-extrabold text-cyan-400 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
              Data Sync: LIVE
            </span>
            <span className="text-[10px] text-slate-500 font-mono">1.0 Hz Frequency</span>
          </div>
        </div>
      </div>

      {/* End-to-End System Architecture Diagram (Exact flow requested in prompt!) */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div>
          <span className="text-xs font-mono uppercase font-bold text-cyan-400 tracking-wider">
            END-TO-END DATA PIPELINE
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Hardware-to-Cloud-to-AI Telemetry Architecture
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Compatible with custom ESP32 prototypes or existing government roadways AIS-140 VLT providers.
          </p>
        </div>

        {/* Responsive flowchart */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center text-center">
            {/* 1. BUS */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">NODE 1</span>
              <span className="text-sm font-black text-white font-mono block mt-1">GOVERNMENT BUS</span>
              <span className="text-[10px] text-slate-500">UPSRTC Fleet</span>
            </div>

            <div className="hidden md:flex justify-center text-cyan-400">
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex md:hidden justify-center text-cyan-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            {/* 2. ESP32 + NEO-6M */}
            <div className="bg-slate-900 p-4 rounded-xl border border-cyan-500/50 shadow-sm shadow-cyan-950">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase block">NODE 2</span>
              <span className="text-sm font-black text-white font-mono block mt-1">ESP32 + NEO-6M</span>
              <span className="text-[10px] text-slate-400">GPS + Speed + Time</span>
            </div>

            <div className="hidden md:flex justify-center text-cyan-400">
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex md:hidden justify-center text-cyan-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            {/* 3. 4G LTE */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">NODE 3</span>
              <span className="text-sm font-black text-white font-mono block mt-1">4G LTE MODEM</span>
              <span className="text-[10px] text-slate-500">MQTT Cellular Uplink</span>
            </div>

            <div className="hidden md:flex justify-center text-cyan-400">
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex md:hidden justify-center text-cyan-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            {/* 4. Cloud / FastAPI */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">NODE 4</span>
              <span className="text-sm font-black text-white font-mono block mt-1">FASTAPI BACKEND</span>
              <span className="text-[10px] text-slate-500">PostgreSQL Schema</span>
            </div>
          </div>

          <div className="flex justify-center text-cyan-400 py-1">
            <ArrowDown className="w-5 h-5 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center">
            {/* 5. AI Prediction Engine */}
            <div className="bg-gradient-to-r from-blue-950 to-indigo-950 p-4 rounded-xl border border-blue-600/60 shadow-lg col-span-1 md:col-span-2">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase block">NODE 5</span>
              <span className="text-sm font-black text-white font-mono block mt-1">AI PREDICTION ENGINE</span>
              <span className="text-[10px] text-slate-300">Scikit-Learn Gradient Boosting & Random Forest</span>
            </div>

            <div className="hidden md:flex justify-center text-cyan-400">
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex md:hidden justify-center text-cyan-400">
              <ArrowDown className="w-4 h-4" />
            </div>

            {/* 6. TransitPulse Platform */}
            <div className="bg-slate-900 p-4 rounded-xl border border-cyan-500/50 shadow-sm shadow-cyan-950 col-span-1 md:col-span-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase block">NODE 6</span>
              <span className="text-sm font-black text-white font-mono block mt-1">TRANSITPULSE AI</span>
              <span className="text-[10px] text-slate-400">Passenger + Driver HUD + Fleet Authority</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live NMEA 0183 & MQTT Packet Stream Inspector */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Live In-Vehicle Telemetry Packet Feed</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            1Hz Live Stream
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 max-h-72 overflow-y-auto font-mono text-xs text-slate-300 space-y-2">
          {livePackets.map((pkt) => (
            <div
              key={pkt.packetId}
              className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-850 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="text-cyan-400 font-bold">{pkt.packetId} • {pkt.busNumber}</span>
                <span className="text-slate-500">{pkt.timestamp}</span>
              </div>
              <div className="text-emerald-400 text-[11px] break-all">
                {pkt.nmeaSentence}
              </div>
              <div className="flex items-center gap-4 text-[10px] text-slate-500 mt-1">
                <span>Lat: {pkt.lat.toFixed(6)}</span>
                <span>Lng: {pkt.lng.toFixed(6)}</span>
                <span>Speed: {pkt.speed} km/h</span>
                <span>HDOP: {pkt.hdop}</span>
                <span>RSSI: {pkt.signalStrengthDbm} dBm</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
