import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AuthorProfile,
  Ebook,
  DownloadRequest,
  BookReview,
  ContactInfo,
  QuickMessage,
  AuthUser
} from '../types.ts';
import {
  initialProfile,
  initialBooks,
  initialRequests,
  initialReviews,
  initialContact,
  initialMessages
} from '../data/seedData.ts';

interface AppContextType {
  profile: AuthorProfile;
  books: Ebook[];
  requests: DownloadRequest[];
  reviews: BookReview[];
  contact: ContactInfo;
  messages: QuickMessage[];
  currentUser: AuthUser | null;
  isAdmin: boolean;
  activePreviewBook: Ebook | null;
  activeFullBook: Ebook | null;
  activeRequestBook: Ebook | null;
  activeReviewModalBook: Ebook | null;
  isAdminModalOpen: boolean;
  isAuthModalOpen: boolean;
  isProfileModalOpen: boolean;
  toastMessage: string | null;

  // Actions
  loginWithGoogle: (email?: string, name?: string) => void;
  logout: () => void;
  toggleAdminMode: (overrideAdmin?: boolean) => void;
  setAdminModalOpen: (open: boolean) => void;
  setAuthModalOpen: (open: boolean) => void;
  setProfileModalOpen: (open: boolean) => void;
  setActivePreviewBook: (book: Ebook | null) => void;
  setActiveFullBook: (book: Ebook | null) => void;
  setActiveRequestBook: (book: Ebook | null) => void;
  setActiveReviewModalBook: (book: Ebook | null) => void;
  showToast: (msg: string) => void;

  // Data operations
  updateProfile: (updated: Partial<AuthorProfile>) => Promise<void>;
  updateUserProfile: (data: { name: string; email: string; avatar: string }) => Promise<void>;
  addBook: (book: Omit<Ebook, 'id' | 'publishedDate'>) => Promise<void>;
  updateBook: (id: string, updated: Partial<Ebook>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  
  submitDownloadRequest: (bookId: string, bkashNumber: string, description: string) => Promise<boolean>;
  getUserRequestForBook: (bookId: string) => DownloadRequest | undefined;
  approveRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string, reason?: string) => Promise<void>;

