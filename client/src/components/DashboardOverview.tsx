import React from 'react';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Award,
  Landmark,
  GraduationCap,
  Briefcase,
  Search,
  Calendar,
  SlidersHorizontal,
  GitCompare,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Bookmark,
  Clock,
  ChevronRight,
  X
} from 'lucide-react';
import type { Opportunity, StudentProfile, EligibilityReport, User } from '../types';
import type { MainNavTab } from './Sidebar';
import { PriorityBarGraph } from './PriorityBarGraph';
import { formatStudentName } from '../utils/languageUtils';

interface DashboardOverviewProps {
  opportunities: Opportunity[];
  eligibilityReports: EligibilityReport[];
  profile: StudentProfile;
  currentUser: User | null;
  onNavigate: (tab: MainNavTab) => void;
  onToggleSave: (id: string) => void;
  onInspectOpportunity: (id: string) => void;
  onOpenAiModal?: () => void;
  lang: 'en' | 'hi';
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  opportunities,
  eligibilityReports,
  profile,
  currentUser,
  onNavigate,
  onToggleSave,
  onInspectOpportunity,
  onOpenAiModal,
  lang,
  searchQuery = '',
  onClearSearch
}) => {
  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return lang === 'hi' ? 'शुभ प्रभात' : 'Good morning';
    if (hour < 17) return lang === 'hi' ? 'शुभ दोपहर' : 'Good afternoon';
    return lang === 'hi' ? 'शुभ संध्या' : 'Good evening';
  };

  const rawStudentName = currentUser?.name
    ? currentUser.name.split(' ')[0]
    : 'Student';

  const studentName = formatStudentName(rawStudentName, lang);

  // Counts
  const scholarshipCount = opportunities.filter((o) => o.type === 'SCHOLARSHIP').length;
  const govtExamsCount = opportunities.filter((o) => o.type === 'GOVT_EXAM').length;
  const higherStudiesCount = opportunities.filter((o) => o.type === 'HIGHER_STUDIES').length;

  // Recommended opportunities (curated top matches across categories)
  const reportMap = new Map(eligibilityReports.map((r) => [r.opportunityId, r]));
  
  const topScholarship = opportunities.find((o) => o.id === 'reliance_foundation') || opportunities.find((o) => o.type === 'SCHOLARSHIP') || opportunities[0];
  const topGovt = opportunities.find((o) => o.id === 'ssc_cgl_2027') || opportunities.find((o) => o.type === 'GOVT_EXAM') || opportunities[1];
  const topHigherEd = opportunities.find((o) => o.id === 'gate_2027') || opportunities.find((o) => o.type === 'HIGHER_STUDIES') || opportunities[2];
  const secondScholarshipOrGovt = opportunities.find((o) => o.id === 'post_matric_sc') || opportunities.find((o) => o.id === 'rrb_ntpc_2027') || opportunities[3];

  const recommendedOpps = [topScholarship, topGovt, topHigherEd, secondScholarshipOrGovt].filter(Boolean);

  return (
    <div className="space-y-7 pb-10">
      {/* 1. Hero Purple Banner (matching screenshot) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#1b1154] via-[#33209c] to-[#5940e2] text-white p-5 sm:p-7 md:p-9 shadow-lg shadow-[#33209c]/15">
        {/* Decorative background circles */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-20">
          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/30"></div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-white/20"></div>
          <div className="absolute right-20 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-indigo-400/30 blur-2xl"></div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-white">
              {lang === 'hi' ? 'आपका भविष्य, अब आपके हाथ में' : 'YOUR NEXT CHAPTER STARTS HERE'}
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <span>{getGreeting()}, {studentName}!</span>
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </h1>

            <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-normal">
              {lang === 'hi'
                ? 'आपके लक्ष्यों को एक स्पष्ट मार्ग चाहिए। सही छात्रवृत्तियां, सरकारी परीक्षाएं और उच्च शिक्षा खोजें, पात्रता जांचें और समय पर आवेदन करें।'
                : 'Your goals deserve a clear path. Discover opportunities, understand eligibility, and plan your next move.'}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('Scholarship')}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-indigo-950 hover:bg-slate-100 text-xs font-bold transition shadow-md shadow-black/10 group"
              >
                <span>{lang === 'hi' ? 'अवसर खोजें' : 'Explore opportunities'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Hero Graphic */}
          <div className="hidden lg:flex items-center gap-4 pr-6 shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-3 shadow-inner">
              <img src="/logo-icon.png" alt="GyanSetu Symbol" className="w-full h-full object-contain filter drop-shadow brightness-125" />
            </div>
            <div className="text-left">
              <div className="text-base font-extrabold text-white tracking-tight leading-tight">
                {lang === 'hi' ? 'बड़ा सोचें।' : 'Dream big.'}
              </div>
              <div className="text-sm font-semibold text-white leading-tight">
                {lang === 'hi' ? 'सही योजना बनाएं।' : 'Plan smart.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1.5 Active Live Search Results (Prominently rendered when search bar is used) */}
      {searchQuery.trim().length > 0 && (
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl sm:rounded-3xl border-2 border-[#5034df]/30 p-4 sm:p-6 shadow-md space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f0edff] dark:bg-[#5034df]/20 text-[#5034df] dark:text-[#a594fd] flex items-center justify-center shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    {lang === 'hi' ? 'खोज परिणाम:' : 'Search results for:'}{' '}
                    <span className="text-[#5034df] dark:text-[#a594fd]">"{searchQuery}"</span>
                  </h2>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#ece8ff] dark:bg-[#5034df]/25 text-[#5034df] dark:text-[#c4b5fd]">
                    {opportunities.length} {lang === 'hi' ? 'अवसर मिले' : 'matching opportunities'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  {lang === 'hi'
                    ? 'नीचे दिए गए अवसरों की पात्रता जांचें या सीधे आधिकारिक पोर्टल खोलें।'
                    : 'Explore matching opportunities, evaluate eligibility, or jump to official portals.'}
                </p>
              </div>
            </div>

            {onClearSearch && (
              <button
                type="button"
                onClick={onClearSearch}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition self-start sm:self-auto shadow-2xs"
              >
                <X className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'खोज साफ़ करें' : 'Clear Search'}</span>
              </button>
            )}
          </div>

          {/* Results Grid */}
          {opportunities.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-sm font-bold text-slate-800 dark:text-white">
                {lang === 'hi'
                  ? `"${searchQuery}" के लिए कोई अवसर नहीं मिला।`
                  : `No opportunities matched "${searchQuery}".`}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'hi'
                  ? 'कृपया UPSC, Scholarship, GATE, या OBC जैसे शब्दों से पुनः प्रयास करें।'
                  : 'Try searching for scholarships, government exams, colleges, or reservation categories.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {opportunities.map((opp) => {
                const isSaved = profile.savedOpportunityIds.includes(opp.id);
                const isScholarship = opp.type === 'SCHOLARSHIP';
                const isGovt = opp.type === 'GOVT_EXAM';

                return (
                  <div
                    key={opp.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 hover:border-[#5034df]/50 transition-all flex flex-col justify-between space-y-3 group shadow-2xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            isScholarship
                              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                              : isGovt
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-purple-50 dark:bg-purple-950/40 text-[#5034df] dark:text-[#c4b5fd] border border-purple-200 dark:border-purple-800'
                          }`}
                        >
                          {isScholarship ? 'Scholarship' : isGovt ? 'Govt Exam' : 'Higher Studies'}
                        </span>

                        <button
                          type="button"
                          onClick={() => onToggleSave(opp.id)}
                          className={`cursor-pointer p-1.5 rounded-lg border transition ${
                            isSaved
                              ? 'bg-amber-600 border-amber-700 text-white'
                              : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 hover:text-amber-600'
                          }`}
                          title={isSaved ? 'Saved to Planner' : 'Save'}
                        >
                          <Bookmark className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>

                      <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug group-hover:text-[#5034df] dark:group-hover:text-[#a594fd] transition-colors">
                        {opp.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                        {opp.organization}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {opp.description}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-200/70 dark:border-slate-700/60 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 truncate max-w-[150px]">
                          {opp.benefitsOrSalary}
                        </span>
                        <span>
                          Deadline: <strong className="text-slate-800 dark:text-slate-200">{opp.applicationDeadline}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onInspectOpportunity(opp.id)}
                          className="cursor-pointer flex-1 py-1.5 px-3 rounded-xl bg-[#5034df] hover:bg-[#4025ca] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{lang === 'hi' ? 'पात्रता जांचें' : 'Check Eligibility'}</span>
                        </button>

                        <a
                          href={opp.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="cursor-pointer p-1.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-[#5034df] hover:border-[#5034df]/40 bg-white dark:bg-slate-700 transition"
                          title="Open Official Portal"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. Your Opportunity Overview (4 Pastel Cards matching screenshot) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              {lang === 'hi' ? 'आपके अवसरों की रूपरेखा' : 'Your opportunity overview'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {lang === 'hi'
                ? 'आपकी योग्यता और प्रोफ़ाइल के आधार पर एक समग्र दृष्टिकोण।'
                : 'A smarter view of what is possible for you.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('Scholarship')}
            className="cursor-pointer text-xs font-bold text-[#5034df] dark:text-[#a594fd] hover:text-[#3e23c7] flex items-center gap-1 group"
          >
            <span>{lang === 'hi' ? 'सभी देखें' : 'Browse all'}</span>
            <span className="text-[10px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Scholarships (Soft Pink Pastel) */}
          <div
            onClick={() => onNavigate('Scholarship')}
            className="cursor-pointer p-5 rounded-2xl bg-[#fff1f2] dark:bg-rose-950/20 border border-[#ffe4e6] dark:border-rose-900/40 hover:border-rose-200 dark:hover:border-rose-800 hover:shadow-xs transition-all space-y-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'hi' ? 'छात्रवृत्तियां' : 'Scholarships'}
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {scholarshipCount}
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              {lang === 'hi' ? 'वित्तीय सहायता देखें' : 'Explore financial support'}
            </div>
          </div>

          {/* Card 2: Government exams (Soft Mint Pastel) */}
          <div
            onClick={() => onNavigate('Government Schemes')}
            className="cursor-pointer p-5 rounded-2xl bg-[#f0fdf4] dark:bg-emerald-950/20 border border-[#dcfce7] dark:border-emerald-900/40 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-xs transition-all space-y-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'hi' ? 'सरकारी परीक्षाएं व योजनाएं' : 'Government exams'}
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {govtExamsCount}
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              {lang === 'hi' ? 'अपने भविष्य की तैयारी करें' : 'Prepare for your future'}
            </div>
          </div>

          {/* Card 3: Higher studies (Soft Lavender Pastel) */}
          <div
            onClick={() => onNavigate('Higher Studies')}
            className="cursor-pointer p-5 rounded-2xl bg-[#f5f3ff] dark:bg-purple-950/20 border border-[#ede9fe] dark:border-purple-900/40 hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-xs transition-all space-y-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-[#5034df] dark:text-[#a594fd]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'hi' ? 'उच्च शिक्षा प्रवेश' : 'Higher studies'}
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {higherStudiesCount}
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              {lang === 'hi' ? 'अपना पसंदीदा कैंपस चुनें' : 'Find your next campus'}
            </div>
          </div>

          {/* Card 4: Internships / Smart Overlap (Soft Blue Pastel) */}
          <div
            onClick={() => onNavigate('Documents')}
            className="cursor-pointer p-5 rounded-2xl bg-[#f0f9ff] dark:bg-sky-950/20 border border-[#e0f2fe] dark:border-sky-900/40 hover:border-sky-200 dark:hover:border-sky-800 hover:shadow-xs transition-all space-y-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-300">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'hi' ? 'दस्तावेज़ व तैयारी' : 'Documents & Internships'}
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                100%
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              {lang === 'hi' ? 'कागजात तैयार रखें' : 'Build real-world readiness'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Three Separate Priority Bar Graphs (1. Scholarship, 2. Govt Schemes, 3. Higher Studies) in Decreasing Order */}
      <PriorityBarGraph
        opportunities={opportunities}
        eligibilityReports={eligibilityReports}
        profile={profile}
        onNavigate={onNavigate}
        onInspectOpportunity={onInspectOpportunity}
        lang={lang}
      />

      {/* 4. Bottom Split Section: Recommended For You + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Recommended for you (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              {lang === 'hi' ? 'आपके लिए अनुशंसित' : 'Recommended for you'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {lang === 'hi' ? 'पात्रता और समय-सीमा के अनुसार चुनिंदा अवसर' : 'Sample opportunities to explore based on your profile'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 sm:gap-5">
            {recommendedOpps.length === 0 ? (
              <div className="sm:col-span-2 p-8 text-center bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-[#5034df] dark:text-[#a594fd] flex items-center justify-center mx-auto mb-3 border border-indigo-100 dark:border-indigo-900/50">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                  {lang === 'hi' ? 'कोई मेल खाने वाला अवसर नहीं मिला' : 'No matching opportunities found'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto mb-4 leading-relaxed font-medium">
                  {searchQuery
                    ? (lang === 'hi'
                        ? `"${searchQuery}" के लिए कोई अवसर नहीं मिला। छात्रवृत्ति, यूपीएससी, गेट या इंजीनियरिंग खोज कर देखें।`
                        : `No opportunities matched "${searchQuery}". Try searching for UPSC, GATE, OBC, or engineering.`)
                    : (lang === 'hi'
                        ? 'वर्तमान में कोई अवसर प्रदर्शित करने के लिए नहीं है।'
                        : 'No opportunities are currently available for this view.')}
                </p>
                {onClearSearch && (
                  <button
                    type="button"
                    onClick={onClearSearch}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5034df] hover:bg-[#3f25c7] text-white text-xs font-bold transition shadow-xs"
                  >
                    <span>{lang === 'hi' ? 'खोज साफ़ करें' : 'Clear search query'}</span>
                  </button>
                )}
              </div>
            ) : (
              recommendedOpps.map((opp) => {
                const rep = reportMap.get(opp.id);
                const isSaved = profile.savedOpportunityIds.includes(opp.id);
                const confidenceScore = rep ? rep.confidenceScore : 85;

                return (
                  <div
                    key={opp.id}
                    className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-5 sm:p-5.5 hover:shadow-md hover:border-[#5034df]/50 transition-all flex flex-col justify-between space-y-4 relative group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            opp.type === 'SCHOLARSHIP'
                              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                              : opp.type === 'GOVT_EXAM'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-purple-50 dark:bg-purple-950/40 text-[#5034df] dark:text-[#c4b5fd] border border-purple-200 dark:border-purple-800'
                          }`}
                        >
                          {opp.type === 'SCHOLARSHIP'
                            ? 'Scholarships'
                            : opp.type === 'GOVT_EXAM'
                            ? 'Govt Schemes'
                            : 'Higher Studies'}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#33209c] dark:text-[#c4b5fd] bg-[#ece8ff] dark:bg-[#5034df]/20 px-2 py-0.5 rounded-md">
                            {confidenceScore}% {lang === 'hi' ? 'मैच' : 'Match'}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleSave(opp.id);
                            }}
                            className={`cursor-pointer p-1.5 rounded-lg transition ${
                              isSaved
                                ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/50'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                            title={isSaved ? 'Saved in Planner' : 'Save opportunity'}
                          >
                            <Bookmark className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#5034df] dark:group-hover:text-[#a594fd] transition line-clamp-2 leading-snug">
                          {opp.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1 line-clamp-1">
                          {opp.organization}
                        </p>
                      </div>

                      {opp.benefitsOrSalary && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold">●</span>
                          <span className="line-clamp-1">{opp.benefitsOrSalary}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700/80">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span className="font-medium">{opp.applicationDeadline}</span>
                        </div>
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                          {lang === 'hi' ? 'अंतिम तिथि' : 'Deadline'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onInspectOpportunity(opp.id)}
                          className="cursor-pointer flex-1 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-700/60 hover:bg-[#ece8ff] dark:hover:bg-[#5034df]/30 text-slate-700 dark:text-slate-200 hover:text-[#5034df] dark:hover:text-[#c4b5fd] font-bold text-xs transition text-center border border-slate-200/60 dark:border-slate-600 hover:border-[#5034df]/30"
                        >
                          {lang === 'hi' ? 'पात्रता जांचें' : 'Check Eligibility'}
                        </button>

                        <a
                          href={opp.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="cursor-pointer p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition"
                          title="Open official portal"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Quick actions (4 cols) shifted downwards with matching outer header */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              {lang === 'hi' ? 'त्वरित कार्य' : 'Quick actions'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {lang === 'hi' ? 'शुरुआत करने के लिए शॉर्टकट' : 'Shortcuts to get started fast'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 sm:p-5.5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {lang === 'hi' ? 'प्लेटफॉर्म टूल्स' : 'Platform Tools'}
              </span>
              <span className="text-[10px] font-bold text-[#33209c] dark:text-[#c4b5fd] bg-[#ece8ff] dark:bg-[#5034df]/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Get Started
              </span>
            </div>

            {/* Quick Action Buttons Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {/* Action 1: Find matches */}
              <button
                type="button"
                onClick={() => onNavigate('Scholarship')}
                className="cursor-pointer flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 hover:border-[#5034df]/50 hover:bg-[#f6f4ff] dark:hover:bg-slate-700/40 transition group text-center space-y-1.5"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#f0edff] dark:bg-[#5034df]/20 flex items-center justify-center text-[#5034df] dark:text-[#c4b5fd] group-hover:scale-105 transition-transform">
                  <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">
                  {lang === 'hi' ? 'मैच खोजें' : 'Find matches'}
                </span>
              </button>

              {/* Action 2: Plan deadlines */}
              <button
                type="button"
                onClick={() => onNavigate('Documents')}
                className="cursor-pointer flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 hover:border-[#5034df]/50 hover:bg-[#f6f4ff] dark:hover:bg-slate-700/40 transition group text-center space-y-1.5"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                  <Calendar className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">
                  {lang === 'hi' ? 'समय-सारिणी' : 'Plan deadlines'}
                </span>
              </button>

              {/* Action 3: What-if simulator */}
              <button
                type="button"
                onClick={() => onNavigate('Scholarship')}
                className="cursor-pointer flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 hover:border-[#5034df]/50 hover:bg-[#f6f4ff] dark:hover:bg-slate-700/40 transition group text-center space-y-1.5"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                  <SlidersHorizontal className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">
                  {lang === 'hi' ? 'सिम्युलेटर' : 'What-if simulator'}
                </span>
              </button>
            </div>

            {/* Additional Feature Shortcuts */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-2.5">
              {onOpenAiModal && (
                <button
                  type="button"
                  onClick={onOpenAiModal}
                  className="cursor-pointer w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#ece8ff]/60 to-[#f5f3ff]/80 dark:from-[#5034df]/20 dark:to-slate-700/50 hover:bg-[#ece8ff] dark:hover:bg-[#5034df]/30 transition text-xs font-bold text-[#33209c] dark:text-[#c4b5fd] border border-[#5034df]/20 group"
                >
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform" />
                    <span>{lang === 'hi' ? 'Adaption AI डेटासेट आयात करें' : 'Import Adaption AI Datasets'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#33209c] dark:text-[#c4b5fd] group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              <button
                type="button"
                onClick={() => onNavigate('Documents')}
                className="cursor-pointer w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{lang === 'hi' ? 'दस्तावेज़ तत्परता जांचें' : 'Document Readiness Check'}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('trust and scams')}
                className="cursor-pointer w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#5034df] dark:text-[#a594fd]" />
                  <span>{lang === 'hi' ? 'सत्यापित नोटिस व फ्रॉड अलर्ट' : 'Verified Notice & Scam Radar'}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
