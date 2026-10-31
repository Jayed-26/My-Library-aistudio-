import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Star,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  AlertCircle,
  Plus
} from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const {
    reviews,
    books,
    requests,
    currentUser,
    isAdmin,
    setActiveReviewModalBook,
    setAuthModalOpen,
    approveReview,
    rejectReview,
    deleteReview,
    showToast
  } = useApp();

  const [selectedBookFilter, setSelectedBookFilter] = useState<string>('all');

  // Filter approved reviews for public view, plus show pending to admin
  const approvedReviews = reviews.filter(r => r.status === 'approved');
  const pendingReviews = reviews.filter(r => r.status === 'pending');

  const displayedReviews = (isAdmin ? reviews : approvedReviews).filter(r => {
    if (selectedBookFilter === 'all') return true;
    return r.bookId === selectedBookFilter;
  });

  // Calculate average rating
  const averageRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((acc, curr) => acc + curr.rating, 0) / approvedReviews.length).toFixed(1)
    : '5.0';

  // Check if current user has any approved books to review
  const approvedUserRequests = currentUser
    ? requests.filter(r => r.userEmail === currentUser.email && r.status === 'approved')
    : [];

  const handleOpenReviewModal = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    if (approvedUserRequests.length === 0) {
      showToast("Only verified readers who had their bKash download request approved by Jayed can leave a review!");
      return;
    }

    // Default to the first approved book
    const firstApprovedBook = books.find(b => b.id === approvedUserRequests[0].bookId);
    if (firstApprovedBook) {
      setActiveReviewModalBook(firstApprovedBook);
    }
  };

  return (
    <section id="reviews" className="py-16 md:py-24 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Verified Reader Feedback
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-stone-900 tracking-tight">
              Book Reviews & Ratings
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Authentic reviews from verified readers who received official access to the complete e-books. All submissions are moderated before publishing.
            </p>
          </div>

          {/* Action to Write Review */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={handleOpenReviewModal}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Reader Review</span>
            </button>
          </div>
        </div>

        {/* Rating Overview & Verification Notice Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-10 p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          
          <div className="md:col-span-4 flex items-center gap-4 sm:border-r border-stone-200 sm:pr-6">
            <div className="text-4xl sm:text-5xl font-display font-black text-stone-900 tabular-nums">
              {averageRating}
            </div>
            <div>
              <div className="flex items-center text-amber-400 gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-stone-500 mt-1 font-medium">
                Based on {approvedReviews.length} verified reader ratings
              </p>
            </div>
          </div>

          <div className="md:col-span-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-xs text-stone-600 leading-relaxed">
              <span className="font-semibold text-stone-900">100% Verified Readers Only: </span>
              In accordance with our review policy, reviews can only be submitted by readers whose full PDF download requests were approved by Jayed. Reviews are strictly text-only and subject to author moderation.
            </div>
          </div>

        </div>

        {/* Book Filter Chips */}
        {books.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
            <span className="text-xs font-semibold text-stone-500 mr-1">Filter by:</span>
            <button
              onClick={() => setSelectedBookFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedBookFilter === 'all'
                  ? 'bg-stone-900 text-amber-300'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              All Books ({approvedReviews.length})
            </button>
            {books.map((b) => {
              const bookReviewsCount = approvedReviews.filter(r => r.bookId === b.id).length;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBookFilter(b.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    selectedBookFilter === b.id
                      ? 'bg-stone-900 text-amber-300'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {b.title} ({bookReviewsCount})
                </button>
              );
            })}
          </div>
        )}

        {/* Reviews List */}
        {displayedReviews.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-stone-200">
            <MessageSquare className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-stone-800">No published reviews yet</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              If you have an approved full e-book download, be the first verified reader to submit your review!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedReviews.map((rev) => (
              <div
                key={rev.id}
                className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                  rev.status === 'pending'
                    ? 'border-amber-400 bg-amber-50/30 ring-1 ring-amber-300'
                    : 'border-stone-200 shadow-2xs hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Top Bar: Book Tag & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded truncate max-w-[170px]">
                      {rev.bookTitle}
                    </span>

                    {rev.status === 'pending' && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700" />
                        Pending Approval
                      </span>
                    )}

                    {rev.status === 'approved' && (
                      <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Verified Reader
                      </span>
                    )}
                  </div>

                  {/* Stars Rating */}
                  <div className="flex items-center text-amber-400 gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Text only comment (No images allowed per user brief) */}
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal italic">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Reviewer Details */}
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-200 text-stone-900 font-bold text-xs flex items-center justify-center">
                      {rev.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900 leading-tight">
                        {rev.userName}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {new Date(rev.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Admin Moderation Controls */}
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      {rev.status === 'pending' && (
                        <button
                          onClick={() => approveReview(rev.id)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => deleteReview(rev.id)}
                        className="px-2 py-1 bg-stone-100 hover:bg-red-50 text-stone-500 hover:text-red-600 text-[10px] font-medium rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
