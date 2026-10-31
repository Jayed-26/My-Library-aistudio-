import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ArrowDown, Edit3, BookOpen, MessageSquare, CheckCircle2 } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { profile, isAdmin, setAdminModalOpen } = useApp();

  return (
    <section id="about" className="relative pt-6 pb-16 md:pt-12 md:pb-24 overflow-hidden">
      {/* Subtle background ambient warm glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-yellow-100/40 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Greeting, Name, Bio, and CTAs (as requested: "website ey dukha matro amar nam namer niche akta bio") */}
          <div className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1">
            
            {/* Playful Greeting inspired by Ali Abdaal reference */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight">
                {profile.greeting}
              </span>
              <span className="text-3xl sm:text-4xl animate-bounce" role="img" aria-label="wave">
                👋
              </span>
            </div>

            {/* Playful curved accent underline */}
            <div className="w-24 sm:w-32 h-1.5 bg-amber-400 rounded-full -mt-1 mb-6"></div>

            {/* Author Name as requested: right at top with no unnecessary heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight leading-[1.15] mb-5 text-balance">
              I'm <span className="underline decoration-amber-400 decoration-wavy decoration-2 underline-offset-8">{profile.name}</span>.
            </h1>

            {/* Author Role */}
            <p className="text-base sm:text-lg font-semibold text-amber-700 mb-4 tracking-wide">
              {profile.role}
            </p>

            {/* Author Bio (directly under name) */}
            <p className="text-stone-700 text-base sm:text-lg leading-relaxed mb-8 max-w-xl font-normal">
              {profile.bio}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <a
                href="#ebooks"
                className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 group whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Explore E-Books</span>
                <ArrowDown className="w-4 h-4 text-amber-400 group-hover:translate-y-0.5 transition-transform" />
              </a>

              <a
                href="#contact"
                className="px-6 py-3.5 bg-white hover:bg-amber-50 text-stone-800 border-2 border-amber-300 hover:border-amber-400 font-semibold text-sm rounded-xl transition-colors shadow-xs flex items-center gap-2 whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <span>Send Quick Message</span>
              </a>

              {isAdmin && (
                <button
                  onClick={() => setAdminModalOpen(true)}
                  className="px-4 py-3 bg-amber-100 hover:bg-amber-200 text-stone-900 text-xs font-semibold rounded-xl border border-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-stone-800" />
                  <span>Edit Profile / Bio</span>
                </button>
              )}
            </div>

            {/* Trust & Stats metrics */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-stone-200 max-w-sm">
              <div>
                <p className="text-2xl font-bold font-display text-stone-900 tabular-nums">
                  {profile.subscribersCount}
                </p>
                <p className="text-xs text-stone-500 font-medium">Community</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-stone-900 tabular-nums">
                  {profile.readersCount}
                </p>
                <p className="text-xs text-stone-500 font-medium">Books Read</p>
              </div>
            </div>

          </div>

          {/* Right Column: Author Photo with the Yellow Speech-Bubble motif from Reference Screenshot */}
          <div className="lg:col-span-5 flex justify-center items-center order-1 lg:order-2">
            <div className="relative w-72 sm:w-88 md:w-96 aspect-square flex items-center justify-center">
              
              {/* Outer decorative yellow circular stroke */}
              <div className="absolute inset-0 rounded-full border-2 border-amber-300/80 -rotate-6 scale-105 pointer-events-none" />

              {/* Inner Warm Yellow Speech-Bubble Circle Graphic (Exact homage to user's uploaded image reference) */}
              <div className="absolute w-[88%] h-[88%] bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-400 rounded-full shadow-lg flex items-center justify-center">
                {/* Speech bubble pointer notch */}
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-amber-400 rotate-45 rounded-sm -z-1" />
              </div>

              {/* Author Portrait Image */}
              <div className="relative w-[82%] h-[82%] rounded-full overflow-hidden border-4 border-white shadow-xl z-10 bg-amber-100 group">
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback in case of broken custom URL
                    (e.target as HTMLImageElement).src = '/public/assets/aistudio/image_3eb4b58c.png';
                  }}
                />
              </div>

              {/* Floating verified author sticker badge */}
              <div className="absolute -bottom-2 -left-2 sm:bottom-2 sm:left-2 z-20 bg-white/95 backdrop-blur-sm border border-amber-300 rounded-xl px-3.5 py-2 shadow-md flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-500" />
                <div className="text-left">
                  <p className="text-xs font-bold text-stone-900 leading-none">Verified Author</p>
                  <p className="text-[10px] text-stone-500 leading-tight mt-0.5">Official Direct Store</p>
                </div>
              </div>

              {/* Admin quick change overlay */}
              {isAdmin && (
                <button
                  onClick={() => setAdminModalOpen(true)}
                  className="absolute top-4 right-4 z-20 bg-stone-900/80 hover:bg-stone-900 text-white p-2 rounded-full shadow-lg transition-all"
                  title="Change Author Photo"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
