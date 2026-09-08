import React from 'react';
import {
  Shield,
  Users,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ScanFace,
  KeyRound,
  CreditCard,
  History,
  Lock,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  UserCheck
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export const AdminDashboardView: React.FC = () => {
  const {
    users,
    accessLogs,
    alerts,
    resolveAlert,
    toggleUserAccountStatus,
    navigateTo,
    liveDateTime
  } = useSecurity();

  const successCount = accessLogs.filter(l => l.result === 'SUCCESS').length;
  const failedCount = accessLogs.filter(l => l.result === 'FAILED' || l.result === 'DENIED').length;
  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');

  // Breakdown statistics for monitoring
  const faceMismatches = accessLogs.filter(l => l.faceVerification === 'FAILED').length;
  const wrongOtps = accessLogs.filter(l => l.otpVerification === 'FAILED').length;
  const invalidCards = accessLogs.filter(l => l.cardVerification === 'FAILED').length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-purple-50/50 to-slate-50 text-slate-800 p-4 sm:p-6 lg:p-8 flex flex-col justify-between transition-colors">
      
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800 mb-2">
              <Shield className="h-3.5 w-3.5" />
              <span>ADMINISTRATIVE PRIVILEGES ACTIVE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Security Operations Center (SOC)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live identity verification telemetry, user provisioning, and threat monitoring
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>FIREWALL ONLINE</span>
            </div>

            <div className="text-right text-xs font-mono text-purple-900 bg-purple-100/60 px-3 py-1 rounded-xl border border-purple-200">
              <span className="font-semibold">{liveDateTime.date}</span> • <span className="font-bold">{liveDateTime.time}</span>
            </div>
          </div>
        </div>

        {/* 4 Top Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="rounded-2xl border border-indigo-200/80 bg-white/95 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Users
              </span>
              <div className="h-9 w-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900 font-mono">
              {users.length}
            </div>
            <p className="text-[11px] text-indigo-700 font-semibold mt-1">
              {users.filter(u => u.accountStatus === 'ACTIVE').length} Active • {users.filter(u => u.accountStatus !== 'ACTIVE').length} Locked/Disabled
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200/80 bg-white/95 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Successful Accesses
              </span>
              <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-emerald-700 font-mono">
              {successCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Verified 3-Factor Multi-Factor
            </p>
          </div>

          <div className="rounded-2xl border border-rose-200/80 bg-white/95 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Failed Attempts
              </span>
              <div className="h-9 w-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-rose-700 font-mono">
              {failedCount}
            </div>
            <p className="text-[11px] text-rose-600 mt-1">
              Denied by security gateway
            </p>
          </div>

          <div className="rounded-2xl border border-purple-200/80 bg-white/95 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Sessions
              </span>
              <div className="h-9 w-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Radio className="h-4 w-4 animate-pulse" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-purple-700 font-mono">
              03
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Lab & ATM Terminals Active
            </p>
          </div>

        </div>

        {/* Threat & Security Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="rounded-2xl border border-purple-200/70 bg-white/90 p-4 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <ScanFace className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Face Mismatches</p>
                <p className="text-xl font-bold font-mono text-purple-900">{faceMismatches} Logged</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200/70 bg-white/90 p-4 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Wrong OTP Attempts</p>
                <p className="text-xl font-bold font-mono text-amber-900">{wrongOtps} Logged</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200/70 bg-white/90 p-4 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Invalid Card Scans</p>
                <p className="text-xl font-bold font-mono text-blue-900">{invalidCards} Logged</p>
              </div>
            </div>
          </div>

        </div>

        {/* 2 Feature Modules: User Management preview & Active Threat Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* User Management Quick Section */}
          <div className="rounded-3xl border border-indigo-200/80 bg-white/95 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">User Identity Registry</h3>
                  <p className="text-xs text-slate-500">Access control statuses</p>
                </div>
                <button
                  onClick={() => navigateTo('ADMIN_USERS')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-4"
                >
                  Manage All
                </button>
              </div>

              <div className="space-y-2.5">
                {users.slice(0, 4).map(u => (
                  <div key={u.userId} className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{u.maskedCardNumber} • {u.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.accountStatus === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.accountStatus}
                      </span>
                      <button
                        onClick={() => toggleUserAccountStatus(u.userId)}
                        className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-white px-2 py-1 rounded border border-indigo-200"
                      >
                        {u.accountStatus === 'ACTIVE' ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => navigateTo('ADMIN_USERS')}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
              >
                Open Full User Management Table
              </button>
            </div>
          </div>

          {/* Security Alerts Section */}
          <div className="rounded-3xl border border-amber-200/80 bg-white/95 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Active Security Alerts</h3>
                  <p className="text-xs text-slate-500">Threat triage & incident response</p>
                </div>
                <button
                  onClick={() => navigateTo('SECURITY_ALERTS')}
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 underline underline-offset-4"
                >
                  View All ({alerts.length})
                </button>
              </div>

              <div className="space-y-2.5">
                {activeAlerts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                    ✓ All security incidents are currently resolved.
                  </div>
                ) : (
                  activeAlerts.slice(0, 3).map(alert => (
                    <div key={alert.alertId} className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 flex items-center space-x-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                          <span>{alert.alertType.replace(/_/g, ' ')}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{alert.formattedTime}</span>
                      </div>
                      <p className="text-[11px] text-slate-700">{alert.description}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-amber-800 italic">Action: {alert.recommendedAction}</span>
                        <button
                          onClick={() => resolveAlert(alert.alertId)}
                          className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded hover:bg-amber-700 transition"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => navigateTo('SECURITY_ALERTS')}
                className="w-full py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition"
              >
                Open Incident Response Console
              </button>
            </div>
          </div>

        </div>

      </div>

      <div className="mt-6 text-center text-xs text-slate-400 font-mono">
        <span>SOC Admin Panel • SmartSecureAccess Enterprise Node • {liveDateTime.date}</span>
      </div>

    </div>
  );
};
