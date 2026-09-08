import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Layers,
  Sparkles,
  X,
  Lock,
  VolumeX,
  AlertCircle
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { ATM } from '../types';

interface RefillConfirmationModalProps {
  atm: ATM | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RefillConfirmationModal: React.FC<RefillConfirmationModalProps> = ({
  atm,
  isOpen,
  onClose
}) => {
  const { refillAtm, language, t } = useSecurity();
  const [securityPin, setSecurityPin] = useState<string>('582941');
  const [officerName, setOfficerName] = useState<string>('M. Vijay (Transit Officer #02)');
  const [confirmedNotes, setConfirmedNotes] = useState<boolean>(true);
  const [successAnim, setSuccessAnim] = useState<boolean>(false);

  if (!isOpen || !atm) return null;

  const totalReplenishAmount = atm.cashCapacity - atm.cashAmount;

  const handleConfirmRefill = () => {
    setSuccessAnim(true);
    setTimeout(() => {
      refillAtm(atm.id);
      setSuccessAnim(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 text-slate-100 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">
              {language === 'ta' ? 'பணம் நிரப்புதல் உறுதிப்படுத்தல்' : 'Cash Refill Confirmation'}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              CashGuard AI • DIGITAL CUSTODY & REPLENISHMENT HANDOVER
            </p>
          </div>
        </div>

        {/* Target ATM Info */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white text-sm">{atm.name}</span>
            <span className="font-mono text-blue-400 font-bold bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
              {atm.id}
            </span>
          </div>
          <p className="text-xs text-slate-400">{atm.location}</p>
          
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/60 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px] block">Current Cash Level</span>
              <span className={`font-bold ${atm.cashLevel < 30 ? 'text-red-400' : 'text-amber-400'}`}>
                {atm.cashLevel}% (₹{atm.cashAmount.toLocaleString('en-IN')})
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Cash to be Loaded</span>
              <span className="font-bold text-emerald-400">
                +₹{totalReplenishAmount.toLocaleString('en-IN')} (to 100%)
              </span>
            </div>
          </div>
        </div>

        {/* Cassettes Replenishment Checklist */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>{language === 'ta' ? 'பணப் பெட்டிகள் சரிபார்ப்பு' : 'Vault Cassette Loading Spec'}</span>
          </span>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-slate-800/50 rounded-xl border border-slate-700/60 flex justify-between items-center">
              <div>
                <span className="font-bold text-white">₹2,000 Cassette</span>
                <span className="block text-[10px] text-slate-400">500 notes max (₹10 Lakhs)</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="p-2.5 bg-slate-800/50 rounded-xl border border-slate-700/60 flex justify-between items-center">
              <div>
                <span className="font-bold text-white">₹500 Cassette</span>
                <span className="block text-[10px] text-slate-400">3,000 notes max (₹15 Lakhs)</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="p-2.5 bg-slate-800/50 rounded-xl border border-slate-700/60 flex justify-between items-center">
              <div>
                <span className="font-bold text-white">₹200 Cassette</span>
                <span className="block text-[10px] text-slate-400">2,500 notes max (₹5 Lakhs)</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="p-2.5 bg-slate-800/50 rounded-xl border border-slate-700/60 flex justify-between items-center">
              <div>
                <span className="font-bold text-white">₹100 Cassette</span>
                <span className="block text-[10px] text-slate-400">3,000 notes max (₹5 Lakhs)</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Security Sign-off Details */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                {language === 'ta' ? 'பாதுகாப்பு அதிகாரி பெயர்:' : 'Refill Officer Name:'}
              </label>
              <input
                type="text"
                value={officerName}
                onChange={e => setOfficerName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-semibold text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                {language === 'ta' ? 'OTP பாதுகாப்பு குறியீடு:' : 'Vault OTP Security Code:'}
              </label>
              <div className="flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <input
                  type="text"
                  value={securityPin}
                  onChange={e => setSecurityPin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-emerald-400 font-bold text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={confirmedNotes}
              onChange={e => setConfirmedNotes(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-0 w-4 h-4 cursor-pointer"
            />
            <span className="text-[11px] text-slate-300">
              {language === 'ta'
                ? 'பணக் கட்டுகள் அனைத்தும் எண்ணப்பட்டு சென்சார்கள் மறுஅளவீடு செய்யப்பட்டன என்பதை உறுதி செய்கிறேன்.'
                : 'I confirm that notes are verified, physical seal intact, and optical sensors zeroed.'}
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
          >
            {language === 'ta' ? 'ரத்து செய்க' : 'Cancel'}
          </button>

          <button
            onClick={handleConfirmRefill}
            disabled={!confirmedNotes || successAnim}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 transition cursor-pointer disabled:opacity-50"
          >
            {successAnim ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Calibrating &amp; Restoring...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'ta' ? 'பணம் நிரப்புதலை உறுதி செய்க (100%)' : 'Confirm Refill & Restore 100%'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
