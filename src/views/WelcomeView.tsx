import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  ScanFace,
  KeyRound,
  ArrowRight,
  Shield,
  Lock,
  Landmark,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Banknote,
  ShieldAlert,
  Volume2,
  Languages,
  Truck,
  MapPin,
  AlertCircle,
  QrCode,
  Smartphone,
  X,
  PhoneCall,
  Radio,
  Mic,
  Hand,
  Receipt,
  Send,
  Sparkles,
  Bot,
  Share2,
  Eye,
  Zap,
  Wifi,
  Camera
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { AtmMachineKiosk } from '../components/AtmMachineKiosk';
import { VoiceGuidancePromptBar } from '../components/VoiceGuidancePromptBar';

export const WelcomeView: React.FC = () => {
  const {
    startVerification,
    navigateTo,
    liveDateTime,
    setIsAdmin,
    triggerStolenCardDemoScenario,
    testFaceScanner,
    users,
    activeUser,
    voiceLanguage,
    setVoiceLanguage,
    speakGuidance,
    isSpeaking,
    atms,
    selectedAtm,
    setSelectedAtm,
    updateAtmCashLevel,
    openRefillModal,
    language,
    speakItem,
    readAloudNonReaders,
    setReadAloudNonReaders
  } = useSecurity();

  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const [showUpiModal, setShowUpiModal] = useState<boolean>(false);
  const [showSosModal, setShowSosModal] = useState<boolean>(false);
  const [upiStep, setUpiStep] = useState<'QR' | 'SCANNING' | 'PIN' | 'SUCCESS'>('QR');
  const [upiPinInput, setUpiPinInput] = useState<string>('');
  const [upiAmount, setUpiAmount] = useState<number>(2000);

  // New High-Tech Interactive Features State
  const [showVoiceAiModal, setShowVoiceAiModal] = useState<boolean>(false);
  const [voiceQueryInput, setVoiceQueryInput] = useState<string>('');
  const [voiceAiAnswer, setVoiceAiAnswer] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);

  const [showPalmScanModal, setShowPalmScanModal] = useState<boolean>(false);
  const [palmScanStatus, setPalmScanStatus] = useState<'IDLE' | 'SCANNING' | 'SUCCESS'>('IDLE');

  const [showEReceiptModal, setShowEReceiptModal] = useState<boolean>(false);
  const [receiptPhone, setReceiptPhone] = useState<string>('9876543210');
  const [receiptSent, setReceiptSent] = useState<boolean>(false);

  // Additional Futuristic Security Features
  const currentAtm = selectedAtm || atms[0];
  const isCashDepleted = currentAtm ? currentAtm.cashLevel === 0 : false;
  const isLowCash = currentAtm ? currentAtm.cashLevel < 30 : false;

  const handleStartAttempt = () => {
    if (isCashDepleted) {
      setToastNotice(
        language === 'ta'
          ? '⚠️ தற்காலிகமாக பணம் இருப்பு இல்லை! இந்த முனையத்தில் பணம் தீர்ந்துவிட்டதால் பணத்தை எடுக்க இயலாது. அருகிலுள்ள ATM-க்கு செல்லவும் அல்லது மேனேஜர் ரீஃபில் செய்யவும்.'
          : '⚠️ Cash Not Available! This ATM vault is depleted (0%). Please visit the nearest operational ATM or request a manager refill.'
      );
      setTimeout(() => setToastNotice(null), 6000);
      return;
    }
    startVerification();
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white flex flex-col justify-between p-4 sm:p-8 overflow-hidden">
      
      {/* Background Tech Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.15),transparent)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Status Strip */}
      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
            <Landmark className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight font-mono text-white">
              Secure<span className="text-cyan-400">Gate</span> ATM Terminal
            </h1>
            <p className="text-[11px] text-blue-200/70">
              Multi-Factor Authentication & Anti-Theft Protection
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-semibold tracking-wider font-mono text-[11px]">ATM TERMINAL #01 ONLINE</span>
          </div>

          <div className="text-right font-mono text-xs text-slate-300 hidden sm:block">
            <div>{liveDateTime.date}</div>
            <div className="text-cyan-400 font-bold">{liveDateTime.timeWithSeconds}</div>
          </div>
        </div>
      </div>

      {/* Hero Body Content */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto py-6 sm:py-8 text-center">
        
        {/* Dedicated Voice Guidance Prompt for ATM Home */}
        <VoiceGuidancePromptBar currentKey="WELCOME_GREETING" className="mb-4 text-left" />

        {/* CashGuard IoT Telemetry & ATM Terminal Selector Strip */}
        <div className="mb-6 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3.5 space-y-3 backdrop-blur-md shadow-xl text-left">
          
          {/* Machine Selection Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                {language === 'ta' ? '📍 ஏடிஎம் முனையம் தேர்வு செய்க:' : '📍 Select ATM Terminal:'}
              </span>
              <span className={`w-2.5 h-2.5 rounded-full ${isCashDepleted ? 'bg-red-500 animate-ping' : isLowCash ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
              <span className="text-xs font-mono font-black text-white">
                {currentAtm.name} ({currentAtm.location})
              </span>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${isCashDepleted ? 'bg-red-950 text-red-400 border border-red-700' : isLowCash ? 'bg-amber-950 text-amber-400 border border-amber-700' : 'bg-emerald-950 text-emerald-400 border border-emerald-700'}`}>
                {currentAtm?.cashLevel}% ({isCashDepleted ? 'CASH NOT AVAILABLE' : `₹${(currentAtm?.cashAmount ?? 0).toLocaleString('en-IN')}`})
              </span>
            </div>

            {/* Quick Sensor Simulator Buttons */}
            <div className="flex items-center flex-wrap gap-1.5 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-mono mr-1">Sensor Test:</span>
              <button
                onClick={() => {
                  updateAtmCashLevel(currentAtm.id, 85);
                  speakGuidance('SENSOR_LEVEL_SET');
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${currentAtm.cashLevel >= 70 ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                🟢 85% Cash
              </button>
              <button
                onClick={() => {
                  updateAtmCashLevel(currentAtm.id, 20);
                  speakGuidance('LOW_CASH_WARNING');
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${currentAtm.cashLevel > 0 && currentAtm.cashLevel < 30 ? 'bg-amber-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                🔴 20% Low
              </button>
              <button
                onClick={() => {
                  updateAtmCashLevel(currentAtm.id, 0);
                  speakGuidance('CASH_NOT_AVAILABLE');
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${currentAtm.cashLevel === 0 ? 'bg-red-600 text-white animate-pulse shadow-lg' : 'bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900'}`}
              >
                ⚠️ 0% Out of Cash
              </button>
            </div>
          </div>

          {/* ATM Fleet Selector Pills */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {atms.map(atm => {
              const isSelected = currentAtm.id === atm.id;
              const isEmpty = atm.cashLevel === 0;
              return (
                <button
                  key={atm.id}
                  onClick={() => {
                    setSelectedAtm(atm);
                    if (atm.cashLevel === 0) {
                      speakGuidance('CASH_NOT_AVAILABLE');
                    } else {
                      speakGuidance('ATM_SWITCHED');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer flex items-center space-x-1.5 border ${
                    isSelected
                      ? isEmpty
                        ? 'bg-red-950 text-red-300 border-red-500 ring-2 ring-red-500/50'
                        : 'bg-blue-600 text-white border-blue-400 shadow-lg'
                      : isEmpty
                      ? 'bg-red-950/40 text-red-400 border-red-900/60 hover:bg-red-900/40'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isEmpty ? 'bg-red-500 animate-ping' : atm.cashLevel < 30 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <span>{atm.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isEmpty ? 'bg-red-900 text-white font-black' : 'bg-black/40 text-slate-300'}`}>
                    {isEmpty ? '0% EMPTY' : `${atm.cashLevel}%`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CASH NOT AVAILABLE PROMPT DISPLAY ON FRONT SCREEN */}
        {isCashDepleted && (
          <div className="mb-6 rounded-3xl border-4 border-red-500 bg-gradient-to-b from-red-950 via-rose-950 to-slate-950 p-6 text-center backdrop-blur-xl shadow-2xl shadow-red-600/50 animate-pulse ring-4 ring-red-500/30">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-widest mb-3 animate-bounce shadow-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-300" />
              <span>{language === 'ta' ? `🚨 நேரலை எச்சரிக்கை: ${currentAtm.name} - பணம் இருப்பு இல்லை` : `🚨 LIVE ALERT: ${currentAtm.name} - CASH NOT AVAILABLE`}</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase drop-shadow-md">
              🚫 {language === 'ta' ? 'CASH NOT AVAILABLE (பணம் இல்லை)' : 'CASH NOT AVAILABLE'}
            </h3>

            <div className="mt-3 py-3 px-4 rounded-2xl bg-black/70 border border-red-500/50 max-w-2xl mx-auto space-y-1">
              <p className="text-base sm:text-xl font-extrabold text-yellow-300 leading-snug">
                {language === 'ta'
                  ? `இந்த ஏடிஎம்மில் (${currentAtm.name}) பணம் இல்லை! தயவுசெய்து கார்டை உள்ளிட வேண்டாம்!`
                  : `NO CASH IN THIS ATM (${currentAtm.name})! PLEASE DO NOT INSERT YOUR CARD!`}
              </p>
              <p className="text-xs sm:text-sm text-red-200 font-mono">
                {language === 'ta'
                  ? 'CashGuard IoT சென்சார்கள் மூலமாக வங்கி மேலாளருக்கு எச்சரிக்கை அனுப்பப்பட்டு, பணம் நிரப்பும் வாகனம் கிளம்பியுள்ளது.'
                  : 'CashGuard IoT Sensors triggered auto-dispatch for armored cash transit team.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-red-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-left space-y-0.5">
                <span className="text-red-300 font-bold block">
                  📍 {language === 'ta' ? 'பணம் உள்ள அருகிலுள்ள ஏடிஎம்:' : 'Nearest Operational ATM with Cash:'}
                </span>
                <span className="text-white font-extrabold text-sm font-mono">
                  {atms.find(a => a.cashLevel > 0)?.name || 'Anna Nagar West Hub'} ({atms.find(a => a.cashLevel > 0)?.cashLevel || 86}% Cash • Available)
                </span>
              </div>
              <div className="flex flex-wrap items-center space-x-2">
                {atms.find(a => a.cashLevel > 0) && (
                  <button
                    onClick={() => setSelectedAtm(atms.find(a => a.cashLevel > 0) || null)}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition cursor-pointer shadow-lg text-xs"
                  >
                    🔄 {language === 'ta' ? 'பணம் உள்ள ATM-க்கு மாறு' : 'Switch to Working ATM'}
                  </button>
                )}
                <button
                  onClick={() => navigateTo('ATM_MAP')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition cursor-pointer shadow-lg text-xs"
                >
                  🗺️ {language === 'ta' ? 'ஏடிஎம் மேப் பார்க்க' : 'Find Cash ATMs'}
                </button>
                <button
                  onClick={() => openRefillModal(currentAtm.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition cursor-pointer shadow-lg text-xs"
                >
                  🚚 {language === 'ta' ? 'பணம் நிரப்ப (Refill 100%)' : 'Manager Refill'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Temporary Toast Notice */}
        {toastNotice && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-950 border border-amber-600 text-amber-200 text-xs font-bold flex items-center justify-between shadow-lg">
            <span>{toastNotice}</span>
            <button onClick={() => setToastNotice(null)} className="ml-2 text-white font-bold cursor-pointer">✕</button>
          </div>
        )}

        {/* Badge */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 mb-6 backdrop-blur-md">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span>
            {language === 'ta'
              ? 'கார்டு வாசிப்பு + வங்கி முகத் தரவுத்தளம் + 6-இலக்க PIN பாதுகாப்பு'
              : 'Card Insert + Registered Owner Face Scan + 6-Digit PIN Security'}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          {language === 'ta' ? 'பாதுகாப்பான ATM பணம் எடுத்தல்' : 'Secure ATM Cash Withdrawal'} <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
            {language === 'ta' ? 'அடுக்குமுறை பயோமெட்ரிக் அடையாளச் சரிபார்ப்பு' : 'Multi-Factor Identity Verification'}
          </span>
        </h2>

        {/* Subtitle / Problem & Solution */}
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {language === 'ta'
            ? 'தொலைந்த அல்லது திருடப்பட்ட ATM கார்டுகளில் இருந்து முறைகேடான பணம் எடுப்பதைத் தடுக்கிறது. SecureGate கார்டு, உரிமையாளரின் முகப் பொருத்தம் மற்றும் PIN சரிபார்த்த பின்னரே பணத்தை வழங்கும்.'
            : 'Prevent unauthorized cash withdrawals from lost or stolen ATM cards. SecureGate verifies the card, registered owner face match, and PIN before dispensing money.'}
        </p>

        {/* Bilingual Voice Guidance Selector Banner */}
        <div className="mt-6 max-w-xl mx-auto rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-3 sm:p-4 backdrop-blur-md shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 text-left">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border transition ${isSpeaking ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse' : 'bg-slate-800 border-slate-700 text-cyan-400'}`}>
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white">Voice Guidance (குரல் வழிகாட்டுதல்)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {voiceLanguage === 'ta' ? 'தமிழ் ON' : 'ENGLISH ON'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {voiceLanguage === 'ta' ? 'தமிழ் குரல் வழிகாட்டுதல் தயார்' : 'English voice assistant active for all steps'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setVoiceLanguage('ta');
                speakGuidance('WELCOME_GREETING', 'ta');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                voiceLanguage === 'ta'
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 shadow-sm'
                  : 'border border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>🇮🇳 தமிழ்</span>
            </button>

            <button
              onClick={() => {
                setVoiceLanguage('en');
                speakGuidance('WELCOME_GREETING', 'en');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                voiceLanguage === 'en'
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'border border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>🇬🇧 English</span>
            </button>
          </div>
        </div>

        {/* PHYSICAL ATM MACHINE KIOSK WITH DYNAMIC DISPLAY (Shows CASH NOT AVAILABLE when 0%) */}
        <AtmMachineKiosk
          onStartAttempt={handleStartAttempt}
          onOpenUpiModal={() => {
            if (isCashDepleted) {
              speakGuidance('CASH_NOT_AVAILABLE');
              setToastNotice(language === 'ta' ? '⚠️ ஏடிஎம்மில் பணம் இல்லை! UPI பணம் எடுப்பு தற்காலிகமாக நிறுத்தப்பட்டுள்ளது.' : '⚠️ Cash depleted! UPI withdrawal suspended.');
              setTimeout(() => setToastNotice(null), 4000);
              return;
            }
            setUpiStep('QR');
            setShowUpiModal(true);
            speakGuidance('UPI_QR_OPEN');
          }}
          onOpenSosModal={() => {
            setShowSosModal(true);
            speakGuidance('SOS_CALL_CONNECTING');
          }}
          onStolenCardDemo={triggerStolenCardDemoScenario}
          onOpenSimulator={() => navigateTo('SENSOR_SIMULATOR')}
        />

        {/* Non-Reader Accessibility Voice Bar */}
        <div className="mt-6 max-w-4xl mx-auto rounded-2xl bg-cyan-950/70 border border-cyan-500/40 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-lg">
          <div className="flex items-center space-x-2.5 text-left">
            <Volume2 className="h-5 w-5 text-cyan-400 animate-pulse shrink-0" />
            <div>
              <div className="font-bold text-cyan-200">
                {language === 'ta'
                  ? '📢 படிக்கத் தெரியாதவர்களுக்கான குரல் வழிகாட்டல் ஆன் செய்யப்பட்டுள்ளது'
                  : '📢 Non-Reader Voice Accessibility Mode Enabled'}
              </div>
              <div className="text-[11px] text-cyan-300/80">
                {language === 'ta'
                  ? 'ஏடிஎம்-ல் உள்ள ஒவ்வொரு பொத்தானையும் தொட்டால் அதுவே குரல் மூலம் தமிழில் விளக்கும்.'
                  : 'Touching or hovering any ATM button reads out what it does.'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              speakItem(
                'வணக்கம்! செக்யூர் கேட் ஏடிஎம்-க்கு வரவேற்கிறோம். முதலாவது நீல நிற பட்டன் கார்டு செலுத்தி தொடங்க. இரண்டாவது பச்சை நிற பட்டன் மொபைல் யூ.பி.ஐ கியூ.ஆர் வழியே கார்டு இல்லாமல் பணம் எடுக்க. மூன்றாவது சிவப்பு நிற பட்டன் அவசர காவல் உதவிக்கானது.',
                'Welcome to SecureGate ATM. First blue button is to insert card and begin. Second green button is cardless UPI QR withdrawal. Third red button is for emergency SOS police assistance.',
                true
              );
            }}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-bold shrink-0 cursor-pointer flex items-center space-x-1.5"
          >
            <span>🔊</span>
            <span>{language === 'ta' ? 'திரை விவரங்களைக் கேள்' : 'Hear Screen Options'}</span>
          </button>
        </div>

        {/* Primary CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              speakItem('கார்டு செலுத்தப்பட்டு பரிவர்த்தனை தொடங்குகிறது', 'Card inserted, beginning transaction');
              handleStartAttempt();
            }}
            onMouseEnter={() => speakItem('கார்டு செலுத்தி தொடங்குகின்ற நீல நிற பட்டன்', 'Insert card and start button')}
            className={`w-full sm:w-auto flex items-center justify-center space-x-3 rounded-2xl px-8 py-4 text-base font-bold text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ${
              isCashDepleted
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 shadow-red-900/40 ring-2 ring-red-500/50'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 shadow-blue-600/30 hover:shadow-cyan-500/40'
            }`}
          >
            <span>
              {isCashDepleted
                ? (language === 'ta' ? '⚠️ பணம் இருப்பு இல்லை (Cash Not Available)' : '⚠️ Cash Not Available (0% Vault)')
                : (language === 'ta' ? 'கார்டு செலுத்தி தொடங்குக (Step 1/5)' : 'Insert Card & Start (Step 1/5)')}
            </span>
            <ArrowRight className="h-5 w-5" />
          </button>

          <button
            onClick={() => {
              if (isCashDepleted) {
                speakGuidance('CASH_NOT_AVAILABLE');
                setToastNotice(language === 'ta' ? '⚠️ ஏடிஎம்மில் பணம் இல்லை! UPI பணம் எடுப்பு தற்காலிகமாக நிறுத்தப்பட்டுள்ளது.' : '⚠️ Cash depleted! UPI withdrawal suspended.');
                setTimeout(() => setToastNotice(null), 4000);
                return;
              }
              speakItem('யூ.பி.ஐ கியூ.ஆர் கோடு திரை திறக்கப்படுகிறது', 'Opening UPI QR screen');
              setUpiStep('QR');
              setShowUpiModal(true);
              speakGuidance('UPI_QR_OPEN');
            }}
            onMouseEnter={() => speakItem('கார்ட்லெஸ் யூ.பி.ஐ கியூ.ஆர் பணம் எடுக்கும் பச்சை நிற பட்டன்', 'Cardless UPI QR cash withdrawal button')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-2xl border border-emerald-500/50 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 px-6 py-4 text-sm font-bold text-emerald-300 hover:border-emerald-400 hover:text-white transition-all shadow-lg cursor-pointer"
          >
            <QrCode className="h-5 w-5 text-emerald-400 animate-pulse" />
            <span>
              {language === 'ta' ? '📱 கார்ட்லெஸ் UPI QR பணம் எடுத்தல்' : '📱 Cardless UPI QR Cash'}
            </span>
          </button>

          <button
            onClick={() => {
              speakItem('திருடப்பட்ட கார்டு சோதனை தொடங்குகிறது', 'Triggering stolen card test');
              triggerStolenCardDemoScenario();
            }}
            onMouseEnter={() => speakItem('திருடப்பட்ட கார்டு சோதனை பட்டன்', 'Stolen card test button')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-2xl border border-rose-500/40 bg-rose-950/40 px-6 py-4 text-sm font-semibold text-rose-300 backdrop-blur-md hover:bg-rose-900/60 hover:text-white transition-all shadow-lg cursor-pointer"
          >
            <ShieldAlert className="h-5 w-5 text-rose-400" />
            <span>
              {language === 'ta' ? '🚨 திருடப்பட்ட கார்டு சோதனை' : 'Stolen Card Test'}
            </span>
          </button>

          <button
            onClick={() => {
              speakItem('அவசர உதவி காவல் மையத்திற்கு அழைப்பு விடுக்கப்படுகிறது', 'Connecting to emergency police center');
              setShowSosModal(true);
              speakGuidance('SOS_CALL_CONNECTING');
            }}
            onMouseEnter={() => speakItem('அவசர உதவி காவல் அழைப்பு பட்டன்', 'Emergency SOS call button')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-2xl border border-amber-500/40 bg-amber-950/40 px-5 py-4 text-sm font-semibold text-amber-300 backdrop-blur-md hover:bg-amber-900/60 hover:text-white transition-all shadow-lg cursor-pointer"
          >
            <PhoneCall className="h-5 w-5 text-amber-400" />
            <span>
              {language === 'ta' ? '🆘 24x7 காவல் உதவி' : '🆘 SOS Emergency Call'}
            </span>
          </button>
        </div>

        {/* Secondary High-Tech Feature Shortcuts Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          <button
            onClick={() => navigateTo('NEARBY_BRANCHES')}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-emerald-500/60 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 font-extrabold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-emerald-950/50"
          >
            <Landmark className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ta' ? '🏦 அருகிலுள்ள வங்கிக் கிளைகள் (Bank Branches)' : '🏦 Nearby Bank Branches & CDMs'}</span>
          </button>

          <button
            onClick={() => navigateTo('AI_ASSISTANT')}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-indigo-500/60 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 font-extrabold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-indigo-950/50"
          >
            <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>{language === 'ta' ? '🤖 24/7 AI நிதி உதவி & அவசர மையம்' : '🤖 24/7 AI Assistant & Card Freeze'}</span>
          </button>

          <button
            onClick={() => {
              setShowVoiceAiModal(true);
              setVoiceAiAnswer(null);
            }}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
          >
            <Mic className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{language === 'ta' ? '🎙️ AI குரல் வழி உதவி (Voice Command)' : '🎙️ AI Voice Command ATM'}</span>
          </button>

          <button
            onClick={() => {
              setShowPalmScanModal(true);
              setPalmScanStatus('IDLE');
            }}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
          >
            <Hand className="w-4 h-4 text-purple-400" />
            <span>{language === 'ta' ? '🖐️ பனை கைரேகை ஸ்கேன் (Touchless Palm)' : '🖐️ Touchless Palm Biometrics'}</span>
          </button>

          <button
            onClick={() => {
              setShowEReceiptModal(true);
              setReceiptSent(false);
            }}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-teal-500/40 bg-teal-950/40 hover:bg-teal-900/60 text-teal-300 font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
          >
            <Receipt className="w-4 h-4 text-teal-400" />
            <span>{language === 'ta' ? '🎟️ வாட்ஸ்அப் இ-ரசீது (WhatsApp Receipt)' : '🎟️ WhatsApp E-Receipt'}</span>
          </button>

        </div>

        {/* 5-Step ATM Workflow Overview */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-left">
          
          {/* STEP 1: CARD INSERTION */}
          <button
            onClick={handleStartAttempt}
            className="rounded-2xl border border-blue-500/40 bg-blue-950/30 p-4 backdrop-blur-md hover:border-cyan-400 hover:bg-blue-900/40 hover:scale-[1.02] transition cursor-pointer text-left group shadow-lg shadow-blue-950/50"
            title="Click to insert card"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-cyan-400 group-hover:bg-cyan-500/30 group-hover:scale-110 transition">
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition">
                START ↗
              </span>
            </div>
            <div className="text-[10px] font-mono font-bold text-blue-400">
              {language === 'ta' ? 'படி 1 / 5' : 'STEP 1 OF 5'}
            </div>
            <h3 className="font-bold text-white text-xs mt-0.5 group-hover:text-cyan-300 transition">
              {language === 'ta' ? 'கார்டு செலுத்துதல்' : 'Insert ATM Card'}
            </h3>
            <p className="mt-1 text-[11px] text-slate-400 leading-tight">
              {language === 'ta'
                ? 'கார்டு வாசிக்கப்பட்டு வங்கித் தரவுத்தளத்தில் உரிமையாளர் முகத் தரவு பெறப்படுகிறது.'
                : 'EMV card read & registered owner face record lookup in bank DB.'}
            </p>
          </button>

          {/* STEP 2: FACE SCAN */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md hover:border-cyan-500/40 transition">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 mb-2">
              <ScanFace className="h-5 w-5" />
            </div>
            <div className="text-[10px] font-mono font-bold text-cyan-400">
              {language === 'ta' ? 'படி 2 / 5' : 'STEP 2 OF 5'}
            </div>
            <h3 className="font-bold text-white text-xs mt-0.5">
              {language === 'ta' ? 'முக ஸ்கேன் & பொருத்தம்' : 'Owner Face Scan'}
            </h3>
            <p className="mt-1 text-[11px] text-slate-400 leading-tight">
              {language === 'ta'
                ? 'நேரடி கேமரா முக ஸ்கேன் உரிமையாளரின் முகத்துடன் ஒப்பிடப்படுகிறது.'
                : 'Webcam AI facial mesh matched against registered card owner.'}
            </p>
          </div>

          {/* STEP 3: PIN VERIFICATION */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md hover:border-amber-500/40 transition">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 mb-2">
              <KeyRound className="h-5 w-5" />
            </div>
            <div className="text-[10px] font-mono font-bold text-amber-400">
              {language === 'ta' ? 'படி 3 / 5' : 'STEP 3 OF 5'}
            </div>
            <h3 className="font-bold text-white text-xs mt-0.5">
              {language === 'ta' ? 'PIN சரிபார்ப்பு' : 'PIN Verification'}
            </h3>
            <p className="mt-1 text-[11px] text-slate-400 leading-tight">
              {language === 'ta'
                ? 'குறியாக்கம் செய்யப்பட்ட 6-இலக்க ரகசிய PIN விசைப் பலகை.'
                : 'Encrypted 6-digit numeric PIN pad.'}
            </p>
          </div>

          {/* STEP 4: ACCESS DECISION */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md hover:border-purple-500/40 transition">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 mb-2">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="text-[10px] font-mono font-bold text-purple-400">
              {language === 'ta' ? 'படி 4 / 5' : 'STEP 4 OF 5'}
            </div>
            <h3 className="font-bold text-white text-xs mt-0.5">
              {language === 'ta' ? 'அணுகல் முடிவு' : 'Access Decision'}
            </h3>
            <p className="mt-1 text-[11px] text-slate-400 leading-tight">
              {language === 'ta'
                ? 'ஜீரோ டிரஸ்ட் மோசடி தடுப்பு அணுகல் அனுமதி மதிப்பீடு.'
                : 'Zero-trust multi-factor fraud gate evaluation.'}
            </p>
          </div>

          {/* STEP 5: CASH DISPENSER & SERVICES */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md hover:border-emerald-500/40 transition sm:col-span-3 lg:col-span-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 mb-2">
              <Banknote className="h-5 w-5" />
            </div>
            <div className="text-[10px] font-mono font-bold text-emerald-400">
              {language === 'ta' ? 'படி 5 / 5' : 'STEP 5 OF 5'}
            </div>
            <h3 className="font-bold text-white text-xs mt-0.5">
              {language === 'ta' ? 'பணம் எடுத்தல் & சேவை' : 'Cash Services & Dispenser'}
            </h3>
            <p className="mt-1 text-[11px] text-slate-400 leading-tight">
              {language === 'ta'
                ? 'பணம் வழங்கல், கணக்கு இருப்பு மற்றும் குறு அறிக்கை.'
                : 'Cash withdrawal, balance inquiry & mini statement.'}
            </p>
          </div>

        </div>

        {/* Real World Security Problem Highlight */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-400 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <Lock className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>
              <strong className="text-white">
                {language === 'ta' ? 'ஏன் கார்டு + முக ஸ்கேன் + PIN?' : 'Why Card + Face + PIN?'}
              </strong>{' '}
              {language === 'ta'
                ? 'கார்டு திருடப்பட்டு PIN தெரிந்தாலும், கார்டு உரிமையாளரின் முகத்துடன் ஒத்துப் போகாதவரை பணம் எடுக்க முடியாது.'
                : 'Traditional ATMs fail when cards are stolen and PINs are compromised. SecureGate blocks withdrawal unless the cardholder\'s face matches in real-time.'}
            </span>
          </div>

          <button
            onClick={() => {
              setIsAdmin(true);
              navigateTo('ADMIN_DASHBOARD');
            }}
            className="shrink-0 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
          >
            Admin Dashboard →
          </button>
        </div>

      </div>

      {/* CARDLESS UPI QR WITHDRAWAL MODAL */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 max-w-md w-full text-center relative shadow-2xl shadow-emerald-900/50">
            <button
              onClick={() => setShowUpiModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase mb-2">
              <QrCode className="w-5 h-5 animate-pulse" />
              <span>{language === 'ta' ? 'கார்ட்லெஸ் UPI QR பணம் எடுத்தல்' : 'Cardless UPI QR Cash Withdrawal'}</span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-1">
              {language === 'ta' ? 'GPay / PhonePe / Paytm மூலம் ஸ்கேன் செய்' : 'Scan via GPay / PhonePe / Paytm'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'ta' ? 'கார்டு இல்லாமல் உடனடியாக ஏடிஎம்மில் பணம் எடுக்கலாம்' : 'Instant contactless cash dispense using encrypted UPI token'}
            </p>

            {/* Select Amount Buttons */}
            {upiStep === 'QR' && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[500, 1000, 2000, 3000, 5000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setUpiAmount(amt)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                      upiAmount === amt
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            )}

            {/* Simulated Encrypted Dynamic QR Code */}
            <div className="my-3 p-4 rounded-2xl bg-white text-slate-950 flex flex-col items-center justify-center shadow-inner max-w-[240px] mx-auto border-4 border-emerald-500">
              {upiStep === 'QR' && (
                <>
                  <div className="w-36 h-36 bg-slate-950 rounded-xl p-2 flex items-center justify-center relative overflow-hidden">
                    {/* Simulated Dynamic QR Code SVG Grid */}
                    <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-white rounded-lg">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-xs ${
                            i % 2 === 0 || i % 5 === 0 ? 'bg-slate-900' : i % 3 === 0 ? 'bg-emerald-600' : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 border-2 border-emerald-400/80 animate-pulse rounded-xl" />
                  </div>
                  <span className="mt-2 text-[10px] font-mono font-bold text-slate-700 uppercase">
                    DYNAMIC TOKEN: ₹{upiAmount.toLocaleString('en-IN')}
                  </span>
                </>
              )}

              {upiStep === 'SCANNING' && (
                <div className="py-6 text-center space-y-3">
                  <Smartphone className="w-12 h-12 text-emerald-600 animate-bounce mx-auto" />
                  <p className="text-xs font-bold text-slate-900 font-mono">
                    {language === 'ta' ? 'மொபைலில் QR ஸ்கேன் செய்யப்பட்டது...' : 'QR Scanned on Mobile App...'}
                  </p>
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden mx-auto">
                    <div className="h-full bg-emerald-600 animate-pulse w-3/4 rounded-full" />
                  </div>
                </div>
              )}

              {upiStep === 'PIN' && (
                <div className="py-4 text-center space-y-2.5 w-full">
                  <div className="p-2 rounded-xl bg-slate-900 text-white text-left font-mono text-[11px] space-y-1.5 border border-emerald-500/50">
                    <div className="flex items-center space-x-1 text-emerald-400 font-bold text-[10px]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>GPay / PhonePe Mobile Auth</span>
                    </div>
                    <p className="text-[10px] text-slate-300">Enter your 4 or 6-digit Secret UPI PIN on Mobile App:</p>
                    <input
                      type="password"
                      maxLength={6}
                      value={upiPinInput}
                      onChange={(e) => setUpiPinInput(e.target.value)}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-widest text-lg font-black bg-slate-950 text-emerald-300 border border-slate-700 rounded-lg p-1.5 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              )}

              {upiStep === 'SUCCESS' && (
                <div className="py-4 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                  <p className="text-sm font-black text-slate-900 font-mono">
                    {language === 'ta' ? 'UPI பணம் சரிபார்க்கப்பட்டது! ✓' : 'UPI AUTH SUCCESSFUL! ✓'}
                  </p>
                  <p className="text-xs text-slate-700 font-bold">
                    Dispensing ₹{upiAmount.toLocaleString('en-IN')}...
                  </p>
                </div>
              )}
            </div>

            {/* Security Explanation Note */}
            <div className="mb-4 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-left space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? '🔒 இது எப்படி பாதுகாப்பானது?' : '🔒 Why is this 100% Safe?'}</span>
              </span>
              <ul className="text-[10px] text-slate-300 space-y-1 list-disc list-inside font-sans">
                <li><b>Dynamic Token:</b> QR கோட் 30 விநாடிகளுக்கு ஒருமுறை மாறும் (Photo எடுக்க முடியாது).</li>
                <li><b>Secret UPI PIN:</b> ஸ்கேன் செய்த பிறகு உங்கள் போனில் இரகசிய PIN போட வேண்டும்.</li>
                <li><b>Device Lock:</b> உங்கள் போன் & பயோமெட்ரிக்/ஃபேஸ் ஐடி இல்லாமல் யாராலும் பணம் எடுக்க முடியாது.</li>
              </ul>
            </div>

            {/* Simulated Action Buttons */}
            {upiStep === 'QR' && (
              <button
                onClick={() => {
                  setUpiStep('SCANNING');
                  setTimeout(() => {
                    setUpiStep('PIN');
                    speakGuidance('UPI_PIN_PROMPT');
                  }, 1200);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>
                  {language === 'ta' ? '📲 மொபைலில் ஸ்கேன் செய் (Simulate Scan)' : '📲 Simulate Mobile QR Scan'}
                </span>
              </button>
            )}

            {upiStep === 'PIN' && (
              <button
                onClick={() => {
                  setUpiStep('SUCCESS');
                  speakGuidance('UPI_SUCCESS');
                  setTimeout(() => {
                    updateAtmCashLevel(currentAtm.id, Math.max(0, currentAtm.cashLevel - 5));
                    setShowUpiModal(false);
                    setUpiStep('QR');
                    setUpiPinInput('');
                    setToastNotice(language === 'ta' ? `✅ ₹${upiAmount.toLocaleString('en-IN')} UPI மூலம் பாதுகாப்பாக வழங்கப்பட்டது!` : `✅ ₹${upiAmount.toLocaleString('en-IN')} Cash Dispensed via Secure UPI!`);
                    setTimeout(() => setToastNotice(null), 5000);
                  }, 2000);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {language === 'ta' ? '🔑 UPI PIN உறுதிசெய் (Confirm Cash Withdrawal)' : '🔑 Confirm UPI PIN & Dispense Cash'}
                </span>
              </button>
            )}

          </div>
        </div>
      )}

      {/* SOS EMERGENCY CALL MODAL */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border-2 border-red-500/80 rounded-3xl p-6 max-w-md w-full text-center relative shadow-2xl shadow-red-950">
            <button
              onClick={() => setShowSosModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-red-400 font-mono text-xs font-bold uppercase mb-2">
              <Radio className="w-5 h-5 animate-ping text-red-500" />
              <span>{language === 'ta' ? '24x7 காவல் & வங்கி அவசர உதவி' : '24x7 Police & Security Helpline'}</span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-1">
              {language === 'ta' ? '🆘 அவசர உதவி அழைப்பு' : '🆘 Emergency SOS Intercom'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'ta' ? 'காவல் கட்டுப்பாட்டு அறை (112) மற்றும் வங்கி பாதுகாப்புக் குழு' : 'Direct live audio dispatch to Tamil Nadu Police (112) & Bank Security'}
            </p>

            <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left font-mono text-xs mb-5">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Terminal Location:</span>
                <span className="text-white font-bold">{currentAtm.name} ({currentAtm.location})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">CCTV Camera Status:</span>
                <span className="text-emerald-400 font-bold">🟢 RECORDING LIVE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Emergency Hotline:</span>
                <span className="text-red-400 font-bold">112 / 1800-425-SECURITY</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSosModal(false);
                setToastNotice(language === 'ta' ? '🚨 அவசர அழைப்பு இணைக்கப்பட்டது! காவல் படை அனுப்பப்பட்டுள்ளது.' : '🚨 Emergency SOS Dispatched to Police Control Room (112)!');
                setTimeout(() => setToastNotice(null), 6000);
              }}
              className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm transition shadow-xl flex items-center justify-center space-x-2 cursor-pointer animate-pulse"
            >
              <PhoneCall className="w-5 h-5" />
              <span>
                {language === 'ta' ? '📞 112 அவசர போலீஸ் அழைப்பைத் தொடங்கு' : '📞 Initiate 112 Police Emergency SOS'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 1. VOICE AI COMMAND ATM ASSISTANT MODAL */}
      {showVoiceAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border-2 border-cyan-500/80 rounded-3xl p-6 max-w-lg w-full text-center relative shadow-2xl shadow-cyan-950">
            <button
              onClick={() => {
                setShowVoiceAiModal(false);
                setVoiceAiAnswer(null);
                setIsListening(false);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase mb-2">
              <Sparkles className="w-5 h-5 animate-spin text-cyan-400" />
              <span>{language === 'ta' ? 'AI குரல் வழி ஏடிஎம் உதவி' : 'Gemini AI Smart Voice ATM Assistant'}</span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-1">
              {language === 'ta' ? '🎙️ பேசி இயக்கவும் (Voice Commands)' : '🎙️ Speak to your ATM Assistant'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'ta' ? 'கீழே உள்ள கேள்விகளில் ஒன்றைச் சொடுக்கவும் அல்லது பேசவும்' : 'Click a sample voice command below or test speech input:'}
            </p>

            {/* Quick Voice Command Chips */}
            <div className="flex flex-wrap gap-2 justify-center mb-4 text-left">
              {[
                { ta: 'நான் ₹2000 எடுக்க வேண்டும்', en: 'I want to withdraw ₹2000', respTa: '₹2000 வித்ரா செய்ய கார்டு அல்லது UPI QR பயன்படுத்தலாம். தயார்நிலையில் உள்ளது!', respEn: 'To withdraw ₹2000, please use Card Insertion or UPI QR Scan. Ready!' },
                { ta: 'அருகில் உள்ள ஏடிஎம் எங்கே?', en: 'Where is the nearest ATM?', respTa: 'அடுத்த ஏடிஎம் 400 மீட்டர் தொலைவில் அண்ணா நகர் கிளையில் இயங்குகிறது.', respEn: 'Nearest active ATM is 400m away at Anna Nagar Branch.' },
                { ta: 'எனது கணக்கு இருப்பு தொகை எவ்வளவு?', en: 'Check my balance', respTa: 'உங்கள் சேமிப்புக் கணக்கு இருப்புத் தொகை ₹48,250 ஆகும்.', respEn: 'Your active savings account balance is ₹48,250.' },
                { ta: 'பணம் இல்லை என்றால் என்ன செய்வது?', en: 'What if cash is out?', respTa: 'பணம் தீர்ந்தால் எங்களின் CashGuard ரோபோ வாகனம் தானாக வந்து நிரப்பும்.', respEn: 'Our CashGuard logistics van is automatically dispatched when cash is depleted.' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const q = language === 'ta' ? item.ta : item.en;
                    const ans = language === 'ta' ? item.respTa : item.respEn;
                    setVoiceQueryInput(q);
                    setIsListening(true);
                    setTimeout(() => {
                      setIsListening(false);
                      setVoiceAiAnswer(ans);
                      // Speech synthesis output
                      try {
                        const synth = window.speechSynthesis;
                        if (synth) {
                          synth.cancel();
                          const utter = new SpeechSynthesisUtterance(ans);
                          utter.lang = language === 'ta' ? 'ta-IN' : 'en-US';
                          synth.speak(utter);
                        }
                      } catch (e) {
                        // ignore
                      }
                    }, 1000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-mono text-[11px] transition flex items-center space-x-1 cursor-pointer"
                >
                  <Mic className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{language === 'ta' ? item.ta : item.en}</span>
                </button>
              ))}
            </div>

            {/* Simulated Microphone Recording Bar */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 my-3 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400">VOICE RECOGNITION STATUS:</span>
                <span className={`text-[10px] font-mono font-bold ${isListening ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                  {isListening ? '🎙️ LISTENING TO VOICE...' : '🟢 READY'}
                </span>
              </div>

              {voiceQueryInput ? (
                <p className="text-xs font-mono font-bold text-cyan-300 bg-slate-900 p-2.5 rounded-xl border border-cyan-900 text-left">
                  🗣️ "{voiceQueryInput}"
                </p>
              ) : (
                <p className="text-xs italic text-slate-500 text-left">
                  {language === 'ta' ? 'மேலே உள்ள கட்டளையைத் தேர்ந்தெடுக்கவும்...' : 'Click any voice query above...'}
                </p>
              )}

              {/* AI Answer Box */}
              {voiceAiAnswer && (
                <div className="mt-3 p-3 bg-cyan-950/80 rounded-xl border border-cyan-500/50 text-left animate-fade-in">
                  <div className="flex items-center space-x-1.5 text-cyan-400 font-mono text-[10px] font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>GEMINI AI RESPONSE:</span>
                  </div>
                  <p className="text-xs font-bold text-white leading-relaxed">
                    {voiceAiAnswer}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowVoiceAiModal(false);
                setVoiceAiAnswer(null);
              }}
              className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-extrabold text-xs transition cursor-pointer"
            >
              {language === 'ta' ? 'சரி (Close Assistant)' : 'Close Voice Assistant'}
            </button>
          </div>
        </div>
      )}

      {/* 2. TOUCHLESS PALM VEIN BIOMETRICS MODAL */}
      {showPalmScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border-2 border-purple-500/80 rounded-3xl p-6 max-w-md w-full text-center relative shadow-2xl shadow-purple-950">
            <button
              onClick={() => {
                setShowPalmScanModal(false);
                setPalmScanStatus('IDLE');
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-purple-400 font-mono text-xs font-bold uppercase mb-2">
              <Hand className="w-5 h-5 text-purple-400 animate-bounce" />
              <span>{language === 'ta' ? 'பனை நரம்பு கைரேகை ஸ்கேனர்' : 'Touchless Palm Vein Vault Scanner'}</span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-1">
              {language === 'ta' ? '🖐️ தொடுதலில்லா நரம்பு ரேகை சரிபார்ப்பு' : '🖐️ Infrared Palm Vein Verification'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'ta' ? 'ஏடிஎம் சென்சார் முன் உங்கள் உள்ளங்கையைக் காட்டுங்கள்' : 'Place your palm 5cm away from the infrared sensor:'}
            </p>

            {/* Interactive Scanner Box */}
            <div className="my-4 p-6 rounded-2xl bg-slate-950 border-2 border-purple-500/50 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <Hand className={`w-20 h-20 transition-all duration-500 ${
                  palmScanStatus === 'SCANNING'
                    ? 'text-purple-400 animate-pulse scale-110'
                    : palmScanStatus === 'SUCCESS'
                    ? 'text-emerald-400 scale-100'
                    : 'text-purple-600/60'
                }`} />

                {/* Laser scan line animation */}
                {palmScanStatus === 'SCANNING' && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-lg shadow-purple-500 animate-ping" />
                )}
              </div>

              <div className="mt-3 font-mono text-xs font-bold">
                {palmScanStatus === 'IDLE' && (
                  <span className="text-purple-300">
                    {language === 'ta' ? 'உள்ளங்கையை வைத்து ஸ்கேன் செய்யவும்' : 'Ready for Infrared Scan'}
                  </span>
                )}
                {palmScanStatus === 'SCANNING' && (
                  <span className="text-amber-400 animate-pulse">
                    {language === 'ta' ? 'நரம்பு அமைப்புகள் பகுப்பாய்வு செய்யப்படுகின்றன... (99.8% Match)' : 'Analyzing Sub-Dermal Vein Patterns...'}
                  </span>
                )}
                {palmScanStatus === 'SUCCESS' && (
                  <span className="text-emerald-400 font-black">
                    {language === 'ta' ? '✅ நரம்பு ரேகை சரிபார்க்கப்பட்டது! (Biometric Verified)' : '✅ PALM VEIN MATCHED 99.8%! Vault Unlocked.'}
                  </span>
                )}
              </div>
            </div>

            {palmScanStatus === 'IDLE' && (
              <button
                onClick={() => {
                  setPalmScanStatus('SCANNING');
                  setTimeout(() => {
                    setPalmScanStatus('SUCCESS');
                  }, 2000);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition cursor-pointer shadow-lg flex items-center justify-center space-x-2"
              >
                <Hand className="w-4 h-4" />
                <span>{language === 'ta' ? '🖐️ ஸ்கேன் செய்யத் தொடங்கு (Simulate Scan)' : '🖐️ Hold Palm Over Sensor'}</span>
              </button>
            )}

            {palmScanStatus === 'SUCCESS' && (
              <button
                onClick={() => {
                  setShowPalmScanModal(false);
                  setPalmScanStatus('IDLE');
                  handleStartAttempt();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs transition cursor-pointer shadow-lg flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'ta' ? 'பரிவர்த்தனைக்குச் செல் (Proceed to ATM)' : 'Proceed to ATM Vault'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. WHATSAPP INSTANT E-RECEIPT MODAL */}
      {showEReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border-2 border-teal-500/80 rounded-3xl p-6 max-w-md w-full text-center relative shadow-2xl shadow-teal-950">
            <button
              onClick={() => {
                setShowEReceiptModal(false);
                setReceiptSent(false);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-teal-400 font-mono text-xs font-bold uppercase mb-2">
              <Receipt className="w-5 h-5 text-teal-400" />
              <span>{language === 'ta' ? 'வாட்ஸ்அப் டிஜிட்டல் இ-ரசீது' : 'Eco-Friendly WhatsApp E-Receipt'}</span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-1">
              {language === 'ta' ? '🎟️ வாட்ஸ்அப் இ-ரசீது பெறுக' : '🎟️ Get Digital Receipt on WhatsApp'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'ta' ? 'காகிதப் பயன்பாட்டைக் குறைத்து டிஜிட்டல் ரசீது பெற மொபைல் எண் அளிக்கவும்' : 'Save paper. Receive instant PDF transaction summary on WhatsApp:'}
            </p>

            {/* Mini Receipt Preview Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-teal-500/40 text-left font-mono text-xs mb-4 space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">TXN ID:</span>
                <span className="text-teal-300 font-bold">TXN-8829-SAFE</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">ATM Location:</span>
                <span className="text-white font-bold">{currentAtm.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Amount Dispensed:</span>
                <span className="text-emerald-400 font-bold">₹2,000.00</span>
              </div>
              <div className="flex justify-between text-[10px] text-teal-400 font-bold">
                <span>🌱 Eco Impact:</span>
                <span>15g Paper Saved ✓</span>
              </div>
            </div>

            {!receiptSent ? (
              <div className="space-y-3">
                <div className="text-left space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">
                    {language === 'ta' ? 'வாட்ஸ்அப் மொபைல் எண்:' : 'Enter WhatsApp Number:'}
                  </label>
                  <input
                    type="tel"
                    value={receiptPhone}
                    onChange={(e) => setReceiptPhone(e.target.value)}
                    className="w-full bg-slate-950 text-white border border-slate-700 rounded-xl p-3 text-sm font-mono focus:outline-none focus:border-teal-400"
                    placeholder="+91 9876543210"
                  />
                </div>

                <button
                  onClick={() => {
                    setReceiptSent(true);
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-lg flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'ta' ? 'வாட்ஸ்அப்பில் அனுப்பு (Send Receipt)' : 'Send WhatsApp E-Receipt'}</span>
                </button>
              </div>
            ) : (
              <div className="py-4 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto animate-bounce" />
                <p className="text-sm font-black text-white font-mono">
                  {language === 'ta' ? '✅ வாட்ஸ்அப் இ-ரசீது அனுப்பப்பட்டது!' : '✅ WhatsApp Receipt Sent Successfully!'}
                </p>
                <p className="text-xs text-slate-400">
                  Receipt dispatched to +91 {receiptPhone}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
