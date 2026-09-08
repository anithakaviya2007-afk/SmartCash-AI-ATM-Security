import { ATM, RefillTeam, SecurityNotification, ManagerProfile, AIPredictionData } from '../types';

export const INITIAL_MANAGER_PROFILE: ManagerProfile = {
  id: 'MGR-7041',
  name: 'Anitha K.',
  designation: 'Chief Bank Branch Manager',
  branchCircle: 'Chennai Central Operations Circle',
  employeeId: 'BOI-CHE-9921',
  email: 'anithakaviya2007@gmail.com',
  phone: '+91 98401 23456',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  assignedZone: 'Chennai Metropolitan Fleet (Zone 1)'
};

export const INITIAL_MANAGERS: ManagerProfile[] = [
  INITIAL_MANAGER_PROFILE,
  {
    id: 'MGR-4022',
    name: 'Rajesh Ramanathan',
    designation: 'Zonal Cash Operations Lead',
    branchCircle: 'Tamil Nadu Regional Operations',
    employeeId: 'EMP-LOG-4410',
    email: 'rajesh.ops@bankguard.in',
    phone: '+91 98402 88776',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    assignedZone: 'Greater Chennai & South TN Fleet'
  },
  {
    id: 'CUST-1099',
    name: 'M. Vijay',
    designation: 'Armored CIT Transit Custodian',
    branchCircle: 'Cash Transit Wing (Fleet 01)',
    employeeId: 'VAN-TN-02',
    email: 'vijay.cit@securetransit.in',
    phone: '+91 98405 55443',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    assignedZone: 'Central & South Corridor Rapid Response'
  }
];

