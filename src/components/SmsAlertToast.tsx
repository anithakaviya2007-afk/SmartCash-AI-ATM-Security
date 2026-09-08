import React, { useState } from 'react';
import { Smartphone, CheckCircle2, ShieldAlert, X, MapPin, CreditCard, Bell, Send } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export const SmsAlertToast: React.FC = () => {
  const { session, language, selectedAtm, atms } = useSecurity();
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  const sms = session.cardInsertSmsAlert;
  if (!sms || dismissedId === sms.id) return null;

  const currentAtm = selectedAtm || atms[0];
  const isCritical = sms.id.includes('FAIL') || sms.messageTextEn.includes('CRITICAL') || sms.messageTextEn.includes('UNAUTHORIZED');

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full animate-bounce-in">
      <div className={`rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 p-4 shadow-2xl text-white backdrop-blur-xl relative overflow-hidden ${
        isCritical
          ? 'border-rose-500 shadow-rose-500/30'
          : 'border-emerald-500/80 shadow-emerald-500/20'
      }`}>
        
        {/* Top glowing ambient pulse */}
        <div className={`absolute top-0 right-0 left-0 h-1 animate-pulse ${
          isCritical
            ? 'bg-gradient-to-r from-rose-500 via-red-500 to-amber-500'
            : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500'
        }`} />

        {/* Close Button */}
        <button
          onClick={() => setDismissedId(sms.id)}
          className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="Dismiss Alert"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2.5 mb-3">
          <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 shadow-md ${
            isCritical
              ? 'bg-rose-500/20 border-rose-400 text-rose-400'
              : 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
          }`}>
            {isCritical ? (
              <ShieldAlert className="h-5 w-5 animate-bounce text-rose-400" />
            ) : (
              <Smartphone className="h-5 w-5 animate-pulse text-emerald-400" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className={`inline-block h-2 w-2 rounded-full animate-ping ${isCritical ? 'bg-rose-400' : 'bg-emerald-400'}`} />
              <span className={`text-[10px] uppercase font-bold font-mono tracking-wider ${isCritical ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isCritical
                  ? (language === 'ta' ? '🚨 மொபைல் பாதுகாப்பு எச்சரிக்கை SMS' : '🚨 MOBILE SECURITY SMS ALERT')
                  : (language === 'ta' ? 'இணைக்கப்பட்ட மொபைல் SMS எச்சரிக்கை' : 'LINKED MOBILE SMS ALERT DISPATCHED')}
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-white tracking-tight">
              {isCritical
                ? (language === 'ta' ? 'அவசர SMS எச்சரிக்கை அனுப்பப்பட்டது 🚨' : 'Critical Security SMS Sent 🚨')
                : (language === 'ta' ? 'மொபைலுக்கு SMS எச்சரிக்கை அனுப்பப்பட்டது ✓' : 'SMS Alert Sent to Phone ✓')}
            </h4>
          </div>
        </div>

        {/* SMS Preview Mobile Frame */}
        <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-3 text-xs space-y-2">
          
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-[11px]">
            <div className="flex items-center space-x-1 text-slate-300 font-mono">
              <Send className="h-3 w-3 text-cyan-400" />
              <span>To: <strong className="text-cyan-300">{sms.phoneNumber}</strong></span>
            </div>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
              isCritical
                ? 'bg-rose-950 border-rose-500/50 text-rose-300'
                : 'bg-emerald-950 border-emerald-500/40 text-emerald-300'
            }`}>
              DELIVERED ✓
            </span>
          </div>

          <div className={`space-y-1 font-sans text-[11px] leading-relaxed p-2.5 rounded-lg border ${
            isCritical
              ? 'bg-rose-950/60 border-rose-500/40 text-rose-100'
              : 'bg-slate-900/60 border-slate-800 text-slate-200'
          }`}>
            <div className={`flex items-center space-x-1 font-bold text-[10px] uppercase tracking-wider mb-0.5 ${
              isCritical ? 'text-rose-400' : 'text-amber-400'
            }`}>
              <Bell className="h-3 w-3" />
              <span>{language === 'ta' ? 'வங்கி ஏடிஎம் பாதுகாப்பு எச்சரிக்கை' : 'SECUREGATE BANK SECURITY ALERT'}</span>
            </div>
            <p className="font-medium">
              {language === 'ta' ? sms.messageTextTa : sms.messageTextEn}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] text-slate-400 font-mono">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3 text-rose-400 shrink-0" />
              <span className="truncate">{currentAtm.name}</span>
            </div>
            <div className="flex items-center space-x-1 justify-end">
              <CreditCard className="h-3 w-3 text-indigo-400 shrink-0" />
              <span>{sms.cardNumberMasked}</span>
            </div>
          </div>
        </div>

        {/* Footer status bar */}
        <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span className={`font-semibold flex items-center space-x-1 ${isCritical ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isCritical ? <ShieldAlert className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
            <span>{language === 'ta' ? 'உரிமையாளரின் மொபைலுக்கு அனுப்பப்பட்டது' : 'Notified Linked Mobile & Smartwatch'}</span>
          </span>
          <span className="font-mono text-slate-500">{sms.timestamp}</span>
        </div>

      </div>
    </div>
  );
};
