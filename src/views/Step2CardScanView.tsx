import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Wifi,
  Sparkles,
  RefreshCw,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Smartphone
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { VerificationProgress } from '../components/VerificationProgress';
import { VoiceGuidancePromptBar } from '../components/VoiceGuidancePromptBar';
import { playSound } from '../utils/soundEffects';

export const Step2CardScanView: React.FC = () => {
  const {
    session,
    users,
    activeUser,
    handleStep2CardScan,
    proceedFromStep2CardToStep3Pin,
    proceedFromStep2CardToFaceScan,
    demoSimulationMode,
    setDemoSimulationMode,
    speakGuidance,
    language
  } = useSecurity();

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [selectedCardNumber, setSelectedCardNumber] = useState<string>(
    activeUser?.cardNumber || users[0].cardNumber
  );
  const [scanResult, setScanResult] = useState<{
    completed: boolean;
    success: boolean;
    message: string;
  }>({
    completed: session.cardScanned,
    success: session.cardVerified,
    message: session.cardVerified ? 'Card Verified ✓' : ''
  });

  useEffect(() => {
    if (!session.cardVerified) {
      speakGuidance('STEP2_CARD_PROMPT');
    }
  }, [speakGuidance, session.cardVerified]);

  const handleSimulateInsert = (cardToScan?: string) => {
    const cardNum = cardToScan || selectedCardNumber;
    setIsScanning(true);
    setScanProgress(0);
    setDbLookupStage('READING');
    playSound.cardScan();

    let currentProgress = 0;
    // Stage 1: READING CARD...
    const interval = setInterval(() => {
      currentProgress += 25;
      setScanProgress(currentProgress);

      if (currentProgress >= 50 && currentProgress < 100) {
        setDbLookupStage('IDENTIFYING');
      } else if (currentProgress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setDbLookupStage('IDENTIFIED');

        const res = handleStep2CardScan(cardNum);
        setScanResult({
          completed: true,
          success: res.success,
          message: res.message
        });

        if (res.success) {
          speakGuidance('STEP2_CARD_SUCCESS');
        } else {
          speakGuidance('STEP2_CARD_MISMATCH');
        }
      }
    }, 220);
  };

  const [dbLookupStage, setDbLookupStage] = useState<'IDLE' | 'READING' | 'IDENTIFYING' | 'IDENTIFIED'>('IDLE');

  const activeCardUser = users.find(u => u.cardNumber === selectedCardNumber) || users[0];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <div>
        {/* Step Progress Tracker */}
        <VerificationProgress
          currentStep="CARD"
          stepNumber={1}
          completedSteps={[]}
        />

        <div className="max-w-3xl mx-auto w-full">
          <div className="bg-slate-900/90 rounded-3xl border border-blue-500/30 p-6 sm:p-8 shadow-2xl shadow-blue-950/60 backdrop-blur-md">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center space-x-3 text-center sm:text-left">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-400 text-[11px] font-mono font-bold mb-1">
                    <span>{language === 'ta' ? 'படி 1 / 5 • கார்டு உள்ளீடு' : 'STEP 1 OF 5 • CARD INSERTION & DB LOOKUP'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {language === 'ta' ? 'ATM கார்டு ஸ்கேன் மற்றும் உள்ளீடு' : 'ATM Card Scanning & Insertion'}
                  </h2>
                </div>
              </div>

              {/* Status indicator */}
              <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono text-slate-300">
                <Cpu className="h-4 w-4 text-cyan-400" />
                <span>{language === 'ta' ? 'EMV சிப் / RFID ஸ்கேனர்' : 'EMV CHIP / RFID SCANNER'}</span>
              </div>
            </div>

            {/* Voice Guidance Banner */}
            <div className="mt-5">
              <VoiceGuidancePromptBar
                currentKey={
                  scanResult.completed
                    ? scanResult.success
                      ? 'STEP2_CARD_SUCCESS'
                      : 'STEP2_CARD_MISMATCH'
                    : 'STEP2_CARD_PROMPT'
                }
              />
            </div>

            {/* ATM Hardware Slot & Card Animation Stage */}
            <div className="mt-6 relative rounded-2xl bg-slate-950 border border-slate-800 p-6 sm:p-8 flex flex-col items-center justify-center overflow-hidden">
              
              {/* ATM Card Slot Graphic */}
              <div className="w-full max-w-sm flex flex-col items-center mb-6">
                <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1 flex items-center space-x-1">
                  <span>CARD INSERTION SLOT #01</span>
                </div>
                <div className="w-full h-3.5 bg-slate-950 rounded-full border-2 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)] relative flex items-center justify-center">
                  <div className="w-4/5 h-1 bg-cyan-400/80 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Realistic Debit / ATM Card Visual */}
              <div className={`relative w-full max-w-sm h-52 sm:h-56 rounded-2xl p-5 sm:p-6 transition-all duration-500 shadow-2xl ${
                isScanning ? 'scale-95 translate-y-2 border-cyan-400 shadow-cyan-500/30' : 'scale-100 border-slate-700'
              } bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 border text-white flex flex-col justify-between overflow-hidden`}>
                
                {/* Background decorative holographic lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
                
                {/* Top card row */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm tracking-wider text-cyan-400">SecureGate Bank</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono">PLATINUM</span>
                  </div>
                  <Wifi className="h-5 w-5 text-cyan-400/70 rotate-90" />
                </div>

                {/* EMV Chip & Contactless indicator */}
                <div className="flex items-center space-x-3 z-10 my-1">
                  <div className="w-11 h-9 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-200 border border-amber-500/60 shadow-inner flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-1 opacity-40">
                      <div className="border-r border-b border-amber-900" />
                      <div className="border-l border-b border-amber-900" />
                      <div className="border-r border-t border-amber-900" />
                      <div className="border-l border-t border-amber-900" />
                    </div>
                  </div>
                  <Zap className="h-4 w-4 text-cyan-400 animate-pulse" />
                </div>

                {/* Card Number & Holder Name */}
                <div className="z-10">
                  <p className="font-mono text-base sm:text-lg tracking-widest font-bold text-slate-100">
                    {activeCardUser.maskedCardNumber}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-400">CARDHOLDER</p>
                      <p className="font-bold text-slate-200 tracking-wide">{activeCardUser.name}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-400">EXPIRES</p>
                      <p className="font-mono font-bold text-slate-300">12/29</p>
                    </div>
                  </div>
                </div>

                {/* Scanning Beam Overlay on Card */}
                {isScanning && (
                  <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none flex items-center justify-center">
                    <div className="w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-scan" />
                  </div>
                )}
              </div>

              {/* Real-time scan progress badge */}
              {isScanning && (
                <div className="mt-4 flex items-center space-x-2 bg-slate-900 px-4 py-2 rounded-xl border border-cyan-500/40 text-xs text-cyan-300 font-mono">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                  <span>Card Scanning... {scanProgress}%</span>
                </div>
              )}
            </div>

            {/* Quick Select Cardholder Personas */}
            <div className="mt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Select Demo ATM Card:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {users.map(u => {
                  const isSelected = selectedCardNumber === u.cardNumber;
                  return (
                    <div
                      key={u.userId}
                      onClick={() => {
                        setSelectedCardNumber(u.cardNumber);
                        setScanResult({ completed: false, success: false, message: '' });
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-950/30 text-white'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-200">{u.name}</p>
                        <p className="text-[11px] font-mono text-slate-400">{u.maskedCardNumber}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                        {u.accountStatus}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Result feedback box */}
            {scanResult.completed && (
              <div className="mt-5 space-y-3">
                <div className={`rounded-2xl border p-4 transition-all duration-300 ${
                  scanResult.success
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    {scanResult.success ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <h4 className="font-bold text-base text-white">
                        {scanResult.success
                          ? (language === 'ta' ? 'கார்டு கண்டறியப்பட்டது ✓ கார்டு உரிமையாளர் அடையாளம் காணப்பட்டார்' : 'CARD DETECTED ✓ • CARD OWNER IDENTIFIED')
                          : 'CARD OWNER VERIFICATION FAILED'}
                      </h4>
                      <p className="text-xs font-mono mt-0.5 text-slate-300">
                        Registered Owner Record Found in Secure Bank Database • Registered Face ID Retrieved • <span className="text-cyan-300">FACE VERIFICATION REQUIRED</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 italic">
                        🔒 Privacy Protection Active: Personal financial information & balances hidden on screen.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Linked Phone SMS Alert Confirmation Panel */}
                {scanResult.success && session.cardInsertSmsAlert && (
                  <div className="rounded-2xl border-2 border-cyan-500/60 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-4 text-xs shadow-xl shadow-cyan-950/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 shrink-0">
                          <Smartphone className="h-5 w-5 animate-pulse" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                              {language === 'ta' ? 'SMS அனுப்பப்பட்டது ✓' : 'SMS ALERT DISPATCHED ✓'}
                            </span>
                            <span className="text-[10px] font-mono text-cyan-300">
                              {session.cardInsertSmsAlert.timestamp}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-white text-sm mt-0.5">
                            {language === 'ta'
                              ? `கார்டு உரிமையாளரின் மொபைல் எண்ணிற்கு (${session.cardInsertSmsAlert.maskedPhone}) SMS எச்சரிக்கை அனுப்பப்பட்டது`
                              : `SMS Security Alert sent to linked mobile (${session.cardInsertSmsAlert.maskedPhone})`}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-200">
                      <div className="text-cyan-400 font-bold mb-1 flex items-center space-x-1.5">
                        <Zap className="h-3.5 w-3.5" />
                        <span>
                          {language === 'ta'
                            ? `ஏடிஎம் முகவரி எச்சரிக்கை (${session.cardInsertSmsAlert.atmName})`
                            : `ATM LOCATION SECURITY ALERT`}
                        </span>
                      </div>
                      <p className="leading-relaxed text-slate-300">
                        {language === 'ta' ? session.cardInsertSmsAlert.messageTextTa : session.cardInsertSmsAlert.messageTextEn}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              {!scanResult.completed || !scanResult.success ? (
                <button
                  onClick={() => handleSimulateInsert()}
                  disabled={isScanning}
                  className="w-full flex-1 flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 py-4 px-6 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-blue-500 hover:to-cyan-500 transition disabled:opacity-50 cursor-pointer"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>
                    {isScanning
                      ? (dbLookupStage === 'IDENTIFYING'
                          ? (language === 'ta' ? 'உரிமையாளர் அடையாளங்காணப்படுகிறது...' : 'IDENTIFYING CARD OWNER...')
                          : (language === 'ta' ? 'கார்டு வாசிக்கப்படுகிறது...' : 'READING CARD...'))
                      : (language === 'ta' ? 'கார்டை உள்ளிடவும் (PLEASE INSERT YOUR CARD)' : 'PLEASE INSERT YOUR CARD')}
                  </span>
                </button>
              ) : (
                <button
                  onClick={proceedFromStep2CardToFaceScan}
                  className="w-full flex-1 flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 py-4 px-6 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-500 hover:to-blue-500 transition active:scale-[0.99] cursor-pointer"
                >
                  <span>{language === 'ta' ? 'படி 2க்குச் செல்: முக ஸ்கேன் (PROCEED TO STEP 2: FACE SCAN)' : 'PROCEED TO STEP 2: FACE SCAN'}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Security Statement Footer */}
      <div className="mt-6 text-center text-xs text-slate-500">
        <p>EMV Chip Contactless Standard • AES-256 Magnetic Read Layer Active</p>
      </div>
    </div>
  );
};
