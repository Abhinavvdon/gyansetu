import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  ShieldCheck,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Bookmark,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import type { EligibilityReport, ConfidenceLevel, StudentProfile } from '../types';

interface EligibilityEngineViewProps {
  reports: EligibilityReport[];
  profile: StudentProfile;
  onToggleSave: (id: string) => void;
  onSwitchTab: (tab: any) => void;
  lang: 'en' | 'hi';
}

export const EligibilityEngineView: React.FC<EligibilityEngineViewProps> = ({
  reports,
  profile,
  onToggleSave,
  onSwitchTab,
  lang
}) => {
  const [selectedConfidence, setSelectedConfidence] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(reports[0]?.opportunityId || null);

  const filtered = reports.filter((r) => {
    if (selectedConfidence === 'ALL') return true;
    return r.confidenceLevel === selectedConfidence;
  });

  const getConfidenceBadge = (level: ConfidenceLevel, score: number) => {
    switch (level) {
      case 'ELIGIBLE':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          badgeBg: 'bg-emerald-600 text-white',
          icon: CheckCircle2,
          label: lang === 'hi' ? 'पूर्णतः पात्र (Eligible)' : '100% Eligible',
          desc: lang === 'hi' ? 'सभी मुख्य शर्तें पूरी हैं' : 'All Primary Criteria Satisfied'
        };
      case 'LIKELY_ELIGIBLE':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          badgeBg: 'bg-blue-600 text-white',
          icon: HelpCircle,
          label: lang === 'hi' ? 'संभावित पात्र (Likely Eligible)' : 'Likely Eligible',
          desc: lang === 'hi' ? 'दस्तावेज़ सत्यापन अपेक्षित' : 'Minor Document / Result Verification'
        };
      case 'NEEDS_VERIFICATION':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          badgeBg: 'bg-amber-700 text-white',
          icon: AlertTriangle,
          label: lang === 'hi' ? 'सत्यापन आवश्यक (Needs Verification)' : 'Needs Verification',
          desc: lang === 'hi' ? 'आय अथवा निवास प्रमाण जांचें' : 'Income / Domicile Check Needed'
        };
      case 'NOT_ELIGIBLE':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          badgeBg: 'bg-rose-700 text-white',
          icon: XCircle,
          label: lang === 'hi' ? 'अपात्र (Not Eligible)' : 'Not Eligible',
          desc: lang === 'hi' ? 'अंक या उम्र में अंतर' : 'Cutoff / Age Criteria Gap'
        };
    }
  };

  const eligibleCount = reports.filter(r => r.confidenceLevel === 'ELIGIBLE' || r.confidenceLevel === 'LIKELY_ELIGIBLE').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === 'hi' ? 'क्रॉस-अपॉर्चुनिटी पात्रता इंजन' : 'Cross-Opportunity Eligibility Engine'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {lang === 'hi'
              ? `${profile.fullName} के लिए AI पात्रता रिपोर्ट`
              : `AI Eligibility Report for ${profile.fullName}`}
          </h1>
          <p className="text-sm text-teal-100 mt-2 leading-relaxed">
            {lang === 'hi'
              ? 'एक ही प्रोफ़ाइल से छात्रवृत्ति, उच्च शिक्षा और सरकारी परीक्षाओं की पात्रता का पारदर्शी विश्लेषण, कारण और आधिकारिक लिंक सहित।'
              : 'Simultaneous eligibility evaluation across Scholarships, Higher Studies, and Govt Exams with verified explanations.'}
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shrink-0 text-center min-w-[200px]">
          <div className="text-3xl font-black text-amber-300">{eligibleCount} / {reports.length}</div>
          <div className="text-xs text-emerald-100 font-semibold mt-1">
            {lang === 'hi' ? 'अवसरों के लिए पात्र / संभावित' : 'Eligible or Likely Eligible'}
          </div>
          <button
            onClick={() => onSwitchTab('whatif')}
            className="cursor-pointer mt-3 w-full py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-xs"
          >
            {lang === 'hi' ? 'What-If लैब में देखें →' : 'Simulate in What-If →'}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
        {[
          { id: 'ALL', labelEn: 'All Matches', labelHi: 'सभी परिणाम' },
          { id: 'ELIGIBLE', labelEn: '✓ 100% Eligible', labelHi: '✓ पूर्णतः पात्र' },
          { id: 'LIKELY_ELIGIBLE', labelEn: 'ℹ Likely Eligible', labelHi: 'ℹ संभावित पात्र' },
          { id: 'NEEDS_VERIFICATION', labelEn: '⚠ Needs Verification', labelHi: '⚠ सत्यापन जरूरी' },
          { id: 'NOT_ELIGIBLE', labelEn: '✕ Not Eligible', labelHi: '✕ अपात्र' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedConfidence(tab.id)}
            className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedConfidence === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {lang === 'hi' ? tab.labelHi : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Report Cards List */}
      <div className="space-y-4">
        {filtered.map((report) => {
          const badge = getConfidenceBadge(report.confidenceLevel, report.confidenceScore);
          const isExpanded = expandedId === report.opportunityId;
          const isSaved = profile.savedOpportunityIds.includes(report.opportunityId);

          return (
            <div
              key={report.opportunityId}
              className={`bg-white rounded-2xl border transition-all ${
                isExpanded ? 'border-indigo-400 shadow-card' : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Card Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : report.opportunityId)}
                className="cursor-pointer p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${badge.bg}`}>
                    <badge.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${badge.badgeBg}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs text-slate-600 font-mono">
                        Score: <strong>{report.confidenceScore}%</strong>
                      </span>
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded font-semibold border border-emerald-100">
                        {report.feeConcessionStatus}
                      </span>
                    </div>

                    <h2 className="font-bold text-slate-900 text-base mt-1.5">
                      {report.opportunityTitle}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span>Deadline: <strong>{report.daysRemainingToDeadline} days remaining</strong></span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Verified: {report.lastVerifiedDate}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(report.opportunityId);
                    }}
                    className={`cursor-pointer p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isSaved
                        ? 'bg-amber-700 border-amber-800 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-amber-700'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>

                  <div className="p-2 text-slate-500 hover:text-slate-800">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Detailed Breakdown */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 text-xs animate-in fade-in duration-200">
                  {/* Why you qualify */}
                  {report.reasonsWhyQualified.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                      <h3 className="font-bold text-emerald-900 flex items-center gap-1.5 mb-2 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{lang === 'hi' ? 'आप क्यों पात्र हैं (Why You Qualify):' : 'Why You Qualify:'}</span>
                      </h3>
                      <ul className="space-y-1.5 text-slate-700 pl-5 list-disc">
                        {report.reasonsWhyQualified.map((reason, idx) => (
                          <li key={idx} className="leading-relaxed">{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Missing Criteria or Next Actions */}
                  {report.missingCriteria.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
                      <h3 className="font-bold text-amber-900 flex items-center gap-1.5 mb-2 text-xs">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>{lang === 'hi' ? 'अपेक्षित शर्तें अथवा छूटे हुए बिंदु (Missing / Verification Criteria):' : 'Missing Criteria / Attention Required:'}</span>
                      </h3>
                      <ul className="space-y-1.5 text-slate-700 pl-5 list-disc">
                        {report.missingCriteria.map((item, idx) => (
                          <li key={idx} className="leading-relaxed">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Relaxations Applied */}
                  {report.appliedRelaxations.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/80">
                      <h3 className="font-bold text-purple-900 flex items-center gap-1.5 mb-2 text-xs">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span>{lang === 'hi' ? 'लागू विशेष छूटें (Relaxations Applied):' : 'Social / Category Relaxations Applied:'}</span>
                      </h3>
                      <ul className="space-y-1 text-slate-700 pl-5 list-disc">
                        {report.appliedRelaxations.map((rel, idx) => (
                          <li key={idx} className="leading-relaxed">{rel}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions & Official Links */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <a
                        href={report.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'आधिकारिक पोर्टल पर जाएं' : 'Apply on Official Portal'}</span>
                      </a>

                      {report.officialPdfNotificationUrl && (
                        <a
                          href={report.officialPdfNotificationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>Official Gazette PDF</span>
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => onSwitchTab('gap')}
                      className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
                    >
                      <span>{lang === 'hi' ? 'गैप विश्लेषण व विकल्प देखें' : 'View Gap Analysis & Alternatives'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
