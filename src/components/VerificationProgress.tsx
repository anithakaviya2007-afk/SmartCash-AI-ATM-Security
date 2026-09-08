import React from 'react';
import { ScanFace, CreditCard, KeyRound, ShieldCheck, Banknote, Check, ShieldAlert, Lock } from 'lucide-react';
import { VerificationStep } from '../types';
import { useSecurity } from '../context/SecurityContext';

interface VerificationProgressProps {
  currentStep: VerificationStep;
  completedSteps?: VerificationStep[];
  stepNumber?: number; // 1 to 5
}

export const VerificationProgress: React.FC<VerificationProgressProps> = ({
  currentStep,
  completedSteps = [],
  stepNumber
}) => {
  const { language } = useSecurity();

  const steps: { id: VerificationStep; label: string; shortLabel: string; icon: React.ReactNode; number: number }[] = [
    {
      id: 'CARD',
      label: language === 'ta' ? 'கார்டு உள்ளீடு' : 'Insert Card',
      shortLabel: language === 'ta' ? 'கார்டு' : 'Card',
      icon: <CreditCard className="h-4 w-4" />,
      number: 1
    },
    {
      id: 'FACE',
      label: language === 'ta' ? 'முக ஸ்கேன்' : 'Face Scan',
      shortLabel: language === 'ta' ? 'முகம்' : 'Face',
      icon: <ScanFace className="h-4 w-4" />,
      number: 2
    },
    {
      id: 'PIN',
      label: language === 'ta' ? 'PIN சரிபார்ப்பு' : 'PIN Verify',
      shortLabel: 'PIN',
      icon: <KeyRound className="h-4 w-4" />,
      number: 3
    },
    {
      id: 'DECISION' as VerificationStep,
      label: language === 'ta' ? 'அணுகல் அனுமதி' : 'Access Decision',
      shortLabel: language === 'ta' ? 'அனுமதி' : 'Decision',
      icon: <ShieldCheck className="h-4 w-4" />,
      number: 4
    },
    {
      id: 'WITHDRAWAL',
      label: language === 'ta' ? 'பணம் எடுத்தல்' : 'Cash Services',
      shortLabel: language === 'ta' ? 'பணம்' : 'Cash',
      icon: <Banknote className="h-4 w-4" />,
      number: 5
    }
  ];

  const currentStepObj = steps.find(s => s.id === currentStep) || steps[0];
  const activeNumber = stepNumber || currentStepObj.number;

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 px-2">
      <div className="rounded-2xl border border-blue-500/20 bg-slate-900/90 p-4 shadow-xl shadow-blue-950/40 backdrop-blur-md">
        
        {/* Top bar with Step Counter and SecureGate Protected Badge */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-950 border border-blue-500/40 text-blue-400 font-mono font-bold tracking-wider text-[11px]">
              {language === 'ta' ? `படி ${activeNumber} / 5` : `STEP ${activeNumber} OF 5`}
            </span>
            <span className="font-semibold text-slate-300 hidden sm:inline">
              {currentStepObj.label}
            </span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-[11px] font-semibold">
            <Lock className="h-3 w-3 animate-pulse text-emerald-400" />
            <span>{language === 'ta' ? 'பாதுகாக்கப்பட்ட ATM முனையம்' : 'SecureGate Protected'}</span>
          </div>
        </div>

        {/* 5-Step Visual Stepper */}
        <div className="relative flex items-center justify-between">
          {/* Background Connecting Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />

          {steps.map((s) => {
            const isCompleted = completedSteps.includes(s.id) || s.number < activeNumber;
            const isCurrent = currentStep === s.id || s.number === activeNumber;

            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center group">
                <div
                  className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl transition-all duration-300 font-bold text-xs shadow-md ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-emerald-500/20 ring-2 ring-emerald-500/40 scale-105'
                      : isCurrent
                      ? 'bg-blue-600 text-white shadow-blue-500/40 ring-4 ring-blue-500/30 scale-110 animate-pulse'
                      : 'bg-slate-800 text-slate-500 ring-1 ring-slate-700'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : (
                    <span>{s.icon}</span>
                  )}
                </div>

                <div className="mt-2 text-center">
                  <span
                    className={`block text-[10px] sm:text-xs font-semibold transition-colors ${
                      isCompleted
                        ? 'text-emerald-400'
                        : isCurrent
                        ? 'text-blue-400 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{s.shortLabel}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
