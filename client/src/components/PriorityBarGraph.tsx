import React, { useState } from 'react';
import {
  Award,
  Landmark,
  GraduationCap,
  ExternalLink,
  Clock,
  ArrowRight,
  TrendingDown,
  ChevronRight
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

interface RankedBarItem {
  id: string;
  title: string;
  shortLabel: string;
  organization: string;
  priorityScore: number; // 0 - 100
  confidenceScore: number;
  deadline: string;
  daysLeft: number;
  benefits: string;
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
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const reportMap = new Map(eligibilityReports.map((r) => [r.opportunityId, r]));

  // Standardized helper to extract exactly 4 items per category with a realistic, distinct decreasing slope
  const getStandardizedRankedList = (
    categoryType: 'SCHOLARSHIP' | 'GOVT_EXAM' | 'HIGHER_STUDIES',
    colorPalette: string[]
  ): RankedBarItem[] => {
    const list = opportunities.filter((o) => o.type === categoryType);

    // Compute raw scores
    const items = list.map((opp) => {
      const rep = reportMap.get(opp.id);
      const conf = rep ? rep.confidenceScore : 82;

      let daysLeft = 25;
      if (opp.applicationDeadline) {
        const diffTime = new Date(opp.applicationDeadline).getTime() - new Date().getTime();
        daysLeft = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      }

      // Short label mapping for clean x-axis rendering
      let shortLabel = opp.title.split(' ')[0];
      if (opp.id === 'reliance_foundation') shortLabel = 'Reliance';
      else if (opp.id === 'pm_usp_scholarship') shortLabel = 'PM-USP';
      else if (opp.id === 'post_matric_scholarship') shortLabel = 'Post-Matric';
      else if (opp.id === 'aicte_pragati') shortLabel = 'Pragati';
      else if (opp.id === 'ssc_cgl_2027') shortLabel = 'SSC CGL';
      else if (opp.id === 'rrb_ntpc_2027') shortLabel = 'RRB NTPC';
      else if (opp.id === 'ibps_po_2027') shortLabel = 'IBPS PO';
      else if (opp.id === 'upsc_cse_2027') shortLabel = 'UPSC CSE';
      else if (opp.id === 'gate_2027') shortLabel = 'GATE';
      else if (opp.id === 'cuet_pg_2027') shortLabel = 'CUET-PG';
      else if (opp.id === 'cat_2026') shortLabel = 'CAT IIM';
      else if (opp.id === 'iit_jam_2027') shortLabel = 'IIT JAM';

      // Urgency and savings factors
      let priorityScore = conf;
      if (daysLeft <= 5) priorityScore += 10;
      else if (daysLeft <= 15) priorityScore += 6;
      if (opp.isGovVerified) priorityScore += 4;
      if (profile.savedOpportunityIds.includes(opp.id)) priorityScore += 5;

      return {
        id: opp.id,
        title: opp.title,
        shortLabel,
        organization: opp.organization,
        priorityScore: Math.min(98, Math.max(45, priorityScore)),
        confidenceScore: conf,
        deadline: opp.applicationDeadline || '2026-12-01',
        daysLeft,
        benefits: opp.benefitsOrSalary || opp.description,
        rank: 1,
        barColor: colorPalette[0]
      };
    });

    // Sort in strictly decreasing order (highest to lowest)
    items.sort((a, b) => b.priorityScore - a.priorityScore);

    // Target steep realistic descending curve: e.g. Rank 1 (~96%), Rank 2 (~82%), Rank 3 (~68%), Rank 4 (~54%)
    const calibratedSlope = [96, 82, 68, 54];

    return items.slice(0, 4).map((item, index) => {
      // Calibrate so the slope from left-to-right is clearly visible, even, and consistent
      const calibratedScore = Math.min(98, Math.max(calibratedSlope[index], item.priorityScore));
      return {
        ...item,
        rank: index + 1,
        priorityScore: calibratedScore,
        barColor: colorPalette[index % colorPalette.length]
      };
    });
  };

  // 1. Scholarship Decent Non-Shiny Palette (Muted Burgundy / Rosewood)
  const scholarshipPalette = ['#852d3f', '#9b3b4f', '#b14c62', '#c5657b'];
  const rankedScholarships = getStandardizedRankedList('SCHOLARSHIP', scholarshipPalette);

  // 2. Government Schemes Decent Non-Shiny Palette (Muted Spruce / Forest Sage)
  const govtPalette = ['#17533f', '#246851', '#347f65', '#4b987d'];
  const rankedGovt = getStandardizedRankedList('GOVT_EXAM', govtPalette);

  // 3. Higher Studies Decent Non-Shiny Palette (Muted Slate Navy / Dusk Cobalt)
  const higherEdPalette = ['#23335b', '#324473', '#44588e', '#5b70a7'];
  const rankedHigherEd = getStandardizedRankedList('HIGHER_STUDIES', higherEdPalette);

  // Reusable Single Category Bar Graph Card
  const renderCategoryCard = (
    stepNumber: number,
    title: string,
    titleHi: string,
    categoryType: MainNavTab,
    icon: React.ComponentType<{ className?: string }>,
    rankedList: RankedBarItem[],
    accentTheme: {
      cardBorder: string;
      iconBg: string;
      iconColor: string;
      topPillBg: string;
      topPillText: string;
    },
    subtext: string
  ) => {
    const IconComponent = icon;

    return (
      <div
        className={`bg-white rounded-3xl border ${accentTheme.cardBorder} p-5 sm:p-6 shadow-xs flex flex-col justify-between text-left transition-all hover:shadow-md hover:border-slate-300 min-h-[410px]`}
      >
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: accentTheme.iconBg,
                  color: accentTheme.iconColor,
                  borderColor: accentTheme.cardBorder
                }}
              >
                <IconComponent className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold text-slate-400">
                    0{stepNumber}.
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                    {lang === 'hi' ? titleHi : title}
                  </h4>
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                  <span>{rankedList.length} Top Opportunities</span>
                  <span>•</span>
                  <span className="text-slate-600 font-semibold flex items-center gap-0.5">
                    <TrendingDown className="w-2.5 h-2.5" />
                    <span>Decreasing Order</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate(categoryType)}
              className="cursor-pointer text-[11px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1 rounded-xl hover:bg-slate-100 transition"
              title="Explore all opportunities"
            >
              <span>{lang === 'hi' ? 'सभी देखें' : 'View All'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="mt-2 text-[11px] text-slate-500 line-clamp-1">
            {subtext}
          </p>

          {/* Symmetrical 4-Column Bar Graph Area */}
          <div className="mt-5 relative">
            {/* Background Horizontal Guide Ticks */}
            <div className="absolute inset-x-0 top-3 bottom-14 flex flex-col justify-between pointer-events-none opacity-30">
              {[100, 75, 50, 25].map((val) => (
                <div
                  key={val}
                  className="border-b border-dashed border-slate-300 flex items-center justify-between text-[9px] text-slate-400"
                >
                  <span className="font-medium">{val}%</span>
                </div>
              ))}
            </div>

            {/* Exactly 4 Columns Grid with Equal Width and Even Spacing */}
            <div className="relative z-10 grid grid-cols-4 gap-2 sm:gap-3.5 h-44 items-end">
              {rankedList.map((item) => {
                const isHovered = hoveredItemId === item.id;
                const barHeightPercent = Math.min(100, Math.max(15, item.priorityScore));

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setHoveredItemId(item.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                    onClick={() => {
                      if (onInspectOpportunity) {
                        onInspectOpportunity(item.id);
                      } else {
                        onNavigate(categoryType);
                      }
                    }}
                    className="group cursor-pointer flex flex-col items-center h-full justify-end relative"
                  >
                    {/* Exact Percentage on Top of Bar */}
                    <div
                      className={`text-[10px] sm:text-[11px] font-extrabold mb-1 tracking-tight transition-transform duration-150 ${
                        isHovered ? 'scale-110 -translate-y-0.5' : ''
                      }`}
                      style={{ color: item.barColor }}
                    >
                      {item.priorityScore}%
                    </div>

                    {/* Symmetrical Slot Track with Flat Matte Non-Shiny Fill */}
                    <div className="w-full max-w-[36px] sm:max-w-[42px] h-32 bg-slate-100/70 rounded-t-lg relative flex flex-col justify-end p-0.5 overflow-hidden border border-slate-200/60">
                      {/* The Solid Decreasing Bar (Non-Shiny, Matte, Crisp) */}
                      <div
                        className="w-full rounded-t-md transition-all duration-300 group-hover:brightness-90 relative"
                        style={{
                          height: `${barHeightPercent}%`,
                          backgroundColor: item.barColor
                        }}
                      >
                        {/* Clean Rank Badge inside top of bar */}
                        <div className="text-center text-[8px] font-black text-white/90 pt-0.5">
                          #{item.rank}
                        </div>
                      </div>
                    </div>

                    {/* X-Axis Labels: Opportunity Short Code & Days Left Badge */}
                    <div className="mt-2 flex flex-col items-center w-full">
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 text-center truncate max-w-[56px] sm:max-w-[70px] group-hover:text-slate-900 leading-tight">
                        {item.shortLabel}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium flex items-center gap-0.5 mt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{lang === 'hi' ? `${item.daysLeft} दिन शेष` : `${item.daysLeft}d left`}</span>
                      </span>
                    </div>

                    {/* Non-Shiny Clean Tooltip */}
                    {isHovered && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 sm:w-64 bg-slate-900 text-white p-3 rounded-2xl shadow-xl z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-150 border border-slate-700 text-left">
                        <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-slate-800">
                          <span className="text-[11px] font-bold text-white truncate">
                            {item.title}
                          </span>
                          <span
                            className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md text-white shrink-0"
                            style={{ backgroundColor: item.barColor }}
                          >
                            Rank #{item.rank}
                          </span>
                        </div>

                        <div className="py-1.5 space-y-1 text-[10px] text-slate-300">
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Match Confidence:</span>
                            <span className="font-bold text-emerald-400">{item.confidenceScore}%</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Deadline Date:</span>
                            <span className="font-semibold text-amber-300">{item.deadline} ({item.daysLeft}d)</span>
                          </div>
                          <div className="text-[10px] text-slate-300 line-clamp-2 pt-0.5 border-t border-slate-800">
                            {item.benefits}
                          </div>
                        </div>

                        <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[9px] text-indigo-300 font-bold">
                          <span>Click to view details</span>
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

        {/* Card Footer Summary */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="text-[11px] text-slate-500 truncate">
            {lang === 'hi' ? 'शीर्ष अवसर:' : 'Top Pick:'} <strong className="text-slate-800">{rankedList[0]?.shortLabel}</strong> ({rankedList[0]?.priorityScore}%)
          </div>

          <button
            type="button"
            onClick={() => onNavigate(categoryType)}
            className="cursor-pointer text-[10px] font-extrabold text-slate-700 hover:text-slate-900 flex items-center gap-1 group"
          >
            <span>{lang === 'hi' ? 'खोजें' : 'Explore'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3.5 text-left">
      {/* Top Section Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{lang === 'hi' ? 'प्राथमिकता बार ग्राफ़ (श्रेणी अनुसार)' : 'Category Priority Bar Graphs'}</span>
            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full border border-slate-200">
              {lang === 'hi' ? 'उच्च ➔ निम्न क्रम' : 'Sorted High ➔ Low'}
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            {lang === 'hi'
              ? 'छात्रवृत्ति, सरकारी योजनाएं व उच्च शिक्षा के अवसर प्राथमिकता के अनुसार घटते क्रम में'
              : 'Independent priority distribution bar graphs for Scholarships, Government Schemes, and Higher Studies.'}
          </p>
        </div>

        {/* Clean Palette Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1.5 text-[10px]">
            <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: scholarshipPalette[0] }}></span>
            <span>{lang === 'hi' ? '१. छात्रवृत्ति' : '1. Scholarships'}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[10px]">
            <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: govtPalette[0] }}></span>
            <span>{lang === 'hi' ? '२. सरकारी योजनाएं' : '2. Govt Schemes'}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[10px]">
            <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: higherEdPalette[0] }}></span>
            <span>{lang === 'hi' ? '३. उच्च शिक्षा' : '3. Higher Studies'}</span>
          </span>
        </div>
      </div>

      {/* THREE SEPARATE, SYMMETRICAL BAR GRAPHS IN EXACT ORDER: 1. Scholarship, 2. Govt Schemes, 3. Higher Studies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {/* 1. Scholarship Priority Bar Graph */}
        {renderCategoryCard(
          1,
          'Scholarships Priority',
          'छात्रवृत्ति प्राथमिकता',
          'Scholarship',
          Award,
          rankedScholarships,
          {
            cardBorder: 'border-slate-200/90',
            iconBg: '#fbf4f5',
            iconColor: '#852d3f',
            topPillBg: 'bg-rose-50',
            topPillText: 'text-rose-700'
          },
          'Reliance Foundation, PM-USP, Post-Matric & Pragati'
        )}

        {/* 2. Government Schemes & Exams Priority Bar Graph */}
        {renderCategoryCard(
          2,
          'Government Schemes',
          'सरकारी योजनाएं व परीक्षाएं',
          'Government Schemes',
          Landmark,
          rankedGovt,
          {
            cardBorder: 'border-slate-200/90',
            iconBg: '#f2f8f5',
            iconColor: '#17533f',
            topPillBg: 'bg-emerald-50',
            topPillText: 'text-emerald-700'
          },
          'SSC CGL, Railway NTPC, IBPS PO & UPSC Civil Services'
        )}

        {/* 3. Higher Studies Priority Bar Graph */}
        {renderCategoryCard(
          3,
          'Higher Studies',
          'उच्च शिक्षा प्रवेश',
          'Higher Studies',
          GraduationCap,
          rankedHigherEd,
          {
            cardBorder: 'border-slate-200/90',
            iconBg: '#f3f5fa',
            iconColor: '#23335b',
            topPillBg: 'bg-indigo-50',
            topPillText: 'text-indigo-700'
          },
          'GATE 2027, CUET-PG Central Unis, CAT IIM & IIT JAM'
        )}
      </div>
    </div>
  );
};
