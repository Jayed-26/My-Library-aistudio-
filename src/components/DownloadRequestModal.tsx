import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Send, Copy, Check, AlertCircle, RotateCcw, ShieldCheck } from 'lucide-react';

export const DownloadRequestModal: React.FC = () => {
  const {
    activeRequestBook,
    setActiveRequestBook,
    currentUser,
    contact,
    submitDownloadRequest,
    getUserRequestForBook
  } = useApp();

  const [copiedBkash, setCopiedBkash] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState('');
  const [bkashNumber, setBkashNumber] = useState('');
  const [description, setDescription] = useState('');

  const existingRequest = activeRequestBook ? getUserRequestForBook(activeRequestBook.id) : undefined;

  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.name);
    }
    if (existingRequest) {
      setBkashNumber(existingRequest.bkashNumber || '');
      setDescription(existingRequest.description || '');
    } else {
      setBkashNumber('');
      setDescription('');
    }
  }, [activeRequestBook, currentUser]);

  // Early return ONLY after all hooks have been declared!
  if (!activeRequestBook || !currentUser) return null;

  const handleCopyBkash = () => {
    navigator.clipboard.writeText(contact.phone.replace(/[^0-9]/g, ''));
    setCopiedBkash(true);
    setTimeout(() => setCopiedBkash(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bkashNumber.trim() || !description.trim()) {
      alert('Please provide your bKash reference number/TrxID and description.');
      return;
    }

    setIsSubmitting(true);
    const success = await submitDownloadRequest(activeRequestBook.id, bkashNumber, description);
    setIsSubmitting(false);

    if (success) {
      setActiveRequestBook(null);
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
              {existingRequest?.status === 'rejected' ? 'Re-Submit Download Request' : 'Request Full E-Book Download'}
            </h3>
          </div>
          <button
            onClick={() => setActiveRequestBook(null)}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          
          {/* Book Summary Card */}
          <div className="flex items-center gap-3.5 p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 mb-5">
            <img
              src={activeRequestBook.coverUrl}
              alt={activeRequestBook.title}
              className="w-12 h-16 object-cover rounded shadow-xs"
            />
            <div className="flex-1 truncate">
              <h4 className="font-display font-bold text-sm text-stone-900 truncate">
                {activeRequestBook.title}
              </h4>
              <p className="text-xs text-amber-800 font-semibold mt-0.5">
                Amount to pay: ৳{activeRequestBook.price} BDT
              </p>
              <p className="text-[10px] text-stone-500">Full PDF edition with all chapters</p>
            </div>
          </div>

          {/* Previous Rejection Alert (if requesting again) */}
          {existingRequest?.status === 'rejected' && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900">
              <p className="font-bold flex items-center gap-1.5 text-red-800 mb-1">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                Previous Request Note from Jayed:
              </p>
              <p className="text-[11px] text-red-700">
                "{existingRequest.rejectionReason || 'Reference could not be verified.'}"
              </p>
              <p className="text-[10px] text-red-600 mt-2 font-medium">
                Please double check your bKash transaction ID / number below and re-submit.
              </p>
            </div>
          )}

          {/* bKash Payment Instructions Box */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 mb-6 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-stone-800 flex items-center gap-1.5">
                <span className="text-pink-600 font-black">bKash</span> Official Number:
              </span>
              <button
                type="button"
                onClick={handleCopyBkash}
                className="px-2 py-1 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-colors"
              >
                {copiedBkash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedBkash ? 'Copied!' : 'Copy Number'}</span>
              </button>
            </div>
            
            <p className="font-mono text-stone-900 font-bold text-sm bg-white p-2 rounded border border-stone-200 tracking-wider">
              {contact.phone}
            </p>

            <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
              Step 1: Send ৳{activeRequestBook.price} to the bKash number above.<br />
              Step 2: Enter your paid bKash number & Transaction ID (TrxID) below.<br />
              Step 3: Jayed will verify and approve your download access.
            </p>
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* User Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* User Email (from Google login) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Google Account Email
              </label>
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-200 text-stone-500 rounded-lg cursor-not-allowed"
              />
              <p className="text-[10px] text-stone-400 mt-0.5">Approved access will be linked to this account.</p>
            </div>

            {/* Reference: bKash Number / TrxID (Requested explicitly by user!) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Reference: bKash Number & TrxID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
                required
                placeholder="e.g. 01712-345678 (TrxID: 9M8K2LQ4)"
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-900 font-medium"
              />
              <p className="text-[10px] text-stone-500 mt-0.5">
                The bKash phone number you paid from and the TrxID.
              </p>
            </div>

            {/* Description (Requested explicitly by user!) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Description / Payment Note <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={2}
                placeholder="e.g. Sent ৳250 via bKash personal around 3:15 PM from Tanvir."
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none text-stone-800"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                {existingRequest?.status === 'rejected' ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isSubmitting ? 'Submitting...' : 'Re-Submit Download Request'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Verification Request'}</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