const BASE_ATMS: ATM[] = [
  {
    id: 'ATM-101',
    name: 'Anna Nagar Main Bank Branch & Vault',
    branchCode: 'CH-ANN-04',
    facilityType: 'BANK_BRANCH',
    hasCashDeposit: true,
    isBranchConnected: true,
    branchTiming: '10:00 AM - 04:00 PM (Mon-Sat)',
    servicesOffered: ['24/7 Cash Withdrawal', 'Instant Cash Deposit (CDM)', 'Locker Vaults', 'Personal & Business Loans', 'Forex Counter'],
    location: '2nd Avenue, Anna Nagar West, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    coordinates: { lat: 13.0850, lng: 80.2101 },
    cashLevel: 42, // Amber - will drop to 24% in demo test!
    cashAmount: 1470000,
    cashCapacity: 3500000,
    status: 'LOW_CASH',
    isOnline: true,
    lastUpdated: 'Just now (Sensor active)',
    lastRefillDate: '01 Sep 2026, 09:30 AM',
    lastMaintenanceDate: '28 Aug 2026',
    networkPing: 24,
    model: 'Diebold Nixdorf ProCash 8100',
    cassettes: {
      d2000: { denomination: 2000, notesCount: 120, maxNotes: 500, amount: 240000 },
      d500: { denomination: 500, notesCount: 1800, maxNotes: 3000, amount: 900000 },
      d200: { denomination: 200, notesCount: 950, maxNotes: 2500, amount: 190000 },
      d100: { denomination: 100, notesCount: 1400, maxNotes: 3000, amount: 140000 }
    },
    dailyWithdrawalAvg: 1850000,
    currentHourlyDrainRate: 98000,
    predictedDepletionHours: 4.8,
    predictedDepletionTime: '02:30 PM',
    recommendedRefillTime: '01:00 PM',
    assignedTeamId: null,
    securityStatus: {
      cameraOnline: true,
      doorSensor: 'LOCKED',
      vibrationLevel: 'NORMAL',
      antiSkimming: 'ACTIVE',
      vaultTempCelsius: 22.4,
      powerSource: 'MAINS_AC'
    },
    recentTransactions: [
      { id: 'TXN-901', timestamp: '10:24 AM', type: 'WITHDRAWAL', amount: 5000, accountMasked: '****4412', status: 'SUCCESS' },
      { id: 'TXN-902', timestamp: '10:18 AM', type: 'WITHDRAWAL', amount: 10000, accountMasked: '****8890', status: 'SUCCESS' },
      { id: 'TXN-903', timestamp: '10:05 AM', type: 'WITHDRAWAL', amount: 2500, accountMasked: '****3120', status: 'SUCCESS' }
    ],
    alertHistory: [
      { id: 'ALT-101-1', timestamp: '31 Aug 2026, 04:15 PM', type: 'LOW_CASH', severity: 'MEDIUM', message: 'Cash dropped to 35%', resolved: true }
    ]
  },
  {
    id: 'ATM-102',
    name: 'T. Nagar Commercial CDM & Recycler',
    branchCode: 'CH-TNG-12',
    facilityType: 'CDM_RECYCLER',
    hasCashDeposit: true,
    isBranchConnected: true,
    branchTiming: '24 Hours Instant Cash Deposit & Withdrawal',
    servicesOffered: ['24/7 Bulk Cash Deposit', 'Cash Withdrawal', 'Cheque Deposit Machine', 'Passbook Printing'],
    location: 'Ranganathan Street Junction, T. Nagar, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600017',
    coordinates: { lat: 13.0405, lng: 80.2337 },
    cashLevel: 26, // CRITICAL: < 30%! Siren triggers!
    cashAmount: 910000,
    cashCapacity: 3500000,
    status: 'CRITICAL',
    isOnline: true,
    lastUpdated: '1 min ago (Live sensor telemetry)',
    lastRefillDate: '31 Aug 2026, 04:00 PM',
    lastMaintenanceDate: '25 Aug 2026',
    networkPing: 32,
    model: 'NCR SelfServ 84 Walk-Up',
    cassettes: {
      d2000: { denomination: 2000, notesCount: 40, maxNotes: 500, amount: 80000 },
      d500: { denomination: 500, notesCount: 1100, maxNotes: 3000, amount: 550000 },
      d200: { denomination: 200, notesCount: 750, maxNotes: 2500, amount: 150000 },
      d100: { denomination: 100, notesCount: 1300, maxNotes: 3000, amount: 130000 }
    },
    dailyWithdrawalAvg: 2600000,
    currentHourlyDrainRate: 145000,
    predictedDepletionHours: 1.8,
    predictedDepletionTime: '11:45 AM',
    recommendedRefillTime: 'IMMEDIATE',
    assignedTeamId: 'TEAM-01',
    securityStatus: {
      cameraOnline: true,
      doorSensor: 'LOCKED',
      vibrationLevel: 'NORMAL',
      antiSkimming: 'ACTIVE',
      vaultTempCelsius: 23.8,
      powerSource: 'MAINS_AC'
    },
    recentTransactions: [
      { id: 'TXN-911', timestamp: '10:28 AM', type: 'WITHDRAWAL', amount: 10000, accountMasked: '****5521', status: 'SUCCESS' },
      { id: 'TXN-912', timestamp: '10:25 AM', type: 'WITHDRAWAL', amount: 8000, accountMasked: '****9934', status: 'SUCCESS' },
      { id: 'TXN-913', timestamp: '10:21 AM', type: 'WITHDRAWAL', amount: 15000, accountMasked: '****1092', status: 'SUCCESS' }
    ],
    alertHistory: [
      { id: 'ALT-102-1', timestamp: '10:15 AM', type: 'CRITICAL_CASH', severity: 'CRITICAL', message: 'CRITICAL: Cash level dropped below 30% (26%). Alarm siren dispatched.', resolved: false }
    ]
  },
  {
    id: 'ATM-103',
    name: 'OMR IT Corridor Main Bank Branch & Vault',
    branchCode: 'CH-OMR-08',
    facilityType: 'BANK_BRANCH',
    hasCashDeposit: true,
    isBranchConnected: true,
    branchTiming: '10:00 AM - 04:00 PM (Mon-Sat)',
    servicesOffered: ['24/7 ATM/CDM Vault', 'Business Banking', 'Foreign Exchange Counter', 'Wealth Management'],
    location: 'Rajiv Gandhi Salai, Thoraipakkam, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600097',
    coordinates: { lat: 12.9372, lng: 80.2335 },
    cashLevel: 86,
    cashAmount: 3440000,
    cashCapacity: 4000000,
    status: 'NORMAL',
    isOnline: true,
    lastUpdated: '2 mins ago',
    lastRefillDate: '02 Sep 2026, 06:00 AM',
    lastMaintenanceDate: '20 Aug 2026',
    networkPing: 18,
    model: 'Hyosung MoniMax 7600T',
    cassettes: {
      d2000: { denomination: 2000, notesCount: 300, maxNotes: 500, amount: 600000 },
      d500: { denomination: 500, notesCount: 4200, maxNotes: 5000, amount: 2100000 },
      d200: { denomination: 200, notesCount: 2200, maxNotes: 3000, amount: 440000 },
      d100: { denomination: 100, notesCount: 3000, maxNotes: 3500, amount: 300000 }
    },
    dailyWithdrawalAvg: 2100000,
    currentHourlyDrainRate: 85000,
    predictedDepletionHours: 24.5,
    predictedDepletionTime: 'Tomorrow 10:30 AM',
    recommendedRefillTime: 'Tomorrow 08:00 AM',
    assignedTeamId: null,
    securityStatus: {
      cameraOnline: true,
      doorSensor: 'LOCKED',
      vibrationLevel: 'NORMAL',
      antiSkimming: 'ACTIVE',
      vaultTempCelsius: 21.2,
      powerSource: 'MAINS_AC'
    },
    recentTransactions: [
      { id: 'TXN-921', timestamp: '10:20 AM', type: 'WITHDRAWAL', amount: 4000, accountMasked: '****6701', status: 'SUCCESS' }
    ],
    alertHistory: []
  },
  {
    id: 'ATM-104',
    name: 'Tambaram Rly Station Junction',
    branchCode: 'CH-TAM-02',
    location: 'Grand Southern Trunk Rd, Tambaram West, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600045',
    coordinates: { lat: 12.9249, lng: 80.1197 },
    cashLevel: 19, // CRITICAL: < 30%!
    cashAmount: 665000,
    cashCapacity: 3500000,
    status: 'CRITICAL',
    isOnline: true,
    lastUpdated: 'Just now',
    lastRefillDate: '31 Aug 2026, 01:00 PM',
    lastMaintenanceDate: '22 Aug 2026',
    networkPing: 29,
    model: 'NCR SelfServ 82 Cash Dispenser',
    cassettes: {
      d2000: { denomination: 2000, notesCount: 15, maxNotes: 500, amount: 30000 },
      d500: { denomination: 500, notesCount: 850, maxNotes: 3000, amount: 425000 },
      d200: { denomination: 200, notesCount: 600, maxNotes: 2500, amount: 120000 },
      d100: { denomination: 100, notesCount: 900, maxNotes: 3000, amount: 90000 }
    },
    dailyWithdrawalAvg: 2900000,
    currentHourlyDrainRate: 180000,
    predictedDepletionHours: 1.1,
    predictedDepletionTime: '11:15 AM',
    recommendedRefillTime: 'IMMEDIATE DISPATCH',
    assignedTeamId: 'TEAM-02',
    securityStatus: {
      cameraOnline: true,
      doorSensor: 'LOCKED',
      vibrationLevel: 'NORMAL',
      antiSkimming: 'ACTIVE',
      vaultTempCelsius: 24.1,
      powerSource: 'MAINS_AC'
    },
    recentTransactions: [
      { id: 'TXN-931', timestamp: '10:29 AM', type: 'WITHDRAWAL', amount: 20000, accountMasked: '****1188', status: 'SUCCESS' },
      { id: 'TXN-932', timestamp: '10:27 AM', type: 'WITHDRAWAL', amount: 10000, accountMasked: '****7732', status: 'SUCCESS' }
    ],
    alertHistory: [
      { id: 'ALT-104-1', timestamp: '09:40 AM', type: 'CRITICAL_CASH', severity: 'CRITICAL', message: 'CRITICAL: Tambaram ATM breached 30% cash limit! Now at 19%. Transit team dispatched.', resolved: false }
    ]
  },
  {
    id: 'ATM-105',
    name: 'Mylapore Tank High Road',
    branchCode: 'CH-MYL-06',
    location: 'North Mada Street, Mylapore, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600004',
    coordinates: { lat: 13.0336, lng: 80.2687 },
    cashLevel: 68,
    cashAmount: 2380000,
    cashCapacity: 3500000,
    status: 'LOW_CASH',
    isOnline: true,
    lastUpdated: '3 mins ago',
    lastRefillDate: '01 Sep 2026, 05:00 PM',
    lastMaintenanceDate: '29 Aug 2026',
    networkPing: 21,
    model: 'Diebold Nixdorf CS 5500',
    cassettes: {
      d2000: { denomination: 2000, notesCount: 180, maxNotes: 500, amount: 360000 },
      d500: { denomination: 500, notesCount: 2800, maxNotes: 3000, amount: 1400000 },
      d200: { denomination: 200, notesCount: 1800, maxNotes: 2500, amount: 360000 },
      d100: { denomination: 100, notesCount: 2600, maxNotes: 3000, amount: 260000 }
    },
    dailyWithdrawalAvg: 1400000,
    currentHourlyDrainRate: 72000,
    predictedDepletionHours: 18.2,
    predictedDepletionTime: 'Tonight 11:30 PM',
    recommendedRefillTime: 'Tonight 08:00 PM',
    assignedTeamId: null,
    securityStatus: {
      cameraOnline: true,
      doorSensor: 'LOCKED',
      vibrationLevel: 'NORMAL',
      antiSkimming: 'ACTIVE',
      vaultTempCelsius: 22.0,
      powerSource: 'MAINS_AC'
    },
    recentTransactions: [
      { id: 'TXN-941', timestamp: '10:15 AM', type: 'WITHDRAWAL', amount: 3000, accountMasked: '****4455', status: 'SUCCESS' }
    ],
    alertHistory: []
  },
  {
    id: 'ATM-106',
    name: 'Velachery Central Bypass',
    branchCode: 'CH-VEL-09',
    location: 'Velachery Main Road, Near Phoenix Marketcity, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600042',
    coordinates: { lat: 12.9815, lng: 80.2180 },
    cashLevel: 32, // Low cash warning, close to 30%
    cashAmount: 1120000,
    cashCapacity: 3500000,
    status: 'LOW_CASH',
    isOnline: true,
    lastUpdated: '1 min ago',
    lastRefillDate: '31 Aug 2026, 08:30 PM',
    lastMaintenanceDate: '26 Aug 2026',
    networkPing: 27,
    model: 'Hyosung MoniMax 5600',
    cassettes: {
      d2000: { denomination: 2000, notesCount: 70, maxNotes: 500, amount: 140000 },
      d500: { denomination: 500, notesCount: 1400, maxNotes: 3000, amount: 700000 },
      d200: { denomination: 200, notesCount: 900, maxNotes: 2500, amount: 180000 },
      d100: { denomination: 100, notesCount: 1000, maxNotes: 3000, amount: 100000 }
    },
    dailyWithdrawalAvg: 1950000,
    currentHourlyDrainRate: 110000,
    predictedDepletionHours: 3.2,
    predictedDepletionTime: '01:15 PM',
    recommendedRefillTime: '11:45 AM',
    assignedTeamId: null,
    securityStatus: {
      cameraOnline: true,
      doorSensor: 'LOCKED',
      vibrationLevel: 'NORMAL',
      antiSkimming: 'ACTIVE',
      vaultTempCelsius: 23.2,
      powerSource: 'MAINS_AC'
    },
    recentTransactions: [
      { id: 'TXN-951', timestamp: '10:22 AM', type: 'WITHDRAWAL', amount: 5000, accountMasked: '****8809', status: 'SUCCESS' }
    ],
    alertHistory: [
      { id: 'ALT-106-1', timestamp: '10:00 AM', type: 'LOW_CASH', severity: 'MEDIUM', message: 'Cash approaching 30% threshold (32%). Refill recommendation prepared.', resolved: false }
    ]
  },
  {
    id: 'ATM-107',
    name: 'Coimbatore Gandhipuram Circle',
    branchCode: 'CBE-GAN-01',
    location: 'Cross Cut Road, Gandhipuram, Coimbatore',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '641012',
    coordinates: { lat: 11.0168, lng: 76.9558 },
    cashLevel: 74,
    cashAmount: 2590000,
    cashCapacity: 3500000,
    status: 'NORMAL',
    isOnline: true,
    lastUpdated: '5 mins ago',
    lastRefillDate: '01 Sep 2026, 11:00 AM',
    lastMaintenanceDate: '24 Aug 2026',
    networkPing: 38,
    model: 'NCR SelfServ 84',
    cassettes: {
      d2000: { denomination: 2000, notesCount: 210, maxNotes: 500, amount: 420000 },
      d500: { denomination: 500, notesCount: 3100, maxNotes: 3000, amount: 1550000 },
      d200: { denomination: 200, notesCount: 1900, maxNotes: 2500, amount: 380000 },
      d100: { denomination: 100, notesCount: 2400, maxNotes: 3000, amount: 240000 }
    },
    dailyWithdrawalAvg: 1600000,
    currentHourlyDrainRate: 70000,
    predictedDepletionHours: 21.0,
    predictedDepletionTime: 'Tomorrow 07:00 AM',
    recommendedRefillTime: 'Tonight 10:00 PM',
    assignedTeamId: null,
    securityStatus: {
      cameraOnline: true,
      doorSensor: 'LOCKED',
      vibrationLevel: 'NORMAL',
      antiSkimming: 'ACTIVE',
      vaultTempCelsius: 21.9,
      powerSource: 'MAINS_AC'
    },
    recentTransactions: [],
    alertHistory: []
  },
  {
    id: 'ATM-108',
    name: 'Madurai Meenakshi Gate Branch',
    branchCode: 'MDU-MNK-03',
    location: 'West Masi Street, Near Meenakshi Temple, Madurai',
    city: 'Madurai',
    state: 'Tamil Nadu',
    pincode: '625001',
    coordinates: { lat: 9.9195, lng: 78.1193 },
    cashLevel: 55,
    cashAmount: 1925000,
    cashCapacity: 3500000,
    status: 'LOW_CASH',
    isOnline: true,
    lastUpdated: '2 mins ago',
    lastRefillDate: '01 Sep 2026, 02:00 PM',
    lastMaintenanceDate: '27 Aug 2026',
    networkPing: 42,
    model: 'Diebold Nixdorf ProCash 8100',
    cassettes: {
      d2000: { denomination: 2000, notesCount: 140, maxNotes: 500, amount: 280000 },
      d500: { denomination: 500, notesCount: 2300, maxNotes: 3000, amount: 1150000 },
      d200: { denomination: 200, notesCount: 1400, maxNotes: 2500, amount: 280000 },
      d100: { denomination: 100, notesCount: 2150, maxNotes: 3000, amount: 215000 }
    },
    dailyWithdrawalAvg: 1750000,
    currentHourlyDrainRate: 88000,
    predictedDepletionHours: 12.5,
    predictedDepletionTime: 'Tonight 10:45 PM',
    recommendedRefillTime: 'Tonight 07:30 PM',
    assignedTeamId: null,
    securityStatus: {
      cameraOnline: true,
      doorSensor: 'LOCKED',
      vibrationLevel: 'NORMAL',
      antiSkimming: 'ACTIVE',
      vaultTempCelsius: 22.8,
      powerSource: 'MAINS_AC'
    },
    recentTransactions: [],
    alertHistory: []
  }
];

