import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Star, Send, ShieldCheck, AlertCircle } from 'lucide-react';

export const ReviewSubmitModal: React.FC = () => {
  const {
    activeReviewModalBook,
    setActiveReviewModalBook,
    books,
    requests,
    currentUser,
    submitReview
  } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedBookId, setSelectedBookId] = useState<string>('');

  useEffect(() => {
    if (activeReviewModalBook) {
      setSelectedBookId(activeReviewModalBook.id);
    }
  }, [activeReviewModalBook]);

  // Early return strictly after all hooks have been called
  if (!activeReviewModalBook || !currentUser) return null;

  // Find all books for which the user has approved access
  const approvedBooks = books.filter(b => {
    return requests.some(r => r.bookId === b.id && r.userEmail === currentUser.email && r.status === 'approved');
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Please write your review thoughts.');
      return;
    }

    setIsSubmitting(true);
    const success = await submitReview(selectedBookId || activeReviewModalBook.id, rating, comment);
    setIsSubmitting(false);

    if (success) {
      setActiveReviewModalBook(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF8F5] border-b border-stone-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h3 className="font-display font-bold text-base text-stone-900">
              Submit Verified Reader Review
            </h3>
          </div>
          <button
            onClick={() => setActiveReviewModalBook(null)}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Verified Reader Notice */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Logged in as <strong className="text-emerald-950">{currentUser.name}</strong>. Your verified download was approved by Jayed.
            </span>
          </div>

          {/* Book Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Select Book to Review
            </label>
            <select
              value={selectedBookId || activeReviewModalBook.id}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium text-stone-900"
            >
              {approvedBooks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} (৳{b.price})
                </option>
              ))}
            </select>
          </div>

          {/* Rating Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Your Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-stone-700 ml-2">
                {rating} out of 5 stars
              </span>
            </div>
          </div>

          {/* Review Text Area (Strictly text-only, no images allowed) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Review Text <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-amber-800 font-medium">
                (Text only · No images allowed)
              </span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              placeholder="Share your honest thoughts about the chapters, frameworks, or insights in this book..."
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none text-stone-800 leading-relaxed"
            />
          </div>

          {/* Moderation policy reminder */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              To maintain high quality, all reader reviews are moderated by author Jayed Mahmud before appearing on the public website.
            </span>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Review for Author Approval'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
