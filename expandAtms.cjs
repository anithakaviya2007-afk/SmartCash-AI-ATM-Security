const fs = require('fs');

const filePath = 'src/data/atmData.ts';
let content = fs.readFileSync(filePath, 'utf-8');

const generateCode = `

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
    id: \`ATM-2\${i.toString().padStart(3, '0')}\`,
    name: \`\${city.name} \${['Central', 'North', 'South', 'East', 'West', 'Bypass', 'Main', 'Junction'][Math.floor(Math.random() * 8)]} Branch\`,
    branchCode: \`TN-\${city.name.substring(0,3).toUpperCase()}-\${10+i}\`,
    facilityType,
    hasCashDeposit: facilityType === 'CDM_RECYCLER' || facilityType === 'BANK_BRANCH',
    isBranchConnected: facilityType === 'BANK_BRANCH',
    branchTiming: '24 Hours',
    servicesOffered: ['Cash Withdrawal'],
    location: \`Main Road, \${city.name}\`,
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
`;

// Let's replace "export const INITIAL_ATMS: ATM[] = [" with "const BASE_ATMS: ATM[] = ["
content = content.replace('export const INITIAL_ATMS: ATM[] = [', 'const BASE_ATMS: ATM[] = [');

// Then at the end of the file, we add our generation code and re-export INITIAL_ATMS
content += generateCode;
content += `\nexport const INITIAL_ATMS: ATM[] = [...BASE_ATMS, ...generatedAtms];\n`;

fs.writeFileSync(filePath, content);
console.log('Done');
