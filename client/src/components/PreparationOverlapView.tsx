import React, { useState } from 'react';
import {
  GitCompare,
  CheckCircle2,
  BookOpen,
  TrendingDown,
  Sparkles,
  Zap,
  Info,
  Layers
} from 'lucide-react';
import type { SyllabusOverlapAnalysis } from '../types';

interface PreparationOverlapViewProps {
  overlapData: SyllabusOverlapAnalysis;
  onRefreshOverlap: (examIds: string[]) => void;
  lang: 'en' | 'hi';
}

const CANDIDATE_EXAMS = [
  { id: 'ssc_cgl_2027', name: 'SSC CGL 2026-27 (Graduate Level)' },
  { id: 'rrb_ntpc_2027', name: 'Railway RRB NTPC (Officer Cadre)' },
  { id: 'ibps_po_2027', name: 'IBPS PO / Bank Management Trainee' },
  { id: 'upsc_cse_2027', name: 'UPSC CSE (CSAT + Prelims GS)' },
  { id: 'gate_2027', name: 'GATE 2027 (IIT M.Tech & PSU)' }
];

export const PreparationOverlapView: React.FC<PreparationOverlapViewProps> = ({
  overlapData,
  onRefreshOverlap,
  lang
}) => {
  const [selectedExamIds, setSelectedExamIds] = useState<string[]>(
    overlapData.selectedExamIds || ['ssc_cgl_2027', 'rrb_ntpc_2027', 'ibps_po_2027']
  );

  const toggleExam = (id: string) => {
    let next: string[];
    if (selectedExamIds.includes(id)) {
      if (selectedExamIds.length <= 2) return; // Keep at least 2 for comparison
      next = selectedExamIds.filter(x => x !== id);
    } else {
      next = [...selectedExamIds, id];
    }
    setSelectedExamIds(next);
    onRefreshOverlap(next);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-soft">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-400/20 text-purple-200 text-xs font-semibold mb-3 border border-purple-400/30">
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>{lang === 'hi' ? 'तैयारी ओवरलैप संसूचक (Syllabus Overlap Detector)' : 'Preparation Overlap & Syllabus Synergy Engine'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {lang === 'hi'
            ? 'एक तैयारी से दें अनेक परीक्षाएं: कॉमन सिलेबस का पता लगाएं'
            : 'Prepare Once, Clear Multiple Exams: Master Common Syllabi'}
        </h1>
        <p className="text-sm text-purple-200 mt-2 max-w-2xl leading-relaxed">
          {lang === 'hi'
            ? 'अलग-अलग सरकारी परीक्षाओं के सामान्य विषयों की पहचान करें ताकि कम समय में ज्यादा अवसरों को क्रैक किया जा सके।'
            : 'Identify identical topics across exams to avoid duplicate study, optimize daily schedules, and unlock 2x more career chances.'}
        </p>

        {/* Exam Selectors */}
        <div className="mt-6 pt-5 border-t border-purple-800/60">
          <label className="block text-xs font-bold uppercase tracking-wider text-purple-200 mb-2.5">
            {lang === 'hi' ? 'तुलना के लिए परीक्षाएं चुनें (Select Exams to Compare):' : 'Select Target Exams to Compare:'}
          </label>
          <div className="flex flex-wrap gap-2">
            {CANDIDATE_EXAMS.map((exam) => {
              const isSelected = selectedExamIds.includes(exam.id);
              return (
                <button
                  key={exam.id}
                  onClick={() => toggleExam(exam.id)}
                  className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-400 border-amber-300 text-slate-950 font-bold shadow-xs'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                  <span>{exam.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metrics Row: Overlap % and Hours Saved */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center gap-5">
          <div className="relative w-20 h-20 rounded-full border-4 border-indigo-100 flex items-center justify-center shrink-0">
            <div className="text-2xl font-black text-indigo-600">
              {overlapData.overallOverlapPercentage}%
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {lang === 'hi' ? 'कुल सिलेबस ओवरलैप' : 'Syllabus Overlap'}
            </div>
            <h2 className="text-base font-extrabold text-slate-900 mt-0.5">
              {lang === 'hi' ? 'उच्च तालमेल (High Synergy)' : 'High Syllabus Synergy'}
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              {selectedExamIds.length} {lang === 'hi' ? 'परीक्षाओं के बीच साझा सामग्री' : 'Target examinations combined'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <TrendingDown className="w-9 h-9" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {lang === 'hi' ? 'बचाए गए अध्ययन घंटे' : 'Study Time Saved'}
            </div>
            <h2 className="text-2xl font-black text-emerald-700 mt-0.5">
              ~{overlapData.estimatedStudyHoursSaved} hrs
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'hi' ? 'अनावश्यक दोहराव से बचत' : 'Avoided redundant foundation prep'}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-amber-50 rounded-2xl border border-indigo-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{lang === 'hi' ? 'स्मार्ट रणनीति (AI Strategy)' : 'Preparation Strategy'}</span>
          </div>
          <p className="text-xs text-slate-700 mt-2 leading-relaxed font-medium">
            {overlapData.recommendedStrategy}
          </p>
        </div>
      </div>

      {/* Common Subjects Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <span>{lang === 'hi' ? 'साझा विषय एवं गहराई विश्लेषण (Common Subjects)' : 'Shared Subjects & Overlap Depth'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overlapData.subjectBreakdown.map((item) => (
            <div key={item.subjectName} className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{item.subjectName}</span>
                <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {item.overlapPercent}% Common
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${item.overlapPercent}%` }}
                ></div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {item.syllabusDepthNotes}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Unique Subjects Delta Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600" />
          <span>{lang === 'hi' ? 'प्रत्येक परीक्षा के विशिष्ट विषय (Unique Delta to Prepare)' : 'Unique Delta Topics to Cover Separately'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(overlapData.uniqueSubjectsPerExam).map(([examName, uniques]) => (
            <div key={examName} className="p-4 rounded-xl border border-amber-200/60 bg-amber-50/40">
              <h3 className="font-bold text-xs text-amber-950 mb-2 truncate">
                {examName}
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700 pl-4 list-disc">
                {uniques.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
