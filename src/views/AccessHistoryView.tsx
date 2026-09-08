import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { LogResult, AccessType } from '../types';

export const AccessHistoryView: React.FC = () => {
  const { accessLogs, liveDateTime, language } = useSecurity();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedResult, setSelectedResult] = useState<string>('ALL');

  // Filter logs based on inputs
  const filteredLogs = accessLogs.filter(log => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.logId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === 'ALL' || log.accessType === selectedType;

    const matchesResult =
      selectedResult === 'ALL' || log.result === selectedResult;

    return matchesSearch && matchesType && matchesResult;
  });

  const getResultBadge = (result: LogResult) => {
    switch (result) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            <span>SUCCESS</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-600"></span>
            <span>FAILED</span>
          </span>
        );
      case 'DENIED':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-800">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
            <span>DENIED</span>
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-ping"></span>
            <span>PROCESSING</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
            <span>WARNING</span>
          </span>
        );
    }
  };

  const getFactorIcon = (status: string) => {
    if (status === 'SUCCESS') {
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" title="Factor Verified" />;
    }
    if (status === 'FAILED') {
      return <XCircle className="h-4 w-4 text-rose-600" title="Factor Failed" />;
    }
    return <span className="text-[10px] text-slate-400 font-mono">N/A</span>;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-100 via-gray-50 to-zinc-100 text-slate-800 p-4 sm:p-6 lg:p-8 flex flex-col justify-between transition-colors">
      
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full bg-slate-200/80 px-3 py-1 text-xs font-semibold text-slate-700 mb-2">
              <History className="h-3.5 w-3.5" />
              <span>{language === 'ta' ? 'பாதுகாப்பு தணிக்கை பதிவு' : 'SECURITY AUDIT TRAIL'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {language === 'ta' ? 'அணுகல் & சரிபார்ப்பு வரலாறு' : 'Access & Verification History'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'ta' ? 'கார்டு, முக அங்கீகாரம் மற்றும் OTP சரிபார்ப்பு நிகழ்வுகளின் தணிக்கை பதிவு' : 'Comprehensive log of all Card, Biometric Face and OTP authentication events'}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            <span>{language === 'ta' ? 'நேரடி தணிக்கை:' : 'Live Audit:'} {liveDateTime.date}</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by user, location, or Log ID..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Access Type Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none font-medium"
            >
              <option value="ALL">All Access Types</option>
              <option value="LAB_ACCESS">Secure Lab Access</option>
              <option value="ATM_SERVICE">ATM Banking Service</option>
              <option value="AUTHENTICATION_FLOW">MFA Gate Flow</option>
            </select>
          </div>

          {/* Result Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedResult}
              onChange={e => setSelectedResult(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none font-medium"
            >
              <option value="ALL">All Status Results</option>
              <option value="SUCCESS">SUCCESS (Green)</option>
              <option value="FAILED">FAILED (Red)</option>
              <option value="DENIED">DENIED (Red)</option>
              <option value="PROCESSING">PROCESSING (Blue)</option>
              <option value="WARNING">WARNING (Orange)</option>
            </select>
          </div>

          {/* Clear Filter Button */}
          <div className="sm:col-span-1 flex justify-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('ALL');
                setSelectedResult('ALL');
              }}
              title="Reset Filters"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>

        {/* Audit Log Table */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">{language === 'ta' ? 'தேதி & நேரம்' : 'Date & Time'}</th>
                  <th className="py-3.5 px-4">{language === 'ta' ? 'பயனர்' : 'User'}</th>
                  <th className="py-3.5 px-4">{language === 'ta' ? 'அணுகல் வகை' : 'Access Type'}</th>
                  <th className="py-3.5 px-3 text-center">{language === 'ta' ? 'கார்டு' : 'Card'}</th>
                  <th className="py-3.5 px-3 text-center">{language === 'ta' ? 'முகம்' : 'Face'}</th>
                  <th className="py-3.5 px-3 text-center">OTP</th>
                  <th className="py-3.5 px-4">{language === 'ta' ? 'இடம்' : 'Location'}</th>
                  <th className="py-3.5 px-4 text-right">{language === 'ta' ? 'இறுதி முடிவு' : 'Final Result'}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No matching audit records found for the current search filter.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.logId} className="hover:bg-slate-50/80 transition">
                      
                      {/* Date & Time */}
                      <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                        <div className="font-semibold">{log.formattedDate}</div>
                        <div className="text-[11px] text-slate-400">{log.formattedTime}</div>
                      </td>

                      {/* User */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{log.userName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{log.userId}</div>
                      </td>

                      {/* Access Type */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-700">
                          {log.accessType === 'LAB_ACCESS'
                            ? 'Lab Access'
                            : log.accessType === 'ATM_SERVICE'
                            ? 'ATM Banking'
                            : 'MFA Gate'}
                        </span>
                      </td>

                      {/* 3 Factor Icons */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex justify-center">{getFactorIcon(log.cardVerification)}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex justify-center">{getFactorIcon(log.faceVerification)}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex justify-center">{getFactorIcon(log.otpVerification)}</div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={log.location}>
                        {log.location}
                      </td>

                      {/* Final Result Badge */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {getResultBadge(log.result)}
                      </td>

                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

          <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Showing {filteredLogs.length} of {accessLogs.length} Total Audit Entries</span>
            <span>Immutable Security Hash: SHA-256</span>
          </div>

        </div>

      </div>

      <div className="mt-6 text-center text-xs text-slate-400 font-mono">
        <span>Protected Log Ledger • Tamper-Evident System Audit Trail</span>
      </div>

    </div>
  );
};
