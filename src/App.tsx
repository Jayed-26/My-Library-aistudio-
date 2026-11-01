import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { EbooksSection } from './components/EbooksSection.tsx';
import { ReviewsSection } from './components/ReviewsSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { BookPreviewModal } from './components/BookPreviewModal.tsx';
import { FullBookModal } from './components/FullBookModal.tsx';
import { DownloadRequestModal } from './components/DownloadRequestModal.tsx';
import { ReviewSubmitModal } from './components/ReviewSubmitModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { UserProfileModal } from './components/UserProfileModal.tsx';
import { AdminDashboardModal } from './components/AdminDashboardModal.tsx';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { toastMessage, isAdmin, setAdminModalOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-amber-200 selection:text-amber-950">
      
      {/* Admin Mode floating quick indicator for easy testing and author management */}
      {isAdmin && (
        <aside aria-label="Author admin mode banner" className="bg-amber-400 text-stone-950 py-1.5 px-4 text-xs font-bold flex items-center justify-between z-30 shadow-xs border-b border-amber-500">
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-stone-950" />
              <span>Admin Mode Active: You have full authority to edit books, bio, approve bKash requests & reviews.</span>
            </span>
            <button
              onClick={() => setAdminModalOpen(true)}
              className="underline hover:text-stone-800 font-extrabold cursor-pointer text-xs ml-2"
            >
              Open Dashboard →
            </button>
          </div>
        </aside>
      )}

      {/* Top Navbar */}
      <Navbar />

      {/* Main 4 Sections */}
      <main className="flex-1">
        {/* Section 1: Top Hero Section - Porichoy, Bio below name, Picture on the right */}
        <HeroSection />

        {/* Section 2: E-Books Collection - List, Search bar, Free Preview, bKash download request */}
        <EbooksSection />

        {/* Section 3: Book Review & Rating - Verified buyers only, text-only, author approval */}
        <ReviewsSection />

        {/* Section 4: Contact the Author - Email, Social links, Quick Message form */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <BookPreviewModal />
      <FullBookModal />
      <DownloadRequestModal />
      <ReviewSubmitModal />
      <AuthModal />
      <UserProfileModal />
      <AdminDashboardModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-amber-400/30 animate-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
