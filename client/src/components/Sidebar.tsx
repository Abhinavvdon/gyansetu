import React from 'react';
import {
  User as UserIcon,
  Award,
  Landmark,
  GraduationCap,
  FileText,
  ShieldAlert,
  LogOut,
  Database,
  Sparkles,
  LogIn
} from 'lucide-react';
import type { User } from '../types';
import { formatStudentName } from '../utils/languageUtils';

export type MainNavTab =
  | 'Profile'
  | 'Scholarship'
  | 'Government Schemes'
  | 'Higher Studies'
  | 'Documents'
  | 'trust and scams'
  | 'logout'
  | 'home'
  | 'planner'
  | 'overlap'
  | 'whatif'
  | 'costs'
  | 'family';

interface SidebarProps {
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  onLogout: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  lang: 'en' | 'hi';
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
  currentUser,
  onOpenAuth,
  lang
}) => {
  // Exact 7 options in the exact order requested by user:
  // "Profile", "Scholarship", "Government Schemes", "Higher Studies", "Documents", "trust and scams", "logout"
  const navItems = [
    {
      id: 'Profile' as MainNavTab,
      label: 'Profile',
      labelHi: 'प्रोफ़ाइल',
      icon: UserIcon,
      badge: currentUser ? 'PostgreSQL' : undefined
    },
    {
      id: 'Scholarship' as MainNavTab,
      label: 'Scholarship',
      labelHi: 'छात्रवृत्ति',
      icon: Award,
      badge: lang === 'hi' ? 'मैच' : 'Matches'
    },
    {
      id: 'Government Schemes' as MainNavTab,
      label: 'Government Schemes',
      labelHi: 'सरकारी योजनाएं',
      icon: Landmark,
      badge: lang === 'hi' ? 'परीक्षाएं' : 'Exams'
    },
    {
      id: 'Higher Studies' as MainNavTab,
      label: 'Higher Studies',
      labelHi: 'उच्च शिक्षा',
      icon: GraduationCap,
      badge: lang === 'hi' ? 'प्रवेश' : 'Entrances'
    },
    {
      id: 'Documents' as MainNavTab,
      label: 'Documents',
      labelHi: 'दस्तावेज़',
      icon: FileText,
      badge: lang === 'hi' ? 'तैयारी' : 'Readiness'
    },
    {
      id: 'trust and scams' as MainNavTab,
      label: 'trust and scams',
      labelHi: 'सत्यापन व फ्रॉड अलर्ट',
      icon: ShieldAlert,
      badge: lang === 'hi' ? 'सत्यापित' : 'Verified'
    },
    {
      id: 'logout' as MainNavTab,
      label: 'logout',
      labelHi: 'लॉगआउट',
      icon: LogOut,
      isAction: true
    }
  ];

  const handleItemClick = (item: typeof navItems[0]) => {
    if (item.id === 'logout') {
      if (currentUser) {
        onLogout();
      } else {
        onOpenAuth();
      }
      return;
    }
    setActiveTab(item.id);
  };

  return (
    <aside aria-label="Sidebar Navigation" className="w-64 bg-white dark:bg-[#0f172a] border-r border-slate-200/90 dark:border-slate-800 flex flex-col shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto no-scrollbar z-30 select-none transition-colors duration-200">
      {/* Brand Header */}
      <div className="p-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div
          onClick={() => setActiveTab('home')}
          className="cursor-pointer flex items-center gap-3 group"
          title="GyanSetu Overview Dashboard"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#f5f3ff] dark:bg-[#5034df]/15 border border-[#ede9fe] dark:border-[#5034df]/30 flex items-center justify-center p-1.5 shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
            <img src="/logo-icon.png" alt="GyanSetu Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Gyan<span className="text-[#5034df] dark:text-[#a594fd]">Setu</span>
            </h1>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium tracking-tight">
              Your Future, Connected.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Options List */}
      <nav aria-label="Main Menu" className="p-3.5 space-y-1.5 flex-1">
        <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {lang === 'hi' ? 'मुख्य मेनू' : 'Main Menu'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isLogout = item.id === 'logout';

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item)}
              className={`cursor-pointer w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-[#ece8ff] dark:bg-[#5034df]/25 text-[#5034df] dark:text-[#c4b5fd] font-bold shadow-xs'
                  : isLogout
                  ? 'text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/70 dark:hover:bg-rose-950/30 mt-4'
                  : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#5034df] dark:text-[#c4b5fd]'
                      : isLogout
                      ? 'text-slate-500 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">
                  {lang === 'hi' ? item.labelHi : item.label}
                </span>
              </div>

              {item.badge && !isLogout && (
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight shrink-0 ${
                    isActive
                      ? 'bg-[#5034df] text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Database / Account Status Card at Bottom */}
      <div className="p-3.5 pt-0 border-t border-slate-100/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b0f19]/40">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#5034df] dark:text-[#a594fd]" />
              PostgreSQL 14
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Port 5434
            </span>
          </div>

          {currentUser ? (
            <div className="pt-1 text-[11px]">
              <div className="text-slate-800 dark:text-slate-100 font-bold truncate">
                {formatStudentName(currentUser.name, lang)}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{currentUser.email}</div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="cursor-pointer w-full py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-[#5034df] to-[#6d4cf5] hover:from-[#4429ce] hover:to-[#5e3be0] text-white text-[11px] font-bold shadow-xs flex items-center justify-center gap-1.5 transition"
            >
              <LogIn className="w-3 h-3" />
              <span>{lang === 'hi' ? 'साइन इन करें' : 'Sign In / Register'}</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
