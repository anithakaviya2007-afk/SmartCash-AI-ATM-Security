import React, { useState } from 'react';
import {
  DoorOpen,
  DoorClosed,
  Lock,
  Unlock,
  CheckCircle2,
  ShieldCheck,
  Building,
  User,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export const SecureLabView: React.FC = () => {
  const {
    activeUser,
    isDoorLocked,
    unlockLabDoor,
    lockLabDoor,
    liveDateTime,
    navigateTo
  } = useSecurity();

  const [selectedLab, setSelectedLab] = useState<string>('AI & Data Science Laboratory');
  const [unlockSuccessAnimation, setUnlockSuccessAnimation] = useState<boolean>(false);

  const handleUnlock = () => {
    unlockLabDoor();
    setUnlockSuccessAnimation(true);
    setTimeout(() => {
      setUnlockSuccessAnimation(false);
    }, 3000);
  };

  const handleLock = () => {
    lockLabDoor();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-teal-50 via-emerald-50/60 to-cyan-50 text-slate-800 p-4 sm:p-6 lg:p-8 flex flex-col justify-between transition-colors">
      
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Top Back & Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateTo('DASHBOARD')}
            className="flex items-center space-x-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-100/60 px-3 py-1.5 rounded-lg transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </button>

          <div className="flex items-center space-x-2 rounded-full bg-teal-100/80 px-3 py-1 text-xs font-bold text-teal-800">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>MFA AUTHENTICATED LAB ACCESS</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Door Lock Terminal Card */}
          <div className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-3xl border border-teal-200/80 p-6 sm:p-8 shadow-xl shadow-teal-500/5 flex flex-col justify-between">
            
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-teal-600 uppercase tracking-wide">
                    ELECTRONIC ACCESS CONTROL SYSTEM
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                    {selectedLab}
                  </h2>
                </div>

                <div className="h-10 w-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Building className="h-5 w-5" />
                </div>
              </div>

              {/* Lab Selector Tabs */}
              <div className="mt-4 flex flex-wrap gap-2">
                {['AI & Data Science Laboratory', 'Cyber Security & Forensics Lab', 'HPC Cluster Lab'].map(lab => (
                  <button
                    key={lab}
                    onClick={() => setSelectedLab(lab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      selectedLab === lab
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lab}
                  </button>
                ))}
              </div>

              {/* Interactive Electronic Door Strike Graphic */}
              <div className="mt-6 rounded-2xl bg-slate-950 p-6 text-center text-white relative overflow-hidden border-2 border-teal-500/30 shadow-inner">
                
                {/* Background Tech Mesh */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.15),transparent)]" />

                {/* Animated Door Graphic */}
                <div className="relative z-10 flex flex-col items-center">
                  
                  <div className={`flex h-24 w-24 items-center justify-center rounded-3xl border-2 transition-all duration-500 shadow-xl ${
                    isDoorLocked
                      ? 'border-rose-500/80 bg-rose-950/60 text-rose-400 shadow-rose-500/20'
                      : 'border-emerald-500/80 bg-emerald-950/60 text-emerald-400 shadow-emerald-500/30 animate-pulse'
                  }`}>
                    {isDoorLocked ? (
                      <DoorClosed className="h-12 w-12 stroke-[1.8]" />
                    ) : (
                      <DoorOpen className="h-12 w-12 stroke-[1.8] text-emerald-300" />
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="mt-4 flex items-center space-x-2">
                    <span className={`h-3 w-3 rounded-full animate-ping ${isDoorLocked ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    <span className="text-sm font-mono font-bold tracking-widest uppercase">
                      DOOR STATUS: {isDoorLocked ? 'LOCKED' : 'UNLOCKED'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    {isDoorLocked
                      ? 'Electromagnetic lock engaged • 12V 500kg holding force'
                      : 'Electromagnetic strike disengaged • Safe entry authorized'}
                  </p>

                </div>

                {/* Simulated Success Toast Overlay */}
                {unlockSuccessAnimation && (
                  <div className="absolute inset-0 bg-emerald-900/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-white animate-in fade-in zoom-in">
                    <CheckCircle2 className="h-12 w-12 text-emerald-300 mb-2 animate-bounce" />
                    <h4 className="text-lg font-bold">Door Unlocked Successfully</h4>
                    <p className="text-xs text-emerald-200">Electronic relay triggered • Push to enter</p>
                  </div>
                )}

              </div>
            </div>

            {/* Door Control Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {isDoorLocked ? (
                <button
                  onClick={handleUnlock}
                  className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 py-4 px-6 text-sm font-bold text-white shadow-lg shadow-teal-500/20 hover:from-teal-700 hover:to-emerald-700 transition active:scale-[0.99]"
                >
                  <Unlock className="h-5 w-5" />
                  <span>Unlock Door</span>
                </button>
              ) : (
                <button
                  onClick={handleLock}
                  className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-slate-800 py-4 px-6 text-sm font-bold text-white shadow-lg hover:bg-slate-900 transition active:scale-[0.99]"
                >
                  <Lock className="h-5 w-5" />
                  <span>Lock Door</span>
                </button>
              )}
            </div>

          </div>

          {/* Authorization & Access Metadata Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* User Access Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-teal-200/80 p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-4 flex items-center space-x-1.5">
                <User className="h-4 w-4 text-teal-600" />
                <span>Authorized Identity</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex justify-between border-b border-teal-50 pb-2">
                  <span className="text-slate-500">User Name:</span>
                  <span className="font-bold text-slate-900 font-mono">{activeUser?.name || 'Anitha'}</span>
                </div>

                <div className="flex justify-between border-b border-teal-50 pb-2">
                  <span className="text-slate-500">Access Status:</span>
                  <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                    <span>AUTHORIZED</span>
                  </span>
                </div>

                <div className="flex justify-between border-b border-teal-50 pb-2">
                  <span className="text-slate-500">Card ID:</span>
                  <span className="font-mono font-bold text-slate-800">{activeUser?.cardId || 'CRD-882190'}</span>
                </div>

                <div className="flex justify-between border-b border-teal-50 pb-2">
                  <span className="text-slate-500">Verification Level:</span>
                  <span className="font-semibold text-teal-700">Tier 3 (MFA Complete)</span>
                </div>

                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Live Timestamp:</span>
                  <span className="font-mono text-slate-800 font-medium">
                    {liveDateTime.date} • {liveDateTime.time}
                  </span>
                </div>
              </div>
            </div>

            {/* Access Checklist */}
            <div className="bg-teal-50/80 rounded-3xl border border-teal-200/80 p-5 space-y-2.5 text-xs text-teal-900">
              <p className="font-bold text-teal-950 uppercase tracking-wide text-[11px]">
                Access Security Checklist:
              </p>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>✓ Access Granted (Lab Authorized)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>✓ Identity Verified (Card + Face + OTP)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>✓ Security Audit Log Recorded with Time & Date</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-400">
        <span>Simulated Electronic Door Relay • Safe Hardware Emulation Mode</span>
      </div>

    </div>
  );
};
