import { AuthorProfile, Ebook, DownloadRequest, BookReview, ContactInfo, QuickMessage } from '../types.ts';

export const initialProfile: AuthorProfile = {
  name: "Jayed Mahmud",
  greeting: "Hey Friends",
  role: "Author, Content Creator & Entrepreneur",
  bio: "I'm Jayed. I write books and essays about productivity, intentional living, building scalable digital businesses, and personal growth. Welcome to my personal library where you can explore my thoughts, read free book previews, and grab full copies.",
  photoUrl: "/src/assets/images/author_portrait_jayed_1793435132149.jpg",
  subscribersCount: "370K+",
  readersCount: "18,500+",
  featuredQuote: "Success isn't about grinding yourself into burnout; it's about engineering energy and focus into everything you do."
};

export const initialBooks: Ebook[] = [
  {
    id: "book-1",
    title: "Feel-Good Focus",
    subtitle: "The Art of Intentional Work & Energy Management",
    description: "Discover how to sustain high productivity without sacrificing peace of mind. A practical guide on beating procrastination, crafting energizing routines, and working joyfully.",
    category: "Productivity",
    price: 250,
    coverUrl: "/src/assets/images/cover_productivity_mastery_1793435132456.jpg",
    previewPdfUrl: "/downloads/feel-good-focus-preview.pdf",
    fullPdfUrl: "/downloads/feel-good-focus-full.pdf",
    pages: 184,
    featured: true,
    publishedDate: "January 2026",
    previewContent: {
      chapters: [
        {
          number: "Chapter 1",
          title: "The Play Paradigm: Why Fun Fuels Focus",
          content: "When we treat our daily work as a high-stakes exam, our biology activates fear responses. But when we approach work with an attitude of experimental play, cognitive load drops, and genuine deep work emerges effortlessly. In this chapter, we dissect the biological drivers of joyful momentum."
        },
        {
          number: "Chapter 2",
          title: "Designing Frictionless Starting Rituals",
          content: "The hardest part of any meaningful endeavor is almost never the middle or the finish; it is the first 120 seconds. By engineering microscopic friction out of your starting gate, resistance evaporates before self-doubt can intervene."
        }
      ]
    },
    fullContent: {
      chapters: [
        {
          number: "Chapter 1",
          title: "The Play Paradigm: Why Fun Fuels Focus",
          content: "When we treat our daily work as a high-stakes exam, our biology activates fear responses. But when we approach work with an attitude of experimental play, cognitive load drops, and genuine deep work emerges effortlessly. In this chapter, we dissect the biological drivers of joyful momentum."
        },
        {
          number: "Chapter 2",
          title: "Designing Frictionless Starting Rituals",
          content: "The hardest part of any meaningful endeavor is almost never the middle or the finish; it is the first 120 seconds. By engineering microscopic friction out of your starting gate, resistance evaporates before self-doubt can intervene."
        },
        {
          number: "Chapter 3",
          title: "Powering Down: The Art of Guilt-Free Recovery",
          content: "Productivity is rhythmic, not linear. Without deep deliberate rest, creativity atrophies. Learn the 3-phase evening shutdown protocol used by top innovators."
        },
        {
          number: "Chapter 4",
          title: "The Intentional Calendar & Say-No Framework",
          content: "Every 'yes' is a hundred silent 'no's. How to guard your best cognitive hours and build compounding leverage."
        }
      ]
    }
  },
  {
    id: "book-2",
    title: "The Creator's Blueprint",
    subtitle: "Unlocking Innovation, Audience Vision, and Strategy",
    description: "A comprehensive roadmap for modern creators and knowledge workers. From validating high-value ideas to building an audience of loyal advocates and creating compounding digital products.",
    category: "Creator Business",
    price: 320,
    coverUrl: "/src/assets/images/cover_digital_creator_playbook_1793435132635.jpg",
    previewPdfUrl: "/downloads/creators-blueprint-preview.pdf",
    fullPdfUrl: "/downloads/creators-blueprint-full.pdf",
    pages: 228,
    featured: true,
    publishedDate: "March 2026",
    previewContent: {
      chapters: [
        {
          number: "Chapter 1",
          title: "Finding Your Unfair Creative Moat",
          content: "You do not need to be the absolute top 1% expert in a domain to create immense value. What separates timeless creators is the intersection of two distinct disciplines combined with genuine personal storytelling."
        },
        {
          number: "Chapter 2",
          title: "The Value-First Distribution Flywheel",
          content: "Building an audience without burning out requires systematic repurposing and genuine reciprocity. Learn how to turn 1 deep essay into a multi-channel engine."
        }
      ]
    },
    fullContent: {
      chapters: [
        {
          number: "Chapter 1",
          title: "Finding Your Unfair Creative Moat",
          content: "You do not need to be the absolute top 1% expert in a domain to create immense value. What separates timeless creators is the intersection of two distinct disciplines combined with genuine personal storytelling."
        },
        {
          number: "Chapter 2",
          title: "The Value-First Distribution Flywheel",
          content: "Building an audience without burning out requires systematic repurposing and genuine reciprocity. Learn how to turn 1 deep essay into a multi-channel engine."
        },
        {
          number: "Chapter 3",
          title: "Monetization Without Compromising Trust",
          content: "Why digital products like e-books and workshops scale infinitely, and how to price based on outcome value rather than hours spent."
        }
      ]
    }
  },
  {
    id: "book-3",
    title: "Wealth & Mindset for the Modern Age",
    subtitle: "Timeless Financial Wisdom for Digital Solopreneurs",
    description: "Deconstructing money psychology, asymmetric risk-taking, and building financial sovereignty in an unpredictable economy. Tailored specifically for freelancers, developers, and writers.",
    category: "Mindset",
    price: 190,
    coverUrl: "/src/assets/images/cover_mindset_money_guide_1793435132366.jpg",
    previewPdfUrl: "/downloads/wealth-mindset-preview.pdf",
    fullPdfUrl: "/downloads/wealth-mindset-full.pdf",
    pages: 160,
    featured: false,
    publishedDate: "May 2026",
    previewContent: {
      chapters: [
        {
          number: "Chapter 1",
          title: "The Psychology of Enough",
          content: "Most financial struggle stems not from mathematics but from social comparison. Developing clarity around personal freedom metrics changes how you make decisions forever."
        }
      ]
    },
    fullContent: {
      chapters: [
        {
          number: "Chapter 1",
          title: "The Psychology of Enough",
          content: "Most financial struggle stems not from mathematics but from social comparison. Developing clarity around personal freedom metrics changes how you make decisions forever."
        },
        {
          number: "Chapter 2",
          title: "Assets Over Hours: The Solopreneur Balance Sheet",
          content: "How to shift from trading billable hours to holding digital IP, software, and media assets that generate revenue around the clock."
        }
      ]
    }
  }
];

