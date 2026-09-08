import React, { useState, useEffect, useRef } from 'react';
import {
  KeyRound,
  ShieldCheck,
  RotateCcw,
  Clock,
  Phone,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { VerificationProgress } from '../components/VerificationProgress';
import { playSound } from '../utils/soundEffects';

export const OtpVerificationView: React.FC = () => {
  const {
    session,
    handleVerifyOtp,
    resendOtp,
    resetVerification,
    liveDateTime
  } = useSecurity();

  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isResending, setIsResending] = useState<boolean>(false);
  const [showChangePhoneModal, setShowChangePhoneModal] = useState<boolean>(false);
  const [tempPhone, setTempPhone] = useState<string>(session.currentUser?.phoneNumber || '9840111234');
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 60-second countdown timer
  useEffect(() => {
    if (timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds]);

  const handleDigitChange = (index: number, val: string) => {
    playSound.keyPress();
    setErrorMessage('');
    if (!/^\d*$/.test(val)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = val.slice(-1);
    setOtpDigits(newDigits);

    // Auto advance focus
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const submitOtp = (customOtp?: string) => {
    const fullOtp = customOtp || otpDigits.join('');

    if (fullOtp.length < 6) {
      setErrorMessage('Please enter all 6 digits of the OTP code.');
      return;
    }

    if (timerSeconds === 0) {
      setErrorMessage('OTP Expired. Please request a new passcode.');
      return;
    }

    const res = handleVerifyOtp(fullOtp);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const handleResend = () => {
    setIsResending(true);
    const newCode = resendOtp();
    setOtpDigits(['', '', '', '', '', '']);
    setTimerSeconds(60);
    setErrorMessage('');
    setTimeout(() => {
      setIsResending(false);
      inputRefs.current[0]?.focus();
    }, 600);
  };

  const autoFillDemoOtp = () => {
    const code = session.activeOtpCode || '482910';
    setOtpDigits(code.split(''));
    submitOtp(code);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-orange-50 via-amber-50/60 to-rose-50/40 text-slate-800 p-4 sm:p-6 lg:p-8 flex flex-col justify-between transition-colors">
      
      <div>
        {/* Step Progress Tracker */}
        <VerificationProgress currentStep="OTP" completedSteps={['CARD', 'FACE']} />

        <div className="max-w-xl mx-auto w-full">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-orange-200/80 p-6 sm:p-8 shadow-xl shadow-orange-500/5 text-center">
            
            {/* Header Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/20 mb-4">
              <KeyRound className="h-8 w-8 stroke-[2.2]" />
            </div>

            <div className="inline-flex items-center space-x-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800 mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>STEP 3 OF 3: ONE-TIME PASSCODE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              OTP Verification
            </h2>

            {/* Target Phone Display */}
            <div className="mt-2 text-xs sm:text-sm text-slate-600 flex items-center justify-center space-x-1.5">
              <Phone className="h-3.5 w-3.5 text-orange-600" />
              <span>
                OTP sent to{' '}
                <strong className="font-mono text-slate-900 font-bold">
                  {session.currentUser?.maskedPhoneNumber || '******1234'}
                </strong>
              </span>
            </div>

            {/* Prototype Demo OTP Helper Banner */}
            <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50/90 p-3.5 text-left flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
                <div>
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">
                    DEMO OTP SIMULATOR:
                  </span>
                  <div className="text-xs text-amber-800 font-mono font-bold">
                    Active Code: <span className="bg-amber-200/80 px-2 py-0.5 rounded text-amber-950 font-extrabold tracking-widest">{session.activeOtpCode || '482910'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={autoFillDemoOtp}
                className="w-full sm:w-auto text-[11px] font-bold bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700 transition shadow-xs whitespace-nowrap"
              >
                Auto-Fill & Verify
              </button>
            </div>

            {/* 6-Digit OTP Box Grid */}
            <div className="mt-6 flex justify-center space-x-2 sm:space-x-3">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleDigitChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className={`h-12 w-11 sm:h-14 sm:w-13 rounded-2xl border text-center text-xl sm:text-2xl font-mono font-bold text-slate-900 shadow-xs transition-all focus:outline-none focus:ring-2 ${
                    errorMessage
                      ? 'border-rose-400 bg-rose-50/50 focus:border-rose-500 focus:ring-rose-500/20'
                      : digit
                      ? 'border-orange-500 bg-orange-50/40 focus:border-orange-500 focus:ring-orange-500/20'
                      : 'border-slate-200 bg-slate-50/80 focus:border-orange-500 focus:ring-orange-500/20'
                  }`}
                />
              ))}
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-700 flex items-center justify-center space-x-2 animate-shake">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* Timer & Resend Controls */}
            <div className="mt-6 flex items-center justify-between text-xs text-slate-500 px-2">
              <div className="flex items-center space-x-1.5 font-mono">
                <Clock className="h-3.5 w-3.5 text-orange-600" />
                <span>Expires in:</span>
                <strong className={`font-bold ${timerSeconds < 15 ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
                  00:{String(timerSeconds).padStart(2, '0')}
                </strong>
              </div>

              <button
                onClick={handleResend}
                disabled={isResending || timerSeconds > 40}
                className="font-bold text-orange-600 hover:text-orange-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center space-x-1"
              >
                <RotateCcw className={`h-3 w-3 ${isResending ? 'animate-spin' : ''}`} />
                <span>Resend OTP</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => submitOtp()}
                className="w-full flex-1 flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:from-orange-700 hover:to-amber-700 transition active:scale-[0.99]"
              >
                <span>Verify OTP & Grant Access</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setShowChangePhoneModal(true)}
                className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white py-3.5 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Change Number
              </button>
            </div>

            <div className="mt-4">
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

      {/* Change Phone Modal */}
      {showChangePhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Change Registered Mobile Number</h3>
            <p className="mt-1 text-xs text-slate-500">For demonstration / prototype reconfiguration.</p>
            <div className="mt-4">
              <input
                type="tel"
                value={tempPhone}
                onChange={e => setTempPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono"
                placeholder="10-digit mobile number"
              />
            </div>
            <div className="mt-5 flex space-x-2">
              <button
                onClick={() => {
                  setShowChangePhoneModal(false);
                  handleResend();
                }}
                className="flex-1 rounded-xl bg-orange-600 py-2 text-xs font-bold text-white"
              >
                Update & Send OTP
              </button>
              <button
                onClick={() => setShowChangePhoneModal(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Security Policy */}
      <div className="mt-6 text-center text-xs text-slate-400">
        <span>Security Policy: 3 maximum failed attempts triggers 3-minute temporary account lockout</span>
      </div>

    </div>
  );
};
