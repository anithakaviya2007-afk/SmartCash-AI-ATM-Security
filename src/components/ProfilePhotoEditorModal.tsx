import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Camera,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Check,
  RefreshCw,
  Sparkles,
  Sliders,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { playSound } from '../utils/soundEffects';

interface ProfilePhotoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoUrl?: string;
  userName: string;
  onSavePhoto: (photoDataUrl: string) => void;
  onResetPhoto: () => void;
}

const PRESET_AVATARS = [
  {
    id: 'preset-1',
    label: 'Professional 1',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-2',
    label: 'Professional 2',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-3',
    label: 'Professional 3',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-4',
    label: 'Professional 4',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-5',
    label: 'Tech Specialist',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-6',
    label: 'Security Analyst',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80'
  }
];

export const ProfilePhotoEditorModal: React.FC<ProfilePhotoEditorModalProps> = ({
  isOpen,
  onClose,
  currentPhotoUrl,
  userName,
  onSavePhoto,
  onResetPhoto
}) => {
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>(currentPhotoUrl || PRESET_AVATARS[0].url);
  const [zoom, setZoom] = useState<number>(1);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const [previewCroppedUrl, setPreviewCroppedUrl] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Load current photo when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedImageSrc(currentPhotoUrl || PRESET_AVATARS[0].url);
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
      setRotation(0);
      setFeedbackMessage('');
    }
  }, [isOpen, currentPhotoUrl]);

  // Load image object whenever selectedImageSrc changes
  useEffect(() => {
    if (!selectedImageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageObjRef.current = img;
      renderCroppedPreview();
    };
    img.src = selectedImageSrc;
  }, [selectedImageSrc]);

  // Re-render crop whenever zoom, offset, rotation changes
  useEffect(() => {
    if (imageObjRef.current) {
      renderCroppedPreview();
    }
  }, [zoom, offsetX, offsetY, rotation]);

  const renderCroppedPreview = () => {
    const img = imageObjRef.current;
    if (!img) return;

    const canvas = canvasRef.current || document.createElement('canvas');
    const size = 320;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    // Create circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Fill background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, size, size);

    // Transform and draw image
    ctx.translate(size / 2 + offsetX, size / 2 + offsetY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate aspect fit inside square
    const imgAspect = img.width / img.height;
    let drawWidth = size;
    let drawHeight = size;

    if (imgAspect > 1) {
      drawWidth = size * imgAspect;
    } else {
      drawHeight = size / imgAspect;
    }

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setPreviewCroppedUrl(dataUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFeedbackMessage('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setSelectedImageSrc(result);
        setZoom(1);
        setOffsetX(0);
        setOffsetY(0);
        setRotation(0);
        setFeedbackMessage('Image loaded successfully. Adjust crop if needed.');
        playSound.beepSuccess();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSave = () => {
    if (!previewCroppedUrl) return;
    playSound.accessGranted();
    onSavePhoto(previewCroppedUrl);
    onClose();
  };

  const handleReset = () => {
    playSound.keyPress();
    onResetPhoto();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Change Profile Photo</h2>
              <p className="text-xs text-slate-400">
                Upload and crop a clean circular photo for {userName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hidden Canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Drag & Drop Upload Banner */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-4 sm:p-5 text-center transition-all ${
            isDraggingFile
              ? 'border-cyan-400 bg-cyan-950/40 scale-[1.01]'
              : 'border-slate-700 bg-slate-950/60 hover:border-cyan-500/60 hover:bg-slate-800/40'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                Click to upload an image from your device or drag & drop here
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                PNG, JPG, or WEBP (Saved locally in your browser)
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Cropper & Circular Viewport */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Main Circular Mask Area */}
          <div className="md:col-span-7 flex flex-col items-center">
            <div className="relative w-56 h-56 rounded-full overflow-hidden bg-slate-950 border-4 border-cyan-500/40 shadow-xl ring-4 ring-cyan-500/10 flex items-center justify-center">
              {previewCroppedUrl ? (
                <img
                  src={previewCroppedUrl}
                  alt="Circular Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <ImageIcon className="h-8 w-8 mb-1 opacity-50" />
                  <span className="text-xs">Loading image...</span>
                </div>
              )}

              {/* High-tech reticle overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-full border border-cyan-400/30" />
            </div>

            <span className="mt-3 text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
              CIRCULAR CROP VIEWPORT
            </span>
          </div>

          {/* Adjustments & Fine-Tuning Controls */}
          <div className="md:col-span-5 space-y-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                <span>Adjust Photo</span>
              </span>
              <button
                onClick={() => {
                  setZoom(1);
                  setOffsetX(0);
                  setOffsetY(0);
                  setRotation(0);
                }}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Reset Controls
              </button>
            </div>

            {/* Zoom Slider */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="flex items-center space-x-1">
                  <ZoomOut className="h-3 w-3" />
                  <span>Zoom Scale</span>
                </span>
                <span className="font-mono text-cyan-400">{zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Horizontal Pan */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Pan (Horizontal X)</span>
                <span className="font-mono text-slate-300">{offsetX}px</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="2"
                value={offsetX}
                onChange={(e) => setOffsetX(parseInt(e.target.value))}
                className="w-full accent-blue-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Vertical Pan */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Pan (Vertical Y)</span>
                <span className="font-mono text-slate-300">{offsetY}px</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="2"
                value={offsetY}
                onChange={(e) => setOffsetY(parseInt(e.target.value))}
                className="w-full accent-blue-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Rotate Button */}
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Orientation</span>
              <button
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                <RotateCw className="h-3 w-3 text-cyan-400" />
                <span>Rotate 90°</span>
              </button>
            </div>
          </div>

        </div>

        {/* Preset Sample Avatars */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Or Choose a Preset Avatar</span>
            </span>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {PRESET_AVATARS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedImageSrc(preset.url);
                  setZoom(1);
                  setOffsetX(0);
                  setOffsetY(0);
                  setRotation(0);
                  playSound.keyPress();
                }}
                className="group relative rounded-full overflow-hidden aspect-square border-2 border-slate-700 hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-200"
                />
              </button>
            ))}
          </div>
        </div>

        {feedbackMessage && (
          <div className="mt-4 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center text-xs text-cyan-300">
            {feedbackMessage}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center space-x-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset to Default Photo</span>
          </button>

          <div className="w-full sm:w-auto flex items-center space-x-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition active:scale-[0.98]"
            >
              <Check className="h-4 w-4" />
              <span>Save & Apply Photo</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
