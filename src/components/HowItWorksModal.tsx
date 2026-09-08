import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  ShieldCheck,
  CreditCard,
  ScanFace,
  KeyRound,
  Banknote,
  Radio,
  Sliders,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Volume2,
  Eye,
  Lock,
  Layers,
  Landmark,
  MousePointer
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export const HowItWorksModal: React.FC = () => {
  const {
    isHowItWorksOpen,
    setIsHowItWorksOpen,
    language,
    navigateTo,
    startVerification,
    triggerStolenCardDemoScenario,
    speakGuidance,
    unlockAudioAndVoice
  } = useSecurity();

  const [activeTab, setActiveTab] = useState<'ATM_FLOW' | 'CASHGUARD_IOT' | 'TESTING_GUIDE' | 'SCROLL_HELP'>('ATM_FLOW');

  if (!isHowItWorksOpen) return null;

  const handleStartAtm = () => {
    setIsHowItWorksOpen(false);
    startVerification();
  };

  const handleOpenSimulator = () => {
    setIsHowItWorksOpen(false);
    navigateTo('SENSOR_SIMULATOR');
  };

  const handleStolenDemo = () => {
    setIsHowItWorksOpen(false);
    triggerStolenCardDemoScenario();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>{language === 'ta' ? '💡 இது எப்படி வேலை செய்கிறது?' : '💡 How CashGuard AI Works'}</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {language === 'ta' ? 'முழு வழிகாட்டி' : 'Interactive Guide'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'ta'
                  ? 'ஏடிஎம் பாதுகாப்பு முறை மற்றும் வங்கி மேனேஜர் சென்சார் கண்காணிப்பு விளக்கம்'
                  : 'Complete walkthrough of 3-Step ATM Verification & IoT CashGuard System'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsHowItWorksOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/80 px-6 py-2 overflow-x-auto gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('ATM_FLOW')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'ATM_FLOW'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'ta' ? '1. ஏடிஎம் பணம் எடுக்கும் முறை' : '1. ATM 3-Step Security'}</span>
          </button>

          <button
            onClick={() => setActiveTab('CASHGUARD_IOT')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'CASHGUARD_IOT'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{language === 'ta' ? '2. IoT Cash சென்சார் & அலாரம்' : '2. IoT Cash & Alarms'}</span>
          </button>

          <button
            onClick={() => setActiveTab('TESTING_GUIDE')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'TESTING_GUIDE'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'ta' ? '3. டெஸ்ட் செய்யும் விதம்' : '3. How to Test & Demo'}</span>
          </button>

          <button
            onClick={() => setActiveTab('SCROLL_HELP')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'SCROLL_HELP'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <MousePointer className="w-4 h-4" />
            <span>{language === 'ta' ? '4. மெதுவான Scroll வசதி' : '4. Smooth Scroll Tips'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          
          {/* TAB 1: ATM 3-STEP FLOW */}
          {activeTab === 'ATM_FLOW' && (
            <div className="space-y-6 animate-fade-in">
              <div className="rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 p-4 flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {language === 'ta'
                      ? 'ஏடிஎம் பணம் எடுக்கும் 3-படி பாதுகாப்பு முறை (3-Step MFA)'
                      : 'ATM 3-Step Multi-Factor Authentication Flow'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {language === 'ta'
                      ? 'இந்த ஆப் ஒரு பாதுகாப்பான ஏடிஎம் இயந்திரத்தை போல செயல்படுகிறது. திருடப்பட்ட கார்டுகளை வைத்து யாரும் பணம் எடுக்க முடியாது. முக அடையாளம், கார்டு, மற்றும் பின் எண் மூன்றும் பொருந்தினால் மட்டுமே பணம் வரும்!'
                      : 'Simulates a next-gen ATM kiosk with 3-Factor security. Protects against stolen cards by matching live face AI with the cardholder profile before dispensing cash.'}
                  </p>
                </div>
              </div>

              {/* Steps Visual Pipeline */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-blue-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                      STEP 1
                    </span>
                    <ScanFace className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    {language === 'ta' ? 'முக அடையாளம்' : 'Face Scan'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'ta'
                      ? 'AI கேமரா முகத்தை ஸ்கேன் செய்து நபரின் அடையாளத்தை பதிவு செய்கிறது.'
                      : 'AI camera scans and verifies biometric facial features.'}
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      STEP 2
                    </span>
                    <CreditCard className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    {language === 'ta' ? 'கார்டு ஸ்கேன்' : 'Card Scan'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'ta'
                      ? 'ஏடிஎம் கார்டு மற்றும் சிப்-ஐ உள்ளே செலுத்தி விபரங்கள் பெறப்படுகிறது.'
                      : 'ATM card is inserted and chip credentials are read.'}
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                      STEP 3
                    </span>
                    <KeyRound className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    {language === 'ta' ? 'ரகசிய பின் எண்' : 'PIN & OTP'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'ta'
                      ? '4-இலக்க ரகசிய எண் (1234 அல்லது 123456) சரிபார்க்கப்படுகிறது.'
                      : 'Enter secret 4-digit PIN (default 1234) or mobile OTP.'}
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      STEP 4
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    {language === 'ta' ? 'அனுமதி முடிவு' : 'Decision'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'ta'
                      ? 'கார்டில் உள்ள பெயரும் முகமும் பொருந்தினால் மட்டுமே Access Granted ஆகும்!'
                      : 'System cross-verifies card owner with scanned face.'}
                  </p>
                </div>

                {/* Step 5 */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                      STEP 5
                    </span>
                    <Banknote className="w-5 h-5 text-amber-400" />
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    {language === 'ta' ? 'பணம் எடுத்தல்' : 'Cash Dispense'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'ta'
                      ? 'தேவையான தொகையை தேர்வு செய்து பணம் பெற்றுக்கொள்ளலாம்.'
                      : 'Withdraw desired amount and receive e-receipt.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  {language === 'ta'
                    ? 'இப்போதே இதை நேரடியாக பரிசோதிக்க விரும்புகிறீர்களா?'
                    : 'Want to try this right now?'}
                </span>
                <button
                  onClick={handleStartAtm}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{language === 'ta' ? 'இப்போதே ஏடிஎம் பரிசோதிக்கவும் ▶' : 'Start ATM Verification ▶'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CASHGUARD IOT */}
          {activeTab === 'CASHGUARD_IOT' && (
            <div className="space-y-6 animate-fade-in">
              <div className="rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/30 p-4 flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {language === 'ta'
                      ? 'CashGuard AI - வங்கி மேனேஜர் IoT கண்காணிப்பு முறை'
                      : 'CashGuard AI - Bank Manager Cash Monitoring System'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {language === 'ta'
                      ? '“பணம் தீரும் முன்பே தெரியும்” - சென்னை முழுவதும் உள்ள 8 ஏடிஎம் இயந்திரங்களின் பண இருப்பை IoT சென்சார்கள் நொடிக்கு நொடி கண்காணிக்கின்றன.'
                      : 'Real-time IoT sensors monitor cash cassette levels across all bank branches. Automatically triggers alarms and alerts when cash drops below 30%.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
                    <Radio className="w-4 h-4" />
                    <span>{language === 'ta' ? '1. நேரலை சென்சார்' : '1. Live Sensor Telemetry'}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'ta'
                      ? 'ஒவ்வொரு ஏடிஎம்-ல் உள்ள ₹2000, ₹500, ₹200, ₹100 நோட்டுகளின் எண்ணிக்கை துல்லியமாக மேனேஜர் டாஷ்போர்டில் தெரியும்.'
                      : 'Managers see live rupee amounts, cassette breakdown, and ping health for all 8 ATMs.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-red-500/30 space-y-2">
                  <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{language === 'ta' ? '2. 30% அவசர அலாரம்' : '2. Critical < 30% Alarm'}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'ta'
                      ? 'ஏதேனும் ஒரு ஏடிஎம்-ல் பணம் 30%-க்கு கீழே குறைந்தால் உடனடியாக ஆப்பில் சத்தமான அலாரம் ஒலிக்கும் மற்றும் மேனேஜருக்கு SMS வரும்.'
                      : 'When cash level falls under 30%, the system rings a siren alarm and dispatches emergency SMS alert.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>{language === 'ta' ? '3. ரீஃபில் டீம் அனுப்புதல்' : '3. Refill Dispatch'}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'ta'
                      ? 'மேனேஜர் ஒரே கிளிக்கில் Cash Refill Van (வாகனம்) அனுப்பி புதிய பணத்தை நிரப்பி வாடிக்கையாளர்களுக்கு தடையற்ற சேவை வழங்கலாம்.'
                      : 'Managers can dispatch armored cash refill teams in 1-click to replenish depleted ATM vaults.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  {language === 'ta'
                    ? 'சென்சார் டெஸ்டரில் பணத்தை குறைத்து அலாரத்தை சோதிக்கலாம்:'
                    : 'Test the low-cash alarm using the Sensor Simulator:'}
                </span>
                <button
                  onClick={handleOpenSimulator}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  <Sliders className="w-4 h-4" />
                  <span>{language === 'ta' ? 'சென்சார் சிமுலேட்டருக்கு செல் ▶' : 'Open Simulator ▶'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: TESTING GUIDE */}
          {activeTab === 'TESTING_GUIDE' && (
            <div className="space-y-6 animate-fade-in">
              <div className="rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 p-4 flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {language === 'ta'
                      ? 'ஆப்பில் உள்ள வசதிகளை பரிசோதிப்பது எப்படி? (Step-by-Step Test Guide)'
                      : 'How to Test Key App Scenarios'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {language === 'ta'
                      ? 'கீழே உள்ள 3 முக்கிய சோதனைகளை கிளிக் செய்து எளிதாக டெஸ்ட் செய்யலாம்:'
                      : 'Use these 3 quick shortcuts to experience the core functionalities:'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Demo 1 */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                      TEST 1
                    </span>
                    <h4 className="font-bold text-sm text-white">
                      {language === 'ta' ? 'சாதாரண பணம் எடுத்தல்' : 'Normal ATM Flow'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {language === 'ta'
                        ? 'அனிதா அவர்களின் கார்டு மூலம் முகம் ஸ்கேன் செய்து வெற்றிகரமாக பணம் எடுக்கலாம்.'
                        : 'Simulate legitimate ATM access with matching facial biometrics.'}
                    </p>
                  </div>
                  <button
                    onClick={handleStartAtm}
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
                  >
                    {language === 'ta' ? 'டெஸ்ட் செய்க ▶' : 'Run Test ▶'}
                  </button>
                </div>

                {/* Demo 2 */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-red-500/30 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                      TEST 2
                    </span>
                    <h4 className="font-bold text-sm text-white">
                      {language === 'ta' ? 'திருடப்பட்ட கார்டு டெமோ' : 'Stolen Card Scenario'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {language === 'ta'
                        ? 'அனிதா கார்டை வேறு நபர் பயன்படுத்தி பணம் எடுக்க முயன்றால் முகம் பொருந்தாமல் நிராகரிக்கும் (Access Denied).'
                        : 'Simulates unauthorized intruder attempting withdrawal. Biometric mismatch triggers lock.'}
                    </p>
                  </div>
                  <button
                    onClick={handleStolenDemo}
                    className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer"
                  >
                    {language === 'ta' ? 'திருட்டு டெமோ ▶' : 'Run Intruder Demo ▶'}
                  </button>
                </div>

                {/* Demo 3 */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                      TEST 3
                    </span>
                    <h4 className="font-bold text-sm text-white">
                      {language === 'ta' ? 'பணம் குறைவு அலாரம்' : 'Low Cash Sensor Test'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {language === 'ta'
                        ? 'சென்சார் ஸ்லைடரை 30%-க்கு கீழ் குறைத்து அலாரம் மற்றும் ரீஃபில் பட்டனை பரிசோதிக்கலாம்.'
                        : 'Adjust cash sliders below 30% to trigger real-time audio sirens and alert modals.'}
                    </p>
                  </div>
                  <button
                    onClick={handleOpenSimulator}
                    className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer"
                  >
                    {language === 'ta' ? 'சிமுலேட்டர் ▶' : 'Open Simulator ▶'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SCROLL HELP */}
          {activeTab === 'SCROLL_HELP' && (
            <div className="space-y-6 animate-fade-in">
              <div className="rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/30 p-4 flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 shrink-0">
                  <MousePointer className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {language === 'ta'
                      ? 'மெதுவான மற்றும் சீரான Scroll வசதி (Smooth Slow Scrolling)'
                      : 'Smooth & Gentle Scrolling Features'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {language === 'ta'
                      ? 'பக்கத்தை வேகமாகத் தாண்டாமல், மெதுவாகவும் வசதியாகவும் வாசித்து உருட்டுவதற்காக பிரத்யேக வசதிகள் சேர்க்கப்பட்டுள்ளன.'
                      : 'Optimized smooth scrolling physics to prevent fast jarring jumps and provide effortless navigation.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                    <span>{language === 'ta' ? '1. கீழே வலதுபுறத்தில் உள்ள பட்டன்கள்' : '1. Floating Navigation Widget'}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'ta'
                      ? 'திரையின் வலது கீழே உள்ள "மெதுவாக கீழே செல் (Slow Scroll Down)" மற்றும் "மேலே செல் (Top)" பட்டன்களை கிளிக் செய்து மிக மெதுவாக திரையை உருட்டலாம்.'
                      : 'Use the floating smooth scroll controller at the bottom-right corner to step up and down gently.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                    <Volume2 className="w-4 h-4" />
                    <span>{language === 'ta' ? '2. குரல் வழிகாட்டுதல் (Voice Guidance)' : '2. Voice Audio Assistance'}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'ta'
                      ? 'ஸ்க்ரோல் செய்து வாசிக்க சிரமமாக இருந்தால், "குரல் ஒலிக்கும் பட்டனை" அழுத்தி முழு விபரங்களையும் தமிழில் குரலாகக் கேட்கலாம்.'
                      : 'Click the voice audio buttons across the app to hear all screen contents spoken clearly in Tamil or English.'}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 shrink-0">
          <span className="text-xs text-slate-400">
            {language === 'ta' ? 'SecureGate & CashGuard AI v3.1' : 'SecureGate & CashGuard AI v3.1'}
          </span>
          <button
            onClick={() => setIsHowItWorksOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
          >
            {language === 'ta' ? 'புரிந்தது / மூடு' : 'Got It / Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
