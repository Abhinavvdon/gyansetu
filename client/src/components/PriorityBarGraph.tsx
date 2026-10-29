import React, { useState } from 'react';
import {
  BarChart3,
  Award,
  Landmark,
  GraduationCap,
  FileCheck2,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Info,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import type { Opportunity, StudentProfile, EligibilityReport } from '../types';
import type { MainNavTab } from './Sidebar';

interface PriorityBarGraphProps {
  opportunities: Opportunity[];
  eligibilityReports: EligibilityReport[];
  profile: StudentProfile;
  onNavigate: (tab: MainNavTab) => void;
  lang: 'en' | 'hi';
}

type MetricMode = 'PRIORITY' | 'COUNT' | 'URGENCY';

interface ColumnData {
  id: string;
  tab: MainNavTab;
  label: string;
  labelHi: string;
  icon: React.ComponentType<{ className?: string }>;
  colorGradient: string;
  barColor: string;
  shadowColor: string;
  borderColor: string;
  bgPastel: string;
  textColor: string;
  priorityScore: number; // 0 - 100
  itemCount: number;
  urgencyScore: number; // 0 - 100
  priorityLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
  topItemTitle: string;
  keyReason: string;
  keyReasonHi: string;
  actionText: string;
}

export const PriorityBarGraph: React.FC<PriorityBarGraphProps> = ({
  opportunities,
  eligibilityReports,
  profile,
  onNavigate,
  lang
}) => {
  const [metricMode, setMetricMode] = useState<MetricMode>('PRIORITY');
  const [hoveredColumnId, setHoveredColumnId] = useState<string | null>(null);

  // Group opportunities
  const scholarships = opportunities.filter((o) => o.type === 'SCHOLARSHIP');
  const govtExams = opportunities.filter((o) => o.type === 'GOVT_EXAM');
  const higherStudies = opportunities.filter((o) => o.type === 'HIGHER_STUDIES');

  const reportMap = new Map(eligibilityReports.map((r) => [r.opportunityId, r]));

  // Calculate average confidence score per category
  const getAvgConfidence = (oppList: Opportunity[]) => {
    if (oppList.length === 0) return 75;
    const scores = oppList.map((o) => reportMap.get(o.id)?.confidenceScore ?? 80);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const avgScholarshipScore = getAvgConfidence(scholarships);
  const avgGovtScore = getAvgConfidence(govtExams);
  const avgHigherEdScore = getAvgConfidence(higherStudies);

  // Compute urgent opportunities (closing within 15 days)
  const urgentCount = opportunities.filter((o) => {
    if (!o.applicationDeadline) return false;
    const diffDays = Math.ceil(
      (new Date(o.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays >= 0 && diffDays <= 15;
  }).length;

  // Document readiness calculation
  const missingDocsCount = profile.documents?.filter((d) => !d.isUploaded).length || 2;
  const docReadinessScore = Math.max(
    40,
    100 - missingDocsCount * 18
  );

  // Priority formula: composite of match confidence + urgency factor
  const scholarshipPriority = Math.min(98, Math.round(avgScholarshipScore * 0.7 + 25));
  const govtPriority = Math.min(96, Math.round(avgGovtScore * 0.75 + 20));
  const higherEdPriority = Math.min(94, Math.round(avgHigherEdScore * 0.65 + 30)); // GATE/CUET closing soon
  const docPriority = 88; // Always critical due to procurement lead times
  const deadlinePriority = Math.min(99, Math.max(65, urgentCount * 22 + 45));
  const trustPriority = 82;

  // 6 Columns with DISTINCT colors
  const columns: ColumnData[] = [
    {
      id: 'scholarship',
      tab: 'Scholarship',
      label: 'Scholarships',
      labelHi: 'छात्रवृत्तियां (Scholarships)',
      icon: Award,
      barColor: '#f43f5e',
      colorGradient: 'from-rose-500 to-pink-500',
      shadowColor: 'rgba(244, 63, 94, 0.35)',
      borderColor: 'border-rose-300',
      bgPastel: 'bg-rose-50',
      textColor: 'text-rose-700',
      priorityScore: scholarshipPriority,
      itemCount: scholarships.length,
      urgencyScore: 82,
      priorityLevel: 'CRITICAL',
      topItemTitle: 'Reliance Foundation & Pragati Scheme',
      keyReason: 'Up to ₹2,00,000/yr financial support based on merit & category match.',
      keyReasonHi: 'मेधावी व श्रेणी के आधार पर प्रतिवर्ष ₹2 लाख तक की वित्तीय सहायता।',
      actionText: 'Explore Scholarships'
    },
    {
      id: 'govt',
      tab: 'Government Schemes',
      label: 'Govt Schemes',
      labelHi: 'सरकारी योजनाएं व परीक्षाएं',
      icon: Landmark,
      barColor: '#10b981',
      colorGradient: 'from-emerald-500 to-teal-500',
      shadowColor: 'rgba(16, 185, 129, 0.35)',
      borderColor: 'border-emerald-300',
      bgPastel: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      priorityScore: govtPriority,
      itemCount: govtExams.length,
      urgencyScore: 88,
      priorityLevel: 'HIGH',
      topItemTitle: 'SSC CGL & Railway NTPC 2026-27',
      keyReason: '17,727+ Central vacancies with 100% fee waiver for reserved categories.',
      keyReasonHi: '17,727+ केंद्रीय पदों की भर्तियां, आरक्षित वर्गों के लिए 100% शुल्क छूट।',
      actionText: 'View Govt Exams'
    },
    {
      id: 'higher_ed',
      tab: 'Higher Studies',
      label: 'Higher Studies',
      labelHi: 'उच्च शिक्षा (Entrance Exams)',
      icon: GraduationCap,
      barColor: '#6366f1',
      colorGradient: 'from-[#5034df] to-indigo-500',
      shadowColor: 'rgba(80, 52, 223, 0.35)',
      borderColor: 'border-indigo-300',
      bgPastel: 'bg-indigo-50',
      textColor: 'text-[#5034df]',
      priorityScore: higherEdPriority,
      itemCount: higherStudies.length,
      urgencyScore: 92,
      priorityLevel: 'CRITICAL',
      topItemTitle: 'GATE 2027 & CUET PG Entrances',
      keyReason: 'IIT Roorkee / IISc registrations closing soon. Crucial for M.Tech & PSU jobs.',
      keyReasonHi: 'IIT रुड़की/IISc गेट पंजीकरण जल्द समाप्त। M.Tech व PSU नौकरियों हेतु अनिवार्य।',
      actionText: 'Inspect Entrances'
    },
    {
      id: 'documents',
      tab: 'Documents',
      label: 'Documents',
      labelHi: 'दस्तावेज़ तत्परता (Documents)',
      icon: FileCheck2,
      barColor: '#f59e0b',
      colorGradient: 'from-amber-500 to-orange-500',
      shadowColor: 'rgba(245, 158, 11, 0.35)',
      borderColor: 'border-amber-300',
      bgPastel: 'bg-amber-50',
      textColor: 'text-amber-700',
      priorityScore: docPriority,
      itemCount: missingDocsCount,
      urgencyScore: 85,
      priorityLevel: 'HIGH',
      topItemTitle: 'Income & Domicile Certificates',
      keyReason: 'Paperwork takes 10-14 days at Tehsildar office. Arrange early to avoid deadline lockouts.',
      keyReasonHi: 'आय व मूल निवास प्रमाण पत्र बनने में 10-14 दिन लगते हैं। समय से पहले बनवाएं।',
      actionText: 'Check Readiness'
    },
    {
      id: 'deadlines',
      tab: 'Documents',
      label: 'Urgent Deadlines',
      labelHi: 'समय-सीमा अलर्ट (Deadlines)',
      icon: Clock,
      barColor: '#ef4444',
      colorGradient: 'from-red-500 to-rose-600',
      shadowColor: 'rgba(239, 68, 68, 0.35)',
      borderColor: 'border-red-300',
      bgPastel: 'bg-red-50',
      textColor: 'text-red-700',
      priorityScore: deadlinePriority,
      itemCount: Math.max(1, urgentCount),
      urgencyScore: 98,
      priorityLevel: 'CRITICAL',
      topItemTitle: '3 Opportunities Closing < 14 Days',
      keyReason: 'Final application window closing soon. Complete fee payments and form upload.',
      keyReasonHi: 'अंतिम आवेदन खिड़की जल्द बंद हो रही है। तुरंत शुल्क भुगतान व फॉर्म पूरा करें।',
      actionText: 'Review Deadlines'
    },
    {
      id: 'trust',
      tab: 'trust and scams',
      label: 'Trust & Scams',
      labelHi: 'विश्वास व फ्रॉड रडार',
      icon: ShieldCheck,
      barColor: '#0ea5e9',
      colorGradient: 'from-sky-500 to-cyan-500',
      shadowColor: 'rgba(14, 165, 233, 0.35)',
      borderColor: 'border-sky-300',
      bgPastel: 'bg-sky-50',
      textColor: 'text-sky-700',
      priorityScore: trustPriority,
      itemCount: 14,
      urgencyScore: 70,
      priorityLevel: 'MODERATE',
      topItemTitle: '100% Verified Official Sources',
      keyReason: '12 Verified Gazette portals vs 2 Fake Scholarship circulars flagged.',
      keyReasonHi: '12 सत्यापित राजपत्र पोर्टल व 2 संदिग्ध फर्जी सूचनाएं पहचानी गईं।',
      actionText: 'View Scam Radar'
    }
  ];

  // Get active value for each column based on selected metric
  const getColumnValue = (col: ColumnData) => {
    switch (metricMode) {
      case 'PRIORITY':
        return col.priorityScore;
      case 'COUNT':
        return col.itemCount;
      case 'URGENCY':
        return col.urgencyScore;
    }
  };

  const getMaxValue = () => {
    if (metricMode === 'COUNT') {
      return Math.max(...columns.map((c) => c.itemCount), 10);
    }
    return 100; // Percentage scale
  };

  const maxValue = getMaxValue();

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6 text-left animate-in fade-in duration-300">
      {/* Top Header & Interactive Metric Switchers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1c1257] via-[#33209b] to-[#5940e2] text-white flex items-center justify-center shadow-xs">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{lang === 'hi' ? 'विशेषता प्राथमिकता बार ग्राफ़' : 'Feature Priority Bar Graph'}</span>
                <span className="text-[10px] bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                  AI Weighted
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {lang === 'hi'
                  ? 'छात्रवृत्ति, सरकारी योजनाओं व उच्च शिक्षा के लिए प्राथमिकता और तात्कालिकता विश्लेषण'
                  : 'Real-time priority distribution across scholarships, government schemes, and career tracks'}
              </p>
            </div>
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMetricMode('PRIORITY')}
            className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              metricMode === 'PRIORITY'
                ? 'bg-white text-[#1c1257] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#5034df]" />
            <span>{lang === 'hi' ? 'प्राथमिकता सूचकांक' : 'Priority Index'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMetricMode('URGENCY')}
            className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              metricMode === 'URGENCY'
                ? 'bg-white text-[#1c1257] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-rose-500" />
            <span>{lang === 'hi' ? 'तात्कालिकता (%)' : 'Urgency (%)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMetricMode('COUNT')}
            className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              metricMode === 'COUNT'
                ? 'bg-white text-[#1c1257] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === 'hi' ? 'कुल संख्या' : 'Item Count'}</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Highlight Pills */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wide">Top Scholarship</div>
            <div className="text-xs font-black text-slate-900 truncate">Reliance & Pragati</div>
            <div className="text-[10px] text-rose-600 font-semibold">{scholarshipPriority}% Priority Score</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0">
            <Landmark className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Govt Vacancies</div>
            <div className="text-xs font-black text-slate-900 truncate">SSC CGL 17,727+</div>
            <div className="text-[10px] text-emerald-600 font-semibold">{govtPriority}% Priority Score</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-[#5034df] font-bold shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide">Closing Soon</div>
            <div className="text-xs font-black text-slate-900 truncate">GATE 2027 (IIT)</div>
            <div className="text-[10px] text-[#5034df] font-semibold">{higherEdPriority}% Priority Score</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Paperwork Action</div>
            <div className="text-xs font-black text-slate-900 truncate">Income & Domicile</div>
            <div className="text-[10px] text-amber-600 font-semibold">{docPriority}% Urgent Focus</div>
          </div>
        </div>
      </div>

      {/* Main Bar Chart Canvas */}
      <div className="relative pt-6 pb-2">
        {/* Horizontal Gridlines */}
        <div className="absolute inset-x-0 top-6 bottom-16 flex flex-col justify-between pointer-events-none opacity-40">
          {[100, 75, 50, 25, 0].map((tick) => (
            <div key={tick} className="border-b border-dashed border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-semibold">{metricMode === 'COUNT' ? Math.round((tick / 100) * maxValue) : `${tick}%`}</span>
            </div>
          ))}
        </div>

        {/* Bar Columns Container */}
        <div className="relative z-10 grid grid-cols-6 gap-2 sm:gap-4 md:gap-6 h-64 items-end px-2 sm:px-4">
          {columns.map((col) => {
            const val = getColumnValue(col);
            const heightPercent = Math.min(100, Math.max(12, Math.round((val / maxValue) * 100)));
            const isHovered = hoveredColumnId === col.id;

            return (
              <div
                key={col.id}
                onMouseEnter={() => setHoveredColumnId(col.id)}
                onMouseLeave={() => setHoveredColumnId(null)}
                onClick={() => onNavigate(col.tab)}
                className="group cursor-pointer flex flex-col items-center h-full justify-end relative"
              >
                {/* Value Label on Top of Bar */}
                <div
                  className={`text-[11px] sm:text-xs font-black mb-1.5 transition-all duration-200 ${
                    isHovered ? 'scale-110 -translate-y-1' : ''
                  }`}
                  style={{ color: col.barColor }}
                >
                  {metricMode === 'COUNT' ? val : `${val}%`}
                </div>

                {/* The Animated Column Bar with Distinct Column Color */}
                <div
                  className="w-full max-w-[54px] sm:max-w-[64px] rounded-2xl relative overflow-hidden transition-all duration-300 group-hover:scale-105"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: col.barColor,
                    boxShadow: isHovered ? `0 10px 25px -3px ${col.shadowColor}` : 'none'
                  }}
                >
                  {/* Subtle Inner Highlight Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${col.colorGradient} opacity-90`}
                  />

                  {/* Top Gloss Edge */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-white/40 rounded-t-2xl" />

                  {/* Pulsing Dot on High Priority Bars */}
                  {col.priorityLevel === 'CRITICAL' && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  )}
                </div>

                {/* Column Base Label & Icon */}
                <div className="mt-3 flex flex-col items-center space-y-1">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl ${col.bgPastel} border ${col.borderColor} flex items-center justify-center transition-transform group-hover:scale-110`}
                    style={{ color: col.barColor }}
                  >
                    <col.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-700 text-center line-clamp-1 group-hover:text-slate-900">
                    {lang === 'hi' ? col.labelHi.split(' ')[0] : col.label}
                  </span>
                </div>

                {/* Interactive Tooltip Card on Hover */}
                {isHovered && (
                  <div
                    className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-150 border border-slate-700"
                  >
                    {/* Tooltip Header */}
                    <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-slate-800">
                      <span className="text-[11px] font-black text-white flex items-center gap-1">
                        <col.icon className="w-3.5 h-3.5" style={{ color: col.barColor }} />
                        <span>{lang === 'hi' ? col.labelHi : col.label}</span>
                      </span>
                      <span
                        className="text-[9px] font-black px-1.5 py-0.2 rounded-md uppercase tracking-wider text-white"
                        style={{ backgroundColor: col.barColor }}
                      >
                        {col.priorityLevel}
                      </span>
                    </div>

                    {/* Tooltip Metrics */}
                    <div className="py-2 space-y-1 text-[11px]">
                      <div className="text-slate-300 font-medium">
                        📌 <strong className="text-white">{col.topItemTitle}</strong>
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight">
                        {lang === 'hi' ? col.keyReasonHi : col.keyReason}
                      </div>
                    </div>

                    {/* Click prompt */}
                    <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-indigo-300 font-bold">
                      <span>Click to {col.actionText}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Insights Footer */}
      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Info className="w-4 h-4 text-[#5034df] shrink-0" />
          <span>
            {lang === 'hi'
              ? '💡 बार ग्राफ़ का कोई भी कॉलम दबाकर सीधे उस श्रेणी के अवसरों और योजनाओं पर जाएं।'
              : '💡 Click any colored column on the bar graph to navigate directly to that opportunity track.'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-semibold text-slate-500">Legend:</span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Scholarship</span>
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Govt</span>
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-[#5034df]">
            <span className="w-2 h-2 rounded-full bg-[#5034df]"></span>
            <span>Entrances</span>
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Docs</span>
          </span>
        </div>
      </div>
    </div>
  );
};
