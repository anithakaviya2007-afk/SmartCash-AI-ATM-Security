import React, { useState, useEffect } from 'react';
import {
  Sliders,
  AlertTriangle,
  BellRing,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  Zap,
  ShieldAlert,
  Layers,
  ArrowRight,
  TrendingDown,
  Gauge,
  Radio,
  Sparkles,
  Truck,
  Smartphone,
  Info,
  Watch,
  Camera,
  MapPin,
  Activity,
  Heart,
  Wifi,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { CashCassette } from '../types';

export const SensorSimulatorView: React.FC = () => {
  const {
    atms,
    selectedAtm,
    setSelectedAtm,
    updateAtmCashLevel,
    simulateDropBelow30,
    simulateAtmWithdrawal,
    refillAtm,
    silenceAlarm,
    isSirenAudible,
    soundOn,
    setSoundOn,
    speakGuidance,
    language,
    t,
    navigateTo,
    managerProfile,
    session,
    activeUser,
    handleStep1FaceVerification
  } = useSecurity();

  const currentAtm = selectedAtm || atms[0];
  const [sliderVal, setSliderVal] = useState<number>(currentAtm.cashLevel);
  const [lastWithdrawalMsg, setLastWithdrawalMsg] = useState<string | null>(null);
  const [customMobile, setCustomMobile] = useState<string>('9840111234');
  const [customSmsSent, setCustomSmsSent] = useState<{ phone: string; message: string; time: string } | null>(null);
  const [selectedAlertType, setSelectedAlertType] = useState<'CRITICAL_CASH' | 'SUSPICIOUS_TAMPER' | 'WITHDRAWAL_ALERT' | 'SMARTWATCH_SOS'>('CRITICAL_CASH');

  // Smartwatch Real-time Simulated Heart Rate
  const [smartwatchBpm, setSmartwatchBpm] = useState<number>(72);
  const [smartwatchMsg, setSmartwatchMsg] = useState<string | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number; accuracy: number; address: string }>({
    lat: 13.0827,
    lng: 80.2707,
    accuracy: 8,
    address: 'Anna Nagar ATM Terminal #01, Chennai, TN'
  });

  // Sync slider when selectedAtm changes
  React.useEffect(() => {
    if (currentAtm) {
      setSliderVal(currentAtm.cashLevel);
    }
  }, [currentAtm?.id, currentAtm?.cashLevel]);

  // Live Geolocation API Fetch
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation({
            lat: parseFloat(pos.coords.latitude.toFixed(4)),
            lng: parseFloat(pos.coords.longitude.toFixed(4)),
            accuracy: Math.round(pos.coords.accuracy),
            address: `${currentAtm.name}, ${currentAtm.location}`
          });
        },
        () => {
          // Keep default fallback
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }

    // Heart rate pulse simulator
    const interval = setInterval(() => {
      setSmartwatchBpm(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(130, Math.max(62, prev + delta));
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [currentAtm]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSliderVal(val);
    updateAtmCashLevel(currentAtm.id, val);
  };

  const handleWithdrawal = (amt: number) => {
    const res = simulateAtmWithdrawal(currentAtm.id, amt);
    if (res.success) {
      setSliderVal(res.newLevel);
      setLastWithdrawalMsg(
        language === 'ta'
          ? `₹${(amt ?? 0).toLocaleString('en-IN')} எடுக்கப்பட்டது. புதிய இருப்பு: ${res.newLevel}%`
          : `Withdrew ₹${(amt ?? 0).toLocaleString('en-IN')}. New level: ${res.newLevel}%`
      );
      setTimeout(() => setLastWithdrawalMsg(null), 4000);
    }
  };

  const isCritical = currentAtm.cashLevel < 30;
  const isWarning = currentAtm.cashLevel >= 30 && currentAtm.cashLevel < 50;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Breadcrumb & Title */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-blue-400 font-mono mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>CashGuard AI • IOT SENSOR LAB & DRAIN SIMULATOR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <span>{t('sensorSimulator')}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 font-normal">
              {language === 'ta' ? 'நேரடி சோதனை' : 'Live Interactive Test Bench'}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {language === 'ta' 
              ? '“பணம் தீரும் முன்பே தெரியும்.” • ATM cash 30%-க்கு கீழே செல்லும் போது அலாரம் ஒலிக்கும் சோதனையை இங்கேயே செய்யலாம்.' 
              : '“Knows before cash runs out.” • Test sensor drop below 30% to experience the instant bank manager alarm & alert.'}
          </p>
        </div>

        {/* Quick ATM Selector Dropdown */}
        <div className="flex items-center space-x-3 bg-slate-800/80 p-2 rounded-xl border border-slate-700/80">
          <span className="text-xs text-slate-400 pl-2">{language === 'ta' ? 'ATM தேர்வு:' : 'Select ATM:'}</span>
          <select
            value={currentAtm.id}
            onChange={(e) => {
              const found = atms.find(a => a.id === e.target.value);
              if (found) {
                setSelectedAtm(found);
                setSliderVal(found.cashLevel);
              }
            }}
            aria-label="Select ATM"
            className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            {atms.map((atm) => (
              <option key={atm.id} value={atm.id}>
                {atm.id} - {atm.name} ({atm.cashLevel}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Problem & Solution Showcase Banner */}
      <div className="max-w-7xl mx-auto rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/50 via-indigo-950/40 to-slate-900 p-5 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3 p-3 bg-red-950/30 border border-red-500/30 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-red-300 block uppercase tracking-wider mb-0.5">
                {t('problemLabel')}
              </span>
              <p className="text-slate-300 leading-relaxed">
                {t('problemDesc')}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-emerald-300 block uppercase tracking-wider mb-0.5">
                {t('solutionLabel')}
              </span>
              <p className="text-slate-300 leading-relaxed">
                {t('solutionDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: The Interactive Sensor Controller (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Sensor Card */}
          <div className={`rounded-2xl border transition-all duration-300 p-6 backdrop-blur-md shadow-xl ${
            isCritical
              ? 'bg-red-950/30 border-red-500/80 ring-2 ring-red-500/40 shadow-red-950/50'
              : isWarning
              ? 'bg-amber-950/20 border-amber-500/60'
              : 'bg-slate-800/80 border-slate-700/80'
          }`}>
            
            {/* Header with Live Sensor Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl ${
                  isCritical 
                    ? 'bg-red-500/20 text-red-400 animate-bounce' 
                    : isWarning 
                    ? 'bg-amber-500/20 text-amber-400' 
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  <Radio className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <span>{currentAtm.name}</span>
                    <span className="text-xs font-mono text-slate-400">({currentAtm.id})</span>
                  </h2>
                  <p className="text-xs text-slate-400">{currentAtm.location}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-2">
                {isCritical ? (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse shadow-md shadow-red-600/40">
                    <BellRing className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? '🚨 அவசர அலாரம் (< 30%)' : '🚨 CRITICAL ALARM (<30%)'}</span>
                  </span>
                ) : isWarning ? (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <span>{language === 'ta' ? 'குறைந்த பணம் (30-49%)' : 'Low Cash Warning'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'சாதாரண நிலை (>50%)' : 'Normal Operation'}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Big Cash Percentage & Gauge */}
            <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  {language === 'ta' ? 'IoT சென்சார் கண்டறிந்த பண அளவு' : 'IoT Sensor Live Reading'}
                </span>
                <div className="flex items-baseline space-x-3 mt-1">
                  <span className={`text-5xl sm:text-6xl font-black font-mono tracking-tight ${
                    isCritical 
                      ? 'text-red-500 animate-pulse' 
                      : isWarning 
                      ? 'text-amber-400' 
                      : 'text-emerald-400'
                  }`}>
                    {currentAtm.cashLevel}%
                  </span>
                  <div className="text-sm text-slate-300">
                    <span className="block font-bold text-white font-mono">
                      ₹{(currentAtm?.cashAmount ?? 0).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400">
                      / ₹{(currentAtm?.cashCapacity ?? 0).toLocaleString('en-IN')} capacity
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Depletion Forecast Callout */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/80 min-w-[220px]">
                <div className="flex items-center space-x-1.5 text-xs text-blue-400 font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'AI கணிப்பு (Tagline)' : 'AI Depletion Engine'}</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {language === 'ta' ? 'பணம் தீரும் நேரம்:' : 'Estimated Empty in:'}
                </div>
                <div className="text-lg font-mono font-extrabold text-amber-400 mt-0.5">
                  {currentAtm.predictedDepletionHours} {t('hours')}
                </div>
                <div className="text-[11px] text-slate-400">
                  {language === 'ta' ? `அளவு: 0% ஆகும் நேரம் ~ ${currentAtm.predictedDepletionTime}` : `Zero cash expected ~ ${currentAtm.predictedDepletionTime}`}
                </div>
              </div>
            </div>

            {/* Visual Sensor Depth Gauge Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300 font-medium">
                <span>{language === 'ta' ? 'பண இருப்பு நிலை' : 'Cassette Vault Depth'}</span>
                <span className="font-mono text-blue-400">{currentAtm.cashLevel}%</span>
              </div>
              
              <div className="relative h-6 w-full bg-slate-950 rounded-xl overflow-hidden p-1 border border-slate-700/80">
                {/* 30% Threshold Marker Line */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-20 shadow-[0_0_8px_rgba(248,113,113,1)]"
                  style={{ left: '30%' }}
                />
                <div 
                  className="h-full rounded-lg transition-all duration-300 ease-out flex items-center justify-end pr-2 text-[10px] font-bold text-white shadow-inner"
                  style={{
                    width: `${currentAtm.cashLevel}%`,
                    background: isCritical
                      ? 'linear-gradient(90deg, #b91c1c, #ef4444)'
                      : isWarning
                      ? 'linear-gradient(90deg, #b45309, #f59e0b)'
                      : 'linear-gradient(90deg, #047857, #10b981)'
                  }}
                >
                  {currentAtm.cashLevel > 15 && `${currentAtm.cashLevel}%`}
                </div>
              </div>

              {/* Gauge Scale Labels */}
              <div className="relative flex justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>0% (Empty)</span>
                <span className="absolute left-[30%] -translate-x-1/2 text-red-400 font-bold flex items-center space-x-0.5">
                  <span>▲</span>
                  <span>30% {language === 'ta' ? 'அலாரம் கோடு' : 'Alarm Threshold'}</span>
                </span>
                <span>100% (Full)</span>
              </div>
            </div>

            {/* THE INTERACTIVE SENSOR SLIDER */}
            <div className="mt-8 pt-6 border-t border-slate-700/60 space-y-3 bg-slate-900/60 p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <label htmlFor="sensor-slider" className="text-xs font-bold text-white flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  <span>{t('adjustSensorSlider')}</span>
                </label>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-900/60 border border-blue-500/40 text-blue-300">
                  {sliderVal}%
                </span>
              </div>

              <input
                id="sensor-slider"
                type="range"
                min="0"
                max="100"
                value={sliderVal}
                onChange={handleSliderChange}
                aria-label={t('adjustSensorSlider')}
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
              />

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t('drainTestDesc')}
              </p>
            </div>

            {/* Quick Simulation Trigger Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-700/60 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {language === 'ta' ? 'விரைவு சோதனை பட்டன்கள் (One-Click Actions)' : 'Quick Action Triggers'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Quick Drop Below 30% Test */}
                <button
                  onClick={() => simulateDropBelow30(currentAtm.id, 24)}
                  className="flex items-center justify-center space-x-2 py-3 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-950/60 transition-all cursor-pointer border border-red-400/40"
                >
                  <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>{language === 'ta' ? '30%-க்கு கீழே குறைக்க (24%)' : 'Drop to 24% (< 30%)'}</span>
                </button>

                {/* 2. Refill to 100% */}
                <button
                  onClick={() => refillAtm(currentAtm.id)}
                  className="flex items-center justify-center space-x-2 py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 transition-all cursor-pointer border border-emerald-400/40"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('refillNow')}</span>
                </button>

                {/* 3. Silence / Unmute Siren */}
                <button
                  onClick={silenceAlarm}
                  className="flex items-center justify-center space-x-2 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-600 transition-all cursor-pointer"
                >
                  {isSirenAudible ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  <span>{isSirenAudible ? t('silenceAlarm') : t('alarmMuted')}</span>
                </button>
              </div>
            </div>

            {/* Customer ATM Withdrawal Simulation */}
            <div className="mt-6 pt-4 border-t border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {language === 'ta' ? 'வாடிக்கையாளர் பணம் எடுப்பதை சோதிக்க' : 'Simulate Customer ATM Cash Withdrawal'}
                </span>
                {lastWithdrawalMsg && (
                  <span className="text-xs text-emerald-400 font-mono animate-fade-in">
                    ✓ {lastWithdrawalMsg}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[2000, 5000, 10000, 25000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleWithdrawal(amt)}
                    className="py-2.5 px-3 rounded-lg bg-slate-900/90 hover:bg-blue-600/30 hover:border-blue-500/50 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer text-center"
                  >
                    - ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Cassettes Breakdown */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-800/80 p-5 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-4">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>{language === 'ta' ? '4 பணப் பெட்டிகளின் சென்சார் நிலை (Cassettes)' : 'Cassette Vault Optical Sensors'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.entries(currentAtm.cassettes) as [string, CashCassette][]).map(([key, cas]) => {
                const pct = Math.round((cas.notesCount / cas.maxNotes) * 100);
                return (
                  <div key={key} className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-300">
                        ₹{cas.denomination} Note
                      </span>
                      <span className="font-mono text-slate-300 font-semibold">{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          pct < 30 ? 'bg-red-500' : pct < 50 ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>{cas.notesCount} / {cas.maxNotes} notes</span>
                      <span className="text-slate-300 font-semibold">₹{(cas?.amount ?? 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


        </div>

        {/* RIGHT COLUMN: Live Bank Manager Alert Preview & Dispatches (5 cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Manager App Alert Simulation Card */}
          <div className={`rounded-2xl border p-5 backdrop-blur-md shadow-xl transition-all duration-300 ${
            isCritical
              ? 'bg-red-950/40 border-red-500/80 shadow-red-950/60'
              : 'bg-slate-800/80 border-slate-700/80'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span>{language === 'ta' ? 'வங்கி மேலாளர் மொபைல் அலர்ட்' : 'Manager Phone Push Notification'}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-mono">
                {language === 'ta' ? 'நேரலை' : 'Live Preview'}
              </span>
            </div>

            {/* Mobile Push Notification Mockup */}
            <div className="mt-4 bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs">
                    CG
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">CashGuard AI</div>
                    <div className="text-[10px] text-slate-400">{language === 'ta' ? 'இப்போது' : 'Just now'} • High Priority</div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {isCritical ? 'ALARM ACTIVE' : 'NORMAL'}
                </span>
              </div>

              <div className="text-xs space-y-1">
                <p className="font-bold text-white">
                  {isCritical 
                    ? `⚠️ CRITICAL: ${currentAtm.name} Cash < 30% (${currentAtm.cashLevel}%)` 
                    : `✓ ${currentAtm.name} Cash Optimal (${currentAtm.cashLevel}%)`}
                </p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isCritical 
                    ? `IoT sensor detected cash dropped below 30% limit. Only ₹${(currentAtm?.cashAmount ?? 0).toLocaleString('en-IN')} remaining. Dispatch cash replenishment van immediately.`
                    : `Cash reserves stable at ₹${(currentAtm?.cashAmount ?? 0).toLocaleString('en-IN')}. Next scheduled check in 4 hours.`}
                </p>
              </div>

              {isCritical && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => navigateTo('REFILL_TEAMS')}
                    className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'பணம் நிரப்பும் வாகனம் அனுப்புக' : 'Dispatch Refill Van'}</span>
                  </button>
                  <button
                    onClick={silenceAlarm}
                    className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {language === 'ta' ? 'அலாரத்தை நிறுத்து' : 'Acknowledge'}
                  </button>
                </div>
              )}
            </div>

            {/* Manager Info Pill */}
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <span>{language === 'ta' ? 'அறிவிப்பு பெறுநர்:' : 'Alert Recipient:'}</span>
              <span className="font-semibold text-white">{managerProfile.name} ({managerProfile.designation})</span>
            </div>
          </div>

          {/* SMS Simulation & Custom Mobile Number Dispatch Tool */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-800/80 p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>{language === 'ta' ? 'மொபைல் எண் SMS எச்சரிக்கை சிமுலேட்டர்' : 'Live Mobile SMS Dispatcher'}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono font-bold">
                SMS GATEWAY ACTIVE
              </span>
            </div>

            {/* Custom Mobile Input Box */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 space-y-3">
              <label htmlFor="custom-mobile-input" className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>{language === 'ta' ? 'மொபைல் எண் உள்ளிடவும்:' : 'Enter Mobile Number:'}</span>
                <span className="text-[10px] text-cyan-400 font-mono">+91 (India)</span>
              </label>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    id="custom-mobile-input"
                    type="tel"
                    maxLength={10}
                    value={customMobile}
                    onChange={(e) => setCustomMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="9840111234"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-emerald-300 font-bold focus:outline-none focus:border-emerald-500 tracking-wider"
                  />
                </div>

                <select
                  value={selectedAlertType}
                  onChange={(e) => setSelectedAlertType(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-500"
                >
                  <option value="CRITICAL_CASH">🚨 Cash &lt; 30%</option>
                  <option value="SUSPICIOUS_TAMPER">⚠️ ATM Tamper</option>
                  <option value="WITHDRAWAL_ALERT">💳 ₹ Cash Withdrawal</option>
                  <option value="SMARTWATCH_SOS">⌚ Smartwatch SOS</option>
                </select>
              </div>

              <button
                onClick={() => {
                  const targetNum = customMobile.length === 10 ? `+91 ${customMobile}` : '+91 98401 11234';
                  let msgBody = '';
                  const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                  if (selectedAlertType === 'CRITICAL_CASH') {
                    msgBody = `[SecureGate Alert] ATM ${currentAtm.name}: Cash depleted to ${currentAtm.cashLevel}% (₹${(currentAtm?.cashAmount ?? 0).toLocaleString('en-IN')}). Replenishment van requested. Time: ${nowStr}`;
                  } else if (selectedAlertType === 'SUSPICIOUS_TAMPER') {
                    msgBody = `[CRITICAL SOS] ATM ${currentAtm.name}: Vibration / tilt sensor triggered. Security shutter locked. Police dispatched. Time: ${nowStr}`;
                  } else if (selectedAlertType === 'WITHDRAWAL_ALERT') {
                    msgBody = `[Bank Alert] ₹5,000 withdrawn from card ending **1234 at ATM ${currentAtm.name}. Available Balance: ₹87,420. Time: ${nowStr}`;
                  } else {
                    msgBody = `[SMARTWATCH SOS] User Anitha high pulse detected (112 BPM) at ATM ${currentAtm.name}. Coordinates: 13.0827° N, 80.2707° E. Time: ${nowStr}`;
                  }

                  setCustomSmsSent({
                    phone: targetNum,
                    message: msgBody,
                    time: nowStr
                  });
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/60 transition cursor-pointer"
              >
                <Send className="w-4 h-4 text-white" />
                <span>{language === 'ta' ? 'இந்த மொபைல் எண்ணிற்கு SMS அனுப்பவும் (Send SMS)' : 'Send Live SMS to Mobile Number'}</span>
              </button>
            </div>

            {/* Live Dispatched SMS Notification Bubble */}
            {customSmsSent && (
              <div className="p-3.5 rounded-xl bg-slate-950 border-2 border-emerald-500/80 shadow-lg space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold text-emerald-400">
                      ✓ SMS DELIVERED TO: {customSmsSent.phone}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{customSmsSent.time}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-200 leading-relaxed">
                  {customSmsSent.message}
                </div>
              </div>
            )}

            {/* Default Automated SMS Log */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed">
              [CashGuard AI - AUTOMATED GATEWAY]<br />
              ATM: {currentAtm.name} ({currentAtm.id})<br />
              STATUS: {isCritical ? 'CRITICAL < 30%' : isWarning ? 'LOW CASH WARNING' : 'NORMAL'}<br />
              CASH LEVEL: {currentAtm.cashLevel}% (₹{(currentAtm?.cashAmount ?? 0).toLocaleString('en-IN')})<br />
              RECIPIENT: {customMobile.length === 10 ? `+91 ${customMobile}` : '+91 98401 11234'}<br />
              ACTION: {isCritical ? 'DISPATCH CASH VAN IMMEDIATELY' : 'REAL-TIME MONITORING'}
            </div>

            <p className="text-[11px] text-slate-400">
              {language === 'ta' 
                ? 'உங்கள் மொபைல் எண்ணை மேலே உள்ளிட்டு உடனுக்குடன் நேரடி SMS எச்சரிக்கைகளை சோதனை செய்து கொள்ளலாம்.' 
                : 'Enter any 10-digit mobile number above to test live automated sensor alerts & instant SMS dispatches.'}
            </p>
          </div>

          {/* Navigation link to other views */}
          <div className="space-y-2">
            <button
              onClick={() => navigateTo('DASHBOARD')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-xs font-bold cursor-pointer"
            >
              <span>{language === 'ta' ? 'மேனேஜர் டாஷ்போர்டு பார்க்க' : 'Back to Fleet Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo('REFILL_TEAMS')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-xs font-bold cursor-pointer"
            >
              <span>{language === 'ta' ? 'பணம் நிரப்பும் வாகனங்களை கண்காணிக்க' : 'Track Armored Cash Vans'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
