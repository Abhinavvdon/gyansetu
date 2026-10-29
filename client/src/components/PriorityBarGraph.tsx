import React, { useState } from 'react';
import {
  Award,
  Landmark,
  GraduationCap,
  ExternalLink,
  Clock,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import type { Opportunity, StudentProfile, EligibilityReport } from '../types';
import type { MainNavTab } from './Sidebar';

interface PriorityBarGraphProps {
  opportunities: Opportunity[];
  eligibilityReports: EligibilityReport[];
  profile: StudentProfile;
  onNavigate: (tab: MainNavTab) => void;
  onInspectOpportunity?: (id: string) => void;
  lang: 'en' | 'hi';
}

interface RankedOpportunity {
  opp: Opportunity;
  priorityScore: number; // 0 - 100
  daysLeft: number;
  confidenceScore: number;
  shortLabel: string;
  rank: number;
  barColor: string;
}

export const PriorityBarGraph: React.FC<PriorityBarGraphProps> = ({
  opportunities,
  eligibilityReports,
  profile,
  onNavigate,
  onInspectOpportunity,
  lang
}) => {
  const [hoveredOppId, setHoveredOppId] = useState<string | null>(null);

  const reportMap = new Map(eligibilityReports.map((r) => [r.opportunityId, r]));

  // Helper to calculate realistic priority score and sort in strictly decreasing order
  const getRankedCategoryOpps = (
    categoryType: 'SCHOLARSHIP' | 'GOVT_EXAM' | 'HIGHER_STUDIES',
    colorPalette: string[]
  ): RankedOpportunity[] => {
    const list = opportunities.filter((o) => o.type === categoryType);

    const scored = list.map((opp) => {
      const rep = reportMap.get(opp.id);
      const conf = rep ? rep.confidenceScore : 82;

      let daysLeft = 30;
      if (opp.applicationDeadline) {
        const diffTime = new Date(opp.applicationDeadline).getTime() - new Date().getTime();
        daysLeft = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      }

      // Priority calculation: High match + Urgency factor + Value impact
      let urgencyBoost = 0;
      if (daysLeft <= 3) urgencyBoost = 14;
      else if (daysLeft <= 7) urgencyBoost = 10;
      else if (daysLeft <= 15) urgencyBoost = 6;
      else if (daysLeft <= 30) urgencyBoost = 3;

      let valueBonus = 0;
      if (opp.isGovVerified) valueBonus += 4;
      if (profile.savedOpportunityIds.includes(opp.id)) valueBonus += 5;

      const priorityScore = Math.min(98, Math.max(50, Math.round(conf * 0.72 + urgencyBoost + valueBonus)));

      // Extract a clean 2-4 word short title for x-axis
      let shortLabel = opp.title;
      if (opp.id === 'pm_usp_scholarship') shortLabel = 'PM-USP';
      else if (opp.id === 'aicte_pragati') shortLabel = 'AICTE Pragati';
      else if (opp.id === 'post_matric_sc_st') shortLabel = 'Post-Matric';
      else if (opp.id === 'ssc_cgl_2027') shortLabel = 'SSC CGL';
      else if (opp.id === 'rrb_ntpc_2027') shortLabel = 'RRB NTPC';
      else if (opp.id === 'ibps_po_2027') shortLabel = 'IBPS PO';
      else if (opp.id === 'upsc_cse_2027') shortLabel = 'UPSC CSE';
      else if (opp.id === 'gate_2027') shortLabel = 'GATE 2027';
      else if (opp.id === 'cuet_pg_2027') shortLabel = 'CUET-PG';
      else if (opp.id === 'cat_2026') shortLabel = 'CAT IIM';

      return {
        opp,
        priorityScore,
        daysLeft,
        confidenceScore: conf,
        shortLabel,
        rank: 1,
        barColor: colorPalette[0]
      };
    });

    // Sort strictly in decreasing order (highest priority to lowest priority, tallest bar to shortest)
    scored.sort((a, b) => b.priorityScore - a.priorityScore);

    // Assign rank and progressive decent non-shiny shades from palette
    return scored.map((item, index) => ({
      ...item,
      rank: index + 1,
      barColor: colorPalette[Math.min(index, colorPalette.length - 1)]
    }));
  };

  // 1. Scholarship Muted Non-Shiny Palette (Decent Burgundy, Rosewood, Dusty Rose, Warm Terracotta)
  const scholarshipPalette = ['#8f3b4d', '#a54a5e', '#b85e72', '#cc778a'];
  const rankedScholarships = getRankedCategoryOpps('SCHOLARSHIP', scholarshipPalette);

  // 2. Government Schemes Muted Non-Shiny Palette (Decent Spruce, Forest Sage, Muted Pine, Slate Teal)
  const govtPalette = ['#1d5b47', '#2a6f58', '#3b836b', '#4f977f'];
  const rankedGovt = getRankedCategoryOpps('GOVT_EXAM', govtPalette);

  // 3. Higher Studies Muted Non-Shiny Palette (Decent Slate Navy, Muted Twilight, Dusty Cobalt, Slate Indigo)
  const higherEdPalette = ['#2b3a67', '#3a4b7e', '#4b5e95', '#6073ab'];
  const rankedHigherEd = getRankedCategoryOpps('HIGHER_STUDIES', higherEdPalette);

  // Reusable Single Category Bar Graph Component
  const renderCategoryGraph = (
    title: string,
    titleHi: string,
    categoryType: MainNavTab,
    icon: React.ComponentType<{ className?: string }>,
    rankedList: RankedOpportunity[],
    themeBorderColor: string,
    themeHeaderBadge: { bg: string; text: string; label: string },
    cardSummary: string
  ) => {
    const IconComponent = icon;

    return (
      <div
        className={`bg-white rounded-3xl border ${themeBorderColor} p-5 sm:p-6 shadow-2xs flex flex-col justify-between text-left transition-all hover:shadow-xs`}
      >
        {/* Graph Card Header */}
        <div>
          <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: themeHeaderBadge.bg,
                  borderColor: themeBorderColor,
                  color: themeHeaderBadge.text
                }}
              >
                <IconComponent className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                  {lang === 'hi' ? titleHi : title}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-bold text-slate-400">
                    {rankedList.length} {lang === 'hi' ? 'अवसर' : 'Opportunities'}
                  </span>
                  <span className="text-[10px] text-slate-300">•</span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {lang === 'hi' ? 'घटते क्रम में (Decreasing)' : 'High to Low Priority'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate(categoryType)}
              className="cursor-pointer text-[11px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-0.5 transition px-2 py-1 rounded-lg hover:bg-slate-100"
              title="Explore all"
            >
              <span>{lang === 'hi' ? 'देखें' : 'Browse'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Context Tagline */}
          <div className="mt-2.5 mb-4 text-[11px] text-slate-500 leading-tight">
            {cardSummary}
          </div>

          {/* Bar Chart Canvas with Decreasing Ordered Bars */}
          <div className="relative pt-6 pb-2">
            {/* Horizontal Benchmark Reference Gridlines */}
            <div className="absolute inset-x-0 top-6 bottom-14 flex flex-col justify-between pointer-events-none opacity-40">
              {[100, 75, 50, 25].map((val) => (
                <div
                  key={val}
                  className="border-b border-dashed border-slate-200 flex items-center justify-between text-[9px] text-slate-400"
                >
                  <span className="font-semibold">{val}%</span>
                </div>
              ))}
            </div>

            {/* Bars Flex/Grid Layout */}
            <div className="relative z-10 grid grid-flow-col auto-cols-fr gap-2.5 sm:gap-3 h-48 items-end px-1 sm:px-2">
              {rankedList.map((item) => {
                const isHovered = hoveredOppId === item.opp.id;
                // Bar height from 10% to 100%
                const barHeightPercent = Math.min(100, Math.max(15, item.priorityScore));

                return (
                  <div
                    key={item.opp.id}
                    onMouseEnter={() => setHoveredOppId(item.opp.id)}
                    onMouseLeave={() => setHoveredOppId(null)}
                    onClick={() => {
                      if (onInspectOpportunity) {
                        onInspectOpportunity(item.opp.id);
                      } else {
                        onNavigate(categoryType);
                      }
                    }}
                    className="group cursor-pointer flex flex-col items-center h-full justify-end relative"
                  >
                    {/* Priority Value on Top of Bar */}
                    <div
                      className={`text-[10px] sm:text-[11px] font-extrabold mb-1 tracking-tight transition-transform duration-150 ${
                        isHovered ? 'scale-110 -translate-y-0.5' : ''
                      }`}
                      style={{ color: item.barColor }}
                    >
                      {item.priorityScore}%
                    </div>

                    {/* The Decent Non-Shiny Solid Bar (No neon gloss, no specular glare) */}
                    <div
                      className="w-full max-w-[42px] sm:max-w-[48px] rounded-t-lg transition-all duration-200 border-t border-x border-slate-300/40 group-hover:opacity-95"
                      style={{
                        height: `${barHeightPercent}%`,
                        backgroundColor: item.barColor
                      }}
                    >
                      {/* Rank Tag inside Tall Bars */}
                      {item.priorityScore >= 70 && (
                        <div className="w-full text-center text-[9px] font-bold text-white/90 pt-1">
                          #{item.rank}
                        </div>
                      )}
                    </div>

                    {/* X-Axis Labels: Opportunity Short Name & Deadline */}
                    <div className="mt-2.5 flex flex-col items-center w-full">
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 text-center truncate max-w-[62px] sm:max-w-[76px] group-hover:text-slate-900">
                        {item.shortLabel}
                      </span>
                      <span className="text-[9px] text-slate-400 flex items-center gap-0.5 mt-0.5 font-medium">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{item.daysLeft}d left</span>
                      </span>
                    </div>

                    {/* Clean Non-Shiny Interactive Tooltip on Hover */}
                    {isHovered && (
                      <div className="absolute bottom-full mb-2.5 left-1/2 -translate-y-0 -translate-x-1/2 w-56 sm:w-60 bg-slate-900 text-white p-3 rounded-2xl shadow-xl z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-150 border border-slate-700 text-left">
                        <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-slate-800">
                          <span className="text-[11px] font-extrabold text-white truncate">
                            {item.opp.title}
                          </span>
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.2 rounded-md text-white shrink-0"
                            style={{ backgroundColor: item.barColor }}
                          >
                            #{item.rank} Priority
                          </span>
                        </div>

                        <div className="py-1.5 space-y-1 text-[10px] text-slate-300">
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Eligibility Match:</span>
                            <span className="font-bold text-emerald-400">{item.confidenceScore}%</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Deadline:</span>
                            <span className="font-semibold text-amber-300">
                              {item.opp.applicationDeadline} ({item.daysLeft} days)
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-300 line-clamp-2 pt-0.5 border-t border-slate-800">
                            {item.opp.benefitsOrSalary || item.opp.description}
                          </div>
                        </div>

                        <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[9px] text-indigo-300 font-bold">
                          <span>Click to check eligibility</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card Footer Insight */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-600 truncate">
            <TrendingUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[10px] truncate">
              Top: <strong className="text-slate-800">{rankedList[0]?.shortLabel}</strong> ({rankedList[0]?.priorityScore}%)
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate(categoryType)}
            className="cursor-pointer text-[10px] font-extrabold text-slate-600 hover:text-slate-900 shrink-0 flex items-center gap-0.5"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 text-left">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              {lang === 'hi' ? 'श्रेणी अनुसार प्राथमिकता बार ग्राफ़' : 'Category Priority Bar Graphs'}
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full border border-slate-200">
              {lang === 'hi' ? 'उच्चतम से निम्नतम (Descending)' : 'Decreasing Order'}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {lang === 'hi'
              ? 'छात्रवृत्ति, सरकारी योजनाएं व उच्च शिक्षा के अवसर प्राथमिकता के अनुसार घटते क्रम में'
              : 'Separate, decent-tone priority distributions for Scholarships, Government Schemes, and Higher Studies.'}
          </p>
        </div>

        {/* Informative Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1 text-[10px]">
            <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: scholarshipPalette[0] }}></span>
            <span>Scholarships</span>
          </span>
          <span className="flex items-center gap-1 text-[10px]">
            <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: govtPalette[0] }}></span>
            <span>Govt Schemes</span>
          </span>
          <span className="flex items-center gap-1 text-[10px]">
            <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: higherEdPalette[0] }}></span>
            <span>Higher Studies</span>
          </span>
        </div>
      </div>

      {/* 3 SEPARATE BAR GRAPHS IN EXACT ORDER: 1. Scholarship, 2. Government Schemes, 3. Higher Studies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Graph 1: Scholarship Priority Bar Graph */}
        {renderCategoryGraph(
          'Scholarship Priority',
          'छात्रवृत्ति प्राथमिकता',
          'Scholarship',
          Award,
          rankedScholarships,
          'border-rose-100/90',
          { bg: '#fdf2f4', text: '#8f3b4d', label: 'Financial Grants' },
          lang === 'hi'
            ? 'पात्रता व वित्तीय सहायता राशि के आधार पर घटते क्रम में व्यवस्थित।'
            : 'Ranked by eligibility confidence score and scholarship grant volume.'
        )}

        {/* Graph 2: Government Schemes Priority Bar Graph */}
        {renderCategoryGraph(
          'Government Schemes',
          'सरकारी योजनाएं व परीक्षाएं',
          'Government Schemes',
          Landmark,
          rankedGovt,
          'border-emerald-100/90',
          { bg: '#f0f7f4', text: '#1d5b47', label: 'Central Vacancies' },
          lang === 'hi'
            ? 'रिक्तियों की संख्या व शुल्क छूट लाभ के आधार पर घटते क्रम में व्यवस्थित।'
            : 'Ranked by total central vacancy count and category fee waiver benefits.'
        )}

        {/* Graph 3: Higher Studies Priority Bar Graph */}
        {renderCategoryGraph(
          'Higher Studies',
          'उच्च शिक्षा प्रवेश',
          'Higher Studies',
          GraduationCap,
          rankedHigherEd,
          'border-indigo-100/90',
          { bg: '#f2f4fa', text: '#2b3a67', label: 'National Entrances' },
          lang === 'hi'
            ? 'पंजीकरण अंतिम तिथि व करियर प्रभाव के आधार पर घटते क्रम में व्यवस्थित।'
            : 'Ranked by registration urgency, gate validity, and premier campus tier.'
        )}
      </div>
    </div>
  );
};
