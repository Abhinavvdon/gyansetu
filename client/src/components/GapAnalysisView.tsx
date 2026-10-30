import React from 'react';
import {
  Target,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Compass
} from 'lucide-react';
import type { GapAnalysis } from '../types';

interface GapAnalysisViewProps {
  gaps: GapAnalysis[];
  onInspectAlternative: (id: string) => void;
  lang: 'en' | 'hi';
}

export const GapAnalysisView: React.FC<GapAnalysisViewProps> = ({
  gaps,
  onInspectAlternative,
  lang
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-soft">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-3 border border-rose-500/30">
          <Target className="w-3.5 h-3.5 text-amber-300" />
          <span>{lang === 'hi' ? 'गैप विश्लेषण संसूचक (Missed-It-By-How-Much)' : 'Backward Gap Analysis & Closest Alternatives'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {lang === 'hi'
            ? 'कितने अंतर से छूटे? सटीक गैप और तुरंत उपलब्ध सर्वोत्तम विकल्प'
            : 'Target Backward Analysis: Discover the Exact Gap & Immediate Alternatives'}
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          {lang === 'hi'
            ? 'जिन परीक्षाओं या छात्रवृत्तियों में आप थोड़े अंतर से चूक रहे हैं, वहां सटीक अंतर देखें (जैसे "२.५% अंक कम हैं" या "उम्र ४ महीने अधिक है") और तुरंत उन समान विकल्पों पर जाएं जिनके लिए आप आज ही पूरी तरह पात्र हैं।'
            : 'Work backwards from your dream goals to pinpoint exact score, age, or credential deficits, paired with high-probability alternative pathways open today.'}
        </p>
      </div>

      {/* Gap Analysis Cards */}
      <div className="space-y-5">
        {gaps.map((item) => (
          <div
            key={item.opportunityId}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-card transition-all space-y-4"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  Cutoff / Requirement Gap
                </span>
                <h2 className="font-extrabold text-slate-900 text-lg mt-1">
                  {item.opportunityTitle}
                </h2>
              </div>
            </div>

            {/* Exact Gap Highlight */}
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200/80 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-rose-950 uppercase tracking-wide">
                  {lang === 'hi' ? 'सटीक अंतर (Exact Gap):' : 'Pinpoint Eligibility Gap:'}
                </div>
                <div className="text-sm font-extrabold text-rose-900 mt-0.5">
                  {item.exactGapStatement}
                </div>
              </div>
            </div>

            {/* Metric Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">
                  {lang === 'hi' ? 'आपकी वर्तमान स्थिति' : 'Your Current Profile'}
                </span>
                <div className="text-sm font-bold text-slate-800 mt-1">
                  {item.studentCurrentValue}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">
                  {lang === 'hi' ? 'न्यूनतम आवश्यक कटऑफ' : 'Mandatory Requirement'}
                </span>
                <div className="text-sm font-bold text-indigo-700 mt-1">
                  {item.requiredThreshold}
                </div>
              </div>
            </div>

            {/* Actionable Remedy */}
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs">
              <div className="font-bold text-indigo-950 mb-0.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{lang === 'hi' ? 'सुझाया गया समाधान (Actionable Remedy):' : 'Strategic Remedy:'}</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {item.actionableRemedy}
              </p>
            </div>

            {/* Closest Alternatives */}
            {item.closestAlternatives.length > 0 && (
              <div className="pt-2 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'hi' ? 'निकटतम विकल्प (आप आज ही पात्र हैं):' : 'Closest Alternatives (You Qualify Today):'}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {item.closestAlternatives.map((alt) => (
                    <div
                      key={alt.id}
                      onClick={() => onInspectAlternative(alt.id)}
                      className="cursor-pointer p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                          <span>{alt.title}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            Eligible ✓
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          {alt.whyRecommended}
                        </p>
                      </div>

                      <div className="mt-3 text-xs text-emerald-700 font-bold flex items-center gap-1 self-end">
                        <span>{lang === 'hi' ? 'विवरण देखें' : 'Inspect Option'}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
