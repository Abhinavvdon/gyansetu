import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Search,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import type { ScamAlert, UrlVerificationResult } from '../types';
import { GyanSetuApi } from '../api/client';

interface ScamAndTrustViewProps {
  scamAlerts: ScamAlert[];
  lang: 'en' | 'hi';
}

export const ScamAndTrustView: React.FC<ScamAndTrustViewProps> = ({ scamAlerts, lang }) => {
  const [urlInput, setUrlInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<UrlVerificationResult | null>(null);

  const sampleLinks = [
    { label: 'SSC Official Portal', url: 'https://ssc.gov.in' },
    { label: 'GATE 2027 Portal', url: 'https://gate.iitr.ac.in' },
    { label: 'Fake SSC Phishing Link', url: 'https://ssc-admitcard-online.xyz/download' },
    { label: 'Suspicious Railway Jobs', url: 'http://railway-jobs2026.online' }
  ];

  const handleVerify = async (testUrl?: string) => {
    const targetUrl = testUrl || urlInput;
    if (!targetUrl.trim()) return;
    setIsVerifying(true);
    try {
      const res = await GyanSetuApi.verifyUrl(targetUrl);
      setVerificationResult(res);
      if (testUrl) setUrlInput(testUrl);
    } catch {
      // handled in client fallback
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-soft">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-3 border border-rose-500/30">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
          <span>{lang === 'hi' ? 'फर्जी नोटिस व धोखाधड़ी संसूचक' : 'Scam Radar & Official Verification Shield'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {lang === 'hi'
            ? 'फर्जी वेबसाइट्स व भ्रामक विज्ञापनों से सतर्क रहें'
            : 'Protect Yourself from Fake Recruitment Portals & WhatsApp Hoaxes'}
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          {lang === 'hi'
            ? 'विद्यार्थियों से पैसे ठगने के लिए मिलती-जुलती फर्जी वेबसाइट्स बनाई जाती हैं। ज्ञानसेतु केवल आधिकारिक सरकारी (.gov.in / .nic.in) पोर्टल्स की पुष्टि करता है।'
            : 'Fake job notifications and cloned payment pages prey on students. Verify any website or circular link instantly before entering credentials or paying form fees.'}
        </p>
      </div>

      {/* Interactive Domain & URL Verifier */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>{lang === 'hi' ? 'इंटरैक्टिव पोर्टल व लिंक सत्यापन (Live URL Shield)' : 'Live Government Portal & Link Verifier'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'hi'
                ? 'व्हाट्सएप, टेलीग्राम या सोशल मीडिया पर प्राप्त किसी भी लिंक को यहां पेस्ट कर जांचें'
                : 'Paste any application URL, WhatsApp forward, or circular link to check authenticity'}
            </p>
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. https://ssc-online-gov.in or https://scholarships.gov.in"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isVerifying || !urlInput.trim()}
            className="cursor-pointer px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <span className="animate-spin text-xs">⏳</span>
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>{lang === 'hi' ? 'सत्यापन करें (Verify Link)' : 'Verify Authenticity'}</span>
          </button>
        </form>

        {/* Quick Sample Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">{lang === 'hi' ? 'नमूना लिंक:' : 'Try Sample URLs:'}</span>
          {sampleLinks.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleVerify(s.url)}
              className="cursor-pointer px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium border border-slate-200 transition-all"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Verification Result Card */}
        {verificationResult && (
          <div
            className={`p-5 rounded-2xl border transition-all ${
              verificationResult.trustScore >= 80
                ? 'bg-emerald-50/70 border-emerald-300'
                : verificationResult.trustScore >= 50
                ? 'bg-amber-50/70 border-amber-300'
                : 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-500/10'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                    verificationResult.trustScore >= 80
                      ? 'bg-emerald-700 text-white'
                      : verificationResult.trustScore >= 50
                      ? 'bg-amber-700 text-white'
                      : 'bg-rose-700 text-white'
                  }`}
                >
                  {verificationResult.trustScore}%
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        verificationResult.trustScore >= 80
                          ? 'bg-emerald-200 text-emerald-900'
                          : verificationResult.trustScore >= 50
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-rose-200 text-rose-900'
                      }`}
                    >
                      {verificationResult.verdict.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                      {verificationResult.isSslSecure ? (
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      <span>{verificationResult.domain}</span>
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 mt-0.5">
                    {verificationResult.guidance}
                  </div>
                </div>
              </div>
            </div>

            {/* Signals and Risks breakdown */}
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {verificationResult.trustSignals.length > 0 && (
                <div className="space-y-1">
                  <div className="font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'hi' ? 'सत्यापित संकेत (Trust Signals):' : 'Authenticity Signals:'}</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                    {verificationResult.trustSignals.map((ts, i) => (
                      <li key={i}>{ts}</li>
                    ))}
                  </ul>
                </div>
              )}

              {verificationResult.riskReasons.length > 0 && (
                <div className="space-y-1">
                  <div className="font-bold text-rose-800 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>{lang === 'hi' ? 'जोखिम कारक (Risk Indicators):' : 'Risk Indicators:'}</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                    {verificationResult.riskReasons.map((rr, i) => (
                      <li key={i}>{rr}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Safe Official Alternative Pill */}
            {verificationResult.safeOfficialAlternative && (
              <div className="mt-4 pt-3 border-t border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/70 p-3 rounded-xl">
                <div className="text-xs">
                  <span className="font-bold text-slate-700">
                    {lang === 'hi' ? 'आधिकारिक सुरक्षित वेबसाइट:' : 'Genuine Official Alternative:'}{' '}
                  </span>
                  <code className="text-emerald-700 font-bold">{verificationResult.safeOfficialAlternative}</code>
                </div>
                <a
                  href={verificationResult.safeOfficialAlternative}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all shrink-0 self-start sm:self-center"
                >
                  <span>{lang === 'hi' ? 'सुरक्षित पोर्टल खोलें' : 'Open Official Portal'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        )}
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
              Watch out for private domains like <code>.org</code>, <code>.online</code>, <code>.xyz</code>, <code>.com</code> or <code>.in</code> claiming to be official commission portals.
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

              <span className="text-xs text-slate-600 font-medium">
                Reported: {scam.dateReported}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Scam Modus Operandi:</strong> {scam.scamPatternDescription}
            </p>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs flex items-center justify-between gap-3">
              <div className="text-emerald-900 font-semibold truncate">
                <span className="text-emerald-700 font-bold">Only Official Link: </span>
                {scam.officialGenuinePortal}
              </div>
              <a
                href={scam.officialGenuinePortal.replace(/^.*https?:\/\//, 'https://')}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950 shrink-0"
              >
                <span>Visit Genuine Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="text-[11px] text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-100 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>{scam.safetyTip}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
