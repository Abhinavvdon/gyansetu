import React from 'react';
import {
  Sparkles,
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
  ChevronRight
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
  lang: 'en' | 'hi';
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  opportunities,
  eligibilityReports,
  profile,
  currentUser,
  onNavigate,
  onToggleSave,
  onInspectOpportunity,
  lang
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
    : profile.fullName
    ? profile.fullName.split(' ')[0]
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1b1154] via-[#33209c] to-[#5940e2] text-white p-7 sm:p-9 shadow-lg shadow-[#33209c]/15">
        {/* Decorative background circles */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-20">
          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/30"></div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-white/20"></div>
          <div className="absolute right-20 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-indigo-400/30 blur-2xl"></div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-indigo-200/90">
              {lang === 'hi' ? 'आपका भविष्य, अब आपके हाथ में' : 'YOUR NEXT CHAPTER STARTS HERE'}
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <span>{getGreeting()}, {studentName}!</span>
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </h2>

            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed font-normal">
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
              <div className="text-sm font-semibold text-indigo-200 leading-tight">
                {lang === 'hi' ? 'सही योजना बनाएं।' : 'Plan smart.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Your Opportunity Overview (4 Pastel Cards matching screenshot) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              {lang === 'hi' ? 'आपके अवसरों की रूपरेखा' : 'Your opportunity overview'}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {lang === 'hi'
                ? 'आपकी योग्यता और प्रोफ़ाइल के आधार पर एक समग्र दृष्टिकोण।'
                : 'A smarter view of what is possible for you.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('Scholarship')}
            className="cursor-pointer text-xs font-bold text-[#5034df] hover:text-[#3e23c7] flex items-center gap-1 group"
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
            className="cursor-pointer p-5 rounded-2xl bg-[#fff1f2] border border-[#ffe4e6] hover:border-rose-200 hover:shadow-xs transition-all space-y-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-600">
                {lang === 'hi' ? 'छात्रवृत्तियां' : 'Scholarships'}
              </div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {scholarshipCount}
              </div>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {lang === 'hi' ? 'वित्तीय सहायता देखें' : 'Explore financial support'}
            </div>
          </div>

          {/* Card 2: Government exams (Soft Mint Pastel) */}
          <div
            onClick={() => onNavigate('Government Schemes')}
            className="cursor-pointer p-5 rounded-2xl bg-[#f0fdf4] border border-[#dcfce7] hover:border-emerald-200 hover:shadow-xs transition-all space-y-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-600">
                {lang === 'hi' ? 'सरकारी परीक्षाएं व योजनाएं' : 'Government exams'}
              </div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {govtExamsCount}
              </div>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {lang === 'hi' ? 'अपने भविष्य की तैयारी करें' : 'Prepare for your future'}
            </div>
          </div>

          {/* Card 3: Higher studies (Soft Lavender Pastel) */}
          <div
            onClick={() => onNavigate('Higher Studies')}
            className="cursor-pointer p-5 rounded-2xl bg-[#f5f3ff] border border-[#ede9fe] hover:border-purple-200 hover:shadow-xs transition-all space-y-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-[#5034df]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-600">
                {lang === 'hi' ? 'उच्च शिक्षा प्रवेश' : 'Higher studies'}
              </div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {higherStudiesCount}
              </div>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {lang === 'hi' ? 'अपना पसंदीदा कैंपस चुनें' : 'Find your next campus'}
            </div>
          </div>

          {/* Card 4: Internships / Smart Overlap (Soft Blue Pastel) */}
          <div
            onClick={() => onNavigate('Documents')}
            className="cursor-pointer p-5 rounded-2xl bg-[#f0f9ff] border border-[#e0f2fe] hover:border-sky-200 hover:shadow-xs transition-all space-y-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-600">
                {lang === 'hi' ? 'दस्तावेज़ व तैयारी' : 'Documents & Internships'}
              </div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                100%
              </div>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
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
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              {lang === 'hi' ? 'आपके लिए अनुशंसित' : 'Recommended for you'}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {lang === 'hi' ? 'पात्रता और समय-सीमा के अनुसार चुनिंदा अवसर' : 'Sample opportunities to explore based on your profile'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 sm:gap-5">
            {recommendedOpps.map((opp) => {
              const rep = reportMap.get(opp.id);
              const isSaved = profile.savedOpportunityIds.includes(opp.id);
              const confidenceScore = rep ? rep.confidenceScore : 85;

              return (
                <div
                  key={opp.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-5.5 hover:shadow-md hover:border-[#5034df]/50 transition-all flex flex-col justify-between space-y-4 relative group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          opp.type === 'SCHOLARSHIP'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : opp.type === 'GOVT_EXAM'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-purple-50 text-[#5034df] border border-purple-200'
                        }`}
                      >
                        {opp.type === 'SCHOLARSHIP'
                          ? 'Scholarships'
                          : opp.type === 'GOVT_EXAM'
                          ? 'Govt Schemes'
                          : 'Higher Studies'}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#5034df] bg-[#ece8ff] px-2 py-0.5 rounded-md">
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
                              ? 'text-amber-600 bg-amber-50'
                              : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                          title={isSaved ? 'Saved in Planner' : 'Save opportunity'}
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#5034df] transition line-clamp-2 leading-snug">
                        {opp.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-1">
                        {opp.organization}
                      </p>
                    </div>

                    {opp.benefitsOrSalary && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-700">
                        <span className="text-emerald-600 font-bold">●</span>
                        <span className="line-clamp-1">{opp.benefitsOrSalary}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span className="font-medium">{opp.applicationDeadline}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {lang === 'hi' ? 'अंतिम तिथि' : 'Deadline'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onInspectOpportunity(opp.id)}
                        className="cursor-pointer flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-[#ece8ff] text-slate-700 hover:text-[#5034df] font-bold text-xs transition text-center border border-slate-200/60 hover:border-[#5034df]/30"
                      >
                        {lang === 'hi' ? 'पात्रता जांचें' : 'Check Eligibility'}
                      </button>

                      <a
                        href={opp.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="cursor-pointer p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                        title="Open official portal"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Quick actions (4 cols) shifted downwards with matching outer header */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              {lang === 'hi' ? 'त्वरित कार्य' : 'Quick actions'}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {lang === 'hi' ? 'शुरुआत करने के लिए शॉर्टकट' : 'Shortcuts to get started fast'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-5.5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {lang === 'hi' ? 'प्लेटफॉर्म टूल्स' : 'Platform Tools'}
              </span>
              <span className="text-[10px] font-bold text-[#5034df] bg-[#ece8ff] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Get Started
              </span>
            </div>

            {/* Quick Action Buttons Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Action 1: Find matches */}
              <button
                type="button"
                onClick={() => onNavigate('Scholarship')}
                className="cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200/80 hover:border-[#5034df]/50 hover:bg-[#f6f4ff] transition group text-center space-y-1.5"
              >
                <div className="w-9 h-9 rounded-lg bg-[#f0edff] flex items-center justify-center text-[#5034df] group-hover:scale-105 transition-transform">
                  <Search className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 leading-tight">
                  {lang === 'hi' ? 'मैच खोजें' : 'Find matches'}
                </span>
              </button>

              {/* Action 2: Plan deadlines */}
              <button
                type="button"
                onClick={() => onNavigate('Documents')}
                className="cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200/80 hover:border-[#5034df]/50 hover:bg-[#f6f4ff] transition group text-center space-y-1.5"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 leading-tight">
                  {lang === 'hi' ? 'समय-सारिणी' : 'Plan deadlines'}
                </span>
              </button>

              {/* Action 3: What-if simulator */}
              <button
                type="button"
                onClick={() => onNavigate('Scholarship')}
                className="cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200/80 hover:border-[#5034df]/50 hover:bg-[#f6f4ff] transition group text-center space-y-1.5"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
                  <SlidersHorizontal className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 leading-tight">
                  {lang === 'hi' ? 'सिम्युलेटर' : 'What-if simulator'}
                </span>
              </button>
            </div>

            {/* Additional Feature Shortcuts */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <button
                type="button"
                onClick={() => onNavigate('Documents')}
                className="cursor-pointer w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'hi' ? 'दस्तावेज़ तत्परता जांचें' : 'Document Readiness Check'}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('trust and scams')}
                className="cursor-pointer w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#5034df]" />
                  <span>{lang === 'hi' ? 'सत्यापित नोटिस व फ्रॉड अलर्ट' : 'Verified Notice & Scam Radar'}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
