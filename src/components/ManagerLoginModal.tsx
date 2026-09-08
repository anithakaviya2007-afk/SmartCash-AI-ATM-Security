import React, { useState } from 'react';
import {
  UserCheck,
  Shield,
  KeyRound,
  X,
  CheckCircle2,
  Lock,
  Landmark,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { ManagerProfile } from '../types';
import { INITIAL_MANAGERS } from '../data/atmData';

interface ManagerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManagerLoginModal: React.FC<ManagerLoginModalProps> = ({ isOpen, onClose }) => {
  const { managerProfile, language, t } = useSecurity();
  const [selectedId, setSelectedId] = useState<string>(managerProfile.id);
  const [pin, setPin] = useState<string>('1234');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin !== '1234' && pin.length < 4) {
      setErrorMsg('Invalid PIN. Use default test PIN: 1234');
      return;
    }

    const matched = INITIAL_MANAGERS.find(m => m.id === selectedId);
    if (matched) {
      // In a real app we'd update managerProfile in context
      setErrorMsg(null);
      setSuccessMsg(
        language === 'ta'
          ? `வணக்கம், ${matched.name}! நீங்கள் வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்.`
          : `Welcome back, ${matched.name}! Manager session authenticated.`
      );
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 text-slate-100 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">
              {language === 'ta' ? 'மேலாளர் உள்நுழைவு' : 'Bank Manager Sign-In'}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              CashGuard AI • AUTHORIZED FLEET ACCESS
            </p>
          </div>
        </div>

        {/* Current Active Session */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 flex items-center space-x-3">
          <img
            src={managerProfile.avatar}
            alt={managerProfile.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
          />
          <div className="text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-white text-sm">{managerProfile.name}</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                ACTIVE
              </span>
            </div>
            <p className="text-slate-400">{managerProfile.designation}</p>
            <p className="text-[11px] text-blue-400 font-mono">{managerProfile.employeeId}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              {language === 'ta' ? 'மேலாளர் கணக்கு தேர்வு:' : 'Select Manager Profile:'}
            </label>
            <div className="space-y-2">
              {INITIAL_MANAGERS.map(mgr => (
                <div
                  key={mgr.id}
                  onClick={() => setSelectedId(mgr.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    selectedId === mgr.id
                      ? 'bg-blue-950/60 border-blue-500 ring-1 ring-blue-500/50'
                      : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={mgr.avatar}
                      alt={mgr.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-white">{mgr.name}</div>
                      <div className="text-[10px] text-slate-400">{mgr.designation}</div>
                    </div>
                  </div>
                  {selectedId === mgr.id && (
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
              {language === 'ta' ? 'பாதுகாப்பு PIN (Default: 1234):' : 'Security PIN (Default: 1234):'}
            </label>
            <div className="flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-slate-400" />
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="1234"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono tracking-widest text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-red-400 text-xs font-semibold bg-red-950/40 p-2.5 rounded-xl border border-red-800">
              {errorMsg}
            </p>
          )}

          {successMsg && (
            <p className="text-emerald-400 text-xs font-semibold bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800">
              {successMsg}
            </p>
          )}

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              {language === 'ta' ? 'ரத்து' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-900/40 transition cursor-pointer"
            >
              {language === 'ta' ? 'உள்நுழைக' : 'Authenticate Session'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
