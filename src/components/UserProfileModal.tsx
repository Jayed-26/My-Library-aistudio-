import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, User, Mail, Camera, Check, UploadCloud, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const {
    currentUser,
    isProfileModalOpen,
    setProfileModalOpen,
    updateUserProfile,
    showToast
  } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser, isProfileModalOpen]);

  if (!isProfileModalOpen || !currentUser) return null;

  // Process any uploaded image into a strict 1:1 square cropped image using HTML5 Canvas
  const processImageToSquare = (file: File) => {
    setIsProcessingImage(true);
    setErrorMsg('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const size = 400; // Output high-res 1:1 square 400x400
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            setErrorMsg('Could not process image canvas');
            setIsProcessingImage(false);
            return;
          }

          // Calculate center crop for perfect 1:1 square ratio
          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = (img.height - minDim) / 2;

          ctx.drawImage(
            img,
            startX,
            startY,
            minDim,
            minDim,
            0,
            0,
            size,
            size
          );

          const squareDataUrl = canvas.toDataURL('image/jpeg', 0.92);
          setAvatar(squareDataUrl);
          setIsProcessingImage(false);
          showToast('Profile photo cropped to 1:1 square format!');
        } catch (err: any) {
          setErrorMsg('Failed to process image: ' + err.message);
          setIsProcessingImage(false);
        }
      };
      img.onerror = () => {
        setErrorMsg('Failed to load image file');
        setIsProcessingImage(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read image file');
      setIsProcessingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please select a valid image file (PNG, JPG, WebP).');
        return;
      }
      processImageToSquare(file);
    }
  };

  const generateNewInitialsAvatar = () => {
    const seed = name.trim() || email.trim() || 'Reader';
    const randomBg = ['fbbf24', 'f59e0b', '10b981', '3b82f6', '8b5cf6', 'ec4899'][Math.floor(Math.random() * 6)];
    const newAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${randomBg}`;
    setAvatar(newAvatar);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setErrorMsg('Name is required.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('A valid email address is required.');
      return;
    }

    setErrorMsg('');
    await updateUserProfile({
      name: cleanName,
      email: cleanEmail,
      avatar: avatar.trim() || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=fbbf24`
    });

    setProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-[460px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-xl font-display font-bold text-stone-900">
              Edit Reader Profile
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Update your name, email, and 1:1 square profile picture
            </p>
          </div>
          <button
            onClick={() => setProfileModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          
          {/* Requirement 3: Profile Pic 1:1 Square Size Enforcement */}
          <div className="flex flex-col items-center p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200">
            <label className="text-xs font-bold text-stone-800 mb-2 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-amber-600" />
              <span>Profile Picture</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-200 text-stone-900 rounded-full ml-1">
                Strict 1:1 Square Ratio
              </span>
            </label>

            {/* 1:1 Square Frame */}
            <div className="relative group">
              <div className="w-28 h-28 aspect-square rounded-2xl overflow-hidden border-3 border-amber-400 bg-white shadow-md flex items-center justify-center relative">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name || 'User Profile'}
                    className="w-full h-full aspect-square object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-stone-300" />
                )}

                {isProcessingImage && (
                  <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center text-white text-[11px] font-bold">
                    Cropping 1:1...
                  </div>
                )}
              </div>

              {/* Upload Overlay Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 p-2 bg-stone-900 hover:bg-amber-400 text-amber-300 hover:text-stone-950 rounded-xl shadow-md transition-all cursor-pointer group-hover:scale-105"
                title="Upload Photo (Automatically cropped to 1:1 square)"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex items-center gap-2 mt-3.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5 text-stone-600" />
                <span>Upload Custom Photo</span>
              </button>

              <button
                type="button"
                onClick={generateNewInitialsAvatar}
                className="px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Generate Avatar with Initials"
              >
                <RefreshCw className="w-3.5 h-3.5 text-stone-600" />
                <span>Initials Avatar</span>
              </button>
            </div>
            <p className="text-[10px] text-stone-500 mt-2 text-center">
              Any photo uploaded is automatically centered and formatted to 1:1 square dimensions.
            </p>
          </div>

          {/* Requirement 1: Change Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
              <span>Full Name</span>
              <span className="text-amber-600 font-bold text-[10px] uppercase">Required</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Enter your name"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-stone-900"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Requirement 2: Change Email */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
              <span>Email Address</span>
              <span className="text-amber-600 font-bold text-[10px] uppercase">Required</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="reader@gmail.com"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-stone-900"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
            <p className="text-[10px] text-stone-400 mt-1">
              Used for receiving author approvals and download notifications.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setProfileModalOpen(false)}
              className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
