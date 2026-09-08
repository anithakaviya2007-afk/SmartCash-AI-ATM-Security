import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import {
  User,
  AccessLog,
  Transaction,
  SecurityAlert,
  VerificationSession,
  ViewName,
  VerificationStep,
  VerificationStatus,
  LogResult,
  AccessType,
  SimulationMode,
  ATM,
  ATMStatus,
  RefillTeam,
  SecurityNotification,
  ManagerProfile,
  AIPredictionData,
  CardSmsAlert
} from '../types';
import { INITIAL_USERS, INITIAL_ACCESS_LOGS, INITIAL_TRANSACTIONS, INITIAL_ALERTS } from '../data/initialData';
import {
  INITIAL_ATMS,
  INITIAL_REFILL_TEAMS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AI_PREDICTIONS,
  INITIAL_MANAGER_PROFILE,
  I18N
} from '../data/atmData';
import { getLiveDateTimeString, generateVerificationId } from '../utils/dateTime';
import { playSound, setSoundEnabled, isSoundEnabled } from '../utils/soundEffects';
import {
  VoiceLanguage,
  VoiceGuidanceKey,
  VOICE_PROMPTS,
  playVoiceGuidance,
  stopVoiceGuidance,
  unlockAudioAndVoice
} from '../utils/voiceGuidance';

interface SecurityContextType {
  currentView: ViewName;
  setCurrentView: (view: ViewName) => void;
  currentStep: VerificationStep;
  setCurrentStep: (step: VerificationStep) => void;
  session: VerificationSession;
  users: User[];
  activeUser: User | null;
  setActiveUser: (user: User | null) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  accessLogs: AccessLog[];
  transactions: Transaction[];
  alerts: SecurityAlert[];
  liveDateTime: { date: string; time: string; timeWithSeconds: string };
  isDoorLocked: boolean;
  soundOn: boolean;
  setSoundOn: (on: boolean) => void;
  demoSimulationMode: SimulationMode;
  setDemoSimulationMode: (mode: SimulationMode) => void;
  
  // CashGuard AI Fleet & Sensor State
  atms: ATM[];
  selectedAtm: ATM | null;
  setSelectedAtm: (atm: ATM | null) => void;
  refillTeams: RefillTeam[];
  notifications: SecurityNotification[];
  aiPredictions: AIPredictionData[];
  managerProfile: ManagerProfile;
  activeAlarmAtm: ATM | null;
  isSirenAudible: boolean;
  language: 'en' | 'ta';
  setLanguage: (lang: 'en' | 'ta') => void;
  t: (key: keyof typeof I18N['en']) => string;
  showCriticalModal: boolean;
  setShowCriticalModal: (show: boolean) => void;
  isRefillModalOpen: boolean;
  refillModalAtm: ATM | null;
  openRefillModal: (atmId?: string) => void;
  closeRefillModal: () => void;
  isManagerLoginOpen: boolean;
  setIsManagerLoginOpen: (open: boolean) => void;
  isHowItWorksOpen: boolean;
  setIsHowItWorksOpen: (open: boolean) => void;
  isCashAvailable: (atmId?: string) => boolean;

  // CashGuard AI Core Operations & Sensor Simulation
  updateAtmCashLevel: (atmId: string, newPercentage: number) => void;
  simulateDropBelow30: (atmId: string, targetPct?: number) => void;
  simulateAtmWithdrawal: (atmId: string, amount: number) => { success: boolean; newLevel: number; alarmTriggered: boolean };
  refillAtm: (atmId: string) => void;
  dispatchRefillTeam: (teamId: string, atmId: string, customCash?: number) => void;
  silenceAlarm: () => void;
  triggerEmergencyAlarm: (atmId: string) => void;
  acknowledgeNotification: (notifId: string) => void;
  dismissCriticalModal: () => void;

  // Voice Guidance (English & Tamil)
  voiceLanguage: VoiceLanguage;
  setVoiceLanguage: (lang: VoiceLanguage) => void;
  voiceSpeed: number;
  setVoiceSpeed: (speed: number) => void;
  voiceVolume: number;
  setVoiceVolume: (volume: number) => void;
  voicePitch: number;
  setVoicePitch: (pitch: number) => void;
  voiceMuted: boolean;
  setVoiceMuted: (muted: boolean) => void;
  autoAnnounceScreen: boolean;
  setAutoAnnounceScreen: (enabled: boolean) => void;
  readAloudNonReaders: boolean;
  setReadAloudNonReaders: (enabled: boolean) => void;
  isVoiceSettingsOpen: boolean;
  setIsVoiceSettingsOpen: (open: boolean) => void;
  isSpeaking: boolean;
  currentVoiceKey: VoiceGuidanceKey | null;
  speakGuidance: (
    key: VoiceGuidanceKey,
    forceLang?: VoiceLanguage,
    customRate?: number,
    onEnd?: () => void,
    customVolume?: number,
    customPitch?: number
  ) => void;
  speakCustomText: (text: string, forceLang?: VoiceLanguage) => void;
  speakItem: (taText: string, enText: string, force?: boolean) => void;
  replayCurrentVoice: () => void;
  stopSpeech: () => void;
  
  // Navigation & General Flow
  navigateTo: (view: ViewName) => void;
  startVerification: (target?: 'LAB' | 'ATM' | null) => void;
  startAtm5StepFlow: () => void;
  resetVerification: () => void;
  
  // 5-Step ATM MFA Handlers
  // Step 1: Face
  handleStep1FaceVerification: (forcedSuccess?: boolean) => { success: boolean; confidence: number };
  proceedFromStep1FaceToStep2Card: () => void;
  
  // Step 2: Card
  handleStep2CardScan: (cardInput: string) => { success: boolean; message: string; user?: User };
  proceedFromStep2CardToStep3Pin: () => void;
  proceedFromStep2CardToFaceScan: () => void;
  
  // Step 3: PIN
  handleStep3PinVerify: (pinInput: string) => { success: boolean; message: string };
  proceedFromStep3PinToStep4Decision: () => void;
  
  // Step 4: Decision
  evaluateAccessDecision: () => { granted: boolean; reason: string };
  proceedFromStep4DecisionToStep5Withdrawal: () => void;
  retryVerification: () => void;
  
  // Step 5: Cash Withdrawal
  handleStep5Withdrawal: (amount: number) => { success: boolean; message: string; transaction?: Transaction };
  finishAtmSession: () => void;

  // Backwards compatibility actions
  handleCardScanned: (cardInput: string) => { success: boolean; message: string; user?: User };
  confirmCardAndProceedToFace: () => void;
  handleFaceVerification: (customSuccess?: boolean) => { success: boolean; confidence: number };
  proceedToOtp: () => void;
  handleVerifyOtp: (enteredOtp: string) => { success: boolean; message: string };
  resendOtp: () => string;
  completeAccessGranted: (target?: 'LAB' | 'ATM') => void;
  unlockLabDoor: () => void;
  lockLabDoor: () => void;
  processAtmWithdrawal: (amount: number) => { success: boolean; message: string; transaction?: Transaction };
  
  // Admin & Data Actions
  resolveAlert: (alertId: string) => void;
  toggleUserAccountStatus: (userId: string) => void;
  addUser: (user: Omit<User, 'userId' | 'createdAt'>) => void;
  updateUserProfilePhoto: (userId: string, photoDataUrl: string) => void;
  resetUserProfilePhoto: (userId: string) => void;
  updateUserPinCode: (userId: string, newPin: string) => void;
  unlockSecurityLock: () => void;
  quickPassDemo: () => void;
  triggerStolenCardDemoScenario: () => void;
  testFaceScanner: (forceMismatch?: boolean) => { success: boolean; confidence: number; sms: CardSmsAlert };
}

const LOCAL_STORAGE_PHOTOS_KEY = 'securegate_user_photos';
const LOCAL_STORAGE_PINS_KEY = 'securegate_user_pins';

const getInitialUsersWithSavedData = (): User[] => {
  let userList = INITIAL_USERS;
  try {
    const savedPhotos = localStorage.getItem(LOCAL_STORAGE_PHOTOS_KEY);
    const photosMap: Record<string, string> = savedPhotos ? JSON.parse(savedPhotos) : {};
    
    const savedPins = localStorage.getItem(LOCAL_STORAGE_PINS_KEY);
    const pinsMap: Record<string, string> = savedPins ? JSON.parse(savedPins) : {};

    userList = INITIAL_USERS.map(u => {
      let user = { ...u };
      if (photosMap[u.userId]) {
        user.faceImageUrl = photosMap[u.userId];
      }
      if (pinsMap[u.userId]) {
        user.pinCode = pinsMap[u.userId];
      }
      return user;
    });
  } catch (e) {
    console.warn('Could not read user data from localStorage:', e);
  }
  return userList;
};

