import React, { useState } from 'react';
import {
  MapPin,
  Landmark,
  CreditCard,
  ArrowDownUp,
  Clock,
  Navigation,
  Crosshair,
  Search,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Sparkles,
  ChevronRight,
  ExternalLink,
  QrCode,
  Ticket,
  X,
  Car,
  Volume2,
  Share2
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { ATM } from '../types';

export const NearbyBranchesView: React.FC = () => {
  const {
    atms,
    language,
    selectedAtm,
    setSelectedAtm,
    navigateTo,
    speakGuidance
  } = useSecurity();

  // Filters
  const [facilityFilter, setFacilityFilter] = useState<'ALL' | 'BANK_BRANCH' | 'CDM_RECYCLER' | 'ATM'>('ALL');
  const [radiusFilter, setRadiusFilter] = useState<number>(10); // in KM
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<ATM | null>(selectedAtm || atms[0]);

  // Token Queue Modal State
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false);
  const [tokenInfo, setTokenInfo] = useState<{
    tokenNo: string;
    counterNo: string;
    estimatedWait: string;
    branchName: string;
  } | null>(null);

  // Live GPS State
  const [userGps, setUserGps] = useState<{
    lat: number;
    lng: number;
    active: boolean;
    loading: boolean;
    locationName: string;
  }>({
    lat: 13.0827,
    lng: 80.2707,
    active: true,
    loading: false,
    locationName: 'Anna Nagar Metro Station, Chennai'
  });

  // Calculate Distance (Haversine formula in KM)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in KM
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  };

  // Detect Live User GPS
  const handleDetectLiveGps = () => {
    setUserGps(prev => ({ ...prev, loading: true }));

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserGps({
            lat,
            lng,
            active: true,
            loading: false,
            locationName: 'Live GPS Location'
          });
        },
        () => {
          // Fallback to default Chennai location
          setUserGps({
            lat: 13.0827,
            lng: 80.2707,
            active: true,
            loading: false,
            locationName: 'Chennai Metro Central (Default)'
          });
        },
        { timeout: 8000 }
      );
    } else {
      setUserGps(prev => ({ ...prev, active: true, loading: false }));
    }
  };

  // Map coordinate transformation for SVG display
  const getCanvasCoords = (lat: number, lng: number) => {
    const minLat = 12.80;
    const maxLat = 13.20;
    const minLng = 80.10;
    const maxLng = 80.32;

    const x = Math.min(Math.max(((lng - minLng) / (maxLng - minLng)) * 600, 40), 560);
    const y = Math.min(Math.max((1 - (lat - minLat) / (maxLat - minLat)) * 340, 40), 300);

    return { x, y };
  };

  // Filtered branches
  const filteredBranches = atms.filter(atm => {
    const dist = calculateDistance(userGps.lat, userGps.lng, atm.coordinates.lat, atm.coordinates.lng);
    const matchesRadius = dist <= radiusFilter;

    const matchesSearch =
      atm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atm.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atm.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atm.pincode.includes(searchTerm);

    let matchesType = true;
    if (facilityFilter === 'BANK_BRANCH') {
      matchesType = atm.facilityType === 'BANK_BRANCH';
    } else if (facilityFilter === 'CDM_RECYCLER') {
      matchesType = atm.facilityType === 'CDM_RECYCLER' || !!atm.hasCashDeposit;
    } else if (facilityFilter === 'ATM') {
      matchesType = !atm.facilityType || atm.facilityType === 'ATM';
    }

    return matchesRadius && matchesSearch && matchesType;
  });

  // Handle Token Generation
  const handleBookToken = (branch: ATM) => {
    const tokenNo = `B-${Math.floor(10 + Math.random() * 89)}`;
    const counterNo = `Counter #${Math.floor(1 + Math.random() * 5)}`;
    const estimatedWait = `${Math.floor(3 + Math.random() * 8)} Mins`;

    setTokenInfo({
      tokenNo,
      counterNo,
      estimatedWait,
      branchName: branch.name
    });
    setShowTokenModal(true);
    speakGuidance('ACCESS_GRANTED');
  };

  const branchCount = atms.filter(a => a.facilityType === 'BANK_BRANCH').length;
  const cdmCount = atms.filter(a => a.facilityType === 'CDM_RECYCLER' || a.hasCashDeposit).length;
  const atmCount = atms.filter(a => !a.facilityType || a.facilityType === 'ATM').length;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
              <Landmark className="w-4 h-4 text-cyan-400" />
              <span>{language === 'ta' ? 'அருகிலுள்ள வங்கி & ஏடிஎம் மையங்கள்' : 'Geospatial Branch & ATM Locator'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {language === 'ta' ? '🏦 உங்கள் இருப்பிடத்திற்கு அருகிலுள்ள வங்கிக் கிளைகள்' : '🏦 Nearby Bank Branches & Cash Hubs'}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              {language === 'ta'
                ? 'உங்கள் பகுதியிலுள்ள வங்கிக் கிளைகள், 24/7 பணம் வைப்பு எந்திரங்கள் (CDM) மற்றும் ஏடிஎம்களை நேரலை வரைபடத்தில் பார்த்து திசையறியலாம்.'
                : 'Locate nearest bank branches, cash deposit machines (CDM), locker vaults, and 24/7 ATMs with live GPS distance, status & token queue booking.'}
            </p>
          </div>

          {/* GPS Live Button */}
          <button
            onClick={handleDetectLiveGps}
            disabled={userGps.loading}
            className="self-start md:self-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm transition cursor-pointer shadow-lg shadow-emerald-950 flex items-center space-x-2 border border-emerald-400/50"
          >
            <Crosshair className={`w-4 h-4 ${userGps.loading ? 'animate-spin text-amber-300' : 'text-emerald-200'}`} />
            <span>
              {userGps.loading
                ? (language === 'ta' ? 'GPS தேடப்படுகிறது...' : 'Locating GPS...')
                : (language === 'ta' ? '📍 நேரலை GPS இடம் அறி (Detect GPS)' : '📍 Update My Live GPS')}
            </span>
          </button>
        </div>
      </div>

      {/* Interactive Search & Filter Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Bar */}
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'ta' ? 'பகுதி அல்லது பின்கோடு தட்டச்சு செய்க (எ.கா: Anna Nagar, T.Nagar)...' : 'Search area, landmark or pincode (e.g. Anna Nagar, OMR, 600017)...'}
              className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none transition font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Radius Selector */}
          <div className="md:col-span-3">
            <select
              value={radiusFilter}
              onChange={(e) => setRadiusFilter(Number(e.target.value))}
              className="w-full py-3 px-4 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-2xl text-sm text-slate-200 font-mono font-bold focus:outline-none transition cursor-pointer"
            >
              <option value={2}>📍 Radius: Within 2 KM</option>
              <option value={5}>📍 Radius: Within 5 KM</option>
              <option value={10}>📍 Radius: Within 10 KM</option>
              <option value={25}>📍 Radius: Within 25 KM</option>
            </select>
          </div>

          {/* Results Counter Pill */}
          <div className="md:col-span-3 flex items-center justify-end px-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs font-mono">
            <span className="text-slate-400 mr-2">{language === 'ta' ? 'கிடைத்த மையங்கள்:' : 'Found:'}</span>
            <span className="text-cyan-400 font-extrabold text-base">{filteredBranches.length}</span>
            <span className="text-slate-500 ml-1">/ {atms.length}</span>
          </div>
        </div>

        {/* Facility Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setFacilityFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer border ${
              facilityFilter === 'ALL'
                ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-900/50'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-600'
            }`}
          >
            <span>🌐 {language === 'ta' ? 'அனைத்தும்' : 'All Facilities'}</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-[10px] font-mono">{atms.length}</span>
          </button>

          <button
            onClick={() => setFacilityFilter('BANK_BRANCH')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer border ${
              facilityFilter === 'BANK_BRANCH'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-900/50'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-emerald-500/50'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-emerald-300" />
            <span>🏦 {language === 'ta' ? 'வங்கிக் கிளைகள் (Bank Branches)' : 'Bank Branches & Vaults'}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-200 border border-emerald-700 text-[10px] font-mono">{branchCount}</span>
          </button>

          <button
            onClick={() => setFacilityFilter('CDM_RECYCLER')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer border ${
              facilityFilter === 'CDM_RECYCLER'
                ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-900/50'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-purple-500/50'
            }`}
          >
            <ArrowDownUp className="w-3.5 h-3.5 text-purple-300" />
            <span>💵 {language === 'ta' ? 'பணம் வைப்பு எந்திரங்கள் (CDM)' : 'Cash Deposit Machines (CDM)'}</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-200 border border-purple-700 text-[10px] font-mono">{cdmCount}</span>
          </button>

          <button
            onClick={() => setFacilityFilter('ATM')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer border ${
              facilityFilter === 'ATM'
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-900/50'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-cyan-500/50'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-cyan-300" />
            <span>🏧 {language === 'ta' ? '24/7 கார்டு ஏடிஎம் (ATMs)' : '24/7 Card Cash ATMs'}</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-200 border border-cyan-700 text-[10px] font-mono">{atmCount}</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid: Interactive Map + Branch Cards Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Geospatial Map Component (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 relative flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400">
              <MapPin className="w-4 h-4 text-cyan-400 animate-bounce" />
              <span>GEOSPATIAL LIVE MAP (CHENNAI METRO)</span>
            </div>

            {selectedBranch && (
              <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 border border-emerald-700/60 px-2.5 py-1 rounded-full">
                Selected: {selectedBranch.name.substring(0, 22)}...
              </span>
            )}
          </div>

          {/* SVG Canvas Map */}
          <div className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl overflow-hidden relative shadow-inner min-h-[360px] flex items-center justify-center">
            <svg viewBox="0 0 600 360" className="w-full h-full">
              {/* Map Grid Lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="600" height="360" fill="url(#grid)" />

              {/* Bay of Bengal Coastline Feature */}
              <path
                d="M 520 0 Q 510 180 540 360 L 600 360 L 600 0 Z"
                fill="#0284c7"
                fillOpacity="0.15"
                stroke="#0369a1"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text x="560" y="180" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace" transform="rotate(90 560 180)">
                BAY OF BENGAL
              </text>

              {/* Major Roads Lines */}
              <path d="M 40 180 Q 200 160 520 170" fill="none" stroke="#334155" strokeWidth="3" strokeDasharray="6 3" />
              <path d="M 220 20 Q 250 180 280 340" fill="none" stroke="#334155" strokeWidth="3" strokeDasharray="6 3" />

              {/* User Live Location Marker */}
              {userGps.active && (() => {
                const userPos = getCanvasCoords(userGps.lat, userGps.lng);
                return (
                  <g key="user-marker">
                    <circle cx={userPos.x} cy={userPos.y} r="20" fill="#06b6d4" fillOpacity="0.2" className="animate-ping" />
                    <circle cx={userPos.x} cy={userPos.y} r="12" fill="#0891b2" stroke="#22d3ee" strokeWidth="2.5" />
                    <circle cx={userPos.x} cy={userPos.y} r="4" fill="#ffffff" />
                    <text x={userPos.x} y={userPos.y + 22} fill="#22d3ee" fontSize="9" fontWeight="extrabold" textAnchor="middle" fontFamily="monospace">
                      📍 YOU ARE HERE
                    </text>
                  </g>
                );
              })()}

              {/* Connecting Navigation Beam from User to Selected Branch */}
              {selectedBranch && userGps.active && (() => {
                const userPos = getCanvasCoords(userGps.lat, userGps.lng);
                const branchPos = getCanvasCoords(selectedBranch.coordinates.lat, selectedBranch.coordinates.lng);
                const dist = calculateDistance(userGps.lat, userGps.lng, selectedBranch.coordinates.lat, selectedBranch.coordinates.lng);

                return (
                  <g key="nav-beam">
                    <line
                      x1={userPos.x}
                      y1={userPos.y}
                      x2={branchPos.x}
                      y2={branchPos.y}
                      stroke="#22c55e"
                      strokeWidth="3"
                      strokeDasharray="6 4"
                      className="animate-pulse"
                    />
                    <g transform={`translate(${(userPos.x + branchPos.x) / 2}, ${(userPos.y + branchPos.y) / 2})`}>
                      <rect x="-42" y="-11" width="84" height="20" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                      <text x="0" y="3" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        📍 {dist} KM
                      </text>
                    </g>
                  </g>
                );
              })()}

              {/* Render Branch & ATM Pins */}
              {filteredBranches.map(branch => {
                const pos = getCanvasCoords(branch.coordinates.lat, branch.coordinates.lng);
                const isSelected = selectedBranch?.id === branch.id;
                const isBranch = branch.facilityType === 'BANK_BRANCH';
                const isCdm = branch.facilityType === 'CDM_RECYCLER' || branch.hasCashDeposit;

                return (
                  <g
                    key={branch.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelectedBranch(branch)}
                    className="cursor-pointer group"
                  >
                    {/* Ring highlight if selected */}
                    {isSelected && (
                      <circle r="22" fill="#10b981" fillOpacity="0.3" className="animate-ping" />
                    )}

                    {/* Pin Shape */}
                    <circle
                      r={isSelected ? 16 : 12}
                      fill={isBranch ? '#10b981' : isCdm ? '#a855f7' : '#06b6d4'}
                      stroke={isSelected ? '#ffffff' : '#0f172a'}
                      strokeWidth="2.5"
                      className="transition-all duration-300"
                    />

                    <text
                      x="0"
                      y="4"
                      fill="#ffffff"
                      fontSize={isSelected ? '12' : '10'}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {isBranch ? '🏦' : isCdm ? '💵' : '🏧'}
                    </text>

                    {/* Pin Label */}
                    <g transform={`translate(0, ${isSelected ? -24 : -18})`}>
                      <rect
                        x="-45"
                        y="-10"
                        width="90"
                        height="16"
                        rx="4"
                        fill={isSelected ? '#0f172a' : '#1e293b'}
                        stroke={isBranch ? '#10b981' : isCdm ? '#a855f7' : '#06b6d4'}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="1"
                        fill="#ffffff"
                        fontSize="8"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {branch.name.substring(0, 14)}..
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend & Summary Bar */}
          <div className="flex flex-wrap items-center justify-between text-xs font-mono bg-slate-950 p-3 rounded-2xl border border-slate-800 gap-2">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1 text-emerald-400">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span>🏦 Bank Branch</span>
              </span>
              <span className="flex items-center space-x-1 text-purple-400">
                <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
                <span>💵 CDM Recycler</span>
              </span>
              <span className="flex items-center space-x-1 text-cyan-400">
                <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block" />
                <span>🏧 24/7 ATM</span>
              </span>
            </div>

            <span className="text-slate-400">
              Click any pin on map to inspect details
            </span>
          </div>
        </div>

        {/* Right Cards Directory List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 max-h-[640px] overflow-y-auto pr-1">
          {filteredBranches.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">
                {language === 'ta' ? 'எந்த மையங்களும் கண்டறியப்படவில்லை' : 'No Facilities Found'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'ta' ? 'தேடல் அல்லது சுற்றளவு தொலைவை (Radius KM) மாற்றி முயற்சிக்கவும்.' : 'Try adjusting your search terms or increasing the radius distance filter.'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFacilityFilter('ALL');
                  setRadiusFilter(25);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredBranches.map(branch => {
              const dist = calculateDistance(userGps.lat, userGps.lng, branch.coordinates.lat, branch.coordinates.lng);
              const isSelected = selectedBranch?.id === branch.id;
              const isBranch = branch.facilityType === 'BANK_BRANCH';
              const isCdm = branch.facilityType === 'CDM_RECYCLER' || branch.hasCashDeposit;

              return (
                <div
                  key={branch.id}
                  onClick={() => setSelectedBranch(branch)}
                  className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-slate-900 border-2 border-emerald-500/80 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  {/* Top Badge & Distance */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {isBranch ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono text-[10px] font-extrabold uppercase">
                            <Landmark className="w-3 h-3" />
                            <span>Bank Branch & Vault</span>
                          </span>
                        ) : isCdm ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-700/60 font-mono text-[10px] font-extrabold uppercase">
                            <ArrowDownUp className="w-3 h-3" />
                            <span>CDM Cash Recycler</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-mono text-[10px] font-extrabold uppercase">
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>24/7 ATM Machine</span>
                          </span>
                        )}

                        <span className="text-[10px] font-mono text-slate-400">
                          #{branch.branchCode}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition">
                        {branch.name}
                      </h3>
                    </div>

                    {/* Distance Pill */}
                    <div className="text-right shrink-0">
                      <div className="px-3 py-1 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-black text-sm">
                        📍 {dist} km
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        ~{Math.ceil(dist * 3)} mins drive
                      </div>
                    </div>
                  </div>

                  {/* Location Address */}
                  <p className="text-xs text-slate-300 flex items-start space-x-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{branch.location}, {branch.city} - {branch.pincode}</span>
                  </p>

                  {/* Timings & Cash Level Status */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-400 block">OPERATING HOURS:</span>
                      <span className="text-slate-200 font-bold text-[11px] truncate block">
                        {branch.branchTiming || '24 Hours Open'}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-400 block">ATM CASH LEVEL:</span>
                      <span className={`font-black text-[11px] ${
                        branch.cashLevel >= 70 ? 'text-emerald-400' : branch.cashLevel >= 30 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {branch.cashLevel}% ({branch.status})
                      </span>
                    </div>
                  </div>

                  {/* Services Offered Tags */}
                  {branch.servicesOffered && (
                    <div className="flex flex-wrap gap-1">
                      {branch.servicesOffered.map((srv, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono">
                          ✓ {srv}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 pt-2">
                    {/* Directions */}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${branch.coordinates.lat},${branch.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs transition flex items-center justify-center space-x-1.5 border border-slate-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{language === 'ta' ? 'திசையறி (Directions)' : 'GPS Map Route'}</span>
                    </a>

                    {/* Book Token (If Bank Branch) */}
                    {isBranch && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookToken(branch);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-amber-600/90 hover:bg-amber-500 text-slate-950 font-black text-xs transition flex items-center space-x-1 cursor-pointer shadow-md"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? 'டோக்கன் பெறு' : 'Book Token'}</span>
                      </button>
                    )}

                    {/* Direct Withdrawal */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAtm(branch);
                        navigateTo('STEP1_FACE');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs transition flex items-center space-x-1 cursor-pointer shadow-md"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{language === 'ta' ? 'பணம் எடு' : 'Withdraw'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Digital Token Pass Modal */}
      {showTokenModal && tokenInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl shadow-amber-950">
            <button
              onClick={() => setShowTokenModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase mb-2">
              <Ticket className="w-5 h-5 text-amber-400 animate-pulse" />
              <span>{language === 'ta' ? 'டிஜிட்டல் வங்கி வரிசை டோக்கன்' : 'Digital Priority Token Pass'}</span>
            </div>

            <h3 className="text-xl font-black text-white mb-1">
              {tokenInfo.branchName}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'ta' ? 'வங்கியின் வரிசையில் நிற்காமல் நேரடியாக கவுண்டருக்குச் செல்லலாம்' : 'Skip the bank waiting queue with instant priority token:'}
            </p>

            {/* Token Ticket Badge Card */}
            <div className="my-4 p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-amber-950/60 border-2 border-amber-500/60 space-y-3 relative overflow-hidden shadow-inner">
              <div className="text-slate-400 font-mono text-xs uppercase tracking-widest">
                YOUR TOKEN NUMBER
              </div>
              <div className="text-5xl font-black text-amber-300 font-mono tracking-wider drop-shadow-md">
                {tokenInfo.tokenNo}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-amber-500/30 text-xs font-mono">
                <div className="text-left">
                  <span className="text-slate-400 text-[10px] block">ASSIGNED COUNTER:</span>
                  <span className="text-emerald-300 font-bold text-xs">{tokenInfo.counterNo}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">ESTIMATED WAIT:</span>
                  <span className="text-cyan-300 font-bold text-xs">{tokenInfo.estimatedWait}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTokenModal(false)}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg"
            >
              {language === 'ta' ? 'டோக்கனைச் சேமி (Save Token Pass)' : 'Confirm & Save Token'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
