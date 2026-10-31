import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Download, Star, CheckCircle, BookOpen, Printer, Share2 } from 'lucide-react';

export const FullBookModal: React.FC = () => {
  const {
    activeFullBook,
    setActiveFullBook,
    setActiveReviewModalBook,
    showToast
  } = useApp();

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  if (!activeFullBook) return null;

  const chapters = activeFullBook.fullContent?.chapters || activeFullBook.previewContent.chapters;
  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  const handleDownloadFile = () => {
    // Generate text/pdf document blob for download
    const fullText = `
=====================================================
${activeFullBook.title.toUpperCase()}
${activeFullBook.subtitle}
Author: Jayed Mahmud
Official Licensed Copy - Verified Reader Access
=====================================================

${chapters.map(c => `
--- ${c.number}: ${c.title} ---
${c.content}
`).join('\n\n')}

=====================================================
Copyright (c) Jayed Mahmud. All rights reserved.
Official direct download from jayedmahmud.com
=====================================================
`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeFullBook.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-full-edition.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Downloading '${activeFullBook.title}' full edition...`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-amber-300">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-amber-400 text-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-stone-950 leading-tight">
                {activeFullBook.title} — Complete Edition
              </h3>
              <p className="text-[11px] text-stone-900/80 font-medium">
                Verified Purchase · Approved by Jayed Mahmud
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFile}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              title="Download file to computer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF File</span>
            </button>

            <button
              onClick={() => setActiveFullBook(null)}
              className="p-1.5 text-stone-900 hover:bg-amber-500/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Reader Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-white">
          
          {/* Table of Contents */}
          <div className="md:col-span-4 bg-stone-50 p-4 border-r border-stone-200 overflow-y-auto">
            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
              Full Table of Contents ({chapters.length} Chapters)
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
                  <span className="text-[10px] text-stone-500">Read</span>
                </button>
              ))}
            </div>

            <div className="mt-8 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-xs font-bold text-emerald-900 mb-1">
                Verified Reader Privilege
              </p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                As an approved reader of this book, you are eligible to leave an official review and rating.
              </p>
              <button
                onClick={() => {
                  setActiveFullBook(null);
                  setActiveReviewModalBook(activeFullBook);
                }}
                className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Submit Book Review</span>
              </button>
            </div>
          </div>

          {/* Chapter Reading Pane */}
          <div className="md:col-span-8 p-6 sm:p-8 overflow-y-auto bg-white">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between text-xs text-stone-400 pb-3 border-b border-stone-100 mb-6">
                <span>{currentChapter.number}</span>
                <span>Page {activeChapterIndex + 1} of {chapters.length}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900 mb-6">
                {currentChapter.title}
              </h2>

              <div className="text-stone-800 text-base leading-relaxed space-y-5">
                <p>{currentChapter.content}</p>
                <p>
                  "Consistency produces compounding results. When you align your daily biological energy peaks with your most impactful creative leverage points, work transforms from an exhausting obligation into an effortless state of flow."
                </p>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold">Key Action Step:</span> Implement the 10-minute focus audit described in this section before tomorrow's work session.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
