// High-Fidelity Bilingual Voice Guidance Engine for CashGuard AI & SecureGate MFA
// Supports Natural Tamil (தமிழ் - ta-IN / ta-LK / Google தமிழ் / Microsoft Valluvar) and English (en-IN / en-US / en-GB)

export type VoiceLanguage = 'en' | 'ta';

export type VoiceGuidanceKey =
  | 'WELCOME_GREETING'
  | 'VOICE_TEST'
  | 'STEP1_CARD_PROMPT'
  | 'STEP1_CARD_SUCCESS'
  | 'STEP1_CARD_MISMATCH'
  | 'STEP2_FACE_PROMPT'
  | 'STEP2_FACE_SUCCESS'
  | 'STEP1_FACE_PROMPT'
  | 'STEP1_FACE_SUCCESS'
  | 'STEP2_CARD_PROMPT'
  | 'STEP2_CARD_SUCCESS'
  | 'STEP2_CARD_MISMATCH'
  | 'STEP3_PIN_PROMPT'
  | 'STEP3_PIN_SUCCESS'
  | 'STEP3_OTP_PROMPT'
  | 'STEP3_OTP_SUCCESS'
  | 'STEP3_PIN_INCORRECT'
  | 'STEP3_PIN_LOCKED'
  | 'STEP4_ACCESS_DECISION_PROMPT'
  | 'STEP4_ACCESS_GRANTED'
  | 'STEP4_FACE_MISMATCH'
  | 'STEP4_ACCESS_DENIED'
  | 'STEP5_WITHDRAWAL_PROMPT'
  | 'STEP5_CASH_PROMPT'
  | 'STEP5_CASH_DISPENSING'
  | 'STEP5_WITHDRAWAL_SUCCESS'
  | 'STEP5_THANK_YOU'
  | 'CRITICAL_CASH_ALARM'
  | 'LOW_CASH_WARNING'
  | 'REFILL_DISPATCHED'
  | 'REFILL_COMPLETED'
  | 'CASH_NOT_AVAILABLE'
  | 'UNAUTHORIZED_FACE'
  | 'UPI_QR_OPEN'
  | 'UPI_PIN_PROMPT'
  | 'UPI_SUCCESS'
  | 'DURESS_PANIC_ALARM'
  | 'SOS_CALL_CONNECTING'
  | 'ATM_SWITCHED'
  | 'SENSOR_LEVEL_SET'
  | 'LANGUAGE_SWITCHED'
  | 'NAV_DASHBOARD'
  | 'NAV_SENSORS'
  | 'NAV_LOGISTICS'
  | 'NAV_ALERTS'
  | 'NAV_MAP';

export interface VoiceMessage {
  en: string;
  ta: string;
  titleEn: string;
  titleTa: string;
}

