import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { BookOpen, ShieldCheck, LogIn, LogOut, Sparkles, UserCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    profile,
    currentUser,
    isAdmin,
    loginWithGoogle,
    logout,
    toggleAdminMode,
    setAdminModalOpen,
    setAuthModalOpen,
    requests,
    reviews,
    messages
  } = useApp();

  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;
  const pendingReviewsCount = reviews.filter(r => r.status === 'pending').length;
  const unreadMessagesCount = messages.filter(m => m.status === 'unread').length;
  const totalAdminAlerts = pendingRequestsCount + pendingReviewsCount + unreadMessagesCount;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a href="#" className="flex items-center gap-2 group whitespace-nowrap shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            {profile.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg sm:text-xl text-stone-900 tracking-tight flex items-center gap-1.5">
              {profile.name}
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
            </span>
            <span className="text-[11px] text-stone-500 font-medium -mt-1 hidden sm:block">
              {profile.role.split('&')[0]}
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <a href="#about" className="hover:text-amber-600 transition-colors whitespace-nowrap">
            About
          </a>
          <a href="#ebooks" className="hover:text-amber-600 transition-colors whitespace-nowrap">
            E-Books
          </a>
          <a href="#reviews" className="hover:text-amber-600 transition-colors whitespace-nowrap">
            Reader Reviews
          </a>
          <a href="#contact" className="hover:text-amber-600 transition-colors whitespace-nowrap">
            Contact & Message
          </a>
        </nav>

        {/* Zone 3: Actions & User Auth */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Admin Switcher / Dashboard Trigger */}
          {isAdmin ? (
            <button
              onClick={() => setAdminModalOpen(true)}
              className="relative px-3.5 py-2 text-xs font-semibold text-stone-900 bg-amber-300 hover:bg-amber-400 rounded-lg transition-all shadow-sm flex items-center gap-2 whitespace-nowrap shrink-0"
              title="Open Author Admin Dashboard"
            >
              <ShieldCheck className="w-4 h-4 text-stone-900" />
              <span>Admin Dashboard</span>
              {totalAdminAlerts > 0 && (
                <span className="w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {totalAdminAlerts}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={() => toggleAdminMode(true)}
              className="text-xs text-stone-500 hover:text-stone-900 px-2.5 py-1.5 rounded-md hover:bg-stone-200/50 transition-colors hidden sm:flex items-center gap-1"
              title="Switch to Author Admin View"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Author Login</span>
            </button>
          )}

          {/* User Sign-In with Google */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full border border-amber-300 bg-white object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-stone-900 leading-tight truncate max-w-[110px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-stone-500 truncate max-w-[110px]">
                  {currentUser.email}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-3.5 py-2 text-xs font-medium text-stone-800 bg-white border border-stone-300 hover:border-stone-400 hover:bg-stone-50 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-600" />
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
