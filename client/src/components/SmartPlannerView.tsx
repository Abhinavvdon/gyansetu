import React, { useState } from 'react';
import {
  CalendarCheck,
  Clock,
  Award,
  ArrowUpRight,
  TrendingUp,
  Bookmark,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import type { PlannedOpportunity, StudentProfile } from '../types';

interface SmartPlannerViewProps {
  plan: PlannedOpportunity[];
  profile: StudentProfile;
  onToggleSave: (id: string) => void;
  onSwitchTab: (tab: any) => void;
  lang: 'en' | 'hi';
}

export const SmartPlannerView: React.FC<SmartPlannerViewProps> = ({
  plan,
  profile,
  onToggleSave,
  onSwitchTab,
  lang
}) => {
  const [filterMode, setFilterMode] = useState<'ALL' | 'SAVED_ONLY'>('ALL');

  const displayedPlan = filterMode === 'SAVED_ONLY'
    ? plan.filter(p => profile.savedOpportunityIds.includes(p.opportunityId))
    : plan;

  const topPriorityCount = plan.filter(p => p.priorityBand.includes('TOP_PRIORITY')).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'स्मार्ट अवसर योजनाकार' : 'Smart Opportunity Planner & Priority Matrix'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {lang === 'hi' ? 'डेडलाइन, पात्रता व तैयारी समय का सही तालमेल' : 'Balance Deadlines, Eligibility & Preparation Effort'}
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            {lang === 'hi'
              ? 'एल्गोरिदम आपकी पात्रता, बची हुई समय-सीमा और तैयारी के महीनों का विश्लेषण करके अवसरों को शीर्ष प्राथमिकताओं में क्रमबद्ध करता है।'
              : 'Multi-factor priority ranking balancing application urgency, eligibility probability, and required syllabus prep time.'}
          </p>
        </div>

        <div className="flex gap-2 bg-white/10 p-1.5 rounded-xl border border-white/20 shrink-0">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'ALL' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-200 hover:text-white'
            }`}
          >
            {lang === 'hi' ? 'सभी अवसर' : 'All Opportunities'}
          </button>
          <button
            onClick={() => setFilterMode('SAVED_ONLY')}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'SAVED_ONLY' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-200 hover:text-white'
            }`}
          >
            {lang === 'hi' ? `सेव्ड सूची (${profile.savedOpportunityIds.length})` : `Saved Shortlist (${profile.savedOpportunityIds.length})`}
          </button>
        </div>
      </div>

      {/* Priority Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
            {topPriorityCount}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">{lang === 'hi' ? 'शीर्ष प्राथमिकता' : 'Top Priority Targets'}</div>
            <div className="text-[11px] text-slate-500">{lang === 'hi' ? 'तुरंत आवेदन / तैयारी शुरू करें' : 'Immediate Application Action'}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-lg">
            {plan.length - topPriorityCount}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">{lang === 'hi' ? 'द्वितीयक / बैकअप' : 'Secondary & Backup Targets'}</div>
            <div className="text-[11px] text-slate-500">{lang === 'hi' ? 'समय-सीमा पर नज़र रखें' : 'Keep tracking deadlines'}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-900">{lang === 'hi' ? 'दस्तावेज़ तैयारी' : 'Paperwork Check'}</div>
            <div className="text-[11px] text-slate-500">{lang === 'hi' ? 'तहसील / CSC प्रमाणपत्र' : 'Tehsil / CSC Lead Times'}</div>
          </div>
          <button
            onClick={() => onSwitchTab('documents')}
            className="cursor-pointer px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-lg border border-amber-200 transition-colors"
          >
            Check →
          </button>
        </div>
      </div>

      {/* Ranked Plan List */}
      <div className="space-y-4">
        {displayedPlan.map((item, index) => {
          const isTop = item.priorityBand.includes('TOP_PRIORITY');
          const isSecondary = item.priorityBand.includes('SECONDARY');

          return (
            <div
              key={item.opportunityId}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-xs hover:shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
                isTop
                  ? 'border-l-4 border-l-emerald-500 border-slate-200'
                  : isSecondary
                  ? 'border-l-4 border-l-indigo-500 border-slate-200'
                  : 'border-l-4 border-l-slate-300 border-slate-200'
              }`}
            >
              {/* Left Info */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-extrabold text-sm shrink-0 border border-slate-200">
                  #{index + 1}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-tight ${
                        isTop
                          ? 'bg-emerald-100 text-emerald-900'
                          : isSecondary
                          ? 'bg-indigo-100 text-indigo-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.priorityBand.split('(')[0].trim()}
                    </span>

                    <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-100">
                      Priority Score: <strong>{item.priorityScore}/100</strong>
                    </span>

                    <span className="text-xs text-slate-500">
                      Match: <strong className="text-indigo-600">{item.confidenceScore}%</strong>
                    </span>
                  </div>

                  <h2 className="font-bold text-slate-900 text-base mt-1.5">
                    {item.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1.5">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>Deadline: <strong>{item.applicationDeadline}</strong> ({item.daysRemaining} days left)</span>
                    </span>

                    <span className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Prep Horizon: <strong>{item.preparationTimeMonths} Months</strong></span>
                    </span>

                    <span className="text-slate-500 truncate max-w-xs">
                      {item.benefits}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right CTA */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => onToggleSave(item.opportunityId)}
                  className={`cursor-pointer p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    item.isSaved
                      ? 'bg-amber-700 border-amber-800 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-amber-700'
                  }`}
                  title={item.isSaved ? 'Saved in Plan' : 'Save to Plan'}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                  <span className="hidden sm:inline">{item.isSaved ? 'Saved' : 'Save'}</span>
                </button>

                <a
                  href={item.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Apply</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
