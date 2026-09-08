import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  DoorOpen,
  Landmark,
  History,
  LogOut,
  User,
  MapPin,
  Calendar,
  Clock,
  Fingerprint,
  FileCheck
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { VerificationProgress } from '../components/VerificationProgress';

export const AccessGrantedView: React.FC = () => {
  const {
    session,
    navigateTo,
    resetVerification,
    liveDateTime
  } = useSecurity();

  const currentUser = session.currentUser;
  const accessTime = session.accessGrantedTimestamp || { date: liveDateTime.date, time: liveDateTime.time };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50/40 text-slate-800 p-4 sm:p-6 lg:p-8 flex flex-col justify-between transition-colors">
      
      <div>
        {/* Step Progress Tracker - All 4 Completed */}
        <VerificationProgress currentStep="ACCESS" completedSteps={['CARD', 'FACE', 'OTP', 'ACCESS']} />

        <div className="max-w-2xl mx-auto w-full">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-emerald-200/80 p-6 sm:p-8 shadow-2xl shadow-emerald-500/10 text-center">
            
            {/* Animated Shield / Success Emblem */}
            <div className="mx-auto relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-green-500 text-white shadow-xl shadow-emerald-500/30 mb-4 animate-scale">
              <ShieldCheck className="h-11 w-11 stroke-[2.3]" />
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center animate-ping" />
            </div>

            <p className="text-xs font-bold tracking-widest text-emerald-700 uppercase font-mono">
              FINAL SECURITY CHECK PASSED
            </p>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight mt-1">
              ACCESS GRANTED
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Identity Verified Successfully • All 3 Multi-Factor layers authenticated
            </p>

            {/* 3 Green Check Badges */}
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
              <div className="flex flex-col items-center p-3 rounded-2xl bg-emerald-50 border border-emerald-200/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mb-1" />
                <span className="text-xs font-bold text-emerald-900">Card Verified</span>
                <span className="text-[10px] text-emerald-600 font-mono">RFID Valid</span>
              </div>

              <div className="flex flex-col items-center p-3 rounded-2xl bg-emerald-50 border border-emerald-200/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mb-1" />
                <span className="text-xs font-bold text-emerald-900">Face Verified</span>
                <span className="text-[10px] text-emerald-600 font-mono">AI 96.8%</span>
              </div>

              <div className="flex flex-col items-center p-3 rounded-2xl bg-emerald-50 border border-emerald-200/70">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mb-1" />
                <span className="text-xs font-bold text-emerald-900">OTP Verified</span>
                <span className="text-[10px] text-emerald-600 font-mono">TOTP Active</span>
              </div>
            </div>

            {/* Verification Metadata Summary */}
            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 text-left text-xs text-slate-700 space-y-2.5">
              
              <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                <span className="font-semibold text-slate-500 flex items-center space-x-1.5">
                  <User className="h-4 w-4 text-emerald-700" />
                  <span>Authenticated User</span>
                </span>
                <span className="font-bold text-slate-900 font-mono text-sm">
                  {currentUser?.name || 'Anitha'} ({currentUser?.role || 'RESEARCHER'})
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                <span className="font-semibold text-slate-500 flex items-center space-x-1.5">
                  <MapPin className="h-4 w-4 text-emerald-700" />
                  <span>Access Location</span>
                </span>
                <span className="font-medium text-slate-800">
                  Campus Central Gateway • Terminal #01
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                <span className="font-semibold text-slate-500 flex items-center space-x-1.5">
                  <Calendar className="h-4 w-4 text-emerald-700" />
                  <span>Date & Time</span>
                </span>
                <span className="font-mono font-medium text-slate-800">
                  {accessTime.date} • {accessTime.time}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                <span className="font-semibold text-slate-500 flex items-center space-x-1.5">
                  <Fingerprint className="h-4 w-4 text-emerald-700" />
                  <span>Verification Method</span>
                </span>
                <span className="font-medium text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                  3-Layer Hybrid MFA (Card + Face + TOTP)
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-slate-500 flex items-center space-x-1.5">
                  <FileCheck className="h-4 w-4 text-emerald-700" />
                  <span>Verification Token ID</span>
                </span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {session.verificationId || 'SEC-884210'}
                </span>
              </div>

            </div>

            {/* Destination Selection Buttons */}
            <div className="mt-8 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Choose Destination Application:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => navigateTo('SECURE_LAB')}
                  className="flex items-center justify-center space-x-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 py-4 px-5 text-sm font-bold text-white shadow-lg shadow-teal-500/20 hover:from-teal-700 hover:to-emerald-700 transition active:scale-[0.99]"
                >
                  <DoorOpen className="h-5 w-5" />
                  <span>Enter Secure Lab</span>
                </button>

                <button
                  onClick={() => navigateTo('ATM_HOME')}
                  className="flex items-center justify-center space-x-2.5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 py-4 px-5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:from-blue-800 hover:to-indigo-800 transition active:scale-[0.99]"
                >
                  <Landmark className="h-5 w-5" />
                  <span>ATM Banking Services</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => navigateTo('ACCESS_HISTORY')}
                  className="flex items-center justify-center space-x-1.5 rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <History className="h-4 w-4" />
                  <span>View Access History</span>
                </button>

                <button
                  onClick={resetVerification}
                  className="flex items-center justify-center space-x-1.5 rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout Session</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-400">
        <span>Authorization Token Active for 15 minutes • Session Encrypted</span>
      </div>

    </div>
  );
};
