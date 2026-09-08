import React, { useState, useEffect, useRef } from 'react';
import {
  CreditCard,
  Scan,
  Sparkles,
  Camera,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Wifi
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { VerificationProgress } from '../components/VerificationProgress';

export const CardScanView: React.FC = () => {
  const {
    currentStep,
    handleCardScanned,
    users,
    liveDateTime,
    resetVerification
  } = useSecurity();

  const [scanningState, setScanningState] = useState<'IDLE' | 'DETECTING' | 'DETECTED' | 'ERROR'>('IDLE');
  const [selectedDemoCard, setSelectedDemoCard] = useState<string>(users[0].cardNumber);
  const [manualCardInput, setManualCardInput] = useState<string>('');
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [useRealCamera, setUseRealCamera] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Optional real webcam stream setup
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useRealCamera && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          setUseRealCamera(false);
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [useRealCamera]);

  const triggerScan = (cardString?: string) => {
    const cardToTest = cardString || manualCardInput || selectedDemoCard;
    setScanningState('DETECTING');
    setErrorMessage('');

    setTimeout(() => {
      setScanningState('DETECTED');
      setTimeout(() => {
        const result = handleCardScanned(cardToTest);
        if (!result.success) {
          setScanningState('ERROR');
          setErrorMessage(result.message);
        }
      }, 700);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-sky-50 to-slate-100 text-slate-800 p-4 sm:p-6 lg:p-8 flex flex-col justify-between transition-colors">
      
      <div>
        {/* Step Progress Tracker */}
        <VerificationProgress currentStep={currentStep} completedSteps={[]} />

        {/* Card Scanning Canvas Container */}
        <div className="max-w-2xl mx-auto w-full">
          
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-blue-200/80 p-6 sm:p-8 shadow-xl shadow-blue-500/5">
            
            {/* Header / Instructions */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 mb-2">
                <CreditCard className="h-3.5 w-3.5" />
                <span>STEP 1 OF 3: CARD AUTHENTICATION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Card Scanning & Verification
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Place your smart RFID / Access Card inside the scanning area
              </p>
            </div>

            {/* Scanner Viewport / Frame */}
            <div className="relative mx-auto w-full max-w-md h-64 sm:h-72 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-2 border-dashed border-blue-400/60 flex flex-col items-center justify-center overflow-hidden shadow-inner p-4">
              
              {/* Optional real camera video background */}
              {useRealCamera ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                />
              ) : (
                /* Tech background grid */
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2),transparent)] opacity-60" />
              )}

              {/* Animated Laser Scanning Line */}
              {scanningState === 'DETECTING' && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scan-laser z-20 pointer-events-none" />
              )}

              {/* Card Outline Bounding Box */}
              <div className="relative z-10 w-72 sm:w-80 h-44 rounded-xl border-2 border-blue-400/80 bg-blue-600/10 backdrop-blur-xs p-4 flex flex-col justify-between shadow-2xl transition-all">
                
                {/* Corner crosshairs */}
                <div className="absolute -top-1 -left-1 h-4 w-4 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute -top-1 -right-1 h-4 w-4 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-cyan-400" />

                {/* Card Top */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-white">
                    <Wifi className="h-4 w-4 rotate-90 text-cyan-300" />
                    <span className="text-[11px] font-mono tracking-widest text-cyan-200">SMART ACCESS</span>
                  </div>
                  <div className="h-6 w-8 rounded bg-amber-400/80 border border-amber-300 flex items-center justify-center">
                    <div className="h-3 w-5 border border-amber-600/40 rounded-xs" />
                  </div>
                </div>

                {/* Card Center Status */}
                <div className="text-center py-2">
                  {scanningState === 'IDLE' && (
                    <div className="flex flex-col items-center text-slate-300">
                      <Scan className="h-8 w-8 text-blue-400 mb-1 animate-pulse" />
                      <span className="text-xs font-medium">Align Card Inside Frame</span>
                    </div>
                  )}

                  {scanningState === 'DETECTING' && (
                    <div className="flex flex-col items-center text-cyan-300">
                      <div className="h-7 w-7 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-1" />
                      <span className="text-xs font-mono font-bold tracking-wider">DETECTING CARD...</span>
                    </div>
                  )}

                  {scanningState === 'DETECTED' && (
                    <div className="flex flex-col items-center text-emerald-300">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-1 animate-scale" />
                      <span className="text-xs font-mono font-bold tracking-wider">CARD DETECTED!</span>
                    </div>
                  )}

                  {scanningState === 'ERROR' && (
                    <div className="flex flex-col items-center text-rose-300">
                      <AlertCircle className="h-8 w-8 text-rose-400 mb-1" />
                      <span className="text-xs font-bold">{errorMessage || 'Invalid Card'}</span>
                    </div>
                  )}
                </div>

                {/* Card Bottom Masked Number */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>**** **** **** 1234</span>
                  <span className="text-[10px] text-cyan-300">DEMO NFC</span>
                </div>

              </div>

              {/* Hardware simulation badge */}
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>SIMULATED RFID SCANNER #01</span>
                <span>{liveDateTime.time}</span>
              </div>

            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-700 flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Preset Demo Selection Tabs */}
            <div className="mt-6 border-t border-slate-100 pt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                💳 Prototype Demo Card Selector:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {users.map(u => (
                  <button
                    key={u.userId}
                    onClick={() => {
                      setSelectedDemoCard(u.cardNumber);
                      setManualCardInput('');
                      setErrorMessage('');
                    }}
                    className={`p-2 rounded-xl text-left border transition text-xs ${
                      selectedDemoCard === u.cardNumber && !manualCardInput
                        ? 'border-blue-600 bg-blue-50/90 text-blue-900 font-bold ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <p className="truncate font-semibold">{u.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">{u.maskedCardNumber}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => triggerScan()}
                disabled={scanningState === 'DETECTING'}
                className="w-full sm:flex-1 flex items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 transition"
              >
                <Scan className="h-4 w-4" />
                <span>{scanningState === 'DETECTING' ? 'Scanning Card...' : 'Scan Card'}</span>
              </button>

              <button
                onClick={() => setShowManualModal(true)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl border border-slate-300 bg-white py-3.5 px-5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <span>Manual Card Entry</span>
              </button>

              <button
                onClick={() => setUseRealCamera(!useRealCamera)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl border border-slate-300 bg-white py-3.5 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                title="Toggle WebCam Video Stream"
              >
                <Camera className="h-4 w-4 text-blue-600" />
                <span className="hidden sm:inline">{useRealCamera ? 'Simulated Scanner' : 'WebCam Preview'}</span>
              </button>
            </div>

            {/* Cancel / Reset */}
            <div className="mt-4 text-center">
              <button
                onClick={resetVerification}
                className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-4"
              >
                Cancel Authentication
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Manual Card Input Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">
              Manual Card Number Entry (Demo Mode)
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Enter 16-digit card number or card ID for test simulation.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Demo Card Number
                </label>
                <input
                  type="text"
                  value={manualCardInput}
                  onChange={e => setManualCardInput(e.target.value)}
                  placeholder="e.g. 4532 8901 2345 1234 or CRD-882190"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 text-[11px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Quick Test Cards:</p>
                <p>• Anitha: <code className="bg-slate-200 px-1 rounded">4532 8901 2345 1234</code></p>
                <p>• Dr. Rahul: <code className="bg-slate-200 px-1 rounded">5120 7765 9988 5678</code></p>
                <p>• Priya: <code className="bg-slate-200 px-1 rounded">4912 3344 5566 9012</code></p>
                <p>• Invalid: <code className="bg-slate-200 px-1 rounded">9999 0000 1111 2222</code></p>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setShowManualModal(false);
                  triggerScan(manualCardInput);
                }}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                Validate Card
              </button>
              <button
                onClick={() => setShowManualModal(false)}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Privacy Notice */}
      <div className="mt-6 text-center text-xs text-slate-400">
        <span>🔒 Zero Card Data Storage • PCI-DSS Masked Format Protected</span>
      </div>

    </div>
  );
};