export const INITIAL_REFILL_TEAMS: RefillTeam[] = [
  {
    id: 'TEAM-01',
    teamName: 'SIS Prosegur Armored Transit Alpha',
    vanNumber: 'TN-01-BK-8841',
    driverName: 'Murugan S.',
    guardName: 'Rajesh K. (Armed Guard #AG-402)',
    contactNumber: '+91 98411 99881',
    assignedAtmId: 'ATM-102',
    currentStatus: 'EN_ROUTE',
    etaMinutes: 14,
    currentLocation: {
      lat: 13.0480,
      lng: 80.2400,
      address: 'Panagal Park Approach, T. Nagar'
    },
    assignedCashAmount: 2500000,
    dispatchedAt: '10:18 AM',
    otpCode: '849201'
  },
  {
    id: 'TEAM-02',
    teamName: 'CMS Info Systems Transit Bravo',
    vanNumber: 'TN-02-AL-4412',
    driverName: 'Selvam P.',
    guardName: 'Anthony M. (Armed Guard #AG-118)',
    contactNumber: '+91 98402 33441',
    assignedAtmId: 'ATM-104',
    currentStatus: 'DISPATCHED',
    etaMinutes: 22,
    currentLocation: {
      lat: 12.9500,
      lng: 80.1400,
      address: 'Chromepet GST Highway'
    },
    assignedCashAmount: 3000000,
    dispatchedAt: '10:20 AM',
    otpCode: '591024'
  },
  {
    id: 'TEAM-03',
    teamName: 'Radiant Cash Logistics Charlie',
    vanNumber: 'TN-07-CM-9102',
    driverName: 'Karthik V.',
    guardName: 'Dhanasekar R. (Armed Guard #AG-882)',
    contactNumber: '+91 98409 77112',
    assignedAtmId: null,
    currentStatus: 'IDLE',
    etaMinutes: 0,
    currentLocation: {
      lat: 13.0827,
      lng: 80.2707,
      address: 'Central Vault Depot, George Town'
    },
    assignedCashAmount: 0
  }
];