// Master Voice Guidance Dictionary - Natural, Respectful Banking Terminology
export const VOICE_PROMPTS: Record<VoiceGuidanceKey, VoiceMessage> = {
  WELCOME_GREETING: {
    en: 'Welcome to SecureGate A T M. Please insert your card or select Cardless U P I cash withdrawal.',
    ta: 'SecureGate ஏடிஎம்மிற்கு வரவேற்கிறோம். தயவுசெய்து உங்கள் ஏடிஎம் கார்டை உள்ளிடவும் அல்லது கார்ட்லெஸ் யூபிஐ-ஐ தேர்வு செய்யவும்.',
    titleEn: 'ATM Welcome Terminal',
    titleTa: 'ஏடிஎம் முனையம்'
  },
  VOICE_TEST: {
    en: 'Voice guidance test. Volume and speed settings are functioning normally.',
    ta: 'குரல் வழிகாட்டுதல் சோதனை. ஒலி அளவு மற்றும் பேசும் வேகம் சரியாக அமைக்கப்பட்டுள்ளன.',
    titleEn: 'Voice Test',
    titleTa: 'குரல் சோதனை'
  },
  STEP1_CARD_PROMPT: {
    en: 'Step 1: Please scan or insert your A T M card.',
    ta: 'படி 1: தயவுசெய்து உங்கள் ஏடிஎம் கார்டை உள்ளிடவும்.',
    titleEn: 'Step 1: Card Scan',
    titleTa: 'படி 1: ஏடிஎம் கார்டு'
  },
  STEP1_CARD_SUCCESS: {
    en: 'Card verified successfully. Registered account details matched.',
    ta: 'கார்டு வெற்றிகரமாக சரிபார்க்கப்பட்டது.',
    titleEn: 'Card Verified',
    titleTa: 'கார்டு சரிபார்க்கப்பட்டது'
  },
  STEP1_CARD_MISMATCH: {
    en: 'Card mismatch warning. Unregistered card detected.',
    ta: 'எச்சரிக்கை. பதிவு செய்யப்படாத கார்டு.',
    titleEn: 'Card Mismatch',
    titleTa: 'கார்டு பொருந்தவில்லை'
  },
  STEP2_FACE_PROMPT: {
    en: 'Step 2: Please look directly at the camera for biometric face verification.',
    ta: 'படி 2: தயவுசெய்து கேமராவை நேராகப் பார்த்து முக சரிபார்ப்பை முடிக்கவும்.',
    titleEn: 'Step 2: Face Recognition',
    titleTa: 'படி 2: முக அங்கீகாரம்'
  },
  STEP2_FACE_SUCCESS: {
    en: 'Face recognized successfully. Identity verified.',
    ta: 'முக அடையாளம் வெற்றிகரமாக சரிபார்க்கப்பட்டது.',
    titleEn: 'Face Verified',
    titleTa: 'முக சரிபார்ப்பு வெற்றி'
  },
  STEP1_FACE_PROMPT: {
    en: 'Please look directly at the camera for biometric face verification.',
    ta: 'தயவுசெய்து கேமராவை நேராகப் பார்த்து முக சரிபார்ப்பை முடிக்கவும்.',
    titleEn: 'Face Recognition',
    titleTa: 'முக அங்கீகாரம்'
  },
  STEP1_FACE_SUCCESS: {
    en: 'Face recognized successfully. Identity verified.',
    ta: 'முக அடையாளம் வெற்றிகரமாக சரிபார்க்கப்பட்டது.',
    titleEn: 'Face Verified',
    titleTa: 'முக சரிபார்ப்பு வெற்றி'
  },
  STEP2_CARD_PROMPT: {
    en: 'Please scan or insert your A T M card.',
    ta: 'தயவுசெய்து உங்கள் ஏடிஎம் கார்டை உள்ளிடவும்.',
    titleEn: 'Card Scan',
    titleTa: 'ஏடிஎம் கார்டு'
  },
  STEP2_CARD_SUCCESS: {
    en: 'Card verified successfully. Account details matched.',
    ta: 'கார்டு வெற்றிகரமாக சரிபார்க்கப்பட்டது.',
    titleEn: 'Card Verified',
    titleTa: 'கார்டு சரிபார்க்கப்பட்டது'
  },
  STEP2_CARD_MISMATCH: {
    en: 'Card mismatch warning.',
    ta: 'எச்சரிக்கை. கார்டு பொருந்தவில்லை.',
    titleEn: 'Card Mismatch',
    titleTa: 'கார்டு பொருந்தவில்லை'
  },
  STEP3_PIN_PROMPT: {
    en: 'Please enter your secret 6-digit P I N.',
    ta: 'தயவுசெய்து உங்கள் ஆறு இலக்க ரகசிய பின் எண்ணை உள்ளிடவும்.',
    titleEn: 'Step 3: PIN Verification',
    titleTa: 'படி 3: பின் சரிபார்ப்பு'
  },
  STEP3_PIN_SUCCESS: {
    en: 'P I N verified successfully.',
    ta: 'பின் எண் வெற்றிகரமாக சரிபார்க்கப்பட்டது.',
    titleEn: 'PIN Verified',
    titleTa: 'பின் சரிபார்ப்பு முடிந்தது'
  },
  STEP3_OTP_PROMPT: {
    en: 'Please enter the O T P sent to your mobile.',
    ta: 'தயவுசெய்து உங்கள் மொபைலுக்கு வந்த ஓடிபி எண்ணை உள்ளிடவும்.',
    titleEn: 'Step 3: OTP Verification',
    titleTa: 'படி 3: ஓடிபி சரிபார்ப்பு'
  },
  STEP3_OTP_SUCCESS: {
    en: 'O T P verified successfully.',
    ta: 'ஓடிபி வெற்றிகரமாக சரிபார்க்கப்பட்டது.',
    titleEn: 'OTP Verified',
    titleTa: 'ஓடிபி சரிபார்ப்பு முடிந்தது'
  },
  STEP3_PIN_INCORRECT: {
    en: 'Incorrect P I N. Please check and try again.',
    ta: 'தவறான பின் எண். தயவுசெய்து மீண்டும் சரியாக உள்ளிடவும்.',
    titleEn: 'Incorrect PIN',
    titleTa: 'தவறான பின் எண்'
  },
  STEP3_PIN_LOCKED: {
    en: 'Account temporarily locked due to multiple incorrect P I N attempts.',
    ta: 'தொடர்ந்து தவறான பின் உள்ளிடப்பட்டதால் கணக்கு தற்காலிகமாக முடக்கப்பட்டது.',
    titleEn: 'Account Locked',
    titleTa: 'கணக்கு முடக்கப்பட்டது'
  },
  STEP4_ACCESS_DECISION_PROMPT: {
    en: 'Please wait while your access decision is being evaluated.',
    ta: 'உங்கள் அணுகல் சரிபார்க்கப்படுகிறது, தயவுசெய்து காத்திருக்கவும்.',
    titleEn: 'Step 4: Access Decision',
    titleTa: 'படி 4: அணுகல் முடிவு'
  },
  STEP4_ACCESS_GRANTED: {
    en: 'All verifications passed. Access granted successfully.',
    ta: 'அனைத்து சரிபார்ப்புகளும் வெற்றி. அணுகல் அனுமதிக்கப்பட்டது.',
    titleEn: 'Access Granted',
    titleTa: 'அணுகல் அனுமதிக்கப்பட்டது'
  },
  STEP4_FACE_MISMATCH: {
    en: 'Security Alert! Facial recognition mismatch. Transaction blocked.',
    ta: 'எச்சரிக்கை. முக அடையாளம் பொருந்தவில்லை. பரிவர்த்தனை ரத்து செய்யப்படுகிறது.',
    titleEn: 'Face Mismatch',
    titleTa: 'முகப் பொருத்தம் இல்லை'
  },
  STEP4_ACCESS_DENIED: {
    en: 'Access denied. Security requirements not met.',
    ta: 'பாதுகாப்பு காரணங்களால் இந்த பரிவர்த்தனை தடுக்கப்பட்டுள்ளது.',
    titleEn: 'Access Denied',
    titleTa: 'அணுகல் மறுக்கப்பட்டது'
  },
  STEP5_WITHDRAWAL_PROMPT: {
    en: 'Please select the amount you wish to withdraw.',
    ta: 'நீங்கள் எடுக்க விரும்பும் பணத் தொகையை தேர்வு செய்யவும்.',
    titleEn: 'Step 5: Cash Withdrawal',
    titleTa: 'படி 5: பணம் எடுத்தல்'
  },
  STEP5_CASH_PROMPT: {
    en: 'Please select or enter the withdrawal amount in multiples of 100.',
    ta: 'நீங்கள் எடுக்க விரும்பும் பணத் தொகையை தேர்வு செய்யவும்.',
    titleEn: 'Select Amount',
    titleTa: 'தொகையை தேர்வு செய்க'
  },
  STEP5_CASH_DISPENSING: {
    en: 'Cash is dispensing. Please wait and do not remove your card.',
    ta: 'பணம் விநியோகிக்கப்படுகிறது. தயவுசெய்து காத்திருக்கவும்.',
    titleEn: 'Dispensing Cash',
    titleTa: 'பணம் விநியோகம்'
  },
  STEP5_WITHDRAWAL_SUCCESS: {
    en: 'Cash withdrawal successful. Please collect your cash and card.',
    ta: 'பணம் வெற்றிகரமாக எடுக்கப்பட்டது. தயவுசெய்து உங்கள் பணத்தையும் கார்டையும் பெற்றுக்கொள்ளவும்.',
    titleEn: 'Withdrawal Complete',
    titleTa: 'பணம் எடுக்கப்பட்டது'
  },
  STEP5_THANK_YOU: {
    en: 'Thank you for banking with SecureGate A T M. Have a pleasant day.',
    ta: 'SecureGate ஏடிஎம் சேவையைப் பயன்படுத்தியதற்கு நன்றி. நல்வரவு!',
    titleEn: 'Thank You',
    titleTa: 'நன்றி'
  },
  CRITICAL_CASH_ALARM: {
    en: 'Critical Alert! A T M cash dropped below thirty percent. Immediate refill required.',
    ta: 'அவசர எச்சரிக்கை! ஏடிஎம்மில் பணம் முப்பது சதவீதத்திற்கும் குறைவாக உள்ளது. உடனடியாக பணம் நிரப்பவும்.',
    titleEn: 'Critical Alarm (<30%)',
    titleTa: 'அவசர அலாரம் (<30% பணம்)'
  },
  LOW_CASH_WARNING: {
    en: 'Attention Bank Manager. A T M cash level is running low.',
    ta: 'வங்கி மேலாளர் கவனத்திற்கு. ஏடிஎம்மில் பணம் குறைவாக உள்ளது.',
    titleEn: 'Low Cash Warning',
    titleTa: 'குறைந்த பணம் எச்சரிக்கை'
  },
  REFILL_DISPATCHED: {
    en: 'Armored cash refill vehicle has been dispatched to the A T M.',
    ta: 'பணம் நிரப்பும் பாதுகாப்பு வாகனம் ஏடிஎம்மிற்கு புறப்பட்டுள்ளது.',
    titleEn: 'Cash Van Dispatched',
    titleTa: 'ரீஃபில் வாகனம் புறப்பட்டது'
  },
  REFILL_COMPLETED: {
    en: 'A T M cash replenishment complete. All cassettes restored to one hundred percent.',
    ta: 'ஏடிஎம்மில் பணம் நூறு சதவீதம் முழுமையாக நிரப்பப்பட்டது.',
    titleEn: 'Cash Refilled 100%',
    titleTa: 'பணம் நிரப்பப்பட்டது'
  },
  CASH_NOT_AVAILABLE: {
    en: 'Cash is currently not available in this A T M. Please visit nearby branch.',
    ta: 'இந்த ஏடிஎம்மில் தற்போது பணம் இருப்பு இல்லை. அருகிலுள்ள ஏடிஎம்மை பயன்படுத்தவும்.',
    titleEn: 'Cash Not Available',
    titleTa: 'பணம் இருப்பு இல்லை'
  },
  UNAUTHORIZED_FACE: {
    en: 'Warning! Unauthorized person detected. Access blocked.',
    ta: 'எச்சரிக்கை! அங்கீகரிக்கப்படாத முகம். அணுகல் மறுக்கப்பட்டது.',
    titleEn: 'Unauthorized Face',
    titleTa: 'அங்கீகரிக்கப்படாத முகம்'
  },
  UPI_QR_OPEN: {
    en: 'Cardless U P I cash withdrawal. Scan the Q R code using Google Pay or PhonePe.',
    ta: 'கார்டு இல்லா யூபிஐ பணம் எடுத்தல். கூகுள் பே அல்லது போன்பே மூலம் க்யூஆர் கோடை ஸ்கேன் செய்யவும்.',
    titleEn: 'Cardless UPI QR',
    titleTa: 'கார்ட்லெஸ் UPI QR'
  },
  UPI_PIN_PROMPT: {
    en: 'Please enter your secret U P I P I N on your mobile phone.',
    ta: 'தயவுசெய்து உங்கள் மொபைலில் ரகசிய யூபிஐ பின்னை உள்ளிடவும்.',
    titleEn: 'UPI PIN Prompt',
    titleTa: 'UPI PIN உள்ளிடுக'
  },
  UPI_SUCCESS: {
    en: 'U P I payment confirmed successfully. Dispensing cash now.',
    ta: 'யூபிஐ கட்டணம் வெற்றிகரமாக பெறப்பட்டது. பணம் விநியோகிக்கப்படுகிறது.',
    titleEn: 'UPI Success',
    titleTa: 'UPI வெற்றி'
  },
  DURESS_PANIC_ALARM: {
    en: 'Silent duress alarm activated. Police control room 112 and bank security alerted.',
    ta: 'அவசர எச்சரிக்கை செயல்படுத்தப்பட்டது. காவல் கட்டுப்பாட்டு அறை ஒன்று ஒன்று இரண்டிற்கு தகவல் தெரிவிக்கப்பட்டது.',
    titleEn: 'Silent Panic Alarm',
    titleTa: 'அமைதியான அவசர அலாரம்'
  },
  SOS_CALL_CONNECTING: {
    en: 'Connecting emergency police line 112 and security command center.',
    ta: 'காவல்துறை அவசர எண் ஒன்று ஒன்று இரண்டு இணைக்கப்படுகிறது.',
    titleEn: 'Emergency SOS',
    titleTa: 'அவசர SOS அழைப்பு'
  },
  ATM_SWITCHED: {
    en: 'Switched to selected A T M terminal.',
    ta: 'தேர்வு செய்யப்பட்ட ஏடிஎம் முனையத்திற்கு மாற்றப்பட்டது.',
    titleEn: 'ATM Switched',
    titleTa: 'ஏடிஎம் மாற்றப்பட்டது'
  },
  SENSOR_LEVEL_SET: {
    en: 'I o T sensor cash level updated.',
    ta: 'பண இருப்பு சென்சார் நிலை புதுப்பிக்கப்பட்டது.',
    titleEn: 'Sensor Updated',
    titleTa: 'சென்சார் நிலை புதுப்பிக்கப்பட்டது'
  },
  LANGUAGE_SWITCHED: {
    en: 'English voice guidance activated.',
    ta: 'தமிழ் குரல் வழிகாட்டி செயல்படுத்தப்பட்டுள்ளது.',
    titleEn: 'Language Switched',
    titleTa: 'மொழி மாற்றப்பட்டது'
  },
  NAV_DASHBOARD: {
    en: 'Security Control Center Dashboard. Live monitoring of ATM cash levels, IoT sensors, and emergency refill alerts.',
    ta: 'பாதுகாப்பு கட்டுப்பாட்டு மையம். ஏடிஎம் பண இருப்பு நிலைகள், ஐஓடி சென்சார்கள் மற்றும் அவசர எச்சரிக்கைகள் நேரலையில் கண்காணிக்கப்படுகின்றன.',
    titleEn: 'Security Dashboard',
    titleTa: 'பாதுகாப்பு கட்டுப்பாட்டு மையம்'
  },
  NAV_SENSORS: {
    en: 'IoT Sensor Simulator. Adjust ATM cash levels and test the thirty percent critical siren alarm.',
    ta: 'ஐஓடி சென்சார் சோதனைக் களம். ஏடிஎம் பண இருப்பு அளவை மாற்றி, முப்பது சதவீத அவசர அலாரத்தை சோதிக்கலாம்.',
    titleEn: 'Sensor Simulator',
    titleTa: 'சென்சார் சோதனைக் களம்'
  },
  NAV_LOGISTICS: {
    en: 'Refill Logistics Dispatch. Monitor and dispatch armored cash replenishment vehicles to critical ATMs.',
    ta: 'பணம் நிரப்பும் வாகனப் பிரிவு. அவசர நிலையில் உள்ள ஏடிஎம்களுக்கு பாதுகாப்பு பண வாகனங்களை அனுப்பலாம்.',
    titleEn: 'Logistics Dispatch',
    titleTa: 'பணம் நிரப்பும் பிரிவு'
  },
  NAV_ALERTS: {
    en: 'Security Threat Alerts. Review facial mismatches, brute-force PIN attempts, and critical IoT warnings.',
    ta: 'பாதுகாப்பு எச்சரிக்கைப் பக்கம். முகப் பொருத்தமின்மை, தொடர்ந்து தவறான பின் மற்றும் சென்சார் எச்சரிக்கைகள்.',
    titleEn: 'Threat Alerts',
    titleTa: 'பாதுகாப்பு எச்சரிக்கைகள்'
  },
  NAV_MAP: {
    en: 'Live ATM Map Tracker. Geographic location and live cash status of all eight bank ATM terminals.',
    ta: 'ஏடிஎம் வரைபடப் பக்கம். அனைத்து எட்டு ஏடிஎம்களின் இருப்பிடம் மற்றும் நேரலை பண இருப்பை வரைபடத்தில் காணலாம்.',
    titleEn: 'ATM Map Tracker',
    titleTa: 'ஏடிஎம் வரைபடம்'
  }
};

