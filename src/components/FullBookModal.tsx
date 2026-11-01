import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  Download,
  Star,
  CheckCircle,
  BookOpen,
  FileText,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { downloadFile, generateEbookPdf } from '../utils/pdfHelper.ts';

export const FullBookModal: React.FC = () => {
  const {
    activeFullBook,
    setActiveFullBook,
    setActiveReviewModalBook,
    showToast
  } = useApp();

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'reader' | 'pdf'>('reader');

  if (!activeFullBook) return null;

  const chapters = activeFullBook.fullContent?.chapters || activeFullBook.previewContent?.chapters || [];
  const currentChapter = chapters[activeChapterIndex] || chapters[0] || {
    number: 'Full Edition',
    title: activeFullBook.title,
    content: activeFullBook.description
  };

  const handleDownloadFullPdf = () => {
    if (activeFullBook.fullPdfUrl) {
      downloadFile(
        activeFullBook.fullPdfUrl,
        activeFullBook.fullPdfFileName || `${activeFullBook.title}-Full-Edition.pdf`
      );
      showToast(`Downloading official PDF edition of '${activeFullBook.title}'...`);
    } else {
      // Auto-generate rich PDF on the fly
      const { blob, fileName } = generateEbookPdf(activeFullBook, false);
      downloadFile(blob, fileName);
      showToast(`Generated & downloaded full PDF for '${activeFullBook.title}'!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-amber-400">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-white border-b border-amber-400/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <CheckCircle className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-amber-300 leading-tight">
                {activeFullBook.title} — Official Full Edition
              </h3>
              <p className="text-[11px] text-stone-300 font-medium">
                Verified Purchase · Approved directly by Jayed Mahmud
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFullPdf}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md hover:scale-105"
              title="Download official PDF to your computer"
            >
              <Download className="w-4 h-4" />
              <span>Download Full PDF</span>
            </button>

            <button
              onClick={() => setActiveFullBook(null)}
              className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Bar */}
        <div className="flex items-center justify-between px-6 py-2 bg-[#FAF8F5] border-b border-stone-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('reader')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                viewMode === 'reader'
                  ? 'bg-stone-900 text-amber-300 shadow-2xs'
                  : 'text-stone-600 hover:bg-stone-200/70'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Formatted Reader Mode</span>
            </button>

            {activeFullBook.fullPdfUrl && (
              <button
                onClick={() => setViewMode('pdf')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  viewMode === 'pdf'
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-200/70'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF Document Embed</span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-stone-500 hidden sm:block">
            {activeFullBook.fullPdfFileName || `${activeFullBook.title}.pdf`}
          </div>
        </div>

        {/* Modal Reader Body */}
        {viewMode === 'pdf' && activeFullBook.fullPdfUrl ? (
          <div className="flex-1 w-full bg-stone-100 flex flex-col items-center justify-center min-h-[500px] p-2 overflow-hidden">
            <iframe
              src={activeFullBook.fullPdfUrl}
              className="w-full h-full rounded-xl border border-stone-300 shadow-inner bg-white"
              title="Full Book PDF Viewer"
            />
          </div>
        ) : (
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
                <p className="text-xs font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Reader Privilege</span>
                </p>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  As an approved reader of this book, you can now write an official review and rating.
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
                  <span>Page {activeChapterIndex + 1} of {Math.max(1, chapters.length)}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900 mb-6">
                  {currentChapter.title}
                </h2>

                <div className="text-stone-800 text-base leading-relaxed space-y-5">
                  <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-amber-500 first-letter:mr-1 first-letter:float-left">
                    {currentChapter.content}
                  </p>
                  <p>
                    "Consistency produces compounding results. When you align your daily biological energy peaks with your most impactful creative leverage points, work transforms from an exhausting obligation into an effortless state of flow."
                  </p>
                  <p className="text-stone-700">
                    "Every master was once an amateur who refused to quit. By removing unnecessary complexity and cultivating deep focus, your work naturally scales in quality and reach."
                  </p>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                    <span className="font-bold">Author's Note:</span> Thank you for supporting independent writing. If this chapter provided clarity, please consider sharing your verified review with fellow readers.
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
