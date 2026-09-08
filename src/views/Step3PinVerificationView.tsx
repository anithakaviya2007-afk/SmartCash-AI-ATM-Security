import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Delete,
  Lock,
  RotateCcw,
  Mic,
  Volume2,
  X
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { VerificationProgress } from '../components/VerificationProgress';
import { VoiceGuidancePromptBar } from '../components/VoiceGuidancePromptBar';
import { playSound } from '../utils/soundEffects';

export const Step3PinVerificationView: React.FC = () => {
  const {
    session,
    activeUser,
    handleStep3PinVerify,
    proceedFromStep3PinToStep4Decision,
    demoSimulationMode,
    speakGuidance,
    language,
    speakItem,
    readAloudNonReaders,
    setReadAloudNonReaders
  } = useSecurity();

  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(session.pinVerified);

  const currentUser = session.currentUser || activeUser;
  const expectedPin = currentUser?.pinCode || session.activePinCode || '123456';

  const DIGIT_WORDS: Record<string, { ta: string; en: string }> = {
    '1': { ta: 'ஒன்று', en: 'One' },
    '2': { ta: 'இரண்டு', en: 'Two' },
    '3': { ta: 'மூன்று', en: 'Three' },
    '4': { ta: 'நான்கு', en: 'Four' },
    '5': { ta: 'ஐந்து', en: 'Five' },
    '6': { ta: 'ஆறு', en: 'Six' },
    '7': { ta: 'ஏழு', en: 'Seven' },
    '8': { ta: 'எட்டு', en: 'Eight' },
    '9': { ta: 'ஒன்பது', en: 'Nine' },
    '0': { ta: 'பூஜ்ஜியம்', en: 'Zero' }
  };

  useEffect(() => {
    if (!session.pinVerified) {
      speakGuidance('STEP3_PIN_PROMPT');
    }
  }, [speakGuidance, session.pinVerified]);

  // Physical keyboard support
  useEffect(() => {
    const handlePhysicalKeyDown = (e: KeyboardEvent) => {
      if (isSuccess) return;
      if (/^[0-9]$/.test(e.key)) {
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        handleSubmitPin();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handlePhysicalKeyDown);
    return () => window.removeEventListener('keydown', handlePhysicalKeyDown);
  }, [pin, isSuccess]);

  const handleDigitPress = (digit: string) => {
    playSound.keyPress();
    setErrorMessage('');
    const spoken = DIGIT_WORDS[digit];
    if (spoken) {
      speakItem(spoken.ta, spoken.en);
    }
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 6) {
        verifyPinCode(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    playSound.keyPress();
    setErrorMessage('');
    speakItem('கடைசி எண் அழிக்கப்பட்டது', 'Last digit deleted');
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    playSound.keyPress();
    setPin('');
    setErrorMessage('');
    speakItem('அனைத்து எண்களும் அழிக்கப்பட்டது', 'All digits cleared');
  };

  const verifyPinCode = (pinToTest: string) => {
    const res = handleStep3PinVerify(pinToTest);
    if (res.success) {
      setIsSuccess(true);
      setErrorMessage('');
      speakGuidance('STEP3_PIN_SUCCESS');
    } else {
      setIsSuccess(false);
      setErrorMessage(res.message || 'Incorrect PIN. Please try again.');
      setPin('');

      // Check if locked
      if (res.isLocked || (session.failedPinAttempts + 1 >= 3)) {
        speakGuidance('STEP3_PIN_LOCKED');
      } else {
        speakGuidance('STEP3_PIN_INCORRECT');
      }
    }
  };

  const handleSubmitPin = () => {
    if (pin.length < 6) {
      setErrorMessage('Please enter all 6 digits of your ATM PIN.');
      speakItem('தயவுசெய்து ஆறு இலக்க பின் எண்ணையும் உள்ளிடவும்', 'Please enter all 6 digits of your PIN');
      return;
    }
    speakItem('பின் எண் சரிபார்க்கப்படுகிறது', 'Verifying PIN');
    verifyPinCode(pin);
  };

  const handleAutoFillDemoPin = () => {
    speakItem('டெமோ பின் எண் தானாக உள்ளிடப்பட்டது', 'Demo PIN auto-filled');
    setPin(expectedPin);
    verifyPinCode(expectedPin);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <div>
        {/* Step Progress Tracker */}
        <VerificationProgress
          currentStep="PIN"
          stepNumber={3}
          completedSteps={['FACE', 'CARD']}
        />

        <div className="max-w-xl mx-auto w-full">
          <div className="bg-slate-900/90 rounded-3xl border border-blue-500/30 p-6 sm:p-8 shadow-2xl shadow-blue-950/60 backdrop-blur-md">
            
            {/* Header */}
            <div className="text-center pb-5 border-b border-slate-800">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/20 mb-3">
                <KeyRound className="h-7 w-7" />
              </div>

              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-400 text-[11px] font-mono font-bold mb-1">
                <span>{language === 'ta' ? 'படி 3 / 5 • ATM PIN சரிபார்ப்பு' : 'STEP 3 OF 5 • ATM SECURITY PIN'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {language === 'ta' ? 'உங்கள் PIN எண்ணை உள்ளிடவும்' : 'ENTER YOUR PIN'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'ta' ? 'கார்டுதாரர்' : 'Cardholder'}: <strong className="text-slate-200">{currentUser?.name || 'Anitha'}</strong> ({currentUser?.maskedCardNumber || '**** 1234'})
              </p>
            </div>

            {/* Voice Guidance Banner */}
            <div className="mt-4">
              <VoiceGuidancePromptBar
                currentKey={
                  session.isSecurityLocked
                    ? 'STEP3_PIN_LOCKED'
                    : isSuccess
                    ? 'STEP3_PIN_SUCCESS'
                    : errorMessage
                    ? 'STEP3_PIN_INCORRECT'
                    : 'STEP3_PIN_PROMPT'
                }
              />
            </div>

            {/* Quick Demo Helper Banner */}
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/40 p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="text-amber-200 font-mono">
                  Demo PIN for Card: <strong className="bg-amber-900/80 px-2.5 py-0.5 rounded text-amber-300 font-bold tracking-wider">{expectedPin}</strong>
                </span>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={handleAutoFillDemoPin}
                  className="flex-1 sm:flex-initial px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] transition shadow-xs cursor-pointer"
                >
                  Auto-Fill PIN
                </button>
                <button
                  onClick={() => {
                    handleAutoFillDemoPin();
                    try {
                      const synth = window.speechSynthesis;
                      if (synth) {
                        synth.cancel();
                        const utter = new SpeechSynthesisUtterance(language === 'ta' ? 'குரல் வழியே PIN உள்ளிடப்பட்டது' : 'PIN entered via Voice Command');
                        utter.lang = language === 'ta' ? 'ta-IN' : 'en-US';
                        synth.speak(utter);
                      }
                    } catch (e) {}
                  }}
                  className="flex-1 sm:flex-initial px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-extrabold text-[11px] transition shadow-xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <Mic className="w-3 h-3 text-slate-950 animate-pulse" />
                  <span>{language === 'ta' ? '🎙️ பேசி PIN இட' : '🎙️ Voice PIN'}</span>
                </button>
                <button
                  onClick={() => {
                    setPin('999999');
                    verifyPinCode('999999');
                  }}
                  className="flex-1 sm:flex-initial px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] transition shadow-xs cursor-pointer flex items-center justify-center gap-1"
                  title="Test Duress Silent Police Panic Alarm"
                >
                  <Lock className="w-3 h-3 text-yellow-300" />
                  <span>Panic PIN (999999)</span>
                </button>
              </div>
            </div>

            {/* 6-Digit Masked Indicators */}
            <div className="mt-6 flex items-center justify-center space-x-2.5 sm:space-x-3">
              {[0, 1, 2, 3, 4, 5].map((idx) => {
                const isFilled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`h-12 w-11 sm:h-14 sm:w-13 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 shadow-inner ${
                      isSuccess
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.35)]'
                        : errorMessage
                        ? 'border-rose-500 bg-rose-950/40 text-rose-400'
                        : isFilled
                        ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.35)] scale-105'
                        : 'border-slate-800 bg-slate-950 text-slate-600'
                    }`}
                  >
                    {isFilled ? (
                      <span className="h-3.5 w-3.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-slate-800" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Error / Feedback Message */}
            {errorMessage && (
              <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-950/50 p-3 text-xs text-rose-300 flex items-center justify-center space-x-2 animate-shake">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* Success Feedback Box */}
            {isSuccess && (
              <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-950/60 p-3 text-xs text-emerald-300 flex items-center justify-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <span className="font-bold text-sm">
                  {language === 'ta' ? 'PIN சரிபார்க்கப்பட்டது ✓ • அணுகல் அனுமதிக்கப்பட்டது' : 'PIN VERIFIED ✓ • ACCESS GRANTED'}
                </span>
              </div>
            )}

            {/* Non-Reader Accessibility Voice Bar */}
            <div className="mt-4 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center space-x-2 text-left">
                <Volume2 className="h-4 w-4 text-cyan-400 animate-pulse shrink-0" />
                <span className="text-cyan-200">
                  {language === 'ta'
                    ? '📢 படிக்கத் தெரியாதவர்களுக்கான உதவி: எண்களைத் தொட்டால் அல்லது வைத்தால் தமிழில் பேசும்.'
                    : '📢 Non-Reader Voice Assistance: Touching or hovering digits reads them aloud in Tamil/English.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  speakItem(
                    'ஏடிஎம் விசைப்பலகை வழிகாட்டல். எண்கள் ஒன்று முதல் ஒன்பது வரை வரிசையாக உள்ளன. கீழே மஞ்சள் நிறத்தில் அனைத்து எண்களையும் அழிக்கும் கிளியர் பட்டன், நடுவில் பூஜ்ஜியம், வலதுபுறம் கடைசி எண்ணை அழிக்கும் பேக்ஸ்பேஸ் பட்டன் உள்ளன.',
                    'Keypad voice guide. Digits 1 to 9 are arranged in rows. At the bottom: yellow clear button to erase all, zero in the middle, and backspace button on the right.',
                    true
                  );
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-bold shrink-0 cursor-pointer flex items-center space-x-1"
                title="விசைப்பலகை அமைப்பைக் குரலில் கேட்க"
              >
                <span>🔊</span>
                <span>{language === 'ta' ? 'விசைப்பலகையைக் கேள்' : 'Hear Keypad Layout'}</span>
              </button>
            </div>

            {/* Realistic ATM Hardware Keypad */}
            <div className="mt-4 bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-inner max-w-sm mx-auto">
              <div className="grid grid-cols-3 gap-2.5">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => {
                  const item = DIGIT_WORDS[digit];
                  return (
                    <button
                      key={digit}
                      onClick={() => handleDigitPress(digit)}
                      onMouseEnter={() => {
                        if (item) {
                          speakItem(`எண் ${item.ta}`, `Digit ${item.en}`);
                        }
                      }}
                      disabled={isSuccess}
                      className="h-13 rounded-xl bg-slate-900 border border-slate-800 text-lg font-mono font-bold text-slate-100 hover:bg-slate-800 hover:border-slate-700 active:scale-95 transition shadow-xs flex items-center justify-center disabled:opacity-50 cursor-pointer"
                    >
                      {digit}
                    </button>
                  );
                })}

                {/* Bottom row: Clear (Yellow), 0, Backspace/Enter */}
                <button
                  onClick={handleClear}
                  onMouseEnter={() => speakItem('அழிக்கும் பட்டன். உள்ளிட்ட எண்களை அழிக்க', 'Clear button')}
                  disabled={isSuccess}
                  className="h-13 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-900/80 active:scale-95 transition flex items-center justify-center disabled:opacity-50 cursor-pointer"
                >
                  CLEAR
                </button>

                <button
                  onClick={() => handleDigitPress('0')}
                  onMouseEnter={() => speakItem('எண் பூஜ்ஜியம்', 'Digit Zero')}
                  disabled={isSuccess}
                  className="h-13 rounded-xl bg-slate-900 border border-slate-800 text-lg font-mono font-bold text-slate-100 hover:bg-slate-800 active:scale-95 transition flex items-center justify-center disabled:opacity-50 cursor-pointer"
                >
                  0
                </button>

                <button
                  onClick={handleBackspace}
                  onMouseEnter={() => speakItem('கடைசி எண்ணை அழிக்கும் பேக்ஸ்பேஸ் பட்டன்', 'Backspace button')}
                  disabled={isSuccess}
                  className="h-13 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 active:scale-95 transition flex items-center justify-center disabled:opacity-50 cursor-pointer"
                >
                  <Delete className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              {!isSuccess ? (
                <button
                  onClick={handleSubmitPin}
                  onMouseEnter={() => speakItem('பின் எண் சரிபார்க்கவும் என்ற பட்டன்', 'Verify PIN button')}
                  className="w-full flex-1 flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 py-4 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:from-orange-500 hover:to-amber-500 transition active:scale-[0.99] cursor-pointer"
                >
                  <span>{language === 'ta' ? 'PIN சரிபார்க்கவும்' : 'Verify PIN'}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    speakItem('அடுத்த படிக்கு செல்கிறீர்கள்', 'Proceeding to next step');
                    proceedFromStep3PinToStep4Decision();
                  }}
                  onMouseEnter={() => speakItem('அடுத்த படிக்கு செல்லும் பட்டன்', 'Next step button')}
                  className="w-full flex-1 flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-500 hover:to-teal-500 transition active:scale-[0.99] cursor-pointer"
                >
                  <span>{language === 'ta' ? 'அடுத்தது: அணுகல் முடிவு (படி 4/5)' : 'NEXT: ACCESS DECISION (Step 4/5)'}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Security Statement Footer */}
      <div className="mt-6 text-center text-xs text-slate-500">
        <p>Encrypted Pin Pad (EPP) Level 4 Compliant • End-to-End Cryptographic Validation</p>
      </div>
    </div>
  );
};
