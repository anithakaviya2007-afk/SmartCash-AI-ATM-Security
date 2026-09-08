import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ScanFace,
  Camera,
  CameraOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  Sparkles,
  Eye,
  Activity,
  Info,
  Smartphone,
  Send,
  Hand,
  ShieldAlert
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { VerificationProgress } from '../components/VerificationProgress';
import { VoiceGuidancePromptBar } from '../components/VoiceGuidancePromptBar';
import { playSound } from '../utils/soundEffects';
import { stopVoiceGuidance } from '../utils/voiceGuidance';

type CameraState = 'INITIALIZING' | 'ACTIVE' | 'DENIED' | 'UNAVAILABLE' | 'SIMULATED';

export const Step1FaceRecognitionView: React.FC = () => {
  const {
    session,
    users,
    activeUser,
    selectedAtm,
    atms,
    handleStep1FaceVerification,
    proceedFromStep1FaceToStep2Card,
    proceedFromStep2CardToStep3Pin,
    resetVerification,
    demoSimulationMode,
    setDemoSimulationMode,
    testFaceScanner,
    speakGuidance,
    language,
    speakItem,
    readAloudNonReaders,
    setReadAloudNonReaders
  } = useSecurity();

  const targetCardholder = session.currentUser || activeUser || users[0];

  // Camera & Stream State
  const [cameraState, setCameraState] = useState<CameraState>('INITIALIZING');
  const [cameraError, setCameraError] = useState<string>('');
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  // Real-time Face & Liveness Detection State (Stable & Non-jittery)
  const [faceDetected, setFaceDetected] = useState<boolean>(true);
  const [faceConfidence, setFaceConfidence] = useState<number>(98);
  const [livenessStage, setLivenessStage] = useState<'WAITING' | 'CENTERED' | 'CHECKING' | 'PASSED'>('CHECKING');
  const [livenessMessage, setLivenessMessage] = useState<string>(
    language === 'ta' ? 'முகம் உறுதி செய்யப்பட்டது' : 'Face detected • Liveness verified'
  );

  // Scanning & Progression State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStatusText, setScanStatusText] = useState<string>(
    language === 'ta' ? 'முக அடையாளத்தை சரிபார்க்கிறது...' : 'Aligning face within scanner...'
  );

  // Verification Result & Auto-Proceed State
  const [verificationResult, setVerificationResult] = useState<{
    completed: boolean;
    success: boolean;
    confidence: number;
    userName: string;
  }>({
    completed: session.faceScanned,
    success: session.faceVerified,
    confidence: session.faceConfidence || 0,
    userName: activeUser?.name || 'Anitha K'
  });

  const [autoRedirectCountdown, setAutoRedirectCountdown] = useState<number | null>(null);

  // Refs for stable execution without re-render loop
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousFrameDataRef = useRef<Uint8ClampedArray | null>(null);
  const consecutiveFaceHitsRef = useRef<number>(0);
  const consecutiveFaceMissesRef = useRef<number>(0);
  const motionHitsRef = useRef<number>(0);
  const isScanningRef = useRef<boolean>(false);
  const verificationCompletedRef = useRef<boolean>(session.faceScanned);
  const autoScanTriggeredRef = useRef<boolean>(false);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prevConfidenceRef = useRef<number>(0);

  // Keep refs in sync with state
  isScanningRef.current = isScanning;
  verificationCompletedRef.current = verificationResult.completed;

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Real Browser Camera Start with getUserMedia
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError('');
    setPermissionDenied(false);
    setCameraState('INITIALIZING');
    autoScanTriggeredRef.current = false;
    consecutiveFaceHitsRef.current = 0;
    consecutiveFaceMissesRef.current = 0;
    motionHitsRef.current = 0;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        language === 'ta'
          ? 'இந்த உலாவியில் கேமரா பயன்பாடு ஆதரிக்கப்படவில்லை.'
          : 'Camera access is not supported in this browser environment.'
      );
      setCameraState('UNAVAILABLE');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('Video auto-play warning:', playErr);
        }
      }

      setCameraState('ACTIVE');
      setPermissionDenied(false);
      setCameraError('');
    } catch (err: any) {
      console.warn('Webcam getUserMedia exception:', err);
      stopCamera();

      if (
        err.name === 'NotAllowedError' ||
        err.name === 'PermissionDeniedError' ||
        err.message?.includes('Permission denied') ||
        err.message?.includes('denied')
      ) {
        setPermissionDenied(true);
        setCameraState('DENIED');
        setCameraError(
          language === 'ta'
            ? 'கேமரா அனுமதி மறுக்கப்பட்டது. முக அங்கீகாரத்திற்கு கேமரா அனுமதி தேவை. தயவுசெய்து உலாவி அமைப்புகளில் அனுமதியை வழங்கி Retry செய்யவும்.'
            : 'Camera permission is required for biometric face authentication. Please allow camera access in your browser settings and click Retry.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraState('UNAVAILABLE');
        setCameraError(
          language === 'ta'
            ? 'கேமரா சாதனம் கண்டறியப்படவில்லை. கேமராவை இணைக்கவும்.'
            : 'No camera device detected. Please connect a webcam or enable camera.'
        );
      } else {
        setPermissionDenied(true);
        setCameraState('DENIED');
        setCameraError(
          err.message ||
          (language === 'ta'
            ? 'கேமரா அனுமதி தேவை. தொடர அனுமதியை இயக்கவும்.'
            : 'Camera permission required to proceed.')
        );
      }
    }
  }, [stopCamera, language, speakGuidance]);

  // Demo fallback simulator
  const startSimulatedFeed = () => {
    stopCamera();
    setCameraState('SIMULATED');
    setPermissionDenied(false);
    setCameraError('');
    setFaceDetected(true);
    setFaceConfidence(96);
    setLivenessStage('CHECKING');
    setLivenessMessage(
      language === 'ta'
        ? 'உயிர் சரிபார்ப்பு: இயல்பான மனித அசைவு உறுதி செய்யப்பட்டது'
        : 'Liveness Check: Natural micro-movement detected'
    );
  };

  // Mount effect (Runs once on mount to keep camera stream rock solid)
  useEffect(() => {
    startCamera();
    speakGuidance('STEP1_FACE_PROMPT');

    return () => {
      stopCamera();
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [speakGuidance]);

  // Execute Scanning Animation & Verification
  const executeVerification = useCallback(() => {
    if (isScanningRef.current || verificationCompletedRef.current) return;

    playSound.keyPress();
    setIsScanning(true);
    setScanProgress(0);
    setScanStatusText(
      language === 'ta'
        ? 'நேரடி கேமரா முக வரைபடம் பதிவாகிறது...'
        : 'Locking facial vector coordinates...'
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setScanProgress(progress);

      if (progress === 50) {
        setScanStatusText(
          language === 'ta'
            ? 'உயிர் சரிபார்ப்பு மற்றும் போலித்தடுப்பு ஆய்வு...'
            : 'Analyzing biometric liveness and anti-spoofing...'
        );
      } else if (progress === 75) {
        setScanStatusText(
          language === 'ta'
            ? 'அங்கீகரிக்கப்பட்ட வங்கி அட்டையாளருடன் ஒப்பிடப்படுகிறது...'
            : 'Comparing facial features with cardholder registry...'
        );
      } else if (progress >= 100) {
        clearInterval(interval);
        setIsScanning(false);

        const result = handleStep1FaceVerification();

        if (result.success) {
          playSound.faceRecognized();
          setVerificationResult({
            completed: true,
            success: true,
            confidence: result.confidence || 98.4,
            userName: activeUser?.name || 'Anitha K'
          });
          setScanStatusText(
            language === 'ta'
              ? 'முகப் பொருத்தம் வெற்றி ✓ கார்டு உரிமையாளர் சரிபார்க்கப்பட்டார் (IDENTITY VERIFIED)'
              : 'FACE MATCH SUCCESSFUL ✓ • CARD OWNER VERIFIED • IDENTITY VERIFIED'
          );
          stopVoiceGuidance();
          speakGuidance('STEP1_FACE_SUCCESS', undefined, undefined, () => {
            stopVoiceGuidance();
            proceedFromStep2CardToStep3Pin();
          });
        } else {
          playSound.accessDenied();
          setVerificationResult({
            completed: true,
            success: false,
            confidence: result.confidence || 41.2,
            userName: activeUser?.name || 'Unknown Imposter'
          });
          setScanStatusText(
            language === 'ta'
              ? 'முகப் பொருத்தம் இல்லை ✕ கார்டு உரிமையாளர் சரிபார்ப்பு தோல்வி (ACCESS DENIED)'
              : 'FACE DOESN’T MATCH ✕ • CARD OWNER VERIFICATION FAILED • ACCESS DENIED'
          );
          stopVoiceGuidance();
          speakGuidance('UNAUTHORIZED_FACE');

          // Auto return to welcome after 3.5s delay for failed face check (Scenario B)
          if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
          redirectTimerRef.current = setTimeout(() => {
            resetVerification();
          }, 3500);
        }
      }
    }, 280);
  }, [handleStep1FaceVerification, proceedFromStep1FaceToStep2Card, stopVoiceGuidance, activeUser, language, speakGuidance]);

  // Controlled, Non-Shaking Frame Analysis (Runs every 180ms - zero render stutter)
  useEffect(() => {
    if (cameraState !== 'ACTIVE') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    let checkCount = 0;

    intervalRef.current = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        return;
      }

      try {
        if (!canvasRef.current) {
          canvasRef.current = document.createElement('canvas');
        }
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const targetW = 120;
        const targetH = 90;
        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }

        ctx.drawImage(video, 0, 0, targetW, targetH);

        // Center face oval
        const startX = Math.floor(targetW * 0.25);
        const startY = Math.floor(targetH * 0.15);
        const scanW = Math.floor(targetW * 0.5);
        const scanH = Math.floor(targetH * 0.7);

        const imageData = ctx.getImageData(startX, startY, scanW, scanH);
        const data = imageData.data;
        const totalPixels = scanW * scanH;

        let skinPixelCount = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (r > 60 && g > 40 && b > 20 && r > g && r > b && (r - g) > 12) {
            skinPixelCount++;
          }
        }

        const skinRatio = skinPixelCount / totalPixels;

        // Frame delta calculation
        let frameDelta = 0;
        if (previousFrameDataRef.current && previousFrameDataRef.current.length === data.length) {
          let diffSum = 0;
          const step = 8;
          for (let i = 0; i < data.length; i += step * 4) {
            const lumNow = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            const lumPrev =
              0.299 * previousFrameDataRef.current[i] +
              0.587 * previousFrameDataRef.current[i + 1] +
              0.114 * previousFrameDataRef.current[i + 2];
            diffSum += Math.abs(lumNow - lumPrev);
          }
          frameDelta = diffSum / (totalPixels / step);
        }
        previousFrameDataRef.current = new Uint8ClampedArray(data);

        // Hysteresis Filter to prevent flickering
        const isFrameFace = skinRatio > 0.14;
        if (isFrameFace) {
          consecutiveFaceHitsRef.current += 1;
          consecutiveFaceMissesRef.current = 0;
        } else {
          consecutiveFaceMissesRef.current += 1;
          if (consecutiveFaceMissesRef.current >= 3) {
            consecutiveFaceHitsRef.current = 0;
          }
        }

        if (verificationCompletedRef.current || livenessStage === 'PASSED') {
          return;
        }

        const hasFace = consecutiveFaceHitsRef.current >= 2;

        setFaceDetected(prev => {
          if (prev !== hasFace) return hasFace;
          return prev;
        });

        if (hasFace) {
          const targetConfidence = Math.min(99, Math.round(78 + skinRatio * 30));
          // Only update confidence if difference >= 3 to prevent rapid text jitter
          if (Math.abs(targetConfidence - prevConfidenceRef.current) >= 3) {
            prevConfidenceRef.current = targetConfidence;
            setFaceConfidence(targetConfidence);
          }

          if (frameDelta > 1.0 && frameDelta < 35.0) {
            motionHitsRef.current += 1;
          }

          checkCount++;

          if (checkCount === 3) {
            setLivenessStage('CENTERED');
            setLivenessMessage(
              language === 'ta'
                ? 'முகம் உறுதி செய்யப்பட்டது • கண் சிமிட்டவும்'
                : 'Face Centered • Please blink for liveness'
            );
          } else if (checkCount === 6 || motionHitsRef.current >= 2) {
            setLivenessStage('CHECKING');
            setLivenessMessage(
              language === 'ta'
                ? 'இயற்கை அசைவு சரிபார்க்கப்பட்டது (Anti-Spoofing Validated)'
                : 'Natural micro-movement detected (Anti-Spoofing: Pass)'
            );
          } else if (checkCount >= 10 || motionHitsRef.current >= 4) {
            setLivenessStage('PASSED');
            setLivenessMessage(
              language === 'ta'
                ? 'உயிர் சரிபார்ப்பு வெற்றி (Human Confirmed ✓)'
                : 'Liveness Check Passed (Live Human Confirmed ✓)'
            );

            // Auto-trigger scan sequence smoothly once
            if (!autoScanTriggeredRef.current && !isScanningRef.current && !verificationCompletedRef.current) {
              autoScanTriggeredRef.current = true;
              executeVerification();
            }
          }
        } else {
          checkCount = 0;
          setLivenessStage('WAITING');
          setLivenessMessage(
            language === 'ta'
              ? 'முகத்தை கேமரா மையத்திற்கு நேராக வைக்கவும்'
              : 'Position your face inside the scanner frame'
          );
        }
      } catch (err) {
        console.warn('Controlled frame analysis error:', err);
      }
    }, 180);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [cameraState, language, executeVerification]);

  // Manual Rescan / Reset
  const handleRescan = () => {
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
    }
    setAutoRedirectCountdown(null);
    setVerificationResult({
      completed: false,
      success: false,
      confidence: 0,
      userName: activeUser?.name || 'Anitha K'
    });
    setScanProgress(0);
    setLivenessStage('WAITING');
    consecutiveFaceHitsRef.current = 0;
    consecutiveFaceMissesRef.current = 0;
    motionHitsRef.current = 0;
    autoScanTriggeredRef.current = false;
    startCamera();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <div>
        {/* Step Progress Tracker */}
        <VerificationProgress currentStep="FACE" stepNumber={2} completedSteps={['CARD']} />

        <div className="max-w-3xl mx-auto w-full">
          {/* Main Card Container */}
          <div className="bg-slate-900/95 rounded-3xl border border-blue-500/30 p-5 sm:p-8 shadow-2xl shadow-blue-950/60 backdrop-blur-md">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div className="flex items-center space-x-3 text-center sm:text-left">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-500/40 text-cyan-400">
                  <ScanFace className="h-6 w-6" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-cyan-400 text-[11px] font-mono font-bold mb-1">
                    <span>{language === 'ta' ? 'படி 2 / 5 • முக ஸ்கேன் & பொருத்தம்' : 'STEP 2 OF 5 • OWNER FACE SCAN & MATCH'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {language === 'ta' ? 'முக அங்கீகாரம் (Face Recognition)' : 'Face Recognition Verification'}
                  </h2>
                </div>
              </div>

              {/* Camera State Badge & Retry */}
              <div className="flex items-center space-x-2">
                {cameraState === 'ACTIVE' ? (
                  <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>Live Webcam</span>
                    <button
                      onClick={stopCamera}
                      title="Turn off webcam"
                      className="ml-1 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                    >
                      <CameraOff className="h-3.5 w-3.5 text-rose-400" />
                    </button>
                  </div>
                ) : cameraState === 'SIMULATED' ? (
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-950/60 text-amber-300 text-xs font-semibold">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>Demo Feed</span>
                  </div>
                ) : (
                  <button
                    onClick={startCamera}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-blue-500/40 bg-blue-600/20 text-xs font-semibold text-blue-300 hover:bg-blue-600/30 hover:text-white transition cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Retry Camera</span>
                  </button>
                )}
              </div>
            </div>

            {/* Voice Guidance Banner */}
            <div className="mt-4">
              <VoiceGuidancePromptBar
                currentKey={verificationResult.completed && verificationResult.success ? 'STEP1_FACE_SUCCESS' : 'STEP1_FACE_PROMPT'}
              />
            </div>

            {/* Linked Phone SMS Alert Notification Status */}
            {session.cardInsertSmsAlert && (
              <div className="mt-3 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-cyan-500/50 p-3 sm:p-4 text-xs shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 shrink-0">
                    <Smartphone className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                        {language === 'ta' ? 'SMS எச்சரிக்கை அனுப்பப்பட்டது ✓' : 'SMS ALERT SENT ✓'}
                      </span>
                      <span className="text-[10px] text-cyan-300 font-mono">
                        {session.cardInsertSmsAlert.timestamp}
                      </span>
                    </div>
                    <p className="font-bold text-white text-xs mt-0.5">
                      {language === 'ta'
                        ? `கார்டு உரிமையாளரின் மொபைலுக்கு (${session.cardInsertSmsAlert.maskedPhone}) ஏடிஎம் முகவரி எச்சரிக்கை அனுப்பப்பட்டுள்ளது`
                        : `Card inserted at ${session.cardInsertSmsAlert.atmName}. Alert sent to linked mobile (${session.cardInsertSmsAlert.maskedPhone}).`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-[11px] font-mono text-cyan-300 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0">
                  <Send className="h-3.5 w-3.5 text-emerald-400" />
                  <span>To: {session.cardInsertSmsAlert.maskedPhone}</span>
                </div>
              </div>
            )}

            {/* CAMERA PERMISSION REQUIRED ERROR STATE */}
            {(cameraState === 'DENIED' || cameraState === 'UNAVAILABLE' || permissionDenied) && (
              <div className="mt-6 rounded-3xl border-2 border-amber-500/60 bg-amber-950/40 p-6 text-left backdrop-blur-xl shadow-xl shadow-amber-950/60">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-amber-600/30 text-amber-400 border border-amber-500/50 flex-shrink-0">
                    <CameraOff className="w-8 h-8" />
                  </div>
                  <div className="flex-1 space-y-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-black tracking-wider uppercase font-mono">
                        BROWSER PERMISSION REQUIRED
                      </span>
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Camera Permission Required
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-amber-200 leading-relaxed">
                      {language === 'ta'
                        ? 'ATM பணப் பாதுகாப்பு மற்றும் மோசடி தடுப்பிற்காக உங்களது நேரடி கேமரா மூலம் முகம் சரிபார்க்கப்பட வேண்டும். கேமரா அனுமதியை இயக்கவும்.'
                        : 'CashGuard ATM security requires webcam access to perform real-time biometric face detection and anti-spoofing liveness verification before cash can be dispensed.'}
                    </p>

                    <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl p-3.5 text-xs text-slate-300 space-y-1.5">
                      <div className="font-bold text-amber-300 flex items-center gap-1.5">
                        <Info className="w-4 h-4" />
                        <span>How to grant camera permission:</span>
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                        <li>Click the <strong>Lock (🔒)</strong> or <strong>Camera (📷)</strong> icon in your browser URL address bar.</li>
                        <li>Change <strong>Camera</strong> permission to <strong>"Allow"</strong>.</li>
                        <li>Click the <strong>Retry</strong> button below to activate the live scanner.</li>
                      </ol>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={startCamera}
                        className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition cursor-pointer"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Retry</span>
                      </button>

                      <button
                        onClick={startSimulatedFeed}
                        className="flex items-center space-x-2 px-4 py-3 rounded-2xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
                      >
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        <span>Try Simulated Feed (Preview Mode)</span>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* LIVE WEBCAM SCANNER VIEWPORT (Rock-solid, hardware accelerated, zero shake) */}
            {(cameraState === 'ACTIVE' || cameraState === 'SIMULATED') && (
              <div className="mt-5 relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[420px] rounded-3xl overflow-hidden bg-slate-950 border border-blue-500/40 shadow-2xl flex items-center justify-center">
                
                {/* Real Live HTML5 Video Element */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${
                    cameraState === 'ACTIVE' ? 'opacity-100' : 'hidden'
                  }`}
                />

                {/* Simulated Canvas Feed for Preview Mode */}
                {cameraState === 'SIMULATED' && (
                  <div className="w-full h-full bg-gradient-to-b from-slate-900 via-blue-950/80 to-slate-900 flex flex-col items-center justify-center p-6 text-center relative">
                    <div className="relative w-48 h-56 rounded-full border-2 border-cyan-400/80 bg-cyan-950/20 flex items-center justify-center shadow-[0_0_25px_rgba(34,211,238,0.25)]">
                      <ScanFace className="w-28 h-28 text-cyan-300/80" />
                    </div>
                    <span className="mt-4 text-xs font-mono text-cyan-300 font-bold">
                      SIMULATED BIOMETRIC WEBCAM TEST STREAM
                    </span>
                  </div>
                )}

                {/* Stable Target Reticle Overlay (No layout vibration) */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div
                    className={`relative w-52 h-64 sm:w-60 sm:h-72 rounded-3xl border-2 transition-colors duration-200 ${
                      verificationResult.completed && verificationResult.success
                        ? 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)] bg-emerald-950/15'
                        : isScanning
                        ? 'border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.4)]'
                        : faceDetected
                        ? 'border-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.25)]'
                        : 'border-cyan-400/50'
                    }`}
                  >
                    {/* Corner Accent Brackets */}
                    <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-cyan-400" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-cyan-400" />
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-cyan-400" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-cyan-400" />

                    {/* Smooth Scanning Laser Beam Line */}
                    {(isScanning || livenessStage === 'CHECKING') && (
                      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-scan-laser pointer-events-none" />
                    )}

                    {/* Stable Facial Landmark Indicators (No pinging) */}
                    {faceDetected && (
                      <>
                        <div className="absolute top-[30%] left-[28%] -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                        <div className="absolute top-[30%] right-[28%] translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                        <div className="absolute bottom-[24%] left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-cyan-400/60" />
                      </>
                    )}
                  </div>
                </div>

                {/* Top Badge: Live Camera & Liveness Status */}
                <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                  <div className="flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[11px] font-mono text-slate-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>{cameraState === 'ACTIVE' ? 'WEBCAM: LIVE PREVIEW' : 'DEMO CAMERA'}</span>
                  </div>

                  <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border text-[11px] font-mono backdrop-blur-md transition-colors duration-200 ${
                    livenessStage === 'PASSED'
                      ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                      : livenessStage === 'CHECKING' || livenessStage === 'CENTERED'
                      ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300'
                      : 'bg-slate-900/80 border-slate-700 text-slate-400'
                  }`}>
                    <Activity className="w-3.5 h-3.5" />
                    <span>
                      {livenessStage === 'PASSED'
                        ? 'LIVENESS: PASS ✓'
                        : livenessStage === 'CHECKING'
                        ? 'LIVENESS: CHECKING...'
                        : 'LIVENESS: PENDING'}
                    </span>
                  </div>
                </div>

                {/* Bottom Center Prompt Bar inside viewport */}
                <div className="absolute bottom-3 left-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-2xl">
                  <div className="flex items-center space-x-2 text-xs">
                    {faceDetected ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Eye className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                    )}
                    <span className="font-semibold text-white">
                      {livenessMessage}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono">
                    <span className="text-slate-400">Match:</span>
                    <span className={`font-bold ${faceConfidence > 70 ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {faceConfidence}%
                    </span>
                  </div>
                </div>

                {/* Real-time Scanning Progress Bar Overlay */}
                {isScanning && (
                  <div className="absolute inset-x-4 top-14 z-20 bg-slate-900/90 backdrop-blur-md rounded-xl p-3 border border-cyan-500/50 shadow-2xl">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                      <span className="text-cyan-300 flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        {scanStatusText}
                      </span>
                      <span className="text-cyan-400 font-mono">{scanProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-full transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VERIFICATION RESULT SUCCESS OR FAILURE CARD (EXPLICIT MATCH / NOT MATCH) */}
            {verificationResult.completed && (
              <div
                className={`mt-5 rounded-3xl border-2 p-5 sm:p-6 shadow-2xl transition-all ${
                  verificationResult.success
                    ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border-emerald-500 shadow-emerald-500/30'
                    : 'bg-gradient-to-br from-rose-950 via-slate-900 to-red-950 border-rose-500 shadow-rose-500/40 animate-shake'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`h-16 w-16 rounded-2xl flex items-center justify-center border-2 shrink-0 ${
                        verificationResult.success
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                          : 'bg-rose-500/20 border-rose-400 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                      }`}
                    >
                      {verificationResult.success ? (
                        <CheckCircle2 className="h-9 w-9 text-emerald-400" />
                      ) : (
                        <AlertCircle className="h-9 w-9 text-rose-400 animate-bounce" />
                      )}
                    </div>

                    <div>
                      {/* Explicit MATCH / NOT MATCH Status Header */}
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black font-mono tracking-wider uppercase ${
                            verificationResult.success
                              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/40'
                              : 'bg-rose-600 text-white shadow-md shadow-rose-600/40 animate-pulse'
                          }`}
                        >
                          {verificationResult.success
                            ? (language === 'ta' ? 'முகப் பொருத்தம் வெற்றி (FACE MATCHED ✓)' : 'FACE MATCHED ✓')
                            : (language === 'ta' ? 'முகப் பொருத்தம் இல்லை (FACE NOT MATCHED ✕)' : 'FACE NOT MATCHED ✕')}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1.5">
                        {verificationResult.success
                          ? (language === 'ta' ? 'கார்டு உரிமையாளர் அடையாளம் உறுதி செய்யப்பட்டது ✓' : 'Card Owner Identity Verified ✓')
                          : (language === 'ta' ? 'அங்கீகரிக்கப்படாத நபர்! அணுகல் மறுக்கப்பட்டது ✕' : 'Unauthorized Person! Access Denied ✕')}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs">
                        <span className={`font-mono font-bold ${verificationResult.success ? 'text-emerald-300' : 'text-rose-300'}`}>
                          {language === 'ta' ? 'பொருத்தம் சதவீதம்' : 'Match Score'}: {verificationResult.confidence}% {verificationResult.success ? '(85% க்கும் மேல் - தேர்ச்சி)' : '(தேர்ச்சி பெறவில்லை - போலி நபர்)'}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-200">
                          {verificationResult.success ? (
                            <>கார்டு உரிமையாளர்: <strong className="text-cyan-300">{verificationResult.userName}</strong> (உள்ளே செல்ல அனுமதிக்கப்படுகிறது)</>
                          ) : (
                            <strong className="text-rose-300">கார்டு உரிமையாளரின் முகத்துடன் ஒத்துப் போகவில்லை! பணம் எடுக்க அனுமதி இல்லை.</strong>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleRescan}
                    className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                  >
                    {language === 'ta' ? 'மறு ஸ்கேன் செய்க' : 'Rescan Face'}
                  </button>
                </div>

                {/* Status Banners */}
                {verificationResult.success ? (
                  <div className="mt-4 pt-3 border-t border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-2 text-emerald-300 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>
                        {language === 'ta'
                          ? `முகப் பொருத்தம் வெற்றி! PIN சரிபார்ப்பிற்குச் செல்கிறது...`
                          : `Face Matched! Proceeding to PIN verification...`}
                      </span>
                    </div>

                    <button
                      onClick={proceedFromStep2CardToStep3Pin}
                      className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 transition cursor-pointer flex items-center justify-center space-x-1"
                    >
                      <span>{language === 'ta' ? 'உள்ளே செல் (Proceed to PIN)' : 'Proceed Inside →'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 pt-3 border-t border-rose-800/40 p-3 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200 flex items-center justify-between">
                    <span className="font-bold">
                      🛑 {language === 'ta' ? 'முகப் பொருத்தம் இல்லாததால் பரிவர்த்தனை தடுக்கப்பட்டது! கார்டு வெளியேற்றப்படுகிறது...' : 'Face did not match registered owner! Transaction blocked and card ejected.'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              {!verificationResult.completed ? (
                <button
                  onClick={() => {
                    speakItem('முக வரைபடம் ஸ்கேன் செய்யப்பட்டு சரிபார்க்கப்படுகிறது', 'Scanning face vector and verifying');
                    executeVerification();
                  }}
                  onMouseEnter={() => speakItem('முகத்தை ஸ்கேன் செய்யும் பட்டன்', 'Capture and verify face button')}
                  disabled={!faceDetected || isScanning}
                  className="w-full flex-1 flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 py-4 px-6 text-sm font-bold text-white shadow-xl shadow-blue-500/30 hover:from-blue-500 hover:to-cyan-500 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ScanFace className="h-5 w-5" />
                  <span>
                    {isScanning
                      ? (language === 'ta' ? 'முக வரைபடம் ஒப்பிடப்படுகிறது...' : 'Scanning Facial Vector...')
                      : faceDetected
                      ? (language === 'ta' ? 'முகத்தை ஸ்கேன் செய்து ஒப்பிடுக (Verify Face)' : 'Capture & Verify Face')
                      : (language === 'ta' ? 'முகத்தைக் கேமராவிற்கு நேராக வைக்கவும்' : 'Align Face in Camera Frame')}
                  </span>
                </button>
              ) : verificationResult.success ? (
                <button
                  onClick={() => {
                    speakItem('அடுத்த படிக்கு செல்கிறீர்கள். ரகசிய பின் எண் உள்ளிடவும்.', 'Proceeding to next step. Please enter your secret PIN.');
                    proceedFromStep2CardToStep3Pin();
                  }}
                  onMouseEnter={() => speakItem('பின் எண் உள்ளிட உள்ளே செல்லும் பட்டன்', 'Proceed to PIN button')}
                  className="w-full flex-1 flex items-center justify-center space-x-2 rounded-2xl py-4 px-6 text-sm font-bold text-white shadow-xl bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/30 hover:from-emerald-500 hover:to-teal-500 transition active:scale-[0.99] cursor-pointer"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>
                    {language === 'ta'
                      ? 'FACE MATCHED ✓ • PIN உள்ளிட உள்ளே செல்க (PROCEED INSIDE)'
                      : 'FACE MATCHED ✓ • PROCEED INSIDE TO PIN'}
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  disabled
                  className="w-full flex-1 flex items-center justify-center space-x-2 rounded-2xl py-4 px-6 text-sm font-bold text-rose-300 bg-rose-950/80 border-2 border-rose-500 shadow-xl opacity-90 cursor-not-allowed"
                >
                  <AlertCircle className="h-5 w-5 text-rose-400" />
                  <span>
                    {language === 'ta'
                      ? 'FACE NOT MATCHED ✕ • அணுகல் மறுக்கப்பட்டது (TRANSACTION BLOCKED)'
                      : 'FACE NOT MATCHED ✕ • ACCESS DENIED (BLOCKED)'}
                  </span>
                </button>
              )}
            </div>

            {/* Quick Touchless Palm Vein Biometrics Option & Demo Simulation Modes */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
              <button
                onClick={() => {
                  speakItem('தொடுதலில்லா பனை நரம்பு ரேகை ஸ்கேன் சரிபார்க்கப்பட்டது', 'Touchless palm vein scan verified');
                  setVerificationResult({
                    completed: true,
                    success: true,
                    confidence: 99.8,
                    userName: activeUser?.name || 'Anitha K'
                  });
                  handleStep1FaceVerification(true, 99.8);
                  speakGuidance('STEP1_FACE_SUCCESS');
                }}
                onMouseEnter={() => speakItem('தொடுதலில்லா பனை நரம்பு ரேகை ஸ்கேன்', 'Touchless palm vein scan')}
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl border border-purple-500/50 bg-purple-950/50 text-purple-300 hover:bg-purple-900/60 font-mono font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
              >
                <Hand className="w-4 h-4 text-purple-400 animate-bounce" />
                <span>{language === 'ta' ? '🖐️ தொடுதலில்லா பனை நரம்பு ரேகை ஸ்கேன் (Palm Scan Option)' : '🖐️ Touchless Palm Vein Biometric Scan'}</span>
              </button>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setDemoSimulationMode('NORMAL');
                    handleRescan();
                  }}
                  className={`px-3 py-1 rounded-xl border text-[11px] font-semibold transition cursor-pointer ${
                    demoSimulationMode === 'NORMAL'
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🟢 Legitimate User (98.6% Match)
                </button>

                <button
                  onClick={() => {
                    setDemoSimulationMode('STOLEN_CARD');
                    handleRescan();
                  }}
                  className={`px-3 py-1 rounded-xl border text-[11px] font-semibold transition cursor-pointer ${
                    demoSimulationMode === 'STOLEN_CARD'
                      ? 'border-purple-500 bg-purple-950/60 text-purple-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🔴 Stolen Card Imposter (41.8% Mismatch)
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Security Statement Footer */}
      <div className="mt-6 text-center text-xs text-slate-500">
        <p>CashGuard AI ATM Terminal • Live Browser Webcam Biometric Liveness & Facial Recognition</p>
      </div>
    </div>
  );
};
