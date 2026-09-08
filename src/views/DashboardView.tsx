import React from 'react';
import {
  Landmark,
  AlertTriangle,
  BellRing,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Truck,
  Sparkles,
  Zap,
  TrendingDown,
  Layers,
  ArrowRight,
  VolumeX,
  Volume2,
  MapPin,
  Clock,
  ShieldAlert,
  Radio,
  Gauge
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { VoiceGuidancePromptBar } from '../components/VoiceGuidancePromptBar';

export const DashboardView: React.FC = () => {
  const {
    atms,
    setSelectedAtm,
    simulateDropBelow30,
    simulateAtmWithdrawal,
    refillAtm,
    silenceAlarm,
    isSirenAudible,
    activeAlarmAtm,
    refillTeams,
    notifications,
    navigateTo,
    language,
    t,
    managerProfile
  } = useSecurity();

  const totalCashAmount = atms.reduce((acc, a) => acc + a.cashAmount, 0);
  const totalCapacity = atms.reduce((acc, a) => acc + a.cashCapacity, 0);
  const averageCashLevel = Math.round((totalCashAmount / totalCapacity) * 100);

  const criticalAtms = atms.filter(a => a.cashLevel < 30);
  const warningAtms = atms.filter(a => a.cashLevel >= 30 && a.cashLevel < 50);
  const normalAtms = atms.filter(a => a.cashLevel >= 50);
  const enRouteTeams = refillTeams.filter(t => t.currentStatus === 'EN_ROUTE');

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Voice Guidance Dedicated for Dashboard */}
      <div className="max-w-7xl mx-auto">
        <VoiceGuidancePromptBar currentKey="NAV_DASHBOARD" />
      </div>

      {/* 1. TOP BRAND HERO BANNER */}
      <div className="max-w-7xl mx-auto rounded-3xl border border-blue-500/30 bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 p-6 sm:p-8 shadow-xl backdrop-blur-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full bg-blue-500/20 border border-blue-500/40 px-3.5 py-1 text-xs font-bold text-blue-300 mb-3">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>CASHGUARD AI • 24/7 ATM IOT SENSOR NETWORK</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex flex-wrap items-center gap-3">
            <span>CashGuard AI</span>
            <span className="text-sm sm:text-base font-normal text-blue-300 font-serif italic bg-blue-950/70 border border-blue-500/30 px-3 py-1 rounded-full">
              “பணம் தீரும் முன்பே தெரியும்.”
            </span>
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'ATM-ல் பணம் தீரும் வரை காத்திருக்காமல், IoT சென்சார் மூலம் பண அளவை 24/7 கண்காணித்து, 30%-க்கு கீழே குறைந்தால் மேலாளருக்கு உடனடி அலாரம் மற்றும் எச்சரிக்கை வழங்கும் அமைப்பு.'
              : 'Continuous IoT ultrasonic & weight sensor surveillance across bank ATM terminals. Automatically fires loud sirens and alerts to the Bank Manager before cash runs out.'}
          </p>

          <div className="mt-3 flex items-center space-x-4 text-xs text-slate-400">
            <span>{language === 'ta' ? 'கிளை மேலாளர்:' : 'Branch Manager:'} <strong className="text-white">{managerProfile.name}</strong></span>
            <span>•</span>
            <span>{language === 'ta' ? 'வங்கி:' : 'Bank:'} <strong className="text-white">{managerProfile.branch}</strong></span>
          </div>
        </div>

        {/* Action Button: Jump into Simulator */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => navigateTo('SENSOR_SIMULATOR')}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-950/60 transition-all cursor-pointer border border-blue-400/40"
          >
            <Sliders className="w-4 h-4" />
            <span>{language === 'ta' ? 'சென்சார் டெஸ்ட் & அலாரம் சோதனை' : 'Sensor Simulator & Alarm Test'}</span>
          </button>

          <button
            onClick={() => navigateTo('ATM_LIST')}
            className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-colors cursor-pointer border border-slate-700"
          >
            <Landmark className="w-4 h-4" />
            <span>{language === 'ta' ? 'அனைத்து ATM-கள்' : 'All ATMs'} ({atms.length})</span>
          </button>
        </div>
      </div>

      {/* 2. PROBLEM & SOLUTION STATEMENT CALLOUT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-red-400 uppercase tracking-wider block mb-0.5">
              {t('problemLabel')}
            </span>
            <p className="text-slate-300 leading-relaxed">
              {t('problemDesc')}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
              {t('solutionLabel')}
            </span>
            <p className="text-slate-300 leading-relaxed">
              {t('solutionDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* 3. CRITICAL ALARM SIREN BAR (Appears when any ATM <30%) */}
      {activeAlarmAtm && (
        <div className="max-w-7xl mx-auto rounded-2xl border-2 border-red-500 bg-gradient-to-r from-red-950 via-rose-950 to-red-950 p-4 sm:p-5 shadow-2xl shadow-red-950/60 animate-pulse flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-600 text-white rounded-2xl animate-bounce shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-full">
                  {language === 'ta' ? 'அவசர அலாரம் (< 30%)' : 'CRITICAL SENSOR ALARM (<30%)'}
                </span>
                <span className="text-xs font-mono text-red-300">
                  {activeAlarmAtm.name} ({activeAlarmAtm.id})
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-1">
                {language === 'ta'
                  ? `${activeAlarmAtm.name} ATM-ல் பணம் ${activeAlarmAtm.cashLevel}% ஆக குறைந்தது! (30% எல்லை மீறப்பட்டது)`
                  : `${activeAlarmAtm.name} cash reached ${activeAlarmAtm.cashLevel}%! 30% Threshold Breached!`}
              </h2>
              <p className="text-xs text-red-200">
                {language === 'ta'
                  ? `மீதமுள்ள தொகை: ₹${(activeAlarmAtm?.cashAmount ?? 0).toLocaleString('en-IN')}. அலாரம் ஒலிக்கிறது. உடனடியாக ரீஃபில் வாகனத்தை அனுப்பவும்.`
                  : `Remaining Cash: ₹${(activeAlarmAtm?.cashAmount ?? 0).toLocaleString('en-IN')}. Siren sounding on Manager App. Dispatch CIT van now.`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
            <button
              onClick={silenceAlarm}
              className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-colors cursor-pointer"
            >
              {isSirenAudible ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>{isSirenAudible ? t('silenceAlarm') : t('alarmMuted')}</span>
            </button>

            <button
              onClick={() => {
                setSelectedAtm(activeAlarmAtm);
                navigateTo('SENSOR_SIMULATOR');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-red-950/60 flex items-center space-x-1.5"
            >
              <Truck className="w-4 h-4" />
              <span>{language === 'ta' ? 'வாகனம் அனுப்புக' : 'Dispatch Van'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. KEY FLEET METRICS GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Fleet Cash */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>{t('totalFleetCash')}</span>
            <Landmark className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            ₹{(totalCashAmount / 100000).toFixed(1)} Lakhs
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {language === 'ta' ? 'மொத்த கொள்ளளவு:' : 'Fleet Avg:'} <strong className="text-blue-400">{averageCashLevel}%</strong>
          </div>
        </div>

        {/* Metric 2: ATMs < 30% Critical */}
        <div className={`p-5 rounded-2xl border backdrop-blur-md transition-colors ${
          criticalAtms.length > 0 
            ? 'bg-red-950/40 border-red-500/70' 
            : 'bg-slate-800/80 border-slate-700/80'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span className={criticalAtms.length > 0 ? 'text-red-400 font-bold' : ''}>
              {t('criticalAtms')} (&lt;30%)
            </span>
            <BellRing className={`w-4 h-4 ${criticalAtms.length > 0 ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <div className={`text-2xl sm:text-3xl font-black font-mono ${
            criticalAtms.length > 0 ? 'text-red-500 animate-pulse' : 'text-white'
          }`}>
            {criticalAtms.length} {language === 'ta' ? 'மெஷின்கள்' : 'ATMs'}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {criticalAtms.length > 0 
              ? (language === 'ta' ? 'அலாரம் & எச்சரிக்கை அனுப்பப்பட்டது' : 'Alarm triggered on app') 
              : (language === 'ta' ? 'அனைத்தும் 30%-க்கு மேல்' : 'All above threshold')}
          </div>
        </div>

        {/* Metric 3: Low Cash Warning (30-50%) */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>{t('lowCashAtms')} (30-49%)</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {warningAtms.length} {language === 'ta' ? 'மெஷின்கள்' : 'ATMs'}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {language === 'ta' ? 'விரைவில் ரீஃபில் திட்டமிடவும்' : 'Plan refill in 2-4 hrs'}
          </div>
        </div>

        {/* Metric 4: Refill Vans En-Route */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>{t('refillTransitTeams')}</span>
            <Truck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {enRouteTeams.length} {language === 'ta' ? 'வாகனங்கள்' : 'Active'}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {language === 'ta' ? 'பணப் பாதுகாப்பு வேன்கள்' : 'Armored cash vans'}
          </div>
        </div>

      </div>

      {/* 5. INTERACTIVE FLEET GRID: REAL-TIME CASH LEVELS & CASSETTES */}
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <span>{language === 'ta' ? 'நேரடி ATM நிலை & சென்சார் அளவீடுகள்' : 'Live ATM Telemetry & Sensor Readings'}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                8 Terminals
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'ta' 
                ? 'ஒவ்வொரு கார்டிலும் <30% அலாரத்தை சோதிக்க அல்லது பணத்தை ரீஃபில் செய்ய பட்டன்கள் உள்ளன.' 
                : 'Interactive cards: Test sensor drops below 30%, dispense cash, or instant 100% refill.'}
            </p>
          </div>

          <button
            onClick={() => navigateTo('SENSOR_SIMULATOR')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1 cursor-pointer self-start sm:self-center"
          >
            <span>{language === 'ta' ? 'சென்சார் சோதனைக் கூடம் செல்ல' : 'Open Full Simulator View'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ATM Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...atms].sort((a,b) => a.cashLevel - b.cashLevel).slice(0, 8).map((atm) => {
            const isCrit = atm.cashLevel < 30;
            const isWarn = atm.cashLevel >= 30 && atm.cashLevel < 50;

            return (
              <div
                key={atm.id}
                className={`rounded-2xl border p-4 backdrop-blur-md shadow-md transition-all flex flex-col justify-between ${
                  isCrit
                    ? 'bg-red-950/30 border-red-500/80 ring-2 ring-red-500/40 shadow-red-950/50'
                    : isWarn
                    ? 'bg-amber-950/20 border-amber-500/50'
                    : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div>
                  {/* Top Line */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400">{atm.id}</span>
                      <h3 className="text-sm font-bold text-white truncate max-w-[160px]">{atm.name}</h3>
                      <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{atm.location}</p>
                    </div>

                    <div className="text-right">
                      <div className={`text-xl font-black font-mono ${
                        isCrit ? 'text-red-500 animate-pulse' : isWarn ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {atm.cashLevel}%
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block ${
                        isCrit 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : isWarn 
                          ? 'bg-amber-500/20 text-amber-300' 
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {isCrit ? 'ALARM <30%' : isWarn ? 'LOW CASH' : 'NORMAL'}
                      </span>
                    </div>
                  </div>

                  {/* Cash Amount & Gauge */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span className="font-bold text-white font-mono">₹{(atm.cashAmount ?? 0).toLocaleString('en-IN')}</span>
                      <span className="text-slate-400">/ ₹{((atm.cashCapacity ?? 0) / 100000).toFixed(0)}L</span>
                    </div>

                    <div className="relative h-2.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-700">
                      {/* 30% Threshold Line */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10 shadow-[0_0_4px_rgba(248,113,113,1)]"
                        style={{ left: '30%' }}
                      />
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCrit ? 'bg-red-500' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${atm.cashLevel}%` }}
                      />
                    </div>
                  </div>

                  {/* AI Prediction Callout */}
                  <div className="mt-2.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      <span>{language === 'ta' ? 'தீரும் நேரம்:' : 'Empty in:'}</span>
                    </span>
                    <span className="font-bold text-amber-400 font-mono">
                      {atm.predictedDepletionHours} {t('hours')}
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons on Each Card */}
                <div className="mt-3 pt-2.5 border-t border-slate-700/60 grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => simulateDropBelow30(atm.id, 22)}
                    className="px-2 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600 border border-red-500/40 text-red-200 hover:text-white text-[10px] font-bold transition-colors cursor-pointer text-center"
                    title="Simulate cash dropping to 22% (< 30%)"
                  >
                    {language === 'ta' ? '< 30% டெஸ்ட்' : 'Test < 30%'}
                  </button>

                  <button
                    onClick={() => refillAtm(atm.id)}
                    className="px-2 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-200 hover:text-white text-[10px] font-bold transition-colors cursor-pointer text-center"
                    title="Refill to 100%"
                  >
                    {language === 'ta' ? '100% ரீஃபில்' : 'Refill 100%'}
                  </button>

                  <button
                    onClick={() => {
                      simulateAtmWithdrawal(atm.id, 5000);
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 text-[10px] font-medium transition-colors cursor-pointer text-center"
                  >
                    - ₹5,000
                  </button>

                  <button
                    onClick={() => {
                      setSelectedAtm(atm);
                      navigateTo('ATM_DETAILS');
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-medium transition-colors cursor-pointer text-center"
                  >
                    {language === 'ta' ? 'சென்சார்கள்' : 'Sensors'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 6. RECENT ALERTS & SENSOR ACTIVITY LOG */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Notifications */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <BellRing className="w-4 h-4 text-blue-400" />
              <span>{language === 'ta' ? 'சமீபத்திய அலாரங்கள் & எச்சரிக்கைகள்' : 'Recent Manager Alarms & Alerts'}</span>
            </h3>
            <button
              onClick={() => navigateTo('NOTIFICATIONS')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            >
              {language === 'ta' ? 'அனைத்தும் பார்க்க' : 'View All'}
            </button>
          </div>

          <div className="space-y-2.5">
            {notifications.slice(0, 4).map((notif) => {
              const isCrit = notif.severity === 'CRITICAL';
              return (
                <div
                  key={notif.id}
                  className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                    isCrit ? 'bg-red-950/30 border-red-500/50' : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-start space-x-2.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                      isCrit ? 'bg-red-500 animate-pulse' : 'bg-blue-400'
                    }`} />
                    <div>
                      <div className="font-bold text-white">{notif.title}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5 line-clamp-1">{notif.message}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">{notif.timestamp}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Refill Logistics & Fleet Status */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ta' ? 'பணப் பாதுகாப்பு வாகனங்களின் நிலை' : 'Armored Cash Van Transit Status'}</span>
            </h3>
            <button
              onClick={() => navigateTo('REFILL_TEAMS')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            >
              {language === 'ta' ? 'வாகனங்கள் பக்கம்' : 'Track Vans'}
            </button>
          </div>

          <div className="space-y-2.5">
            {refillTeams.map((team) => (
              <div
                key={team.id}
                className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-white">{team.name} ({team.vehicleNumber})</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {team.leadOfficer} • {typeof team.currentLocation === 'object' ? team.currentLocation?.address : team.currentLocation}
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  team.currentStatus === 'EN_ROUTE' 
                    ? 'bg-blue-500 text-white animate-pulse' 
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {team.currentStatus} {team.etaMinutes ? `(${team.etaMinutes}m ETA)` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
