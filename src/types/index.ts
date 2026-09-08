export type ATMStatus = 'NORMAL' | 'LOW_CASH' | 'CRITICAL' | 'OFFLINE';

export type ViewName =
  | 'DASHBOARD'
  | 'ATM_LIST'
  | 'ATM_MAP'
  | 'NEARBY_BRANCHES'
  | 'AI_ASSISTANT'
  | 'REPORTS'
  | 'ATM_DETAILS'
  | 'SENSOR_SIMULATOR'
  | 'CRITICAL_ALERT'
  | 'NOTIFICATIONS'
  | 'AI_PREDICTIONS'
  | 'REFILL_TEAMS'
  | 'SETTINGS'
  | 'WELCOME'
  | 'STEP1_FACE'
  | 'STEP2_CARD'
  | 'STEP3_PIN'
  | 'STEP4_DECISION'
  | 'STEP5_WITHDRAWAL'
  | 'ATM_HOME'
  | 'SECURE_LAB'
  | 'ACCESS_HISTORY'
  | 'SECURITY_ALERTS'
  | 'PROFILE'
  | 'ADMIN_DASHBOARD'
  | 'ADMIN_USERS'
  | 'CARD_SCAN'
  | 'CARD_VERIFIED'
  | 'FACE_RECOGNITION'
  | 'FACE_VERIFICATION'
  | 'OTP_VERIFICATION'
  | 'ACCESS_GRANTED'
  | 'ACCESS_DENIED';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CassetteInfo {
  denomination: number; // 2000, 500, 200, 100
  notesCount: number;
  maxNotes: number;
  amount: number;
}

export type CashCassette = CassetteInfo;

export interface ATM {
  id: string; // e.g. "ATM-101"
  name: string; // "Anna Nagar Hub"
  branchCode: string; // "CH-ANN-04"
  facilityType?: 'ATM' | 'CDM_RECYCLER' | 'BANK_BRANCH' | 'DRIVE_THRU';
  hasCashDeposit?: boolean;
  isBranchConnected?: boolean;
  branchTiming?: string;
  servicesOffered?: string[];
  location: string; // "Anna Nagar West, Chennai"
  city: string; // "Chennai"
  state: string; // "Tamil Nadu"
  pincode: string; // "600040"
  coordinates: {
    lat: number;
    lng: number;
  };
  cashLevel: number; // 0 - 100 percentage
  cashAmount: number; // in INR
  cashCapacity: number; // in INR (e.g. 50,00,000)
  status: ATMStatus;
  isOnline: boolean;
  lastUpdated: string;
  lastRefillDate: string;
  lastMaintenanceDate: string;
  networkPing: number; // ms
  model: string; // e.g. "Diebold Nixdorf ProCash 8100"
  cassettes: {
    d2000: CassetteInfo;
    d500: CassetteInfo;
    d200: CassetteInfo;
    d100: CassetteInfo;
  };
  dailyWithdrawalAvg: number; // in INR
  currentHourlyDrainRate: number; // INR/hr
  predictedDepletionHours: number; // e.g. 6.2
  predictedDepletionTime: string; // "9:48 PM"
  recommendedRefillTime: string; // "4:00 PM"
  assignedTeamId: string | null;
  securityStatus: {
    cameraOnline: boolean;
    doorSensor: 'LOCKED' | 'OPEN' | 'TAMPER';
    vibrationLevel: 'NORMAL' | 'ELEVATED' | 'ALARM';
    antiSkimming: 'ACTIVE' | 'WARNING';
    vaultTempCelsius: number;
    powerSource: 'MAINS_AC' | 'UPS_BATTERY' | 'OFFLINE';
  };
  recentTransactions: {
    id: string;
    timestamp: string;
    type: 'WITHDRAWAL' | 'DEPOSIT' | 'BALANCE_CHECK';
    amount: number;
    accountMasked: string;
    status: 'SUCCESS' | 'FAILED' | 'FLAGGED';
  }[];
  alertHistory: {
    id: string;
    timestamp: string;
    type: string;
    severity: AlertSeverity;
    message: string;
    resolved: boolean;
  }[];
}

export interface RefillTeam {
  id: string;
  teamName: string;
  vanNumber: string;
  driverName: string;
  guardName: string;
  contactNumber: string;
  assignedAtmId: string | null;
  currentStatus: 'IDLE' | 'DISPATCHED' | 'EN_ROUTE' | 'ON_SITE_REFILLING' | 'COMPLETED';
  etaMinutes: number;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  assignedCashAmount: number;
  dispatchedAt?: string;
  completedAt?: string;
  otpCode?: string;
}

export interface SecurityNotification {
  id: string;
  atmId: string;
  atmName: string;
  type:
    | 'CRITICAL_CASH'
    | 'LOW_CASH'
    | 'ATM_OFFLINE'
    | 'SECURITY_BREACH'
    | 'MAINTENANCE_ALERT'
    | 'REFILL_DISPATCHED'
    | 'REFILL_COMPLETED';
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  isRead: boolean;
  isAcknowledged: boolean;
  location: string;
  cashLevel?: number;
  requiresAction?: boolean;
}

export interface ManagerProfile {
  id: string;
  name: string;
  designation: string;
  branchCircle: string;
  employeeId: string;
  email: string;
  phone: string;
  avatar: string;
  assignedZone: string;
}

export interface AIPredictionData {
  atmId: string;
  atmName: string;
  location: string;
  currentCashLevel: number;
  currentCashAmount: number;
  avgDailyWithdrawal: number;
  predictedDepletionHours: number;
  predictedDepletionTime: string;
  recommendedRefillTime: string;
  recommendedRefillAmount: number;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  hourlyForecast: { hour: string; cashPct: number; expectedTxns: number }[];
  aiInsightNote: string;
}

