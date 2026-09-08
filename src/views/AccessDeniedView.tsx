import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Home,
  Clock,
  Lock,
  Unlock,
  Calendar,
  HelpCircle,
  FileWarning
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export const AccessDeniedView: React.FC = () => {
  const {
    session,
    startVerification,
    resetVerification,
    unlockSecurityLock,
    liveDateTime
  } = useSecurity();

  const [lockCountdown, setLockCountdown] = useState<number>(180); // 3 minutes

  useEffect(() => {
    if (!session.isSecurityLocked || lockCountdown <= 0) return;
    const interval = setInterval(() => {
      setLockCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [session.isSecurityLocked, lockCountdown]);

  const lockMinutes = Math.floor(lockCountdown / 60);
  const lockSeconds = lockCountdown % 60;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-rose-50 via-red-50 to-slate-100 text-slate-800 p-4 sm:p-6 lg:p-8 flex flex-col justify-between transition-colors">
      
      <div className="max-w-xl mx-auto w-full my-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-rose-200/80 p-6 sm:p-8 shadow-2xl shadow-rose-500/10 text-center">
          
          {/* Animated Error / Warning Shield */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-rose-600 to-red-600 text-white shadow-xl shadow-rose-500/30 mb-4 animate-shake">
            {session.isSecurityLocked ? (
              <Lock className="h-10 w-10 stroke-[2.3]" />
            ) : (
              <ShieldAlert className="h-10 w-10 stroke-[2.3]" />
            )}
          </div>

          <p className="text-xs font-bold tracking-widest text-rose-700 uppercase font-mono">
            AUTHENTICATION FAILURE DETECTED
          </p>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-rose-950 tracking-tight mt-1">
            {session.isSecurityLocked ? 'SECURITY LOCK ACTIVATED' : 'ACCESS DENIED'}
          </h2>

          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            {session.lockReason || 'One or more authentication factors failed verification.'}
          </p>

          {/* Security Lock Timer Box */}
          {session.isSecurityLocked && (
            <div className="mt-6 rounded-2xl border border-rose-300 bg-rose-50/90 p-4 text-rose-900">
              <div className="flex items-center justify-center space-x-2 text-sm font-bold">
                <Clock className="h-4 w-4 text-rose-600 animate-spin" />
                <span>Temporary Lockout Active</span>
              </div>
              <div className="text-2xl font-mono font-extrabold text-rose-700 mt-1">
                0{lockMinutes}:{String(lockSeconds).padStart(2, '0')}
              </div>
              <p className="text-xs text-rose-600 mt-1">
                Verification interface locked against brute-force intrusion.
              </p>
            </div>
          )}

          {/* Incident Log Details */}
          <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50/40 p-4 text-left text-xs text-slate-700 space-y-2">
            
            <div className="flex items-center justify-between border-b border-rose-100 pb-2">
              <span className="font-semibold text-slate-500 flex items-center space-x-1.5">
                <Calendar className="h-3.5 w-3.5 text-rose-600" />
                <span>Incident Timestamp</span>
              </span>
              <span className="font-mono font-medium text-slate-800">
                {liveDateTime.date} • {liveDateTime.time}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-rose-100 pb-2">
              <span className="font-semibold text-slate-500">Failed Factor</span>
              <span className="font-bold text-rose-700 font-mono">
                {session.failedOtpAttempts > 0
                  ? `OTP (${session.failedOtpAttempts}/3 attempts)`
                  : session.failedFaceAttempts > 0
                  ? 'Face Recognition Biometric Mismatch'
                  : 'Invalid / Unregistered RFID Card'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold text-slate-500 flex items-center space-x-1.5">
                <FileWarning className="h-3.5 w-3.5 text-rose-600" />
                <span>Incident Log ID</span>
              </span>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-rose-200">
                {session.verificationId || 'SEC-LOG-ERR'}
              </span>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-col sm:flex-row items-center gap-3">
            {session.isSecurityLocked ? (
              <button
                onClick={unlockSecurityLock}
                className="w-full sm:flex-1 flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-rose-500/20 hover:from-rose-700 hover:to-red-700 transition"
              >
                <Unlock className="h-4 w-4" />
                <span>Admin Unlock (Demo Override)</span>
              </button>
            ) : (
              <button
                onClick={() => startVerification()}
                className="w-full sm:flex-1 flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Retry Verification</span>
              </button>
            )}

            <button
              onClick={resetVerification}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl border border-slate-300 bg-white py-3.5 px-5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Home className="h-4 w-4" />
              <span>Return to Portal</span>
            </button>
          </div>

        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-400">
        <span>Campus Security Operations Center (SOC) alerted automatically • Logged in audit registry</span>
      </div>

    </div>
  );
};
