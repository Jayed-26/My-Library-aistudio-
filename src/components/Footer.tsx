import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { profile, isAdmin, toggleAdminMode, setAdminModalOpen } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-800">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 font-bold flex items-center justify-center text-sm">
              {profile.name.charAt(0)}
            </div>
            <div>
              <p className="font-display font-bold text-white text-base">
                {profile.name}
              </p>
              <p className="text-xs text-stone-400">
                Official E-Book Library & Personal Brand Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-stone-400 font-medium">
            <a href="#about" className="hover:text-amber-300 transition-colors">
              About
            </a>
            <a href="#ebooks" className="hover:text-amber-300 transition-colors">
              E-Books Collection
            </a>
            <a href="#reviews" className="hover:text-amber-300 transition-colors">
              Reader Reviews
            </a>
            <a href="#contact" className="hover:text-amber-300 transition-colors">
              Contact & bKash
            </a>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} {profile.name}. All rights reserved. E-books published directly with bKash verification.
          </p>

          {isAdmin && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAdminModalOpen(true)}
                className="text-stone-400 hover:text-amber-400 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Author Dashboard</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </footer>
  );
};
