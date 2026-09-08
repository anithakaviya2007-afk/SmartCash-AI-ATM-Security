import React, { useState } from 'react';
import {
  Landmark,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  BellRing,
  RotateCcw,
  Zap,
  ArrowRight,
  Sliders,
  TrendingDown,
  Layers,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { ATM, ATMStatus } from '../types';

export const AtmListView: React.FC = () => {
  const {
    atms,
    setSelectedAtm,
    simulateDropBelow30,
    refillAtm,
    navigateTo,
    language,
    t
  } = useSecurity();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CRITICAL' | 'LOW_CASH' | 'NORMAL'>('ALL');

  const filteredAtms = atms.filter((atm) => {
    const matchesSearch =
      atm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atm.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atm.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'CRITICAL') return matchesSearch && atm.cashLevel < 30;
    if (statusFilter === 'LOW_CASH') return matchesSearch && atm.cashLevel >= 30 && atm.cashLevel < 50;
    if (statusFilter === 'NORMAL') return matchesSearch && atm.cashLevel >= 50;
    return matchesSearch;
  });

  const criticalCount = atms.filter(a => a.cashLevel < 30).length;
  const warningCount = atms.filter(a => a.cashLevel >= 30 && a.cashLevel < 50).length;
  const normalCount = atms.filter(a => a.cashLevel >= 50).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-blue-400 font-mono mb-1">
            <Landmark className="w-3.5 h-3.5" />
            <span>CashGuard AI • FLEET INVENTORY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <span>{language === 'ta' ? 'வங்கி ATM பட்டியல்' : 'Bank ATM Fleet Directory'}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
              {atms.length} {language === 'ta' ? 'மெஷின்கள்' : 'Terminals'}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {language === 'ta'
              ? '“பணம் தீரும் முன்பே தெரியும்.” • 30%-க்கு கீழ் உள்ள ATM-கள் சிவப்பு நிறத்தில் ஒளிர்கின்றன.'
              : '“Knows before cash runs out.” • Monitor and manage live cash levels across all branch terminals.'}
          </p>
        </div>

        {/* Action button to Simulator */}
        <button
          onClick={() => navigateTo('SENSOR_SIMULATOR')}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-900/40 transition-colors cursor-pointer"
        >
          <Sliders className="w-4 h-4" />
          <span>{language === 'ta' ? 'சென்சார் டெஸ்ட் களம்' : 'Open Sensor Test Bench'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="max-w-7xl mx-auto bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 backdrop-blur-md flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'ta' ? 'ATM பெயர், பகுதி அல்லது ஐடி தேட...' : 'Search ATM name, location, ID...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {language === 'ta' ? 'அனைத்தும்' : 'All'} ({atms.length})
          </button>

          <button
            onClick={() => setStatusFilter('CRITICAL')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === 'CRITICAL'
                ? 'bg-red-600 text-white'
                : 'bg-slate-900 text-red-400 hover:bg-slate-700'
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'அவசரம் (<30%)' : 'Critical (<30%)'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-red-950 text-[10px] font-mono">{criticalCount}</span>
          </button>

          <button
            onClick={() => setStatusFilter('LOW_CASH')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === 'LOW_CASH'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-900 text-amber-400 hover:bg-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'எச்சரிக்கை (30-49%)' : 'Low Cash'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-950 text-[10px] font-mono">{warningCount}</span>
          </button>

          <button
            onClick={() => setStatusFilter('NORMAL')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === 'NORMAL'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-emerald-400 hover:bg-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'சாதாரண நிலை' : 'Normal'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-[10px] font-mono">{normalCount}</span>
          </button>
        </div>
      </div>

      {/* Grid of ATM Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAtms.map((atm) => {
          const isCritical = atm.cashLevel < 30;
          const isWarning = atm.cashLevel >= 30 && atm.cashLevel < 50;

          return (
            <div
              key={atm.id}
              className={`rounded-2xl border p-5 backdrop-blur-md shadow-lg transition-all duration-300 flex flex-col justify-between ${
                isCritical
                  ? 'bg-red-950/30 border-red-500/80 ring-1 ring-red-500/40 shadow-red-950/40'
                  : isWarning
                  ? 'bg-amber-950/20 border-amber-500/50'
                  : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-700/60">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400">{atm.id} • {atm.branchCode}</span>
                    <h3 className="text-base font-bold text-white leading-snug">{atm.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{atm.location}</span>
                    </p>
                  </div>

                  {/* Cash Level Pill */}
                  <div className="text-right">
                    <div className={`text-2xl font-black font-mono ${
                      isCritical ? 'text-red-500 animate-pulse' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {atm.cashLevel}%
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                      isCritical 
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                        : isWarning 
                        ? 'bg-amber-500/20 text-amber-300' 
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {isCritical ? 'ALARM <30%' : isWarning ? 'LOW CASH' : 'NORMAL'}
                    </span>
                  </div>
                </div>

                {/* Cash Gauge Bar */}
                <div className="py-4 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="font-bold text-white font-mono">₹{(atm.cashAmount ?? 0).toLocaleString('en-IN')}</span>
                    <span className="text-slate-400 text-[11px]">/ ₹{(atm.cashCapacity ?? 0).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/80 relative">
                    {/* 30% Threshold Line */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10 shadow-[0_0_4px_rgba(248,113,113,1)]"
                      style={{ left: '30%' }}
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${atm.cashLevel}%` }}
                    />
                  </div>
                </div>

                {/* Cassettes Note Breakdown (Mini) */}
                <div className="grid grid-cols-4 gap-1.5 py-2 text-center text-[10px] font-mono bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block">₹2000</span>
                    <span className="font-bold text-white">{atm.cassettes.d2000.notesCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">₹500</span>
                    <span className="font-bold text-white">{atm.cassettes.d500.notesCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">₹200</span>
                    <span className="font-bold text-white">{atm.cassettes.d200.notesCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">₹100</span>
                    <span className="font-bold text-white">{atm.cassettes.d100.notesCount}</span>
                  </div>
                </div>

                {/* AI Depletion Forecast Callout */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-300 bg-slate-900/40 p-2 rounded-lg">
                  <span className="flex items-center space-x-1 text-blue-400">
                    <Sparkles className="w-3 h-3" />
                    <span>{language === 'ta' ? 'தீரும் நேரம்:' : 'Depletes in:'}</span>
                  </span>
                  <span className="font-bold text-amber-400 font-mono">
                    {atm.predictedDepletionHours} {t('hours')} ({atm.predictedDepletionTime})
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedAtm(atm);
                    navigateTo('ATM_DETAILS');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  {language === 'ta' ? 'சென்சார்கள்' : 'Details'}
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => simulateDropBelow30(atm.id, 22)}
                    className="px-2.5 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600 border border-red-500/40 text-red-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                    title="Simulate cash dropping to 22% (< 30%)"
                  >
                    {language === 'ta' ? '< 30% டெஸ்ட்' : 'Test <30%'}
                  </button>

                  <button
                    onClick={() => refillAtm(atm.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                    title="Refill to 100%"
                  >
                    {language === 'ta' ? 'ரீஃபில்' : 'Refill'}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
