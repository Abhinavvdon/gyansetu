import React, { useState, useEffect } from 'react';
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
  Info,
  Plus,
  X,
  MessageSquare,
  Globe,
  Send,
  FileWarning
} from 'lucide-react';
import type { ScamAlert, UrlVerificationResult, NoticeAnalysisResult } from '../types';
import { GyanSetuApi } from '../api/client';

interface ScamAndTrustViewProps {
  scamAlerts: ScamAlert[];
  lang: 'en' | 'hi';
}

export const ScamAndTrustView: React.FC<ScamAndTrustViewProps> = ({ scamAlerts: initialScamAlerts, lang }) => {
  // Live mutable list of scam alerts
  const [scamAlerts, setScamAlerts] = useState<ScamAlert[]>(initialScamAlerts);
  useEffect(() => {
    setScamAlerts(initialScamAlerts);
  }, [initialScamAlerts]);

  // Tab switch in verifier panel: 'url' vs 'message'
  const [activeVerifierTab, setActiveVerifierTab] = useState<'url' | 'message'>('url');

  // URL verifier state
  const [urlInput, setUrlInput] = useState('');
  const [isVerifyingUrl, setIsVerifyingUrl] = useState(false);
  const [urlResult, setUrlResult] = useState<UrlVerificationResult | null>(null);

  // Message & Notice AI Scanner state
  const [messageInput, setMessageInput] = useState('');
  const [isAnalyzingMessage, setIsAnalyzingMessage] = useState(false);
  const [messageResult, setMessageResult] = useState<NoticeAnalysisResult | null>(null);

  // Report Modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccessMessage, setReportSuccessMessage] = useState<string | null>(null);
  const [reportForm, setReportForm] = useState({
    fakeClaimOrDomain: '',
    officialGenuinePortal: '',
    scamPatternDescription: '',
    warningLevel: 'FRAUD_ALERT',
    safetyTip: ''
  });

  const sampleLinks = [
    { label: 'SSC Official Portal', url: 'https://ssc.gov.in' },
    { label: 'GATE 2027 Portal', url: 'https://gate.iitr.ac.in' },
    { label: 'Fake SSC Phishing Link', url: 'https://ssc-admitcard-online.xyz/download' },
    { label: 'Suspicious Railway Jobs', url: 'http://railway-jobs2026.online' }
  ];

  const sampleMessages = [
    {
      label: 'Fake PM Laptop Scheme Forward',
      text: 'Govt of India announced PM Free Laptop and Rs 25,000 cash stipend for all students! Forward this to 5 WhatsApp groups and pay Rs 350 registration fee on upi://pay?pa=pmlaptop@sbi to claim your laptop immediately.'
    },
    {
      label: 'Direct Railway Job Hoax',
      text: 'Railway Recruitment Board direct recruitment 2026 without exam! 15,000 Clerk & Peon posts. Direct appointment letter on interview basis. Processing charge Rs 2,500 via QR code. Contact agent on WhatsApp.'
    },
    {
      label: 'Genuine SSC CGL Notification',
      text: 'Staff Selection Commission has released the official Combined Graduate Level Examination (CGL) 2026 notice. Apply online exclusively at https://ssc.gov.in before the closing date. Standard exam fee Rs 100 with 100% concession for SC/ST and female candidates.'
    }
  ];

  const handleVerifyUrl = async (testUrl?: string) => {
    const targetUrl = testUrl || urlInput;
    if (!targetUrl.trim()) return;
    setIsVerifyingUrl(true);
    try {
      const res = await GyanSetuApi.verifyUrl(targetUrl);
      setUrlResult(res);
      if (testUrl) setUrlInput(testUrl);
    } catch {
      // Handled in client fallback
    } finally {
      setIsVerifyingUrl(false);
    }
  };

  const handleAnalyzeMessage = async (testText?: string) => {
    const targetText = testText || messageInput;
    if (!targetText.trim()) return;
    setIsAnalyzingMessage(true);
    try {
      const res = await GyanSetuApi.analyzeScamText(targetText);
      setMessageResult(res);
      if (testText) setMessageInput(testText);
    } catch {
      // Handled in client fallback
    } finally {
      setIsAnalyzingMessage(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.fakeClaimOrDomain.trim() || !reportForm.scamPatternDescription.trim()) return;
    setIsSubmittingReport(true);
    try {
      const newAlert = await GyanSetuApi.reportScamAlert(reportForm);
      setScamAlerts((prev) => [newAlert, ...prev]);
      setReportSuccessMessage(
        lang === 'hi'
          ? 'धन्यवाद! आपकी रिपोर्ट को कम्युनिटी रडार में लाइव जोड़ दिया गया है।'
          : 'Report published successfully! It is now live on the community scam radar.'
      );
      setIsReportModalOpen(false);
      setReportForm({
        fakeClaimOrDomain: '',
        officialGenuinePortal: '',
        scamPatternDescription: '',
        warningLevel: 'FRAUD_ALERT',
        safetyTip: ''
      });
      setTimeout(() => setReportSuccessMessage(null), 6000);
    } catch {
      // fallback
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleAddAnalyzedScamToRadar = async () => {
    if (!messageResult?.suggestedScamAlert) return;
    try {
      const created = await GyanSetuApi.reportScamAlert(messageResult.suggestedScamAlert);
      setScamAlerts((prev) => [created, ...prev]);
      setReportSuccessMessage(
        lang === 'hi'
          ? 'AI द्वारा विश्लेषित धोखाधड़ी को लाइव रडार में जोड़ दिया गया है!'
          : 'Analyzed notice was automatically added to the live Scam Radar!'
      );
      setTimeout(() => setReportSuccessMessage(null), 6000);
    } catch {
      // fallback
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
            ? 'फर्जी वेबसाइट्स, फेक व्हाट्सएप सर्कुलर व भ्रामक विज्ञापनों से बचें'
            : 'Protect Yourself from Fake Recruitment Portals & WhatsApp Hoaxes'}
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          {lang === 'hi'
            ? 'विद्यार्थियों से पैसे ठगने के लिए मिलती-जुलती फर्जी वेबसाइट्स और व्हाट्सएप फॉरवर्ड बनाए जाते हैं। ज्ञानसेतु के रियल-टाइम इंजन से किसी भी लिंक या सर्कुलर को तुरंत सत्यापित करें।'
            : 'Fake job notifications and cloned payment pages prey on students. Verify any website, circular text, or WhatsApp forward in real-time before entering credentials or paying form fees.'}
        </p>
      </div>

      {/* Global Success Notification */}
      {reportSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{reportSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setReportSuccessMessage(null)}
            className="cursor-pointer text-emerald-700 hover:text-emerald-900 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dual Real-Time Verifier Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-5 transition-colors">
        {/* Verifier Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-0.5">
            <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>{lang === 'hi' ? 'लाइव सरकारी सत्यापन इंजन' : 'Live Real-Time Authenticity Shield'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'hi'
                ? 'सरकारी वेबसाइट लिंक या व्हाट्सएप मैसेज की सत्यता की तुरंत जांच करें'
                : 'Evaluate arbitrary application URLs or scan raw WhatsApp / SMS forwards'}
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveVerifierTab('url')}
              className={`cursor-pointer px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeVerifierTab === 'url'
                  ? 'bg-white dark:bg-slate-700 text-[#5034df] dark:text-[#c4b5fd] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'वेबसाइट लिंक' : 'Portal URL Shield'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveVerifierTab('message')}
              className={`cursor-pointer px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeVerifierTab === 'message'
                  ? 'bg-white dark:bg-slate-700 text-[#5034df] dark:text-[#c4b5fd] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'AI मैसेज स्कैनर' : 'AI Message Scanner'}</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Real-Time URL Verifier */}
        {activeVerifierTab === 'url' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyUrl();
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={isVerifyingUrl || !urlInput.trim()}
                className="cursor-pointer px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2"
              >
                {isVerifyingUrl ? (
                  <span className="animate-spin text-xs">⏳</span>
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span>{lang === 'hi' ? 'सत्यापन करें (Verify Link)' : 'Verify Authenticity'}</span>
              </button>
            </form>

            {/* Quick Sample Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {lang === 'hi' ? 'नमूना लिंक:' : 'Try Sample URLs:'}
              </span>
              {sampleLinks.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleVerifyUrl(s.url)}
                  className="cursor-pointer px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700 transition-all"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* URL Verification Result Card */}
            {urlResult && (
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  urlResult.trustScore >= 80
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                    : urlResult.trustScore >= 50
                    ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                    : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900 ring-2 ring-rose-500/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                        urlResult.trustScore >= 80
                          ? 'bg-emerald-700 text-white'
                          : urlResult.trustScore >= 50
                          ? 'bg-amber-700 text-white'
                          : 'bg-rose-700 text-white'
                      }`}
                    >
                      {urlResult.trustScore}%
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            urlResult.trustScore >= 80
                              ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200'
                              : urlResult.trustScore >= 50
                              ? 'bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                              : 'bg-rose-200 text-rose-900 dark:bg-rose-900/60 dark:text-rose-200'
                          }`}
                        >
                          {urlResult.verdict.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                          {urlResult.isSslSecure ? (
                            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Unlock className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                          )}
                          <span>{urlResult.domain}</span>
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {urlResult.guidance}
                      </div>
                    </div>
                  </div>

                  {urlResult.safeOfficialAlternative && (
                    <a
                      href={urlResult.safeOfficialAlternative}
                      target="_blank"
                      rel="noreferrer"
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs self-start sm:self-auto shrink-0"
                    >
                      <span>Open Safe Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Risk Reasons & Signals */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {urlResult.riskReasons.length > 0 && (
                    <div className="space-y-1">
                      <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        <span>Security Risk Reasons:</span>
                      </span>
                      <ul className="list-disc pl-5 space-y-0.5 text-rose-900 dark:text-rose-200 text-[11px]">
                        {urlResult.riskReasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {urlResult.trustSignals.length > 0 && (
                    <div className="space-y-1">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Authenticity Signals:</span>
                      </span>
                      <ul className="list-disc pl-5 space-y-0.5 text-emerald-900 dark:text-emerald-200 text-[11px]">
                        {urlResult.trustSignals.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AI Message & WhatsApp Circular Scanner */}
        {activeVerifierTab === 'message' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="space-y-2">
              <textarea
                rows={4}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Paste suspicious WhatsApp message, Telegram recruitment post, or circular caption here to detect UPI fraud, direct hiring hoaxes, and fake government schemes..."
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                {/* Sample Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {lang === 'hi' ? 'नमूना संदेश:' : 'Sample Forwards:'}
                  </span>
                  {sampleMessages.map((sm, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAnalyzeMessage(sm.text)}
                      className="cursor-pointer px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700 transition-all"
                    >
                      {sm.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleAnalyzeMessage()}
                  disabled={isAnalyzingMessage || !messageInput.trim()}
                  className="cursor-pointer px-5 py-2.5 bg-gradient-to-r from-[#5034df] to-[#6d4cf5] hover:from-[#4329cd] hover:to-[#5a39df] disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 self-end sm:self-auto shrink-0"
                >
                  {isAnalyzingMessage ? (
                    <span className="animate-spin text-xs">⏳</span>
                  ) : (
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  )}
                  <span>{lang === 'hi' ? 'AI शील्ड से विश्लेषण करें' : 'Analyze with AI Shield'}</span>
                </button>
              </div>
            </div>

            {/* Message Analysis Result Card */}
            {messageResult && (
              <div
                className={`p-5 rounded-2xl border transition-all space-y-4 ${
                  messageResult.trustScore >= 80
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                    : messageResult.trustScore >= 40
                    ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                    : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900 ring-2 ring-rose-500/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 shadow-xs ${
                        messageResult.trustScore >= 80
                          ? 'bg-emerald-700 text-white'
                          : messageResult.trustScore >= 40
                          ? 'bg-amber-700 text-white'
                          : 'bg-rose-700 text-white'
                      }`}
                    >
                      <span className="text-sm leading-none">{messageResult.trustScore}%</span>
                      <span className="text-[8px] font-bold uppercase opacity-80 mt-0.5">Trust</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            messageResult.trustScore >= 80
                              ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200'
                              : messageResult.trustScore >= 40
                              ? 'bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                              : 'bg-rose-200 text-rose-900 dark:bg-rose-900/60 dark:text-rose-200'
                          }`}
                        >
                          {messageResult.verdict.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                        {messageResult.guidance}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    {messageResult.trustScore < 60 && (
                      <button
                        type="button"
                        onClick={handleAddAnalyzedScamToRadar}
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Scam Radar</span>
                      </button>
                    )}

                    {messageResult.safeOfficialAlternative && (
                      <a
                        href={messageResult.safeOfficialAlternative}
                        target="_blank"
                        rel="noreferrer"
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
                      >
                        <span>Verified Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Red Flags & Evidence */}
                {messageResult.redFlags.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="font-extrabold text-rose-900 dark:text-rose-300 text-xs flex items-center gap-1.5">
                      <FileWarning className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span>Fraud Indicators Detected by AI Shield:</span>
                    </span>
                    <ul className="list-disc pl-5 space-y-1 text-rose-950 dark:text-rose-200 text-xs font-medium">
                      {messageResult.redFlags.map((flag, idx) => (
                        <li key={idx}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Official Guidelines & Checklist */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-4 transition-colors">
        <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
          <Info className="w-5 h-5 text-amber-500" />
          <span>{lang === 'hi' ? 'फर्जी विज्ञापनों को पहचानने की प्रमुख सावधानियां' : 'Official Guidelines: How to Spot Phishing Notices'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Authentic Government Portals:</span>
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Only trust central and state notification portals that end with <code>.gov.in</code> or <code>.nic.in</code>. All National Scholarship Portal (NSP) schemes are housed on <code>scholarships.gov.in</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <span className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5 mb-1">
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Red-Flag Fake Domains:</span>
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Watch out for private domains like <code>.org</code>, <code>.online</code>, <code>.xyz</code>, <code>.site</code> or <code>.com</code> claiming to be official commission portals or charging fee over UPI QR codes.
            </p>
          </div>
        </div>
      </div>

      {/* List of Active Scam Alerts */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {lang === 'hi' ? 'लाइव फर्जी सूचनाएं व धोखाधड़ी चेतावनी' : 'Live Community Scam Radar & Verified Alerts'}
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                {scamAlerts.length} Active Alerts
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'hi'
                ? 'छात्र समुदाय व आधिकारिक जांच से सत्यापित रियल-टाइम फर्जी सूचनाएं'
                : 'Real-time alerts reported by students across India and verified against official gazettes'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'hi' ? 'फर्जी नोटिस रिपोर्ट करें' : 'Report a Scam / Fake Circular'}</span>
          </button>
        </div>

        <div className="space-y-3.5">
          {scamAlerts.map((scam) => (
            <div
              key={scam.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200/90 dark:border-rose-900/60 p-5 sm:p-6 shadow-xs hover:shadow-card transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-600 text-white flex items-center gap-1 shadow-2xs">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{scam.warningLevel}</span>
                  </span>
                  <h4 className="font-bold text-rose-950 dark:text-rose-200 text-sm">
                    {scam.fakeClaimOrDomain}
                  </h4>
                  {scam.id.includes('community') && (
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      Community Reported
                    </span>
                  )}
                </div>

                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Reported: <strong>{scam.dateReported}</strong>
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                <strong>Scam Modus Operandi:</strong> {scam.scamPatternDescription}
              </p>

              <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-800/60 text-xs flex items-center justify-between gap-3">
                <div className="text-emerald-900 dark:text-emerald-200 font-semibold truncate">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">Only Official Link: </span>
                  {scam.officialGenuinePortal}
                </div>
                <a
                  href={scam.officialGenuinePortal.replace(/^.*https?:\/\//, 'https://')}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer flex items-center gap-1 font-bold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 shrink-0"
                >
                  <span>Visit Genuine Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="text-[11px] text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-lg border border-rose-100 dark:border-rose-900/40 flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{scam.safetyTip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Report Scam Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-700 via-rose-800 to-amber-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-600/40 rounded-xl">
                  <ShieldAlert className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">
                    {lang === 'hi' ? 'फर्जी सूचना या धोखाधड़ी रिपोर्ट करें' : 'Report a Fake Notice or Scam'}
                  </h3>
                  <p className="text-xs text-rose-100">
                    {lang === 'hi' ? 'ज्ञानसेतु छात्र सुरक्षा शील्ड में नया अलर्ट जोड़ें' : 'Help protect fellow students across India'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="cursor-pointer p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleReportSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {lang === 'hi' ? 'फर्जी दावा / नकल की गई संस्था का नाम *' : 'Fake Notice Claim or Impersonated Body *'}
                </label>
                <input
                  type="text"
                  required
                  value={reportForm.fakeClaimOrDomain}
                  onChange={(e) => setReportForm({ ...reportForm, fakeClaimOrDomain: e.target.value })}
                  placeholder="e.g. Fake SSC CGL 2026 Admit Card Portal asking UPI QR fee"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {lang === 'hi' ? 'संदिग्ध लिंक या सोशल मीडिया स्रोत' : 'Suspicious URL or Source (WhatsApp / Telegram / Link)'}
                </label>
                <input
                  type="text"
                  value={reportForm.officialGenuinePortal}
                  onChange={(e) => setReportForm({ ...reportForm, officialGenuinePortal: e.target.value })}
                  placeholder="e.g. https://ssc-admitcard-online.xyz or Viral WhatsApp Forward"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {lang === 'hi' ? 'धोखाधड़ी का तरीका (Scam Modus Operandi) *' : 'Scam Modus Operandi & Details *'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={reportForm.scamPatternDescription}
                  onChange={(e) => setReportForm({ ...reportForm, scamPatternDescription: e.target.value })}
                  placeholder="Explain what the notice claims (e.g. demands ₹500 processing fee via QR code, promises direct appointment without CBT exam, asks for Aadhaar OTP)..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {lang === 'hi' ? 'खतरे का स्तर' : 'Warning Level'}
                  </label>
                  <select
                    value={reportForm.warningLevel}
                    onChange={(e) => setReportForm({ ...reportForm, warningLevel: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/20 outline-none"
                  >
                    <option value="DANGER">DANGER (Immediate Money/Data Loss)</option>
                    <option value="FRAUD_ALERT">FRAUD ALERT (Phishing / Impersonation)</option>
                    <option value="CAUTION">CAUTION (Unverified Social Forward)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {lang === 'hi' ? 'छात्रों के लिए सुरक्षा टिप' : 'Safety Tip for Students'}
                  </label>
                  <input
                    type="text"
                    value={reportForm.safetyTip}
                    onChange={(e) => setReportForm({ ...reportForm, safetyTip: e.target.value })}
                    placeholder="e.g. Never pay fees on private UPI QR codes"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/20 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="cursor-pointer px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  className="cursor-pointer px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  {isSubmittingReport ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{lang === 'hi' ? 'कम्युनिटी रडार में जोड़ें' : 'Publish to Scam Radar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
