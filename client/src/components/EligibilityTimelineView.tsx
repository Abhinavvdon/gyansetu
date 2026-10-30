import React from 'react';
import {
  Sparkles,
  Milestone,
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  Briefcase
} from 'lucide-react';
import type { CareerTimelineNode } from '../types';

interface EligibilityTimelineViewProps {
  timeline: CareerTimelineNode[];
  onSelectOpportunity: (id: string) => void;
  lang: 'en' | 'hi';
}

export const EligibilityTimelineView: React.FC<EligibilityTimelineViewProps> = ({
  timeline,
  onSelectOpportunity,
  lang
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-soft">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-400/20 text-indigo-200 text-xs font-semibold mb-3 border border-indigo-400/30">
          <Milestone className="w-3.5 h-3.5 text-amber-300" />
          <span>{lang === 'hi' ? 'भविष्य पात्रता समयरेखा (Eligibility Timeline)' : '1 to 3-Year Future Eligibility Horizon'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {lang === 'hi'
            ? 'केवल आज नहीं, १ से ३ वर्ष आगे की योजना बनाएं'
            : 'Plan 1 to 3 Years Ahead: Unlock Opportunities as You Progress'}
        </h1>
        <p className="text-sm text-indigo-200 mt-2 max-w-2xl leading-relaxed">
          {lang === 'hi'
            ? 'जानें कि ग्रेजुएशन पूरा होने पर, उम्र २१ या २३ वर्ष होने पर कौन-कौन से बड़े अवसर खुलेंगे ताकि आप आज से ही उनकी लक्षित तैयारी कर सकें।'
            : 'Visual milestones showing career windows opening across graduation, age milestones, and certifications.'}
        </p>
      </div>

      {/* Visual Vertical Roadmap */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-indigo-200">
        {timeline.map((node, index) => {
          return (
            <div key={index} className="relative group">
              {/* Timeline marker icon */}
              <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-4 border-indigo-600 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              </div>

              {/* Node Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-card transition-all space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900">
                      {node.timeframe}
                    </span>
                    <h2 className="font-extrabold text-slate-900 text-lg mt-1">
                      {node.milestoneTitle}
                    </h2>
                  </div>

                  <span className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 self-start sm:self-center">
                    Trigger: {node.triggerEvent}
                  </span>
                </div>

                {/* Unlocked Opportunities Grid */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{lang === 'hi' ? 'इस चरण में खुलने वाले मुख्य अवसर:' : 'Opportunities Unlocking in this Window:'}</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {node.unlockingOpportunities.map((op) => (
                      <div
                        key={op.id}
                        onClick={() => onSelectOpportunity(op.id)}
                        className="cursor-pointer p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-between group/item"
                      >
                        <div>
                          <div className="font-bold text-slate-900 text-xs group-hover/item:text-indigo-700">
                            {op.title}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {op.expectedBenefit}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover/item:text-indigo-600 group-hover/item:translate-x-1 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Immediate Prep Action Today */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-950">
                      {lang === 'hi' ? 'आज क्या तैयारी करें (Action Today): ' : 'Actionable Preparation Strategy Today: '}
                    </span>
                    <span className="text-slate-700 leading-relaxed">
                      {node.prepActionToday}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
