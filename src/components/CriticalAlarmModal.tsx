import React from 'react';
import { AlertTriangle, BellRing, VolumeX, Truck, CheckCircle, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export const CriticalAlarmModal: React.FC = () => {
  const {
    showCriticalModal,
    dismissCriticalModal,
    activeAlarmAtm,
    silenceAlarm,
    isSirenAudible,
    refillAtm,
    dispatchRefillTeam,
    refillTeams,
    navigateTo,
    language,
    t
  } = useSecurity();

  if (!showCriticalModal || !activeAlarmAtm) return null;

  const idleTeam = refillTeams.find(t => t.currentStatus === 'IDLE') || refillTeams[0];

  const handleDispatch = () => {
    if (idleTeam) {
      dispatchRefillTeam(idleTeam.id, activeAlarmAtm.id);
    }
    dismissCriticalModal();
    navigateTo('REFILL_TEAMS');
  };

  const handleRefillNow = () => {
    refillAtm(activeAlarmAtm.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-red-500/80 rounded-2xl shadow-2xl shadow-red-950/60 overflow-hidden text-slate-100">
        
        {/* Pulsing Alarm Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl animate-bounce">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-white text-red-700 rounded-full">
                  {language === 'ta' ? 'அவசர எச்சரிக்கை' : 'CRITICAL SENSOR ALARM'}
                </span>
                <span className="text-xs text-red-100 font-mono animate-pulse">
                  ● {language === 'ta' ? 'அலாரம் ஒலிக்கிறது' : 'SIREN ACTIVE'}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                {language === 'ta' 
                  ? 'ATM-ல் பணம் 30%-க்கு கீழே குறைந்தது!' 
                  : 'ATM Cash Dropped Below 30%!'}
              </h2>
            </div>
          </div>
          
          <button
            onClick={dismissCriticalModal}
            className="p-1.5 text-red-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Tagline Callout */}
          <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <span className="font-bold text-red-400">CashGuard AI • “பணம் தீரும் முன்பே தெரியும்.”</span>
            <span className="text-slate-400">Sensor Telemetry Threshold: &lt; 30%</span>
          </div>

          {/* ATM Specific Info */}
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono text-slate-400">{activeAlarmAtm.id} • {activeAlarmAtm.branchCode}</span>
                <h3 className="text-lg font-bold text-white">{activeAlarmAtm.name}</h3>
                <p className="text-xs text-slate-300">{activeAlarmAtm.location}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold text-red-500 font-mono animate-pulse">
                  {activeAlarmAtm.cashLevel}%
                </div>
                <div className="text-xs text-red-400 font-medium">
                  {language === 'ta' ? 'மீதமுள்ள இருப்பு' : 'Critical Cash Level'}
                </div>
              </div>
            </div>

            {/* Gauge Bar */}
            <div>
              <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-500 animate-pulse"
                  style={{ width: `${activeAlarmAtm.cashLevel}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                <span>0% (Empty)</span>
                <span className="text-red-400 font-bold">▲ 30% Critical Alarm Line</span>
                <span>100% (Full)</span>
              </div>
            </div>

            {/* Financial Details */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/60 text-xs">
              <div className="bg-slate-900/60 p-2.5 rounded-lg">
                <span className="text-slate-400 block text-[11px]">
                  {language === 'ta' ? 'மீதமுள்ள தொகை' : 'Remaining Cash'}
                </span>
                <span className="text-sm font-bold text-white font-mono">
                  ₹{activeAlarmAtm.cashAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg">
                <span className="text-slate-400 block text-[11px]">
                  {language === 'ta' ? 'பணம் தீரும் நேரம்' : 'Estimated Empty Time'}
                </span>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  {activeAlarmAtm.predictedDepletionHours} {t('hours')} ({activeAlarmAtm.predictedDepletionTime})
                </span>
              </div>
            </div>
          </div>

          {/* Explanation in Tamil & English */}
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
            {language === 'ta'
              ? 'IoT சென்சார் மூலம் இந்த ATM-ல் பணம் 30 சதவீதத்திற்கு கீழே குறைந்துள்ளது கண்டறியப்பட்டது. உடனடியாக பணப் பாதுகாப்பு வாகனத்தை அனுப்பவும் அல்லது ரீஃபில் செய்யவும்.'
              : 'IoT sensor verified that ATM cash reserves dropped below the 30% safety threshold. Automatic alarm siren is sounding to alert the branch manager for immediate dispatch.'}
          </p>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Dispatch Refill Team */}
              <button
                onClick={handleDispatch}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-900/50 transition-all cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>{language === 'ta' ? 'வாகனம் அனுப்புக' : 'Dispatch Refill Van'}</span>
              </button>

              {/* Instant 100% Refill (Simulator) */}
              <button
                onClick={handleRefillNow}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/50 transition-all cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{language === 'ta' ? '100% ரீஃபில் செய்' : 'Instant Refill to 100%'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              {/* Silence Siren button */}
              <button
                onClick={silenceAlarm}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1.5 py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>{isSirenAudible ? (language === 'ta' ? 'அலாரத்தை நிறுத்து' : 'Silence Siren Audio') : (language === 'ta' ? 'அலாரம் அமைதியாக்கப்பட்டது' : 'Siren Silenced')}</span>
              </button>

              <button
                onClick={() => {
                  dismissCriticalModal();
                  navigateTo('SENSOR_SIMULATOR');
                }}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1 py-1 px-2 transition-colors cursor-pointer"
              >
                <span>{language === 'ta' ? 'சென்சார் சோதனை பக்கம்' : 'Open Sensor Test Bench'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