export const initialRequests: DownloadRequest[] = [
  {
    id: "req-1",
    bookId: "book-2",
    bookTitle: "The Creator's Blueprint",
    bookCoverUrl: "/src/assets/images/cover_digital_creator_playbook_1793435132635.jpg",
    userId: "user-tanvir",
    userName: "Tanvir Ahmed",
    userEmail: "tanvir.creator@gmail.com",
    bkashNumber: "01711-987654 (TrxID: 8KL01P2X)",
    description: "Paid ৳320 via bKash. Please approve my access.",
    status: "pending",
    createdAt: "2026-10-30T14:20:00Z",
    updatedAt: "2026-10-30T14:20:00Z"
  }
];

export const initialReviews: BookReview[] = [
  {
    id: "rev-1",
    bookId: "book-1",
    bookTitle: "Feel-Good Focus",
    userId: "user-nafisa",
    userName: "Nafisa Kamal",
    userEmail: "nafisa.kamal.design@gmail.com",
    rating: 5,
    comment: "This book completely transformed how I structure my morning work blocks. Short, punchy, and deeply actionable. 10/10 recommendation!",
    status: "approved",
    createdAt: "2026-10-27T12:45:00Z"
  },
  {
    id: "rev-2",
    bookId: "book-1",
    bookTitle: "Feel-Good Focus",
    userId: "user-nafisa",
    userName: "Nafisa Kamal",
    userEmail: "nafisa.kamal.design@gmail.com",
    rating: 5,
    comment: "Short, punchy, and deeply actionable. No fluff, just practical frameworks you can apply in 10 minutes. 10/10 recommendation!",
    status: "approved",
    createdAt: "2026-10-27T12:45:00Z"
  },
  {
    id: "rev-3",
    bookId: "book-2",
    bookTitle: "The Creator's Blueprint",
    userId: "user-sadia",
    userName: "Sadia Chowdhury",
    userEmail: "sadia.writes@gmail.com",
    rating: 4,
    comment: "The chapter on finding your creative moat gave me so much clarity for launching my newsletter. A must-read for any modern writer.",
    status: "approved",
    createdAt: "2026-10-25T09:15:00Z"
  }
];

export const initialContact: ContactInfo = {
  email: "jayedmahmud18@gmail.com",
  phone: "+880 1712-345678",
  bkashInstructions: "Send payment via bKash Personal to: 01712-345678. In the reference, put your Name or Book Title. Save your TrxID to submit your download request.",
  location: "Dhaka, Bangladesh",
  socialLinks: {
    youtube: "https://youtube.com/@jayedmahmud",
    twitter: "https://twitter.com/jayedmahmud",
    linkedin: "https://linkedin.com/in/jayedmahmud",
    facebook: "https://facebook.com/jayedmahmud.author",
    instagram: "https://instagram.com/jayedmahmud",
    github: "https://github.com/jayedmahmud"
  }
};

export const initialMessages: QuickMessage[] = [
  {
    id: "msg-1",
    name: "Ayman Chowdhury",
    email: "ayman.c@gmail.com",
    message: "Salam Jayed bhai! I just finished Feel-Good Focus. Are you planning an audio version or Bengali translation in the future?",
    reply: "Salam Ayman! Thank you so much for the kind words. Yes, an audio version is currently in development and expected next month!",
    replyAt: "2026-10-29T18:00:00Z",
    createdAt: "2026-10-29T14:10:00Z",
    status: "replied"
  },
  {
    id: "msg-2",
    name: "Sabrina Mostafa",
    email: "sabrina.m@yahoo.com",
    message: "Would love to invite you to speak at our university tech & entrepreneurship seminar next month. What is the best way to coordinate?",
    createdAt: "2026-10-30T19:30:00Z",
    status: "unread"
  }
];
