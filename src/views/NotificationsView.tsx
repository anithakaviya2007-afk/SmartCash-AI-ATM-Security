import React, { useState } from 'react';
import {
  BellRing,
  AlertTriangle,
  CheckCircle2,
  VolumeX,
  Volume2,
  Trash2,
  Filter,
  Truck,
  ArrowRight,
  ShieldAlert,
  Clock,
  MapPin,
  Check
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    acknowledgeNotification,
    silenceAlarm,
    isSirenAudible,
    activeAlarmAtm,
    refillAtm,
    dispatchRefillTeam,
    refillTeams,
    navigateTo,
    language,
    t
  } = useSecurity();

  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'UNREAD'>('ALL');

  const filtered = notifications.filter((n) => {
    if (filter === 'CRITICAL') return n.severity === 'CRITICAL' || n.type === 'CRITICAL_CASH';
    if (filter === 'UNREAD') return !n.isRead || !n.isAcknowledged;
    return true;
  });

  const criticalCount = notifications.filter(n => n.severity === 'CRITICAL').length;
  const unreadCount = notifications.filter(n => !n.isAcknowledged).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-blue-400 font-mono mb-1">
            <BellRing className="w-3.5 h-3.5" />
            <span>CashGuard AI • MANAGER ALERTS & NOTIFICATIONS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <span>{t('notificationsTitle')}</span>
            {unreadCount > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-red-500 text-white font-mono animate-pulse">
                {unreadCount} {language === 'ta' ? 'புதிய எச்சரிக்கை' : 'Active'}
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {language === 'ta'
              ? '“பணம் தீரும் முன்பே தெரியும்.” • ATM-ல் பணம் 30%-க்கு கீழ் குறைந்ததும் மேலாளருக்கு அனுப்பப்பட்ட அலாரங்கள்.'
              : '“Knows before cash runs out.” • High-priority sensor alarms & dispatch notifications for bank managers.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {isSirenAudible && (
            <button
              onClick={silenceAlarm}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer animate-pulse"
            >
              <VolumeX className="w-4 h-4" />
              <span>{t('silenceAlarm')}</span>
            </button>
          )}
          <button
            onClick={() => navigateTo('SENSOR_SIMULATOR')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {language === 'ta' ? 'அலாரம் சோதனை' : 'Test Alarm in Simulator'}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700/80 w-fit">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          {language === 'ta' ? 'அனைத்து எச்சரிக்கைகள்' : 'All Alerts'} ({notifications.length})
        </button>

        <button
          onClick={() => setFilter('CRITICAL')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'CRITICAL' ? 'bg-red-600 text-white' : 'text-red-400 hover:text-red-300'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{language === 'ta' ? 'அவசர அலாரங்கள் (<30%)' : 'Critical (<30%)'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-red-950 text-[10px] font-mono">{criticalCount}</span>
        </button>

        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'UNREAD' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          {language === 'ta' ? 'நடவடிக்கை தேவைப்படுபவை' : 'Action Required'} ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-w-7xl mx-auto space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-slate-800/60 rounded-2xl border border-slate-700/80 p-12 text-center text-slate-400">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">
              {language === 'ta' ? 'எந்த புதிய எச்சரிக்கையும் இல்லை' : 'No Alerts in this category'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'ta' ? 'அனைத்து ATM-களிலும் பணம் போதுமான அளவில் உள்ளது.' : 'All cash levels are currently above critical thresholds.'}
            </p>
          </div>
        ) : (
          filtered.map((notif) => {
            const isCrit = notif.severity === 'CRITICAL';
            return (
              <div
                key={notif.id}
                className={`rounded-2xl border p-5 backdrop-blur-md shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCrit
                    ? 'bg-red-950/30 border-red-500/70 shadow-red-950/40'
                    : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl shrink-0 ${
                    isCrit ? 'bg-red-500/20 text-red-400 animate-bounce' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {isCrit ? <ShieldAlert className="w-6 h-6" /> : <BellRing className="w-6 h-6" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCrit ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {notif.type}
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{notif.timestamp}</span>
                      </span>
                      <span className="text-xs text-slate-400 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{notif.location}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{notif.title}</h3>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">{notif.message}</p>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 md:self-center">
                  {notif.requiresAction && (
                    <button
                      onClick={() => {
                        dispatchRefillTeam('TEAM-01', notif.atmId);
                        acknowledgeNotification(notif.id);
                        navigateTo('REFILL_TEAMS');
                      }}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-red-950/60 transition-colors cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{language === 'ta' ? 'வாகனம் அனுப்புக' : 'Dispatch Van'}</span>
                    </button>
                  )}

                  {!notif.isAcknowledged ? (
                    <button
                      onClick={() => acknowledgeNotification(notif.id)}
                      className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'ta' ? 'ஏற்றுக்கொள்' : 'Acknowledge'}</span>
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 flex items-center space-x-1 px-3 py-1.5 bg-emerald-950/40 rounded-lg border border-emerald-500/30 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'ta' ? 'ஏற்றுக்கொள்ளப்பட்டது' : 'Acknowledged'}</span>
                    </span>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
