import React from 'react';
import {
  LayoutDashboard,
  Sliders,
  Landmark,
  BellRing,
  Truck,
  Home,
  MapPin,
  Bot,
  Scan
} from 'lucide-react';
import { ViewName } from '../types';
import { useSecurity } from '../context/SecurityContext';

export const BottomNav: React.FC = () => {
  const { currentView, navigateTo, notifications, atms, language } = useSecurity();

  const unreadAlerts = notifications.filter(n => !n.isAcknowledged).length;
  const criticalAtmsCount = atms.filter(a => a.cashLevel < 30).length;

  const navItems: { id: ViewName; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'DASHBOARD',
      label: language === 'ta' ? 'டாஷ்போர்டு' : 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      id: 'SENSOR_SIMULATOR',
      label: language === 'ta' ? 'சிமுலேட்டர்' : 'Simulator',
      icon: <Sliders className="h-5 w-5" />,
      badge: criticalAtmsCount > 0 ? criticalAtmsCount : undefined,
      badgeColor: 'bg-red-500'
    },
    {
      id: 'ATM_MAP',
      label: language === 'ta' ? 'ATM' : 'ATM',
      icon: <MapPin className="h-5 w-5 text-emerald-400" />
    },
    {
      id: 'REFILL_TEAMS',
      label: language === 'ta' ? 'வாகனங்கள்' : 'Vans',
      icon: <Truck className="h-5 w-5 text-teal-400" />
    },
    {
      id: 'AI_ASSISTANT',
      label: language === 'ta' ? 'AI உதவி' : 'AI Help',
      icon: <Bot className="h-5 w-5 text-indigo-400" />
    },
    {
      id: 'WELCOME',
      label: language === 'ta' ? 'ஸ்கேனர்' : 'Scanner',
      icon: <Scan className="h-5 w-5 text-emerald-400" />
    }
  ];

  const isCurrentActive = (item: typeof navItems[0]) => {
    if (item.id === 'ATM_MAP') {
      return ['ATM_MAP', 'ATM_DETAILS'].includes(currentView);
    }
    if (item.id === 'WELCOME') {
      return ['WELCOME', 'STEP1_FACE', 'STEP2_CARD', 'STEP3_PIN', 'STEP4_DECISION', 'STEP5_WITHDRAWAL'].includes(currentView);
    }
    return currentView === item.id;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-md py-1 px-1 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const active = isCurrentActive(item);
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                active
                  ? 'text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className={`absolute -top-1.5 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold text-white ${item.badgeColor || 'bg-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 truncate max-w-[56px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
