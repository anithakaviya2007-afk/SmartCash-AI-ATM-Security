import React from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles, Gauge, Sliders } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { VOICE_PROMPTS, VoiceGuidanceKey, unlockAudioAndVoice } from '../utils/voiceGuidance';

interface VoiceGuidancePromptBarProps {
  currentKey: VoiceGuidanceKey;
  customTitle?: string;
  className?: string;
}

export const VoiceGuidancePromptBar: React.FC<VoiceGuidancePromptBarProps> = ({
  currentKey,
  customTitle,
  className = ''
}) => {
  const {
    voiceLanguage,
    setVoiceLanguage,
    voiceSpeed,
    setVoiceSpeed,
    voiceMuted,
    setVoiceMuted,
    isSpeaking,
    speakGuidance,
    setIsVoiceSettingsOpen,
    language
  } = useSecurity();

  const prompt = VOICE_PROMPTS[currentKey] || VOICE_PROMPTS.WELCOME_GREETING;
  const primaryText = voiceLanguage === 'ta' ? prompt.ta : prompt.en;
  const secondaryText = voiceLanguage === 'ta' ? prompt.en : prompt.ta;
  const secondaryLangLabel = voiceLanguage === 'ta' ? 'English' : 'தமிழ்';
  const displayTitle = customTitle || (language === 'ta' ? prompt.titleTa : prompt.titleEn);

  const handlePlayVoice = () => {
    unlockAudioAndVoice();
    if (voiceMuted) {
      setVoiceMuted(false);
    }
    speakGuidance(currentKey);
  };

  const handleToggleSpeed = () => {
    unlockAudioAndVoice();
    let nextSpeed = 0.95;
    if (voiceSpeed <= 0.88) nextSpeed = 0.95;
    else if (voiceSpeed <= 1.05) nextSpeed = 1.15;
    else nextSpeed = 0.85;
    setVoiceSpeed(nextSpeed);
    speakGuidance(currentKey, undefined, nextSpeed);
  };

  const speedLabel =
    voiceSpeed <= 0.88
      ? (language === 'ta' ? 'மெதுவாக (0.85x)' : 'Slow (0.85x)')
      : voiceSpeed <= 1.05
      ? (language === 'ta' ? 'சரியான வேகம் (0.95x)' : 'Normal (0.95x)')
      : (language === 'ta' ? 'வேகமாக (1.15x)' : 'Fast (1.15x)');

  return (
    <div
      className={`rounded-2xl border border-cyan-500/30 bg-slate-900/90 backdrop-blur-md p-3 sm:p-3.5 shadow-lg shadow-blue-950/40 transition-all ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Left: Speaker Status & Spoken Text */}
        <div className="flex items-start sm:items-center space-x-3 min-w-0 flex-1">
          <button
            onClick={handlePlayVoice}
            className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border transition shadow-sm cursor-pointer ${
              isSpeaking
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-400/30 animate-pulse'
                : voiceMuted
                ? 'border-slate-800 bg-slate-900 text-slate-500 opacity-60'
                : 'border-cyan-500/40 bg-cyan-950/80 text-cyan-400 hover:bg-cyan-900 hover:text-white'
            }`}
            title={language === 'ta' ? 'குரல் வழிகாட்டலைக் கேட்க கிளிக் செய்யவும்' : 'Click to hear Voice Guidance'}
          >
            {voiceMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className={`h-5 w-5 ${isSpeaking ? 'animate-bounce text-cyan-300' : ''}`} />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-400 flex items-center space-x-1.5">
                <span>
                  {displayTitle} • {voiceLanguage === 'ta' ? 'தமிழ்' : 'ENGLISH'}
                </span>
                {isSpeaking && (
                  <span className="inline-flex items-center space-x-0.5 ml-1 text-cyan-400">
                    <span className="h-2 w-0.5 bg-cyan-400 animate-pulse"></span>
                    <span className="h-3.5 w-0.5 bg-cyan-400 animate-pulse delay-75"></span>
                    <span className="h-2.5 w-0.5 bg-cyan-400 animate-pulse delay-150"></span>
                    <span className="h-4 w-0.5 bg-cyan-300 animate-pulse delay-100"></span>
                  </span>
                )}
              </span>
            </div>

            {/* Primary Voice Text */}
            <p className="text-xs sm:text-sm font-bold text-white tracking-wide mt-0.5 leading-relaxed font-sans">
              "{primaryText}"
            </p>

            {/* Secondary Dual-Language Subtitle */}
            <p className="text-[11px] text-slate-400 mt-0.5 italic truncate">
              {secondaryLangLabel}: {secondaryText}
            </p>
          </div>
        </div>

        {/* Right: Controls & Language Switcher & Settings */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 self-end sm:self-center shrink-0">
          
          {/* Replay / Speak Button */}
          <button
            onClick={handlePlayVoice}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 hover:text-white text-xs font-bold transition active:scale-95 cursor-pointer"
            title={language === 'ta' ? 'குரல் கேட்க (Play)' : 'Play Voice'}
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isSpeaking ? 'animate-spin' : 'text-cyan-400'}`} />
            <span>{language === 'ta' ? 'கேட்க' : 'Play'}</span>
          </button>

          {/* Speed Toggle (Slow / Normal / Fast) */}
          <button
            onClick={handleToggleSpeed}
            className="inline-flex items-center space-x-1 px-2 py-1.5 rounded-lg border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-[11px] font-mono font-bold transition active:scale-95 cursor-pointer"
            title={speedLabel}
          >
            <Gauge className="h-3 w-3 text-cyan-400" />
            <span>{voiceSpeed <= 0.88 ? '0.85x' : voiceSpeed <= 1.05 ? '0.95x' : '1.15x'}</span>
          </button>

          {/* Inline Language Selector */}
          <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 p-0.5 text-xs">
            <button
              onClick={() => {
                unlockAudioAndVoice();
                setVoiceLanguage('ta');
                speakGuidance(currentKey, 'ta');
              }}
              className={`px-2 py-1 rounded-md font-bold transition cursor-pointer ${
                voiceLanguage === 'ta'
                  ? 'bg-amber-500/30 text-amber-300 font-extrabold border border-amber-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => {
                unlockAudioAndVoice();
                setVoiceLanguage('en');
                speakGuidance(currentKey, 'en');
              }}
              className={`px-2 py-1 rounded-md font-bold transition cursor-pointer ${
                voiceLanguage === 'en'
                  ? 'bg-cyan-500/30 text-cyan-300 font-extrabold border border-cyan-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
          </div>

          {/* Voice Settings & Tuning Button */}
          <button
            onClick={() => setIsVoiceSettingsOpen(true)}
            className="inline-flex items-center space-x-1 px-2 py-1.5 rounded-lg border border-cyan-500/40 bg-slate-800/90 hover:bg-cyan-950/70 text-cyan-300 hover:text-white text-xs font-bold transition active:scale-95 cursor-pointer"
            title={language === 'ta' ? 'குரல் ஒலி அளவு & வேகம் சரிசெய்தல் (Voice Adjust)' : 'Voice Settings & Adjust'}
          >
            <Sliders className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{language === 'ta' ? 'சரிசெய்' : 'Adjust'}</span>
          </button>

          {/* Mute/Unmute */}
          <button
            onClick={() => {
              unlockAudioAndVoice();
              setVoiceMuted(!voiceMuted);
            }}
            className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
              voiceMuted
                ? 'border-rose-500/40 bg-rose-950/60 text-rose-400'
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title={voiceMuted ? (language === 'ta' ? 'குரலை இயக்கவும்' : 'Unmute Voice') : (language === 'ta' ? 'குரலை முடக்கவும்' : 'Mute Voice')}
          >
            {voiceMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

        </div>
      </div>
    </div>
  );
};

