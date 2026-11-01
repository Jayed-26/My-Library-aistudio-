export interface AuthorProfile {
  name: string;
  greeting: string;
  bio: string;
  role: string;
  photoUrl: string;
  subscribersCount: string;
  readersCount: string;
  featuredQuote: string;
}

export interface Ebook {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'Productivity' | 'Mindset' | 'Creator Business' | 'Technology' | 'General';
  price: number; // In BDT (৳)
  coverUrl: string;
  previewPdfUrl?: string;
  previewPdfFileName?: string;
  previewPdfFileSize?: string;
  fullPdfUrl?: string;
  fullPdfFileName?: string;
  fullPdfFileSize?: string;
  previewContent: {
    chapters: {
      number: string;
      title: string;
      content: string;
    }[];
  };
  fullContent?: {
    chapters: {
      number: string;
      title: string;
      content: string;
    }[];
  };
  pages: number;
  featured: boolean;
  publishedDate: string;
}

export interface DownloadRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCoverUrl: string;
  userId: string;
  userName: string;
  userEmail: string;
  bkashNumber: string; // Reference (bKash number or TrxID)
  description: string; // Note or details
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookReview {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number; // 1 to 5
  comment: string; // Text only (no photos allowed)
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  bkashInstructions: string;
  location: string;
  socialLinks: {
    youtube: string;
    twitter: string;
    linkedin: string;
    facebook: string;
    instagram: string;
    github: string;
  };
}

export interface QuickMessageReply {
  id: string;
  sender: 'author' | 'user';
  senderName: string;
  senderAvatar?: string;
  message: string;
  createdAt: string;
}

export interface QuickMessage {
  id: string;
  userId?: string;
  name: string;
  email: string;
  userAvatar?: string;
  message: string;
  reply?: string;
  replyAt?: string;
  replies?: QuickMessageReply[];
  createdAt: string;
  status: 'unread' | 'replied';
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
}

