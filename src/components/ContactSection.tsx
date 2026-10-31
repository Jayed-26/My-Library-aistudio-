import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Edit2,
  CheckCircle,
  Clock,
  Youtube,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Github
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const {
    contact,
    messages,
    currentUser,
    isAdmin,
    setAdminModalOpen,
    sendQuickMessage,
    showToast
  } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  // Filter messages sent by the current user to display their conversation status
  const userMessages = currentUser
    ? messages.filter(m => m.email.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    const success = await sendQuickMessage(name, email, message);
    setIsSubmitting(false);

    if (success) {
      setMessage('');
      setSubmittedSuccess(true);
      setTimeout(() => setSubmittedSuccess(false), 6000);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-white border-t border-stone-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Get in Touch
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-stone-900 tracking-tight">
              Contact the Author
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Have questions about the books, bKash payments, or speaking opportunities? Send Jayed a quick message directly from the website.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setAdminModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors self-start md:self-end"
            >
              <Edit2 className="w-3.5 h-3.5 text-stone-600" />
              <span>Edit Contact & Payment Info</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Author Contact Info & Social Links */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold font-display text-stone-900 mb-4">
                Direct Channels
              </h3>

              <div className="space-y-4 mb-8">
                {/* Email */}
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200 hover:border-amber-400 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Official Email</p>
                    <p className="text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors truncate">
                      {contact.email}
                    </p>
                  </div>
                </a>

                {/* Phone / bKash */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Phone / bKash Number</p>
                    <p className="text-sm font-bold text-stone-900 tabular-nums">
                      {contact.phone}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Base Location</p>
                    <p className="text-sm font-bold text-stone-900">
                      {contact.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* bKash Payment Instructions Guide */}
              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 mb-8">
                <p className="text-xs font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  bKash Payment Notice
                </p>
                <p className="text-xs text-amber-900 leading-relaxed">
                  {contact.bkashInstructions}
                </p>
              </div>

              {/* Social Channels */}
              <div>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                  Follow & Connect
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {contact.socialLinks.youtube && (
                    <a
                      href={contact.socialLinks.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 rounded-xl transition-colors border border-stone-200"
                      title="YouTube"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                  {contact.socialLinks.twitter && (
                    <a
                      href={contact.socialLinks.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 rounded-xl transition-colors border border-stone-200"
                      title="Twitter / X"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {contact.socialLinks.linkedin && (
                    <a
                      href={contact.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 rounded-xl transition-colors border border-stone-200"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {contact.socialLinks.facebook && (
                    <a
                      href={contact.socialLinks.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 rounded-xl transition-colors border border-stone-200"
                      title="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {contact.socialLinks.instagram && (
                    <a
                      href={contact.socialLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 rounded-xl transition-colors border border-stone-200"
                      title="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {contact.socialLinks.github && (
                    <a
                      href={contact.socialLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 rounded-xl transition-colors border border-stone-200"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Quick Message Form & User Thread */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-6 sm:p-8 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <h3 className="text-lg font-bold font-display text-stone-900">
                Quick Message
              </h3>
            </div>
            <p className="text-xs text-stone-600 mb-6">
              Write a message to Jayed Mahmud. It goes straight to his author dashboard.
            </p>

            {submittedSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-emerald-900">Message Delivered!</p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Thank you! Jayed has received your note in his dashboard and will reply soon.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@gmail.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="Salam Jayed! I wanted to ask about..."
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>{isSubmitting ? 'Sending...' : 'Send Message to Jayed'}</span>
              </button>
            </form>

            {/* If current user has sent messages, show their history and replies */}
            {userMessages.length > 0 && (
              <div className="mt-8 pt-6 border-t border-stone-200">
                <p className="text-xs font-bold text-stone-800 mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>Your Sent Messages & Replies ({userMessages.length})</span>
                </p>
                <div className="space-y-3">
                  {userMessages.map((m) => (
                    <div key={m.id} className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs">
                      <div className="flex items-center justify-between text-stone-400 text-[10px] mb-1.5">
                        <span className="font-semibold text-stone-600">You wrote:</span>
                        <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-stone-800 font-medium">{m.message}</p>

                      {/* Author Reply */}
                      {m.reply ? (
                        <div className="mt-3 p-3 bg-amber-50/80 rounded-lg border border-amber-200">
                          <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px] mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <span>Reply from Jayed:</span>
                          </div>
                          <p className="text-stone-800 text-xs leading-relaxed">{m.reply}</p>
                        </div>
                      ) : (
                        <div className="mt-2 text-[10px] text-amber-700 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" />
                          <span>Delivered to Jayed's inbox. Awaiting reply.</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