// Global active utterances set to prevent Chrome V8 Garbage Collection bug
const activeUtterances = new Set<SpeechSynthesisUtterance>();
let cachedVoicesList: SpeechSynthesisVoice[] = [];

/**
 * Load all available voices from browser synthesis engine
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  try {
    const list = window.speechSynthesis.getVoices();
    if (list && list.length > 0) {
      cachedVoicesList = list;
    }
  } catch {
    // ignore
  }
  return cachedVoicesList;
}

// Initial voice loader
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const initVoices = () => {
    try {
      getAvailableVoices();
    } catch {
      // ignore
    }
  };
  initVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = initVoices;
  }
}

/**
 * Clean & preprocess text for crystal-clear TTS pronunciation
 */
export function sanitizeTextForSpeech(text: string, lang: VoiceLanguage): string {
  let cleaned = text;

  if (lang === 'ta') {
    // Natural Tamil banking phonetic expansion
    cleaned = cleaned
      .replace(/ATM-க்கு/gi, 'ஏடிஎம்மிற்கு')
      .replace(/ATM-ல்/gi, 'ஏடிஎம்மில்')
      .replace(/ATM-ஐ/gi, 'ஏடிஎம்மை')
      .replace(/ATM/gi, 'ஏடிஎம்')
      .replace(/PIN-ஐ/gi, 'பின்னை')
      .replace(/PIN/gi, 'பின்')
      .replace(/OTP-ஐ/gi, 'ஓடிபியை')
      .replace(/OTP/gi, 'ஓடிபி')
      .replace(/UPI/gi, 'யூபிஐ')
      .replace(/QR/gi, 'க்யூஆர்')
      .replace(/112/g, 'ஒன்று ஒன்று இரண்டு')
      .replace(/30%/g, 'முப்பது சதவீதம்')
      .replace(/100%/g, 'நூறு சதவீதம்')
      .replace(/₹\s*([0-9,]+)/g, '$1 ரூபாய்')
      .replace(/₹/g, 'ரூபாய்')
      .replace(/[✓✗✕•<>🚨⚠️✓]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  } else {
    // English banking phonetic expansion
    cleaned = cleaned
      .replace(/\bATM\b/g, 'A T M')
      .replace(/\bPIN\b/g, 'P I N')
      .replace(/\bOTP\b/g, 'O T P')
      .replace(/\bUPI\b/g, 'U P I')
      .replace(/\bQR\b/g, 'Q R')
      .replace(/\b112\b/g, 'one one two')
      .replace(/<30%/g, 'below thirty percent')
      .replace(/30%/g, 'thirty percent')
      .replace(/100%/g, 'one hundred percent')
      .replace(/₹\s*([0-9,]+)/g, '$1 rupees')
      .replace(/₹/g, 'rupees')
      .replace(/[✓✗✕•<>🚨⚠️✓]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  return cleaned;
}

/**
 * Find the most suitable Tamil speech synthesis voice
 */
export function findTamilVoice(): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Check exact lang match (ta-IN, ta-LK, ta-SG, ta)
  const exact = voices.find(v => {
    const l = (v.lang || '').toLowerCase().replace('_', '-');
    return l === 'ta-in' || l === 'ta-lk' || l === 'ta-sg' || l.startsWith('ta-') || l === 'ta';
  });
  if (exact) return exact;

  // 2. Check name matches (Google தமிழ், Microsoft Valluvar, Microsoft Pallavi, Latha, Tamil India)
  const byName = voices.find(v => {
    const n = (v.name || '').toLowerCase();
    const l = (v.lang || '').toLowerCase();
    return (
      n.includes('tamil') ||
      n.includes('தமிழ்') ||
      n.includes('valluvar') ||
      n.includes('pallavi') ||
      n.includes('latha') ||
      n.includes('mohan') ||
      l.includes('ta-in') ||
      l.includes('ta_in')
    );
  });
  if (byName) return byName;

  return null;
}

/**
 * Find the most suitable English speech synthesis voice
 */
export function findEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Natural Indian English or Google/Microsoft Natural voices
  const enIn = voices.find(v => {
    const l = (v.lang || '').toLowerCase().replace('_', '-');
    const n = (v.name || '').toLowerCase();
    return l === 'en-in' || n.includes('india') || n.includes('heera') || n.includes('ravi') || n.includes('neerja') || n.includes('veena');
  });
  if (enIn) return enIn;

  // 2. High-quality natural voices
  const natural = voices.find(v => {
    const l = (v.lang || '').toLowerCase();
    const n = (v.name || '').toLowerCase();
    return l.startsWith('en') && (n.includes('natural') || n.includes('google') || n.includes('samantha') || n.includes('siri') || n.includes('jenny') || n.includes('aria'));
  });
  if (natural) return natural;

  // 3. Any English voice or default
  const anyEn = voices.find(v => (v.lang || '').toLowerCase().startsWith('en'));
  return anyEn || voices.find(v => v.default) || voices[0] || null;
}

/**
 * Stop any ongoing speech synthesis cleanly
 */
export function stopVoiceGuidance() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
  activeUtterances.clear();
}

