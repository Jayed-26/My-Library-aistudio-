import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  User,
  Phone,
  Mail,
  MessageSquare,
  Plus,
  Trash2,
  Edit,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Send,
  Star
} from 'lucide-react';
import { Ebook } from '../types.ts';

export const AdminDashboardModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setAdminModalOpen,
    isAdmin,
    toggleAdminMode,
    profile,
    updateProfile,
    books,
    addBook,
    updateBook,
    deleteBook,
    requests,
    approveRequest,
    rejectRequest,
    reviews,
    approveReview,
    rejectReview,
    deleteReview,
    contact,
    updateContact,
    messages,
    replyToMessage
  } = useApp();

  const [activeTab, setActiveTab] = useState<'requests' | 'reviews' | 'books' | 'profile' | 'contact' | 'messages'>('requests');
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Profile edit form state
  const [profileForm, setProfileForm] = useState({ ...profile });

  // Contact edit form state
  const [contactForm, setContactForm] = useState({
    email: contact.email,
    phone: contact.phone,
    bkashInstructions: contact.bkashInstructions,
    location: contact.location,
    socialLinks: { ...contact.socialLinks }
  });

  useEffect(() => {
    setProfileForm({ ...profile });
  }, [profile]);

  useEffect(() => {
    setContactForm({
      email: contact.email,
      phone: contact.phone,
      bkashInstructions: contact.bkashInstructions,
      location: contact.location,
      socialLinks: { ...contact.socialLinks }
    });
  }, [contact]);

  // Rejection modal state for requests
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('bKash TrxID did not match or payment not received. Please verify and submit again.');

  // Message reply state
  const [replyingMessageId, setReplyingMessageId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // New book form state
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [bookForm, setBookForm] = useState({
    title: '',
    subtitle: '',
    category: 'Productivity' as Ebook['category'],
    price: 250,
    pages: 180,
    description: '',
    coverUrl: '/src/assets/images/cover_productivity_mastery_1793435132456.jpg',
    featured: false,
    chapter1Title: 'The Core Principle',
    chapter1Content: 'In this chapter, we explore how intentional focus compounds into exponential output over time.',
    chapter2Title: 'Actionable Frameworks',
    chapter2Content: 'Step-by-step rituals to systematically eliminate digital distraction and cultivate daily creative flow.'
  });

  if (!isAdminModalOpen) return null;

  // Security gate: if not yet authenticated as admin, prompt for passcode or author login
  if (!isAdmin) {
    const handlePinSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Default owner passcode
      if (adminPin === 'jayed2026' || adminPin === 'admin' || adminPin === '1234') {
        toggleAdminMode(true);
        setPinError(false);
      } else {
        setPinError(true);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-xs">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-amber-300">
          <button
            onClick={() => setAdminModalOpen(false)}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-extrabold text-xl text-stone-900">
              Author Admin Access
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Enter your author passcode or log in with <strong className="text-stone-900">jayedmahmud18@gmail.com</strong>
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Passcode (Default: <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded">jayed2026</code>)
              </label>
              <input
                type="password"
                value={adminPin}
                onChange={(e) => { setAdminPin(e.target.value); setPinError(false); }}
                placeholder="Enter passcode"
                className="w-full px-3 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              {pinError && (
                <p className="text-[11px] text-red-600 font-medium mt-1">
                  Incorrect passcode. Use default: jayed2026
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Unlock Author Panel</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const unreadMessages = messages.filter(m => m.status === 'unread');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(profileForm);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateContact(contactForm);
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const bookPayload = {
      title: bookForm.title,
      subtitle: bookForm.subtitle,
      category: bookForm.category,
      price: Number(bookForm.price),
      pages: Number(bookForm.pages),
      description: bookForm.description,
      coverUrl: bookForm.coverUrl,
      featured: bookForm.featured,
      previewContent: {
        chapters: [
          { number: 'Chapter 1', title: bookForm.chapter1Title, content: bookForm.chapter1Content },
          { number: 'Chapter 2', title: bookForm.chapter2Title, content: bookForm.chapter2Content }
        ]
      },
      fullContent: {
        chapters: [
          { number: 'Chapter 1', title: bookForm.chapter1Title, content: bookForm.chapter1Content },
          { number: 'Chapter 2', title: bookForm.chapter2Title, content: bookForm.chapter2Content },
          { number: 'Chapter 3', title: 'Tactical Execution', content: 'Advanced methods to scale results and build compounding momentum.' },
          { number: 'Chapter 4', title: 'Long-term Sustainability', content: 'Habits to prevent burnout and ensure enduring creative longevity.' }
        ]
      }
    };

    if (editingBookId) {
      await updateBook(editingBookId, bookPayload);
      setEditingBookId(null);
    } else {
      await addBook(bookPayload);
    }

    setShowAddBookForm(false);
  };

  const startEditBook = (book: Ebook) => {
    setEditingBookId(book.id);
    setBookForm({
      title: book.title,
      subtitle: book.subtitle,
      category: book.category,
      price: book.price,
      pages: book.pages,
      description: book.description,
      coverUrl: book.coverUrl,
      featured: book.featured,
      chapter1Title: book.previewContent.chapters[0]?.title || 'Chapter 1',
      chapter1Content: book.previewContent.chapters[0]?.content || '',
      chapter2Title: book.previewContent.chapters[1]?.title || 'Chapter 2',
      chapter2Content: book.previewContent.chapters[1]?.content || ''
    });
    setShowAddBookForm(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[94vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-amber-300">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-sm">
              JM
            </div>
            <div>
              <h2 className="font-display font-extrabold text-base text-amber-300 flex items-center gap-2">
                <span>Author Dashboard & Control Center</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-sans">
                  Owner Active
                </span>
              </h2>
              <p className="text-[11px] text-stone-400">
                Logged in as Jayed Mahmud (Full Authority)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleAdminMode(false)}
              className="text-xs text-stone-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-stone-700 hover:bg-stone-800 transition-colors"
            >
              Exit Admin Mode
            </button>
            <button
              onClick={() => setAdminModalOpen(false)}
              className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-1 px-6 py-2 bg-[#FAF8F5] border-b border-stone-200 overflow-x-auto scrollbar-none">
          
          {/* Download Requests Tab (bKash Approval) */}
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'requests'
                ? 'bg-amber-400 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            <span>bKash Requests</span>
            {pendingRequests.length > 0 && (
              <span className="px-1.5 py-0.2 bg-red-600 text-white text-[10px] font-bold rounded-full">
                {pendingRequests.length}
              </span>
            )}
          </button>

          {/* Review Moderation Tab */}
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-amber-400 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            <span>Review Moderation</span>
            {pendingReviews.length > 0 && (
              <span className="px-1.5 py-0.2 bg-red-600 text-white text-[10px] font-bold rounded-full">
                {pendingReviews.length}
              </span>
            )}
          </button>

          {/* Manage E-Books */}
          <button
            onClick={() => setActiveTab('books')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'books'
                ? 'bg-amber-400 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            <span>E-Books ({books.length})</span>
          </button>

          {/* Edit Profile & Bio */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-amber-400 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            <span>Hero & Bio</span>
          </button>

          {/* Contact & Payment Info */}
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'contact'
                ? 'bg-amber-400 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            <span>Contact & Socials</span>
          </button>

          {/* Messages Inbox */}
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'messages'
                ? 'bg-amber-400 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            <span>Messages Inbox</span>
            {unreadMessages.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-600 text-white text-[10px] font-bold rounded-full">
                {unreadMessages.length}
              </span>
            )}
          </button>

        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          
          {/* TAB 1: bKash Download Requests */}
          {activeTab === 'requests' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-stone-900">
                    E-Book Download Requests & bKash Approvals
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Verify the visitor's bKash number/TrxID. Approving unlocks the complete e-book for them immediately.
                  </p>
                </div>
                <span className="text-xs font-semibold text-stone-500">
                  Total Requests: {requests.length}
                </span>
              </div>

              {requests.length === 0 ? (
                <div className="text-center py-12 bg-stone-50 rounded-xl border border-stone-200">
                  <p className="text-xs text-stone-500">No download requests submitted yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <div
                      key={req.id}
                      className={`p-4 rounded-xl border transition-all ${
                        req.status === 'pending'
                          ? 'border-amber-400 bg-amber-50/40 shadow-xs'
                          : req.status === 'approved'
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : 'border-red-200 bg-red-50/20'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-stone-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={req.bookCoverUrl}
                            alt={req.bookTitle}
                            className="w-10 h-14 object-cover rounded shadow-2xs"
                          />
                          <div>
                            <span className="font-bold text-sm text-stone-900">{req.bookTitle}</span>
                            <div className="text-xs text-stone-600 mt-0.5 flex flex-wrap items-center gap-2">
                              <span><strong>User:</strong> {req.userName}</span>
                              <span aria-hidden="true">·</span>
                              <span><strong>Email:</strong> {req.userEmail}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div className="self-start sm:self-auto">
                          {req.status === 'pending' && (
                            <span className="px-2.5 py-1 bg-amber-200 text-amber-950 font-bold text-xs rounded-md flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-700" />
                              <span>Pending Verification</span>
                            </span>
                          )}
                          {req.status === 'approved' && (
                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-md flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Approved</span>
                            </span>
                          )}
                          {req.status === 'rejected' && (
                            <span className="px-2.5 py-1 bg-red-100 text-red-800 font-bold text-xs rounded-md flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5 text-red-600" />
                              <span>Rejected</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Request Details: bKash Reference & Description */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-stone-200/80 text-xs mb-3">
                        <div>
                          <span className="font-bold text-stone-500 uppercase text-[10px]">Reference / bKash Paid:</span>
                          <p className="font-mono font-bold text-stone-900 mt-0.5 text-sm">{req.bkashNumber}</p>
                        </div>
                        <div>
                          <span className="font-bold text-stone-500 uppercase text-[10px]">User Note / Description:</span>
                          <p className="text-stone-800 mt-0.5">{req.description}</p>
                        </div>
                      </div>

                      {req.rejectionReason && (
                        <p className="text-xs text-red-700 bg-red-50 p-2 rounded mb-3">
                          <strong>Rejection reason sent to user:</strong> {req.rejectionReason}
                        </p>
                      )}

                      {/* Actions: Approve / Reject */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-stone-400">
                          Requested on {new Date(req.createdAt).toLocaleString()}
                        </span>

                        <div className="flex items-center gap-2">
                          {req.status !== 'approved' && (
                            <button
                              onClick={() => approveRequest(req.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve Download</span>
                            </button>
                          )}

                          {req.status !== 'rejected' && (
                            <button
                              onClick={() => setRejectingRequestId(req.id)}
                              className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-lg border border-red-200 transition-colors flex items-center gap-1.5"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject Request</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Rejection Modal/Inline Input */}
                      {rejectingRequestId === req.id && (
                        <div className="mt-4 p-3 bg-stone-100 rounded-lg border border-stone-300">
                          <label className="block text-xs font-semibold text-stone-800 mb-1">
                            Reason for rejection (User will see this and can click "Request Again"):
                          </label>
                          <input
                            type="text"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg mb-2"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setRejectingRequestId(null)}
                              className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-200 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                rejectRequest(req.id, rejectReason);
                                setRejectingRequestId(null);
                              }}
                              className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded"
                            >
                              Confirm Rejection
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Review Moderation */}
          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-stone-900">
                    Reader Review Moderation
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Per your website rules, reviews are only visible to the public after you approve them.
                  </p>
                </div>
                <span className="text-xs font-semibold text-stone-500">
                  Total Reviews: {reviews.length}
                </span>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-stone-50 rounded-xl border border-stone-200">
                  <p className="text-xs text-stone-500">No reader reviews submitted yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className={`p-4 rounded-xl border transition-all ${
                        rev.status === 'pending'
                          ? 'border-amber-400 bg-amber-50/40'
                          : rev.status === 'approved'
                          ? 'border-emerald-200 bg-white'
                          : 'border-stone-200 bg-stone-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-stone-900">{rev.userName}</span>
                            <span className="text-[11px] text-stone-400">({rev.userEmail})</span>
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.2 rounded">
                              {rev.bookTitle}
                            </span>
                          </div>

                          <div className="flex items-center text-amber-400 gap-0.5 my-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                                }`}
                              />
                            ))}
                            <span className="text-xs font-bold text-stone-700 ml-1.5">
                              {rev.rating} / 5
                            </span>
                          </div>
                        </div>

                        {/* Status */}
                        <div>
                          {rev.status === 'pending' ? (
                            <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-1 rounded-md">
                              Pending Your Approval
                            </span>
                          ) : rev.status === 'approved' ? (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md">
                              Published Live
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold bg-stone-200 text-stone-700 px-2 py-1 rounded-md">
                              Declined
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-800 bg-white p-3 rounded-lg border border-stone-200 my-2 italic">
                        "{rev.comment}"
                      </p>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[10px] text-stone-400">
                          Submitted on {new Date(rev.createdAt).toLocaleDateString()}
                        </span>

                        <div className="flex items-center gap-2">
                          {rev.status !== 'approved' && (
                            <button
                              onClick={() => approveReview(rev.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve & Publish</span>
                            </button>
                          )}

                          {rev.status !== 'rejected' && (
                            <button
                              onClick={() => rejectReview(rev.id)}
                              className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs rounded-lg transition-colors"
                            >
                              Decline
                            </button>
                          )}

                          <button
                            onClick={() => deleteReview(rev.id)}
                            className="p-1 text-stone-400 hover:text-red-600 rounded"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: E-Books Collection Management */}
          {activeTab === 'books' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-stone-900">
                    Manage E-Books
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Add new books, edit pricing, upload covers, and configure preview/full PDF content.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingBookId(null);
                    setBookForm({
                      title: '',
                      subtitle: '',
                      category: 'Productivity',
                      price: 250,
                      pages: 180,
                      description: '',
                      coverUrl: '/src/assets/images/cover_productivity_mastery_1793435132456.jpg',
                      featured: false,
                      chapter1Title: 'Chapter 1: The Core Principle',
                      chapter1Content: 'Preview text for chapter 1 goes here...',
                      chapter2Title: 'Chapter 2: Tactical Execution',
                      chapter2Content: 'Preview text for chapter 2 goes here...'
                    });
                    setShowAddBookForm(true);
                  }}
                  className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New E-Book</span>
                </button>
              </div>

              {/* Add / Edit Book Form */}
              {showAddBookForm && (
                <div className="mb-8 p-6 bg-stone-50 rounded-2xl border border-amber-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-sm text-stone-900">
                      {editingBookId ? 'Edit E-Book Details' : 'Publish a New E-Book'}
                    </h4>
                    <button
                      onClick={() => setShowAddBookForm(false)}
                      className="text-xs text-stone-500 hover:text-stone-800"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSaveBook} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Book Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={bookForm.title}
                          onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={bookForm.subtitle}
                          onChange={(e) => setBookForm({ ...bookForm, subtitle: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Category
                        </label>
                        <select
                          value={bookForm.category}
                          onChange={(e) => setBookForm({ ...bookForm, category: e.target.value as any })}
                          className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                        >
                          <option value="Productivity">Productivity</option>
                          <option value="Creator Business">Creator Business</option>
                          <option value="Mindset">Mindset</option>
                          <option value="Technology">Technology</option>
                          <option value="General">General</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Price in BDT (৳) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          value={bookForm.price}
                          onChange={(e) => setBookForm({ ...bookForm, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Page Count
                        </label>
                        <input
                          type="number"
                          value={bookForm.pages}
                          onChange={(e) => setBookForm({ ...bookForm, pages: Number(e.target.value) })}
                          className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Cover Photo URL or Preset
                      </label>
                      <input
                        type="text"
                        value={bookForm.coverUrl}
                        onChange={(e) => setBookForm({ ...bookForm, coverUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg mb-2"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setBookForm({ ...bookForm, coverUrl: '/src/assets/images/cover_productivity_mastery_1793435132456.jpg' })}
                          className="text-[10px] bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded font-medium"
                        >
                          Use Productivity Cover
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookForm({ ...bookForm, coverUrl: '/src/assets/images/cover_digital_creator_playbook_1793435132635.jpg' })}
                          className="text-[10px] bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded font-medium"
                        >
                          Use Creator Cover
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookForm({ ...bookForm, coverUrl: '/src/assets/images/cover_mindset_money_guide_1793435132366.jpg' })}
                          className="text-[10px] bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded font-medium"
                        >
                          Use Wealth Cover
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Description / Synopsis
                      </label>
                      <textarea
                        rows={3}
                        value={bookForm.description}
                        onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                      />
                    </div>

                    {/* Preview Chapter Sample */}
                    <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-2">
                      <p className="text-xs font-bold text-stone-900">Free Preview Chapter 1 Content</p>
                      <input
                        type="text"
                        placeholder="Chapter Title"
                        value={bookForm.chapter1Title}
                        onChange={(e) => setBookForm({ ...bookForm, chapter1Title: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-md"
                      />
                      <textarea
                        rows={3}
                        placeholder="Chapter 1 content for free preview..."
                        value={bookForm.chapter1Content}
                        onChange={(e) => setBookForm({ ...bookForm, chapter1Content: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-md"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddBookForm(false)}
                        className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-200 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-lg shadow-xs"
                      >
                        {editingBookId ? 'Save Changes' : 'Publish Book'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Existing Books List */}
              <div className="space-y-3">
                {books.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={b.coverUrl}
                        alt={b.title}
                        className="w-10 h-14 object-cover rounded shadow-2xs"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{b.title}</h4>
                        <p className="text-xs text-stone-500">
                          {b.category} · ৳{b.price} · {b.pages} pages
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditBook(b)}
                        className="p-2 text-stone-600 hover:text-amber-700 hover:bg-stone-200 rounded-lg transition-colors"
                        title="Edit Book"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${b.title}"?`)) {
                            deleteBook(b.id);
                          }
                        }}
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Book"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: Profile & Hero Section Editor */}
          {activeTab === 'profile' && (
            <div>
              <div className="mb-6">
                <h3 className="font-display font-bold text-lg text-stone-900">
                  Hero Section & Author Profile
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Update your name, bio, role, community numbers, and portrait image.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Author Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Hero Greeting
                    </label>
                    <input
                      type="text"
                      value={profileForm.greeting}
                      onChange={(e) => setProfileForm({ ...profileForm, greeting: e.target.value })}
                      placeholder="e.g. Hey Friends"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Role / Subtitle
                  </label>
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Bio (Displayed directly below name) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Author Portrait Photo URL
                  </label>
                  <input
                    type="text"
                    value={profileForm.photoUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, photoUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg mb-2"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setProfileForm({ ...profileForm, photoUrl: '/src/assets/images/author_portrait_jayed_1793435132149.jpg' })}
                      className="text-[10px] bg-amber-100 hover:bg-amber-200 text-stone-900 px-2 py-1 rounded font-medium"
                    >
                      Use Studio Portrait Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileForm({ ...profileForm, photoUrl: '/public/assets/aistudio/image_3eb4b58c.png' })}
                      className="text-[10px] bg-amber-100 hover:bg-amber-200 text-stone-900 px-2 py-1 rounded font-medium"
                    >
                      Use Uploaded Reference Image
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Subscribers / Community Count
                    </label>
                    <input
                      type="text"
                      value={profileForm.subscribersCount}
                      onChange={(e) => setProfileForm({ ...profileForm, subscribersCount: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Readers Count
                    </label>
                    <input
                      type="text"
                      value={profileForm.readersCount}
                      onChange={(e) => setProfileForm({ ...profileForm, readersCount: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-400" />
                    <span>Save Hero & Profile Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: Contact & Payment Info */}
          {activeTab === 'contact' && (
            <div>
              <div className="mb-6">
                <h3 className="font-display font-bold text-lg text-stone-900">
                  Contact Information & Payment Settings
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Update your email, bKash payment instructions, phone, and social media handles.
                </p>
              </div>

              <form onSubmit={handleSaveContact} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Author Official Email
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone / bKash Number
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    bKash Payment Instructions (Shown to users in request modal)
                  </label>
                  <textarea
                    rows={2}
                    value={contactForm.bkashInstructions}
                    onChange={(e) => setContactForm({ ...contactForm, bkashInstructions: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg leading-relaxed"
                  />
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <p className="text-xs font-bold text-stone-900">Social Media Links</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="block text-stone-500 mb-1">YouTube Channel URL</span>
                      <input
                        type="text"
                        value={contactForm.socialLinks.youtube}
                        onChange={(e) => setContactForm({ ...contactForm, socialLinks: { ...contactForm.socialLinks, youtube: e.target.value } })}
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded"
                      />
                    </div>

                    <div>
                      <span className="block text-stone-500 mb-1">Twitter / X URL</span>
                      <input
                        type="text"
                        value={contactForm.socialLinks.twitter}
                        onChange={(e) => setContactForm({ ...contactForm, socialLinks: { ...contactForm.socialLinks, twitter: e.target.value } })}
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded"
                      />
                    </div>

                    <div>
                      <span className="block text-stone-500 mb-1">LinkedIn URL</span>
                      <input
                        type="text"
                        value={contactForm.socialLinks.linkedin}
                        onChange={(e) => setContactForm({ ...contactForm, socialLinks: { ...contactForm.socialLinks, linkedin: e.target.value } })}
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded"
                      />
                    </div>

                    <div>
                      <span className="block text-stone-500 mb-1">Facebook URL</span>
                      <input
                        type="text"
                        value={contactForm.socialLinks.facebook}
                        onChange={(e) => setContactForm({ ...contactForm, socialLinks: { ...contactForm.socialLinks, facebook: e.target.value } })}
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-400" />
                    <span>Save Contact & Payment Info</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: Quick Messages Inbox */}
          {activeTab === 'messages' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-stone-900">
                    Visitor Quick Messages & Inquiries
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Messages submitted from the website. You can reply directly here, and the user will see your reply.
                  </p>
                </div>
                <span className="text-xs font-semibold text-stone-500">
                  Total: {messages.length}
                </span>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-12 bg-stone-50 rounded-xl border border-stone-200">
                  <p className="text-xs text-stone-500">No messages received yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-4 rounded-xl border transition-all ${
                        m.status === 'unread'
                          ? 'border-amber-400 bg-amber-50/40'
                          : 'border-stone-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-stone-900">{m.name}</span>
                          <span className="text-xs text-stone-500">({m.email})</span>
                        </div>
                        <span className="text-[10px] text-stone-400">
                          {new Date(m.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-800 bg-white p-3 rounded-lg border border-stone-200 my-2">
                        {m.message}
                      </p>

                      {/* Display existing reply */}
                      {m.reply && (
                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                          <p className="font-bold text-emerald-900 text-[11px] mb-1 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Your Reply (Sent {new Date(m.replyAt || '').toLocaleDateString()}):</span>
                          </p>
                          <p className="text-emerald-950">{m.reply}</p>
                        </div>
                      )}

                      {/* Reply Form */}
                      <div className="mt-3 pt-2 flex items-center gap-2">
                        {replyingMessageId === m.id ? (
                          <div className="w-full flex flex-col gap-2">
                            <textarea
                              rows={2}
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Write your response to the visitor..."
                              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setReplyingMessageId(null)}
                                className="px-3 py-1 text-xs text-stone-600 hover:bg-stone-200 rounded"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={async () => {
                                  if (!replyContent.trim()) return;
                                  await replyToMessage(m.id, replyContent);
                                  setReplyingMessageId(null);
                                  setReplyContent('');
                                }}
                                className="px-4 py-1.5 bg-stone-900 text-amber-300 text-xs font-bold rounded-lg flex items-center gap-1"
                              >
                                <Send className="w-3 h-3 text-amber-400" />
                                <span>Send Reply</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setReplyingMessageId(m.id);
                              setReplyContent(m.reply || '');
                            }}
                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                            <span>{m.reply ? 'Edit Reply' : 'Reply to Message'}</span>
                          </button>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
