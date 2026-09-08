import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  BellRing,
  Filter,
  Sparkles,
  RotateCcw,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Plus,
  Volume2
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { AlertType } from '../types';
import { playSound } from '../utils/soundEffects';

export const SecurityAlertsView: React.FC = () => {
  const { alerts, resolveAlert, triggerAlert, liveDateTime, users } = useSecurity();

  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(a => {
    const matchesType = filterType === 'ALL' || a.alertType === filterType;
    const matchesStatus = filterStatus === 'ALL' || a.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const getAlertSeverityBadge = (type: AlertType) => {
    switch (type) {
      case 'MULTIPLE_FAILED_ATTEMPTS':
      case 'SUSPICIOUS_ACCESS':
        return (
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 border border-rose-200">
            HIGH SEVERITY
          </span>
        );
      case 'FACE_MISMATCH':
      case 'WRONG_OTP':
      case 'ACCOUNT_DISABLED':
        return (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
            MEDIUM SEVERITY
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 border border-blue-200">
            LOW SEVERITY
          </span>
        );
    }
  };

  const handleSimulateAlert = () => {
    const threatTypes: {
      type: AlertType;
      desc: string;
      action: string;
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    }[] = [
      {
        type: 'MULTIPLE_FAILED_ATTEMPTS',
        desc: '3 consecutive failed PIN attempts detected at SecureGate ATM #01.',
        action: 'Lock card account and trigger alert siren.',
        severity: 'CRITICAL'
      },
      {
        type: 'FACE_MISMATCH',
        desc: 'Biometric face confidence 39.4% (Threshold: 85%) during card scan.',
        action: 'Capture camera frame and block transaction.',
        severity: 'HIGH'
      },
      {
        type: 'SUSPICIOUS_ACCESS',
        desc: 'Unauthorized cash withdrawal attempt using stolen card profile.',
        action: 'Auto-eject card and sound intrusion alarm.',
        severity: 'CRITICAL'
      }
    ];

    const randomThreat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    triggerAlert(
      randomThreat.type,
      randomThreat.desc,
      randomThreat.action,
      randomThreat.severity,
      users[0]
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-amber-50 via-yellow-50/60 to-orange-50/40 text-slate-800 p-4 sm:p-6 lg:p-8 flex flex-col justify-between transition-colors">
      
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 mb-2">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>INCIDENT RESPONSE & THREAT DETECTOR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Security Threat Alerts
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Automated intrusion prevention alerts triggered by multi-factor verification anomalies
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => playSound.criticalAlarm()}
              className="flex items-center space-x-1.5 rounded-xl border border-rose-300 bg-rose-100 hover:bg-rose-200 px-3.5 py-2 text-xs font-bold text-rose-800 transition shadow-sm active:scale-95"
              title="Test Security Alert Siren Sound"
            >
              <Volume2 className="h-4 w-4 text-rose-600 animate-pulse" />
              <span>Test Alert Siren (எச்சரிக்கை ஒலி)</span>
            </button>

            <button
              onClick={handleSimulateAlert}
              className="flex items-center space-x-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 transition shadow-sm active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Simulate Threat Event</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-amber-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="rounded-xl border border-amber-200 bg-amber-50/50 px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Alert Types</option>
              <option value="INVALID_CARD">Invalid Card Scans</option>
              <option value="FACE_MISMATCH">Face Biometric Mismatches</option>
              <option value="WRONG_OTP">Incorrect OTP Codes</option>
              <option value="MULTIPLE_FAILED_ATTEMPTS">Multiple Failed Attempts</option>
              <option value="SUSPICIOUS_ACCESS">Suspicious Access Logs</option>
              <option value="ACCOUNT_DISABLED">Disabled Account Access</option>
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="rounded-xl border border-amber-200 bg-amber-50/50 px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE (Requires Action)</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>

          <span className="text-xs font-mono text-slate-500">
            {filteredAlerts.length} Incident Records
          </span>

        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="bg-white/95 rounded-3xl border border-amber-200/80 p-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900">No Incidents Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                No active threats matching the specified criteria. System running in nominal state.
              </p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div
                key={alert.alertId}
                className={`rounded-3xl border p-5 sm:p-6 transition-all shadow-sm backdrop-blur-md ${
                  alert.status === 'ACTIVE'
                    ? 'bg-white/95 border-amber-300 ring-1 ring-amber-400/30'
                    : 'bg-white/70 border-slate-200 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      alert.status === 'ACTIVE'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {alert.status === 'ACTIVE' ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {alert.alertType.replace(/_/g, ' ')}
                        </h3>
                        {getAlertSeverityBadge(alert.alertType)}
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Incident ID: {alert.alertId} • User Target: <strong className="text-slate-800">{alert.userName}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono text-slate-500">
                    <span>{alert.formattedDate} • {alert.formattedTime}</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      alert.status === 'ACTIVE'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-700">
                  <p className="font-medium">{alert.description}</p>
                  <div className="mt-2 rounded-xl bg-amber-50/60 p-2.5 border border-amber-100 flex items-center justify-between">
                    <span className="text-[11px] text-amber-900 font-medium">
                      <strong>Recommended Protocol:</strong> {alert.recommendedAction}
                    </span>

                    {alert.status === 'ACTIVE' && (
                      <button
                        onClick={() => resolveAlert(alert.alertId)}
                        className="ml-3 shrink-0 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700 transition"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

      <div className="mt-6 text-center text-xs text-slate-400 font-mono">
        <span>SmartSecure SOC Incident Response Engine • Active Telemetry Stream</span>
      </div>

    </div>
  );
};
