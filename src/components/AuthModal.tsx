import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, LogIn, ShieldCheck, User } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, loginWithGoogle } = useApp();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    loginWithGoogle(customEmail.trim(), customName.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF8F5] border-b border-stone-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h3 className="font-display font-bold text-base text-stone-900">
              Sign in with Google
            </h3>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="text-xs text-stone-600 mb-6 leading-relaxed">
            Google Sign-in is required to request verified e-book downloads, track bKash payment verification, and write reader reviews.
          </p>

          {/* Quick 1-Click Profile Options */}
          <div className="space-y-3 mb-6">
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Quick Accounts for Testing
            </p>

            {/* Author Profile */}
            <button
              onClick={() => loginWithGoogle('jayedmahmud18@gmail.com', 'Jayed Mahmud (Author)')}
              className="w-full p-3 bg-amber-50 hover:bg-amber-100/80 border border-amber-300 rounded-xl text-left transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-400 text-stone-950 font-bold flex items-center justify-center text-xs">
                  JM
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <span>Jayed Mahmud</span>
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded">
                      Author / Admin
                    </span>
                  </p>
                  <p className="text-[11px] text-stone-500">jayedmahmud18@gmail.com</p>
                </div>
              </div>
              <ShieldCheck className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            </button>

            {/* Reader Profile */}
            <button
              onClick={() => loginWithGoogle('rahman.hasan.bd@gmail.com', 'Rahman Hasan')}
              className="w-full p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-left transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-xs">
                  RH
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <span>Rahman Hasan</span>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                      Approved Reader
                    </span>
                  </p>
                  <p className="text-[11px] text-stone-500">rahman.hasan.bd@gmail.com</p>
                </div>
              </div>
              <User className="w-4 h-4 text-stone-400 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-semibold text-stone-400">
              Or Use Your Own Google Email
            </span>
          </div>

          {/* Custom Google Account Form */}
          <form onSubmit={handleCustomLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Tanvir Ahmed"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Google Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="e.g. yourname@gmail.com"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Continue with Google</span>
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
