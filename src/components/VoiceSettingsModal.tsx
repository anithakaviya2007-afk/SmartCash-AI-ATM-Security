import React from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  Gauge,
  Music,
  Check,
  RotateCcw,
  Landmark,
  ShieldCheck,
  CreditCard,
  ScanFace,
  KeyRound,
  Banknote,
  AlertTriangle,
  Radio,
  Truck
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { VoiceGuidanceKey, unlockAudioAndVoice } from '../utils/voiceGuidance';

export const VoiceSettingsModal: React.FC = () => {
  const {
    isVoiceSettingsOpen,
    setIsVoiceSettingsOpen,
    voiceLanguage,
    setVoiceLanguage,
    voiceSpeed,
    setVoiceSpeed,
    voiceVolume,
    setVoiceVolume,
    voicePitch,
    setVoicePitch,
    voiceMuted,
    setVoiceMuted,
    autoAnnounceScreen,
    setAutoAnnounceScreen,
    isSpeaking,
    speakGuidance,
    stopSpeech,
    language
  } = useSecurity();

  if (!isVoiceSettingsOpen) return null;

  const handleTestVoice = () => {
    unlockAudioAndVoice();
    if (voiceMuted) setVoiceMuted(false);
    speakGuidance('VOICE_TEST');
  };

  const handleAuditionPrompt = (key: VoiceGuidanceKey) => {
    unlockAudioAndVoice();
    if (voiceMuted) setVoiceMuted(false);
    speakGuidance(key);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-100 shadow-2xl shadow-cyan-950/50 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 shadow-inner">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <span>{language === 'ta' ? 'குரல் வழிகாட்டுதல் சரிசெய்தல்' : 'Voice Guidance Settings & Tuning'}</span>
                {isSpeaking && (
                  <span className="inline-flex items-center space-x-0.5 ml-2 text-cyan-400">
                    <span className="h-2 w-0.5 bg-cyan-400 animate-pulse"></span>
                    <span className="h-3.5 w-0.5 bg-cyan-400 animate-pulse delay-75"></span>
                    <span className="h-2.5 w-0.5 bg-cyan-400 animate-pulse delay-150"></span>
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'ta'
                  ? 'ஒலி அளவு, வேகம் மற்றும் ஒவ்வொரு திரைக்குமான பிரத்யேக குரல் அமைப்புகள்'
                  : 'Volume, speed, pitch, and dedicated per-screen voice prompts'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVoiceSettingsOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-sm">
          
          {/* 1. Language Switcher (தமிழ் / English) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-850/60 p-4 space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>{language === 'ta' ? '1. வழிகாட்டும் மொழி' : '1. Voice Language'}</span>
              <span className="text-[11px] font-normal text-cyan-400">
                {voiceLanguage === 'ta' ? 'தமிழ் (Natural Tamil ta-IN)' : 'English (en-IN)'}
              </span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  unlockAudioAndVoice();
                  setVoiceLanguage('ta');
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition font-bold text-xs cursor-pointer ${
                  voiceLanguage === 'ta'
                    ? 'border-amber-500/80 bg-amber-950/40 text-amber-200 ring-2 ring-amber-500/30'
                    : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-base">🇮🇳</span>
                  <span>தமிழ் (Tamil)</span>
                </div>
                {voiceLanguage === 'ta' && <Check className="h-4 w-4 text-amber-400" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  unlockAudioAndVoice();
                  setVoiceLanguage('en');
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition font-bold text-xs cursor-pointer ${
                  voiceLanguage === 'en'
                    ? 'border-cyan-500/80 bg-cyan-950/40 text-cyan-200 ring-2 ring-cyan-500/30'
                    : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-base">🇬🇧</span>
                  <span>English (Natural)</span>
                </div>
                {voiceLanguage === 'en' && <Check className="h-4 w-4 text-cyan-400" />}
              </button>
            </div>
          </div>

          {/* 2. Volume Adjust Slider & Presets */}
          <div className="rounded-2xl border border-slate-800 bg-slate-850/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-cyan-400" />
                <span>{language === 'ta' ? '2. ஒலி அளவு (Volume)' : '2. Speech Volume'}</span>
              </label>
              <span className="text-xs font-mono font-bold text-cyan-300">
                {voiceMuted ? (language === 'ta' ? 'முடக்கப்பட்டுள்ளது (Muted)' : 'Muted (0%)') : `${Math.round(voiceVolume * 100)}%`}
              </span>
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={voiceMuted ? 0 : voiceVolume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (val === 0) {
                  setVoiceMuted(true);
                } else {
                  if (voiceMuted) setVoiceMuted(false);
                  setVoiceVolume(val);
                }
              }}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />

            {/* Quick Volume Preset Pills */}
            <div className="flex items-center justify-between gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => setVoiceMuted(!voiceMuted)}
                className={`flex-1 py-1.5 rounded-lg border text-center font-bold transition cursor-pointer ${
                  voiceMuted
                    ? 'border-rose-500 bg-rose-950/60 text-rose-300'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {voiceMuted ? (language === 'ta' ? '🔇 முடக்கம்' : '🔇 Muted') : (language === 'ta' ? 'ஒலி முடக்கு' : 'Mute')}
              </button>

              <button
                type="button"
                onClick={() => {
                  setVoiceMuted(false);
                  setVoiceVolume(0.4);
                }}
                className={`flex-1 py-1.5 rounded-lg border text-center font-bold transition cursor-pointer ${
                  !voiceMuted && Math.abs(voiceVolume - 0.4) < 0.08
                    ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                40% {language === 'ta' ? 'மெலிது' : 'Low'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setVoiceMuted(false);
                  setVoiceVolume(0.75);
                }}
                className={`flex-1 py-1.5 rounded-lg border text-center font-bold transition cursor-pointer ${
                  !voiceMuted && Math.abs(voiceVolume - 0.75) < 0.08
                    ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                75% {language === 'ta' ? 'நடுத்தரம்' : 'Medium'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setVoiceMuted(false);
                  setVoiceVolume(1.0);
                }}
                className={`flex-1 py-1.5 rounded-lg border text-center font-bold transition cursor-pointer ${
                  !voiceMuted && voiceVolume >= 0.95
                    ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                100% {language === 'ta' ? 'முழு ஒலி' : 'Max'}
              </button>
            </div>
          </div>

          {/* 3. Speech Speed (Rate) Adjust */}
          <div className="rounded-2xl border border-slate-800 bg-slate-850/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <Gauge className="h-4 w-4 text-cyan-400" />
                <span>{language === 'ta' ? '3. பேசும் வேகம் (Speed / Tempo)' : '3. Speech Rate / Speed'}</span>
              </label>
              <span className="text-xs font-mono font-bold text-cyan-300">
                {voiceSpeed.toFixed(2)}x
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0.75"
              max="1.35"
              step="0.05"
              value={voiceSpeed}
              onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />

            {/* Speed Presets */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => setVoiceSpeed(0.80)}
                className={`py-2 px-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center ${
                  voiceSpeed <= 0.88
                    ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 ring-1 ring-cyan-400'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <span className="font-bold">0.80x • {language === 'ta' ? 'மெதுவாக' : 'Slow'}</span>
                <span className="text-[10px] text-slate-400">{language === 'ta' ? 'தெளிவான உச்சரிப்பு' : 'Clear Tamil'}</span>
              </button>

              <button
                type="button"
                onClick={() => setVoiceSpeed(0.95)}
                className={`py-2 px-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center ${
                  voiceSpeed > 0.88 && voiceSpeed <= 1.05
                    ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 ring-1 ring-cyan-400'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <span className="font-bold">0.95x • {language === 'ta' ? 'சரியான வேகம்' : 'Normal'}</span>
                <span className="text-[10px] text-slate-400">{language === 'ta' ? 'இயல்பான வங்கி நடை' : 'Natural flow'}</span>
              </button>

              <button
                type="button"
                onClick={() => setVoiceSpeed(1.20)}
                className={`py-2 px-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center ${
                  voiceSpeed > 1.05
                    ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 ring-1 ring-cyan-400'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <span className="font-bold">1.20x • {language === 'ta' ? 'வேகமாக' : 'Fast'}</span>
                <span className="text-[10px] text-slate-400">{language === 'ta' ? 'விரைவு சுருக்கம்' : 'Quick briefing'}</span>
              </button>
            </div>
          </div>

          {/* 4. Auto-Announce Switch when switching screens */}
          <div className="rounded-2xl border border-slate-800 bg-slate-850/60 p-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-white text-xs sm:text-sm flex items-center space-x-2">
                <span>{language === 'ta' ? 'திரை மாறும்போது தானாக குரல் அறிவிக்க' : 'Auto-Announce on Screen Switch'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-500/30">
                  {autoAnnounceScreen ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {language === 'ta'
                  ? 'Dashboard சென்றால் Dashboard பற்றி பேசும், ATM சென்றால் ATM பற்றி தனித்தனியாக தானாக அறிவிக்கும்.'
                  : 'Automatically speaks the dedicated prompt when you navigate between Dashboard, ATM, Sensors, etc.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAutoAnnounceScreen(!autoAnnounceScreen)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoAnnounceScreen ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  autoAnnounceScreen ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 5. Separate Section Voices Audition Grid ("தனியா தனியா kudu") */}
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                  <Sparkles className="h-4 w-4" />
                  <span>{language === 'ta' ? 'தனித்தனி குரல் சோதனைப் பலகை (Per-Screen Audio)' : 'Section-Specific Voice Audition'}</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {language === 'ta'
                    ? 'ஒவ்வொரு பக்கத்திலும் பேசப்படும் குறிப்பிட்ட குரலை இங்கேயே தனித்தனியாக கேட்டுச் சோதிக்கலாம்:'
                    : 'Click any section to audition its exact separate voice prompt:'}
                </p>
              </div>

              {/* General Test Button */}
              <button
                type="button"
                onClick={handleTestVoice}
                className="px-3 py-1.5 rounded-xl border border-cyan-400 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-sm"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>{language === 'ta' ? 'குரல் சோதனை' : 'Test Voice'}</span>
              </button>
            </div>

            {/* Grid of separate screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              
              {/* Dashboard */}
              <button
                type="button"
                onClick={() => handleAuditionPrompt('NAV_DASHBOARD')}
                className="flex items-start space-x-3 p-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-750 hover:border-cyan-500/50 transition text-left cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-lg bg-blue-900/60 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-white block">📊 Dashboard (கட்டுப்பாட்டு மையம்)</span>
                  <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    "பாதுகாப்பு கட்டுப்பாட்டு மையம். ஏடிஎம் பண இருப்பு..."
                  </span>
                </div>
              </button>

              {/* ATM Terminal */}
              <button
                type="button"
                onClick={() => handleAuditionPrompt('WELCOME_GREETING')}
                className="flex items-start space-x-3 p-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-750 hover:border-cyan-500/50 transition text-left cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition">
                  <Landmark className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-white block">🏧 ATM Kiosk (ஏடிஎம் முனையம்)</span>
                  <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    "SecureGate ஏடிஎம்மிற்கு வரவேற்கிறோம்..."
                  </span>
                </div>
              </button>

              {/* Card Scan */}
              <button
                type="button"
                onClick={() => handleAuditionPrompt('STEP1_CARD_PROMPT')}
                className="flex items-start space-x-3 p-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-750 hover:border-cyan-500/50 transition text-left cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-lg bg-indigo-900/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-105 transition">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-white block">💳 Step 1: Card Scan (கார்டு ஸ்கேன்)</span>
                  <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    "தயவுசெய்து உங்கள் ஏடிஎம் கார்டை உள்ளிடவும்..."
                  </span>
                </div>
              </button>

              {/* Face Recognition */}
              <button
                type="button"
                onClick={() => handleAuditionPrompt('STEP2_FACE_PROMPT')}
                className="flex items-start space-x-3 p-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-750 hover:border-cyan-500/50 transition text-left cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-lg bg-cyan-900/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition">
                  <ScanFace className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-white block">👤 Step 2: Face Scan (முக அங்கீகாரம்)</span>
                  <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    "தயவுசெய்து கேமராவை நேராகப் பார்த்து..."
                  </span>
                </div>
              </button>

              {/* PIN Verification */}
              <button
                type="button"
                onClick={() => handleAuditionPrompt('STEP3_PIN_PROMPT')}
                className="flex items-start space-x-3 p-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-750 hover:border-cyan-500/50 transition text-left cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-lg bg-amber-900/60 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-white block">🔢 Step 3: PIN (ரகசிய பின்)</span>
                  <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    "தயவுசெய்து உங்கள் ஆறு இலக்க ரகசிய பின்னை..."
                  </span>
                </div>
              </button>

              {/* Cash Withdrawal */}
              <button
                type="button"
                onClick={() => handleAuditionPrompt('STEP5_WITHDRAWAL_PROMPT')}
                className="flex items-start space-x-3 p-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-750 hover:border-cyan-500/50 transition text-left cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition">
                  <Banknote className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-white block">💵 Step 5: Cash (பணம் எடுத்தல்)</span>
                  <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    "நீங்கள் எடுக்க விரும்பும் பணத் தொகையை..."
                  </span>
                </div>
              </button>

              {/* 30% Critical Alarm */}
              <button
                type="button"
                onClick={() => handleAuditionPrompt('CRITICAL_CASH_ALARM')}
                className="flex items-start space-x-3 p-3 rounded-xl border border-red-500/40 bg-red-950/40 hover:bg-red-900/40 transition text-left cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-lg bg-red-900/80 border border-red-500/50 flex items-center justify-center text-red-300 shrink-0 group-hover:scale-105 transition">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-red-300 block">🚨 30% Cash Alarm (அவசர அலாரம்)</span>
                  <span className="text-[11px] text-red-400 line-clamp-1 mt-0.5">
                    "அவசர எச்சரிக்கை! ஏடிஎம்மில் பணம் 30% குறைந்துள்ளது..."
                  </span>
                </div>
              </button>

              {/* Sensor Simulator */}
              <button
                type="button"
                onClick={() => handleAuditionPrompt('NAV_SENSORS')}
                className="flex items-start space-x-3 p-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-750 hover:border-cyan-500/50 transition text-left cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-lg bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition">
                  <Radio className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-white block">📡 IoT Sensors (சென்சார் களம்)</span>
                  <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    "ஐஓடி சென்சார் சோதனைக் களம்..."
                  </span>
                </div>
              </button>

            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-t border-slate-800 bg-slate-900 shrink-0">
          <button
            type="button"
            onClick={stopSpeech}
            className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition cursor-pointer flex items-center space-x-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{language === 'ta' ? 'குரலை நிறுத்து (Stop)' : 'Stop Speech'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsVoiceSettingsOpen(false)}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition shadow-lg shadow-cyan-950 cursor-pointer"
          >
            {language === 'ta' ? 'சரி / முடிந்தது (Done)' : 'Apply & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