export const INITIAL_NOTIFICATIONS: SecurityNotification[] = [
  {
    id: 'NOTIF-101',
    atmId: 'ATM-102',
    atmName: 'T. Nagar Ranganathan St Branch',
    type: 'CRITICAL_CASH',
    title: 'CRITICAL ALARM: ATM Cash < 30% (26% remaining)',
    message: 'IoT Weight & Optical Sensors detected cash dropped to 26% (₹9,10,000 left). Automatic alarm siren triggered on Bank Manager portal.',
    severity: 'CRITICAL',
    timestamp: '10:15 AM',
    isRead: false,
    isAcknowledged: false,
    location: 'T. Nagar, Chennai',
    cashLevel: 26,
    requiresAction: true
  },
  {
    id: 'NOTIF-102',
    atmId: 'ATM-104',
    atmName: 'Tambaram Rly Station Junction',
    type: 'CRITICAL_CASH',
    title: 'EMERGENCY: Cash level at 19% (< 30%)',
    message: 'High withdrawal velocity at railway station hub. Only ₹6,65,000 remaining. Predicted empty in 65 minutes. Refill Team Bravo dispatched.',
    severity: 'CRITICAL',
    timestamp: '09:40 AM',
    isRead: false,
    isAcknowledged: true,
    location: 'Tambaram, Chennai',
    cashLevel: 19,
    requiresAction: true
  },
  {
    id: 'NOTIF-103',
    atmId: 'ATM-106',
    atmName: 'Velachery Central Bypass',
    type: 'LOW_CASH',
    title: 'Low Cash Warning: 32% remaining',
    message: 'Cash level approaching 30% critical threshold. AI recommends scheduled refill by 11:45 AM.',
    severity: 'MEDIUM',
    timestamp: '10:00 AM',
    isRead: true,
    isAcknowledged: true,
    location: 'Velachery, Chennai',
    cashLevel: 32,
    requiresAction: false
  },
  {
    id: 'NOTIF-104',
    atmId: 'ATM-102',
    atmName: 'T. Nagar Ranganathan St Branch',
    type: 'REFILL_DISPATCHED',
    title: 'Cash Van Dispatched (ETA: 14 mins)',
    message: 'SIS Prosegur Armored Transit Alpha (TN-01-BK-8841) assigned ₹25,00,000 cash refill. Vault OTP generated.',
    severity: 'LOW',
    timestamp: '10:18 AM',
    isRead: true,
    isAcknowledged: true,
    location: 'T. Nagar, Chennai',
    cashLevel: 26,
    requiresAction: false
  }
];

