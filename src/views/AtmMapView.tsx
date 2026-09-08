import React, { useState } from 'react';
import {
  MapPin,
  Landmark,
  AlertTriangle,
  CheckCircle2,
  BellRing,
  Truck,
  RotateCcw,
  Zap,
  Sliders,
  Sparkles,
  Layers,
  Search,
  Filter,
  Navigation,
  Activity,
  Maximize2,
  Volume2,
  VolumeX,
  ArrowRight,
  ShieldAlert,
  X,
  Crosshair,
  Compass,
  Clock,
  Building2,
  Banknote,
  CreditCard,
  ArrowDownUp,
  Car
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { ATM, RefillTeam } from '../types';

export const AtmMapView: React.FC = () => {
  const {
    atms,
    selectedAtm,
    setSelectedAtm,
    refillTeams,
    updateAtmCashLevel,
    simulateDropBelow30,
    refillAtm,
    dispatchRefillTeam,
    navigateTo,
    language,
    t,
    isSirenAudible,
    silenceAlarm
  } = useSecurity();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'NORMAL' | 'WARNING' | 'CRITICAL'>('ALL');
  const [facilityFilter, setFacilityFilter] = useState<'ALL' | 'BANK_BRANCH' | 'CDM_RECYCLER' | 'ATM' | 'DRIVE_THRU'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMapAtm, setSelectedMapAtm] = useState<ATM | null>(selectedAtm || atms[0]);
  const [showTransitRoutes, setShowTransitRoutes] = useState<boolean>(true);

  // Live GPS Geolocation State
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    active: boolean;
    loading: boolean;
    nearestAtm: ATM | null;
    distanceKm: number | null;
    addressName: string;
  }>({
    lat: 13.0827,
    lng: 80.2707,
    active: false,
    loading: false,
    nearestAtm: null,
    distanceKm: null,
    addressName: 'Chennai Central'
  });

  // Calculate Distance (Haversine formula in KM)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  };

  // Detect Live GPS Location
  const handleDetectLiveGps = () => {
    setUserLocation(prev => ({ ...prev, loading: true }));

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Find nearest active ATM
          let nearest: ATM | null = null;
          let minDistance = Infinity;

          atms.forEach(atm => {
            if (atm.cashLevel > 0) {
              const dist = calculateDistance(lat, lng, atm.coordinates.lat, atm.coordinates.lng);
              if (dist < minDistance) {
                minDistance = dist;
                nearest = atm;
              }
            }
          });

          setUserLocation({
            lat,
            lng,
            active: true,
            loading: false,
            nearestAtm: nearest || atms[0],
            distanceKm: minDistance === Infinity ? 0.8 : minDistance,
            addressName: 'Live User GPS Position'
          });

          if (nearest) {
            setSelectedMapAtm(nearest);
          }
        },
        (error) => {
          // Fallback location (Anna Nagar / Chennai Central Metro) if GPS denied
          const fallbackLat = 13.0827;
          const fallbackLng = 80.2707;
          const nearest = atms[0];
          const dist = calculateDistance(fallbackLat, fallbackLng, nearest.coordinates.lat, nearest.coordinates.lng);

          setUserLocation({
            lat: fallbackLat,
            lng: fallbackLng,
            active: true,
            loading: false,
            nearestAtm: nearest,
            distanceKm: dist,
            addressName: 'Chennai Metro Central (Default GPS)'
          });
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      setUserLocation(prev => ({ ...prev, active: true, loading: false }));
    }
  };

  // Status mapping:
  // 70–100%: Normal (🟢)
  // 30–69%: Warning (🟡)
  // 0–29%: Critical (🔴)
  const getAtmStatusCategory = (cashLevel: number) => {
    if (cashLevel < 30) return 'CRITICAL';
    if (cashLevel < 70) return 'WARNING';
    return 'NORMAL';
  };

  const filteredAtms = atms.filter(atm => {
    const matchesSearch =
      atm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atm.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atm.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atm.city.toLowerCase().includes(searchTerm.toLowerCase());

    const category = getAtmStatusCategory(atm.cashLevel);
    const matchesCashFilter = activeFilter === 'ALL' || category === activeFilter;

    let matchesFacility = true;
    if (facilityFilter === 'BANK_BRANCH') {
      matchesFacility = atm.facilityType === 'BANK_BRANCH';
    } else if (facilityFilter === 'CDM_RECYCLER') {
      matchesFacility = atm.facilityType === 'CDM_RECYCLER' || !!atm.hasCashDeposit;
    } else if (facilityFilter === 'ATM') {
      matchesFacility = !atm.facilityType || atm.facilityType === 'ATM';
    } else if (facilityFilter === 'DRIVE_THRU') {
      matchesFacility = atm.facilityType === 'DRIVE_THRU';
    }

    return matchesSearch && matchesCashFilter && matchesFacility;
  });

  const branchCount = atms.filter(a => a.facilityType === 'BANK_BRANCH').length;
  const cdmCount = atms.filter(a => a.facilityType === 'CDM_RECYCLER' || a.hasCashDeposit).length;
  const atmCount = atms.filter(a => !a.facilityType || a.facilityType === 'ATM').length;

  const normalCount = atms.filter(a => a.cashLevel >= 70).length;
  const warningCount = atms.filter(a => a.cashLevel >= 30 && a.cashLevel < 70).length;
  const criticalCount = atms.filter(a => a.cashLevel < 30).length;
  const zeroCount = atms.filter(a => a.cashLevel === 0).length;

  // Geographic bounds conversion for Tamil Nadu / Chennai area coordinates
  // Lat range: 9.5 to 13.4, Lng range: 76.5 to 80.5
  // Map canvas normalized to 800x520
  const getCanvasCoords = (lat: number, lng: number) => {
    // Chennai Metro focus with satellite nodes (Coimbatore, Madurai)
    // We map Chennai metro (12.8 - 13.2 lat, 80.0 - 80.35 lng) mostly to upper right,
    // and southern nodes to lower left
    const minLat = 8.5;
    const maxLat = 13.25;
    const minLng = 76.8;
    const maxLng = 80.35;

    const x = ((lng - minLng) / (maxLng - minLng)) * 740 + 30;
    // Latitude is inverted in SVG (higher lat = lower y)
    const y = ((maxLat - lat) / (maxLat - minLat)) * 440 + 40;
    return { x: Math.max(40, Math.min(760, x)), y: Math.max(40, Math.min(480, y)) };
  };

  const handleMarkerClick = (atm: ATM) => {
    setSelectedMapAtm(atm);
    setSelectedAtm(atm);
  };

  const idleTeam = refillTeams.find(t => t.currentStatus === 'IDLE') || refillTeams[0];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-blue-400 font-mono mb-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>CashGuard AI • GEOSPATIAL FLEET SURVEILLANCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <span>{language === 'ta' ? 'ATM நேரலை வரைபடம்' : 'Live ATM Fleet Map'}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
              {atms.length} {language === 'ta' ? 'நிலையங்கள்' : 'Terminals'}
            </span>
          </h1>
          <p className="text-sm text-blue-300/90 font-medium italic mt-1">
            “பணம் தீரும் முன்பே தெரியும்.” — Real-time sensor telemetry mapped with GPS location.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigateTo('SENSOR_SIMULATOR')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-900/40 transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>{language === 'ta' ? 'சென்சார் சிமுலேட்டர்' : 'Sensor Simulator (<30%)'}</span>
          </button>
          <button
            onClick={() => navigateTo('REFILL_TEAMS')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ta' ? 'பாதுகாப்பு வேன்கள்' : 'Armored Vans'} ({refillTeams.length})</span>
          </button>
        </div>
      </div>

      {/* Nearby Facility Type Selector Bar (Bank Branches, CDM Machines, ATMs) */}
      <div className="max-w-7xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center space-x-2 px-2 text-xs font-bold text-slate-300">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span>{language === 'ta' ? 'அருகிலுள்ள மையம் வடிகட்டி:' : 'Nearby Facility Category:'}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* All */}
          <button
            onClick={() => setFacilityFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer border ${
              facilityFilter === 'ALL'
                ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-900/50'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            <span>🌐 {language === 'ta' ? 'அனைத்தும்' : 'All Facilities'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950/60 text-[10px] font-mono">{atms.length}</span>
          </button>

          {/* Bank Branches */}
          <button
            onClick={() => setFacilityFilter('BANK_BRANCH')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer border ${
              facilityFilter === 'BANK_BRANCH'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-900/50'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-emerald-500/50'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-emerald-300" />
            <span>🏦 {language === 'ta' ? 'வங்கிக் கிளைகள்' : 'Bank Branches'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-200 border border-emerald-700 text-[10px] font-mono">{branchCount}</span>
          </button>

          {/* Cash Deposit Machines (CDM / Recycler) */}
          <button
            onClick={() => setFacilityFilter('CDM_RECYCLER')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer border ${
              facilityFilter === 'CDM_RECYCLER'
                ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-900/50'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-purple-500/50'
            }`}
          >
            <ArrowDownUp className="w-3.5 h-3.5 text-purple-300" />
            <span>💵 {language === 'ta' ? 'பணம் வைப்பு எந்திரங்கள் (CDM)' : 'Cash Deposit & Recycler (CDM)'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-purple-950 text-purple-200 border border-purple-700 text-[10px] font-mono">{cdmCount}</span>
          </button>

          {/* 24/7 ATM Cash Withdrawal Machines */}
          <button
            onClick={() => setFacilityFilter('ATM')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer border ${
              facilityFilter === 'ATM'
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-900/50'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-cyan-500/50'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-cyan-300" />
            <span>🏧 {language === 'ta' ? '24/7 ATM கார்டு எந்திரங்கள்' : '24/7 ATM Card Cash Machines'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-200 border border-cyan-700 text-[10px] font-mono">{atmCount}</span>
          </button>
        </div>
      </div>

      {/* KPI Status Strip */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Normal */}
        <button
          onClick={() => setActiveFilter(activeFilter === 'NORMAL' ? 'ALL' : 'NORMAL')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            activeFilter === 'NORMAL'
              ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/40'
              : 'bg-slate-800/80 border-slate-700/80 hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
              <span>🟢 {language === 'ta' ? 'சாதாரண நிலை' : 'Normal (70–100%)'}</span>
            </span>
            <span className="text-lg font-black font-mono text-emerald-400">{normalCount}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'ta' ? 'போதுமான பண இருப்பு' : 'Optimal cash reserve'}
          </p>
        </button>

        {/* Warning */}
        <button
          onClick={() => setActiveFilter(activeFilter === 'WARNING' ? 'ALL' : 'WARNING')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            activeFilter === 'WARNING'
              ? 'bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/40'
              : 'bg-slate-800/80 border-slate-700/80 hover:border-amber-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 font-bold flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50"></span>
              <span>🟡 {language === 'ta' ? 'எச்சரிக்கை' : 'Warning (30–69%)'}</span>
            </span>
            <span className="text-lg font-black font-mono text-amber-400">{warningCount}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'ta' ? 'ரீஃபில் திட்டமிடவும்' : 'Plan refill in 2-4 hrs'}
          </p>
        </button>

        {/* Critical */}
        <button
          onClick={() => setActiveFilter(activeFilter === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            activeFilter === 'CRITICAL'
              ? 'bg-red-950/60 border-red-500 ring-2 ring-red-500/40'
              : 'bg-slate-800/80 border-slate-700/80 hover:border-red-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-red-400 font-bold flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500/50"></span>
              <span>🔴 {language === 'ta' ? 'அவசர நிலை' : 'Critical (0–29%)'}</span>
            </span>
            <span className="text-lg font-black font-mono text-red-500 animate-pulse">{criticalCount}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'ta' ? 'உடனடி அலாரம் & வேன் தேவை' : 'Instant alarm & dispatch'}
          </p>
        </button>

        {/* Armored Transit */}
        <div className="p-3.5 rounded-2xl border border-slate-700/80 bg-slate-800/80 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-400 font-bold flex items-center space-x-1.5">
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'ta' ? 'பணப் பாதுகாப்பு வேன்கள்' : 'Refill Vans Active'}</span>
            </span>
            <span className="text-lg font-black font-mono text-blue-400">{refillTeams.length}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {refillTeams.filter(t => t.currentStatus === 'EN_ROUTE').length} en route • {refillTeams.filter(t => t.currentStatus === 'IDLE').length} idle
          </p>
        </div>
      </div>

      {/* Main Interactive Map & Details Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* MAP CANVAS (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          
          {/* Map Controls & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 z-20">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={language === 'ta' ? 'ATM இடம் அல்லது ID தேட...' : 'Search location or ATM ID...'}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Toggle Transit Routes */}
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleDetectLiveGps}
                disabled={userLocation.loading}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer border shadow-sm ${
                  userLocation.active
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-cyan-950/70 text-cyan-300 border-cyan-500/50 hover:bg-cyan-900/80'
                }`}
              >
                <Crosshair className={`w-3.5 h-3.5 ${userLocation.loading ? 'animate-spin text-amber-300' : 'text-emerald-400'}`} />
                <span>
                  {userLocation.loading
                    ? (language === 'ta' ? 'GPS தேடப்படுகிறது...' : 'Locating GPS...')
                    : userLocation.active
                    ? (language === 'ta' ? '🟢 நேரலை GPS இயக்கத்தில்' : '🟢 GPS Active')
                    : (language === 'ta' ? '📍 நேரலை GPS இடம்' : '📍 Detect Live GPS')}
                </span>
              </button>

              <button
                onClick={() => setShowTransitRoutes(!showTransitRoutes)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer border ${
                  showTransitRoutes
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500/50'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'பாதை வரைபடம்' : 'Transit Routes'}</span>
              </button>

              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  activeFilter === 'ALL'
                    ? 'bg-slate-700 text-white border-slate-600'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {language === 'ta' ? 'அனைத்தும்' : 'All'} ({atms.length})
              </button>
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full h-[480px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden shadow-inner">
            
            {/* Background Grid Lines & Regional Shading */}
            <svg
              className="w-full h-full"
              viewBox="0 0 800 520"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                {/* Radial Glows for Status */}
                <radialGradient id="greenGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="yellowGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="redGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>

                {/* Animated dash pattern */}
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>

              {/* Grid Background */}
              <g stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4">
                {Array.from({ length: 16 }).map((_, i) => (
                  <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="520" />
                ))}
                {Array.from({ length: 11 }).map((_, i) => (
                  <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
                ))}
              </g>

              {/* Coastline Graphic (Bay of Bengal / Eastern Coast) */}
              <path
                d="M 680,0 Q 710,120 730,220 T 750,380 T 780,520 L 800,520 L 800,0 Z"
                fill="#0f172a"
                fillOpacity="0.7"
                stroke="#1e293b"
                strokeWidth="1.5"
              />
              <text x="740" y="480" fill="#334155" fontSize="11" fontFamily="monospace" transform="rotate(-90 740 480)">
                BAY OF BENGAL
              </text>

              {/* Major Roads / Arterial Corridors in Chennai & Tamil Nadu */}
              <g stroke="#1e293b" strokeWidth="2" fill="none" opacity="0.6">
                {/* GST Road */}
                <path d="M 640,110 Q 560,200 480,280 T 260,420" stroke="#334155" strokeWidth="2.5" />
                {/* OMR Tech Corridor */}
                <path d="M 670,120 Q 660,220 640,320" stroke="#334155" strokeWidth="2" />
                {/* Chennai Bypass */}
                <path d="M 610,80 Q 570,140 580,220" stroke="#334155" strokeWidth="1.5" />
                {/* NH44 to Central & South TN */}
                <path d="M 480,280 Q 380,340 320,440" stroke="#334155" strokeWidth="2" />
              </g>

              {/* Road Labels */}
              <text x="645" y="240" fill="#475569" fontSize="9" fontFamily="monospace" transform="rotate(80 645 240)">
                OMR IT CORRIDOR
              </text>
              <text x="510" y="230" fill="#475569" fontSize="9" fontFamily="monospace" transform="rotate(-40 510 230)">
                GST ROAD (NH 32)
              </text>
              <text x="360" y="380" fill="#475569" fontSize="9" fontFamily="monospace">
                SOUTH TN EXPRESSWAY
              </text>

              {/* Transit Team Route Lines to Critical ATMs */}
              {showTransitRoutes &&
                refillTeams.map(team => {
                  if (team.currentStatus === 'IDLE') return null;
                  const assignedAtm = atms.find(a => a.id === team.assignedAtmId);
                  if (!assignedAtm) return null;

                  const start = getCanvasCoords(team.currentLocation.lat, team.currentLocation.lng);
                  const end = getCanvasCoords(assignedAtm.coordinates.lat, assignedAtm.coordinates.lng);

                  return (
                    <g key={`route-${team.id}`}>
                      {/* Glow path */}
                      <line
                        x1={start.x}
                        y1={start.y}
                        x2={end.x}
                        y2={end.y}
                        stroke="url(#routeGradient)"
                        strokeWidth="3"
                        strokeDasharray="6 4"
                        strokeLinecap="round"
                        className="animate-pulse"
                      />
                      {/* Dispatch label */}
                      <rect
                        x={(start.x + end.x) / 2 - 40}
                        y={(start.y + end.y) / 2 - 12}
                        width="80"
                        height="18"
                        rx="4"
                        fill="#090d16"
                        stroke="#ef4444"
                        strokeWidth="0.8"
                      />
                      <text
                        x={(start.x + end.x) / 2}
                        y={(start.y + end.y) / 2 + 1}
                        fill="#f87171"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        VAN EN ROUTE
                      </text>
                    </g>
                  );
                })}

              {/* User Live GPS Marker & Navigation Path */}
              {userLocation.active && userLocation.nearestAtm && (() => {
                const userPos = getCanvasCoords(userLocation.lat, userLocation.lng);
                const targetPos = getCanvasCoords(
                  userLocation.nearestAtm.coordinates.lat,
                  userLocation.nearestAtm.coordinates.lng
                );

                return (
                  <g key="user-gps-layer">
                    {/* Pulsing GPS Beam to Nearest ATM */}
                    <line
                      x1={userPos.x}
                      y1={userPos.y}
                      x2={targetPos.x}
                      y2={targetPos.y}
                      stroke="#06b6d4"
                      strokeWidth="3.5"
                      strokeDasharray="8 4"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />

                    {/* GPS Distance Badge */}
                    <g transform={`translate(${(userPos.x + targetPos.x) / 2}, ${(userPos.y + targetPos.y) / 2})`}>
                      <rect
                        x="-48"
                        y="-12"
                        width="96"
                        height="22"
                        rx="6"
                        fill="#083344"
                        stroke="#06b6d4"
                        strokeWidth="1.2"
                      />
                      <text
                        x="0"
                        y="2"
                        fill="#22d3ee"
                        fontSize="10"
                        fontWeight="extrabold"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        📍 {userLocation.distanceKm} km AWAY
                      </text>
                    </g>

                    {/* User Marker Pulsing Pulse */}
                    <g transform={`translate(${userPos.x}, ${userPos.y})`}>
                      <circle r="22" fill="#06b6d4" fillOpacity="0.25" className="animate-ping" />
                      <circle r="14" fill="#0891b2" stroke="#22d3ee" strokeWidth="2.5" />
                      <circle r="5" fill="#ffffff" />
                      <g transform="translate(0, 24)">
                        <rect
                          x="-55"
                          y="-6"
                          width="110"
                          height="16"
                          rx="4"
                          fill="#0f172a"
                          stroke="#22d3ee"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="5"
                          fill="#67e8f9"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          📍 YOU ARE HERE (GPS)
                        </text>
                      </g>
                    </g>
                  </g>
                );
              })()}

              {/* Transit Vans Position */}
              {refillTeams.map(team => {
                const pos = getCanvasCoords(team.currentLocation.lat, team.currentLocation.lng);
                return (
                  <g key={`team-marker-${team.id}`} transform={`translate(${pos.x}, ${pos.y})`}>
                    <circle r="14" fill="#1e3a8a" fillOpacity="0.5" className="animate-ping" />
                    <circle r="12" fill="#2563eb" stroke="#60a5fa" strokeWidth="2" />
                    <text y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                      🚐
                    </text>
                    <text y="24" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {team.name}
                    </text>
                  </g>
                );
              })}

              {/* ATM Markers */}
              {filteredAtms.map(atm => {
                const pos = getCanvasCoords(atm.coordinates.lat, atm.coordinates.lng);
                const category = getAtmStatusCategory(atm.cashLevel);
                const isSelected = selectedMapAtm?.id === atm.id;
                const isZero = atm.cashLevel === 0;

                let markerColor = '#10b981'; // green
                let glowColor = 'url(#greenGlow)';
                if (category === 'CRITICAL') {
                  markerColor = '#ef4444'; // red
                  glowColor = 'url(#redGlow)';
                } else if (category === 'WARNING') {
                  markerColor = '#f59e0b'; // yellow
                  glowColor = 'url(#yellowGlow)';
                }

                return (
                  <g
                    key={atm.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => handleMarkerClick(atm)}
                  >
                    {/* Critical Alarm Pulsing Rings */}
                    {category === 'CRITICAL' && (
                      <>
                        <circle r="28" fill="#ef4444" fillOpacity="0.2" className="animate-ping" />
                        <circle r="20" fill="#ef4444" fillOpacity="0.3" className="animate-pulse" />
                      </>
                    )}

                    {/* Selected Halo */}
                    {isSelected && (
                      <circle r="22" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeDasharray="3 3" />
                    )}

                    {/* Outer Glow */}
                    <circle r="14" fill={glowColor} />

                    {/* Marker Base Circle */}
                    <circle
                      r="12"
                      fill={markerColor}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="shadow-lg"
                    />

                    {/* Marker Center Icon / Text */}
                    <text
                      y="4"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {isZero ? '0' : `${atm.cashLevel}%`}
                    </text>

                    {/* ATM ID / Location Label */}
                    <g transform="translate(0, -18)">
                      <rect
                        x="-38"
                        y="-14"
                        width="76"
                        height="16"
                        rx="4"
                        fill={category === 'CRITICAL' ? '#450a0a' : '#0f172a'}
                        stroke={markerColor}
                        strokeWidth="1"
                        fillOpacity="0.95"
                      />
                      <text
                        x="0"
                        y="-3"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {atm.id} • {atm.cashLevel}%
                      </text>
                    </g>

                    {/* Zero Cash / Cash Not Available Banner on Marker */}
                    {isZero && (
                      <g transform="translate(0, 24)">
                        <rect
                          x="-50"
                          y="-6"
                          width="100"
                          height="14"
                          rx="3"
                          fill="#7f1d1d"
                          stroke="#ef4444"
                          strokeWidth="0.8"
                        />
                        <text
                          x="0"
                          y="4"
                          fill="#fecaca"
                          fontSize="8"
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          CASH NOT AVAILABLE
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-900/95 border border-slate-800 rounded-xl p-3 backdrop-blur-md shadow-xl text-xs space-y-1.5 z-10">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                {language === 'ta' ? 'வரைபட குறியீடுகள்' : 'Map Legend & Status Thresholds'}
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                <span className="text-slate-300 font-medium">🟢 70% – 100%: Normal Cash</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50"></span>
                <span className="text-slate-300 font-medium">🟡 30% – 69%: Warning (Low Cash)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500/50"></span>
                <span className="text-red-400 font-bold">🔴 0% – 29%: Critical (Alarm Siren)</span>
              </div>
              <div className="flex items-center space-x-2 pt-1 border-t border-slate-800">
                <span className="text-xs">🚐</span>
                <span className="text-blue-300 font-medium">Armored CIT Refill Transit Van</span>
              </div>
            </div>

            {/* Quick Chennai Metro Focus Chip */}
            <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 backdrop-blur-md text-[11px] font-mono text-slate-300 flex items-center space-x-2 z-10">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span>Chennai Metro Fleet & TN Hubs</span>
            </div>
          </div>

          {/* Quick Step Simulation Row */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider">
              {language === 'ta' ? 'சோதனை நிலைகள் (Quick Sim):' : 'Demo Presets (Selected ATM):'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => selectedMapAtm && updateAtmCashLevel(selectedMapAtm.id, 100)}
                className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold hover:bg-emerald-900 transition cursor-pointer"
              >
                100% Full
              </button>
              <button
                onClick={() => selectedMapAtm && updateAtmCashLevel(selectedMapAtm.id, 70)}
                className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold hover:bg-emerald-900 transition cursor-pointer"
              >
                70% Normal
              </button>
              <button
                onClick={() => selectedMapAtm && updateAtmCashLevel(selectedMapAtm.id, 50)}
                className="px-2.5 py-1 rounded-lg bg-amber-950 border border-amber-500/40 text-amber-300 font-bold hover:bg-amber-900 transition cursor-pointer"
              >
                50% Warning
              </button>
              <button
                onClick={() => selectedMapAtm && updateAtmCashLevel(selectedMapAtm.id, 30)}
                className="px-2.5 py-1 rounded-lg bg-amber-950 border border-amber-500/40 text-amber-300 font-bold hover:bg-amber-900 transition cursor-pointer"
              >
                30% Threshold
              </button>
              <button
                onClick={() => selectedMapAtm && updateAtmCashLevel(selectedMapAtm.id, 20)}
                className="px-2.5 py-1 rounded-lg bg-red-950 border border-red-500/50 text-red-300 font-bold hover:bg-red-900 transition cursor-pointer animate-pulse"
              >
                20% Alarm
              </button>
              <button
                onClick={() => selectedMapAtm && updateAtmCashLevel(selectedMapAtm.id, 10)}
                className="px-2.5 py-1 rounded-lg bg-red-950 border border-red-500/60 text-red-400 font-bold hover:bg-red-900 transition cursor-pointer animate-pulse"
              >
                10% Critical
              </button>
              <button
                onClick={() => selectedMapAtm && updateAtmCashLevel(selectedMapAtm.id, 0)}
                className="px-2.5 py-1 rounded-lg bg-red-900 border border-red-400 text-white font-extrabold hover:bg-red-800 transition cursor-pointer"
                title="Trigger Cash Not Available"
              >
                0% (Cash Not Available)
              </button>
            </div>
          </div>

        </div>

        {/* DETAILS SIDE PANEL (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {selectedMapAtm ? (
            <div className={`rounded-3xl border p-5 backdrop-blur-md shadow-2xl transition space-y-5 ${
              selectedMapAtm.cashLevel < 30
                ? 'bg-red-950/30 border-red-500/80 shadow-red-950/50 ring-1 ring-red-500/40'
                : selectedMapAtm.cashLevel < 70
                ? 'bg-amber-950/20 border-amber-500/50'
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {selectedMapAtm.id}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedMapAtm.branchCode}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">
                    {selectedMapAtm.name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{selectedMapAtm.location}</span>
                  </p>
                </div>

                {/* Status Badge */}
                <div className="text-right">
                  <div className={`text-3xl font-black font-mono tracking-tight ${
                    selectedMapAtm.cashLevel < 30 ? 'text-red-500 animate-pulse' : selectedMapAtm.cashLevel < 70 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {selectedMapAtm.cashLevel}%
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    selectedMapAtm.cashLevel < 30
                      ? 'bg-red-600 text-white animate-pulse'
                      : selectedMapAtm.cashLevel < 70
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {selectedMapAtm.cashLevel < 30 ? 'CRITICAL' : selectedMapAtm.cashLevel < 70 ? 'WARNING' : 'NORMAL'}
                  </span>
                </div>
              </div>

              {/* Facility Details & Branch Capabilities Badge Card */}
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 flex items-center space-x-1.5">
                    {selectedMapAtm.facilityType === 'BANK_BRANCH' ? (
                      <span className="text-emerald-400 font-extrabold flex items-center space-x-1">
                        <Landmark className="w-3.5 h-3.5" />
                        <span>🏦 {language === 'ta' ? 'வங்கிக் கிளை & பணப் பெட்டகம்' : 'Bank Branch & Vault'}</span>
                      </span>
                    ) : selectedMapAtm.facilityType === 'CDM_RECYCLER' || selectedMapAtm.hasCashDeposit ? (
                      <span className="text-purple-400 font-extrabold flex items-center space-x-1">
                        <ArrowDownUp className="w-3.5 h-3.5" />
                        <span>💵 {language === 'ta' ? 'பணம் வைப்பு & எடுப்பு எந்திரம் (CDM)' : 'Cash Deposit Machine (CDM)'}</span>
                      </span>
                    ) : (
                      <span className="text-cyan-400 font-extrabold flex items-center space-x-1">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>🏧 {language === 'ta' ? '24/7 கார்டு மூலம் பணம் எடுக்கும் ஏடிஎம்' : '24/7 Card Cash ATM Machine'}</span>
                      </span>
                    )}
                  </span>
                  {selectedMapAtm.hasCashDeposit && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                      ✅ CDM DEPOSIT
                    </span>
                  )}
                </div>

                {selectedMapAtm.branchTiming && (
                  <p className="text-[11px] text-slate-300 flex items-center space-x-1.5 font-mono">
                    <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{selectedMapAtm.branchTiming}</span>
                  </p>
                )}

                {selectedMapAtm.servicesOffered && selectedMapAtm.servicesOffered.length > 0 && (
                  <div className="pt-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {language === 'ta' ? 'கிடைக்கும் சேவைகள்:' : 'Available Services:'}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedMapAtm.servicesOffered.map((service, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono">
                          • {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cash Not Available Banner if 0% */}
              {selectedMapAtm.cashLevel === 0 && (
                <div className="bg-red-900/80 border-2 border-red-500 p-3 rounded-2xl text-center space-y-1 animate-pulse">
                  <div className="text-xs font-black text-white uppercase tracking-wider">
                    ⚠️ CASH NOT AVAILABLE
                  </div>
                  <div className="text-[11px] text-red-200">
                    தற்காலிகமாக பணம் இருப்பு இல்லை. Customers receive &ldquo;Cash Not Available&rdquo; on ATM screen.
                  </div>
                </div>
              )}

              {/* Cash Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">{language === 'ta' ? 'மீதமுள்ள பணம்:' : 'Available Cash:'}</span>
                  <span className="font-bold text-white font-mono">
                    ₹{(selectedMapAtm.cashAmount ?? 0).toLocaleString('en-IN')} / ₹{((selectedMapAtm.cashCapacity ?? 0) / 100000).toFixed(0)}L
                  </span>
                </div>
                <div className="h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedMapAtm.cashLevel < 30
                        ? 'bg-gradient-to-r from-red-600 to-rose-500 animate-pulse'
                        : selectedMapAtm.cashLevel < 70
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${selectedMapAtm.cashLevel}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>0% (Empty)</span>
                  <span className="text-red-400 font-bold">▲ 30% Critical Line</span>
                  <span>100% (Full)</span>
                </div>
              </div>

              {/* AI Cash Exhaustion Predictor Timer Widget */}
              <div className="p-3 bg-slate-950/90 rounded-2xl border border-slate-800 text-xs font-mono space-y-1.5">
                <div className="flex items-center justify-between text-cyan-400 font-bold">
                  <span className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>AI CASH EXHAUSTION TIMER:</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">GEMINI AI</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans">
                  {selectedMapAtm.cashLevel === 0 ? (
                    <span className="text-red-400 font-bold">🔴 0 Hours (Cash Completely Depleted)</span>
                  ) : (
                    <span>
                      {language === 'ta' ? 'பணம் தீர மீதமுள்ள நேரம்:' : 'Est. time before cash depletion:'}{' '}
                      <strong className="text-amber-300 font-mono font-black">
                        ~{Math.floor((selectedMapAtm.cashLevel * 0.12))}h {Math.floor((selectedMapAtm.cashLevel * 7) % 60)}m
                      </strong>
                    </span>
                  )}
                </p>
              </div>

              {/* Live GPS Distance Widget */}
              {userLocation.active && (
                <div className="p-3 bg-cyan-950/50 rounded-2xl border border-cyan-500/40 text-xs font-mono space-y-1">
                  <div className="flex justify-between items-center text-cyan-300 font-bold">
                    <span>📍 LIVE GPS DISTANCE:</span>
                    <span className="text-white font-extrabold text-sm">
                      {calculateDistance(userLocation.lat, userLocation.lng, selectedMapAtm.coordinates.lat, selectedMapAtm.coordinates.lng)} km
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-300 font-sans">
                    <span>🚗 Drive Time: ~{Math.ceil(calculateDistance(userLocation.lat, userLocation.lng, selectedMapAtm.coordinates.lat, selectedMapAtm.coordinates.lng) * 3)} mins</span>
                    <span>🚶 Walk: ~{Math.ceil(calculateDistance(userLocation.lat, userLocation.lng, selectedMapAtm.coordinates.lat, selectedMapAtm.coordinates.lng) * 12)} mins</span>
                  </div>
                </div>
              )}

              {/* AI Prediction Box */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-blue-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Depletion Prediction</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {selectedMapAtm.cashLevel < 30
                    ? `🚨 AI Prediction: ${selectedMapAtm.id} is in critical state (${selectedMapAtm.cashLevel}%). May run completely dry in ${selectedMapAtm.predictedDepletionHours}h. Recommended refill: IMMEDIATE.`
                    : `🤖 AI Prediction: ${selectedMapAtm.id} may reach critical cash level within ${selectedMapAtm.predictedDepletionHours} hours. Recommended refill: Before ${selectedMapAtm.recommendedRefillTime}.`}
                </p>
                <div className="flex justify-between text-[11px] pt-2 border-t border-slate-700/60 font-mono">
                  <span className="text-slate-400">Zero Depletion ETA:</span>
                  <span className="text-amber-400 font-bold">{selectedMapAtm.predictedDepletionTime}</span>
                </div>
              </div>

              {/* Live Sensors Grid */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                  Sensor Telemetry Status
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Ultrasonic Sensor</span>
                    <span className="text-emerald-400 font-bold font-mono">ONLINE</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Weight Sensor</span>
                    <span className="text-white font-bold font-mono">
                      {(selectedMapAtm.cashAmount / 100000).toFixed(1)} kg
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Network Ping</span>
                    <span className="text-blue-400 font-bold font-mono">{selectedMapAtm.networkPing} ms</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Vault Temp</span>
                    <span className="text-slate-200 font-bold font-mono">
                      {selectedMapAtm.securityStatus.vaultTempCelsius}°C
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => simulateDropBelow30(selectedMapAtm.id, 24)}
                    className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Drop &lt;30%</span>
                  </button>

                  <button
                    onClick={() => refillAtm(selectedMapAtm.id)}
                    className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Refill 100%</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (idleTeam) {
                      dispatchRefillTeam(idleTeam.id, selectedMapAtm.id);
                    }
                    navigateTo('REFILL_TEAMS');
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>{language === 'ta' ? 'பாதுகாப்பு வேனை அனுப்ப' : 'Dispatch Armored Transit Van'}</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
              <MapPin className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs">Click on any ATM marker on the map to inspect live cash telemetry.</p>
            </div>
          )}

          {/* Quick Navigation to Customer ATM Terminal Screen */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white block">Customer ATM Screen</span>
              <span className="text-slate-400 text-[11px]">View &ldquo;Cash Not Available&rdquo; display test</span>
            </div>
            <button
              onClick={() => navigateTo('WELCOME')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 font-bold border border-slate-700 transition cursor-pointer"
            >
              Open Terminal
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
