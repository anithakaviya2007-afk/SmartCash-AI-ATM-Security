import React, { useState } from 'react';
import {
  Sparkles,
  TrendingDown,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Truck,
  ArrowRight,
  Sliders,
  ShieldCheck,
  Zap,
  Layers,
  TrendingUp,
  BarChart3,
  Landmark,
  Info,
  ChevronRight,
  ShieldAlert,
  MapPin
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { ATM } from '../types';

export const AIPredictionsView: React.FC = () => {
  const {
    atms,
    selectedAtm,
    setSelectedAtm,
    dispatchRefillTeam,
    navigateTo,
    language,
    openRefillModal
  } = useSecurity();

  const isTa = language === 'ta';

  // State to track selected ATM in the Forecaster dashboard
  const [activeAtmId, setActiveAtmId] = useState<string>(selectedAtm?.id || atms[0]?.id || 'ATM-101');

  const selectedAtmObj = atms.find(a => a.id === activeAtmId) || atms[0] || {
    id: 'ATM-101',
    name: 'Anna Nagar West Hub',
    location: 'Chennai Central',
    cashLevel: 75,
    cashAmount: 3750000,
    cashCapacity: 5000000,
    dailyWithdrawalAvg: 600000,
    status: 'ACTIVE' as const
  };

  // Fleet Statistics
  const totalAtmsCount = atms.length;
  const highRiskAtms = atms.filter(a => (a.cashLevel ?? 0) < 30);
  const mediumRiskAtms = atms.filter(a => (a.cashLevel ?? 0) >= 30 && (a.cashLevel ?? 0) <= 50);
  const safeAtms = atms.filter(a => (a.cashLevel ?? 0) > 50);

  // Helper to get detailed predictions for an ATM dynamically
  const getAtmPredictionDetails = (atm?: ATM) => {
    if (!atm) {
      return {
        risk: 'LOW' as const,
        riskColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        riskLabelEn: 'Safe / Low Risk',
        riskLabelTa: 'பாதுகாப்பானது / குறைந்த ஆபத்து',
        burnRate: 0,
        hoursLeft: 96,
        depletionTimeStr: '96+ hrs',
        refillTimeStr: 'Scheduled refill',
        aiRec: ''
      };
    }
    const level = atm.cashLevel ?? 0;
    
    let risk: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    let riskColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    let riskLabelEn = 'Safe / Low Risk';
    let riskLabelTa = 'பாதுகாப்பானது / குறைந்த ஆபத்து';
    
    if (level < 30) {
      risk = 'HIGH';
      riskColor = 'text-red-400 bg-red-500/10 border-red-500/20';
      riskLabelEn = 'Critical / High Risk';
      riskLabelTa = 'அதிவேக ஆபத்து / அவசரம்';
    } else if (level <= 50) {
      risk = 'MEDIUM';
      riskColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      riskLabelEn = 'Warning / Medium Risk';
      riskLabelTa = 'நடுத்தர ஆபத்து / எச்சரிக்கை';
    }
    
    // Dynamic depletion calculations based on cash levels and withdrawal averages
    const burnRate = atm.currentHourlyDrainRate || Math.round((atm.dailyWithdrawalAvg ?? 0) / 24);
    const hoursLeft = Math.round(((atm.cashAmount ?? 0) / (burnRate || 1)) * 10) / 10;
    
    let depletionTimeStr = atm.predictedDepletionTime || `${hoursLeft} hrs`;
    if (level === 100) {
      depletionTimeStr = isTa ? '96+ மணி நேரம் (முழு அளவு)' : '96+ Hours (Full)';
    } else if (level === 0) {
      depletionTimeStr = isTa ? 'உடனடி காலியானது (0%)' : 'Empty Now (0%)';
    }
    
    let refillTimeStr = atm.recommendedRefillTime || 'Scheduled refill';
    if (level < 30) {
      refillTimeStr = isTa ? 'உடனடி அவசரம் (IMMEDIATE)' : 'IMMEDIATE REFILL';
    }
    
    // AI recommendations
    let aiRec = '';
    switch(atm.id) {
      case 'ATM-101':
        aiRec = isTa 
          ? 'அண்ணா நகர் மெயின் ஹப்: வார இறுதி நாட்களில் பண புழக்கம் 1.5 மடங்கு அதிகரிக்கும். நாளை மதியம் 1:00 மணிக்குள் வாகனம் அனுப்ப பரிந்துரைக்கப்படுகிறது.'
          : 'Anna Nagar West Hub: High weekend velocity. Moderate burn rate. AI predicts depletion tomorrow during commute hours.';
        break;
      case 'ATM-102':
        aiRec = isTa 
          ? 'தியாகராய நகர் ரங்கநாதன் தெரு: அதீத மக்கள் நடமாட்டம் கொண்ட பகுதி. உடனடியாக ₹25 லட்சம் ரொக்கம் நிரப்பி, வாடிக்கையாளர்கள் ஏமாற்றமடைவதைத் தடுக்கவும்.'
          : 'T. Nagar Ranganathan St Branch: Extremely high retail activity. Critical levels. Refill IMMEDIATELY to prevent downtime.';
        break;
      case 'ATM-103':
        aiRec = isTa 
          ? 'OMR தகவல் தொழில்நுட்ப சாலை: சம்பள வார இறுதி நாட்களில் ஐடி ஊழியர்கள் அதிகம் பணம் எடுப்பார்கள். தற்போதைக்கு பாதுகாப்பானது.'
          : 'OMR Tech Corridor Hub: Corporate payroll cash outs peaking. Safe for now, but monitor evening salary hour withdrawals.';
        break;
      case 'ATM-104':
        aiRec = isTa 
          ? 'தாம்பரம் ரயில் நிலைய சந்திப்பு: தொடர்வண்டி பயணிகள் நடமாட்டம் அதிகம். 19% மட்டுமே பணம் உள்ளதால், அவசரமாக பாதுகாப்பு வாகனத்தை அனுப்பவும்.'
          : 'Tambaram Rly Station Junction: High traveler transit volume. Critical cash level. Requires immediate CIT replenishment team dispatch.';
        break;
      case 'ATM-105':
        aiRec = isTa 
          ? 'மயிலாப்பூர் திருக்குள பகுதி: கோவில் திருவிழாக்கள் மற்றும் கடை வீதி வர்த்தகம் காரணமாக மாலை நேரத்தில் பணம் தீரலாம். இரவு 8:00 மணிக்குள் ரீஃபில் செய்க.'
          : 'Mylapore Tank High Road: Local temple festival shopping surge. Moderate-high depletion velocity. Schedule refill by evening.';
        break;
      case 'ATM-106':
        aiRec = isTa 
          ? 'வேளச்சேரி பைபாஸ் சாலை: வணிக வளாகங்கள் அதிகம் இருப்பதால் பணம் வேகமாகத் தீர்கிறது. 3 மணி நேரத்திற்குள் பணம் நிரப்பவும்.'
          : 'Velachery Central Bypass: Shopping mall proximity spikes drain rate. Nearing 30% threshold. Refill recommended within 3 hours.';
        break;
      case 'ATM-107':
        aiRec = isTa 
          ? 'கோயம்புத்தூர் காந்திபுரம்: தொழிற்துறை பகுதி என்பதால் நிலையான பயன்பாடு. வாராந்திர வழக்கமான பராமரிப்பு மற்றும் ரீஃபில் போதுமானது.'
          : 'Coimbatore Gandhipuram Circle: Stable industrial district usage. Normal velocity. Next scheduled maintenance is sufficient.';
        break;
      case 'ATM-108':
        aiRec = isTa 
          ? 'மதுரை மீனாட்சி கோவில் வாசல்: சுற்றுலா பயணிகள் நடமாட்டம் மற்றும் ₹500 நோட்டுகள் அதிகம் பெறப்படுகிறது. 12 மணி நேரத்திற்குள் ரீஃபில் செய்யவும்.'
          : 'Madurai Meenakshi Gate Branch: Tourist inflow driving consistent ₹500 transactions. Medium risk. Refill within 12 hours.';
        break;
      default:
        aiRec = isTa 
          ? 'தானியங்கி IoT கணிப்பு: தற்போதைய பண புழக்கத்தின் அடிப்படையில் ரீஃபில் பட்டியலை சரிபார்க்கவும்.'
          : 'Standard IoT Forecaster: Monitor cash levels based on live withdrawal velocity and schedule timely replenishment.';
    }
    
    return {
      risk,
      riskColor,
      riskLabelEn,
      riskLabelTa,
      burnRate,
      hoursLeft,
      depletionTimeStr,
      refillTimeStr,
      aiRec
    };
  };

  // Selected ATM predictions
  const selectedAtmPred = getAtmPredictionDetails(selectedAtmObj);

  // Generate 7-day cash level forecast data for selected ATM
  const get7DayForecast = (cashLevel: number) => {
    const data = [];
    let currentLevel = cashLevel;
    const days = isTa 
      ? ['இன்று (Today)', 'நாளை (Tomorrow)', 'நாள் 3', 'நாள் 4', 'நாள் 5', 'நாள் 6', 'நாள் 7']
      : ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
      
    for (let i = 0; i < 7; i++) {
      data.push({
        day: days[i],
        level: Math.max(0, Math.round(currentLevel))
      });
      // Declines based on risk level
      const decline = cashLevel < 30 ? (4 + Math.random() * 3) : (10 + Math.random() * 5);
      currentLevel = currentLevel - decline;
    }
    return data;
  };

  const forecastData = get7DayForecast(selectedAtmObj.cashLevel);

  // SVG Chart Configuration
  const chartWidth = 540;
  const chartHeight = 160;
  const paddingX = 40;
  const paddingY = 20;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  // Calculate SVG line/area points
  const pointsString = forecastData.map((d, index) => {
    const x = paddingX + (index / (forecastData.length - 1)) * innerWidth;
    const y = paddingY + innerHeight - (d.level / 100) * innerHeight;
    return `${x},${y}`;
  }).join(' ');

  const areaPointsString = `
    ${paddingX},${paddingY + innerHeight} 
    ${pointsString} 
    ${paddingX + innerWidth},${paddingY + innerHeight}
  `;

  // Handle Select in table
  const handleSelectAtm = (atm: ATM) => {
    setActiveAtmId(atm.id);
    setSelectedAtm(atm);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header Panel */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono mb-1.5">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="tracking-wider uppercase font-extrabold">
              {isTa ? 'CASHGUARD AI • கணிப்புத் தளம்' : 'CASHGUARD AI • PREDICTIVE ANALYTICS ENGINE'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <span>{isTa ? 'AI பணம் தீரும் முன்பே கணிப்பான்' : 'AI Depletion Forecaster'}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isTa 
              ? 'IoT எடை மற்றும் ஆப்டிகல் சென்சார்கள் மூலம் ஏடிஎம்மில் பணம் காலியாகும் நேரத்தை துல்லியமாக கணிக்கிறது.'
              : 'Leverages IoT weight and optical sensors to forecast exact hours before any ATM runs out of cash.'}
          </p>
        </div>

        {/* Sensor Test bench quick toggle */}
        <button
          onClick={() => navigateTo('SENSOR_SIMULATOR')}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition duration-200 shadow-md cursor-pointer shrink-0"
        >
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>{isTa ? 'சென்சார் சிமுலேட்டர்' : 'IoT Sensor Simulator'}</span>
        </button>
      </div>

      {/* 4 Overview Statistics Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Monitored */}
        <div className="bg-slate-950/40 p-4.5 rounded-2xl border border-slate-800/80 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>{isTa ? 'மொத்த ஏடிஎம்கள்' : 'MONITORED ATMs'}</span>
              <Landmark className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono mt-1.5">{totalAtmsCount}</div>
          </div>
          <div className="text-[10px] text-slate-500 mt-2">
            {isTa ? 'சென்சார்கள் 100% இயங்குகிறது' : 'All IoT telemetry streams online'}
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* High Risk (<30%) */}
        <div className={`p-4.5 rounded-2xl border relative overflow-hidden flex flex-col justify-between ${
          highRiskAtms.length > 0 
            ? 'bg-red-950/15 border-red-500/30' 
            : 'bg-slate-950/40 border-slate-800/80'
        }`}>
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>{isTa ? 'உடனடி ஆபத்து (<30%)' : 'HIGH RISK (<30%)'}</span>
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </div>
            <div className={`text-3xl font-black font-mono mt-1.5 ${highRiskAtms.length > 0 ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
              {highRiskAtms.length}
            </div>
          </div>
          <div className={`text-[10px] mt-2 font-mono ${highRiskAtms.length > 0 ? 'text-red-300' : 'text-slate-500'}`}>
            {highRiskAtms.length > 0 
              ? (isTa ? '🚨 உடனடி ரீஃபில் தேவை!' : '🚨 Urgent dispatch required') 
              : (isTa ? 'அனைத்தும் இயல்பானது' : 'Zero emergency depots')}
          </div>
        </div>

        {/* Medium Risk (30% - 50%) */}
        <div className="bg-slate-950/40 p-4.5 rounded-2xl border border-slate-800/80 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>{isTa ? 'எச்சரிக்கை நிலை (30%-50%)' : 'MEDIUM RISK (30%-50%)'}</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400 font-mono mt-1.5">{mediumRiskAtms.length}</div>
          </div>
          <div className="text-[10px] text-slate-500 mt-2">
            {isTa ? 'அடுத்த 6 மணிநேரத்தில் தேவை' : 'Depletion predicted within 12h'}
          </div>
        </div>

        {/* Safe ATMs (>50%) */}
        <div className="bg-slate-950/40 p-4.5 rounded-2xl border border-slate-800/80 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>{isTa ? 'பாதுகாப்பான ஏடிஎம்கள்' : 'SAFE ATMs (>50%)'}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono mt-1.5">{safeAtms.length}</div>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 font-mono">
            {isTa ? 'போதுமான ரொக்கம் உள்ளது ✓' : 'Sufficient backup reserves ✓'}
          </div>
        </div>

      </div>

      {/* Main Workspace Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: ATM depletion list table */}
        <div className="lg:col-span-2 bg-slate-950/35 border border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Layers className="h-5 w-5 text-blue-400" />
              <span>{isTa ? 'ஏடிஎம் பணத் தேவை கணிப்பு அட்டவணை' : 'ATM Depletion Predictions (Live Fleet)'}</span>
            </h2>
            <span className="text-[10px] font-mono bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-lg text-slate-400">
              {isTa ? 'இணைக்கப்பட்டுள்ளது ✓' : 'Live telemetry linked ✓'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
                <tr>
                  <th className="py-3 px-3">{isTa ? 'ATM விபரம்' : 'ATM Name & ID'}</th>
                  <th className="py-3 px-3">{isTa ? 'தற்போதைய இருப்பு' : 'Current Cash'}</th>
                  <th className="py-3 px-3">{isTa ? 'சராசரி பயன்பாடு (நாள்)' : 'Daily Average'}</th>
                  <th className="py-3 px-3 text-amber-400">{isTa ? 'தீரும் காலம்' : 'Depletion Date'}</th>
                  <th className="py-3 px-3 text-right">{isTa ? 'நிலை' : 'Risk'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {atms.map((atm) => {
                  const details = getAtmPredictionDetails(atm);
                  const isActive = atm.id === activeAtmId;
                  
                  return (
                    <tr
                      key={atm.id}
                      onClick={() => handleSelectAtm(atm)}
                      className={`cursor-pointer transition duration-150 ${
                        isActive 
                          ? 'bg-blue-600/10 border-l-4 border-l-blue-500 bg-slate-800/40 text-white' 
                          : 'hover:bg-slate-800/35 text-slate-300'
                      }`}
                    >
                      <td className="py-3.5 px-3">
                        <div>
                          <span className="text-[10px] font-mono text-slate-500 block">{atm.id}</span>
                          <span className="font-extrabold text-white text-xs block truncate max-w-[200px]">
                            {atm.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[200px]">
                            {atm.location}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5">
                            <span className={`h-2 w-2 rounded-full ${
                              atm.cashLevel < 30 ? 'bg-red-500 animate-ping' : atm.cashLevel <= 50 ? 'bg-amber-400' : 'bg-emerald-500'
                            }`} />
                            <span className="font-mono font-bold">{atm.cashLevel}%</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block">
                            ₹{(atm.cashAmount ?? 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-400">
                        ₹{(atm.dailyWithdrawalAvg ?? 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3">
                        <div>
                          <span className="text-amber-400 font-extrabold font-mono block">
                            {details.depletionTimeStr}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {atm.cashLevel < 30 ? (isTa ? 'உடனடி கவனம்!' : 'Urgent replacement') : (isTa ? 'அடுத்த சுழற்சி' : 'Next Cycle')}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <span className={`inline-block text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full border ${details.riskColor}`}>
                          {isTa ? details.riskLabelTa : details.riskLabelEn}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Column: Selected ATM Analysis & 7-Day Forecast Chart */}
        <div className="bg-slate-950/35 border border-slate-800 rounded-3xl p-4 sm:p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            {/* ATM Title Info */}
            <div className="border-b border-slate-800/80 pb-3">
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md">
                {selectedAtmObj.id}
              </span>
              <h3 className="text-base font-extrabold text-white mt-1.5">{selectedAtmObj.name}</h3>
              <p className="text-[11px] text-slate-400 flex items-center mt-0.5">
                <MapPin className="w-3 h-3 text-slate-500 mr-1" />
                <span>{selectedAtmObj.location}</span>
              </p>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-mono block">{isTa ? 'தற்போதைய பணம்' : 'Current Cash'}</span>
                <span className={`text-base font-black font-mono block ${selectedAtmObj.cashLevel < 30 ? 'text-red-400' : 'text-white'}`}>
                  {selectedAtmObj.cashLevel}%
                </span>
                <span className="text-[10px] text-slate-400 block">₹{(selectedAtmObj.cashAmount ?? 0).toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-mono block">{isTa ? 'பயன்பாட்டு வேகம்' : 'Hourly Burn Rate'}</span>
                <span className="text-base font-black text-white font-mono block">
                  ₹{(selectedAtmPred.burnRate ?? 0).toLocaleString('en-IN')}/hr
                </span>
                <span className="text-[10px] text-slate-400 block">{isTa ? 'சராசரி வெளியேற்றம்' : 'Average customer pull'}</span>
              </div>
            </div>

            {/* Recommended Refill Window */}
            <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800/80 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">
                {isTa ? 'பரிந்துரைக்கப்படும் ரீஃபில் நேரம்' : 'RECOMMENDED REFILL WINDOW'}
              </span>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-black text-emerald-400">
                  {selectedAtmPred.refillTimeStr}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {isTa ? 'பரிந்துரைக்கப்படும் ரொக்கம்:' : 'Suggested fill amount:'} <strong className="text-slate-200">₹{((selectedAtmObj.cashCapacity ?? 0) - (selectedAtmObj.cashAmount ?? 0)).toLocaleString('en-IN')}</strong>
              </p>
            </div>

            {/* 7-Day Cash Depletion Forecast Chart */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center space-x-1">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                  <strong>{isTa ? '7-நாள் பண தீரும் போக்கு' : '7-Day Depletion Trend'}</strong>
                </span>
                <span className="text-[10px]">{isTa ? 'அடுத்த 7 நாட்கள்' : '7 Days prediction'}</span>
              </div>

              {/* Pure SVG Line and Area Chart */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800/80 p-2 overflow-hidden relative">
                
                {/* Y-Axis Guideline at 30% Critical Threshold */}
                <div 
                  className="absolute left-10 right-1 border-t border-dashed border-red-500/40 z-0 pointer-events-none"
                  style={{ top: `${paddingY + innerHeight - (30 / 100) * innerHeight}px` }}
                >
                  <span className="absolute right-1 -top-3.5 text-[8px] font-mono text-red-400 font-bold uppercase tracking-widest bg-slate-950 px-1 py-0.5 rounded border border-red-500/10">
                    {isTa ? '30% அவசரம்' : '30% Critical'}
                  </span>
                </div>

                <svg 
                  width="100%" 
                  height={chartHeight} 
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  preserveAspectRatio="xMidYMid meet"
                  className="overflow-visible"
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
                    </linearGradient>
                    <linearGradient id="alertGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  {[0, 25, 50, 75, 100].map((val) => {
                    const y = paddingY + innerHeight - (val / 100) * innerHeight;
                    return (
                      <g key={val} className="opacity-20">
                        <line 
                          x1={paddingX} 
                          y1={y} 
                          x2={chartWidth - paddingX} 
                          y2={y} 
                          stroke="#475569" 
                          strokeWidth="1" 
                        />
                        <text 
                          x={paddingX - 8} 
                          y={y + 3} 
                          textAnchor="end" 
                          fill="#94a3b8" 
                          fontSize="8" 
                          fontFamily="monospace"
                        >
                          {val}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Shaded Area Chart */}
                  <polygon
                    points={areaPointsString}
                    fill={`url(#${selectedAtmObj.cashLevel < 30 ? 'alertGradient' : 'chartGradient'})`}
                    className="transition-all duration-300"
                  />

                  {/* Colored Trendline */}
                  <polyline
                    fill="none"
                    stroke={selectedAtmObj.cashLevel < 30 ? '#ef4444' : '#3b82f6'}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsString}
                    className="transition-all duration-300"
                  />

                  {/* Interactive Circles / Data points */}
                  {forecastData.map((d, index) => {
                    const x = paddingX + (index / (forecastData.length - 1)) * innerWidth;
                    const y = paddingY + innerHeight - (d.level / 100) * innerHeight;
                    return (
                      <g key={index} className="group cursor-pointer">
                        <circle
                          cx={x}
                          cy={y}
                          r="5.5"
                          fill="#0f172a"
                          stroke={selectedAtmObj.cashLevel < 30 ? '#ef4444' : '#3b82f6'}
                          strokeWidth="2.5"
                          className="transition-all duration-200 hover:r-7"
                        />
                        {/* Hover values */}
                        <text
                          x={x}
                          y={y - 10}
                          textAnchor="middle"
                          fill="#f8fafc"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                          className="bg-slate-900 border px-1 rounded shadow"
                        >
                          {d.level}%
                        </text>
                        {/* Day labels along X-axis */}
                        <text
                          x={x}
                          y={chartHeight - 3}
                          textAnchor="middle"
                          fill="#64748b"
                          fontSize="8"
                          fontFamily="sans-serif"
                        >
                          {index === 0 ? (isTa ? 'இன்று' : 'Today') : index === 1 ? (isTa ? 'நாளை' : 'Tom') : `D${index+1}`}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* AI Recommendation Insights note */}
            <div className="bg-blue-950/20 border border-blue-500/15 p-3.5 rounded-2xl space-y-1.5">
              <div className="flex items-center space-x-1.5 text-blue-400 font-extrabold text-[10px] uppercase font-mono">
                <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>{isTa ? 'AI முன்னறிவிப்பு குறிப்பு' : 'AI FORECAST REFILL ANALYSIS'}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {selectedAtmPred.aiRec}
              </p>
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="space-y-2 pt-4 border-t border-slate-800/80">
            <button
              onClick={() => {
                openRefillModal(selectedAtmObj.id);
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition duration-200 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>{isTa ? 'ரீஃபில் வாகனம் அனுப்புக' : 'Schedule Armored Refill'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedAtm(selectedAtmObj);
                navigateTo('ATM_DETAILS');
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition duration-150 cursor-pointer"
            >
              <Landmark className="w-3.5 h-3.5 text-slate-400" />
              <span>{isTa ? 'ஏடிஎம் முழு விவரம் காண்க' : 'View ATM Fleet Details'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
