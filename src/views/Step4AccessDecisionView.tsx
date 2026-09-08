import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  CreditCard,
  ScanFace,
  KeyRound,
  Lock,
  Unlock,
  AlertOctagon,
  UserX,
  UserCheck
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { VerificationProgress } from '../components/VerificationProgress';
import { VoiceGuidancePromptBar } from '../components/VoiceGuidancePromptBar';

export const Step4AccessDecisionView: React.FC = () => {
  const {
    session,
    activeUser,
    evaluateAccessDecision,
    proceedFromStep4DecisionToStep5Withdrawal,
    retryVerification,
    triggerStolenCardDemoScenario,
    quickPassDemo,
    speakGuidance,
    language
  } = useSecurity();

  const [decisionResult, setDecisionResult] = useState<{
    granted: boolean;
    reason: string;
  }>({
    granted: false,
    reason: ''
  });

  useEffect(() => {
    const res = evaluateAccessDecision();
    setDecisionResult(res);
    if (res.granted) {
      speakGuidance('STEP4_ACCESS_GRANTED');
    } else {
      if (session.cardVerified && session.pinVerified && !session.faceVerified) {
        speakGuidance('STEP4_FACE_MISMATCH');
      } else {
        speakGuidance('STEP4_ACCESS_DENIED');
      }
    }
  }, [evaluateAccessDecision, speakGuidance, session.cardVerified, session.pinVerified, session.faceVerified]);

  const currentUser = session.currentUser || activeUser;
  const isCardOk = session.cardVerified;
  const isFaceOk = session.faceVerified;
  const isPinOk = session.pinVerified;
  const isAllGranted = decisionResult.granted;

  // Check specifically if this is the Stolen Card scenario (Card OK + PIN OK + Face Mismatch)
  const isStolenCardFraud = isCardOk && isPinOk && !isFaceOk;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <div>
        {/* Step Progress Tracker */}
        <VerificationProgress
          currentStep="DECISION"
          stepNumber={4}
          completedSteps={isAllGranted ? ['FACE', 'CARD', 'PIN', 'DECISION'] : ['FACE', 'CARD', 'PIN']}
        />

        <div className="max-w-2xl mx-auto w-full">
          <div className={`rounded-3xl border p-6 sm:p-8 shadow-2xl backdrop-blur-md transition-all duration-300 ${
            isAllGranted
              ? 'bg-slate-900/90 border-emerald-500/40 shadow-emerald-950/40'
              : 'bg-slate-900/90 border-rose-500/40 shadow-rose-950/40'
          }`}>
            
            {/* Top Decision Header Icon */}
            <div className="text-center pb-6 border-b border-slate-800">
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-xl mb-3 transition-transform ${
                isAllGranted
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/30 scale-105'
                  : 'bg-gradient-to-tr from-rose-600 to-red-600 text-white shadow-rose-500/30 animate-pulse'
              }`}>
                {isAllGranted ? (
                  <ShieldCheck className="h-9 w-9 stroke-[2.2]" />
                ) : (
                  <ShieldAlert className="h-9 w-9 stroke-[2.2]" />
                )}
              </div>

              <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold mb-2 ${
                isAllGranted
                  ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950 border border-rose-500/40 text-rose-300'
              }`}>
                <span>{language === 'ta' ? 'படி 4 / 5 • அணுகல் அனுமதி கணிப்பு' : 'STEP 4 OF 5 • ACCESS DECISION MATRIX'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {isAllGranted ? 'ACCESS GRANTED ✓' : 'ACCESS DENIED'}
              </h2>

              {!isAllGranted && (
                <div className="mt-2 inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-rose-900/40 border border-rose-500/50 text-rose-200 text-xs font-bold">
                  <AlertOctagon className="h-4 w-4 text-rose-400" />
                  <span>TRANSACTION BLOCKED</span>
                </div>
              )}
            </div>

            {/* Voice Guidance Banner */}
            <div className="mt-5">
              <VoiceGuidancePromptBar
                currentKey={
                  isAllGranted
                    ? 'STEP4_ACCESS_GRANTED'
                    : !session.faceVerified
                    ? 'STEP4_FACE_MISMATCH'
                    : 'STEP4_ACCESS_DENIED'
                }
              />
            </div>

            {/* 3-Factor Verification Matrix Checklist */}
            <div className="mt-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Multi-Factor Security Evaluation:
              </p>

              {/* Factor 1: ATM Card */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                isCardOk
                  ? 'bg-slate-950/80 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-950/80 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    isCardOk ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                  }`}>
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">1. ATM Card Verification</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {currentUser?.maskedCardNumber || '**** **** **** 1234'} • Chip Valid
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 font-bold text-xs">
                  {isCardOk ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400 font-mono">PASSED ✓</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-rose-400" />
                      <span className="text-rose-400 font-mono">FAILED ✗</span>
                    </>
                  )}
                </div>
              </div>

              {/* Factor 2: Face Recognition Biometrics */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                isFaceOk
                  ? 'bg-slate-950/80 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-950/80 border-rose-500/40 text-rose-300 ring-2 ring-rose-500/20'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    isFaceOk ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                  }`}>
                    <ScanFace className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">2. Live Face Recognition</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Match Score: <strong className={isFaceOk ? 'text-emerald-400' : 'text-rose-400'}>{session.faceConfidence}%</strong> (Threshold: &gt;85%)
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 font-bold text-xs">
                  {isFaceOk ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400 font-mono">MATCHED ✓</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-rose-400" />
                      <span className="text-rose-400 font-mono">FACE MISMATCH ✗</span>
                    </>
                  )}
                </div>
              </div>

              {/* Factor 3: 6-Digit PIN */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                isPinOk
                  ? 'bg-slate-950/80 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-950/80 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    isPinOk ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                  }`}>
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">3. 6-Digit ATM PIN</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Cryptographic PinPad Hash Validated
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 font-bold text-xs">
                  {isPinOk ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400 font-mono">VERIFIED ✓</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-rose-400" />
                      <span className="text-rose-400 font-mono">INVALID ✗</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Crucial Security Explanation / Alert Banner */}
            {isStolenCardFraud && (
              <div className="mt-5 rounded-2xl border border-rose-500/50 bg-rose-950/60 p-4 text-xs text-rose-200 shadow-inner">
                <div className="flex items-start space-x-3">
                  <UserX className="h-6 w-6 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white mb-1">
                      ⚠️ STOLEN CARD FRAUD PREVENTION TRIGGERED
                    </h4>
                    <p className="leading-relaxed text-rose-200">
                      The ATM card belongs to <strong className="text-white">{currentUser?.name || 'Cardholder'}</strong> and the PIN entered is valid, but the <strong className="text-white">user standing at the ATM (Person B) does not match the cardholder's face</strong>.
                    </p>
                    <p className="mt-2 font-mono text-[11px] text-rose-300">
                      → Action: Unauthorized cash withdrawal blocked. Security SOC notified.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isAllGranted && (
              <div className="mt-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/50 p-4 text-xs text-emerald-200 shadow-inner">
                <div className="flex items-start space-x-3">
                  <UserCheck className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white mb-1">
                      AUTHENTICATED CARDHOLDER CONFIRMED
                    </h4>
                    <p className="leading-relaxed text-emerald-200">
                      Card, PIN, and biometric facial match are all verified for <strong className="text-white">{currentUser?.name}</strong>. Safe to proceed with cash withdrawal.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              {isAllGranted ? (
                <button
                  onClick={proceedFromStep4DecisionToStep5Withdrawal}
                  className="w-full flex-1 flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-4 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-500 hover:to-cyan-500 transition active:scale-[0.99]"
                >
                  <span>{language === 'ta' ? 'பணம் எடுக்க தொடரவும் (படி 5/5)' : 'PROCEED TO CASH WITHDRAWAL (Step 5/5)'}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={retryVerification}
                  className="w-full flex-1 flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 py-4 px-6 text-sm font-bold text-white shadow-lg shadow-rose-500/20 hover:from-rose-500 hover:to-amber-500 transition active:scale-[0.99]"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>{language === 'ta' ? 'மீண்டும் சரிபார்க்கவும்' : 'RETRY VERIFICATION'}</span>
                </button>
              )}
            </div>

            {/* Quick Demo Test Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-500">Presentation Quick Tests:</span>
              <div className="flex gap-2">
                <button
                  onClick={quickPassDemo}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold hover:bg-emerald-900 transition"
                >
                  Test: Legitimate Pass
                </button>
                <button
                  onClick={triggerStolenCardDemoScenario}
                  className="px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-300 text-[11px] font-bold hover:bg-rose-900 transition"
                >
                  Test: Stolen Card Fraud
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Security Statement Footer */}
      <div className="mt-6 text-center text-xs text-slate-500">
        <p>Zero-Trust Authentication Engine • Multi-Biometric ATM Protection</p>
      </div>
    </div>
  );
};
