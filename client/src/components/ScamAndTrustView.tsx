import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import type { ScamAlert } from '../types';

interface ScamAndTrustViewProps {
  scamAlerts: ScamAlert[];
  lang: 'en' | 'hi';
}

export const ScamAndTrustView: React.FC<ScamAndTrustViewProps> = ({ scamAlerts, lang }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 rounded-2xl p-6 sm:p-8 text-white shadow-soft">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-3 border border-rose-500/30">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
          <span>{lang === 'hi' ? 'फर्जी नोटिस व धोखाधड़ी चेतावनी' : 'Scam Radar & Official Verification Shield'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {lang === 'hi'
            ? 'फर्जी वेबसाइट्स व भ्रामक विज्ञापनों से सतर्क रहें'
            : 'Protect Yourself from Fake Recruitment Portals & WhatsApp Hoaxes'}
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          {lang === 'hi'
            ? 'विद्यार्थियों से पैसे ठगने के लिए मिलती-जुलती फर्जी वेबसाइट्स बनाई जाती हैं। ज्ञानसेतु केवल आधिकारिक सरकारी (.gov.in / .nic.in) पोर्टल्स की पुष्टि करता है।'
            : 'Fake job notifications and cloned payment pages prey on students. Verify every notification before paying form fees.'}
        </p>
      </div>

      {/* Official Domain Verification Rule Card */}
      <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>{lang === 'hi' ? 'असली सरकारी वेबसाइट कैसे पहचानें (Official Domain Rule):' : 'Golden Rule of Official Government Portals:'}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Genuine Government Portals:</span>
            </span>
            <p className="text-slate-700">
              Always end strictly in <strong>.gov.in</strong> or <strong>.nic.in</strong> (e.g. <code>https://ssc.gov.in</code>, <code>https://scholarships.gov.in</code>, <code>https://upsc.gov.in</code>).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
            <span className="font-bold text-rose-900 flex items-center gap-1.5 mb-1">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Red-Flag Fake Domains:</span>
            </span>
            <p className="text-slate-700">
              Watch out for private domains like <code>.org</code>, <code>.online</code>, <code>.com</code> or <code>.in</code> claiming to be official commission portals.
            </p>
          </div>
        </div>
      </div>

      {/* List of Active Scam Alerts */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base">
          {lang === 'hi' ? 'हाल ही में रिपोर्ट की गई फर्जी सूचनाएं (Active Scam Alerts)' : 'Recently Reported Fake Notices & Impersonations'}
        </h3>

        {scamAlerts.map((scam) => (
          <div
            key={scam.id}
            className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs hover:shadow-card transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-600 text-white flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{scam.warningLevel}</span>
                </span>
                <h4 className="font-bold text-rose-950 text-sm">
                  {scam.fakeClaimOrDomain}
                </h4>
              </div>

              <span className="text-xs text-slate-400">
                Reported: {scam.dateReported}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Scam Modus Operandi:</strong> {scam.scamPatternDescription}
            </p>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs flex items-center justify-between gap-3">
              <div className="text-emerald-900 font-semibold truncate">
                ✓ <strong>Verified Genuine Address:</strong> {scam.officialGenuinePortal}
              </div>
            </div>

            <div className="text-xs text-slate-500 italic pt-1">
              <strong>Student Safety Tip:</strong> {scam.safetyTip}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
