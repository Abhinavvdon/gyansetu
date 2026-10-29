import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Users,
  Smartphone,
  CheckCircle2,
  LogIn,
  Sun,
  Moon
} from 'lucide-react';
import type { StudentProfile, User, DeadlineNotification } from '../types';
import { NotificationPopover } from './NotificationPopover';
import { formatStudentName } from '../utils/languageUtils';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  profile: StudentProfile;
  currentUser: User | null;
  notifications: DeadlineNotification[];
  unreadAlertCount: number;
  onMarkAlertRead: (id: number) => void;
  onMarkAllAlertsRead: () => void;
  onSelectOpportunity?: (oppId: string) => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenDigest: () => void;
  isParentMode: boolean;
  toggleParentMode: () => void;
  lang: 'en' | 'hi';
  toggleLanguage: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  profile,
  currentUser,
  notifications,
  unreadAlertCount,
  onMarkAlertRead,
  onMarkAllAlertsRead,
  onSelectOpportunity,
  onOpenAuth,
  onOpenProfile,
  onOpenDigest,
  isParentMode,
  toggleParentMode,
  lang,
  toggleLanguage,
  isDarkMode,
  toggleDarkMode
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen]);

  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-6 py-3 flex items-center justify-between gap-4 transition-colors duration-200">
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
          className="w-full pl-11 pr-4 py-2 bg-[#f3f4f8] dark:bg-slate-800/80 hover:bg-[#ebedf3] dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-full border border-transparent focus:border-[#5034df] focus:ring-2 focus:ring-[#5034df]/20 outline-none transition-all shadow-2xs"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Language Switcher */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="cursor-pointer px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
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
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
          title={lang === 'hi' ? 'परिवार व अभिभावक मार्गदर्शन मोड' : 'Family & Parent Guidance Mode'}
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
          className="cursor-pointer px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 text-xs font-semibold flex items-center gap-1.5 transition"
          title="WhatsApp & Email Action Digest"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden lg:inline">
            {lang === 'hi' ? 'डाइजेस्ट' : 'Weekly Digest'}
          </span>
        </button>

        {/* Light & Dark Mode Toggle Switch Button (Switches ON / OFF dark mode) */}
        <button
          type="button"
          role="switch"
          aria-checked={isDarkMode}
          onClick={toggleDarkMode}
          className={`cursor-pointer relative inline-flex h-7 w-[54px] shrink-0 items-center rounded-full border transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5034df] focus-visible:ring-offset-2 ${
            isDarkMode
              ? 'bg-[#181f38] border-indigo-500/60 shadow-inner'
              : 'bg-amber-100/90 border-amber-300/80 shadow-xs'
          }`}
          title={
            isDarkMode
              ? (lang === 'hi' ? 'डार्क मोड बंद करें (लाइट मोड चालू करें)' : 'Switch Dark Mode OFF')
              : (lang === 'hi' ? 'डार्क मोड चालू करें' : 'Switch Dark Mode ON')
          }
          aria-label={isDarkMode ? 'Switch Dark Mode OFF' : 'Switch Dark Mode ON'}
        >
          {/* Ambient Background Icons inside the track */}
          <span className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none select-none">
            <Sun className={`w-3 h-3 transition-opacity duration-200 ${isDarkMode ? 'opacity-35 text-amber-300' : 'opacity-0'}`} />
            <Moon className={`w-3 h-3 transition-opacity duration-200 ${isDarkMode ? 'opacity-0' : 'opacity-35 text-slate-500'}`} />
          </span>

          {/* Sliding Knob with Active Mode Icon */}
          <span
            className={`pointer-events-none flex h-[22px] w-[22px] items-center justify-center rounded-full shadow-md transition-transform duration-300 ease-in-out ${
              isDarkMode
                ? 'translate-x-[26px] bg-slate-900 border border-indigo-400/50'
                : 'translate-x-[3px] bg-white border border-amber-200'
            }`}
          >
            {isDarkMode ? (
              <Moon className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/30 transition-transform duration-300 rotate-0" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-400/30 transition-transform duration-300 rotate-0" />
            )}
          </span>
        </button>

        {/* Notification Bell & Dropdown Popover */}
        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`cursor-pointer p-2 rounded-full transition relative ${
              isNotificationsOpen
                ? 'bg-[#ece8ff] dark:bg-[#5034df]/30 text-[#5034df] dark:text-[#c4b5fd]'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Official Notice & Deadline Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center px-1 shadow-xs ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
              </span>
            )}
          </button>

          {/* Interactive Popover Dropdown */}
          <NotificationPopover
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            notifications={notifications}
            onMarkRead={onMarkAlertRead}
            onMarkAllRead={onMarkAllAlertsRead}
            currentUser={currentUser}
            onSelectOpportunity={onSelectOpportunity}
            lang={lang}
          />
        </div>

        {/* User Account / Profile Pill (matching screenshot) */}
        {currentUser ? (
          <button
            type="button"
            onClick={onOpenProfile}
            className="cursor-pointer flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-[#f3f4f8] dark:bg-slate-800/80 hover:bg-[#ebedf3] dark:hover:bg-slate-800 transition-all text-left border border-transparent dark:border-slate-700/60"
          >
            <div className="w-8 h-8 rounded-full bg-[#ede9fe] dark:bg-[#5034df]/30 text-[#5034df] dark:text-[#c4b5fd] font-bold text-xs flex items-center justify-center">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight flex items-center gap-1">
                <span>{formatStudentName(currentUser.name.split(' ')[0], lang)}</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">
                {lang === 'hi' ? 'छात्र खाता' : 'Student account'}
              </div>
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenProfile}
              className="cursor-pointer flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-[#f3f4f8] dark:bg-slate-800/80 hover:bg-[#ebedf3] dark:hover:bg-slate-800 transition-all text-left border border-transparent dark:border-slate-700/60"
            >
              <div className="w-8 h-8 rounded-full bg-[#ede9fe] dark:bg-[#5034df]/30 text-[#5034df] dark:text-[#c4b5fd] font-bold text-xs flex items-center justify-center">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {formatStudentName(profile.fullName.split(' ')[0], lang)}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">
                  {lang === 'hi' ? 'छात्र खाता' : 'Student account'}
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
