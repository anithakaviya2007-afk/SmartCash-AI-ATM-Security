import React from 'react';
import {
  CheckCircle2,
  CreditCard,
  Phone,
  User,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { VerificationProgress } from '../components/VerificationProgress';

export const CardVerifiedView: React.FC = () => {
  const {
    session,
    confirmCardAndProceedToFace,
    startVerification,
    resetVerification,
    liveDateTime
  } = useSecurity();

  const currentUser = session.currentUser;
  const scanTime = session.cardScanTimestamp || { date: liveDateTime.date, time: liveDateTime.time };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-cyan-50 via-sky-50 to-slate-50 text-slate-800 p-4 sm:p-6 lg:p-8 flex flex-col justify-between transition-colors">
      
      <div>
        {/* Step Progress */}
        <VerificationProgress currentStep="FACE" completedSteps={['CARD']} />

        <div className="max-w-xl mx-auto w-full">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-cyan-200/80 p-6 sm:p-8 shadow-xl shadow-cyan-500/5 text-center">
            
            {/* Success Icon Badge */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 mb-4 animate-bounce">
              <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
            </div>

            <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>STEP 1 VERIFIED</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Card Detected Successfully
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Smart RFID token cryptographic signature matched in registry.
            </p>

            {/* User & Card Details Card */}
            <div className="mt-6 rounded-2xl border border-cyan-100 bg-cyan-50/40 p-5 text-left space-y-3.5 shadow-xs">
              
              <div className="flex items-center justify-between border-b border-cyan-100 pb-3">
                <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1.5">
                  <User className="h-4 w-4 text-cyan-700" />
                  <span>User Name</span>
                </span>
                <span className="text-sm font-bold text-slate-900 font-mono">
                  {currentUser?.name || 'Anitha'}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-cyan-100 pb-3">
                <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1.5">
                  <CreditCard className="h-4 w-4 text-cyan-700" />
                  <span>Card ID</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-700 bg-cyan-100/70 px-2 py-0.5 rounded">
                  {currentUser?.cardId || 'CRD-882190'}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-cyan-100 pb-3">
                <span className="text-xs font-semibold text-slate-500">
                  Masked Card Number
                </span>
                <span className="text-sm font-mono font-bold text-slate-900 tracking-wider">
                  {currentUser?.maskedCardNumber || '**** **** **** 1234'}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-cyan-100 pb-3">
                <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1.5">
                  <Phone className="h-4 w-4 text-cyan-700" />
                  <span>Masked Mobile</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {currentUser?.maskedPhoneNumber || '******1234'}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-cyan-100 pb-3">
                <span className="text-xs font-semibold text-slate-500">
                  Card Status
                </span>
                <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                  <span>VALID</span>
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <span className="flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5 text-cyan-700" />
                  <span>Verification Timestamp</span>
                </span>
                <span className="font-mono font-medium text-slate-700">
                  {scanTime.date} • {scanTime.time}
                </span>
              </div>

            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={confirmCardAndProceedToFace}
                className="w-full sm:flex-1 flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition active:scale-[0.99]"
              >
                <span>Continue to Face Verification</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => startVerification()}
                className="w-full sm:w-auto flex items-center justify-center space-x-1.5 rounded-xl border border-slate-300 bg-white py-3.5 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retry Scan</span>
              </button>
            </div>

            <div className="mt-4">
              <button
                onClick={resetVerification}
                className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-4"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-400">
        <span>Proceeding to Step 2: High-Precision AI Face Mesh Comparison</span>
      </div>

    </div>
  );
};