export const INITIAL_AI_PREDICTIONS: AIPredictionData[] = [
  {
    atmId: 'ATM-102',
    atmName: 'T. Nagar Ranganathan St Branch',
    location: 'T. Nagar, Chennai',
    currentCashLevel: 26,
    currentCashAmount: 910000,
    avgDailyWithdrawal: 2600000,
    predictedDepletionHours: 1.8,
    predictedDepletionTime: '11:45 AM',
    recommendedRefillTime: 'IMMEDIATE',
    recommendedRefillAmount: 2500000,
    urgency: 'HIGH',
    hourlyForecast: [
      { hour: '10:00 AM', cashPct: 29, expectedTxns: 18 },
      { hour: '11:00 AM', cashPct: 15, expectedTxns: 24 },
      { hour: '11:45 AM', cashPct: 0, expectedTxns: 14 },
      { hour: '01:00 PM', cashPct: 0, expectedTxns: 0 },
      { hour: '02:00 PM', cashPct: 0, expectedTxns: 0 }
    ],
    aiInsightNote: 'Salary-week shopping surge in Ranganathan Street. Cash drain rate is 42% above normal weekday baseline. Immediate refill essential to avoid zero-cash status.'
  },
  {
    atmId: 'ATM-104',
    atmName: 'Tambaram Rly Station Junction',
    location: 'Tambaram, Chennai',
    currentCashLevel: 19,
    currentCashAmount: 665000,
    avgDailyWithdrawal: 2900000,
    predictedDepletionHours: 1.1,
    predictedDepletionTime: '11:15 AM',
    recommendedRefillTime: 'IMMEDIATE',
    recommendedRefillAmount: 3000000,
    urgency: 'HIGH',
    hourlyForecast: [
      { hour: '10:00 AM', cashPct: 23, expectedTxns: 22 },
      { hour: '11:00 AM', cashPct: 4, expectedTxns: 20 },
      { hour: '11:15 AM', cashPct: 0, expectedTxns: 8 },
      { hour: '12:00 PM', cashPct: 0, expectedTxns: 0 }
    ],
    aiInsightNote: 'Heavy suburban train commuter rush. ₹500 notes depleted to critical levels. Refill with heavy ₹500 & ₹200 denomination ratio.'
  },
  {
    atmId: 'ATM-101',
    atmName: 'Anna Nagar West Hub',
    location: 'Anna Nagar, Chennai',
    currentCashLevel: 42,
    currentCashAmount: 1470000,
    avgDailyWithdrawal: 1850000,
    predictedDepletionHours: 4.8,
    predictedDepletionTime: '02:30 PM',
    recommendedRefillTime: '01:00 PM',
    recommendedRefillAmount: 2000000,
    urgency: 'MEDIUM',
    hourlyForecast: [
      { hour: '10:00 AM', cashPct: 42, expectedTxns: 10 },
      { hour: '11:00 AM', cashPct: 35, expectedTxns: 12 },
      { hour: '12:00 PM', cashPct: 28, expectedTxns: 15 },
      { hour: '01:00 PM', cashPct: 20, expectedTxns: 14 },
      { hour: '02:30 PM', cashPct: 0, expectedTxns: 16 }
    ],
    aiInsightNote: 'Will breach 30% threshold around 11:45 AM at current withdrawal rate. Proactive dispatch recommended during afternoon lull.'
  }
];

