import React, { useState } from 'react';
import {
  CreditCard,
  AlertTriangle,
  MapPin,
  RotateCcw,
  Truck,
  QrCode,
  ShieldAlert,
  PhoneCall,
  Volume2,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Camera,
  Coins,
  Building2,
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { ATM } from '../types';

interface AtmMachineKioskProps {
  onStartAttempt: () => void;
  onOpenUpiModal: () => void;
  onOpenSosModal: () => void;
  onStolenCardDemo: () => void;
  onOpenSimulator: () => void;
}

export const AtmMachineKiosk: React.FC<AtmMachineKioskProps> = ({
  onStartAttempt,
  onOpenUpiModal,
  onOpenSosModal,
  onStolenCardDemo,
  onOpenSimulator
}) => {
  const {
    atms,
    selectedAtm,
    setSelectedAtm,
    updateAtmCashLevel,
    openRefillModal,
    speakGuidance,
    language,
    navigateTo,
    speakItem,
    readAloudNonReaders,
    setReadAloudNonReaders
  } = useSecurity();

  const currentAtm = selectedAtm || atms[0];
  const isCashDepleted = currentAtm.cashLevel === 0;
  const isLowCash = currentAtm.cashLevel > 0 && currentAtm.cashLevel < 30;

  const [cardHover, setCardHover] = useState(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const nearestWithCash = atms.find(a => a.id !== currentAtm.id && a.cashLevel > 30) || atms.find(a => a.cashLevel > 0);

  const SOFTKEY_SPEECH: Record<string, { ta: string; en: string }> = {
    'F1': { ta: 'F1 பொத்தான், பரிவர்த்தனை தொடங்க கார்டு செலுத்துதல்', en: 'F1 Button, Insert card and start transaction' },
    'F2': { ta: 'F2 பொத்தான், அருகிலுள்ள ஏடிஎம்கள் வரைபடம்', en: 'F2 Button, Nearby ATM Map' },
    'F3': { ta: 'F3 பொத்தான், பண நிரப்புதல் மேலாளர் ஆப்ஷன்', en: 'F3 Button, Refill cash vault' },
    'F4': { ta: 'F4 பொத்தான், கார்ட்லெஸ் யூ.பி.ஐ கியூ.ஆர் பணம் எடுத்தல்', en: 'F4 Button, Cardless UPI QR cash' },
    'F5': { ta: 'F5 பொத்தான், கார்டு செலுத்தி பரிவர்த்தனை தொடங்க', en: 'F5 Button, Start card transaction' },
    'F6': { ta: 'F6 பொத்தான், யூ.பி.ஐ கியூ.ஆர் பணம் எடுப்பது', en: 'F6 Button, Cardless UPI QR Cash' },
    'F7': { ta: 'F7 பொத்தான், திருடப்பட்ட கார்டு பாதுகாப்பு சோதனை', en: 'F7 Button, Stolen card test' },
    'F8': { ta: 'F8 பொத்தான், 24 மணி நேர அவசர காவல் உதவி', en: 'F8 Button, 24/7 SOS Emergency Call' }
  };

  const KEY_SPEECH: Record<string, { ta: string; en: string }> = {
    '1': { ta: 'ஒன்று', en: 'One' },
    '2': { ta: 'இரண்டு', en: 'Two' },
    '3': { ta: 'மூன்று', en: 'Three' },
    '4': { ta: 'நான்கு', en: 'Four' },
    '5': { ta: 'ஐந்து', en: 'Five' },
    '6': { ta: 'ஆறு', en: 'Six' },
    '7': { ta: 'ஏழு', en: 'Seven' },
    '8': { ta: 'எட்டு', en: 'Eight' },
    '9': { ta: 'ஒன்பது', en: 'Nine' },
    '0': { ta: 'பூஜ்ஜியம்', en: 'Zero' },
    'CANCEL': { ta: 'ரத்து செய்', en: 'Cancel' },
    'CLEAR': { ta: 'அழி', en: 'Clear' },
    'ENTER': { ta: 'உள்ளிடு', en: 'Enter' },
    'OK': { ta: 'சரி', en: 'OK' },
    '*': { ta: 'ஸ்டார்', en: 'Star' },
    '#': { ta: 'ஹாஷ்', en: 'Hash' }
  };

  const handleKeypadPress = (key: string) => {
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 200);
    const speech = KEY_SPEECH[key];
    if (speech) {
      speakItem(speech.ta, speech.en);
    }
    if (key === 'ENTER') {
      if (isCashDepleted) {
        speakGuidance('CASH_NOT_AVAILABLE');
      } else {
        onStartAttempt();
      }
    } else if (key === 'CANCEL') {
      speakGuidance('WELCOME_GREETING');
    }
  };

  const handleCardSlotClick = () => {
    speakItem('கார்டு செலுத்தப்பட்டு பரிவர்த்தனை தொடங்குகிறது', 'Card inserted, starting transaction');
    if (isCashDepleted) {
      speakGuidance('CASH_NOT_AVAILABLE');
    } else {
      onStartAttempt();
    }
  };

  return (
    <div id="atm-machine-kiosk-container" className="my-8 w-full max-w-4xl mx-auto select-none">
      
      {/* Outer Machine Enclosure / Kiosk Body */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 p-4 sm:p-7 border-4 border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-slate-600/50">
        
        {/* ATM Top Header / Illuminated Bank Signboard */}
        <div className="relative rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-4 py-3 sm:py-3.5 border-2 border-blue-500/40 shadow-inner flex items-center justify-between gap-3 mb-4 overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-blue-500/10 pointer-events-none animate-pulse" />
          
          <div className="flex items-center space-x-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-blue-600 border border-cyan-400/50 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white font-black text-lg">
              SG
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm font-black tracking-widest text-white uppercase font-sans drop-shadow-sm">
                  SECUREGATE BANK • SMART ATM
                </span>
                <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>24/7 ONLINE</span>
                </span>
              </div>
              <p className="text-[11px] text-blue-300/80 font-mono">
                TERMINAL #{currentAtm.id} • {currentAtm.name}
              </p>
            </div>
          </div>

          {/* Top CCTV Camera & Status Beacons */}
          <div className="flex items-center space-x-3 z-10">
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-slate-700 text-[10px] font-mono text-slate-300">
              <Camera className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span className="text-rose-400 font-bold">● REC</span>
              <span className="text-slate-500">|</span>
              <span>AI CCTV 4K</span>
            </div>

            {/* ATM Machine Power / Status Indicator Light */}
            <div className="flex flex-col items-center">
              <div className={`w-3.5 h-3.5 rounded-full border-2 ${
                isCashDepleted 
                  ? 'bg-red-500 border-red-300 shadow-[0_0_15px_#ef4444] animate-ping' 
                  : isLowCash
                  ? 'bg-amber-400 border-amber-200 shadow-[0_0_12px_#f59e0b] animate-pulse'
                  : 'bg-emerald-400 border-emerald-200 shadow-[0_0_12px_#10b981]'
              }`} />
              <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                {isCashDepleted ? 'ALERT' : 'READY'}
              </span>
            </div>
          </div>
        </div>

        {/* ATM MAIN SCREEN & SIDE SOFT KEYS SECTION */}
        <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center">
          
          {/* Left Side Function Keys (F1, F2, F3, F4) */}
          <div className="col-span-1 hidden md:flex flex-col justify-around h-[340px] py-6 space-y-4">
            {['F1', 'F2', 'F3', 'F4'].map((key) => (
              <button
                key={key}
                onClick={() => {
                  const speech = SOFTKEY_SPEECH[key];
                  if (speech) speakItem(speech.ta, speech.en);
                  if (key === 'F1') {
                    if (isCashDepleted && nearestWithCash) {
                      setSelectedAtm(nearestWithCash);
                      speakGuidance('ATM_SWITCHED');
                    } else {
                      onStartAttempt();
                    }
                  } else if (key === 'F2') {
                    navigateTo('ATM_MAP');
                  } else if (key === 'F3') {
                    openRefillModal(currentAtm.id);
                  } else if (key === 'F4') {
                    onOpenUpiModal();
                  }
                }}
                onMouseEnter={() => {
                  const speech = SOFTKEY_SPEECH[key];
                  if (speech) speakItem(speech.ta, speech.en);
                }}
                className="h-10 w-full rounded-lg bg-gradient-to-r from-slate-700 to-slate-600 hover:from-cyan-600 hover:to-blue-600 border border-slate-500 text-[10px] font-mono font-black text-slate-200 hover:text-white shadow-md active:translate-x-0.5 transition cursor-pointer flex items-center justify-center"
                title={`ATM Softkey ${key}`}
              >
                ◀ {key}
              </button>
            ))}
          </div>

          {/* Center: The ATM Digital Screen (High-Tech Bezel + LCD) */}
          <div className="col-span-12 md:col-span-10">
            <div className={`relative rounded-3xl p-4 sm:p-6 border-4 transition-all duration-500 shadow-2xl overflow-hidden min-h-[360px] flex flex-col justify-between ${
              isCashDepleted
                ? 'bg-gradient-to-b from-red-950 via-[#1f0505] to-black border-red-600/90 shadow-[0_0_40px_rgba(239,68,68,0.4)] ring-2 ring-red-500/40'
                : 'bg-gradient-to-b from-slate-950 via-blue-950/80 to-slate-950 border-cyan-500/50 shadow-[0_0_35px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/30'
            }`}>

              {/* CRT Scanline & Screen Glare Effect Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/5 via-transparent to-transparent pointer-events-none" />

              {/* ============================================================ */}
              {/* SCREEN CONTENT: WHEN CASH IS 0% (DEPLETED / NOT AVAILABLE) */}
              {/* ============================================================ */}
              {isCashDepleted ? (
                <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                  
                  {/* Top Warning Banner on Screen */}
                  <div className="flex items-center justify-between border-b border-red-700/60 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <span className="text-xs font-mono font-black text-red-300 tracking-wider uppercase">
                        {language === 'ta' ? '🚨 தானியங்கி எச்சரிக்கை: பணம் இருப்பு இல்லை' : '🚨 SYSTEM WARNING: ZERO CASH IN VAULT'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900/80 text-red-200 border border-red-500 font-bold">
                      ERROR #ERR-CASH-00
                    </span>
                  </div>

                  {/* Main Giant ATM Display Sign: CASH NOT AVAILABLE */}
                  <div className="py-2 text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600/30 border-2 border-red-500 text-red-400 shadow-lg shadow-red-950 animate-bounce">
                      <AlertTriangle className="w-8 h-8 text-yellow-300" />
                    </div>

                    <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase drop-shadow-[0_4px_10px_rgba(239,68,68,0.8)] font-sans">
                      🚫 {language === 'ta' ? 'CASH NOT AVAILABLE' : 'CASH NOT AVAILABLE'}
                    </h2>
                    
                    <p className="text-base sm:text-xl font-bold text-yellow-300 font-sans">
                      {language === 'ta' ? '⚠️ இந்த ATM இயந்திரத்தில் தற்போது பணம் இல்லை!' : '⚠️ TEMPORARILY OUT OF SERVICE FOR CASH DISPENSE'}
                    </p>

                    <p className="text-xs sm:text-sm text-red-200 max-w-xl mx-auto leading-relaxed font-sans">
                      {language === 'ta'
                        ? 'CashGuard IoT சென்சார்கள் பணத் தட்டுப்பாட்டைக் கண்டறிந்துவிட்டன. கார்டு உள்ளிடுதல் தற்காலிகமாக முடக்கப்பட்டுள்ளது.'
                        : 'IoT sensors detected 0 balance in cash cassettes. Card insertion is paused until the next cash refill.'}
                    </p>
                  </div>

                  {/* Diagnostic Cash Cassette Table & Auto-Dispatch Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left bg-black/60 p-3 rounded-2xl border border-red-800/80 backdrop-blur-md">
                    
                    {/* Cassette Telemetry */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono text-red-400 font-bold uppercase flex items-center space-x-1">
                        <Coins className="w-3 h-3" />
                        <span>IoT Cassette Vault Telemetry:</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-mono">
                        <div className="bg-red-950/80 p-1 rounded border border-red-900 text-red-300">
                          <div>₹2000</div>
                          <div className="font-bold text-red-400">0 pcs</div>
                        </div>
                        <div className="bg-red-950/80 p-1 rounded border border-red-900 text-red-300">
                          <div>₹500</div>
                          <div className="font-bold text-red-400">0 pcs</div>
                        </div>
                        <div className="bg-red-950/80 p-1 rounded border border-red-900 text-red-300">
                          <div>₹200</div>
                          <div className="font-bold text-red-400">0 pcs</div>
                        </div>
                        <div className="bg-red-950/80 p-1 rounded border border-red-900 text-red-300">
                          <div>₹100</div>
                          <div className="font-bold text-red-400">0 pcs</div>
                        </div>
                      </div>
                    </div>

                    {/* Transit Van Status */}
                    <div className="space-y-1 sm:border-l sm:border-red-900/60 sm:pl-3">
                      <div className="text-[10px] font-mono text-amber-400 font-bold uppercase flex items-center space-x-1">
                        <Truck className="w-3 h-3" />
                        <span>Armored Van Status:</span>
                      </div>
                      <div className="text-[11px] text-slate-200">
                        <span className="text-emerald-400 font-bold">● DISPATCHED</span> • Fleet Van TN-02
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Estimated Refill Time: <strong className="text-white">15-20 Mins</strong>
                      </div>
                    </div>
                  </div>

                  {/* ATM Screen Action Softkeys (Clickable directly on screen!) */}
                  <div className="pt-2 border-t border-red-800/80 flex flex-wrap items-center justify-between gap-2">
                    
                    {/* Nearest Working ATM Indicator */}
                    {nearestWithCash && (
                      <div className="text-left">
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">
                          📍 {language === 'ta' ? 'அருகிலுள்ள பணம் உள்ள ATM:' : 'Nearest Working ATM with Cash:'}
                        </span>
                        <span className="text-xs font-bold text-cyan-300">
                          {nearestWithCash.name} ({nearestWithCash.cashLevel}% Cash Available)
                        </span>
                      </div>
                    )}

                    {/* Interactive Touch Buttons on Screen */}
                    <div className="flex flex-wrap items-center gap-2">
                      {nearestWithCash && (
                        <button
                          onClick={() => {
                            setSelectedAtm(nearestWithCash);
                            speakGuidance('ATM_SWITCHED');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-lg cursor-pointer flex items-center space-x-1.5"
                        >
                          <span>🔄 {language === 'ta' ? 'பணம் உள்ள ATM-க்கு மாறு' : 'Switch to Working ATM'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => navigateTo('ATM_MAP')}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg cursor-pointer flex items-center space-x-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? 'வரைபடம் பார்க்க' : 'Locate ATM Map'}</span>
                      </button>

                      <button
                        onClick={() => openRefillModal(currentAtm.id)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg cursor-pointer flex items-center space-x-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? 'பணம் நிரப்புக (Refill)' : 'Quick Refill 100%'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                /* ============================================================ */
                /* SCREEN CONTENT: WHEN CASH IS AVAILABLE (NORMAL OPERATION)    */
                /* ============================================================ */
                <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                  
                  {/* Top Screen Status Bar */}
                  <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-mono font-bold text-cyan-300 tracking-wider">
                        SECUREGATE BIOMETRIC VAULT SYSTEM
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                        🟢 CASH READY: ₹{(currentAtm.cashAmount ?? 0).toLocaleString('en-IN')} ({currentAtm.cashLevel}%)
                      </span>
                    </div>
                  </div>

                  {/* Center Welcome Graphic & Instructions */}
                  <div className="py-3 text-center space-y-3">
                    <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                      <span>{language === 'ta' ? 'வங்கி பாதுகாப்பு அடுக்கு 3.0' : 'MFA Identity Guard 3.0'}</span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                      {language === 'ta' ? 'வணக்கம்! உங்கள் கார்டை செலுத்தவும்' : 'WELCOME! PLEASE INSERT YOUR ATM CARD'}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                      {language === 'ta'
                        ? 'கீழே உள்ள கார்டு துளையில் (Card Reader) உங்கள் ATM கார்டை செருகி, முக ஸ்கேன் மற்றும் 6-இலக்க PIN மூலம் பணத்தைப் பெறலாம்.'
                        : 'Insert your debit/ATM card into the illuminated card slot below to verify your face and enter your PIN.'}
                    </p>

                    {/* Animated Visual Card Insertion Guide */}
                    <div 
                      onClick={onStartAttempt}
                      onMouseEnter={() => setCardHover(true)}
                      onMouseLeave={() => setCardHover(false)}
                      className="inline-flex items-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm shadow-xl shadow-blue-900/50 cursor-pointer transform hover:scale-105 active:scale-95 transition-all border border-cyan-300/40"
                    >
                      <CreditCard className={`w-5 h-5 ${cardHover ? 'animate-bounce' : ''}`} />
                      <span>{language === 'ta' ? '👉 கார்டு செலுத்தி தொடங்குக (START)' : '👉 CLICK TO INSERT CARD & START'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* 3 Step Indicator on Screen */}
                  <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-blue-500/30 text-slate-300">
                      <span className="font-mono text-cyan-400 block font-bold">1. CARD READ</span>
                      <span>{language === 'ta' ? 'கார்டு வாசிப்பு' : 'EMV Chip Scan'}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-slate-300">
                      <span className="font-mono text-cyan-400 block font-bold">2. FACE MATCH</span>
                      <span>{language === 'ta' ? 'முக ஸ்கேன்' : 'Live Camera AI'}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-amber-500/30 text-slate-300">
                      <span className="font-mono text-amber-400 block font-bold">3. 6-DIGIT PIN</span>
                      <span>{language === 'ta' ? 'ரகசிய PIN' : 'Encrypted Keypad'}</span>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>

          {/* Right Side Function Keys (F5, F6, F7, F8) */}
          <div className="col-span-1 hidden md:flex flex-col justify-around h-[340px] py-6 space-y-4">
            {['F5', 'F6', 'F7', 'F8'].map((key) => (
              <button
                key={key}
                onClick={() => {
                  const speech = SOFTKEY_SPEECH[key];
                  if (speech) speakItem(speech.ta, speech.en);
                  if (key === 'F5') {
                    if (isCashDepleted) speakGuidance('CASH_NOT_AVAILABLE');
                    else onStartAttempt();
                  } else if (key === 'F6') {
                    onOpenUpiModal();
                  } else if (key === 'F7') {
                    onStolenCardDemo();
                  } else if (key === 'F8') {
                    onOpenSosModal();
                  }
                }}
                onMouseEnter={() => {
                  const speech = SOFTKEY_SPEECH[key];
                  if (speech) speakItem(speech.ta, speech.en);
                }}
                className="h-10 w-full rounded-lg bg-gradient-to-r from-slate-600 to-slate-700 hover:from-blue-600 hover:to-cyan-600 border border-slate-500 text-[10px] font-mono font-black text-slate-200 hover:text-white shadow-md active:-translate-x-0.5 transition cursor-pointer flex items-center justify-center"
                title={`ATM Softkey ${key}`}
              >
                {key} ▶
              </button>
            ))}
          </div>

        </div>

        {/* ATM PHYSICAL HARDWARE LOWER CONSOLE (Card Slot, Dispenser, Keypad, Receipt) */}
        <div className="mt-6 pt-6 border-t-2 border-slate-700/80 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          
          {/* 1. Physical EMV Card Reader Slot */}
          <div 
            onClick={handleCardSlotClick}
            onMouseEnter={() => speakItem('ஏடிஎம் கார்டு செலுத்தும் ஸ்லாட்', 'ATM card insertion slot')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center relative overflow-hidden group ${
              isCashDepleted
                ? 'bg-red-950/40 border-red-600/70 hover:bg-red-900/40 shadow-lg shadow-red-950'
                : 'bg-slate-800/90 border-slate-600 hover:border-cyan-400 hover:bg-slate-800 shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                CARD INSERTION SLOT
              </span>
              <div className={`w-2.5 h-2.5 rounded-full ${
                isCashDepleted ? 'bg-red-500 animate-ping' : 'bg-emerald-400 animate-pulse'
              }`} />
            </div>

            {/* Realistic Card Slot Opening */}
            <div className="relative py-2.5 px-4 rounded-xl bg-black border border-slate-700 flex items-center justify-center space-x-2">
              <div className={`h-1.5 w-full rounded-full transition-all ${
                isCashDepleted 
                  ? 'bg-red-500 shadow-[0_0_12px_#ef4444]' 
                  : 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 shadow-[0_0_15px_#10b981] animate-pulse'
              }`} />
              <CreditCard className={`w-5 h-5 shrink-0 ${isCashDepleted ? 'text-red-400' : 'text-cyan-400 group-hover:scale-110 transition'}`} />
            </div>

            <p className={`text-[11px] font-bold mt-2 font-sans ${isCashDepleted ? 'text-red-400' : 'text-slate-300 group-hover:text-cyan-300'}`}>
              {isCashDepleted 
                ? '🚫 கார்டு முடக்கப்பட்டுள்ளது (LOCKED)' 
                : '👉 கார்டை உள்ளிட கிளிக் செய்க (INSERT CARD)'}
            </p>
          </div>

          {/* 2. Physical Cash Dispenser Hatch */}
          <div
            onMouseEnter={() => speakItem('பணம் வெளியேறும் வாய் பகுதி', 'Cash dispenser output hatch')}
            className={`p-4 rounded-2xl border-2 text-center ${
            isCashDepleted
              ? 'bg-red-950/30 border-red-800 text-red-300'
              : 'bg-slate-800/90 border-slate-600 text-slate-300'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                CASH DISPENSER HATCH
              </span>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                isCashDepleted ? 'bg-red-900 text-red-200' : 'bg-emerald-950 text-emerald-400'
              }`}>
                {isCashDepleted ? 'EMPTY' : 'ONLINE'}
              </span>
            </div>

            {/* Dispenser Shutter */}
            <div className="py-3 px-4 rounded-xl bg-gradient-to-b from-slate-900 via-black to-slate-900 border border-slate-700 shadow-inner flex items-center justify-center">
              <div className="w-full flex items-center justify-center space-x-2">
                <div className="h-1 w-24 bg-slate-700 rounded-full" />
                <span className="text-[10px] font-mono text-slate-500">SHUTTER CLOSED</span>
                <div className="h-1 w-24 bg-slate-700 rounded-full" />
              </div>
            </div>

            <p className="text-[11px] font-mono text-slate-400 mt-2">
              {isCashDepleted ? 'பணம் இருப்பு இல்லை (No Cash)' : 'பணம் வழங்கும் பகுதி (Automated Shutter)'}
            </p>
          </div>

          {/* 3. Encrypted Metal PIN Pad (EPP) */}
          <div className="p-3.5 rounded-2xl bg-slate-800/90 border-2 border-slate-600 text-center shadow-lg">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                ENCRYPTED PIN PAD (EPP)
              </span>
              <Lock className="w-3 h-3 text-cyan-400" />
            </div>

            {/* 3x4 Tactile Keypad */}
            <div className="grid grid-cols-4 gap-1 max-w-[200px] mx-auto">
              {['1', '2', '3', 'CANCEL', '4', '5', '6', 'CLEAR', '7', '8', '9', 'ENTER', '*', '0', '#', 'OK'].map((btn) => {
                const isCancel = btn === 'CANCEL';
                const isClear = btn === 'CLEAR';
                const isEnter = btn === 'ENTER' || btn === 'OK';
                
                let btnColor = 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600';
                if (isCancel) btnColor = 'bg-rose-700 hover:bg-rose-600 text-white border-rose-600 text-[8px] font-black';
                if (isClear) btnColor = 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500 text-[8px] font-black';
                if (isEnter) btnColor = 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 text-[8px] font-black';

                return (
                  <button
                    key={btn}
                    onClick={() => handleKeypadPress(btn)}
                    onMouseEnter={() => {
                      const speech = KEY_SPEECH[btn];
                      if (speech) speakItem(speech.ta, speech.en);
                    }}
                    className={`h-6 rounded border text-[10px] font-mono font-bold transition shadow active:scale-95 cursor-pointer flex items-center justify-center ${btnColor} ${
                      pressedKey === btn ? 'scale-90 ring-2 ring-white' : ''
                    }`}
                  >
                    {btn}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
