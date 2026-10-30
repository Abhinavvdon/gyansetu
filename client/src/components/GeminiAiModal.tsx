import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  Layers,
  CheckCircle2,
  AlertCircle,
  Award,
  Landmark,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import type { Opportunity } from '../types';
import { GyanSetuApi } from '../api/client';

interface GeminiAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpportunitiesAdded: (newOpps: Opportunity[]) => void;
  lang: 'en' | 'hi';
}

export const GeminiAiModal: React.FC<GeminiAiModalProps> = ({
  isOpen,
  onClose,
  onOpportunitiesAdded,
  lang
}) => {
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('gyansetu-gemini-key') || '';
  });
  const [showKey, setShowKey] = useState<boolean>(false);
  const [rememberKey, setRememberKey] = useState<boolean>(true);
  const [category, setCategory] = useState<'ALL' | 'SCHOLARSHIP' | 'GOVT_EXAM' | 'HIGHER_STUDIES'>('ALL');
  const [count, setCount] = useState<number>(3);
  const [customFocus, setCustomFocus] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [addedOpps, setAddedOpps] = useState<Opportunity[]>([]);

  useEffect(() => {
    if (rememberKey && apiKey.trim()) {
      localStorage.setItem('gyansetu-gemini-key', apiKey.trim());
    }
  }, [apiKey, rememberKey]);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError(lang === 'hi' ? 'कृपया अपनी Google Gemini API Key दर्ज करें।' : 'Please enter your Google Gemini API key.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setAddedOpps([]);
    setGenerationStep(lang === 'hi' ? 'Gemini 2.5 Flash से संपर्क किया जा रहा है...' : 'Connecting to Google Gemini API...');

    try {
      setTimeout(() => {
        setGenerationStep(lang === 'hi' ? 'सरकारी पोर्टल और पात्रता मापदंडों का सत्यापन...' : 'Validating Indian government schemas & eligibility quotas...');
      }, 1400);

      const res = await GyanSetuApi.generateWithGemini({
        apiKey: apiKey.trim(),
        category,
        count,
        customFocus: customFocus.trim() || undefined
      });

      if (res.success && res.opportunities && res.opportunities.length > 0) {
        setAddedOpps(res.opportunities);
        onOpportunitiesAdded(res.opportunities);
      } else {
        setError(res.error || 'Failed to generate opportunities. Please verify your Gemini API key.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error communicating with Gemini API.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const getCategoryBadge = (type: string) => {
    if (type === 'SCHOLARSHIP') {
      return {
        label: lang === 'hi' ? 'छात्रवृत्ति' : 'Scholarship',
        bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        icon: Award
      };
    }
    if (type === 'GOVT_EXAM') {
      return {
        label: lang === 'hi' ? 'सरकारी परीक्षा' : 'Govt Exam',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        icon: Landmark
      };
    }
    return {
      label: lang === 'hi' ? 'उच्च शिक्षा' : 'Higher Studies',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-[#5034df] dark:text-[#c4b5fd] border-indigo-200 dark:border-indigo-800',
      icon: GraduationCap
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#1c1257] via-[#2f1b8a] to-[#5034df] text-white p-5 pb-4.5 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center shadow-inner text-amber-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                  {lang === 'hi' ? 'AI अवसर जनरेटर (Gemini API)' : 'AI Opportunity Generator (Gemini API)'}
                </h3>
                <span className="text-[10px] bg-emerald-700 text-white font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                  Gemini Flash
                </span>
              </div>
              <p className="text-xs text-indigo-200 font-medium mt-0.5">
                {lang === 'hi'
                  ? 'सत्यापित छात्रवृत्ति, सरकारी योजनाएं व उच्च शिक्षा अवसर सीधे जोड़ें'
                  : 'Dynamically scan & add verified Indian opportunities with your API Key'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <div className="leading-relaxed font-medium flex-1">{error}</div>
            </div>
          )}

          {addedOpps.length > 0 ? (
            /* Success Results View */
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold">
                      {lang === 'hi'
                        ? `${addedOpps.length} नए अवसर सफलतापूर्वक जोड़े गए!`
                        : `Successfully generated ${addedOpps.length} new verified opportunities!`}
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                      {lang === 'hi' ? 'डैशबोर्ड और प्राथमिकता ग्राफ़ अपडेट हो चुके हैं।' : 'Saved to PostgreSQL database and live on your dashboard.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {addedOpps.map((opp) => {
                  const badge = getCategoryBadge(opp.type);
                  const BadgeIcon = badge.icon;
                  return (
                    <div
                      key={opp.id}
                      className="p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 flex items-center justify-between gap-3 text-left"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                            <BadgeIcon className="w-3 h-3" />
                            <span>{badge.label}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {opp.organization}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {opp.title}
                        </h5>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                          {opp.benefitsOrSalary} • Deadline: <strong className="text-slate-700 dark:text-slate-300">{opp.applicationDeadline}</strong>
                        </div>
                      </div>

                      {opp.officialUrl && (
                        <a
                          href={opp.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="cursor-pointer p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-[#5034df] transition shrink-0"
                          title="Open official portal"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddedOpps([])}
                  className="cursor-pointer px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  {lang === 'hi' ? 'और अवसर उत्पन्न करें' : 'Generate More'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer px-4 py-2 rounded-xl bg-[#5034df] hover:bg-[#3f25c7] text-white text-xs font-bold shadow-xs transition"
                >
                  {lang === 'hi' ? 'डैशबोर्ड देखें' : 'View on Dashboard'}
                </button>
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleGenerate} className="space-y-4">
              {/* API Key Input */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#5034df] dark:text-[#a594fd]" />
                    <span>{lang === 'hi' ? 'Google Gemini API Key' : 'Google Gemini API Key'}</span>
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-[#5034df] dark:text-[#a594fd] hover:underline flex items-center gap-1"
                  >
                    <span>{lang === 'hi' ? 'मुफ्त API Key प्राप्त करें' : 'Get Free Key at Google AI Studio'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    required
                    disabled={isGenerating}
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#5034df] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="rememberKey"
                    checked={rememberKey}
                    onChange={(e) => setRememberKey(e.target.checked)}
                    className="rounded border-slate-300 text-[#5034df] focus:ring-[#5034df] cursor-pointer"
                  />
                  <label htmlFor="rememberKey" className="text-[11px] text-slate-500 dark:text-slate-400 cursor-pointer">
                    {lang === 'hi' ? 'इस ब्राउज़र पर API Key याद रखें' : 'Save API key locally in this browser'}
                  </label>
                </div>
              </div>

              {/* Category Selector */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#5034df] dark:text-[#a594fd]" />
                  <span>{lang === 'hi' ? 'अवसर श्रेणी चुनें' : 'Select Opportunity Category'}</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'ALL', label: 'All Mix', labelHi: 'सभी प्रकार' },
                    { id: 'SCHOLARSHIP', label: 'Scholarships', labelHi: 'छात्रवृत्तियां' },
                    { id: 'GOVT_EXAM', label: 'Govt Exams', labelHi: 'सरकारी परीक्षाएं' },
                    { id: 'HIGHER_STUDIES', label: 'Higher Studies', labelHi: 'उच्च शिक्षा' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as any)}
                      className={`cursor-pointer px-3 py-2 rounded-xl text-[11px] font-bold border transition text-center ${
                        category === cat.id
                          ? 'bg-[#ece8ff] dark:bg-[#5034df]/30 border-[#5034df] text-[#5034df] dark:text-[#c4b5fd]'
                          : 'bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      {lang === 'hi' ? cat.labelHi : cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    {lang === 'hi' ? 'संख्या (अवसरों की संख्या)' : 'Quantity to Generate'}
                  </label>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {count} {lang === 'hi' ? 'अवसर' : 'opportunities'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[3, 5, 8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCount(num)}
                      className={`cursor-pointer flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                        count === num
                          ? 'bg-[#5034df] text-white border-[#5034df] shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Prompt / Special Focus */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  {lang === 'hi' ? 'विशेष आवश्यकता या फ़ोकस (वैकल्पिक)' : 'Custom Focus / Requirements (Optional)'}
                </label>
                <input
                  type="text"
                  value={customFocus}
                  onChange={(e) => setCustomFocus(e.target.value)}
                  placeholder={
                    lang === 'hi'
                      ? 'उदा. बालिकाओं के लिए छात्रवृत्ति, बिहार या यूपी राज्य योजनाएं'
                      : 'e.g. Technical scholarships for girls, MP & UP state schemes, M.Tech entrance'
                  }
                  disabled={isGenerating}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#5034df] transition"
                />
              </div>

              {/* Status Indicator during Generation */}
              {isGenerating && (
                <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 flex items-center gap-3 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#5034df] dark:text-[#a594fd] shrink-0" />
                  <div className="text-xs font-bold leading-tight">
                    {generationStep || (lang === 'hi' ? 'अवसर जनरेट किए जा रहे हैं...' : 'Generating verified opportunities with Gemini...')}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isGenerating}
                  className="cursor-pointer px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={isGenerating || !apiKey.trim()}
                  className="cursor-pointer px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5034df] to-[#6d4aff] hover:from-[#432bc9] hover:to-[#5939e6] text-white text-xs font-bold shadow-md shadow-[#5034df]/20 flex items-center gap-2 transition disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{lang === 'hi' ? 'जनरेट हो रहा है...' : 'Generating...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{lang === 'hi' ? 'Gemini API से अवसर जोड़ें' : 'Generate & Add Opportunities'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200/80 dark:border-slate-800 px-5 py-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Schema-validated Indian standards (.gov.in & real pay/fellowships)</span>
          </div>
          <span className="text-[10px] text-slate-400">
            Secure • Client-held API Key
          </span>
        </div>
      </div>
    </div>
  );
};
