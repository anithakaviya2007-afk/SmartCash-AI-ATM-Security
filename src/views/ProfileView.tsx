import React, { useState } from 'react';
import {
  User,
  CreditCard,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Building,
  KeyRound,
  LogOut,
  Users,
  CheckCircle2,
  Camera,
  Upload,
  Edit3,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { ProfilePhotoEditorModal } from '../components/ProfilePhotoEditorModal';

export const ProfileView: React.FC = () => {
  const {
    activeUser,
    users,
    setActiveUser,
    updateUserProfilePhoto,
    resetUserProfilePhoto,
    updateUserPinCode,
    resetVerification,
    liveDateTime
  } = useSecurity();

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [photoSavedToast, setPhotoSavedToast] = useState<boolean>(false);
  const [pinSavedToast, setPinSavedToast] = useState<boolean>(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  const handleSavePhoto = (photoDataUrl: string) => {
    if (!activeUser) return;
    updateUserProfilePhoto(activeUser.userId, photoDataUrl);
    setPhotoSavedToast(true);
    setTimeout(() => {
      setPhotoSavedToast(false);
    }, 4000);
  };

  const handleResetPhoto = () => {
    if (!activeUser) return;
    resetUserProfilePhoto(activeUser.userId);
    setPhotoSavedToast(true);
    setTimeout(() => {
      setPhotoSavedToast(false);
    }, 4000);
  };

  const handleOpenPinModal = () => {
    setNewPinInput(activeUser?.pinCode || '123456');
    setPinError('');
    setIsPinModalOpen(true);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) return;
    if (!/^\d{6}$/.test(newPinInput)) {
      setPinError('PIN must be exactly 6 numeric digits (0-9).');
      return;
    }
    updateUserPinCode(activeUser.userId, newPinInput);
    setIsPinModalOpen(false);
    setPinSavedToast(true);
    setTimeout(() => {
      setPinSavedToast(false);
    }, 4000);
  };

  const userPhoto = activeUser?.faceImageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80';
  const currentPin = activeUser?.pinCode || '123456';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col justify-between transition-colors">
      
      <div className="max-w-4xl mx-auto w-full space-y-6">

        {/* Local Storage Saved Notification Toast */}
        {photoSavedToast && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/80 p-3.5 text-emerald-200 text-xs shadow-lg backdrop-blur-md flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Profile photo updated successfully!</strong> The photo is stored locally in your browser and will persist on refresh.
              </span>
            </div>
            <button
              onClick={() => setPhotoSavedToast(false)}
              className="text-emerald-400 hover:text-white text-xs font-semibold px-2 py-0.5"
            >
              Dismiss
            </button>
          </div>
        )}

        {pinSavedToast && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/80 p-3.5 text-emerald-200 text-xs shadow-lg backdrop-blur-md flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                <strong>6-Digit PIN updated successfully!</strong> New PIN is set to <strong className="font-mono text-emerald-300">{currentPin}</strong> and saved to local storage.
              </span>
            </div>
            <button
              onClick={() => setPinSavedToast(false)}
              className="text-emerald-400 hover:text-white text-xs font-semibold px-2 py-0.5"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {/* Profile Header Card */}
        <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl border border-cyan-500/30 p-6 sm:p-8 shadow-2xl shadow-blue-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            
            {/* Circular Profile Avatar with Change Photo Trigger */}
            <div className="relative group shrink-0">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border-2 border-cyan-400 shadow-xl ring-4 ring-cyan-500/20 bg-slate-950 flex items-center justify-center transition group-hover:ring-cyan-400/50">
                <img
                  src={userPhoto}
                  alt={activeUser?.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>

              {/* Hover Edit Overlay */}
              <button
                onClick={() => setIsPhotoModalOpen(true)}
                title="Change / Edit Profile Photo"
                className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold space-y-1 backdrop-blur-xs"
              >
                <Camera className="h-5 w-5 text-cyan-400" />
                <span>Change</span>
              </button>

              {/* Circular Biometric Active Badge */}
              <span
                title="Enrolled Biometric Profile"
                className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-md flex items-center justify-center"
              >
                <CheckCircle2 className="h-4 w-4 text-white" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {activeUser?.name}
                </h1>
                <span className="rounded-full bg-emerald-950/80 border border-emerald-500/40 px-3 py-0.5 text-xs font-bold text-emerald-300">
                  {activeUser?.accountStatus}
                </span>
              </div>
              
              <p className="text-xs text-slate-400 font-mono">
                {activeUser?.role} • {activeUser?.department}
              </p>

              {/* Edit Photo & PIN Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/60 hover:bg-cyan-900/60 text-xs font-bold text-cyan-300 hover:text-white shadow-xs transition active:scale-95"
                >
                  <Camera className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Edit Profile Photo</span>
                </button>

                <button
                  onClick={handleOpenPinModal}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-950/60 hover:bg-amber-900/60 text-xs font-bold text-amber-300 hover:text-white shadow-xs transition active:scale-95"
                >
                  <KeyRound className="h-3.5 w-3.5 text-amber-400" />
                  <span>Change 6-Digit PIN</span>
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={resetVerification}
            className="flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-950/60 hover:text-rose-200 hover:border-rose-500/40 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Terminate Session</span>
          </button>
        </div>

        {/* Security Credentials & Hardware Tokens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card & Biometric Tokens */}
          <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <span>Multi-Factor Credentials</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400 flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-slate-500" />
                  <span>Card Token ID</span>
                </span>
                <span className="font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                  {activeUser?.cardId}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">Masked Card Number</span>
                <span className="font-mono font-bold text-white tracking-wider">
                  {activeUser?.maskedCardNumber}
                </span>
              </div>

              {/* 6-Digit ATM PIN Field */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400 flex items-center space-x-2">
                  <KeyRound className="h-4 w-4 text-amber-400" />
                  <span>6-Digit ATM PIN</span>
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded tracking-widest">
                    {showPin ? currentPin : '••••••'}
                  </span>
                  <button
                    onClick={() => setShowPin(!showPin)}
                    className="p-1 text-slate-400 hover:text-slate-200"
                    title={showPin ? 'Hide PIN' : 'Reveal PIN'}
                  >
                    {showPin ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={handleOpenPinModal}
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 ml-1"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400 flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-slate-500" />
                  <span>Registered Mobile (OTP)</span>
                </span>
                <span className="font-mono font-bold text-slate-200">
                  {activeUser?.maskedPhoneNumber}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400 flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span>Email Address</span>
                </span>
                <span className="font-medium text-slate-200">{activeUser?.email}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Biometric Template Hash</span>
                <span className="font-mono text-[11px] text-cyan-400">SHA256: 8f4a...910e (Enrolled)</span>
              </div>
            </div>
          </div>

          {/* Access History & Permissions */}
          <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
              <Building className="h-4 w-4 text-emerald-400" />
              <span>Authorizations & Clearance</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">Security Clearance Level</span>
                <span className="font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
                  LEVEL 3 (UNRESTRICTED LAB & ATM)
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400 flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>Last Successful Access</span>
                </span>
                <span className="font-mono font-medium text-slate-200">
                  {activeUser?.lastAccessDate} • {activeUser?.lastAccessTime}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400 flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span>Last Access Terminal</span>
                </span>
                <span className="font-medium text-slate-200">
                  {activeUser?.lastAccessLocation}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">ATM Account Ledger</span>
                <span className="font-mono font-bold text-cyan-400">
                  ₹{(activeUser?.atmBalance || 25000).toLocaleString('en-IN')} (Demo Sandbox)
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Demo Switch User Selector */}
        <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-2">
              <Users className="h-4 w-4 text-indigo-400" />
              <span>Switch Demo Active Identity (Prototype Testing)</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Select persona for fast testing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {users.map(u => (
              <button
                key={u.userId}
                onClick={() => setActiveUser(u)}
                className={`p-3 rounded-2xl border text-left transition flex items-center space-x-3 ${
                  activeUser?.userId === u.userId
                    ? 'border-cyan-500 bg-cyan-950/50 ring-2 ring-cyan-500/30 text-white'
                    : 'border-slate-800 bg-slate-950/60 hover:bg-slate-850 text-slate-300'
                }`}
              >
                <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-700 shrink-0">
                  <img
                    src={u.faceImageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
                    alt={u.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate">{u.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">PIN: {u.pinCode || '123456'}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Profile Photo Editor Modal */}
      {activeUser && (
        <ProfilePhotoEditorModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          currentPhotoUrl={userPhoto}
          userName={activeUser.name}
          onSavePhoto={handleSavePhoto}
          onResetPhoto={handleResetPhoto}
        />
      )}

      {/* Change 6-Digit PIN Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-amber-500/40 p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <KeyRound className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-white text-base">Change 6-Digit PIN</h3>
              </div>
              <button
                onClick={() => setIsPinModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSavePin} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  New 6-Digit ATM PIN
                </label>
                <input
                  type="text"
                  maxLength={6}
                  pattern="\d{6}"
                  value={newPinInput}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setNewPinInput(val);
                    setPinError('');
                  }}
                  placeholder="e.g. 567890"
                  className="w-full rounded-xl border border-amber-500/40 bg-slate-950 px-4 py-3 text-center text-2xl font-mono font-bold tracking-widest text-amber-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  autoFocus
                />
                <p className="text-[11px] text-slate-400 mt-1.5 text-center">
                  Must be exactly 6 digits. Saved locally for offline testing.
                </p>
              </div>

              {pinError && (
                <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs text-center font-medium">
                  {pinError}
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={newPinInput.length !== 6}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold transition shadow-md disabled:opacity-50"
                >
                  Save 6-Digit PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6 text-center text-xs text-slate-500 font-mono">
        <span>SmartSecureAccess • Cardholder Profile & Biometric Ledger</span>
      </div>

    </div>
  );
};

