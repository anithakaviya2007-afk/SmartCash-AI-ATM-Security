import React, { useState, useEffect, useRef } from 'react';
import {
  Landmark,
  Banknote,
  Receipt,
  Eye,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  CreditCard,
  User,
  Clock,
  Calendar,
  LogOut,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { Transaction } from '../types';

export const AtmView: React.FC = () => {
  const {
    activeUser,
    transactions,
    processAtmWithdrawal,
    liveDateTime,
    resetVerification,
    navigateTo,
    selectedAtm,
    atms,
    openRefillModal,
    updateAtmCashLevel,
    language,
    speakGuidance
  } = useSecurity();

  const currentAtm = selectedAtm || atms[0];
  const isAtmEmpty = currentAtm ? currentAtm.cashLevel === 0 : false;

  const prevAtmEmptyRef = useRef<boolean>(isAtmEmpty);
  useEffect(() => {
    if (isAtmEmpty && !prevAtmEmptyRef.current) {
      speakGuidance('CASH_NOT_AVAILABLE');
    }
    prevAtmEmptyRef.current = isAtmEmpty;
  }, [isAtmEmpty, speakGuidance]);

  const [atmSubView, setAtmSubView] = useState<'HOME' | 'WITHDRAW' | 'CONFIRM' | 'SUCCESS' | 'BALANCE' | 'STATEMENT'>('HOME');
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmountInput, setCustomAmountInput] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [latestTransaction, setLatestTransaction] = useState<Transaction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const userBalance = activeUser?.atmBalance || 25000;

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setErrorMessage('');
    setAtmSubView('CONFIRM');
  };

  const handleCustomSelect = () => {
    const amt = parseInt(customAmountInput, 10);
    if (isNaN(amt) || amt <= 0) {
      setErrorMessage('Please enter a valid positive numerical amount.');
      return;
    }
    if (amt % 100 !== 0) {
      setErrorMessage('ATM dispenses multiples of ₹100, ₹500 notes only.');
      return;
    }
    if (amt > userBalance) {
      setErrorMessage(`Insufficient balance. Current balance is ₹${(userBalance ?? 0).toLocaleString('en-IN')}`);
      return;
    }
    setSelectedAmount(amt);
    setErrorMessage('');
    setAtmSubView('CONFIRM');
  };

  const executeWithdrawal = () => {
    const result = processAtmWithdrawal(selectedAmount);
    if (result.success && result.transaction) {
      setLatestTransaction(result.transaction);
      setAtmSubView('SUCCESS');
    } else {
      setErrorMessage(result.message);
    }
  };

  // Filter transactions for this user
  const userTransactions = transactions.filter(t => t.userId === activeUser?.userId || t.userName === activeUser?.name);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col justify-between transition-colors">
      
      <div className="max-w-4xl mx-auto w-full">
        
        {/* ATM Top Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight font-mono">
                SmartSecure <span className="text-blue-400">ATM Terminal #01</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                MFA-Protected Core Banking Sandbox
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right text-xs text-slate-300 font-mono hidden sm:block">
              <div>{liveDateTime.date}</div>
              <div className="text-blue-400 font-bold">{liveDateTime.time}</div>
            </div>

            <button
              onClick={resetVerification}
              className="flex items-center space-x-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Exit ATM</span>
            </button>
          </div>
        </div>

        {/* ================= ATM HOME ================= */}
        {atmSubView === 'HOME' && (
          <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl border border-blue-500/30 p-6 sm:p-8 shadow-2xl">
            
            {isAtmEmpty ? (
              <div className="space-y-5 py-2">
                <div className="p-6 rounded-3xl border-2 border-red-500 bg-red-950/70 text-center space-y-4 shadow-2xl shadow-red-950/60">
                  <div className="inline-flex p-4 rounded-2xl bg-red-600/30 text-red-400 border border-red-500/50 animate-bounce">
                    <AlertTriangle className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black tracking-wider uppercase font-mono">
                      VAULT SENSOR: 0% CASH AVAILABLE
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mt-3">
                      ⚠️ {language === 'ta' ? 'பணம் இருப்பு இல்லை' : 'CASH NOT AVAILABLE'}
                    </h3>
                    <p className="text-sm text-red-200 mt-2 max-w-lg mx-auto leading-relaxed">
                      {language === 'ta'
                        ? 'மன்னிக்கவும்! இந்த ATM முனையத்தில் பணம் தீர்ந்துவிட்டது. எங்கள் CashGuard IoT சென்சார்கள் மூலமாக வங்கி மேலாளருக்கு எச்சரிக்கை அனுப்பப்பட்டு, பணம் நிரப்பும் வண்டி அனுப்பப்பட்டுள்ளது.'
                        : 'We apologize! Cash withdrawal is currently unavailable at this terminal as vault reserves are fully depleted (0%). An automated low cash sensor alarm was triggered to the Bank Manager.'}
                    </p>
                  </div>

                  {/* Nearest ATM suggestion */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-left max-w-md mx-auto space-y-1.5 text-xs">
                    <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                      {language === 'ta' ? 'அருகிலுள்ள செயல்பாட்டில் உள்ள ATM:' : 'Nearest Operational ATM with Cash:'}
                    </div>
                    <div className="font-bold text-white text-sm flex items-center justify-between">
                      <span>Anna Nagar West Hub (ATM-102)</span>
                      <span className="text-emerald-400 font-mono">86% Cash</span>
                    </div>
                    <p className="text-slate-400">1.2 km away • ₹14,75,000 Available</p>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => navigateTo('ATM_MAP')}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/40 transition cursor-pointer"
                    >
                      🗺️ {language === 'ta' ? 'மேப்பில் தேட' : 'Locate on Fleet Map'}
                    </button>

                    <button
                      onClick={() => openRefillModal(currentAtm?.id)}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 transition cursor-pointer"
                    >
                      🚚 {language === 'ta' ? 'பணம் நிரப்ப (Refill 100%)' : 'Simulate Refill (100%)'}
                    </button>

                    <button
                      onClick={resetVerification}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                    >
                      💳 {language === 'ta' ? 'கார்டை திரும்பப் பெற' : 'Eject Card & Exit'}
                    </button>
                  </div>
                </div>

                {/* Sensor Simulation Quick Test */}
                <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center text-xs">
                  <span className="text-slate-400 text-[11px] block mb-2">
                    Demo Simulation: Test different cash sensor readings for {currentAtm?.name}:
                  </span>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => updateAtmCashLevel(currentAtm.id, 85)}
                      className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-bold hover:bg-emerald-900 transition"
                    >
                      🟢 Set to 85% (Normal)
                    </button>
                    <button
                      onClick={() => updateAtmCashLevel(currentAtm.id, 45)}
                      className="px-3 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-700 text-xs font-bold hover:bg-amber-900 transition"
                    >
                      🟡 Set to 45% (Warning)
                    </button>
                    <button
                      onClick={() => updateAtmCashLevel(currentAtm.id, 20)}
                      className="px-3 py-1 rounded-lg bg-red-950 text-red-300 border border-red-700 text-xs font-bold hover:bg-red-900 transition"
                    >
                      🔴 Set to 20% (Critical)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
            {/* Greeting */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="inline-flex items-center space-x-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-0.5 text-xs font-semibold text-emerald-400 mb-2">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>3-FACTOR MFA SESSION AUTHENTICATED</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome, {activeUser?.name || 'Anitha'}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Card: {activeUser?.maskedCardNumber || '**** **** **** 1234'} • Account: ACTIVE
                </p>
              </div>

              {/* Balance Widget */}
              <div className="rounded-2xl border border-blue-400/30 bg-blue-950/60 p-4 text-right sm:min-w-56">
                <span className="text-[11px] text-blue-300 uppercase tracking-wider font-semibold block">
                  Available Balance (Demo)
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono block mt-0.5">
                  ₹{(userBalance ?? 0).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Live Updated • INR
                </span>
              </div>
            </div>

            {/* ATM Main Options Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <button
                onClick={() => {
                  setErrorMessage('');
                  setAtmSubView('WITHDRAW');
                }}
                className="group flex flex-col items-start justify-between p-6 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-900/50 to-indigo-950/60 hover:border-blue-400 hover:from-blue-900/70 hover:to-indigo-900/80 transition-all text-left shadow-lg"
              >
                <div className="h-12 w-12 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Banknote className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Withdraw Cash</h4>
                  <p className="text-xs text-slate-300 mt-1">Instant dispense with preset denominations</p>
                </div>
              </button>

              <button
                onClick={() => setAtmSubView('BALANCE')}
                className="group flex flex-col items-start justify-between p-6 rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-950/50 to-slate-900/60 hover:border-teal-400 hover:from-teal-900/70 hover:to-slate-900/80 transition-all text-left shadow-lg"
              >
                <div className="h-12 w-12 rounded-xl bg-teal-600/30 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Check Balance</h4>
                  <p className="text-xs text-slate-300 mt-1">View live account status and ledger balance</p>
                </div>
              </button>

              <button
                onClick={() => setAtmSubView('STATEMENT')}
                className="group flex flex-col items-start justify-between p-6 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/50 to-slate-900/60 hover:border-purple-400 hover:from-purple-900/70 hover:to-slate-900/80 transition-all text-left shadow-lg"
              >
                <div className="h-12 w-12 rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Receipt className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Mini Statement</h4>
                  <p className="text-xs text-slate-300 mt-1">Recent 5 transactions audit trail</p>
                </div>
              </button>

            </div>
              </>
            )}

          </div>
        )}

        {/* ================= ATM WITHDRAW ================= */}
        {atmSubView === 'WITHDRAW' && (
          <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl border border-blue-500/30 p-6 sm:p-8 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <button
                onClick={() => setAtmSubView('HOME')}
                className="flex items-center space-x-1.5 text-xs text-blue-300 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to ATM Menu</span>
              </button>
              <span className="text-xs text-slate-400 font-mono">Select Fast Cash Amount</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Select Withdrawal Amount</h3>
            <p className="text-xs text-slate-400 mb-6">
              Available Demo Balance: <strong className="text-white font-mono">₹{(userBalance ?? 0).toLocaleString('en-IN')}</strong>
            </p>

            {/* Amount Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[500, 1000, 2000, 5000].map(amt => (
                <button
                  key={amt}
                  onClick={() => handleSelectPreset(amt)}
                  className="flex flex-col items-center justify-center p-5 rounded-2xl border border-blue-500/40 bg-blue-950/50 hover:bg-blue-600 hover:text-white transition group shadow-md"
                >
                  <span className="text-xl sm:text-2xl font-extrabold font-mono text-white">
                    ₹{(amt ?? 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-blue-300 group-hover:text-blue-100 mt-1 font-mono">
                    FAST CASH
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Amount Form */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Or Enter Custom Amount (Multiples of ₹100):
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={customAmountInput}
                    onChange={e => setCustomAmountInput(e.target.value)}
                    placeholder="e.g. 3500"
                    className="w-full rounded-xl border border-white/20 bg-slate-950 px-9 py-3 text-lg font-mono font-bold text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleCustomSelect}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-500 transition shadow-md"
                >
                  Continue
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-950/60 p-3 text-xs text-rose-300 flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

          </div>
        )}

        {/* ================= ATM CONFIRM ================= */}
        {atmSubView === 'CONFIRM' && (
          <div className="max-w-xl mx-auto bg-slate-900/90 backdrop-blur-md rounded-3xl border border-blue-500/30 p-6 sm:p-8 shadow-2xl text-center">
            
            <div className="h-14 w-14 rounded-2xl bg-blue-600/30 text-blue-400 mx-auto flex items-center justify-center mb-4">
              <Receipt className="h-7 w-7" />
            </div>

            <h3 className="text-2xl font-extrabold text-white">Confirm Cash Withdrawal</h3>
            <p className="text-xs text-slate-400 mt-1">Please review the transaction parameters before dispensing.</p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-xs space-y-3 font-mono">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Withdrawal Amount:</span>
                <span className="text-lg font-bold text-emerald-400">₹{(selectedAmount ?? 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Current Demo Balance:</span>
                <span className="text-slate-200">₹{(userBalance ?? 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Remaining Balance:</span>
                <span className="text-slate-200 font-bold">₹{((userBalance ?? 0) - (selectedAmount ?? 0)).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Transaction Fee:</span>
                <span className="text-emerald-400">₹0.00 (Campus Free)</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-300">{liveDateTime.date} • {liveDateTime.time}</span>
              </div>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                onClick={executeWithdrawal}
                className="w-full flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition"
              >
                Confirm Withdrawal
              </button>
              <button
                onClick={() => setAtmSubView('WITHDRAW')}
                className="w-full sm:w-auto rounded-xl border border-white/20 bg-white/5 py-3.5 px-6 text-xs font-semibold text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>
            </div>

          </div>
        )}

        {/* ================= ATM SUCCESS ================= */}
        {atmSubView === 'SUCCESS' && (
          <div className="max-w-xl mx-auto bg-slate-900/90 backdrop-blur-md rounded-3xl border border-emerald-500/30 p-6 sm:p-8 shadow-2xl text-center animate-in zoom-in-95">
            
            <div className="h-16 w-16 rounded-3xl bg-emerald-600 text-white mx-auto flex items-center justify-center mb-4 shadow-xl shadow-emerald-500/30 animate-bounce">
              <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
            </div>

            <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase font-mono">
              CASH DISPENSED
            </p>

            <h3 className="text-3xl font-extrabold text-white mt-1">Transaction Successful</h3>
            <p className="text-xs text-slate-400 mt-1">Please collect your demo cash notes and receipt.</p>

            {/* Dispense Simulation Animation Box */}
            <div className="mt-5 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 p-4 text-emerald-300 font-mono text-xs flex items-center justify-center space-x-2 shadow-inner">
              <Banknote className="h-5 w-5 animate-pulse" />
              <span>CASH TRAY OPEN • ₹{(selectedAmount ?? 0).toLocaleString('en-IN')} DISPENSED</span>
            </div>

            {/* Receipt Summary */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-xs space-y-2.5 font-mono">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-bold text-white">{latestTransaction?.transactionId || 'TXN-778902'}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Amount Dispensed:</span>
                <span className="text-sm font-bold text-emerald-400">₹{(selectedAmount ?? 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Updated Balance:</span>
                <span className="font-bold text-white">₹{(userBalance ?? 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-bold">SUCCESS</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-300">{latestTransaction?.formattedDate || liveDateTime.date} • {latestTransaction?.formattedTime || liveDateTime.time}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setAtmSubView('HOME')}
                className="w-full flex-1 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-500 transition"
              >
                Perform Another Transaction
              </button>
              <button
                onClick={() => setAtmSubView('STATEMENT')}
                className="w-full sm:w-auto rounded-xl border border-white/20 bg-white/5 py-3 px-5 text-xs font-semibold text-slate-300 hover:bg-white/10"
              >
                View Statement
              </button>
            </div>

          </div>
        )}

        {/* ================= CHECK BALANCE ================= */}
        {atmSubView === 'BALANCE' && (
          <div className="max-w-xl mx-auto bg-slate-900/90 backdrop-blur-md rounded-3xl border border-teal-500/30 p-6 sm:p-8 shadow-2xl text-center">
            
            <button
              onClick={() => setAtmSubView('HOME')}
              className="flex items-center space-x-1.5 text-xs text-teal-300 hover:text-white mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Menu</span>
            </button>

            <div className="h-16 w-16 rounded-3xl bg-teal-600/30 text-teal-400 mx-auto flex items-center justify-center mb-4">
              <Eye className="h-8 w-8" />
            </div>

            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest font-mono">
              ACCOUNT BALANCE INQUIRY
            </span>

            <div className="my-6 rounded-3xl border border-teal-400/30 bg-teal-950/60 p-6">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                Total Available Balance (Demo)
              </span>
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono mt-2 block tracking-tight">
                ₹{(userBalance ?? 0).toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-emerald-400 font-mono mt-1 block">
                ✓ Available for immediate withdrawal
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Account Holder:</span>
                <span className="font-bold text-white">{activeUser?.name}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Account Status:</span>
                <span className="text-emerald-400 font-bold">{activeUser?.accountStatus}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Live Timestamp:</span>
                <span className="text-slate-300">{liveDateTime.date} • {liveDateTime.time}</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setAtmSubView('WITHDRAW')}
                className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 py-3 text-sm font-bold text-white shadow-md hover:from-teal-500 hover:to-emerald-500 transition"
              >
                Proceed to Cash Withdrawal
              </button>
            </div>

          </div>
        )}

        {/* ================= MINI STATEMENT ================= */}
        {atmSubView === 'STATEMENT' && (
          <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl border border-purple-500/30 p-6 sm:p-8 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <button
                onClick={() => setAtmSubView('HOME')}
                className="flex items-center space-x-1.5 text-xs text-purple-300 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Menu</span>
              </button>
              <span className="text-xs text-slate-400 font-mono">Recent Transactions Ledger</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Mini Statement</h3>
              <span className="text-xs text-purple-300 font-mono">Balance: ₹{(userBalance ?? 0).toLocaleString('en-IN')}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                    <th className="pb-3">Transaction ID</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Date & Time</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {userTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-500">
                        No transactions recorded for this demo session yet.
                      </td>
                    </tr>
                  ) : (
                    userTransactions.map(txn => (
                      <tr key={txn.transactionId} className="hover:bg-white/5 transition">
                        <td className="py-3 font-bold text-slate-300">{txn.transactionId}</td>
                        <td className="py-3 text-slate-200">{txn.type}</td>
                        <td className="py-3 font-bold text-emerald-400">
                          {txn.amount > 0 ? `- ₹${(txn.amount ?? 0).toLocaleString('en-IN')}` : '₹0'}
                        </td>
                        <td className="py-3 text-slate-400">{txn.formattedDate} • {txn.formattedTime}</td>
                        <td className="py-3 text-right">
                          <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setAtmSubView('WITHDRAW')}
                className="rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-purple-500 transition"
              >
                New Withdrawal
              </button>
            </div>

          </div>
        )}

      </div>

      <div className="mt-6 text-center text-xs text-slate-500 font-mono">
        <span>COLLEGE PROTOTYPE ATM SANDBOX • Simulated Cash Dispenser • Zero Real Money Transaction</span>
      </div>

    </div>
  );
};
