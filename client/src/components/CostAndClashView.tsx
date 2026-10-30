import React from 'react';
import {
  IndianRupee,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  TrendingDown,
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';
import type { ApplicationCostPlan, ExamClashWarning, StudentProfile } from '../types';

interface CostAndClashViewProps {
  costPlan: ApplicationCostPlan;
  clashes: ExamClashWarning[];
  profile: StudentProfile;
  lang: 'en' | 'hi';
}

export const CostAndClashView: React.FC<CostAndClashViewProps> = ({
  costPlan,
  clashes,
  profile,
  lang
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-soft">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
          <IndianRupee className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'फीस बजट व परीक्षा टकराव संसूचक' : 'Application Cost Planner & Exam Clash Radar'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {lang === 'hi'
            ? 'फीस में छूट की बचत और परीक्षा तिथियों का टकराव रोकें'
            : 'Track Fee Waivers, Savings & Avoid Exam Travel Clashes'}
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          {lang === 'hi'
            ? 'आपकी श्रेणी (SC/ST/OBC/EWS/महिला) के आधार पर मिलने वाली १००% फीस छूट का सटीक हिसाब और एक ही तारीख या आसपास होने वाली परीक्षाओं की पूर्व चेतावनी।'
            : 'Automated calculation of government exam fee waivers plus calendar collision warnings for examinations scheduled within 72 hours.'}
        </p>

        {/* Cost Metrics Row */}
        <div className="mt-6 pt-5 border-t border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <div className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
              {lang === 'hi' ? 'सामान्य शुल्क' : 'Standard General Fee'}
            </div>
            <div className="text-2xl font-black text-slate-300 line-through mt-0.5">
              ₹{costPlan.standardTotalFee.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Without category concessions</div>
          </div>

          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <div className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">
              {lang === 'hi' ? 'आपकी कुल फीस' : 'Your Discounted Fee'}
            </div>
            <div className="text-3xl font-black text-emerald-400 mt-0.5">
              ₹{costPlan.studentDiscountedTotalFee.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-200 mt-1 font-semibold">
              {profile.category} Concessions Applied
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
              {lang === 'hi' ? 'कुल बचत' : 'Total Saved via Waivers'}
            </div>
            <div className="text-3xl font-black text-amber-300 mt-0.5">
              ₹{costPlan.totalSavedViaWaivers.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-amber-100 mt-1">Direct government relief</div>
          </div>
        </div>
      </div>

      {/* Exam Clash Radar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>{lang === 'hi' ? 'परीक्षा तिथि टकराव संसूचक (Exam Clash Radar)' : 'Exam Clash & Date Collision Detector'}</span>
          </h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
            {clashes.length} Conflicts Detected
          </span>
        </div>

        <div className="space-y-3">
          {clashes.map((c) => {
            const isCritical = c.severity.includes('CRITICAL');
            return (
              <div
                key={c.id}
                className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                  isCritical
                    ? 'border-rose-300 bg-rose-50/60'
                    : 'border-amber-200 bg-amber-50/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isCritical ? 'bg-rose-700 text-white' : 'bg-amber-700 text-white'
                    }`}>
                      {c.daysApart === 0 ? 'Same Day Clash' : `${c.daysApart} Days Apart`}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {c.exam1Title} ⚡ {c.exam2Title}
                    </h4>
                  </div>

                  <div className="text-xs font-mono font-semibold text-slate-600">
                    {c.exam1Date} vs {c.exam2Date}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/90 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-indigo-900">AI Priority Advice:</strong> {c.recommendationAdvice}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Itemized Fee Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-emerald-600" />
          <span>{lang === 'hi' ? 'आवेदन शुल्क विवरण (Itemized Fee Breakdown)' : 'Itemized Form Fee & Concession Breakdown'}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                <th className="pb-3">Opportunity</th>
                <th className="pb-3">General Rate</th>
                <th className="pb-3">Your Fee</th>
                <th className="pb-3">Concession / Waiver Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {costPlan.itemizedCosts.map((item) => (
                <tr key={item.opportunityId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 font-semibold text-slate-900 max-w-xs">
                    {item.opportunityTitle}
                  </td>
                  <td className="py-3 font-mono text-slate-600 font-medium">
                    ₹{item.originalFee}
                  </td>
                  <td className="py-3 font-mono font-bold text-slate-900">
                    {item.finalPayableFee === 0.0 ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-extrabold border border-emerald-200">
                        ₹0 (FREE)
                      </span>
                    ) : (
                      <span>₹{item.finalPayableFee}</span>
                    )}
                  </td>
                  <td className="py-3">
                    <span className="text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded">
                      {item.waiverCategoryApplied}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