export interface SmartAccessSession {
  stage: 'SCAN_ID' | 'FACE_RECOGNITION' | 'OTP_ENTRY' | 'ACCESS_GRANTED' | 'ACCESS_DENIED';
  cardScanned: boolean;
  technicianId?: string;
  technicianName?: string;
  faceConfidence: number;
  faceMatched: boolean;
  otpEntered: string;
  otpValid: boolean;
  attemptsLeft: number;
  denialReason?: string;
  timestamp: string;
}

// Auxiliary types for backwards compatibility
export type UserRole = 'ADMIN' | 'USER' | 'AUDITOR' | 'TECHNICIAN' | string;
export type VerificationStep = 'WELCOME' | 'CARD_SCAN' | 'FACE_VERIFY' | 'PIN_ENTER' | 'DECISION' | 'WITHDRAWAL' | 'FACE' | 'CARD' | 'PIN';
export type VerificationStatus = 'IDLE' | 'SCANNING' | 'VERIFIED' | 'FAILED' | 'LOCKED' | 'SUCCESS' | 'SKIPPED';
export type LogResult = 'SUCCESS' | 'FAILED' | 'DENIED' | 'FLAGGED' | 'PROCESSING' | 'WARNING';
export type AccessType = 'ATM_WITHDRAWAL' | 'ATM_SERVICE' | 'LAB_ENTRY' | 'MAINTENANCE' | 'VAULT_ACCESS' | 'AUTHENTICATION_FLOW';
export type SimulationMode = 'STANDARD' | 'STOLEN_CARD' | 'IMPOSTER_FACE' | 'LOW_CASH_ALARM' | 'RAPID_DRAIN';
export type AlertType =
  | 'LOW_CASH_WARNING'
  | 'CRITICAL_DEPLETION'
  | 'IMPOSTER_FACE'
  | 'STOLEN_CARD'
  | 'TAMPER_DETECTED'
  | 'SENSOR_FAULT'
  | 'MULTIPLE_FAILED_ATTEMPTS'
  | 'SUSPICIOUS_ACCESS'
  | 'FACE_MISMATCH'
  | 'WRONG_OTP'
  | 'ACCOUNT_DISABLED';

export interface User {
  userId: string;
  name: string;
  cardId: string;
  cardNumber: string;
  maskedCardNumber: string;
  phoneNumber: string;
  maskedPhoneNumber: string;
  email: string;
  faceImageUrl: string;
  faceVerificationStatus?: 'ENROLLED' | 'PENDING' | 'REVOKED';
  faceMeshProfile?: string;
  accountStatus: 'ACTIVE' | 'LOCKED' | 'SUSPENDED';
  atmBalance: number;
  pinCode: string;
  role: UserRole;
  department: string;
  createdAt?: string;
  lastAccessDate: string;
  lastAccessTime: string;
  avatarSeed?: string;
  lastAccessLocation?: string;
}

export interface AccessLog {
  logId: string;
  userId: string;
  userName: string;
  accessType: AccessType;
  cardVerification: VerificationStatus | string;
  faceVerification: VerificationStatus | string;
  pinVerification: VerificationStatus | string;
  otpVerification?: VerificationStatus | string;
  result: LogResult;
  location: string;
  timestamp: string;
  formattedDate: string;
  formattedTime: string;
  details: string;
}

export interface Transaction {
  transactionId: string;
  userId: string;
  userName: string;
  atmId?: string;
  amount: number;
  timestamp: string;
  formattedDate?: string;
  formattedTime?: string;
  type: 'WITHDRAWAL' | 'DEPOSIT' | 'BALANCE_CHECK' | 'BALANCE_INQUIRY' | string;
  status: 'SUCCESS' | 'FAILED';
  fee?: number;
  terminalId?: string;
  balanceAfter?: number;
  remainingBalance?: number;
  faceMatched?: boolean;
}

export interface SecurityAlert {
  alertId: string;
  type?: AlertType | string;
  alertType?: AlertType | string;
  severity: AlertSeverity;
  timestamp: string;
  formattedDate?: string;
  formattedTime?: string;
  location?: string;
  userId?: string;
  userName?: string;
  atmId?: string;
  status: 'ACTIVE' | 'RESOLVED' | 'DISPATCHED';
  details?: string;
  description?: string;
  recommendedAction?: string;
}

export interface CardSmsAlert {
  id: string;
  sent: boolean;
  phoneNumber: string;
  maskedPhone: string;
  atmName: string;
  atmLocation: string;
  timestamp: string;
  cardNumberMasked: string;
  userName: string;
  messageTextEn: string;
  messageTextTa: string;
}

export interface VerificationSession {
  currentUser: User | null;
  faceScanned: boolean;
  faceVerified: boolean;
  faceConfidence: number;
  cardScanned: boolean;
  cardVerified: boolean;
  cardInput?: string;
  pinEntered?: string;
  enteredPin?: string;
  activePinCode?: string;
  activeOtpCode?: string;
  pinVerified: boolean;
  otpVerified?: boolean;
  pinAttempts?: number;
  isLocked?: boolean;
  verificationId: string;
  targetService?: 'LAB' | 'ATM' | null;
  failedPinAttempts?: number;
  failedOtpAttempts?: number;
  failedCardAttempts?: number;
  failedFaceAttempts?: number;
  isSecurityLocked?: boolean;
  startedAt?: string;
  accessDecision?: 'PENDING' | 'GRANTED' | 'DENIED';
  decision?: string;
  denialReason?: string;
  withdrawalAmount?: number;
  dispenseSuccess?: boolean;
  transactionId?: string;
  cardInsertSmsAlert?: CardSmsAlert | null;
}

