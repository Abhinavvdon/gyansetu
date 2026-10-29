import React from 'react';
import {
  FileCheck2,
  AlertTriangle,
  Clock,
  Building2,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import type { DocumentItem } from '../types';

interface DocumentReadinessViewProps {
  documents: DocumentItem[];
  onUpdateStatus: (id: string, status: 'READY' | 'IN_PROGRESS' | 'MISSING') => void;
  lang: 'en' | 'hi';
}

export const DocumentReadinessView: React.FC<DocumentReadinessViewProps> = ({
  documents,
  onUpdateStatus,
  lang
}) => {
  const readyCount = documents.filter(d => d.status === 'READY').length;
  const inProgressCount = documents.filter(d => d.status === 'IN_PROGRESS').length;
  const missingCount = documents.filter(d => d.status === 'MISSING').length;
  const urgentCount = documents.filter(d => d.isUrgent).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-soft">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-semibold mb-3 border border-amber-400/30">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'दस्तावेज़ तत्परता संसूचक' : 'Document Readiness & Paperwork Lead-Time Tracker'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {lang === 'hi'
            ? 'कागजात की देरी से न छूटे कोई अवसर: आवश्यक प्रमाणपत्र चेकलिस्ट'
            : 'Never Miss a Deadline Due to Paperwork: Readiness Tracker'}
        </h2>
        <p className="text-sm text-amber-100 mt-2 max-w-2xl leading-relaxed">
          {lang === 'hi'
            ? 'कई विद्यार्थी पात्रता के कारण नहीं, बल्कि आय या जाति प्रमाणपत्र बनने में लगने वाले 14-21 दिनों की देरी से आवेदन से वंचित रह जाते हैं। यहां ट्रैक करें कि कौन-सा दस्तावेज़ तुरंत बनवाना आवश्यक है।'
            : 'Track which government certificates are ready, in progress, or missing. Includes estimated Tehsil / CSC processing windows to ensure you file before application portals close.'}
        </p>

        {/* Status Counters */}
        <div className="mt-6 pt-5 border-t border-amber-600/50 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <div className="text-2xl font-black text-emerald-300">{readyCount}</div>
            <div className="text-xs text-amber-100 font-semibold">{lang === 'hi' ? 'तैयार (Ready)' : 'Ready in Hand'}</div>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <div className="text-2xl font-black text-amber-300">{inProgressCount}</div>
            <div className="text-xs text-amber-100 font-semibold">{lang === 'hi' ? 'प्रक्रिया में (In Progress)' : 'In Progress'}</div>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <div className="text-2xl font-black text-rose-300">{missingCount}</div>
            <div className="text-xs text-amber-100 font-semibold">{lang === 'hi' ? 'अनुपलब्ध (Missing)' : 'Missing'}</div>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <div className="text-2xl font-black text-white">{urgentCount}</div>
            <div className="text-xs text-amber-200 font-bold">{lang === 'hi' ? 'अति आवश्यक (Urgent)' : 'Urgent Bottlenecks'}</div>
          </div>
        </div>
      </div>

      {/* Checklist Cards */}
      <div className="space-y-4">
        {documents.map((doc) => {
          return (
            <div
              key={doc.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                doc.isUrgent
                  ? 'border-rose-300 ring-2 ring-rose-500/10'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-tight ${
                        doc.status === 'READY'
                          ? 'bg-emerald-100 text-emerald-800'
                          : doc.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {doc.status.replace('_', ' ')}
                    </span>

                    {doc.isUrgent && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white flex items-center gap-1 shadow-xs">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{lang === 'hi' ? 'अति आवश्यक: तुरंत बनवाएं' : 'Urgent: Apply at CSC Today'}</span>
                      </span>
                    )}

                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Lead Time: <strong>{doc.typicalLeadDays} Days</strong></span>
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base">
                    {doc.name}
                  </h3>

                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Authority: <strong>{doc.issuingAuthority}</strong></span>
                    </span>
                    <span className="text-slate-400">|</span>
                    <span>Validity: <strong>{doc.validityPeriod}</strong></span>
                  </div>
                </div>

                {/* Status Toggles */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0 self-start md:self-center">
                  {(['READY', 'IN_PROGRESS', 'MISSING'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => onUpdateStatus(doc.id, st)}
                      className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        doc.status === st
                          ? st === 'READY'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : st === 'IN_PROGRESS'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'READY' ? 'Ready' : st === 'IN_PROGRESS' ? 'In Progress' : 'Missing'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tips & Required For */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                    <Info className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{lang === 'hi' ? 'महत्वपूर्ण निर्देश (Pro Tips):' : 'Government Guidelines & Instructions:'}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {doc.proTips}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-slate-700 mb-1">
                    {lang === 'hi' ? 'किन अवसरों के लिए आवश्यक:' : 'Required by Saved Opportunities:'}
                  </div>
                  {doc.requiredByOpportunities.length > 0 ? (
                    <ul className="text-slate-600 space-y-1 list-disc pl-4">
                      {doc.requiredByOpportunities.map((op, idx) => (
                        <li key={idx} className="truncate">{op}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-slate-400 italic">Universal document for college & govt verifications</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