// Bilingual text dictionary
export const I18N = {
  en: {
    brand: 'CashGuard AI',
    tagline: '“பணம் தீரும் முன்பே தெரியும்.”',
    taglineSub: 'Knows before cash runs out • IoT Sensor ATM Cash Telemetry & Instant Alarm',
    problemLabel: 'Problem',
    problemDesc: 'When ATM cash drops, the Bank Manager does not know immediately, resulting in ATM downtime and dissatisfied customers.',
    solutionLabel: 'Solution',
    solutionDesc: 'IoT sensors monitor cash levels 24/7. When cash drops below 30% (< 30%), it triggers an immediate Alarm siren & Alert notification directly to the Bank Manager App.',
    dashboard: 'Manager Dashboard',
    sensorSimulator: 'Sensor Simulator & Alarm Test',
    atmFleet: 'ATM Fleet',
    notifications: 'Alarms & Alerts',
    aiForecasting: 'AI Depletion Forecasting',
    refillVans: 'Cash Refill Vans',
    totalAtms: 'Total ATMs Monitored',
    criticalAlarms: 'Critical Alarms (<30% Cash)',
    activeVans: 'Refill Vans Dispatched',
    totalCashInFleet: 'Total Fleet Cash',
    simulateDrop: 'Simulate < 30% Cash Drop',
    simulateWithdrawal: 'Simulate Withdrawal',
    dispatchVan: 'Dispatch Refill Van',
    refillNow: 'Refill ATM to 100%',
    silenceAlarm: 'Silence Siren',
    cashLevel: 'Cash Level',
    status: 'Status',
    alarmActive: 'ALARM ACTIVE',
    alarmMuted: 'Siren Silenced',
    normal: 'Normal (>50%)',
    lowCash: 'Low Cash Warning (30-49%)',
    critical: 'CRITICAL (<30% ALARM)',
    emptyIn: 'Depletes in',
    hours: 'hrs',
    testSensor: 'Live Sensor Test Bench',
    adjustSensorSlider: 'Adjust IoT Sensor Cash Level (%)',
    drainTestDesc: 'Drag the slider below 30% or click the quick test button to witness the instant alarm siren, manager notification, and refill recommendation in action.'
  },
  ta: {
    brand: 'CashGuard AI',
    tagline: '“பணம் தீரும் முன்பே தெரியும்.”',
    taglineSub: 'பணம் தீரும் முன்பே தெரியும் • IoT சென்சார் ATM பண கண்காணிப்பு மற்றும் உடனடி அலாரம்',
    problemLabel: 'சிக்கல் (Problem)',
    problemDesc: 'ATM-ல் cash குறைந்தாலும் Bank Manager-க்கு உடனடியாக தெரியாது. இதனால் வாடிக்கையாளர்கள் ஏமாற்றம் அடைகிறார்கள்.',
    solutionLabel: 'தீர்வு (Solution)',
    solutionDesc: 'ATM cash level-ஐ IoT சென்சார் மூலம் 24/7 கண்காணித்து, cash 30%-க்கு கீழே சென்றால் Manager App-க்கு உடனடியாக Alarm + Alert அனுப்பும்.',
    dashboard: 'மேனேஜர் டாஷ்போர்டு',
    sensorSimulator: 'சென்சார் டெஸ்ட் & அலாரம் சோதனை',
    atmFleet: 'ATM பட்டியல்',
    notifications: 'எச்சரிக்கைகள் & அலாரங்கள்',
    aiForecasting: 'AI பண கணிப்பு',
    refillVans: 'பணம் நிரப்பும் வாகனங்கள்',
    totalAtms: 'மொத்த ATM-கள்',
    criticalAlarms: 'அவசர அலாரங்கள் (<30% பணம்)',
    activeVans: 'அனுப்பப்பட்ட வாகனங்கள்',
    totalCashInFleet: 'மொத்த இருப்பு பணம்',
    simulateDrop: '30%-க்கு கீழ் குறைக்க (Test)',
    simulateWithdrawal: 'பணம் எடுப்பதை சோதிக்க',
    dispatchVan: 'வாகனம் அனுப்புக',
    refillNow: '100% ரீஃபில் செய்க',
    silenceAlarm: 'அலாரத்தை நிறுத்து',
    cashLevel: 'பண அளவு',
    status: 'நிலை',
    alarmActive: 'அலாரம் ஒலிக்கிறது',
    alarmMuted: 'அலாரம் அமைதியாக்கப்பட்டது',
    normal: 'சாதாரண நிலை (>50%)',
    lowCash: 'குறைந்த பணம் எச்சரிக்கை (30-49%)',
    critical: 'அவசரம் (<30% அலாரம்)',
    emptyIn: 'பணம் தீரும் நேரம்',
    hours: 'மணி',
    testSensor: 'IoT சென்சார் நேரடி சோதனை களம்',
    adjustSensorSlider: 'IoT சென்சார் பண அளவை மாற்றவும் (%)',
    drainTestDesc: 'சென்சார் ஸ்லைடரை 30%-க்கு கீழே இழுத்தால் அல்லது சோதனை பட்டனை அழுத்தினால், உடனடியாக அலாரம் மற்றும் மேனேஜர் அலெர்ட் செயல்படும்.'
  }
};


