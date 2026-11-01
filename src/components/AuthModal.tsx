import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, loginWithGoogle } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim();
    const name = nameInput.trim();

    if (!email) {
      setErrorMsg('Email address is required.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address (e.g., name@gmail.com).');
      return;
    }
    if (!name) {
      setErrorMsg('User Name is required.');
      return;
    }
    if (name.length < 2) {
      setErrorMsg('User Name must be at least 2 characters.');
      return;
    }

    setErrorMsg('');
    loginWithGoogle(email, name);
    setEmailInput('');
    setNameInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 p-8">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setErrorMsg('');
            setAuthModalOpen(false);
          }}
          className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Official Google G Logo */}
        <div className="flex justify-start mb-4">
          <svg className="w-7 h-7" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-normal text-stone-900 tracking-tight mb-1 font-display">
          Sign in with Google
        </h3>
        <p className="text-xs text-stone-600 mb-6 font-normal">
          Both Email and User Name are required to personalize your reader experience.
        </p>

        {/* Google Email & User Name Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
              <span>Email Address</span>
              <span className="text-amber-600 font-bold text-[10px] uppercase">Required</span>
            </label>
            <input
              type="email"
              required
              autoFocus
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g. reader@gmail.com"
              className="w-full px-4 py-3 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-stone-900 transition-all placeholder:text-stone-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
              <span>User Name</span>
              <span className="text-amber-600 font-bold text-[10px] uppercase">Required</span>
            </label>
            <input
              type="text"
              required
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g. Tanvir Hasan"
              className="w-full px-4 py-3 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-stone-900 transition-all placeholder:text-stone-400"
            />
            <p className="text-[10px] text-stone-400 mt-1">
              This name will appear on your download requests, reviews, and messages.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              {errorMsg}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Continue with Google</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Terms notice */}
        <p className="mt-8 text-[11px] text-stone-500 text-center leading-relaxed">
          To continue, Google will share your name and email address with Jayed Mahmud's E-Book Store.
        </p>

      </div>
    </div>
  );
};
