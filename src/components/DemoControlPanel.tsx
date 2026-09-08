import React from 'react';
import {
  X,
  Sparkles,
  UserCheck,
  AlertTriangle,
  RotateCcw,
  Unlock,
  ShieldCheck,
  CreditCard,
  ScanFace,
  KeyRound,
  ShieldAlert,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  Camera,
  Send
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

interface DemoControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoControlPanel: React.FC<DemoControlPanelProps> = ({ isOpen, onClose }) => {
  const {
    users,
    activeUser,
    demoSimulationMode,
    setDemoSimulationMode,
    quickPassDemo,
    triggerStolenCardDemoScenario,
    testFaceScanner,
    unlockSecurityLock,
    session,
    startVerification,
    navigateTo,
    handleStep2CardScan,
    jumpToStep
  } = useSecurity();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="h-full w-full max-w-md bg-slate-900 p-6 shadow-2xl border-l border-slate-800 text-slate-100 overflow-y-auto flex flex-col justify-between">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">
                  SecureGate ATM Demo Controls
                </h3>
                <p className="text-[11px] text-slate-400">
                  Scenario testing for project presentation & viva
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                ⚡ Presentation Fast-Track
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    quickPassDemo();
                    onClose();
                  }}
                  className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 p-2.5 text-xs font-bold text-white shadow-md hover:from-emerald-500 hover:to-teal-500 transition"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Legitimate Pass (Step 5)</span>
                </button>

                <button
                  onClick={() => {
                    triggerStolenCardDemoScenario();
                    onClose();
                  }}
                  className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 p-2.5 text-xs font-bold text-white shadow-md hover:from-rose-500 hover:to-red-500 transition"
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>Stolen Card Fraud Test</span>
                </button>
              </div>
            </div>

            {/* Direct Step 1-5 Navigator */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                🔢 Jump Direct to Step (1 - 5)
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { step: 1, label: '1. Face', icon: <ScanFace className="h-3 w-3" /> },
                  { step: 2, label: '2. Card', icon: <CreditCard className="h-3 w-3" /> },
                  { step: 3, label: '3. PIN', icon: <KeyRound className="h-3 w-3" /> },
                  { step: 4, label: '4. Decis', icon: <ShieldCheck className="h-3 w-3" /> },
                  { step: 5, label: '5. Cash', icon: <Banknote className="h-3 w-3" /> },
                ].map(s => (
                  <button
                    key={s.step}
                    onClick={() => {
                      jumpToStep(s.step as any);
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 text-center text-[10px] font-bold text-slate-300 hover:text-white transition flex flex-col items-center gap-1"
                  >
                    <span>{s.icon}</span>
                    <span>Step {s.step}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Personas */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                👤 Select Cardholder Persona
              </p>
              <div className="space-y-1.5">
                {users.map(u => {
                  const isSelected = activeUser?.userId === u.userId;
                  return (
                    <div
                      key={u.userId}
                      onClick={() => {
                        handleStep2CardScan(u.cardNumber);
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition text-xs ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-950/50 text-cyan-200 font-semibold'
                          : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        {u.faceImageUrl ? (
                          <img
                            src={u.faceImageUrl}
                            alt={u.name}
                            className="h-7 w-7 rounded-full object-cover border border-cyan-500/40 shrink-0"
                          />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 font-bold text-[11px] text-cyan-400 border border-cyan-500/30 shrink-0">
                            {u.name[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white">{u.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {u.maskedCardNumber} • PIN: {u.pinCode}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                        ₹{u.atmBalance.toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulation Modes */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                🧪 Biometric & Hardware Simulation Mode
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setDemoSimulationMode('NORMAL')}
                  className={`p-2.5 rounded-xl border text-left font-medium transition ${
                    demoSimulationMode === 'NORMAL'
                      ? 'border-emerald-500 bg-emerald-950/50 text-emerald-300 font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Legitimate Mode</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Face match &gt; 95%</p>
                </button>

                <button
                  onClick={() => setDemoSimulationMode('STOLEN_CARD')}
                  className={`p-2.5 rounded-xl border text-left font-medium transition ${
                    demoSimulationMode === 'STOLEN_CARD'
                      ? 'border-purple-500 bg-purple-950/50 text-purple-300 font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <ShieldAlert className="h-3.5 w-3.5 text-purple-400" />
                    <span>Stolen Card Imposter</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Valid PIN, Face Mismatch</p>
                </button>

                <button
                  onClick={() => setDemoSimulationMode('FAIL_FACE')}
                  className={`p-2.5 rounded-xl border text-left font-medium transition ${
                    demoSimulationMode === 'FAIL_FACE'
                      ? 'border-rose-500 bg-rose-950/50 text-rose-300 font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <ScanFace className="h-3.5 w-3.5 text-rose-400" />
                    <span>Force Face Fail</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Confidence &lt; 45%</p>
                </button>

                <button
                  onClick={() => setDemoSimulationMode('FAIL_PIN')}
                  className={`p-2.5 rounded-xl border text-left font-medium transition ${
                    demoSimulationMode === 'FAIL_PIN'
                      ? 'border-amber-500 bg-amber-950/50 text-amber-300 font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <KeyRound className="h-3.5 w-3.5 text-amber-400" />
                    <span>Force Wrong PIN</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Incorrect PIN Pad</p>
                </button>
              </div>
            </div>

            {/* Lock status */}
            {session.isSecurityLocked && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/50 p-3">
                <div className="flex items-center space-x-2 text-rose-400">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-bold">ATM TERMINAL LOCKED</span>
                </div>
                <p className="mt-1 text-[11px] text-rose-300">
                  {session.lockReason}
                </p>
                <button
                  onClick={unlockSecurityLock}
                  className="mt-2 flex w-full items-center justify-center space-x-1.5 rounded-lg bg-rose-600 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700"
                >
                  <Unlock className="h-3.5 w-3.5" />
                  <span>Clear Security Lock</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-4 mt-6">
          <button
            onClick={() => {
              unlockSecurityLock();
              navigateTo('WELCOME');
              onClose();
            }}
            className="flex w-full items-center justify-center space-x-2 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo to Welcome Screen</span>
          </button>
        </div>

      </div>
    </div>
  );
};
