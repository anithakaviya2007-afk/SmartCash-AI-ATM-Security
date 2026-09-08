import React, { useState, useEffect } from 'react';
import {
  Banknote,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Receipt,
  Wallet,
  ShieldCheck,
  Check,
  Printer,
  Home,
  Volume2,
  Send
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { VerificationProgress } from '../components/VerificationProgress';
import { VoiceGuidancePromptBar } from '../components/VoiceGuidancePromptBar';
import { Transaction } from '../types';

export const Step5CashWithdrawalView: React.FC = () => {
  const {
    session,
    activeUser,
    handleStep5Withdrawal,
    finishAtmSession,
    liveDateTime,
    speakGuidance,
    atms,
    selectedAtm,
    openRefillModal,
    updateAtmCashLevel,
    language,
    navigateTo,
    speakItem,
    readAloudNonReaders,
    setReadAloudNonReaders
  } = useSecurity();

  const currentAtm = selectedAtm || atms[0];
  const isAtmEmpty = currentAtm ? currentAtm.cashLevel === 0 : false;

  const [selectedAmount, setSelectedAmount] = useState<number>(2000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [stage, setStage] = useState<'MENU' | 'SELECT' | 'CONFIRM' | 'DISPENSING' | 'SUCCESS' | 'BALANCE' | 'STATEMENT'>('MENU');
  const [dispenseProgress, setDispenseProgress] = useState<number>(0);
  const [transactionResult, setTransactionResult] = useState<Transaction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [whatsappSent, setWhatsappSent] = useState<boolean>(false);

  const AMOUNT_SPEECH: Record<number, { ta: string; en: string }> = {
    500: { ta: 'ஐந்நூறு ரூபாய்', en: 'Five hundred rupees' },
    1000: { ta: 'ஆயிரம் ரூபாய்', en: 'One thousand rupees' },
    2000: { ta: 'இரண்டாயிரம் ரூபாய்', en: 'Two thousand rupees' },
    5000: { ta: 'ஐந்தாயிரம் ரூபாய்', en: 'Five thousand rupees' },
    10000: { ta: 'பத்தாயிரம் ரூபாய்', en: 'Ten thousand rupees' },
    20000: { ta: 'இருபதாயிரம் ரூபாய்', en: 'Twenty thousand rupees' }
  };

  useEffect(() => {
    if (isAtmEmpty) {
      speakGuidance('CASH_NOT_AVAILABLE');
    } else {
      speakGuidance('STEP5_WITHDRAWAL_PROMPT');
    }
  }, [isAtmEmpty, speakGuidance]);

  const currentUser = session.currentUser || activeUser;
  const availableBalance = currentUser?.atmBalance || 25000;

  const presetAmounts = [500, 1000, 2000, 5000];

  const handleSelectPreset = (amt: number) => {
    setSelectedAmount(amt);
    setIsCustom(false);
    setErrorMessage('');
    const spoken = AMOUNT_SPEECH[amt];
    speakItem(
      `${spoken?.ta || amt} தேர்ந்தெடுக்கப்பட்டது`,
      `${spoken?.en || amt} selected`
    );
  };

  const handleProceedToConfirm = () => {
    const finalAmount = isCustom ? parseInt(customAmount, 10) : selectedAmount;
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
      setErrorMessage('Please enter a valid withdrawal amount in multiples of ₹100.');
      speakItem('தயவுசெய்து சரியான தொகையைத் தேர்ந்தெடுக்கவும்', 'Please select a valid amount');
      return;
    }
    if (finalAmount > availableBalance) {
      setErrorMessage(`Insufficient balance. Current balance is ₹${(availableBalance ?? 0).toLocaleString('en-IN')}.`);
      speakItem('உங்கள் கணக்கில் போதிய பணம் இல்லை', 'Insufficient balance');
      return;
    }
    setSelectedAmount(finalAmount);
    setStage('CONFIRM');
    setErrorMessage('');
    speakItem(
      `${finalAmount} ரூபாய் எடுப்பதை உறுதி செய்யவும்`,
      `Please confirm withdrawal of ${finalAmount} rupees`
    );
  };

  const handleExecuteWithdrawal = () => {
    setStage('DISPENSING');
    setDispenseProgress(0);
    speakItem('பணம் எண்ணப்பட்டு வெளியே வழங்கப்படுகிறது. காத்திருக்கவும்.', 'Cash is being counted and dispensed. Please wait.');
    speakGuidance('STEP5_CASH_DISPENSING');

    const interval = setInterval(() => {
      setDispenseProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          const res = handleStep5Withdrawal(selectedAmount);
          if (res.success && res.transaction) {
            setTransactionResult(res.transaction);
            setStage('SUCCESS');
            speakGuidance('STEP5_THANK_YOU');
          } else {
            setErrorMessage(res.message);
            setStage('SELECT');
          }
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <div>
        {/* Step Progress Tracker */}
        <VerificationProgress
          currentStep="WITHDRAWAL"
          stepNumber={5}
          completedSteps={stage === 'SUCCESS' ? ['FACE', 'CARD', 'PIN', 'DECISION', 'WITHDRAWAL'] : ['FACE', 'CARD', 'PIN', 'DECISION']}
        />

        <div className="max-w-2xl mx-auto w-full">
          <div className="bg-slate-900/90 rounded-3xl border border-blue-500/30 p-6 sm:p-8 shadow-2xl shadow-blue-950/60 backdrop-blur-md">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center space-x-3 text-center sm:text-left">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400">
                  <Banknote className="h-6 w-6" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold mb-1">
                    <span>{language === 'ta' ? 'படி 5 / 5 • பணம் எடுத்தல் & சேவை' : 'STEP 5 OF 5 • CASH DISPENSER TERMINAL'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {stage === 'MENU'
                      ? (language === 'ta' ? 'பரிவர்த்தனையைத் தேர்ந்தெடுக்கவும் (SELECT TRANSACTION)' : 'SELECT TRANSACTION')
                      : stage === 'SUCCESS'
                      ? (language === 'ta' ? 'பரிவர்த்தனை வெற்றி ✓ (TRANSACTION SUCCESSFUL)' : 'TRANSACTION SUCCESSFUL ✓')
                      : stage === 'BALANCE'
                      ? (language === 'ta' ? 'கணக்கு இருப்பு விவரம் (BALANCE INQUIRY)' : 'BALANCE INQUIRY')
                      : stage === 'STATEMENT'
                      ? (language === 'ta' ? 'குறு கணக்கு அறிக்கை (MINI STATEMENT)' : 'MINI STATEMENT')
                      : (language === 'ta' ? 'பணம் எடுக்கும் தொகையைத் தேர்ந்தெடுக்கவும்' : 'SELECT WITHDRAWAL AMOUNT')}
                  </h2>
                </div>
              </div>

              {/* Balance Badge */}
              <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                <Wallet className="h-4 w-4 text-emerald-400" />
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">AVAILABLE BALANCE</span>
                  <span className="text-xs font-bold text-white font-mono">
                    ₹{(availableBalance ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Voice Guidance Banner */}
            <div className="mt-5">
              <VoiceGuidancePromptBar
                currentKey={
                  stage === 'SUCCESS'
                    ? 'STEP5_THANK_YOU'
                    : stage === 'DISPENSING'
                    ? 'STEP5_CASH_DISPENSING'
                    : 'STEP5_CASH_PROMPT'
                }
              />
            </div>

            {/* STAGE 1: AMOUNT SELECTION OR CASH NOT AVAILABLE */}
            {isAtmEmpty ? (
              <div className="mt-6 space-y-5">
                <div className="p-6 rounded-3xl border-2 border-red-500 bg-red-950/70 text-center space-y-4 shadow-2xl shadow-red-950/60">
                  <div className="inline-flex p-4 rounded-2xl bg-red-600/30 text-red-400 border border-red-500/50 animate-bounce">
                    <AlertTriangle className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black tracking-wider uppercase font-mono">
                      VAULT SENSOR: 0% CASH AVAILABLE
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mt-3">
                      ⚠️ {language === 'ta' ? 'பணம் இருப்பு இல்லை' : 'CASH NOT AVAILABLE'}
                    </h3>
                    <p className="text-sm text-red-200 mt-2 max-w-lg mx-auto leading-relaxed">
                      {language === 'ta'
                        ? 'மன்னிக்கவும்! இந்த ATM முனையத்தில் பணம் தீர்ந்துவிட்டது. எங்கள் CashGuard IoT சென்சார்கள் மூலமாக வங்கி மேலாளருக்கு எச்சரிக்கை அனுப்பப்பட்டு, பணம் நிரப்பும் வண்டி அனுப்பப்பட்டுள்ளது.'
                        : 'We apologize! Cash withdrawal is currently unavailable at this terminal as vault reserves are fully depleted (0%). An automated low cash sensor alarm was triggered to the Bank Manager.'}
                    </p>
                  </div>

                  {/* Nearest ATM suggestion */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-left max-w-md mx-auto space-y-1.5 text-xs">
                    <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                      {language === 'ta' ? 'அருகிலுள்ள செயல்பாட்டில் உள்ள ATM:' : 'Nearest Operational ATM with Cash:'}
                    </div>
                    <div className="font-bold text-white text-sm flex items-center justify-between">
                      <span>Anna Nagar West Hub (ATM-102)</span>
                      <span className="text-emerald-400 font-mono">86% Cash</span>
                    </div>
                    <p className="text-slate-400">1.2 km away • ₹14,75,000 Available</p>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => navigateTo('ATM_MAP')}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/40 transition cursor-pointer"
                    >
                      🗺️ {language === 'ta' ? 'மேப்பில் தேட' : 'Locate on Fleet Map'}
                    </button>

                    <button
                      onClick={() => openRefillModal(currentAtm?.id)}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 transition cursor-pointer"
                    >
                      🚚 {language === 'ta' ? 'பணம் நிரப்ப (Refill 100%)' : 'Simulate Refill (100%)'}
                    </button>

                    <button
                      onClick={() => finishAtmSession()}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                    >
                      💳 {language === 'ta' ? 'கார்டை திரும்பப் பெற' : 'Eject Card & Exit'}
                    </button>
                  </div>
                </div>

                {/* Sensor Simulation Quick Test */}
                <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center text-xs">
                  <span className="text-slate-400 text-[11px] block mb-2">
                    Demo Simulation: Test different cash sensor readings for {currentAtm?.name}:
                  </span>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => updateAtmCashLevel(currentAtm.id, 85)}
                      className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-bold hover:bg-emerald-900 transition"
                    >
                      🟢 Set to 85% (Normal)
                    </button>
                    <button
                      onClick={() => updateAtmCashLevel(currentAtm.id, 45)}
                      className="px-3 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-700 text-xs font-bold hover:bg-amber-900 transition"
                    >
                      🟡 Set to 45% (Warning)
                    </button>
                    <button
                      onClick={() => updateAtmCashLevel(currentAtm.id, 20)}
                      className="px-3 py-1 rounded-lg bg-red-950 text-red-300 border border-red-700 text-xs font-bold hover:bg-red-900 transition"
                    >
                      🔴 Set to 20% (Critical)
                    </button>
                  </div>
                </div>
              </div>
            ) : stage === 'MENU' ? (
              <div className="mt-6 space-y-4">
                {/* Non-Reader Voice Accessibility Bar */}
                <div className="rounded-2xl bg-cyan-950/70 border border-cyan-500/40 p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center space-x-2 text-left">
                    <Volume2 className="h-4 w-4 text-cyan-400 animate-pulse shrink-0" />
                    <span className="text-cyan-200">
                      {language === 'ta'
                        ? '📢 படிக்கத் தெரியாதவர்களுக்கான உதவி: ஒவ்வொரு ஆப்ஷனையும் தொட்டால் அதுவே தமிழில் பேசும்.'
                        : '📢 Non-Reader Voice Assistance: Touching or hovering any option reads it aloud.'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      speakItem(
                        'ஏடிஎம் முதன்மை பட்டி. ஒன்று: பணம் எடுப்பது. இரண்டு: வங்கி இருப்பு விவரம். மூன்று: குறு கணக்கு அறிக்கை. நான்கு: பரிவர்த்தனை ரத்து செய்ய.',
                        'ATM Main Menu. 1: Cash Withdrawal. 2: Balance Inquiry. 3: Mini Statement. 4: Cancel and Exit.',
                        true
                      );
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-bold shrink-0 cursor-pointer flex items-center space-x-1"
                  >
                    <span>🔊</span>
                    <span>{language === 'ta' ? 'அனைத்து மெனுவைக் கேள்' : 'Hear All Menus'}</span>
                  </button>
                </div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {language === 'ta' ? 'தேவையான பரிவர்த்தனையைத் தேர்ந்தெடுக்கவும்:' : 'Please select your desired ATM transaction:'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    onClick={() => {
                      setStage('SELECT');
                      speakItem('பணம் எடுப்பது தேர்ந்தெடுக்கப்பட்டது. தேவையான தொகையைத் தேர்ந்தெடுக்கவும்.', 'Cash withdrawal selected. Please choose amount.');
                    }}
                    onMouseEnter={() => speakItem('பணம் எடுப்பது', 'Cash withdrawal')}
                    className="p-5 rounded-2xl border border-emerald-500/40 bg-slate-950/80 hover:bg-emerald-950/40 hover:border-emerald-500 text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 group-hover:scale-110 transition">
                        <Banknote className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">
                          {language === 'ta' ? 'பணம் எடுப்பது (Cash Withdrawal)' : 'Cash Withdrawal'}
                        </h4>
                        <p className="text-xs text-slate-400">Dispense currency notes</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setStage('BALANCE');
                      speakItem(`உங்கள் வங்கி இருப்புத் தொகை ${(availableBalance ?? 0).toLocaleString('en-IN')} ரூபாய்.`, `Your available balance is ${(availableBalance ?? 0).toLocaleString('en-IN')} rupees.`);
                    }}
                    onMouseEnter={() => speakItem('வங்கி இருப்பு விவரம்', 'Balance inquiry')}
                    className="p-5 rounded-2xl border border-blue-500/30 bg-slate-950/80 hover:bg-blue-950/40 hover:border-blue-500 text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 group-hover:scale-110 transition">
                        <Wallet className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">
                          {language === 'ta' ? 'இருப்பு விவரம் (Balance Inquiry)' : 'Balance Inquiry'}
                        </h4>
                        <p className="text-xs text-slate-400">View real-time account balance</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setStage('STATEMENT');
                      speakItem('குறு கணக்கு அறிக்கை. முந்தைய ஐந்து பரிவர்த்தனைகள் திரையில் காட்டப்படுகின்றன.', 'Mini statement of last five transactions.');
                    }}
                    onMouseEnter={() => speakItem('குறு அறிக்கை', 'Mini statement')}
                    className="p-5 rounded-2xl border border-cyan-500/30 bg-slate-950/80 hover:bg-cyan-950/40 hover:border-cyan-500 text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400 group-hover:scale-110 transition">
                        <Receipt className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">
                          {language === 'ta' ? 'குறு அறிக்கை (Mini Statement)' : 'Mini Statement'}
                        </h4>
                        <p className="text-xs text-slate-400">Print last 5 transactions</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      speakItem('பரிவர்த்தனை ரத்து செய்யப்படுகிறது. கார்டைப் பெற்றுக் கொள்ளவும்.', 'Canceling transaction. Please collect your card.');
                      finishAtmSession();
                    }}
                    onMouseEnter={() => speakItem('பரிவர்த்தனை ரத்து செய்ய', 'Cancel transaction')}
                    className="p-5 rounded-2xl border border-slate-700 bg-slate-950/80 hover:bg-slate-800 text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-slate-300 group-hover:scale-110 transition">
                        <Home className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-rose-300 text-base">
                          {language === 'ta' ? 'ரத்து செய்க (Cancel Transaction)' : 'Cancel Transaction'}
                        </h4>
                        <p className="text-xs text-slate-400">Eject card and exit</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            ) : stage === 'BALANCE' ? (
              <div className="mt-6 space-y-5">
                <div className="p-6 rounded-2xl border border-blue-500/30 bg-slate-950 text-center space-y-3">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">PRIMARY SAVINGS ACCOUNT</span>
                  <div className="text-3xl font-black font-mono text-emerald-400">
                    ₹{(availableBalance ?? 0).toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-slate-400">
                    Cardholder: <strong className="text-white">{currentUser?.name}</strong> • Masked A/C: <span className="font-mono text-slate-200">**** 8842</span>
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      speakItem('முதன்மை பட்டிக்கு திரும்பச் செல்கிறீர்கள்', 'Back to main menu');
                      setStage('MENU');
                    }}
                    onMouseEnter={() => speakItem('முதன்மை பட்டி', 'Main menu')}
                    className="flex-1 py-3.5 px-4 rounded-2xl border border-slate-700 bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700 cursor-pointer"
                  >
                    ← Back to Menu
                  </button>
                  <button
                    onClick={() => {
                      speakItem('கார்டைப் பெற்றுக்கொள்ளவும்', 'Please collect your card');
                      finishAtmSession();
                    }}
                    onMouseEnter={() => speakItem('கார்டைப் பெற்றுக்கொண்டு வெளியேற', 'Eject card and exit')}
                    className="flex-1 py-3.5 px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-lg cursor-pointer"
                  >
                    Eject Card & Exit
                  </button>
                </div>
              </div>
            ) : stage === 'STATEMENT' ? (
              <div className="mt-6 space-y-5">
                <div className="p-5 rounded-2xl border border-slate-700 bg-white text-slate-900 font-mono text-xs space-y-2">
                  <div className="text-center pb-2 border-b border-dashed border-slate-300 font-bold uppercase">
                    MINI STATEMENT • SECUREGATE BANK
                  </div>
                  <div className="flex justify-between text-[11px]"><span>2026-09-02 • POS ATM Cash</span><span className="text-rose-600 font-bold">-₹2,000</span></div>
                  <div className="flex justify-between text-[11px]"><span>2026-09-01 • UPI Direct Deposit</span><span className="text-emerald-700 font-bold">+₹15,000</span></div>
                  <div className="flex justify-between text-[11px]"><span>2026-08-28 • Online Transfer</span><span className="text-rose-600 font-bold">-₹1,250</span></div>
                  <div className="pt-2 border-t border-dashed border-slate-300 flex justify-between font-bold">
                    <span>CURRENT BALANCE:</span>
                    <span>₹{(availableBalance ?? 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      speakItem('முதன்மை பட்டிக்கு திரும்பச் செல்கிறீர்கள்', 'Back to main menu');
                      setStage('MENU');
                    }}
                    onMouseEnter={() => speakItem('முதன்மை பட்டி', 'Main menu')}
                    className="flex-1 py-3.5 px-4 rounded-2xl border border-slate-700 bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700 cursor-pointer"
                  >
                    ← Back to Menu
                  </button>
                  <button
                    onClick={() => {
                      speakItem('கார்டைப் பெற்றுக்கொள்ளவும்', 'Please collect your card');
                      finishAtmSession();
                    }}
                    onMouseEnter={() => speakItem('கார்டைப் பெற்றுக்கொண்டு வெளியேற', 'Eject card and exit')}
                    className="flex-1 py-3.5 px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-lg cursor-pointer"
                  >
                    Eject Card & Exit
                  </button>
                </div>
              </div>
            ) : stage === 'SELECT' ? (
              <div className="mt-6 space-y-5">
                {/* Non-Reader Preset Amount Voice Prompt Bar */}
                <div className="rounded-2xl bg-cyan-950/70 border border-cyan-500/40 p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center space-x-2 text-left">
                    <Volume2 className="h-4 w-4 text-cyan-400 animate-pulse shrink-0" />
                    <span className="text-cyan-200">
                      {language === 'ta'
                        ? '📢 தொகையைத் தொட்டால் தமிழில் பேசும்: 500, 1000, 2000, 5000 ரூபாய்.'
                        : '📢 Touching amounts reads them aloud: 500, 1000, 2000, 5000 Rupees.'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      speakItem(
                        'பணம் எடுக்கும் தொகைகள். ஐந்து நூறு ரூபாய், ஆயிரம் ரூபாய், இரண்டாயிரம் ரூபாய், ஐந்தாயிரம் ரூபாய் ஆகியவை உள்ளன. தேவையான தொகையைத் தொடவும்.',
                        'Withdrawal amounts available: 500 rupees, 1000 rupees, 2000 rupees, and 5000 rupees. Please tap your required amount.',
                        true
                      );
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-bold shrink-0 cursor-pointer flex items-center space-x-1"
                  >
                    <span>🔊</span>
                    <span>{language === 'ta' ? 'தொகைகளைக் கேள்' : 'Hear Amounts'}</span>
                  </button>
                </div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Choose a preset withdrawal denomination:
                </p>

                {/* Preset Amount Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {presetAmounts.map(amt => {
                    const isSelected = !isCustom && selectedAmount === amt;
                    const item = AMOUNT_SPEECH[amt];
                    return (
                      <button
                        key={amt}
                        onClick={() => handleSelectPreset(amt)}
                        onMouseEnter={() => {
                          if (item) {
                            speakItem(item.ta, item.en);
                          }
                        }}
                        className={`p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-950/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-[1.02]'
                            : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="text-2xl font-black font-mono tracking-tight text-white">
                          ₹{(amt ?? 0).toLocaleString('en-IN')}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Fast Cash</p>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount Field */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Or Enter Other Amount:
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="e.g. 3000"
                      value={customAmount}
                      onChange={e => {
                        setCustomAmount(e.target.value);
                        setIsCustom(true);
                        setErrorMessage('');
                      }}
                      className={`w-full rounded-2xl bg-slate-950 border pl-9 pr-4 py-3.5 text-base font-mono font-bold text-white placeholder-slate-600 focus:outline-none focus:ring-2 ${
                        isCustom
                          ? 'border-emerald-500 ring-emerald-500/20'
                          : 'border-slate-800 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Error message */}
                {errorMessage && (
                  <div className="rounded-2xl border-2 border-rose-500 bg-rose-950/80 p-4 text-xs text-rose-200 flex items-start space-x-3 shadow-xl animate-shake">
                    <AlertTriangle className="h-6 w-6 shrink-0 text-rose-400 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-1">
                        {language === 'ta' ? '❌ பரிவர்த்தனை தோல்வியடைந்தது (TRANSACTION FAILED)' : '❌ TRANSACTION FAILED'}
                      </h4>
                      <p className="text-rose-200 font-medium leading-relaxed">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Confirm button */}
                <button
                  onClick={handleProceedToConfirm}
                  onMouseEnter={() => speakItem('தேர்ந்தெடுத்த தொகையை உறுதி செய்ய', 'Confirm selected withdrawal amount')}
                  className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition active:scale-[0.99] cursor-pointer"
                >
                  <span>{language === 'ta' ? 'தொகையை உறுதி செய்ய' : 'Confirm Withdrawal Amount'}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            ) : null}

            {/* STAGE 2: CONFIRMATION SUMMARY */}
            {stage === 'CONFIRM' && (
              <div className="mt-6 space-y-5">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-xs">
                    <span className="text-slate-400">Cardholder Name:</span>
                    <strong className="text-white font-semibold">{currentUser?.name}</strong>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-xs">
                    <span className="text-slate-400">Card Number:</span>
                    <span className="font-mono text-slate-300">{currentUser?.maskedCardNumber}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-xs">
                    <span className="text-slate-400">Transaction Fee:</span>
                    <span className="font-mono text-emerald-400 font-bold">₹0.00 (Free)</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 text-sm">
                    <span className="text-slate-300 font-bold">Dispense Amount:</span>
                    <span className="text-2xl font-black font-mono text-emerald-400">
                      ₹{(selectedAmount ?? 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      speakItem('தொகையை மாற்றும் திரை', 'Change amount screen');
                      setStage('SELECT');
                    }}
                    onMouseEnter={() => speakItem('தொகையை மாற்ற', 'Change amount')}
                    className="w-full sm:w-1/3 rounded-2xl border border-slate-700 bg-slate-800 py-3.5 px-4 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
                  >
                    {language === 'ta' ? 'தொகையை மாற்ற' : 'Change Amount'}
                  </button>

                  <button
                    onClick={handleExecuteWithdrawal}
                    onMouseEnter={() => speakItem('பணம் எடுக்க உறுதி செய்கிறீர்கள்', 'Confirm and dispense cash')}
                    className="w-full flex-1 flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-500 hover:to-teal-500 transition active:scale-[0.99] cursor-pointer"
                  >
                    <Banknote className="h-5 w-5" />
                    <span>{language === 'ta' ? 'பணம் பெற உறுதி செய்' : 'Confirm & Dispense Cash'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3: CASH DISPENSING ANIMATION */}
            {stage === 'DISPENSING' && (
              <div className="mt-6 py-10 flex flex-col items-center justify-center text-center">
                <div className="relative mb-6">
                  <div className="h-24 w-24 rounded-full border-4 border-slate-800 border-t-emerald-400 animate-spin flex items-center justify-center">
                    <Banknote className="h-10 w-10 text-emerald-400 animate-pulse" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white">Dispensing Cash...</h3>
                <p className="text-xs text-slate-400 mt-1">Please wait while the ATM cash dispenser counts notes.</p>
                <p className="text-xs font-mono font-bold text-emerald-400 mt-2">{dispenseProgress}%</p>
              </div>
            )}

            {/* STAGE 4: SUCCESS RECEIPT & FINISH */}
            {stage === 'SUCCESS' && transactionResult && (
              <div className="mt-6 space-y-6">
                {/* Success Banner */}
                <div className="rounded-2xl bg-emerald-950/70 border border-emerald-500/40 p-5 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-2">
                    <Check className="h-7 w-7 stroke-[3]" />
                  </div>
                  <h3 className="text-xl font-black text-white">
                    Cash Withdrawal Successful ✓
                  </h3>
                  <p className="text-3xl font-black font-mono text-emerald-400 mt-2">
                    ₹{(transactionResult?.amount ?? 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Transaction ID: <strong className="text-slate-200">{transactionResult?.transactionId}</strong>
                  </p>
                </div>

                {/* Realistic Thermal ATM Printed Receipt */}
                <div className="rounded-2xl border border-slate-700 bg-white text-slate-900 p-5 shadow-2xl font-mono text-xs">
                  <div className="text-center border-b border-dashed border-slate-300 pb-3 mb-3">
                    <h4 className="font-bold text-sm tracking-wider uppercase">SecureGate ATM Services</h4>
                    <p className="text-[10px] text-slate-500">Terminal #01 • MFA Verified Transaction</p>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">TXN ID:</span>
                      <strong className="text-slate-900">{transactionResult?.transactionId}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">DATE & TIME:</span>
                      <span>{transactionResult?.formattedDate} {transactionResult?.formattedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">CARDHOLDER:</span>
                      <span>{transactionResult?.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">AUTH TYPE:</span>
                      <span className="text-emerald-700 font-bold">3-FACTOR MFA (CARD+FACE+PIN)</span>
                    </div>
                    <div className="flex justify-between border-t border-dashed border-slate-300 pt-2 font-bold text-xs">
                      <span>WITHDRAWAL AMOUNT:</span>
                      <span>₹{(transactionResult?.amount ?? 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>REMAINING BALANCE:</span>
                      <span>₹{(transactionResult?.remainingBalance ?? 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-dashed border-slate-300 text-center text-[10px] text-slate-500">
                    Thank you for banking with SecureGate. Please collect your cash & card.
                  </div>
                </div>

                {/* WhatsApp E-Receipt Action Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setWhatsappSent(true);
                      try {
                        const synth = window.speechSynthesis;
                        if (synth) {
                          synth.cancel();
                          const utter = new SpeechSynthesisUtterance(language === 'ta' ? 'வாட்ஸ்அப் இ-ரசீது வெற்றிகரமாக அனுப்பப்பட்டது' : 'WhatsApp E-Receipt dispatched successfully');
                          utter.lang = language === 'ta' ? 'ta-IN' : 'en-US';
                          synth.speak(utter);
                        }
                      } catch (e) {}
                    }}
                    className={`w-full py-3 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                      whatsappSent
                        ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                        : 'bg-teal-950/60 hover:bg-teal-900/80 border-teal-500/40 text-teal-300'
                    }`}
                  >
                    <Send className="w-4 h-4 text-teal-400" />
                    <span>
                      {whatsappSent
                        ? (language === 'ta' ? '✅ வாட்ஸ்அப் இ-ரசீது அனுப்பப்பட்டது!' : '✅ WhatsApp E-Receipt Sent!')
                        : (language === 'ta' ? '🎟️ வாட்ஸ்அப் இ-ரசீது பெறுக (WhatsApp Receipt)' : '🎟️ Send WhatsApp E-Receipt')}
                    </span>
                  </button>
                </div>

                {/* Finish Button */}
                <button
                  onClick={finishAtmSession}
                  className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 py-4 px-6 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-500 transition active:scale-[0.99]"
                >
                  <Home className="h-5 w-5" />
                  <span>FINISH TRANSACTION & RETURN HOME</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Security Statement Footer */}
      <div className="mt-6 text-center text-xs text-slate-500">
        <p>ATM Hardware Dispenser • Auto-Cassette Anti-Skimming Vault Protected</p>
      </div>
    </div>
  );
};
