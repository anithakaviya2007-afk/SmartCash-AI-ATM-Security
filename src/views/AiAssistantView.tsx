import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Volume2,
  VolumeX,
  ShieldAlert,
  Lock,
  CreditCard,
  FileText,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2,
  RefreshCw,
  User,
  MessageSquare,
  HelpCircle,
  Landmark,
  X,
  Zap,
  Mic
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  category?: 'GENERAL' | 'CARD_BLOCK' | 'WITHDRAWAL' | 'BRANCH' | 'LOAN';
}

export const AiAssistantView: React.FC = () => {
  const { language, speakGuidance, navigateTo } = useSecurity();

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: language === 'ta'
        ? 'வணக்கம்! நான் உங்கள் 24/7 Gemini AI வங்கி மற்றும் ஏடிஎம் உதவி உதவியாளர். கார்டு இன்றி முகம் மூலம் பணம் எடுப்பது, கார்டு முடக்கம் அல்லது ஏடிஎம் நிலவரம் குறித்து என்னிடம் கேளுங்கள்!'
        : 'Hello! I am your 24/7 Gemini AI Banking & Emergency Assistant. Ask me about cardless biometric withdrawals, emergency card blocks, or nearby ATM status!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'GENERAL'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeechActive, setIsSpeechActive] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  // Card Emergency Block State
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [cardBlocked, setCardBlocked] = useState(false);
  const [blockedCardNumber, setBlockedCardNumber] = useState('4532 •••• •••• 8892');

  // Digital Receipt State
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<{
    txId: string;
    amount: string;
    date: string;
    atmName: string;
    authMethod: string;
    status: string;
  } | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const speakText = (text: string, lang: 'en' | 'ta') => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.1; // Slightly friendly pitch
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // Speak initial message if speech is active on load
  useEffect(() => {
    if (isSpeechActive && messages.length === 1) {
       speakText(messages[0].text, language);
    }
  }, [isSpeechActive, language]);

  // Quick Questions
  const quickPrompts = language === 'ta' ? [
    'கார்டு இல்லாமல் பணம் எடுப்பது எப்படி?',
    'ஏடிஎம் கார்டு தொலைந்துவிட்டது, முடக்குவது எப்படி?',
    'அருகிலுள்ள வங்கிக் கிளை மற்றும் வேலை நேரம்',
    'முக அங்கீகாரம் பாதுகாப்பானதா?'
  ] : [
    'How to withdraw cash without Debit Card?',
    'Lost my ATM card! How to block instantly?',
    'Nearby Bank branch timings & locker availability',
    'Is facial recognition ATM safe?'
  ];

  // AI Knowledge Base
  const getAiResponse = (userInput: string): string => {
    const text = userInput.toLowerCase();

    if (text.includes('cardless') || text.includes('without') || text.includes('கார்டு இல்லாமல்') || text.includes('பணம் எடுக்க') || text.includes('எடுப்பது எப்படி')) {
      return language === 'ta'
        ? 'கார்டு இல்லாமல் பணம் எடுக்க:\n1. ஏடிஎம் திரையில் "Step 1: Face Recognition" கிளிக் செய்யவும்.\n2. உங்கள் முகத்தைச் சான்றளித்து OTP சரிபார்க்கவும்.\n3. தேவையான தொகையை உள்ளிட்டு நொடிகளில் பணம் பெறலாம்!'
        : 'To withdraw cash without a card:\n1. Click "Step 1: Face Recognition" on the ATM screen.\n2. Verify your face biometrics & OTP.\n3. Enter amount and collect cash instantly without inserting any card!';
    }

    if (text.includes('block') || text.includes('lost') || text.includes('தொலைந்து') || text.includes('முடக்கு')) {
      return language === 'ta'
        ? '⚠️ உங்கள் ஏடிஎம் கார்டை உடனடியாக முடக்க கீழே உள்ள "அவசர கார்டு முடக்கு (Block Debit Card)" பொத்தானைப் பயன்படுத்தலாம் அல்லது எங்கள் 24/7 அவசர எண்ணை (1800-425-3800) அழைக்கலாம்.'
        : '⚠️ You can instantly block your debit card right now using the "Emergency Card Freeze" button on this screen, or call our 24/7 hotline at 1800-425-3800.';
    }

    if (text.includes('branch') || text.includes('timing') || text.includes('கிளை') || text.includes('நேரம்')) {
      return language === 'ta'
        ? '🏦 எங்கள் வங்கிக் கிளைகள் திங்கள் முதல் சனி வரை காலை 10:00 AM முதல் மாலை 04:00 PM வரை செயல்படும். அருகிலுள்ள கிளைகளைக் காண "Nearby Bank Branches" பக்கத்தைப் பார்வையிடுங்கள்.'
        : '🏦 Bank branches operate Mon-Sat from 10:00 AM to 04:00 PM. You can view all nearby branches and book priority queue tokens in the "Nearby Bank Branches" tab!';
    }

    if (text.includes('safe') || text.includes('security') || text.includes('பாதுகாப்பு')) {
      return language === 'ta'
        ? '🛡️ ஆம்! எங்கள் ஏடிஎம்கள் 3D Liveness Detection மற்றும் AI Anti-Spoofing தொழில்நுட்பம் கொண்டவை. புகைப்படங்கள் அல்லது வீடியோக்களைக் கொண்டு பணத்தைத் திருட முடியாது.'
        : '🛡️ Yes! Our system uses 3D Depth Liveness Detection & AI Anti-Spoofing. Photos, masks, or videos cannot bypass our biometric authentication.';
    }

    return language === 'ta'
      ? 'உங்கள் கேள்விக்குப் நன்றி! நான் உங்கள் Gemini AI உதவியாளர். கார்டு இல்லாத பணப் பரிவர்த்தனை, ஏடிஎம் இருப்பிடம், மற்றும் வங்கிச் சேவைகள் குறித்து மேலும் உதவி செய்யத் தயார்.'
      : 'Thank you for your question! As your Gemini AI assistant, I can guide you with cardless biometric cash withdrawals, nearby ATM status, or immediate emergency support.';
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = getAiResponse(query);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

      if (isSpeechActive) {
        speakText(responseText, language);
      }
    }, 1500);
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // Play a short listen beep
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    osc.frequency.value = 880;
    osc.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);

    setTimeout(() => {
      setIsRecording(false);
      const simulatedVoiceInput = language === 'ta' 
        ? 'கார்டு இல்லாமல் பணம் எடுப்பது எப்படி சொல்லுங்க?' 
        : 'How can I withdraw cash without a card?';
      
      handleSendMessage(simulatedVoiceInput);
    }, 3000);
  };


  // Mock Recent Transactions for Receipt
  const recentTransactions = [
    {
      txId: 'TXN-984210',
      amount: '₹ 5,000',
      date: 'Today, 10:24 AM',
      atmName: 'Anna Nagar Main Vault Hub',
      authMethod: 'Biometric Face AI (Score 98.4%)',
      status: 'SUCCESS'
    },
    {
      txId: 'TXN-984182',
      amount: '₹ 2,000',
      date: 'Yesterday, 06:15 PM',
      atmName: 'T. Nagar Commercial CDM',
      authMethod: 'Card + PIN + Face Biometrics',
      status: 'SUCCESS'
    }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/50 text-indigo-300 font-mono text-xs font-bold uppercase tracking-wider">
              <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>{language === 'ta' ? '24/7 AI தமிழ் & ஆங்கில உதவி மையம்' : '24/7 Gemini AI Banking Support Hub'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {language === 'ta' ? '🤖 AI நிதி ஆலோசகர் & அவசர பாதுகாப்பு மையம்' : '🤖 AI Financial Assistant & Emergency Center'}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              {language === 'ta'
                ? 'கார்டு இன்றி முகம் மூலம் பணம் எடுப்பது எப்படி, அவசர காலத்தில் கார்டை முடக்குவது மற்றும் இ-ரசீதுகளைப் பெறுவது குறித்து நேரலை உரையாடலைத் தொடங்குங்கள்.'
                : 'Get instant answers for cardless cash withdrawals, emergency debit card freeze, loss reports, and digital transaction e-receipts.'}
            </p>
          </div>

          {/* Emergency Card Freeze Action Button */}
          <button
            onClick={() => setShowBlockModal(true)}
            className="self-start md:self-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm transition cursor-pointer shadow-lg shadow-red-950 flex items-center space-x-2 border border-red-400/50"
          >
            <ShieldAlert className="w-5 h-5 text-white animate-bounce" />
            <span>{language === 'ta' ? '🚨 அவசர கார்டு முடக்கு (Freeze Card)' : '🚨 Instant Debit Card Freeze'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: AI Chat Assistant + Emergency Controls & E-Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Interactive Chat Window (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between min-h-[580px]">
          {/* Chat Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                  <span>Gemini Banking AI</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {language === 'ta' ? 'ஆன்லைன் | 24/7 நேரலை உதவி' : 'ONLINE | 24/7 Instant Assistant'}
                </p>
              </div>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => setIsSpeechActive(!isSpeechActive)}
              className={`p-2.5 rounded-xl border text-xs font-mono transition flex items-center space-x-1.5 cursor-pointer ${
                isSpeechActive
                  ? 'bg-cyan-950 border-cyan-500/60 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isSpeechActive ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSpeechActive ? 'Voice ON' : 'Mute'}</span>
            </button>
          </div>

          {/* Messages Container */}
          <div className="py-4 space-y-4 overflow-y-auto max-h-[380px] pr-2">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-700/60 text-indigo-300 shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-tr-none font-sans shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line font-sans shadow-inner'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[10px] font-mono opacity-60 block mt-1.5 text-right">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-700/60 text-cyan-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-xs text-indigo-400 font-mono p-3 bg-slate-950/80 rounded-2xl border border-slate-800 w-fit">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Gemini AI is thinking...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              {language === 'ta' ? 'விரைவு கேள்விகள்:' : 'Quick Questions:'}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 hover:border-indigo-500 text-xs transition cursor-pointer font-sans"
                >
                  💡 {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={startVoiceRecording}
                className={`p-3 rounded-2xl transition cursor-pointer shadow-md ${
                  isRecording 
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={language === 'ta' ? 'குரல் மூலம் கேள் (Voice Search)' : 'Voice Input'}
              >
                <Mic className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isRecording 
                  ? (language === 'ta' ? 'கேட்கிறது...' : 'Listening...')
                  : (language === 'ta' ? 'உங்கள் கேள்வியைத் தட்டச்சு செய்க...' : 'Type your question here...')}
                className="flex-1 py-3 px-4 bg-slate-950 border border-slate-700 focus:border-indigo-400 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white transition disabled:opacity-40 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Emergency Card Block + E-Receipt Generator (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Freeze Status Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-red-400">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>DEBIT CARD SECURITY CONTROL</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-extrabold border ${
                cardBlocked
                  ? 'bg-red-950 text-red-300 border-red-700'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-700'
              }`}>
                {cardBlocked ? '🔴 FROZEN / BLOCKED' : '🟢 CARD ACTIVE'}
              </span>
            </div>

            {/* Simulated Virtual Debit Card */}
            <div className={`p-5 rounded-2xl border-2 transition-all relative overflow-hidden shadow-2xl ${
              cardBlocked
                ? 'bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 border-red-500'
                : 'bg-gradient-to-br from-indigo-900 via-slate-900 to-cyan-950 border-indigo-500/60'
            }`}>
              <div className="flex justify-between items-start mb-6">
                <CreditCard className="w-8 h-8 text-white/80" />
                <span className="font-mono text-xs text-indigo-300 font-extrabold tracking-widest">
                  DEBIT CARD
                </span>
              </div>

              <div className="font-mono text-lg font-black text-white tracking-widest mb-4">
                {blockedCardNumber}
              </div>

              <div className="flex justify-between items-end text-xs font-mono text-slate-300">
                <div>
                  <span className="text-[9px] text-slate-400 block">CARD HOLDER</span>
                  <span className="font-bold text-white uppercase">ANITHA KAVIYA</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">EXP</span>
                  <span className="font-bold text-white">09/28</span>
                </div>
              </div>

              {cardBlocked && (
                <div className="absolute inset-0 bg-red-950/90 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="text-center space-y-1">
                    <Lock className="w-8 h-8 text-red-400 mx-auto animate-bounce" />
                    <div className="text-red-300 font-black text-xs font-mono uppercase">
                      CARD TEMPORARILY FROZEN
                    </div>
                    <p className="text-[10px] text-slate-300">
                      Protected from fraudulent ATM transactions.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Toggle Freeze Button */}
            <button
              onClick={() => {
                setCardBlocked(!cardBlocked);
                speakGuidance('ACCESS_GRANTED');
              }}
              className={`w-full py-3 px-4 rounded-2xl font-extrabold text-xs transition cursor-pointer shadow-md flex items-center justify-center space-x-2 border ${
                cardBlocked
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-red-600 hover:bg-red-500 text-white border-red-400'
              }`}
            >
              {cardBlocked ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'ta' ? 'கார்டை மீண்டும் செயல்படுத்து (Unfreeze Card)' : 'Unfreeze & Activate Card'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{language === 'ta' ? 'கார்டை உடனடியாக முடக்கு (Freeze Card)' : 'Instant One-Tap Freeze Card'}</span>
                </>
              )}
            </button>
          </div>

          {/* E-Receipt Download Center */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>ATM E-RECEIPTS & PASSBOOK</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">2 Transactions</span>
            </div>

            <div className="space-y-2">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.txId}
                  className="p-3 bg-slate-950 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-white">{tx.amount}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {tx.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{tx.atmName}</p>
                    <span className="text-[10px] font-mono text-slate-500">{tx.date}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedReceipt(tx);
                      setShowReceiptModal(true);
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-cyan-950 text-cyan-300 border border-slate-700 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border-2 border-red-500 rounded-3xl p-6 max-w-md w-full relative shadow-2xl shadow-red-950 space-y-4">
            <button
              onClick={() => setShowBlockModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-red-400 font-mono text-xs font-bold uppercase">
              <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
              <span>EMERGENCY CARD BLOCK CONFIRMATION</span>
            </div>

            <h3 className="text-xl font-extrabold text-white">
              {language === 'ta' ? 'டெபிட் கார்டை முடக்க விரும்புகிறீர்களா?' : 'Freeze Debit Card Immediately?'}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'ta'
                ? 'இந்த நடவடிக்கையின் மூலம் உங்கள் கார்டு அனைத்து ஏடிஎம்களிலும் தற்காலிகமாக முடக்கப்படும். பின்னர் எப்போது வேண்டுமானாலும் செயலியின் மூலம் மீண்டும் செயல்படுத்திக் கொள்ளலாம்.'
                : 'This will temporarily freeze your debit card across all ATMs & POS terminals. You can unfreeze it anytime from your profile.'}
            </p>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono space-y-1">
              <span className="text-slate-400 block text-[10px]">24/7 HELPLINE HOTLINE:</span>
              <a href="tel:18004253800" className="text-cyan-400 font-black text-sm flex items-center space-x-1.5">
                <PhoneCall className="w-4 h-4" />
                <span>Toll-Free: 1800-425-3800</span>
              </a>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowBlockModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCardBlocked(true);
                  setShowBlockModal(false);
                  speakGuidance('ACCESS_GRANTED');
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition cursor-pointer shadow-lg shadow-red-950"
              >
                Confirm Freeze Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border-2 border-cyan-500/80 rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl shadow-cyan-950 space-y-4">
            <button
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>OFFICIAL ATM DIGITAL TRANSACTION E-RECEIPT</span>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-left space-y-3 font-mono text-xs shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400 text-[10px]">TRANSACTION ID</span>
                <span className="text-cyan-300 font-bold">{selectedReceipt.txId}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[10px]">AMOUNT</span>
                <span className="text-emerald-400 font-black text-lg">{selectedReceipt.amount}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[10px]">ATM LOCATION</span>
                <span className="text-slate-200 text-right font-sans text-[11px] max-w-[150px]">{selectedReceipt.atmName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[10px]">AUTH METHOD</span>
                <span className="text-indigo-300 font-bold text-[10px]">{selectedReceipt.authMethod}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-[10px]">
                <span className="text-slate-400">DATE & TIME</span>
                <span className="text-slate-300">{selectedReceipt.date}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs transition cursor-pointer shadow-md flex items-center justify-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Save E-Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
