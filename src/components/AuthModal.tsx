import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, User, ShieldCheck, ArrowRight, Check } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, loginWithGoogle } = useApp();
  const [useOtherAccount, setUseOtherAccount] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim();
    if (!email) {
      setErrorMsg('Please enter your Google email address.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address (e.g., yourname@gmail.com).');
      return;
    }

    setErrorMsg('');
    loginWithGoogle(email, nameInput.trim());
    setEmailInput('');
    setNameInput('');
    setUseOtherAccount(false);
  };

  const handleAuthorOneClick = () => {
    loginWithGoogle('jayedmahmud18@gmail.com', 'Jayed Mahmud (Author)');
    setUseOtherAccount(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          {/* Official Google 'G' Logo */}
          <div className="flex items-center gap-2.5">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className="text-sm font-semibold text-stone-800">Google Accounts</span>
          </div>

          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 pb-6 pt-2">
          <div className="mb-5">
            <h3 className="font-display font-extrabold text-xl text-stone-900 tracking-tight">
              Sign in with Google
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Choose an account to continue to <span className="font-semibold text-stone-700">Jayed Mahmud E-Books</span>
            </p>
          </div>

          {!useOtherAccount ? (
            <div className="space-y-2.5">
              {/* Primary Verified Author / Owner Google Account */}
              <button
                type="button"
                onClick={handleAuthorOneClick}
                className="w-full p-3.5 bg-amber-50/70 hover:bg-amber-100/80 border border-amber-300 rounded-xl text-left transition-all flex items-center justify-between group shadow-2xs hover:shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-stone-950 font-bold flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform">
                    JM
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-stone-900 leading-tight">
                        Jayed Mahmud
                      </p>
                      <span className="text-[10px] font-bold bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded">
                        Author / Admin
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5">
                      jayedmahmud18@gmail.com
                    </p>
                  </div>
                </div>
                <ShieldCheck className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform shrink-0" />
              </button>

              {/* Use Another Google Account option */}
              <button
                type="button"
                onClick={() => setUseOtherAccount(true)}
                className="w-full p-3.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-left transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900 leading-tight">
                      Use another Google account
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Sign in as reader to request and download e-books
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            </div>
          ) : (
            /* Sign in with custom Google Account form */
            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Google Email Address <span className="text-red-500">*</span>
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
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-stone-900"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-600 font-medium">
                  {errorMsg}
                </p>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setUseOtherAccount(false)}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Sign in with Google</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </form>
          )}

          {/* Privacy & Terms Note */}
          <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-stone-500 leading-relaxed text-center">
            To continue, Google will share your name and email address with Jayed Mahmud's E-Book Store. Read our privacy policy.
          </div>

        </div>

      </div>
    </div>
  );
};