/**
 * Unlock Web Audio & Speech on user interaction
 */
export function unlockAudioAndVoice() {
  if (typeof window === 'undefined') return;
  try {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }
  } catch {
    // ignore
  }
}

/**
 * Play voice guidance with flawless pronunciation and error resiliency
 */
export function playVoiceGuidance(
  textOrKey: VoiceGuidanceKey | string,
  language: VoiceLanguage,
  options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
  }
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    setTimeout(() => options?.onEnd?.(), 0);
    return;
  }

  try {
    // Resume speech synthesis if browser paused it
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    // Cancel previous utterance
    window.speechSynthesis.cancel();
    activeUtterances.clear();

    // Resolve prompt text
    let rawText = textOrKey;
    if (textOrKey in VOICE_PROMPTS) {
      const prompt = VOICE_PROMPTS[textOrKey as VoiceGuidanceKey];
      rawText = language === 'ta' ? prompt.ta : prompt.en;
    }

    if (!rawText || !rawText.trim()) {
      setTimeout(() => options?.onEnd?.(), 0);
      return;
    }

    // Clean text for perfect pronunciation
    const spokenText = sanitizeTextForSpeech(rawText, language);

    const utterance = new SpeechSynthesisUtterance(spokenText);
    activeUtterances.add(utterance);

    // Voice Selection & Language Configuration
    if (language === 'ta') {
      utterance.lang = 'ta-IN';
      const tamilVoice = findTamilVoice();
      if (tamilVoice) {
        utterance.voice = tamilVoice;
      }
      // Optimal cadence for Tamil: 0.94x ensures every syllable is crystal clear
      utterance.rate = options?.rate ?? 0.94;
      utterance.pitch = options?.pitch ?? 1.0;
    } else {
      utterance.lang = 'en-IN';
      const englishVoice = findEnglishVoice();
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      utterance.rate = options?.rate ?? 1.0;
      utterance.pitch = options?.pitch ?? 1.0;
    }

    utterance.volume = options?.volume ?? 1.0;

    utterance.onstart = () => {
      setTimeout(() => options?.onStart?.(), 0);
    };

    utterance.onend = () => {
      activeUtterances.delete(utterance);
      setTimeout(() => options?.onEnd?.(), 0);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis event error:', e);
      activeUtterances.delete(utterance);
      setTimeout(() => {
        options?.onEnd?.();
        options?.onError?.(e);
      }, 0);
    };

    // Short timeout to guarantee cancelation settled in browser audio thread
    setTimeout(() => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);
      } catch (speakErr) {
        console.warn('SpeechSynthesis speak invocation failed:', speakErr);
        activeUtterances.delete(utterance);
        setTimeout(() => options?.onEnd?.(), 0);
      }
    }, 40);
  } catch (err) {
    console.warn('Speech execution caught exception:', err);
    setTimeout(() => {
      options?.onEnd?.();
      options?.onError?.(err);
    }, 0);
  }
}
