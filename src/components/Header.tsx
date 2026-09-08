import React from 'react';
import {
  ShieldCheck,
  Bell,
  Volume2,
  VolumeX,
  Sparkles,
  Sliders,
  Languages,
  AlertTriangle,
  Radio,
  Truck,
  Landmark,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

interface HeaderProps {
  onToggleDemoDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleDemoDrawer }) => {
  const {
    liveDateTime,
    soundOn,
    setSoundOn,
    voiceLanguage,
    setVoiceLanguage,
    voiceSpeed,
    setVoiceSpeed,
    voiceMuted,
    setVoiceMuted,
    isSpeaking,
    replayCurrentVoice,
    currentVoiceKey,
    navigateTo,
    activeAlarmAtm,
    silenceAlarm,
    isSirenAudible,
    notifications,
    managerProfile,
    language,
    setLanguage,
    setShowCriticalModal,
    setIsManagerLoginOpen,
    setIsVoiceSettingsOpen,
    setIsHowItWorksOpen
  } = useSecurity();

  const unreadNotifsCount = notifications.filter(n => !n.isAcknowledged).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-md transition-colors text-slate-100 shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        
        {/* Logo & System Brand: CashGuard AI */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo('DASHBOARD')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20 ring-1 ring-white/20 shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-extrabold tracking-tight text-white font-sans">
                CashGuard <span className="text-blue-400">AI</span>
              </span>
              <span className="rounded-full bg-blue-950 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30">
                IoT Sensor v3.1
              </span>
            </div>
            <p className="text-[11px] text-blue-300/90 font-serif italic hidden sm:block">
              “பணம் தீரும் முன்பே தெரியும்.”
            </p>
          </div>
        </div>

        {/* Center: Live Alarm Banner or Normal IoT Status */}
        <div className="hidden lg:flex items-center space-x-3">
          {activeAlarmAtm ? (
            <button
              onClick={() => setShowCriticalModal(true)}
              className="flex items-center space-x-2 rounded-full border border-red-500/80 bg-red-950/70 px-3.5 py-1.5 text-xs font-bold text-red-200 animate-pulse shadow-md shadow-red-950/60 cursor-pointer hover:bg-red-900/80"
              title="Click to open Emergency Alarm Details"
            >
              <ShieldAlert className="w-4 h-4 text-red-400 animate-bounce" />
              <span>
                {language === 'ta'
                  ? `🚨 அவசர அலாரம்: ${activeAlarmAtm.name} (${activeAlarmAtm.cashLevel}% < 30%)`
                  : `🚨 CRITICAL ALARM: ${activeAlarmAtm.name} (${activeAlarmAtm.cashLevel}% < 30%)`}
              </span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="font-semibold tracking-wide">
                {language === 'ta' ? '8 ATM சென்சார்கள் நேரலையில்' : 'ALL 8 ATM SENSORS OPTIMAL'}
              </span>
            </div>
          )}

          <div className="flex flex-col text-right pl-2">
            <span className="text-[11px] text-slate-400">
              {liveDateTime.date}
            </span>
            <span className="text-xs font-mono font-bold text-blue-400">
              {liveDateTime.timeWithSeconds}
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          
          {/* How It Works Guide Button */}
          <button
            onClick={() => setIsHowItWorksOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-bold transition shadow-sm cursor-pointer"
            title={language === 'ta' ? '💡 ஆப் எப்படி இயங்குகிறது? (வழிகாட்டி)' : '💡 How It Works Guide'}
          >
            <HelpCircle className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">{language === 'ta' ? 'எப்படி இயங்குகிறது?' : 'Guide'}</span>
          </button>

          {/* Quick Sensor Simulator Button */}
          <button
            onClick={() => navigateTo('SENSOR_SIMULATOR')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600/90 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
            title="IoT Cash Drain & Alarm Simulator"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{language === 'ta' ? 'சென்சார் டெஸ்ட்' : 'Simulator'}</span>
          </button>

          {/* Bilingual Voice Language Selector: English / தமிழ் */}
          <div
            className="flex items-center rounded-xl border border-slate-700/80 bg-slate-800/90 p-1 text-xs shadow-sm"
            title="Language / மொழி: தமிழ் / English"
          >
            <button
              onClick={() => setLanguage('ta')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                language === 'ta'
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="தமிழ் இடைமுகம் மற்றும் குரல்"
            >
              <span className="text-[11px]">🇮🇳</span>
              <span>தமிழ்</span>
            </button>

            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                language === 'en'
                  ? 'bg-blue-500/25 text-blue-300 border border-blue-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="English interface and voice"
            >
              <span className="text-[11px]">🇬🇧</span>
              <span>EN</span>
            </button>
          </div>

          {/* Voice Adjust & Tuning Button */}
          <button
            onClick={() => setIsVoiceSettingsOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-cyan-500/40 bg-slate-800/90 hover:bg-cyan-950/60 text-cyan-300 hover:text-white text-xs font-bold transition shadow-sm cursor-pointer"
            title={language === 'ta' ? 'குரல் வழிகாட்டுதல் சரிசெய்தல் (வேகம், ஒலி அளவு, தனித்தனி அறிவிப்புகள்)' : 'Adjust Voice Guidance (Volume, Speed, Screen Prompts)'}
          >
            <Sliders className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden lg:inline">{language === 'ta' ? 'குரல் சரிசெய்' : 'Voice Adjust'}</span>
          </button>

          {/* Speaker / Replay Button */}
          <button
            onClick={() => {
              if (voiceMuted) setVoiceMuted(false);
              replayCurrentVoice();
            }}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition shadow-sm cursor-pointer ${
              isSpeaking
                ? 'border-blue-400 bg-blue-500/20 text-blue-300 ring-2 ring-blue-400/30 animate-pulse'
                : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title="Replay Voice Guidance (குரல் வழிகாட்டுதல்)"
          >
            <Volume2 className={`h-4 w-4 ${isSpeaking ? 'text-blue-300 animate-bounce' : 'text-blue-400'}`} />
          </button>

          {/* Siren & Sound Mute Toggle */}
          <button
            onClick={() => {
              if (isSirenAudible) {
                silenceAlarm();
              }
              const newMuted = !voiceMuted;
              setVoiceMuted(newMuted);
              setSoundOn(!newMuted);
            }}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition cursor-pointer ${
              !isSirenAudible || voiceMuted
                ? 'border-rose-500/40 bg-rose-950/60 text-rose-400'
                : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title={isSirenAudible ? 'Mute Audio / Silence Siren' : 'Unmute Audio & Siren'}
          >
            {!isSirenAudible || voiceMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 opacity-80" />}
          </button>

          {/* Notifications Inbox Bell */}
          <button
            onClick={() => navigateTo('NOTIFICATIONS')}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition cursor-pointer"
            title="Manager Alarms & Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Bank Manager Profile Info */}
          <button
            onClick={() => setIsManagerLoginOpen(true)}
            className="hidden md:flex items-center space-x-2 pl-1 hover:bg-slate-800 p-1 rounded-xl transition cursor-pointer"
            title="Switch Manager Profile / Re-Authenticate"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs shadow-xs">
              M
            </div>
            <div className="text-left text-xs">
              <span className="font-bold text-white block leading-tight">{managerProfile.name}</span>
              <span className="text-[10px] text-slate-400 leading-none">{managerProfile.designation}</span>
            </div>
          </button>

        </div>
      </div>

      {/* Mobile Sub-Header with Active Alarm Banner */}
      {activeAlarmAtm && (
        <div 
          onClick={() => setShowCriticalModal(true)}
          className="flex lg:hidden items-center justify-between border-t border-red-500/60 bg-red-950/90 px-4 py-1.5 text-xs text-red-200 cursor-pointer animate-pulse"
        >
          <div className="flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="font-bold">{activeAlarmAtm.name} Cash &lt; 30% ({activeAlarmAtm.cashLevel}%)</span>
          </div>
          <span className="text-[10px] underline font-bold">Open Alert</span>
        </div>
      )}
    </header>
  );
};