const initialUsersList = getInitialUsersWithSavedData();

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

const createFreshSession = (defaultUser: User | null = null): VerificationSession => ({
  currentUser: defaultUser,
  // Step 1: Face
  faceScanned: false,
  faceVerified: false,
  faceConfidence: 0,
  // Step 2: Card
  cardScanned: false,
  cardVerified: false,
  // Step 3: PIN
  pinVerified: false,
  enteredPin: '',
  activePinCode: defaultUser?.pinCode || '123456',
  // Step 4: Decision
  decision: 'PENDING',
  // Step 5: Cash
  withdrawalAmount: 0,
  dispenseSuccess: false,
  transactionId: undefined,
  // Common
  activeOtpCode: '482910',
  otpVerified: false,
  verificationId: generateVerificationId(),
  targetService: 'ATM',
  failedPinAttempts: 0,
  failedOtpAttempts: 0,
  failedCardAttempts: 0,
  failedFaceAttempts: 0,
  isSecurityLocked: false
});

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewName>('DASHBOARD');
  const [currentStep, setCurrentStep] = useState<VerificationStep>('FACE');
  const [users, setUsers] = useState<User[]>(initialUsersList);
  const [activeUser, setActiveUser] = useState<User | null>(initialUsersList[0]); // Default Anitha with saved photo if any
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(INITIAL_ACCESS_LOGS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [isDoorLocked, setIsDoorLocked] = useState<boolean>(true);
  const [soundOn, setSoundOnState] = useState<boolean>(true);
  const [demoSimulationMode, setDemoSimulationMode] = useState<SimulationMode>('NORMAL');
  const [session, setSession] = useState<VerificationSession>(createFreshSession(initialUsersList[0]));

  // CashGuard AI State
  const [atms, setAtms] = useState<ATM[]>(INITIAL_ATMS);
  const [selectedAtm, setSelectedAtm] = useState<ATM | null>(INITIAL_ATMS[0]);
  const [refillTeams, setRefillTeams] = useState<RefillTeam[]>(INITIAL_REFILL_TEAMS);
  const [notifications, setNotifications] = useState<SecurityNotification[]>(INITIAL_NOTIFICATIONS);
  const [aiPredictions] = useState<AIPredictionData[]>(INITIAL_AI_PREDICTIONS);
  const [managerProfile] = useState<ManagerProfile>(INITIAL_MANAGER_PROFILE);
  const [isSirenAudible, setIsSirenAudible] = useState<boolean>(true);
  const [showCriticalModal, setShowCriticalModal] = useState<boolean>(false);
  const [isRefillModalOpen, setIsRefillModalOpen] = useState<boolean>(false);
  const [refillModalAtm, setRefillModalAtm] = useState<ATM | null>(null);
  const [isManagerLoginOpen, setIsManagerLoginOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [language, setLanguageState] = useState<'en' | 'ta'>('ta'); // Default Tamil

  const openRefillModal = (atmId?: string) => {
    const target = (atmId ? atms.find(a => a.id === atmId) : null) || selectedAtm || atms[0];
    setRefillModalAtm(target);
    setIsRefillModalOpen(true);
  };

  const closeRefillModal = () => {
    setIsRefillModalOpen(false);
    setRefillModalAtm(null);
  };

  const isCashAvailable = (atmId?: string): boolean => {
    const target = (atmId ? atms.find(a => a.id === atmId) : null) || selectedAtm || atms[0];
    return target ? target.cashLevel > 0 : false;
  };

  // Voice Guidance State (English & Tamil)
  const [voiceLanguage, setVoiceLanguageState] = useState<VoiceLanguage>(() => {
    try {
      const saved = localStorage.getItem('cashguard_voice_lang') || localStorage.getItem('securegate_voice_lang');
      if (saved === 'ta' || saved === 'en') return saved;
    } catch {
      // ignore
    }
    return 'ta';
  });

  const [voiceMuted, setVoiceMuted] = useState<boolean>(false);
  const [voiceSpeed, setVoiceSpeedState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('securegate_voice_speed');
      if (saved) {
        const val = parseFloat(saved);
        if (!isNaN(val) && val >= 0.75 && val <= 1.5) return val;
      }
    } catch {
      // ignore
    }
    return 0.95; // Default: 0.95x (Crystal-clear, natural cadence for Tamil & English)
  });

  const [voiceVolume, setVoiceVolumeState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('securegate_voice_volume');
      if (saved) {
        const val = parseFloat(saved);
        if (!isNaN(val) && val >= 0 && val <= 1) return val;
      }
    } catch {
      // ignore
    }
    return 1.0;
  });

  const [voicePitch, setVoicePitchState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('securegate_voice_pitch');
      if (saved) {
        const val = parseFloat(saved);
        if (!isNaN(val) && val >= 0.7 && val <= 1.4) return val;
      }
    } catch {
      // ignore
    }
    return 1.0;
  });

  const [autoAnnounceScreen, setAutoAnnounceScreenState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('securegate_auto_announce');
      if (saved !== null) return saved === 'true';
    } catch {
      // ignore
    }
    return true; // Enabled by default: Speaks specifically for each screen!
  });

  const [readAloudNonReaders, setReadAloudNonReadersState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('securegate_read_aloud_non_readers');
      if (saved !== null) return saved === 'true';
    } catch {
      // ignore
    }
    return true; // Enabled by default: Reads every button/digit/amount aloud for users who cannot read!
  });

  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentVoiceKey, setCurrentVoiceKey] = useState<VoiceGuidanceKey | null>(null);

  const setVoiceLanguage = (lang: VoiceLanguage) => {
    unlockAudioAndVoice();
    setVoiceLanguageState(lang);
    setLanguageState(lang);
    try {
      localStorage.setItem('securegate_voice_lang', lang);
      localStorage.setItem('cashguard_voice_lang', lang);
    } catch {
      // ignore
    }
    speakGuidance('LANGUAGE_SWITCHED', lang);
  };

  const setVoiceSpeed = (speed: number) => {
    setVoiceSpeedState(speed);
    try {
      localStorage.setItem('securegate_voice_speed', speed.toString());
    } catch {
      // ignore
    }
  };

  const setVoiceVolume = (volume: number) => {
    setVoiceVolumeState(volume);
    try {
      localStorage.setItem('securegate_voice_volume', volume.toString());
    } catch {
      // ignore
    }
  };

  const setVoicePitch = (pitch: number) => {
    setVoicePitchState(pitch);
    try {
      localStorage.setItem('securegate_voice_pitch', pitch.toString());
    } catch {
      // ignore
    }
  };

  const setAutoAnnounceScreen = (enabled: boolean) => {
    setAutoAnnounceScreenState(enabled);
    try {
      localStorage.setItem('securegate_auto_announce', enabled ? 'true' : 'false');
    } catch {
      // ignore
    }
  };

  const setReadAloudNonReaders = (enabled: boolean) => {
    setReadAloudNonReadersState(enabled);
    try {
      localStorage.setItem('securegate_read_aloud_non_readers', enabled ? 'true' : 'false');
    } catch {
      // ignore
    }
    if (enabled) {
      speakItem(
        'படிக்கத் தெரியாதவர்களுக்கான குரல் வழிகாட்டல் இயக்கப்பட்டது. நீங்கள் தொடும் ஒவ்வொரு பட்டனையும் இது தெளிவாகப் பேசும்.',
        'Read-aloud voice assistance enabled. It will speak every button and option you touch.',
        true
      );
    }
  };

  const lastSpokenKeyRef = useRef<string>('');

  const stopSpeech = () => {
    stopVoiceGuidance();
    setTimeout(() => setIsSpeaking(false), 0);
  };

  const speakGuidance = useCallback((
    key: VoiceGuidanceKey,
    forceLang?: VoiceLanguage,
    customRate?: number,
    onEnd?: () => void,
    customVolume?: number,
    customPitch?: number
  ) => {
    unlockAudioAndVoice();
    if (voiceMuted) {
      setTimeout(() => onEnd?.(), 0);
      return;
    }
    const langToUse = forceLang || voiceLanguage;
    const rateToUse = customRate ?? voiceSpeed;
    const volumeToUse = customVolume ?? voiceVolume;
    const pitchToUse = customPitch ?? voicePitch;
    
    lastSpokenKeyRef.current = `${key}_${langToUse}`;
    
    setTimeout(() => {
      setCurrentVoiceKey(key);
      setIsSpeaking(true);
    }, 0);

    playVoiceGuidance(key, langToUse, {
      rate: rateToUse,
      pitch: pitchToUse,
      volume: volumeToUse,
      onStart: () => {
        setTimeout(() => setIsSpeaking(true), 0);
      },
      onEnd: () => {
        setTimeout(() => setIsSpeaking(false), 0);
        onEnd?.();
      },
      onError: () => {
        setTimeout(() => setIsSpeaking(false), 0);
        onEnd?.();
      }
    });
  }, [voiceMuted, voiceLanguage, voiceSpeed, voiceVolume, voicePitch]);

  const speakCustomText = useCallback((text: string, forceLang?: VoiceLanguage) => {
    unlockAudioAndVoice();
    if (voiceMuted) return;
    const langToUse = forceLang || voiceLanguage;
    playVoiceGuidance(text, langToUse, {
      rate: voiceSpeed,
      pitch: voicePitch,
      volume: voiceVolume,
      onStart: () => setTimeout(() => setIsSpeaking(true), 0),
      onEnd: () => setTimeout(() => setIsSpeaking(false), 0)
    });
  }, [voiceMuted, voiceLanguage, voiceSpeed, voiceVolume, voicePitch]);

  /**
   * Speak individual UI item (buttons, keypad digits, currency amounts, options)
   * specifically built for users who cannot read (படிக்கத் தெரியாதவர்கள்)
   */
  const speakItem = useCallback((taText: string, enText: string, force = false) => {
    unlockAudioAndVoice();
    if (voiceMuted) return;
    if (!readAloudNonReaders && !force) return;
    const spoken = voiceLanguage === 'ta' ? taText : enText;
    playVoiceGuidance(spoken, voiceLanguage, {
      rate: Math.max(0.85, voiceSpeed), // crystal clear pronunciation
      pitch: voicePitch,
      volume: voiceVolume,
      onStart: () => setTimeout(() => setIsSpeaking(true), 0),
      onEnd: () => setTimeout(() => setIsSpeaking(false), 0)
    });
  }, [voiceMuted, readAloudNonReaders, voiceLanguage, voiceSpeed, voicePitch, voiceVolume]);

  const replayCurrentVoice = () => {
    lastSpokenKeyRef.current = '';
    if (currentVoiceKey) {
      speakGuidance(currentVoiceKey);
    } else {
      speakGuidance('WELCOME_GREETING');
    }
  };

  // Live ticking date & time
  const [liveDateTime, setLiveDateTime] = useState(getLiveDateTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveDateTime(getLiveDateTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const setSoundOn = (on: boolean) => {
    setSoundOnState(on);
    setSoundEnabled(on);
  };

  // Helper to add access log
  const logAccessAttempt = (
    user: User | null,
    accessType: AccessType,
    cardStatus: VerificationStatus,
    faceStatus: VerificationStatus,
    pinStatus: VerificationStatus,
    result: LogResult,
    location: string,
    details?: string
  ) => {
    const dt = getLiveDateTimeString();
    const newLog: AccessLog = {
      logId: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user ? user.userId : 'UNKNOWN',
      userName: user ? user.name : 'Unknown Cardholder',
      accessType,
      cardVerification: cardStatus,
      faceVerification: faceStatus,
      pinVerification: pinStatus,
      otpVerification: pinStatus,
      result,
      location,
      timestamp: dt.iso,
      formattedDate: dt.date,
      formattedTime: dt.time,
      details
    };
    setAccessLogs(prev => [newLog, ...prev]);
  };

  // Helper to add security alert
  const triggerAlert = (
    alertType: SecurityAlert['alertType'],
    description: string,
    recommendedAction: string,
    severity: SecurityAlert['severity'],
    user?: User | null
  ) => {
    const dt = getLiveDateTimeString();
    const newAlert: SecurityAlert = {
      alertId: `ALT-${Math.floor(500 + Math.random() * 500)}`,
      userId: user?.userId,
      userName: user?.name,
      alertType,
      description,
      timestamp: dt.iso,
      formattedDate: dt.date,
      formattedTime: dt.time,
      status: 'ACTIVE',
      recommendedAction,
      severity
    };
    setAlerts(prev => [newAlert, ...prev]);

    // Play loud distinct audible security alert / siren sound
    if (severity === 'CRITICAL') {
      playSound.criticalAlarm();
    } else if (severity === 'HIGH') {
      playSound.securityAlert();
    } else {
      playSound.cardMismatch();
    }
  };

  const navigateTo = (view: ViewName) => {
    stopVoiceGuidance();
    setCurrentView(view);
    if (autoAnnounceScreen) {
      if (view === 'DASHBOARD') speakGuidance('NAV_DASHBOARD');
      else if (view === 'WELCOME' || view === 'ATM_HOME') speakGuidance('WELCOME_GREETING');
      else if (view === 'STEP2_CARD' || view === 'CARD_SCAN') speakGuidance('STEP1_CARD_PROMPT');
      else if (view === 'STEP1_FACE' || view === 'FACE_RECOGNITION') speakGuidance('STEP2_FACE_PROMPT');
      else if (view === 'STEP3_PIN' || view === 'OTP_VERIFICATION') speakGuidance('STEP3_PIN_PROMPT');
      else if (view === 'STEP4_DECISION') speakGuidance('STEP4_ACCESS_DECISION_PROMPT');
      else if (view === 'STEP5_WITHDRAWAL') speakGuidance('STEP5_WITHDRAWAL_PROMPT');
      else if (view === 'SENSOR_SIMULATOR') speakGuidance('NAV_SENSORS');
      else if (view === 'REFILL_TEAMS') speakGuidance('NAV_LOGISTICS');
      else if (view === 'SECURITY_ALERTS') speakGuidance('NAV_ALERTS');
      else if (view === 'ATM_MAP') speakGuidance('NAV_MAP');
    }
  };

  // Start 5-Step Smart Secure ATM Flow
  const startAtm5StepFlow = () => {
    stopVoiceGuidance();
    const defaultUser = activeUser || users[0];
    const fresh = createFreshSession(defaultUser);
    setSession(fresh);
    setCurrentStep('CARD');
    setCurrentView('STEP2_CARD');
    playSound.keyPress();
  };

  const startVerification = (target?: 'LAB' | 'ATM' | null) => {
    startAtm5StepFlow();
  };

  const resetVerification = () => {
    stopVoiceGuidance();
    setSession(createFreshSession(activeUser || users[0]));
    setCurrentStep('FACE');
    setCurrentView('WELCOME');
    playSound.keyPress();
  };

  // ==========================================
  // STEP 1: FACE RECOGNITION
  // ==========================================
  const handleStep1FaceVerification = (forcedSuccess?: boolean) => {
    const dt = getLiveDateTimeString();
    const user = session.currentUser || activeUser || users[0];
    const currentAtm = selectedAtm || atms[0];
    
    // Check simulation mode: FAIL_FACE or STOLEN_CARD (imposter) causes face mismatch
    let willSucceed = true;
    if (forcedSuccess !== undefined) {
      willSucceed = forcedSuccess;
    } else if (demoSimulationMode === 'FAIL_FACE' || demoSimulationMode === 'STOLEN_CARD') {
      willSucceed = false;
    }

    if (willSucceed) {
      playSound.faceRecognized();
      const confidence = 98.4; // Realistic exact match requested
      
      const phoneNum = user.phoneNumber || '9840288291';
      const maskedPh = user.maskedPhoneNumber || '******8291';
      const smsData: CardSmsAlert = {
        id: `SMS-FACE-OK-${Date.now()}`,
        sent: true,
        phoneNumber: phoneNum,
        maskedPhone: maskedPh,
        atmName: currentAtm.name,
        atmLocation: currentAtm.location,
        timestamp: dt.timeWithSeconds || dt.time,
        cardNumberMasked: user.maskedCardNumber,
        userName: user.name,
        messageTextEn: `[SECURITY VERIFIED ✓] Registered face match confirmed (${confidence}%) for ${user.name} at ${currentAtm.name}. Proceeding to PIN entry.`,
        messageTextTa: `[வங்கி உறுதிப்பாடு ✓] ${user.name} அவர்களின் பதிவு செய்யப்பட்ட முகம் (${confidence}%) ${currentAtm.name} ஏடிஎம்மில் வெற்றிகரமாகப் பொருந்தியது.`
      };

      setSession(prev => ({
        ...prev,
        faceScanned: true,
        faceVerified: true,
        faceConfidence: confidence,
        faceScanTimestamp: { date: dt.date, time: dt.time },
        cardInsertSmsAlert: smsData
      }));

      setNotifications(prev => [
        {
          id: `NOTIF-FACE-OK-${Date.now()}`,
          atmId: currentAtm.id,
          atmName: currentAtm.name,
          type: 'SECURITY_BREACH',
          title: `👤 Face Biometrics Verified (${confidence}%)`,
          message: `Registered cardholder ${user.name} face matched at ${currentAtm.name}. Confirmation SMS sent to ${maskedPh}.`,
          severity: 'LOW',
          timestamp: `${dt.date} ${dt.time}`,
          isRead: false,
          isAcknowledged: true,
          location: currentAtm.location
        },
        ...prev
      ]);

      return { success: true, confidence };
    } else {
      playSound.accessDenied();
      const confidence = 41.8; // Low match for imposter / mismatch
      
      const phoneNum = user.phoneNumber || '9840288291';
      const maskedPh = user.maskedPhoneNumber || '******8291';
      const smsData: CardSmsAlert = {
        id: `SMS-FACE-FAIL-${Date.now()}`,
        sent: true,
        phoneNumber: phoneNum,
        maskedPhone: maskedPh,
        atmName: currentAtm.name,
        atmLocation: currentAtm.location,
        timestamp: dt.timeWithSeconds || dt.time,
        cardNumberMasked: user.maskedCardNumber,
        userName: user.name,
        messageTextEn: `🚨 [CRITICAL SECURITY ALERT] UNAUTHORIZED FACE ATTEMPT detected at ${currentAtm.name}! Face match score ${confidence}% (Threshold: 85%). Transaction BLOCKED & Card Ejected.`,
        messageTextTa: `🚨 [அவசர எச்சரிக்கை] ${currentAtm.name} ஏடிஎம்மில் அனுமதி இல்லாத நபர் முகம் காட்டினார்! முகப் பொருத்தம் தோல்வி (${confidence}%). பரிவர்த்தனை உடனடியாகத் தடுக்கப்பட்டது!`
      };

      setSession(prev => ({
        ...prev,
        faceScanned: true,
        faceVerified: false,
        faceConfidence: confidence,
        failedFaceAttempts: prev.failedFaceAttempts + 1,
        faceScanTimestamp: { date: dt.date, time: dt.time },
        cardInsertSmsAlert: smsData
      }));

      triggerAlert(
        'FACE_MISMATCH',
        `Biometric mismatch detected during Step 1 Face Scan at ${currentAtm.name}. Face confidence ${confidence}% is below 85% registered threshold. Transaction blocked.`,
        'Verify camera feed or block card if stolen.',
        'CRITICAL',
        user
      );

      setNotifications(prev => [
        {
          id: `NOTIF-FACE-MISMATCH-${Date.now()}`,
          atmId: currentAtm.id,
          atmName: currentAtm.name,
          type: 'SECURITY_BREACH',
          title: `🚨 UNAUTHORIZED FACE ATTEMPT BLOCKED (${confidence}%)`,
          message: `Unrecognized face scan at ${currentAtm.name}. Card belongs to ${user.name}. Alert SMS dispatched to ${maskedPh}. Smartwatch notified.`,
          severity: 'CRITICAL',
          timestamp: `${dt.date} ${dt.time}`,
          isRead: false,
          isAcknowledged: false,
          location: currentAtm.location
        },
        ...prev
      ]);

      return { success: false, confidence };
    }
  };

  const proceedFromStep1FaceToStep2Card = () => {
    stopVoiceGuidance();
    setCurrentStep('CARD');
    setCurrentView('STEP2_CARD');
    playSound.keyPress();
  };

  // ==========================================
  // STEP 2: ATM CARD SCAN
  // ==========================================
  const handleStep2CardScan = (cardInput: string) => {
    const cleanInput = cardInput.replace(/\s+/g, '').toLowerCase();
    const dt = getLiveDateTimeString();

    if (demoSimulationMode === 'FAIL_CARD') {
      playSound.accessDenied();
      setSession(prev => ({
        ...prev,
        cardScanned: true,
        cardVerified: false,
        failedCardAttempts: prev.failedCardAttempts + 1
      }));
      logAccessAttempt(
        null,
        'ATM_SERVICE',
        'FAILED',
        session.faceVerified ? 'SUCCESS' : 'FAILED',
        'SKIPPED',
        'FAILED',
        'SecureGate ATM Terminal #01',
        'Card chip read failure: Unregistered RFID / EMV magnetic track.'
      );
      triggerAlert(
        'INVALID_CARD',
        'Unrecognized card token detected during ATM insert.',
        'Card hardware auto-ejected. Check user directory.',
        'MEDIUM'
      );
      return { success: false, message: 'Invalid Card. Card signature not registered.' };
    }

    // Match user by card number or default to Anitha
    const matchedUser = users.find(u => {
      const full = u.cardNumber.replace(/\s+/g, '').toLowerCase();
      const cardId = u.cardId.toLowerCase();
      const lastFour = u.maskedCardNumber.slice(-4);
      return (
        full === cleanInput ||
        cardId === cleanInput ||
        cleanInput.includes(lastFour) ||
        cleanInput === '1234' ||
        cleanInput === 'demo'
      );
    }) || users[0];

    if (matchedUser.accountStatus === 'LOCKED' || matchedUser.accountStatus === 'DISABLED') {
      playSound.accessDenied();
      setSession(prev => ({
        ...prev,
        currentUser: matchedUser,
        cardScanned: true,
        cardVerified: false
      }));
      logAccessAttempt(
        matchedUser,
        'ATM_SERVICE',
        'FAILED',
        session.faceVerified ? 'SUCCESS' : 'FAILED',
        'SKIPPED',
        'DENIED',
        'SecureGate ATM Terminal #01',
        `ATM Card blocked: Account status is ${matchedUser.accountStatus}.`
      );
      return { success: false, message: `Access Denied: Card account is ${matchedUser.accountStatus}.` };
    }

    playSound.cardScan();
    
    // Generate Mobile SMS Alert for the cardholder's linked phone number
    const currentAtm = selectedAtm || atms[0];
    const phoneNum = matchedUser.phoneNumber || '9840111234';
    const maskedPh = matchedUser.maskedPhoneNumber || '******1234';
    const smsData: CardSmsAlert = {
      id: `SMS-${Date.now()}`,
      sent: true,
      phoneNumber: phoneNum,
      maskedPhone: maskedPh,
      atmName: currentAtm.name,
      atmLocation: currentAtm.location,
      timestamp: dt.timeWithSeconds || dt.time,
      cardNumberMasked: matchedUser.maskedCardNumber,
      userName: matchedUser.name,
      messageTextEn: `[SECURITY ALERT] Your ATM Card (${matchedUser.maskedCardNumber}) was inserted at ${currentAtm.name} (${currentAtm.location}) at ${dt.time}. If this was not you, block card immediately!`,
      messageTextTa: `[வங்கி எச்சரிக்கை] உங்கள் ஏடிஎம் கார்டு (${matchedUser.maskedCardNumber}) ${currentAtm.name} (${currentAtm.location}) ஏடிஎம்மில் ${dt.time} மணிக்கு உள்ளிடப்பட்டது! நீங்கள் இல்லையெனில் உடனே கார்டை முடக்கவும்.`
    };

    setSession(prev => ({
      ...prev,
      currentUser: matchedUser,
      cardScanned: true,
      cardVerified: true,
      activePinCode: matchedUser.pinCode || '123456',
      cardScanTimestamp: { date: dt.date, time: dt.time },
      cardInsertSmsAlert: smsData
    }));
    setActiveUser(matchedUser);

    // Push notification to security notifications log
    setNotifications(prev => [
      {
        id: `NOTIF-SMS-${Date.now()}`,
        atmId: currentAtm.id,
        atmName: currentAtm.name,
        type: 'SECURITY_BREACH',
        title: `📲 Mobile SMS Alert Sent (${maskedPh})`,
        message: `Card ${matchedUser.maskedCardNumber} inserted at ${currentAtm.name}. Alert SMS dispatched to linked phone ${maskedPh}.`,
        severity: 'LOW',
        timestamp: `${dt.date} ${dt.time}`,
        isRead: false,
        isAcknowledged: true,
        location: currentAtm.location
      },
      ...prev
    ]);

    return { success: true, message: 'Card Verified ✓', user: matchedUser };
  };

  const proceedFromStep2CardToFaceScan = () => {
    stopVoiceGuidance();
    setCurrentStep('FACE_VERIFY' as any);
    setCurrentView('STEP1_FACE');
    playSound.keyPress();
  };

  const proceedFromStep2CardToStep3Pin = () => {
    stopVoiceGuidance();
    setCurrentStep('PIN');
    setCurrentView('STEP3_PIN');
    playSound.keyPress();
  };

  // ==========================================
  // STEP 3: 6-DIGIT PIN VERIFICATION
  // ==========================================
  const handleStep3PinVerify = (pinInput: string) => {
    const dt = getLiveDateTimeString();
    const user = session.currentUser || activeUser || users[0];
    const expectedPin = user.pinCode || session.activePinCode || '123456';

    // Check for Duress / Silent Panic PIN (999999 or 911911)
    if (pinInput === '999999' || pinInput === '911911') {
      playSound.criticalAlarm();
      speakGuidance('DURESS_PANIC_ALARM');
      const panicAtm = selectedAtm || atms[0];
      
      triggerAlert(
        'DURESS_PANIC',
        `🚨 DURESS PANIC PIN ENTERED (${pinInput}) at ${panicAtm.name}! Coercion suspected for cardholder ${user.name}.`,
        'SILENT ALARM DISPATCHED: Tamil Nadu Police Control Room (112) & Bank Cyber Command notified. ATM Camera CCTV recording locked.',
        'CRITICAL',
        user
      );

      // Add emergency notification
      setNotifications(prev => [
        {
          id: `NOTIF-PANIC-${Date.now()}`,
          atmId: panicAtm.id,
          atmName: panicAtm.name,
          type: 'SECURITY_BREACH',
          title: `🚨 SILENT DURESS ALARM: Panic PIN (${pinInput})`,
          message: `Coercion detected at ${panicAtm.name}. Police patrol unit dispatched to ${panicAtm.location}. Camera video feed sent to 112 Control Room.`,
          severity: 'CRITICAL',
          timestamp: `${dt.date} ${dt.time}`,
          isRead: false,
          isAcknowledged: false,
          location: panicAtm.location
        },
        ...prev
      ]);

      setSession(prev => ({
        ...prev,
        pinVerified: true,
        enteredPin: pinInput,
        failedPinAttempts: 0,
        pinVerifiedTimestamp: { date: dt.date, time: dt.time }
      }));

      return {
        success: true,
        isPanicMode: true,
        message: '⚠️ Silent Panic Alarm Activated! Police & Security Command Dispatched.'
      };
    }

    const isPinCorrect =
      demoSimulationMode !== 'FAIL_PIN' &&
      (pinInput === expectedPin || pinInput === '123456' || pinInput === '482910' || pinInput === '000000');

    if (isPinCorrect) {
      playSound.beepSuccess();
      setSession(prev => ({
        ...prev,
        pinVerified: true,
        enteredPin: pinInput,
        failedPinAttempts: 0,
        pinVerifiedTimestamp: { date: dt.date, time: dt.time }
      }));
      return { success: true, message: 'PIN Verified ✓' };
    } else {
      playSound.accessDenied();
      const newFailed = session.failedPinAttempts + 1;
      setSession(prev => ({
        ...prev,
        pinVerified: false,
        failedPinAttempts: newFailed
      }));

      triggerAlert(
        'WRONG_PIN',
        `Incorrect ATM PIN attempt (${newFailed}/3) for cardholder ${user.name}.`,
        'Allow retry or flag suspicious ATM session.',
        newFailed >= 3 ? 'HIGH' : 'LOW',
        user
      );

      return {
        success: false,
        message: newFailed >= 3 ? 'Too many invalid attempts. PIN Locked.' : `Incorrect PIN (${newFailed}/3 attempts).`
      };
    }
  };

  const proceedFromStep3PinToStep4Decision = () => {
    stopVoiceGuidance();
    setCurrentStep('DECISION');
    setCurrentView('STEP4_DECISION');
    playSound.keyPress();
  };

  // ==========================================
  // STEP 4: ACCESS DECISION MATRIX
  // ==========================================
  const evaluateAccessDecision = () => {
    const user = session.currentUser || activeUser || users[0];
    const isCardOk = session.cardVerified;
    const isPinOk = session.pinVerified;
    const isFaceOk = session.faceVerified;

    // Fraud Case: Card Valid + PIN Valid + Face Mismatch (Stolen Card scenario)
    if (isCardOk && isPinOk && !isFaceOk) {
      playSound.accessDenied();
      const reason = `STOLEN CARD ALERT: The ATM card and PIN belong to ${user.name}, but facial biometrics do not match (Face Confidence: ${session.faceConfidence}%). Unauthorized transaction blocked.`;
      
      setSession(prev => ({
        ...prev,
        decision: 'DENIED',
        decisionReason: reason
      }));

      logAccessAttempt(
        user,
        'ATM_WITHDRAWAL',
        'SUCCESS',
        'FAILED',
        'SUCCESS',
        'DENIED',
        'SecureGate ATM Terminal #01',
        'FRAUD BLOCKED: Stolen card attempt detected. Card+PIN passed, but Face mismatch.'
      );

      triggerAlert(
        'STOLEN_CARD_ATTEMPT',
        `CRITICAL SECURITY ALERT: Card + PIN for ${user.name} was entered, but face recognition rejected the user. Cash withdrawal blocked.`,
        'Block transaction, freeze card temporarily, and alert cardholder.',
        'CRITICAL',
        user
      );

      return { granted: false, reason };
    }

    // All Pass Case
    if (isCardOk && isPinOk && isFaceOk) {
      playSound.accessGranted();
      const dt = getLiveDateTimeString();
      const reason = 'ALL 3 FACTORS CONFIRMED: ATM Card, 6-Digit PIN, and Live Biometric Face Identity verified successfully.';

      setSession(prev => ({
        ...prev,
        decision: 'GRANTED',
        decisionReason: reason,
        accessGrantedTimestamp: { date: dt.date, time: dt.time }
      }));

      logAccessAttempt(
        user,
        'ATM_WITHDRAWAL',
        'SUCCESS',
        'SUCCESS',
        'SUCCESS',
        'SUCCESS',
        'SecureGate ATM Terminal #01',
        'Multi-Factor Authentication (Card + PIN + Face) completed. Access Granted.'
      );

      return { granted: true, reason };
    }

    // Generic Failure
    playSound.accessDenied();
    const reason = 'Multi-factor verification incomplete. One or more security factors failed.';
    setSession(prev => ({
      ...prev,
      decision: 'DENIED',
      decisionReason: reason
    }));

    return { granted: false, reason };
  };

  const proceedFromStep4DecisionToStep5Withdrawal = () => {
    stopVoiceGuidance();
    setCurrentStep('WITHDRAWAL');
    setCurrentView('STEP5_WITHDRAWAL');
    playSound.keyPress();
  };

  const retryVerification = () => {
    startAtm5StepFlow();
  };

  // ==========================================
  // STEP 5: CASH WITHDRAWAL
  // ==========================================
  const handleStep5Withdrawal = (amount: number) => {
    const user = session.currentUser || activeUser || users[0];
    const dt = getLiveDateTimeString();

    if (amount <= 0) {
      return { success: false, message: 'Please select a valid withdrawal amount.' };
    }

    // Strict Security Guard: All 3 factors (Card, Registered Face, PIN) must be verified & GRANTED
    if (!session.cardVerified || !session.faceVerified || !session.pinVerified || session.decision !== 'GRANTED') {
      playSound.accessDenied();
      return {
        success: false,
        message: language === 'ta'
          ? '🚨 பரிவர்த்தனை ரத்து செய்யப்பட்டது (TRANSACTION FAILED)! கார்டு, முகப் பொருத்தம் அல்லது PIN சரிபார்ப்பில் ஒன்று தோல்வியடைந்துள்ளது.'
          : '🚨 TRANSACTION FAILED & BLOCKED! Multi-factor authentication incomplete or failed. All 3 checks (Card + Owner Face + PIN) must pass.'
      };
    }

    // Check Active ATM Terminal Cash Reserves
    const currentTerminalAtm = selectedAtm || atms[0];
    if (currentTerminalAtm.cashLevel === 0 || currentTerminalAtm.cashAmount < amount) {
      playSound.accessDenied();
      return {
        success: false,
        message: language === 'ta'
          ? `⚠️ பணம் இருப்பு இல்லை (CASH NOT AVAILABLE): இந்த ATM-ல் தற்போது பணம் இல்லை (${currentTerminalAtm.cashLevel}%). ரீஃபில் வாகனம் அனுப்பப்பட்டுள்ளது. அருகிலுள்ள ATM-க்கு செல்லவும்.`
          : `⚠️ CASH NOT AVAILABLE: ATM vault has insufficient cash (${currentTerminalAtm.cashLevel}% remaining, ₹${(currentTerminalAtm?.cashAmount ?? 0).toLocaleString('en-IN')}). Armored transit team is dispatched. Please visit nearest operational ATM.`
      };
    }

    if (user.atmBalance < amount) {
      playSound.accessDenied();
      return {
        success: false,
        message: `Insufficient balance. Available: ₹${(user?.atmBalance ?? 0).toLocaleString('en-IN')}`
      };
    }

    const newBalance = user.atmBalance - amount;
    const txnId = `DEMO-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTxn: Transaction = {
      transactionId: txnId,
      userId: user.userId,
      userName: user.name,
      type: 'WITHDRAWAL',
      amount,
      timestamp: dt.iso,
      formattedDate: dt.date,
      formattedTime: dt.time,
      status: 'SUCCESS',
      remainingBalance: newBalance,
      faceMatched: true
    };

    playSound.atmCashDispense();

    // Update transactions & user balances
    setTransactions(prev => [newTxn, ...prev]);
    setUsers(prev =>
      prev.map(u => (u.userId === user.userId ? { ...u, atmBalance: newBalance, lastAccessDate: dt.date, lastAccessTime: dt.time } : u))
    );
    if (activeUser?.userId === user.userId) {
      setActiveUser({ ...user, atmBalance: newBalance, lastAccessDate: dt.date, lastAccessTime: dt.time });
    }

    setSession(prev => ({
      ...prev,
      withdrawalAmount: amount,
      dispenseSuccess: true,
      transactionId: txnId
    }));

    // Deduct cash from Active ATM Vault and update live sensors
    const remainingVault = Math.max(0, currentTerminalAtm.cashAmount - amount);
    const newVaultPct = Math.max(0, Math.min(100, Math.round((remainingVault / currentTerminalAtm.cashCapacity) * 100)));
    updateAtmCashLevel(currentTerminalAtm.id, newVaultPct);

    logAccessAttempt(
      user,
      'ATM_WITHDRAWAL',
      'SUCCESS',
      'SUCCESS',
      'SUCCESS',
      'SUCCESS',
      'SecureGate ATM Terminal #01',
      `Cash Dispense ₹${(amount ?? 0).toLocaleString('en-IN')} completed. Txn ID: ${txnId}`
    );

    return {
      success: true,
      message: 'Cash Withdrawal Successful ✓',
      transaction: newTxn
    };
  };

  const finishAtmSession = () => {
    resetVerification();
  };

  // Preset demo shortcut for Stolen Card Imposter scenario
  const triggerStolenCardDemoScenario = () => {
    setDemoSimulationMode('STOLEN_CARD');
    startAtm5StepFlow();
  };

  // Live Webcam Face Scanner Test with automatic SMS & Alarm dispatch
  const testFaceScanner = (forceMismatch: boolean = false) => {
    const dt = getLiveDateTimeString();
    const user = activeUser || users[0]; // Anitha
    const currentAtm = selectedAtm || atms[0];
    const isSuccess = !forceMismatch;
    const confidence = isSuccess ? 98.6 : 41.2;

    const phoneNum = user.phoneNumber || '9840111234';
    const maskedPh = user.maskedPhoneNumber || '******1234';

    const smsData: CardSmsAlert = {
      id: `SMS-FACE-TEST-${Date.now()}`,
      sent: true,
      phoneNumber: phoneNum,
      maskedPhone: maskedPh,
      atmName: currentAtm.name,
      atmLocation: currentAtm.location,
      timestamp: dt.timeWithSeconds || dt.time,
      cardNumberMasked: user.maskedCardNumber,
      userName: user.name,
      messageTextEn: isSuccess
        ? `[CASHGUARD BANK SECURITY ✓] Live Webcam Face Scanner test PASSED at ${currentAtm.name}. Face matched registered cardholder ${user.name} (${confidence}%). PIN authorization enabled.`
        : `🚨 [CRITICAL FRAUD ALARM] Live Webcam Face Scanner test REJECTED at ${currentAtm.name}! Unrecognized face detected (${confidence}%). Card locked, Security Alarm triggered.`,
      messageTextTa: isSuccess
        ? `[வங்கி ஏடிஎம் பாதுகாப்பு உறுதி ✓] ${currentAtm.name} ஏடிஎம்மில் நேரடி கேமரா முக ஸ்கேன் வெற்றி! பதிவு செய்யப்பட்ட வாடிக்கையாளர் ${user.name} முகம் (${confidence}%) சரியாகப் பொருந்தியது.`
        : `🚨 [அவசர பாதுகாப்பு அலாரம்] ${currentAtm.name} ஏடிஎம்மில் அனுமதிக்கப்படாத முகம் கண்டறியப்பட்டது (${confidence}%)! ஏடிஎம் பூட்டப்பட்டு வங்கி மேலாளருக்கு எச்சரிக்கை அனுப்பப்பட்டது.`
    };

    setSession(prev => ({
      ...prev,
      currentUser: user,
      faceScanned: true,
      faceVerified: isSuccess,
      faceConfidence: confidence,
      faceScanTimestamp: { date: dt.date, time: dt.time },
      cardInsertSmsAlert: smsData
    }));

    if (isSuccess) {
      playSound.faceRecognized();
      setNotifications(prev => [
        {
          id: `NOTIF-FACE-TEST-OK-${Date.now()}`,
          atmId: currentAtm.id,
          atmName: currentAtm.name,
          type: 'SECURITY_BREACH',
          title: `👤 Face Scanner Test: Verified (${user.name} - ${confidence}%)`,
          message: `Live webcam facial mesh matched registered profile ${user.name} at ${currentAtm.name}. Confirmation SMS sent to ${maskedPh}.`,
          severity: 'LOW',
          timestamp: `${dt.date} ${dt.time}`,
          isRead: false,
          isAcknowledged: true,
          location: currentAtm.location
        },
        ...prev
      ]);
      speakItem(
        `முக ஸ்கேனர் சோதனை வெற்றி. பதிவு செய்யப்பட்ட நபர் ${user.name} முகம் பொருந்தியது. மொபைலுக்கு SMS எச்சரிக்கை அனுப்பப்பட்டது.`,
        `Face scanner test passed. Registered cardholder ${user.name} matched. SMS alert sent to mobile.`
      );
    } else {
      playSound.criticalAlarm();
      triggerAlert(
        'FACE_MISMATCH',
        `Unrecognized face detected during Live Webcam Face Scanner Test at ${currentAtm.name}. Confidence score: ${confidence}%. Rule enforced: Unrecognized faces rejected with SMS & alarm alert.`,
        'Card locked and immediate security dispatch alerted.',
        'CRITICAL',
        user
      );
      setNotifications(prev => [
        {
          id: `NOTIF-FACE-TEST-FAIL-${Date.now()}`,
          atmId: currentAtm.id,
          atmName: currentAtm.name,
          type: 'SECURITY_BREACH',
          title: `🚨 UNAUTHORIZED FACE REJECTED (${confidence}%)`,
          message: `Unknown face detected at ${currentAtm.name}. Access blocked. Security alarm & SMS dispatched to cardholder ${user.name} (${maskedPh}).`,
          severity: 'CRITICAL',
          timestamp: `${dt.date} ${dt.time}`,
          isRead: false,
          isAcknowledged: false,
          location: currentAtm.location
        },
        ...prev
      ]);
      speakItem(
        `எச்சரிக்கை! முகப் பொருத்தம் தோல்வி. அங்கீகரிக்கப்படாத நபர். அவசர SMS மற்றும் அலாரம் இயக்கப்பட்டது.`,
        `Warning! Face mismatch detected. Unauthorized person. Emergency SMS and alarm dispatched.`
      );
    }

    return { success: isSuccess, confidence, sms: smsData };
  };

  // Quick pass demo feature for college presentations
  const quickPassDemo = () => {
    const dt = getLiveDateTimeString();
    const targetUser = users[0]; // Anitha
    setActiveUser(targetUser);
    setSession({
      currentUser: targetUser,
      faceScanned: true,
      faceVerified: true,
      faceConfidence: 98.4,
      faceScanTimestamp: { date: dt.date, time: dt.time },
      cardScanned: true,
      cardVerified: true,
      cardScanTimestamp: { date: dt.date, time: dt.time },
      pinVerified: true,
      enteredPin: '123456',
      activePinCode: '123456',
      pinVerifiedTimestamp: { date: dt.date, time: dt.time },
      decision: 'GRANTED',
      decisionReason: 'All 3 security factors passed (Card + PIN + Face).',
      withdrawalAmount: 2000,
      dispenseSuccess: false,
      transactionId: undefined,
      activeOtpCode: '482910',
      otpVerified: true,
      verificationId: generateVerificationId(),
      targetService: 'ATM',
      failedPinAttempts: 0,
      failedOtpAttempts: 0,
      failedCardAttempts: 0,
      failedFaceAttempts: 0,
      isSecurityLocked: false,
      accessGrantedTimestamp: { date: dt.date, time: dt.time }
    });
    setCurrentStep('DECISION');
    setCurrentView('STEP4_DECISION');
    playSound.accessGranted();
  };

  // Backwards compatibility functions
  const handleCardScanned = (cardInput: string) => handleStep2CardScan(cardInput);
  const confirmCardAndProceedToFace = () => proceedFromStep2CardToStep3Pin();
  const handleFaceVerification = (customSuccess?: boolean) => handleStep1FaceVerification(customSuccess);
  const proceedToOtp = () => proceedFromStep2CardToStep3Pin();
  const handleVerifyOtp = (enteredOtp: string) => handleStep3PinVerify(enteredOtp);
  const resendOtp = () => '123456';
  const completeAccessGranted = (target?: 'LAB' | 'ATM') => {
    if (target === 'LAB') setCurrentView('SECURE_LAB');
    else if (target === 'ATM') setCurrentView('STEP5_WITHDRAWAL');
    else setCurrentView('DASHBOARD');
  };
  const unlockLabDoor = () => {
    playSound.doorLockUnlock();
    setIsDoorLocked(false);
  };
  const lockLabDoor = () => {
    playSound.doorLockUnlock();
    setIsDoorLocked(true);
  };
  const processAtmWithdrawal = (amount: number) => handleStep5Withdrawal(amount);
  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => (a.alertId === alertId ? { ...a, status: 'RESOLVED' } : a)));
  };
  const toggleUserAccountStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.userId === userId) {
          const nextStatus = u.accountStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
          return { ...u, accountStatus: nextStatus };
        }
        return u;
      })
    );
  };
  const addUser = (userData: Omit<User, 'userId' | 'createdAt'>) => {
    const dt = getLiveDateTimeString();
    const newUser: User = {
      ...userData,
      userId: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: dt.date
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const updateUserProfilePhoto = (userId: string, photoDataUrl: string) => {
    setUsers(prev => {
      const next = prev.map(u => (u.userId === userId ? { ...u, faceImageUrl: photoDataUrl } : u));
      try {
        const existing = localStorage.getItem(LOCAL_STORAGE_PHOTOS_KEY);
        const dict: Record<string, string> = existing ? JSON.parse(existing) : {};
        dict[userId] = photoDataUrl;
        localStorage.setItem(LOCAL_STORAGE_PHOTOS_KEY, JSON.stringify(dict));
      } catch (e) {
        console.warn('Could not save user photo to localStorage:', e);
      }
      return next;
    });

    setActiveUser(prev => {
      if (prev && prev.userId === userId) {
        return { ...prev, faceImageUrl: photoDataUrl };
      }
      return prev;
    });

    setSession(prev => {
      if (prev.currentUser && prev.currentUser.userId === userId) {
        return {
          ...prev,
          currentUser: { ...prev.currentUser, faceImageUrl: photoDataUrl }
        };
      }
      return prev;
    });
  };

  const resetUserProfilePhoto = (userId: string) => {
    const defaultUser = INITIAL_USERS.find(u => u.userId === userId);
    const defaultPhoto = defaultUser?.faceImageUrl || '';
    updateUserProfilePhoto(userId, defaultPhoto);
  };

  const updateUserPinCode = (userId: string, newPin: string) => {
    setUsers(prev => {
      const next = prev.map(u => (u.userId === userId ? { ...u, pinCode: newPin } : u));
      try {
        const existing = localStorage.getItem(LOCAL_STORAGE_PINS_KEY);
        const dict: Record<string, string> = existing ? JSON.parse(existing) : {};
        dict[userId] = newPin;
        localStorage.setItem(LOCAL_STORAGE_PINS_KEY, JSON.stringify(dict));
      } catch (e) {
        console.warn('Could not save user PIN to localStorage:', e);
      }
      return next;
    });

    setActiveUser(prev => {
      if (prev && prev.userId === userId) {
        return { ...prev, pinCode: newPin };
      }
      return prev;
    });

    setSession(prev => {
      if (prev.currentUser && prev.currentUser.userId === userId) {
        return {
          ...prev,
          activePinCode: newPin,
          currentUser: { ...prev.currentUser, pinCode: newPin }
        };
      }
      return prev;
    });
  };

  const unlockSecurityLock = () => {
    setSession(prev => ({
      ...prev,
      isSecurityLocked: false,
      failedPinAttempts: 0,
      failedOtpAttempts: 0,
      failedCardAttempts: 0,
      failedFaceAttempts: 0,
      lockReason: undefined
    }));
    setCurrentView('WELCOME');
  };

  // Active critical alarm ATM (< 30% cash level)
  const activeAlarmAtm = atms.find(a => a.cashLevel < 30) || null;

  // I18N translation helper
  const t = useCallback((key: keyof typeof I18N['en']): string => {
    const dict = I18N[language] || I18N['en'];
    return (dict as Record<string, string>)[key] || I18N['en'][key] || String(key);
  }, [language]);

  const setLanguage = (lang: 'en' | 'ta') => {
    setLanguageState(lang);
    setVoiceLanguage(lang);
  };

  const silenceAlarm = () => {
    setIsSirenAudible(false);
  };

  const dismissCriticalModal = () => {
    setShowCriticalModal(false);
  };

  const acknowledgeNotification = (notifId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, isAcknowledged: true, isRead: true } : n))
    );
  };

  const triggerEmergencyAlarm = (atmId: string) => {
    updateAtmCashLevel(atmId, 22);
  };

  const updateAtmCashLevel = (atmId: string, newPercentage: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newPercentage)));
    const targetAtm = atms.find(a => a.id === atmId);
    if (!targetAtm) return;

    const oldLevel = targetAtm.cashLevel;
    const isDroppingBelow30 = clamped < 30 && oldLevel >= 30;
    const isRisingAbove30 = clamped >= 30 && oldLevel < 30;

    let newStatus: ATMStatus = 'NORMAL';
    if (clamped === 0) {
      newStatus = 'OFFLINE';
    } else if (clamped <= 10) {
      newStatus = 'CRITICAL';
    } else if (clamped <= 30) {
      newStatus = 'LOW_CASH';
    }

    const newAmount = Math.round((clamped / 100) * targetAtm.cashCapacity);
    const ratio = clamped / 100;

    const updatedCassettes = {
      d2000: { ...targetAtm.cassettes.d2000, notesCount: Math.round(targetAtm.cassettes.d2000.maxNotes * ratio), amount: Math.round(targetAtm.cassettes.d2000.maxNotes * ratio * 2000) },
      d500: { ...targetAtm.cassettes.d500, notesCount: Math.round(targetAtm.cassettes.d500.maxNotes * ratio), amount: Math.round(targetAtm.cassettes.d500.maxNotes * ratio * 500) },
      d200: { ...targetAtm.cassettes.d200, notesCount: Math.round(targetAtm.cassettes.d200.maxNotes * ratio), amount: Math.round(targetAtm.cassettes.d200.maxNotes * ratio * 200) },
      d100: { ...targetAtm.cassettes.d100, notesCount: Math.round(targetAtm.cassettes.d100.maxNotes * ratio), amount: Math.round(targetAtm.cassettes.d100.maxNotes * ratio * 100) }
    };

    const updatedAtm: ATM = {
      ...targetAtm,
      cashLevel: clamped,
      cashAmount: newAmount,
      status: newStatus,
      isOnline: clamped > 0,
      cassettes: updatedCassettes,
      lastUpdated: 'Just now (Live sensor telemetry updated)'
    };

    setAtms(prev => prev.map(a => (a.id === atmId ? updatedAtm : a)));
    if (selectedAtm?.id === atmId) {
      setSelectedAtm(updatedAtm);
    }

    // Explicit 0% Cash Level Rule: ATM CASH EMPTY ALERT
    if (clamped === 0) {
      setIsSirenAudible(true);
      setShowCriticalModal(true);
      if (soundOn) {
        playSound.lowCashAlarmSiren();
      }
      speakGuidance('CRITICAL_CASH_ALARM');

      const emptyNotif: SecurityNotification = {
        id: `NOTIF-${Date.now()}`,
        atmId: targetAtm.id,
        atmName: targetAtm.name,
        type: 'CRITICAL_CASH',
        title: `ATM CASH EMPTY ALERT: ${targetAtm.id} (${targetAtm.name})`,
        message: `ATM CASH EMPTY ALERT dispatched to Bank Administrator & ATM Maintenance Team. Vault balance is 0%. Cash withdrawal disabled. Immediate CIT dispatch required!`,
        severity: 'CRITICAL',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        isAcknowledged: false,
        location: targetAtm.location,
        cashLevel: 0,
        requiresAction: true
      };
      setNotifications(prev => [emptyNotif, ...prev]);

      triggerAlert(
        'CRITICAL_DEPLETION',
        `ATM CASH EMPTY ALERT: ${targetAtm.name} (${targetAtm.id}) cash level reached 0%. Sent to Bank Administrator & Maintenance Team.`,
        'Dispatch emergency cash van immediately and mark terminal out-of-cash on customer view.',
        'CRITICAL'
      );
    } else if (clamped < 30) {
      setIsSirenAudible(true);
      setShowCriticalModal(true);
      if (soundOn) {
        playSound.lowCashAlarmSiren();
      }
      speakGuidance('CRITICAL_CASH_ALARM');

      if (isDroppingBelow30 || oldLevel >= 30) {
        const newNotif: SecurityNotification = {
          id: `NOTIF-${Date.now()}`,
          atmId: targetAtm.id,
          atmName: targetAtm.name,
          type: 'CRITICAL_CASH',
          title: `CRITICAL ALARM: ${targetAtm.name} Cash < 30% (${clamped}%)`,
          message: `Sensor detected cash dropped below threshold (${clamped}% remaining, ₹${(newAmount ?? 0).toLocaleString('en-IN')}). Dispatched to Bank Administrator & Maintenance Team.`,
          severity: 'CRITICAL',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
          isAcknowledged: false,
          location: targetAtm.location,
          cashLevel: clamped,
          requiresAction: true
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    } else if (isRisingAbove30) {
      setIsSirenAudible(false);
      setShowCriticalModal(false);
    }
  };

  const simulateDropBelow30 = (atmId: string, targetPct: number = 24) => {
    const atm = atms.find(a => a.id === atmId) || atms[0];
    setSelectedAtm(atm);
    updateAtmCashLevel(atm.id, targetPct);
  };

  const simulateAtmWithdrawal = (atmId: string, amount: number) => {
    const targetAtm = atms.find(a => a.id === atmId);
    if (!targetAtm) return { success: false, newLevel: 0, alarmTriggered: false };

    if (targetAtm.cashAmount < amount) {
      return { success: false, newLevel: targetAtm.cashLevel, alarmTriggered: false };
    }

    const newAmount = Math.max(0, targetAtm.cashAmount - amount);
    const newPct = Math.round((newAmount / targetAtm.cashCapacity) * 100);

    playSound.atmCashDispense();
    updateAtmCashLevel(atmId, newPct);

    const newTxn: Transaction = {
      transactionId: `TXN-${Date.now()}`,
      userId: 'MGR-DEMO',
      userName: 'ATM Cash Dispense Sensor',
      atmId: targetAtm.id,
      amount,
      type: 'WITHDRAWAL',
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      formattedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      remainingBalance: newAmount
    };
    setTransactions(prev => [newTxn, ...prev]);

    return {
      success: true,
      newLevel: newPct,
      alarmTriggered: newPct < 30
    };
  };

  const refillAtm = (atmId: string) => {
    const targetAtm = atms.find(a => a.id === atmId);
    if (!targetAtm) return;

    const fullCassettes = {
      d2000: { ...targetAtm.cassettes.d2000, notesCount: targetAtm.cassettes.d2000.maxNotes, amount: targetAtm.cassettes.d2000.maxNotes * 2000 },
      d500: { ...targetAtm.cassettes.d500, notesCount: targetAtm.cassettes.d500.maxNotes, amount: targetAtm.cassettes.d500.maxNotes * 500 },
      d200: { ...targetAtm.cassettes.d200, notesCount: targetAtm.cassettes.d200.maxNotes, amount: targetAtm.cassettes.d200.maxNotes * 200 },
      d100: { ...targetAtm.cassettes.d100, notesCount: targetAtm.cassettes.d100.maxNotes, amount: targetAtm.cassettes.d100.maxNotes * 100 }
    };

    const refilled: ATM = {
      ...targetAtm,
      cashLevel: 100,
      cashAmount: targetAtm.cashCapacity,
      status: 'NORMAL',
      cassettes: fullCassettes,
      lastRefillDate: 'Just now (' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ')',
      lastUpdated: 'Just now (Full Refill 100% Complete)'
    };

    setAtms(prev => prev.map(a => (a.id === atmId ? refilled : a)));
    if (selectedAtm?.id === atmId) {
      setSelectedAtm(refilled);
    }

    setIsSirenAudible(false);
    setShowCriticalModal(false);
    playSound.refillSuccess();
    speakGuidance('REFILL_COMPLETED');

    const notif: SecurityNotification = {
      id: `NOTIF-${Date.now()}`,
      atmId: targetAtm.id,
      atmName: targetAtm.name,
      type: 'REFILL_COMPLETED',
      title: `Refill Complete: ${targetAtm.name} restored to 100%`,
      message: `Cash replenishment complete. Total ₹${(targetAtm?.cashCapacity ?? 0).toLocaleString('en-IN')} loaded into cassettes. Optical sensors calibrated.`,
      severity: 'LOW',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      isAcknowledged: true,
      location: targetAtm.location,
      cashLevel: 100,
      requiresAction: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const dispatchRefillTeam = (teamId: string, atmId: string, customCash?: number) => {
    const targetAtm = atms.find(a => a.id === atmId);
    const amountToRefill = customCash || (targetAtm ? targetAtm.cashCapacity - targetAtm.cashAmount : 2500000);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    setRefillTeams(prev =>
      prev.map(t => {
        if (t.id === teamId) {
          return {
            ...t,
            assignedAtmId: atmId,
            currentStatus: 'EN_ROUTE',
            etaMinutes: Math.floor(10 + Math.random() * 15),
            assignedCashAmount: amountToRefill,
            dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            otpCode: newOtp
          };
        }
        return t;
      })
    );

    if (soundOn) {
      playSound.alertChime();
    }
    speakGuidance('REFILL_DISPATCHED');

    const notif: SecurityNotification = {
      id: `NOTIF-${Date.now()}`,
      atmId,
      atmName: targetAtm?.name || 'ATM',
      type: 'REFILL_DISPATCHED',
      title: `Cash Van Dispatched to ${targetAtm?.name || atmId}`,
      message: `Armored Transit Team dispatched with ₹${(amountToRefill ?? 0).toLocaleString('en-IN')}. Vault unlocking OTP: ${newOtp}.`,
      severity: 'LOW',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      isAcknowledged: true,
      location: targetAtm?.location || 'Chennai',
      cashLevel: targetAtm?.cashLevel || 20,
      requiresAction: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  return (
    <SecurityContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentStep,
        setCurrentStep,
        session,
        users,
        activeUser,
        setActiveUser,
        isAdmin,
        setIsAdmin,
        accessLogs,
        transactions,
        alerts,
        liveDateTime,
        isDoorLocked,
        soundOn,
        setSoundOn,
        demoSimulationMode,
        setDemoSimulationMode,

        // CashGuard AI Fleet & Sensor Operations
        atms,
        selectedAtm,
        setSelectedAtm,
        refillTeams,
        notifications,
        aiPredictions,
        managerProfile,
        activeAlarmAtm,
        isSirenAudible,
        language,
        setLanguage,
        t,
        showCriticalModal,
        setShowCriticalModal,
        isRefillModalOpen,
        refillModalAtm,
        openRefillModal,
        closeRefillModal,
        isManagerLoginOpen,
        setIsManagerLoginOpen,
        isHowItWorksOpen,
        setIsHowItWorksOpen,
        isCashAvailable,
        updateAtmCashLevel,
        simulateDropBelow30,
        simulateAtmWithdrawal,
        refillAtm,
        dispatchRefillTeam,
        silenceAlarm,
        triggerEmergencyAlarm,
        acknowledgeNotification,
        dismissCriticalModal,

        voiceLanguage,
        setVoiceLanguage,
        voiceSpeed,
        setVoiceSpeed,
        voiceVolume,
        setVoiceVolume,
        voicePitch,
        setVoicePitch,
        voiceMuted,
        setVoiceMuted,
        autoAnnounceScreen,
        setAutoAnnounceScreen,
        readAloudNonReaders,
        setReadAloudNonReaders,
        isVoiceSettingsOpen,
        setIsVoiceSettingsOpen,
        isSpeaking,
        currentVoiceKey,
        speakGuidance,
        speakCustomText,
        speakItem,
        replayCurrentVoice,
        stopSpeech,
        navigateTo,
        startVerification,
        startAtm5StepFlow,
        resetVerification,
        handleStep1FaceVerification,
        proceedFromStep1FaceToStep2Card,
        handleStep2CardScan,
        proceedFromStep2CardToStep3Pin,
        proceedFromStep2CardToFaceScan,
        handleStep3PinVerify,
        proceedFromStep3PinToStep4Decision,
        evaluateAccessDecision,
        proceedFromStep4DecisionToStep5Withdrawal,
        retryVerification,
        handleStep5Withdrawal,
        finishAtmSession,
        handleCardScanned,
        confirmCardAndProceedToFace,
        handleFaceVerification,
        proceedToOtp,
        handleVerifyOtp,
        resendOtp,
        completeAccessGranted,
        unlockLabDoor,
        lockLabDoor,
        processAtmWithdrawal,
        resolveAlert,
        toggleUserAccountStatus,
        addUser,
        updateUserProfilePhoto,
        resetUserProfilePhoto,
        updateUserPinCode,
        unlockSecurityLock,
        quickPassDemo,
        triggerStolenCardDemoScenario,
        testFaceScanner
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
