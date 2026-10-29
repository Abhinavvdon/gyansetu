import React from 'react';
import {
  Compass,
  CheckCircle2,
  CalendarCheck,
  GitCompare,
  SlidersHorizontal,
  FileCheck2,
  ShieldAlert,
  Users,
  Sparkles,
  Bookmark,
  UserCheck,
  BellRing,
  LogIn,
  LogOut,
  Shield
} from 'lucide-react';
import type { StudentProfile, User } from '../types';

export type TabType =
  | 'discover'
  | 'matching'
  | 'planner'
  | 'overlap'
  | 'whatif'
  | 'documents'
  | 'timeline'
  | 'costs'
  | 'scam'
  | 'peers'
  | 'family';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  profile: StudentProfile;
  currentUser: User | null;
  onOpenProfile: () => void;
  onOpenDigest: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  isParentMode: boolean;
  toggleParentMode: () => void;
  lang: 'en' | 'hi';
  toggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  currentUser,
  onOpenProfile,
  onOpenDigest,
  onOpenAuth,
  onLogout,
  isParentMode,
  toggleParentMode,
  lang,
  toggleLanguage
}) => {
  const tabs = [
    { id: 'discover', labelEn: 'Discover', labelHi: 'खोजें', icon: Compass },
    { id: 'matching', labelEn: 'AI Eligibility', labelHi: 'पात्रता इंजन', icon: CheckCircle2, badge: 'Cross-Match' },
    { id: 'planner', labelEn: 'Smart Planner', labelHi: 'प्लानर', icon: CalendarCheck },
    { id: 'overlap', labelEn: 'Prep Overlap', labelHi: 'सिलेबस तालमेल', icon: GitCompare, badge: 'Save 140h' },
    { id: 'whatif', labelEn: 'What-If Lab', labelHi: 'सिम्युलेटर', icon: SlidersHorizontal },
    { id: 'documents', labelEn: 'Documents', labelHi: 'दस्तावेज़', icon: FileCheck2 },
    { id: 'timeline', labelEn: 'Future Timeline', labelHi: 'भविष्य रोडमैप', icon: Sparkles },
    { id: 'costs', labelEn: 'Fees & Clashes', labelHi: 'फीस व टकराव', icon: BellRing },
    { id: 'scam', labelEn: 'Trust & Scams', labelHi: 'सुरक्षा व सतर्कता', icon: ShieldAlert },
    { id: 'peers', labelEn: 'Peer Paths', labelHi: 'सफल साथी', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Top Banner for Parents / Trust Alert */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white px-4 py-1.5 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
            {lang === 'hi' ? 'सत्यापित पोर्टल' : 'Govt Verified Portal'}
          </span>
          <span className="truncate">
            {lang === 'hi'
              ? '🇮🇳 ज्ञानसेतु: सभी सरकारी छात्रवृत्ति, प्रवेश परीक्षा और जॉब नोटिफिकेशन आधिकारिक स्रोतों से सत्यापित हैं।'
              : '🇮🇳 GyanSetu: Official verification across Central & State Scholarships, Higher Ed Entrance & Govt Exams.'}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleParentMode}
            className={`cursor-pointer px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isParentMode
                ? 'bg-white text-amber-900 shadow-xs font-bold'
                : 'bg-black/20 hover:bg-black/30 text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'परिवार मोड' : 'Family Mode'}</span>
            {isParentMode && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
          </button>
          <button
            onClick={toggleLanguage}
            className="cursor-pointer bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-xs font-semibold"
          >
            {lang === 'en' ? 'हिन्दी (Hindi)' : 'English'}
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => setActiveTab('discover')}
              className="cursor-pointer flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <span className="text-xl font-black">🎓</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                    Gyan<span className="text-amber-600">Setu</span>
                  </h1>
                  <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold font-mono">
                    ज्ञानसेतु
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {lang === 'hi' ? 'पुल सपनों से सफलता का' : 'Bridge from Ambition to Opportunity'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Weekly Digest Trigger */}
            <button
              onClick={onOpenDigest}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors"
              title="Open WhatsApp & Email Action Digest"
            >
              <span className="text-sm">📲</span>
              <span className="hidden sm:inline">
                {lang === 'hi' ? 'साप्ताहिक डाइजेस्ट' : 'Weekly Digest'}
              </span>
            </button>

            {/* Saved Opportunities Badge */}
            <button
              onClick={() => setActiveTab('planner')}
              className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-semibold text-slate-900">
                {profile.savedOpportunityIds.length}
              </span>
              <span className="hidden sm:inline text-slate-500">
                {lang === 'hi' ? 'सेव्ड' : 'Saved'}
              </span>
            </button>

            {/* Authentication Button / User Profile */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-slate-100/90 pl-2 pr-1.5 py-1 rounded-full border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left text-xs leading-none">
                  <div className="font-bold text-slate-800 truncate max-w-[110px]">{currentUser.name}</div>
                  <div className="text-[9px] text-emerald-700 font-medium flex items-center gap-0.5 mt-0.5">
                    <Shield className="w-2.5 h-2.5 text-emerald-600" />
                    <span>PostgreSQL</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="cursor-pointer p-1 rounded-full hover:bg-slate-200 text-slate-500 hover:text-rose-600 transition-colors ml-1"
                  title={lang === 'hi' ? 'लॉगआउट करें' : 'Logout'}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold shadow-xs transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'लॉगिन / साइन-अप' : 'Sign In / Register'}</span>
                </button>
              </div>
            )}

            {/* Student Profile Quick View */}
            <button
              onClick={onOpenProfile}
              className="cursor-pointer flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-left"
              title="Edit Academic & Caste Profile"
            >
              <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {profile.fullName.charAt(0)}
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  <span>{profile.fullName.split(' ')[0]}</span>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-1 rounded font-normal">
                    {profile.category}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 truncate max-w-[110px]">
                  {profile.currentDegree}
                </div>
              </div>
              <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 overflow-x-auto py-2 no-scrollbar border-t border-slate-100 text-xs font-medium">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`cursor-pointer shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all relative ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs shadow-indigo-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{lang === 'hi' ? tab.labelHi : tab.labelEn}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-tight ${
                      isActive
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
