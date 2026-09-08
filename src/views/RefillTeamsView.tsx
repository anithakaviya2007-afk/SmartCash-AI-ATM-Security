import React, { useState } from 'react';
import {
  Truck,
  Shield,
  Phone,
  Clock,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  MapPin,
  Send,
  ArrowRight,
  Sliders
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export const RefillTeamsView: React.FC = () => {
  const {
    refillTeams,
    atms,
    dispatchRefillTeam,
    refillAtm,
    navigateTo,
    language,
    t
  } = useSecurity();

  const [selectedAtmId, setSelectedAtmId] = useState<string>(
    atms.find(a => a.cashLevel < 30)?.id || atms[0].id
  );

  const handleDispatch = (teamId: string) => {
    dispatchRefillTeam(teamId, selectedAtmId);
  };

  const criticalAtms = atms.filter(a => a.cashLevel < 30);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-blue-400 font-mono mb-1">
            <Truck className="w-3.5 h-3.5" />
            <span>CashGuard AI • CASH IN TRANSIT (CIT) LOGISTICS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <span>{t('refillTeamsTitle')}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {language === 'ta'
              ? '“பணம் தீரும் முன்பே தெரியும்.” • பணப் பாதுகாப்பு வாகனங்களை கண்காணித்து அவசர ரீஃபில் உத்தரவுகளை அனுப்புங்கள்.'
              : '“Knows before cash runs out.” • Monitor armored transit vehicles, route ETAs, and vault unlocking OTPs.'}
          </p>
        </div>

        {/* Action Controls */}
        <button
          onClick={() => navigateTo('SENSOR_SIMULATOR')}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-blue-900/40"
        >
          <Sliders className="w-4 h-4" />
          <span>{language === 'ta' ? 'சென்சார் டெஸ்ட் களம்' : 'Open Sensor Test Bench'}</span>
        </button>
      </div>

      {/* Critical ATM Dispatch Quick Selector */}
      {criticalAtms.length > 0 && (
        <div className="max-w-7xl mx-auto bg-red-950/40 border border-red-500/60 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-red-600 text-white rounded-xl animate-bounce">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {language === 'ta' ? 'அவசர ரீஃபில் தேவைப்படும் ATM-கள்:' : 'Critical ATMs Requiring Immediate Replenishment:'}
              </h3>
              <p className="text-xs text-red-300 mt-0.5">
                {criticalAtms.map(a => `${a.name} (${a.cashLevel}%)`).join(', ')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <select
              value={selectedAtmId}
              onChange={(e) => setSelectedAtmId(e.target.value)}
              aria-label={language === 'ta' ? 'ரீஃபில் செய்ய வேண்டிய ATM' : 'ATM to Refill'}
              className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {atms.map((atm) => (
                <option key={atm.id} value={atm.id}>
                  {atm.name} ({atm.cashLevel}% remaining)
                </option>
              ))}
            </select>

            <button
              onClick={() => handleDispatch('TEAM-01')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shrink-0 transition-colors shadow-md shadow-red-950/50 cursor-pointer"
            >
              {language === 'ta' ? 'உடனடி வாகனம் அனுப்பு' : 'Fast Dispatch'}
            </button>
          </div>
        </div>
      )}

      {/* Teams Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {refillTeams.map((team) => {
          const isEnRoute = team.currentStatus === 'EN_ROUTE';
          const isRefilling = team.currentStatus === 'REFILLING';
          const assignedAtm = atms.find(a => a.id === team.assignedAtmId);

          return (
            <div
              key={team.id}
              className={`rounded-2xl border p-5 backdrop-blur-md shadow-lg transition-all flex flex-col justify-between ${
                isEnRoute 
                  ? 'bg-blue-950/40 border-blue-500/70 shadow-blue-950/40' 
                  : isRefilling 
                  ? 'bg-emerald-950/40 border-emerald-500/70' 
                  : 'bg-slate-800/80 border-slate-700/80'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl ${
                      isEnRoute ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-700 text-slate-300'
                    }`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{team.name}</h3>
                      <span className="text-xs font-mono text-slate-400">{team.vehicleNumber}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isEnRoute 
                      ? 'bg-blue-500 text-white animate-pulse' 
                      : isRefilling 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {team.currentStatus}
                  </span>
                </div>

                {/* Team Details */}
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'ta' ? 'தலைமை அதிகாரி:' : 'Lead Officer:'}</span>
                    <span className="font-semibold text-white">{team.leadOfficer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'ta' ? 'தொடர்பு எண்:' : 'Phone Contact:'}</span>
                    <span className="font-mono text-blue-400">{team.contactPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'ta' ? 'தற்போதைய இடம்:' : 'Live Location:'}</span>
                    <span className="font-medium text-slate-200">
                      {typeof team.currentLocation === 'object' ? team.currentLocation?.address : team.currentLocation}
                    </span>
                  </div>
                  {team.assignedCashAmount && (
                    <div className="flex justify-between pt-1 border-t border-slate-800">
                      <span className="text-slate-400">{language === 'ta' ? 'ஏற்றப்பட்ட பணம்:' : 'Cash Loaded:'}</span>
                      <span className="font-mono font-bold text-emerald-400">
                        ₹{(team.assignedCashAmount ?? 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>

                {/* En-Route Status Box with OTP & ETA */}
                {isEnRoute && (
                  <div className="bg-blue-900/30 border border-blue-500/40 p-3 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-300 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? 'வந்து சேரும் நேரம் (ETA):' : 'Estimated Arrival:'}</span>
                      </span>
                      <span className="font-mono font-bold text-white text-sm">
                        {team.etaMinutes} {language === 'ta' ? 'நிமிடங்கள்' : 'mins'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-blue-500/20">
                      <span className="text-slate-300 flex items-center space-x-1">
                        <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                        <span>{language === 'ta' ? 'வால்ட் திறக்கும் ரகசிய OTP:' : 'Vault Secure OTP:'}</span>
                      </span>
                      <span className="font-mono font-extrabold text-amber-400 text-sm tracking-widest">
                        {team.otpCode || '582941'}
                      </span>
                    </div>

                    {assignedAtm && (
                      <div className="text-[11px] text-slate-300 mt-1">
                        Destination: <strong>{assignedAtm.name}</strong> ({assignedAtm.cashLevel}% cash)
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
                {isEnRoute ? (
                  <button
                    onClick={() => {
                      if (team.assignedAtmId) refillAtm(team.assignedAtmId);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'ta' ? 'ரீஃபில் முடிந்ததாக பதிவு செய்' : 'Confirm Refill Complete'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleDispatch(team.id)}
                    className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-md shadow-blue-950/60"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'இந்த வாகனத்தை அனுப்புக' : 'Dispatch to Selected ATM'}</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
