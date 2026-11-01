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
    setProfileModalOpen,
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
          {/* Admin Dashboard Trigger - ONLY visible when author is authenticated */}
          {isAdmin && (
            <button
              onClick={() => setAdminModalOpen(true)}
              className="relative px-3.5 py-2 text-xs font-semibold text-stone-900 bg-amber-300 hover:bg-amber-400 rounded-lg transition-all shadow-sm flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
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
          )}

          {/* User Sign-In / User Profile */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <button
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-2.5 p-1.5 hover:bg-stone-100 rounded-xl transition-all cursor-pointer group text-left"
                title="Edit Profile (Name, Email & 1:1 Profile Picture)"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full border-2 border-amber-400 bg-white object-cover aspect-square shadow-2xs group-hover:ring-2 group-hover:ring-amber-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-amber-400 rounded-full border border-white flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-stone-900 rounded-full"></span>
                  </div>
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-stone-900 leading-tight truncate max-w-[110px] group-hover:text-amber-700">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-stone-500 truncate max-w-[110px]">
                    {currentUser.email}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setProfileModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-stone-700 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 rounded-lg transition-colors border border-stone-200 cursor-pointer"
                title="Edit Profile"
              >
                <span>Edit Profile</span>
              </button>

              <button
                onClick={logout}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-stone-800 bg-white border border-stone-300 hover:border-stone-400 hover:bg-stone-50 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap shadow-xs active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
