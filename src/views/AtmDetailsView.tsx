import React from 'react';
import {
  Landmark,
  Layers,
  Activity,
  Thermometer,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  Sliders,
  ArrowLeft,
  Truck,
  Zap,
  Gauge,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { CashCassette } from '../types';

export const AtmDetailsView: React.FC = () => {
  const {
    selectedAtm,
    atms,
    setSelectedAtm,
    updateAtmCashLevel,
    simulateDropBelow30,
    refillAtm,
    navigateTo,
    language,
    t
  } = useSecurity();

  const atm = selectedAtm || atms[0];
  const isCritical = atm.cashLevel < 30;
  const isWarning = atm.cashLevel >= 30 && atm.cashLevel < 50;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Back Button & Title */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigateTo('ATM_LIST')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Back to ATM List"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs text-blue-400 font-mono">
              CashGuard AI • HARDWARE TELEMETRY & IOT SENSORS
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
              <span>{atm.name}</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                {atm.id}
              </span>
            </h1>
            <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{atm.location} ({atm.branchCode})</span>
            </p>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigateTo('SENSOR_SIMULATOR')}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>{language === 'ta' ? 'சென்சார் சிமுலேட்டர்' : 'Test in Simulator'}</span>
          </button>
          <button
            onClick={() => refillAtm(atm.id)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('refillNow')}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT TELEMETRY COLUMN (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Cash Gauge Card */}
          <div className={`rounded-2xl border p-6 backdrop-blur-md shadow-xl ${
            isCritical ? 'bg-red-950/40 border-red-500/80' : isWarning ? 'bg-amber-950/20 border-amber-500/50' : 'bg-slate-800/80 border-slate-700/80'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {language === 'ta' ? 'பண இருப்பு நிலை' : 'Vault Cash Reserves'}
                </span>
                <div className="text-4xl sm:text-5xl font-black font-mono mt-1 text-white">
                  ₹{(atm?.cashAmount ?? 0).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {language === 'ta' ? 'மொத்த கொள்ளளவு:' : 'Total Capacity:'} ₹{(atm?.cashCapacity ?? 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="text-right">
                <div className={`text-3xl font-black font-mono ${
                  isCritical ? 'text-red-500 animate-pulse' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {atm.cashLevel}%
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                  isCritical ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {isCritical ? 'ALARM ACTIVE (<30%)' : 'NORMAL'}
                </span>
              </div>
            </div>

            {/* Gauge Bar */}
            <div className="mt-6 space-y-2">
              <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-700 relative">
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10 shadow-[0_0_6px_rgba(248,113,113,1)]"
                  style={{ left: '30%' }}
                />
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${atm.cashLevel}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>0% (Empty)</span>
                <span className="text-red-400 font-bold">▲ 30% Critical Alarm Line</span>
                <span>100% (Full)</span>
              </div>
            </div>

            {/* Quick Test Drop */}
            <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between">
              <span className="text-xs text-slate-300">
                {language === 'ta' ? '30%-க்கு கீழே குறைக்க சோதிக்கவும்:' : 'Test alarm trigger for this machine:'}
              </span>
              <button
                onClick={() => simulateDropBelow30(atm.id, 24)}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
              >
                {language === 'ta' ? '24% ஆக்குக (<30%)' : 'Trigger 24% (<30%)'}
              </button>
            </div>
          </div>

          {/* Cassette Details */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-800/80 p-5 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>{language === 'ta' ? '4 கேசட் பெட்டிகளின் சென்சார் விவரங்கள்' : 'Cassette Optical & Weight Sensors'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.entries(atm.cassettes) as [string, CashCassette][]).map(([key, cas]) => {
                const pct = Math.round((cas.notesCount / cas.maxNotes) * 100);
                return (
                  <div key={key} className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-500/30">
                        ₹{cas.denomination} Denomination
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-200">{pct}%</span>
                    </div>

                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct < 30 ? 'bg-red-500' : pct < 50 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-400 pt-1">
                      <div>Notes: <strong className="text-slate-200">{cas.notesCount}</strong></div>
                      <div>Max: <strong className="text-slate-200">{cas.maxNotes}</strong></div>
                      <div className="col-span-2 text-white font-bold">Value: ₹{(cas?.amount ?? 0).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT SENSOR TELEMETRY & HARDWARE METRICS (5 cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* IoT Sensor Health Card */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-800/80 p-5 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ta' ? 'IoT சென்சார் நலன் & அளவீடுகள்' : 'IoT Sensor Telemetry Grid'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-300">Ultrasonic Cash Level Sensor</span>
                <span className="font-mono text-emerald-400 font-bold">ONLINE (99.8% Accuracy)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-300">Optical Note Counter Pick Sensor</span>
                <span className="font-mono text-emerald-400 font-bold">CALIBRATED</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-300">Vault Internal Temperature</span>
                <span className="font-mono text-blue-400 font-bold">21.4°C (Optimal)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-300">Cassette Electronic Weight Sensor</span>
                <span className="font-mono text-white font-bold">38.2 kg</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-300">Manager App Alarm Gateway</span>
                <span className="font-mono text-emerald-400 font-bold">READY (4G / LAN)</span>
              </div>
            </div>
          </div>

          {/* AI Depletion Card */}
          <div className="rounded-2xl border border-blue-500/40 bg-gradient-to-br from-blue-950/40 to-slate-900 p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'ta' ? 'CashGuard AI - கணிப்பு முறைமை' : 'AI Cash Depletion Engine'}</span>
            </div>

            <p className="text-xs text-slate-300 font-serif italic">
              “பணம் தீரும் முன்பே தெரியும்.”
            </p>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{language === 'ta' ? 'பணம் காலியாகும் நேரம்:' : 'Depletion ETA:'}</span>
                <span className="font-mono font-bold text-amber-400">{atm.predictedDepletionHours} {t('hours')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{language === 'ta' ? 'எதிர்பார்க்கப்படும் நேரம்:' : 'Expected Zero Time:'}</span>
                <span className="font-mono text-white font-bold">{atm.predictedDepletionTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{language === 'ta' ? 'பரிந்துரைக்கப்படும் ரீஃபில்:' : 'Recommended Refill:'}</span>
                <span className="font-mono text-emerald-400 font-bold">₹{((atm?.cashCapacity ?? 0) - (atm?.cashAmount ?? 0)).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => navigateTo('REFILL_TEAMS')}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-md shadow-blue-950/60"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'பணப் பாதுகாப்பு வாகனத்தை அனுப்ப' : 'Schedule Transit Refill Van'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
