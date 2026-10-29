import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  ExternalLink,
  FileText,
  Bookmark,
  Calendar,
  IndianRupee,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Award
} from 'lucide-react';
import type { Opportunity, OpportunityType, StudentProfile } from '../types';

interface DiscoveryViewProps {
  opportunities: Opportunity[];
  profile: StudentProfile;
  onToggleSave: (id: string) => void;
  onInspectEligibility: (id: string) => void;
  lang: 'en' | 'hi';
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  opportunities,
  profile,
  onToggleSave,
  onInspectEligibility,
  lang
}) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('All India');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = opportunities.filter((opp) => {
    if (selectedType !== 'ALL' && opp.type !== selectedType) return false;
    if (selectedState !== 'All India' && !opp.eligibleStates.includes('All India') && !opp.eligibleStates.includes(selectedState)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        opp.title.toLowerCase().includes(q) ||
        opp.organization.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getTypeStyle = (type: OpportunityType) => {
    switch (type) {
      case 'SCHOLARSHIP':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          badge: 'bg-emerald-600 text-white',
          icon: Award,
          label: lang === 'hi' ? 'छात्रवृत्ति (Scholarship)' : 'Scholarship'
        };
      case 'GOVT_EXAM':
        return {
          bg: 'bg-orange-50 text-orange-900 border-orange-200',
          badge: 'bg-orange-600 text-white',
          icon: Briefcase,
          label: lang === 'hi' ? 'सरकारी परीक्षा (Govt Exam)' : 'Govt Exam'
        };
      case 'HIGHER_STUDIES':
        return {
          bg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
          badge: 'bg-indigo-600 text-white',
          icon: GraduationCap,
          label: lang === 'hi' ? 'उच्च अध्ययन (Higher Studies)' : 'Higher Studies'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Filter Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-soft relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <ShieldCheck className="w-4 h-4" />
            <span>
              {lang === 'hi'
                ? '१००% आधिकारिक एवं सत्यापित सरकारी सूचनाएं'
                : 'Official Verified Opportunities & Direct Portals'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {lang === 'hi'
              ? 'खोजें छात्रवृत्तियां, सरकारी नौकरियां व उच्च शिक्षा'
              : 'Discover Scholarships, Higher Studies & Govt Exams'}
          </h2>
          <p className="text-sm text-indigo-200 mt-2">
            {lang === 'hi'
              ? 'आधिकारिक स्रोतों से सत्यापित तिथियां, फॉर्म फीस में छूट, और आवेदन की अंतिम तारीख।'
              : 'Source-linked notifications with real-time verification dates, fee waivers, and eligibility breakdowns.'}
          </p>
        </div>

        {/* Search & Domicile Filter Row */}
        <div className="mt-6 pt-6 border-t border-indigo-700/60 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'परीक्षा या छात्रवृत्ति का नाम खोजें...' : 'Search exams, scholarships, agencies...'}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 rounded-xl text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-2.5 bg-white text-slate-900 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="All India">🇮🇳 All India (अखिल भारतीय)</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Bihar">Bihar</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pill Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {[
            { id: 'ALL', labelEn: 'All Opportunities', labelHi: 'सभी अवसर' },
            { id: 'SCHOLARSHIP', labelEn: 'Scholarships', labelHi: 'छात्रवृत्तियां' },
            { id: 'GOVT_EXAM', labelEn: 'Govt Exams', labelHi: 'सरकारी परीक्षाएं' },
            { id: 'HIGHER_STUDIES', labelEn: 'Higher Studies', labelHi: 'उच्च अध्ययन' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedType(cat.id)}
              className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedType === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lang === 'hi' ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          {lang === 'hi'
            ? `${filtered.length} अवसर उपलब्ध`
            : `Showing ${filtered.length} Opportunities`}
        </div>
      </div>

      {/* Grid of Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((opp) => {
          const style = getTypeStyle(opp.type);
          const Icon = style.icon;
          const isSaved = profile.savedOpportunityIds.includes(opp.id);

          return (
            <div
              key={opp.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-card transition-all flex flex-col justify-between group relative"
            >
              <div>
                {/* Header Badge & Save Bookmark */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${style.bg}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{style.label}</span>
                  </span>

                  <button
                    onClick={() => onToggleSave(opp.id)}
                    className={`cursor-pointer p-1.5 rounded-lg border transition-colors ${
                      isSaved
                        ? 'bg-amber-500 border-amber-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-300'
                    }`}
                    title={isSaved ? 'Saved to Planner' : 'Save to Planner'}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Title & Organization */}
                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors">
                  {opp.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
                  <span>🏛️</span>
                  <span className="truncate">{opp.organization}</span>
                </p>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {opp.description}
                </p>

                {/* Key Benefits / Salary */}
                <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold truncate">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{opp.benefitsOrSalary}</span>
                  </div>
                </div>

                {/* Deadline & Vacancies Info */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Last: <strong>{opp.applicationDeadline}</strong></span>
                  </div>
                  {opp.vacanciesOrSeats > 0 && (
                    <div className="text-right text-slate-500">
                      Seats: <strong className="text-slate-800">{opp.vacanciesOrSeats.toLocaleString()}</strong>
                    </div>
                  )}
                </div>

                {/* Verified Source Stamp */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified: {opp.lastVerifiedDate}</span>
                  </span>
                  <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                    {opp.officialUrl.replace('https://', '').split('/')[0]}
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onInspectEligibility(opp.id)}
                  className="cursor-pointer flex-1 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'पात्रता जांचें' : 'Check Eligibility'}</span>
                </button>

                <a
                  href={opp.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 bg-white"
                  title="Open Official Govt Portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                {opp.officialPdfNotificationUrl && (
                  <a
                    href={opp.officialPdfNotificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-200 bg-white"
                    title="Download Official PDF Notification"
                  >
                    <FileText className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
