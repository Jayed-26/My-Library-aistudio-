import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Ebook } from '../types.ts';
import {
  Search,
  BookOpen,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Lock,
  FileText,
  FileCheck
} from 'lucide-react';
import { downloadFile } from '../utils/pdfHelper.ts';

export const EbooksSection: React.FC = () => {
  const {
    books,
    currentUser,
    isAdmin,
    getUserRequestForBook,
    setActivePreviewBook,
    setActiveFullBook,
    setActiveRequestBook,
    setAuthModalOpen,
    setAdminModalOpen,
    deleteBook,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Categories list
  const categories = ['All', 'Productivity', 'Creator Business', 'Mindset'];

  // Filter books based on search query and category
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || book.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [books, searchQuery, selectedCategory]);

  return (
    <section id="ebooks" className="py-16 md:py-24 bg-white border-y border-stone-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Official Publications
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-stone-900 tracking-tight">
              E-Books Collection
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Read free preview chapters instantly, or verify payment via bKash to unlock full PDF downloads approved directly by Jayed.
            </p>
          </div>

          {/* Admin Add New Book Button */}
          {isAdmin && (
            <button
              onClick={() => setAdminModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-stone-950 text-xs font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap self-start md:self-end"
            >
              <Plus className="w-4 h-4" />
              <span>Publish New E-Book</span>
            </button>
          )}
        </div>

        {/* Search Bar & Interactive Category Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-10 pb-6 border-b border-stone-100">
          
          {/* Search Input Bar (as requested: "user der jno website ey akta search bar thakbe") */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books by title, topic, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 text-stone-800 placeholder-stone-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-stone-950 shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ebooks Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16 px-4 bg-stone-50 rounded-2xl border border-stone-200">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">No books found</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              No e-books match your search query "{searchQuery}". Try searching another keyword or reset the filter.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-stone-800 bg-white border border-stone-300 rounded-lg hover:bg-stone-50"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => {
              const userRequest = getUserRequestForBook(book.id);

              return (
                <div
                  key={book.id}
                  className="group relative bg-[#FAF8F5] rounded-2xl border border-stone-200 hover:border-amber-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Book Cover Header Container */}
                  <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden flex items-center justify-center p-6 border-b border-stone-100">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-auto h-full max-h-[320px] object-contain rounded-md shadow-md group-hover:scale-102 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/images/cover_productivity_mastery_1793435132456.jpg';
                      }}
                    />

                    {/* Category unboxed tag */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-stone-800 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs border border-stone-200">
                      {book.category}
                    </div>

                    {/* Price in BDT */}
                    <div className="absolute top-4 right-4 bg-amber-400 text-stone-950 text-xs font-extrabold px-3 py-1 rounded-md shadow-xs tabular-nums">
                      ৳{book.price}
                    </div>

                    {/* Admin quick actions */}
                    {isAdmin && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10 bg-white/90 backdrop-blur-xs p-1 rounded-lg shadow-sm border border-stone-200">
                        <button
                          onClick={() => setAdminModalOpen(true)}
                          className="p-1.5 text-stone-600 hover:text-amber-600 hover:bg-stone-100 rounded"
                          title="Edit Book"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
                              deleteBook(book.id);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Delete Book"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Book Info Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
                        <span>{book.pages} Pages</span>
                        <span aria-hidden="true">·</span>
                        <span>PDF Edition</span>
                        <span aria-hidden="true">·</span>
                        <span>{book.publishedDate}</span>
                      </div>

                      <h3 className="font-display font-bold text-xl text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                        {book.title}
                      </h3>

                      <p className="text-xs font-medium text-amber-800 mt-0.5 line-clamp-1">
                        {book.subtitle}
                      </p>

                      <p className="text-xs text-stone-600 mt-3 line-clamp-3 leading-relaxed">
                        {book.description}
                      </p>
                    </div>

                    {/* Action & Download Status Area */}
                    <div className="mt-6 pt-4 border-t border-stone-200/60">
                      
                      {/* Request Status Notices */}
                      {userRequest && (
                        <div className="mb-3">
                          {userRequest.status === 'approved' && (
                            <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium">
                              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="truncate">Access Approved by Jayed! Full PDF ready.</span>
                            </div>
                          )}

                          {userRequest.status === 'pending' && (
                            <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs">
                              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold">bKash Verification Pending</p>
                                <p className="text-[11px] text-amber-800 mt-0.5">
                                  Ref: {userRequest.bkashNumber}. Author will review and approve shortly.
                                </p>
                              </div>
                            </div>
                          )}

                          {userRequest.status === 'rejected' && (
                            <div className="p-2.5 bg-red-50 border border-red-200 text-red-900 rounded-lg text-xs">
                              <div className="flex items-center gap-1.5 font-bold text-red-800 mb-1">
                                <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                                <span>Request Declined</span>
                              </div>
                              <p className="text-[11px] text-red-700 mb-2">
                                {userRequest.rejectionReason || 'Reference could not be verified.'}
                              </p>
                              {/* Request Again Button as explicitly requested by user! */}
                              <button
                                onClick={() => setActiveRequestBook(book)}
                                className="w-full py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Request Again</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Main Two Buttons: Free Preview & Full Download */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Free Preview (Always accessible to everyone) */}
                        <button
                          onClick={() => setActivePreviewBook(book)}
                          className="py-2.5 px-3 bg-white hover:bg-stone-100 text-stone-800 font-semibold text-xs rounded-xl border border-stone-300 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                          <span>Free Preview</span>
                        </button>

                        {/* Full Download / Access Button */}
                        {userRequest?.status === 'approved' ? (
                          <button
                            onClick={() => {
                              setActiveFullBook(book);
                              if (book.fullPdfUrl) {
                                downloadFile(book.fullPdfUrl, book.fullPdfFileName || `${book.title}-Full-Edition.pdf`);
                                showToast(`Downloading official full PDF of "${book.title}"...`);
                              }
                            }}
                            className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Full PDF</span>
                          </button>
                        ) : userRequest?.status === 'pending' ? (
                          <button
                            disabled
                            className="py-2.5 px-3 bg-amber-100 text-amber-900 font-semibold text-xs rounded-xl border border-amber-300 cursor-not-allowed opacity-80 flex items-center justify-center gap-1.5"
                          >
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>Pending Approval</span>
                          </button>
                        ) : userRequest?.status === 'rejected' ? (
                          <button
                            onClick={() => setActiveRequestBook(book)}
                            className="py-2.5 px-3 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Request Again</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (!currentUser) {
                                setAuthModalOpen(true);
                              } else {
                                setActiveRequestBook(book);
                              }
                            }}
                            className="py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                          >
                            {!currentUser ? (
                              <>
                                <Lock className="w-3.5 h-3.5 text-amber-400" />
                                <span>Get Full PDF</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-3.5 h-3.5 text-amber-400" />
                                <span>Request PDF</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* How Verified Download Works Banner */}
        <div className="mt-14 p-6 sm:p-8 bg-[#FAF8F5] rounded-2xl border border-amber-200/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="flex gap-3.5">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-stone-900 font-bold flex items-center justify-center shrink-0 text-sm">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Sign in & Read Preview</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Sign in with your Google account. Enjoy free preview chapters of any book right in your browser.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-stone-900 font-bold flex items-center justify-center shrink-0 text-sm">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Send bKash & Submit Reference</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Send the payment to author's official bKash number and submit your transaction ID / reference number.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-stone-900 font-bold flex items-center justify-center shrink-0 text-sm">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Author Approves & Download</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Jayed directly verifies your bKash reference. Once approved, download the full PDF and leave your verified review.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