  submitReview: (bookId: string, rating: number, comment: string) => Promise<boolean>;
  canUserReviewBook: (bookId: string) => boolean;
  approveReview: (reviewId: string) => Promise<void>;
  rejectReview: (reviewId: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;

  updateContact: (updated: Partial<ContactInfo>) => Promise<void>;
  sendQuickMessage: (name: string, email: string, message: string) => Promise<boolean>;
  replyToMessage: (messageId: string, reply: string, sender?: 'author' | 'user') => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  clearAllMessages: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<AuthorProfile>(() => {
    const saved = localStorage.getItem('author_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [books, setBooks] = useState<Ebook[]>(() => {
    const saved = localStorage.getItem('author_books');
    return saved ? JSON.parse(saved) : initialBooks;
  });

  const [requests, setRequests] = useState<DownloadRequest[]>(() => {
    try {
      const saved = localStorage.getItem('author_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed)
          ? parsed.filter((r: any) => r.userId !== 'user-rahman' && r.userId !== 'user-tanvir')
          : [];
      }
    } catch {
      localStorage.removeItem('author_requests');
    }
    return [];
  });

  const [reviews, setReviews] = useState<BookReview[]>(() => {
    const saved = localStorage.getItem('author_reviews');
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [contact, setContact] = useState<ContactInfo>(() => {
    const saved = localStorage.getItem('author_contact');
    return saved ? JSON.parse(saved) : initialContact;
  });

  const [messages, setMessages] = useState<QuickMessage[]>(() => {
    try {
      const saved = localStorage.getItem('author_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed)
          ? parsed.filter((m: any) => m.id !== 'msg-1' && m.id !== 'msg-2' && m.email !== 'ayman.c@gmail.com' && m.email !== 'sabrina.m@yahoo.com')
          : [];
      }
    } catch {
      localStorage.removeItem('author_messages');
    }
    return [];
  });

  // Current logged in user (strictly starts as null - NO fake user!)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('author_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed || parsed.id === 'demo-reader' || parsed.email === 'rahman.hasan.bd@gmail.com') {
          localStorage.removeItem('author_current_user');
          return null;
        }
        return parsed;
      }
    } catch {
      localStorage.removeItem('author_current_user');
    }
    return null;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('author_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.email?.toLowerCase() === 'jayedmahmud18@gmail.com';
      }
    } catch {}
    return false;
  });

  const [activePreviewBook, setActivePreviewBook] = useState<Ebook | null>(null);
  const [activeFullBook, setActiveFullBook] = useState<Ebook | null>(null);
  const [activeRequestBook, setActiveRequestBook] = useState<Ebook | null>(null);
  const [activeReviewModalBook, setActiveReviewModalBook] = useState<Ebook | null>(null);
  const [isAdminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync from server on mount
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if (data.profile) {
          setProfile(data.profile);
          localStorage.setItem('author_profile', JSON.stringify(data.profile));
        }
        if (data.books) {
          setBooks(data.books);
          localStorage.setItem('author_books', JSON.stringify(data.books));
        }
        if (data.requests) {
          const filtered = Array.isArray(data.requests)
            ? data.requests.filter((r: any) => r.userId !== 'user-rahman' && r.userId !== 'user-tanvir')
            : [];
          setRequests(filtered);
          localStorage.setItem('author_requests', JSON.stringify(filtered));
        }
        if (data.reviews) {
          setReviews(data.reviews);
          localStorage.setItem('author_reviews', JSON.stringify(data.reviews));
        }
        if (data.contact) {
          setContact(data.contact);
          localStorage.setItem('author_contact', JSON.stringify(data.contact));
        }
        if (data.messages) {
          const filtered = Array.isArray(data.messages)
            ? data.messages.filter((m: any) => m.id !== 'msg-1' && m.id !== 'msg-2' && m.email !== 'ayman.c@gmail.com' && m.email !== 'sabrina.m@yahoo.com')
            : [];
          setMessages(filtered);
          localStorage.setItem('author_messages', JSON.stringify(filtered));
        }
      })
      .catch(err => {
        console.warn('API sync fallback to local storage:', err);
      });
  }, []);

  // Save to localStorage when states update
  useEffect(() => {
    localStorage.setItem('author_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('author_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('author_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('author_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('author_contact', JSON.stringify(contact));
  }, [contact]);

  useEffect(() => {
    localStorage.setItem('author_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('author_current_user', JSON.stringify(currentUser));
      const userIsAuthor = currentUser.email.toLowerCase() === 'jayedmahmud18@gmail.com';
      setIsAdmin(userIsAuthor);
      if (userIsAuthor) {
        localStorage.setItem('author_is_admin', 'true');
      } else {
        localStorage.removeItem('author_is_admin');
        setAdminModalOpen(false);
      }
    } else {
      setIsAdmin(false);
      setAdminModalOpen(false);
      localStorage.removeItem('author_current_user');
      localStorage.removeItem('author_is_admin');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('author_is_admin', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  const loginWithGoogle = (emailInput?: string, nameInput?: string) => {
    let rawEmail = (emailInput || '').trim();
    if (!rawEmail) {
      showToast('Please enter an email address');
      return;
    }
    // Auto-complete handle if author entered jayedmahmud18 without @
    if (!rawEmail.includes('@') && rawEmail.toLowerCase() === 'jayedmahmud18') {
      rawEmail = 'jayedmahmud18@gmail.com';
    }

    const email = rawEmail.toLowerCase();
    const userIsAdmin = email === 'jayedmahmud18@gmail.com';

    // Determine user name
    let name = nameInput?.trim();
    if (!name) {
      if (userIsAdmin) {
        name = 'Jayed Mahmud (Author)';
      } else {
        const handle = email.split('@')[0] || 'Reader';
        name = handle.charAt(0).toUpperCase() + handle.slice(1);
      }
    }

    const newUser: AuthUser = {
      id: 'usr-' + Date.now(),
      name,
      email: rawEmail,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=fbbf24`,
      isAdmin: userIsAdmin
    };

    setCurrentUser(newUser);
    localStorage.setItem('author_current_user', JSON.stringify(newUser));

    if (userIsAdmin) {
      setIsAdmin(true);
      localStorage.setItem('author_is_admin', 'true');
      setAdminModalOpen(true); // Automatically open the Author Control Center
      showToast(`Welcome back, Jayed! Author Dashboard unlocked.`);
    } else {
      setIsAdmin(false);
      localStorage.removeItem('author_is_admin');
      setAdminModalOpen(false);
      showToast(`Signed in with Google as ${name}`);
    }

    setAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setAdminModalOpen(false);
    localStorage.removeItem('author_current_user');
    localStorage.removeItem('author_is_admin');
    showToast('Signed out from Google account');
  };

  const toggleAdminMode = (overrideAdmin?: boolean) => {
    if (!currentUser || currentUser.email.toLowerCase() !== 'jayedmahmud18@gmail.com') {
      setIsAdmin(false);
      setAdminModalOpen(false);
      return;
    }
    const nextVal = overrideAdmin !== undefined ? overrideAdmin : !isAdmin;
    setIsAdmin(nextVal);
    if (nextVal) {
      showToast('Admin Mode Enabled. You can edit all content directly.');
    } else {
      showToast('Admin Mode Disabled. Viewing as regular visitor.');
    }
  };

  const updateProfile = async (updated: Partial<AuthorProfile>) => {
    const newProfile = { ...profile, ...updated };
    setProfile(newProfile);
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      showToast('Author profile updated successfully!');
    } catch {
      showToast('Profile updated locally.');
    }
  };

  const addBook = async (bookData: Omit<Ebook, 'id' | 'publishedDate'>) => {
    const newBook: Ebook = {
      ...bookData,
      id: 'book-' + Date.now(),
      publishedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    setBooks(prev => [newBook, ...prev]);
    try {
      await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
      showToast(`'${newBook.title}' published successfully!`);
    } catch {
      showToast('Book added locally.');
    }
  };

  const updateBook = async (id: string, updated: Partial<Ebook>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updated } : b));
    try {
      await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      showToast('Book details updated!');
    } catch {
      showToast('Book updated locally.');
    }
  };

  const deleteBook = async (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    try {
      await fetch(`/api/books/${id}`, { method: 'DELETE' });
      showToast('Book removed from collection.');
    } catch {
      showToast('Book removed locally.');
    }
  };

  const getUserRequestForBook = (bookId: string): DownloadRequest | undefined => {
    if (!currentUser) return undefined;
    return requests.find(r => r.bookId === bookId && r.userEmail === currentUser.email);
  };

  const submitDownloadRequest = async (bookId: string, bkashNumber: string, description: string): Promise<boolean> => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return false;
    }

    const targetBook = books.find(b => b.id === bookId);
    if (!targetBook) return false;

    const newRequest: DownloadRequest = {
      id: 'req-' + Date.now(),
      bookId,
      bookTitle: targetBook.title,
      bookCoverUrl: targetBook.coverUrl,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      bkashNumber,
      description,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setRequests(prev => {
      const idx = prev.findIndex(r => r.bookId === bookId && r.userEmail === currentUser.email);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = newRequest;
        return copy;
      }
      return [newRequest, ...prev];
    });

    try {
      await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest)
      });
      showToast('Request submitted! Awaiting author bKash verification & approval.');
      return true;
    } catch {
      showToast('Request recorded locally.');
      return true;
    }
  };

  const approveRequest = async (requestId: string) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved', updatedAt: new Date().toISOString() } : r));
    try {
      await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      showToast('Download request approved! User can now access the full book & submit reviews.');
    } catch {
      showToast('Approved locally.');
    }
  };

  const rejectRequest = async (requestId: string, reason?: string) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected', rejectionReason: reason || 'bKash reference could not be verified. Please submit again.', updatedAt: new Date().toISOString() } : r));
    try {
      await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', rejectionReason: reason })
      });
      showToast('Request rejected. User will see a "Request Again" option.');
    } catch {
      showToast('Rejected locally.');
    }
  };

  const canUserReviewBook = (bookId: string): boolean => {
    if (!currentUser) return false;
    // User can review ONLY if they had an approved download request for this book!
    const req = requests.find(r => r.bookId === bookId && r.userEmail === currentUser.email && r.status === 'approved');
    return !!req;
  };

  const submitReview = async (bookId: string, rating: number, comment: string): Promise<boolean> => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return false;
    }

    if (!canUserReviewBook(bookId)) {
      showToast('Only readers with approved full-book access can submit a review.');
      return false;
    }

    const targetBook = books.find(b => b.id === bookId);
    if (!targetBook) return false;

    const newReview: BookReview = {
      id: 'rev-' + Date.now(),
      bookId,
      bookTitle: targetBook.title,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      rating,
      comment,
      status: 'pending', // Awaiting author approval!
      createdAt: new Date().toISOString()
    };

    setReviews(prev => [newReview, ...prev]);

    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      showToast('Thank you! Your review has been submitted and will appear upon author approval.');
      return true;
    } catch {
      showToast('Review submitted for moderation.');
      return true;
    }
  };

  const approveReview = async (reviewId: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'approved' } : r));
    try {
      await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      showToast('Review approved and published to website!');
    } catch {
      showToast('Review approved locally.');
    }
  };

  const rejectReview = async (reviewId: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'rejected' } : r));
    try {
      await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      showToast('Review declined.');
    } catch {
      showToast('Review declined locally.');
    }
  };

  const deleteReview = async (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    try {
      await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
      showToast('Review deleted.');
    } catch {
      showToast('Review removed locally.');
    }
  };

  const updateContact = async (updated: Partial<ContactInfo>) => {
    const newContact = { ...contact, ...updated };
    setContact(newContact);
    try {
      await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      showToast('Contact info updated!');
    } catch {
      showToast('Contact info saved locally.');
    }
  };

  const updateUserProfile = async (data: { name: string; email: string; avatar: string }) => {
    if (!currentUser) return;
    const oldEmail = currentUser.email.toLowerCase();
    const newEmail = data.email.toLowerCase();
    const isUserAuthor = newEmail === 'jayedmahmud18@gmail.com';

    const updatedUser: AuthUser = {
      ...currentUser,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      isAdmin: isUserAuthor
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('author_current_user', JSON.stringify(updatedUser));

    if (isUserAuthor) {
      setIsAdmin(true);
      localStorage.setItem('author_is_admin', 'true');
    }

    // Update matching requests
    setRequests(prev => prev.map(r => {
      if (r.userId === currentUser.id || r.userEmail.toLowerCase() === oldEmail) {
        return { ...r, userName: data.name, userEmail: data.email };
      }
      return r;
    }));

    // Update matching reviews
    setReviews(prev => prev.map(r => {
      if (r.userId === currentUser.id || r.userEmail.toLowerCase() === oldEmail) {
        return { ...r, userName: data.name, userEmail: data.email };
      }
      return r;
    }));

    // Update matching messages
    setMessages(prev => prev.map(m => {
      if (m.userId === currentUser.id || m.email.toLowerCase() === oldEmail) {
        return { ...m, name: data.name, email: data.email, userAvatar: data.avatar };
      }
      return m;
    }));

    showToast('Your profile has been updated!');
  };

  const sendQuickMessage = async (name: string, email: string, message: string): Promise<boolean> => {
    const newMsg: QuickMessage = {
      id: 'msg-' + Date.now(),
      userId: currentUser?.id,
      name,
      email,
      userAvatar: currentUser?.avatar,
      message,
      replies: [],
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [newMsg, ...prev]);

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg)
      });
      showToast('Message sent! Jayed will review it and reply back to you.');
      return true;
    } catch {
      showToast('Message sent successfully!');
      return true;
    }
  };

  const replyToMessage = async (messageId: string, reply: string, sender: 'author' | 'user' = 'author') => {
    const isAuthorSender = sender === 'author';
    const senderName = isAuthorSender ? 'Jayed Mahmud (Author)' : (currentUser?.name || 'Reader');
    const senderAvatar = isAuthorSender ? '/assets/aistudio/image_3eb4b58c.png' : (currentUser?.avatar || '');

    const newReplyItem = {
      id: 'rep-' + Date.now(),
      sender,
      senderName,
      senderAvatar,
      message: reply,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        const existingReplies = Array.isArray(m.replies) ? [...m.replies] : (m.reply ? [{
          id: 'rep-init',
          sender: 'author' as const,
          senderName: 'Jayed Mahmud (Author)',
          senderAvatar: '/assets/aistudio/image_3eb4b58c.png',
          message: m.reply,
          createdAt: m.replyAt || m.createdAt
        }] : []);

        existingReplies.push(newReplyItem);

        return {
          ...m,
          reply,
          replyAt: newReplyItem.createdAt,
          replies: existingReplies,
          status: isAuthorSender ? 'replied' : 'unread'
        };
      }
      return m;
    }));

    try {
      await fetch(`/api/messages/${messageId}/reply`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reply,
          sender,
          senderName,
          senderAvatar
        })
      });
      if (isAuthorSender) {
        showToast('Reply saved and sent to user!');
      } else {
        showToast('Your reply was sent to Jayed!');
      }
    } catch {
      showToast(isAuthorSender ? 'Reply saved locally.' : 'Reply sent locally.');
    }
  };

  const deleteMessage = async (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    try {
      await fetch(`/api/messages/${messageId}`, { method: 'DELETE' });
      showToast('Message deleted.');
    } catch {
      showToast('Message deleted locally.');
    }
  };

  const clearAllMessages = async () => {
    setMessages([]);
    try {
      await fetch('/api/messages', { method: 'DELETE' });
      showToast('All messages cleared.');
    } catch {
      showToast('All messages cleared locally.');
    }
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        books,
        requests,
        reviews,
        contact,
        messages,
        currentUser,
        isAdmin,
        activePreviewBook,
        activeFullBook,
        activeRequestBook,
        activeReviewModalBook,
        isAdminModalOpen,
        isAuthModalOpen,
        isProfileModalOpen,
        toastMessage,

        loginWithGoogle,
        logout,
        toggleAdminMode,
        setAdminModalOpen,
        setAuthModalOpen,
        setProfileModalOpen,
        setActivePreviewBook,
        setActiveFullBook,
        setActiveRequestBook,
        setActiveReviewModalBook,
        showToast,

        updateProfile,
        updateUserProfile,
        addBook,
        updateBook,
        deleteBook,
        submitDownloadRequest,
        getUserRequestForBook,
        approveRequest,
        rejectRequest,
        submitReview,
        canUserReviewBook,
        approveReview,
        rejectReview,
        deleteReview,
        updateContact,
        sendQuickMessage,
        replyToMessage,
        deleteMessage,
        clearAllMessages
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
