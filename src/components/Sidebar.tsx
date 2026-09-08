import React from 'react';
import {
  LayoutDashboard,
  Sliders,
  Landmark,
  BellRing,
  Sparkles,
  Truck,
  Scan,
  History,
  Shield,
  Home,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  FileText,
  ScanFace,
  Bot,
  HelpCircle
} from 'lucide-react';
import { ViewName } from '../types';
import { useSecurity } from '../context/SecurityContext';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggleCollapse }) => {
  const {
    currentView,
    navigateTo,
    startVerification,
    activeAlarmAtm,
    notifications,
    atms,
    language,
    t,
    openRefillModal,
    setIsHowItWorksOpen
  } = useSecurity();

  const unreadAlerts = notifications.filter(n => !n.isAcknowledged).length;
  const criticalAtmsCount = atms.filter(a => a.cashLevel < 30).length;

  const managerItems = [
    {
      id: 'DASHBOARD' as ViewName,
      label: language === 'ta' ? 'மேலாளர் டாஷ்போர்டு' : 'Manager Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    {
      id: 'SENSOR_SIMULATOR' as ViewName,
      label: language === 'ta' ? 'சென்சார் கண்காணிப்பு' : 'Sensor Monitoring',
      icon: <Sliders className="h-4 w-4 text-blue-400" />,
      badge: criticalAtmsCount > 0 ? criticalAtmsCount : undefined,
      badgeColor: 'bg-red-500 text-white'
    },
    {
      id: 'NOTIFICATIONS' as ViewName,
      label: language === 'ta' ? 'எச்சரிக்கைகள் & பாதுகாப்பு' : 'Alerts & Security',
      icon: <BellRing className="h-4 w-4" />,
      badge: unreadAlerts > 0 ? unreadAlerts : undefined,
      badgeColor: 'bg-red-500 text-white animate-pulse'
    },
    {
      id: 'REPORTS' as ViewName,
      label: language === 'ta' ? 'பரிவர்த்தனை & CSV அறிக்கை' : 'Transactions & CSV Reports',
      icon: <FileText className="h-4 w-4 text-sky-400" />
    },
    {
      id: 'REFILL_TEAMS' as ViewName,
      label: language === 'ta' ? 'பணம் நிரப்பும் வாகனங்கள்' : 'Cash Logistics / Vans',
      icon: <Truck className="h-4 w-4 text-emerald-400" />
    }
  ];

  const userItems = [
    {
      id: 'WELCOME' as ViewName,
      label: language === 'ta' ? 'ATM ஸ்கேனர் & அவசரம்' : 'ATM Scanner & Emergency',
      icon: <Scan className="h-4 w-4 text-emerald-400" />
    },
    {
      id: 'ACCESS_HISTORY' as ViewName,
      label: language === 'ta' ? 'பரிவர்த்தனை பதிவுகள்' : 'Transaction History',
      icon: <History className="h-4 w-4" />
    },
    {
      id: 'ATM_MAP' as ViewName,
      label: language === 'ta' ? 'அனைத்து வங்கிக் கிளைகள்' : 'All Branches / ATM Map',
      icon: <MapPin className="h-4 w-4 text-emerald-400" />
    }
  ];

  const aiItems = [
    {
      id: 'AI_ASSISTANT' as ViewName,
      label: language === 'ta' ? 'Gemini AI வங்கி உதவி' : 'Gemini Banking AI',
      icon: <Bot className="h-4 w-4 text-indigo-400 animate-pulse" />
    },
    {
      id: 'AI_PREDICTIONS' as ViewName,
      label: language === 'ta' ? 'பணம் தீரும் முன் அறிவிப்பு' : 'Cash Availability Prediction',
      icon: <Sparkles className="h-4 w-4 text-amber-400" />
    }
  ];

  const isCurrentActive = (viewId: ViewName) => {
    if (viewId === 'STEP1_FACE') {
      return [
        'STEP1_FACE',
        'STEP2_CARD',
        'STEP3_PIN',
        'STEP4_DECISION',
        'STEP5_WITHDRAWAL',
        'CARD_SCAN',
        'CARD_VERIFIED',
        'FACE_RECOGNITION',
        'OTP_VERIFICATION',
        'ACCESS_GRANTED',
        'ACCESS_DENIED'
      ].includes(currentView);
    }
    if (viewId === 'ATM_MAP') {
      return ['ATM_MAP', 'ATM_DETAILS'].includes(currentView);
    }
    return currentView === viewId;
  };

  return (
    <aside
      className={`relative hidden lg:flex flex-col border-r border-slate-800 bg-slate-900/90 backdrop-blur-md transition-all duration-300 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Mini-Card */}
      {!collapsed && (
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider">
            Bank Manager Portal
          </div>
          <div className="text-xs text-slate-300 font-medium mt-0.5">
            Real-time Sensor Monitoring
          </div>
        </div>
      )}

      {/* Nav Section: Sidebar Items */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        
        {/* Manager Section */}
        <div>
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {language === 'ta' ? '👨‍💼 மேலாளர் கட்டுப்பாடுகள்' : '👨‍💼 Manager Controls'}
            </div>
          )}
          <nav className="space-y-1">
            {managerItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                title={item.label}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isCurrentActive(item.id)
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!collapsed && item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${item.badgeColor || 'bg-slate-700 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User / Customer Section */}
        <div>
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {language === 'ta' ? '👤 வாடிக்கையாளர் பகுதி' : '👤 Customer Portal'}
            </div>
          )}
          <nav className="space-y-1">
            {userItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  if ((item as any).action) (item as any).action();
                  else navigateTo(item.id);
                }}
                title={item.label}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isCurrentActive(item.id)
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* AI System Section */}
        <div>
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-amber-400/80">
              {language === 'ta' ? '🤖 AI அமைப்புகள்' : '🤖 AI Systems'}
            </div>
          )}
          <nav className="space-y-1">
            {aiItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                title={item.label}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isCurrentActive(item.id)
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Quick Refill Handover & Guide CTA */}
        {!collapsed && (
          <div className="pt-2 px-1 space-y-2">
            <button
              onClick={() => openRefillModal()}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/60 transition cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'பணம் நிரப்ப (Refill)' : 'Dispatch Refill (100%)'}</span>
            </button>

            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-amber-300 hover:text-white font-bold text-xs transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ta' ? '💡 எப்படி இயங்குகிறது?' : '💡 How It Works'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer / Collapse Toggle */}
      {onToggleCollapse && (
        <div className="p-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      )}
    </aside>
  );
};
