import React from 'react';
import {
  Search,
  Bell,
  Users,
  Smartphone,
  CheckCircle2,
  LogIn
} from 'lucide-react';
import type { StudentProfile, User } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  profile: StudentProfile;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenDigest: () => void;
  isParentMode: boolean;
  toggleParentMode: () => void;
  lang: 'en' | 'hi';
  toggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  profile,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onOpenDigest,
  isParentMode,
  toggleParentMode,
  lang,
  toggleLanguage
}) => {
  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-3 flex items-center justify-between gap-4">
      {/* Search Input Bar (matching screenshot pill) */}
      <div className="relative flex-1 max-w-xl">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            lang === 'hi'
              ? 'छात्रवृत्ति, सरकारी परीक्षा, कॉलेज, प्रवेश खोजें...'
              : 'Search scholarships, exams, colleges, internships...'
          }
          className="w-full pl-11 pr-4 py-2 bg-[#f3f4f8] hover:bg-[#ebedf3] focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-full border border-transparent focus:border-[#5034df] focus:ring-2 focus:ring-[#5034df]/20 outline-none transition-all shadow-2xs"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Language Switcher */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="cursor-pointer px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          title="Switch English / हिन्दी"
        >
          {lang === 'en' ? 'हिन्दी' : 'EN'}
        </button>

        {/* Family Mode Switcher */}
        <button
          type="button"
          onClick={toggleParentMode}
          className={`cursor-pointer px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
            isParentMode
              ? 'bg-[#5034df] text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
          title="Family & Parent Mode in Hindi"
        >
          <Users className="w-3.5 h-3.5" />
          <span className="hidden md:inline">
            {lang === 'hi' ? 'परिवार मोड' : 'Family Mode'}
          </span>
          {isParentMode && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
        </button>

        {/* Weekly Action Digest Trigger */}
        <button
          type="button"
          onClick={onOpenDigest}
          className="cursor-pointer px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition"
          title="WhatsApp & Email Action Digest"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden lg:inline">
            {lang === 'hi' ? 'डाइजेस्ट' : 'Weekly Digest'}
          </span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            className="cursor-pointer p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
            title="Official Notice & Deadline Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>
        </div>

        {/* User Account / Profile Pill (matching screenshot) */}
        {currentUser ? (
          <button
            type="button"
            onClick={onOpenProfile}
            className="cursor-pointer flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-[#f3f4f8] hover:bg-[#ebedf3] transition-all text-left"
          >
            <div className="w-8 h-8 rounded-full bg-[#ede9fe] text-[#5034df] font-bold text-xs flex items-center justify-center">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                <span>{currentUser.name.split(' ')[0]}</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                Student account
              </div>
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenProfile}
              className="cursor-pointer flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-[#f3f4f8] hover:bg-[#ebedf3] transition-all text-left"
            >
              <div className="w-8 h-8 rounded-full bg-[#ede9fe] text-[#5034df] font-bold text-xs flex items-center justify-center">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {profile.fullName.split(' ')[0]}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Student account
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={onOpenAuth}
              className="cursor-pointer px-3 py-1.5 rounded-full bg-[#5034df] hover:bg-[#4329ce] text-white text-xs font-bold shadow-xs transition"
            >
              <LogIn className="w-3.5 h-3.5 inline mr-1" />
              <span>{lang === 'hi' ? 'लॉगिन' : 'Sign In'}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
