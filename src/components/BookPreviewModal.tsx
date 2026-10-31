import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, BookOpen, ChevronRight, ChevronLeft, Download, Lock, CheckCircle2 } from 'lucide-react';

export const BookPreviewModal: React.FC = () => {
  const {
    activePreviewBook,
    setActivePreviewBook,
    setActiveRequestBook,
    currentUser,
    setAuthModalOpen,
    getUserRequestForBook
  } = useApp();

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  if (!activePreviewBook) return null;

  const chapters = activePreviewBook.previewContent.chapters;
  const currentChapter = chapters[activeChapterIndex] || chapters[0];
  const userRequest = getUserRequestForBook(activePreviewBook.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF8F5] border-b border-stone-200">
          <div className="flex items-center gap-3 truncate">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-xs shrink-0">
              PDF
            </div>
            <div className="truncate">
              <h3 className="font-display font-bold text-base text-stone-900 truncate">
                {activePreviewBook.title} — Free Preview
              </h3>
              <p className="text-[11px] text-stone-500 truncate">
                Reading Chapter {activeChapterIndex + 1} of {chapters.length} (Sample Excerpt)
              </p>
            </div>
          </div>

          <button
            onClick={() => setActivePreviewBook(null)}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors ml-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two-column reader layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Table of Contents Sidebar */}
          <div className="md:col-span-4 bg-stone-50 p-4 border-r border-stone-200 overflow-y-auto hidden sm:block">
            <div className="flex items-center gap-2 mb-4">
              <img
                src={activePreviewBook.coverUrl}
                alt={activePreviewBook.title}
                className="w-12 h-16 object-cover rounded shadow-xs"
              />
              <div>
                <p className="text-xs font-bold text-stone-900 line-clamp-1">{activePreviewBook.title}</p>
                <p className="text-[10px] text-stone-500">Price: ৳{activePreviewBook.price}</p>
                <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                  Free Sample
                </span>
              </div>
            </div>

            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
              Preview Chapters
            </p>

            <div className="space-y-1.5">
              {chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveChapterIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                    activeChapterIndex === idx
                      ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                      : 'text-stone-700 hover:bg-stone-200/70 font-medium'
                  }`}
                >
                  <span className="truncate">{ch.number}: {ch.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                </button>
              ))}

              <div className="p-3 bg-stone-100 rounded-xl border border-dashed border-stone-300 text-stone-400 text-[11px] text-center mt-4">
                <Lock className="w-3.5 h-3.5 mx-auto mb-1 text-stone-400" />
                <span>Chapters 3–12 locked. Unlock with full bKash access below.</span>
              </div>
            </div>
          </div>

          {/* Reader Content Pane */}
          <div className="md:col-span-8 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-400 pb-3 border-b border-stone-100 mb-6">
                <span>{currentChapter.number}</span>
                <span>Page {activeChapterIndex + 1} / {chapters.length}</span>
              </div>

              <h2 className="text-2xl font-display font-bold text-stone-900 mb-4">
                {currentChapter.title}
              </h2>

              <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed text-sm sm:text-base space-y-4">
                <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-amber-500 first-letter:mr-1 first-letter:float-left">
                  {currentChapter.content}
                </p>
                <p className="text-stone-600">
                  "Every breakthrough in creative focus begins by eliminating the subconscious burden of perfection. As we build systems that reward play, the natural consequence is speed and consistency."
                </p>
                <div className="p-4 bg-amber-50 border-l-2 border-amber-400 rounded-r-lg text-xs text-amber-900 italic">
                  Excerpt from '{activePreviewBook.title}' by Jayed Mahmud. Complete edition includes exercises, downloadable cheat sheets, and case studies.
                </div>
              </div>
            </div>

            {/* Bottom chapter navigation controls */}
            <div className="mt-8 pt-6 border-t border-stone-200 flex items-center justify-between">
              <button
                disabled={activeChapterIndex === 0}
                onClick={() => setActiveChapterIndex(prev => Math.max(0, prev - 1))}
                className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Chapter</span>
              </button>

              <button
                disabled={activeChapterIndex === chapters.length - 1}
                onClick={() => setActiveChapterIndex(prev => Math.min(chapters.length - 1, prev + 1))}
                className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span>Next Chapter</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Modal Bottom Sticky CTA */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-800">
              Liked the preview? Unlock Full Book (৳{activePreviewBook.price})
            </span>
            <span className="text-[10px] text-stone-500 hidden sm:inline">
              · Includes {activePreviewBook.pages} pages & author Q&A access
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {userRequest?.status === 'approved' ? (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Full Book Approved!</span>
              </span>
            ) : (
              <button
                onClick={() => {
                  setActivePreviewBook(null);
                  if (!currentUser) {
                    setAuthModalOpen(true);
                  } else {
                    setActiveRequestBook(activePreviewBook);
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Request Full PDF Access (৳{activePreviewBook.price})</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