// --- DYNAMICALLY GENERATE MORE ATMs FOR "ALL BRANCHES" VIEW ---
const cities = [
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
  { name: 'Madurai', lat: 9.9252, lng: 78.1198 },
  { name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047 },
  { name: 'Salem', lat: 11.6643, lng: 78.1460 },
  { name: 'Tirunelveli', lat: 8.7139, lng: 77.7567 },
  { name: 'Vellore', lat: 12.9165, lng: 79.1325 },
  { name: 'Erode', lat: 11.3410, lng: 77.7172 },
  { name: 'Thoothukudi', lat: 8.7642, lng: 78.1348 },
  { name: 'Tiruppur', lat: 11.1085, lng: 77.3411 }
];

const facilities = ['BANK_BRANCH', 'STANDALONE_ATM', 'CDM_RECYCLER', 'DRIVE_THRU'];
const statuses = ['NORMAL', 'NORMAL', 'NORMAL', 'NORMAL', 'LOW_CASH', 'WARNING'];

const generatedAtms: ATM[] = Array.from({ length: 92 }).map((_, i) => {
  const city = cities[i % cities.length];
  // add some random spread to lat/lng
  const latSpread = (Math.random() - 0.5) * 0.1;
  const lngSpread = (Math.random() - 0.5) * 0.1;
  
  const cashCapacity = 3500000;
  const cashAmount = Math.floor(Math.random() * 2500000) + 1000000; // between 1M and 3.5M
  const cashLevel = Math.round((cashAmount / cashCapacity) * 100);
  let status = cashLevel < 30 ? 'CRITICAL' : cashLevel <= 45 ? 'LOW_CASH' : 'NORMAL';
  if (cashLevel > 45 && Math.random() > 0.8) status = 'WARNING';

  const facilityType = facilities[Math.floor(Math.random() * facilities.length)] as any;
  
  return {
    id: `ATM-2${i.toString().padStart(3, '0')}`,
    name: `${city.name} ${['Central', 'North', 'South', 'East', 'West', 'Bypass', 'Main', 'Junction'][Math.floor(Math.random() * 8)]} Branch`,
    branchCode: `TN-${city.name.substring(0,3).toUpperCase()}-${10+i}`,
    facilityType,
    hasCashDeposit: facilityType === 'CDM_RECYCLER' || facilityType === 'BANK_BRANCH',
    isBranchConnected: facilityType === 'BANK_BRANCH',
    branchTiming: '24 Hours',
    servicesOffered: ['Cash Withdrawal'],
    location: `Main Road, ${city.name}`,
    city: city.name,
    state: 'Tamil Nadu',
    pincode: '600000',
    coordinates: { lat: city.lat + latSpread, lng: city.lng + lngSpread },
    cashLevel,
    cashAmount,
    cashCapacity,
    status: status as any,
    isOnline: Math.random() > 0.05,
    lastUpdated: 'Live',
    lastRefillDate: 'Recently',
    lastMaintenanceDate: 'Recently',
    networkPing: Math.floor(Math.random() * 50) + 10,
    model: 'Standard ATM',
    cassettes: {
      d2000: { denomination: 2000, notesCount: 100, maxNotes: 500, amount: 200000 },
      d500: { denomination: 500, notesCount: 1000, maxNotes: 3000, amount: 500000 },
      d200: { denomination: 200, notesCount: 1000, maxNotes: 2500, amount: 200000 },
      d100: { denomination: 100, notesCount: 1000, maxNotes: 3000, amount: 100000 }
    },
    dailyWithdrawalAvg: 1000000,
    currentHourlyDrainRate: 50000,
    predictedDepletionHours: 20,
    predictedDepletionTime: 'Tomorrow',
    recommendedRefillTime: 'None',
    assignedTeamId: null,
    securityStatus: {
      cameraOnline: true,
      doorSensor: 'LOCKED',
      vibrationLevel: 'NORMAL',
      antiSkimming: 'ACTIVE',
      vaultTempCelsius: 24,
      powerSource: 'MAINS_AC'
    },
    recentTransactions: [],
    alertHistory: []
  };
});

// We need to alter how INITIAL_ATMS is exported, or just push to it.

export const INITIAL_ATMS: ATM[] = [...BASE_ATMS, ...generatedAtms];
