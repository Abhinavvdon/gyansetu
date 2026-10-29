import React, { useState } from 'react';
import {
  Zap,
  X,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Award,
  Landmark,
  GraduationCap,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import type { Opportunity } from '../types';
import { GyanSetuApi } from '../api/client';

interface AdaptionAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpportunitiesAdded: (newOpps: Opportunity[]) => void;
  lang: 'en' | 'hi';
}

export const AdaptionAiModal: React.FC<AdaptionAiModalProps> = ({
  isOpen,
  onClose,
  onOpportunitiesAdded,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'ADAPTION_DATASET' | 'GEMINI_API'>('ADAPTION_DATASET');
  const [selectedDataset, setSelectedDataset] = useState<'india_pg_entrance_exams' | 'india_edu_career_pathways' | 'CUSTOM'>('india_pg_entrance_exams');
  const [pastedContent, setPastedContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [importedOpps, setImportedOpps] = useState<Opportunity[]>([]);

  // Gemini state (fallback)
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => localStorage.getItem('gyansetu-gemini-key') || '');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [geminiCategory, setGeminiCategory] = useState<'ALL' | 'SCHOLARSHIP' | 'GOVT_EXAM' | 'HIGHER_STUDIES'>('HIGHER_STUDIES');
  const [geminiCount, setGeminiCount] = useState<number>(5);

  if (!isOpen) return null;

  const handleImportPrebuiltDataset = async (datasetName: 'india_pg_entrance_exams' | 'india_edu_career_pathways') => {
    setError(null);
    setIsProcessing(true);
    setStatusMessage(lang === 'hi' ? `Adaption AI डेटासेट लोड हो रहा है: ${datasetName}...` : `Loading Adaption AI dataset: ${datasetName}...`);

    try {
      // Fetch prebuilt verified dataset generated for this run
      const filePath = datasetName === 'india_pg_entrance_exams'
        ? '/data/higher_studies/gyansetu_higher_studies.json'
        : '/data/gyansetu_opportunities_50.json';

      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}. You can paste raw JSON below.`);
      }

      const rawJson = await response.text();
      setStatusMessage(lang === 'hi' ? 'डेटाबेस में स्टोर व प्राथमिकता गणना...' : 'Parsing records and updating PostgreSQL catalog...');

      const res = await GyanSetuApi.importAdaptionDataset(rawJson);

      if (res.success && res.opportunities && res.opportunities.length > 0) {
        setImportedOpps(res.opportunities);
        onOpportunitiesAdded(res.opportunities);
      } else {
        setError(res.error || 'Failed to ingest Adaption AI dataset.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error importing Adaption AI dataset.');
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  const handleCustomImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedContent.trim()) {
      setError(lang === 'hi' ? 'कृपया Adaption AI से कॉपी किया गया डेटा पेस्ट करें।' : 'Please paste the JSON or CSV text copied from Adaption Labs.');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setStatusMessage(lang === 'hi' ? 'डेटा पार्स व सत्यापित किया जा रहा है...' : 'Validating & ingesting Adaption AI records...');

    try {
      const res = await GyanSetuApi.importAdaptionDataset(pastedContent.trim());
      if (res.success && res.opportunities && res.opportunities.length > 0) {
        setImportedOpps(res.opportunities);
        onOpportunitiesAdded(res.opportunities);
      } else {
        setError(res.error || 'Could not parse Adaption AI data. Ensure it is valid JSON or CSV.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error processing Adaption AI dataset.');
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);
    setStatusMessage(lang === 'hi' ? `फ़ाइल पढ़ी जा रही है: ${file.name}...` : `Reading file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)...`);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text || !text.trim()) {
        setError(lang === 'hi' ? 'अपलोड की गई फ़ाइल खाली है।' : 'Uploaded file is empty.');
        setIsProcessing(false);
        return;
      }

      setStatusMessage(lang === 'hi' ? 'डेटा पार्स व सत्यापित किया जा रहा है...' : 'Validating & ingesting Adaption AI records into database...');
      try {
        const res = await GyanSetuApi.importAdaptionDataset(text.trim());
        if (res.success && res.opportunities && res.opportunities.length > 0) {
          setImportedOpps(res.opportunities);
          onOpportunitiesAdded(res.opportunities);
        } else {
          setError(res.error || 'Could not parse Adaption AI data. Ensure it is valid JSON or CSV.');
        }
      } catch (err: any) {
        setError(err?.message || 'Error processing Adaption AI dataset.');
      } finally {
        setIsProcessing(false);
        setStatusMessage('');
      }
    };

    reader.onerror = () => {
      setError(lang === 'hi' ? 'फ़ाइल पढ़ने में त्रुटि।' : 'Failed to read file from disk.');
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const handleGeminiGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!geminiApiKey.trim()) {
      setError(lang === 'hi' ? 'कृपया Gemini API Key दर्ज करें।' : 'Please enter your Gemini API Key.');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setStatusMessage(lang === 'hi' ? 'Gemini API से अवसर जनरेट हो रहे हैं...' : 'Generating verified opportunities with Gemini API...');

    try {
      localStorage.setItem('gyansetu-gemini-key', geminiApiKey.trim());
      const res = await GyanSetuApi.generateWithGemini({
        apiKey: geminiApiKey.trim(),
        category: geminiCategory,
        count: geminiCount
      });

      if (res.success && res.opportunities && res.opportunities.length > 0) {
        setImportedOpps(res.opportunities);
        onOpportunitiesAdded(res.opportunities);
      } else {
        setError(res.error || 'Gemini API generation failed.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error communicating with Gemini API.');
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
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
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#170e43] via-[#2a177a] to-[#5034df] text-white p-5 pb-4 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center shadow-inner text-amber-300">
              <Zap className="w-5 h-5 fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                  {lang === 'hi' ? 'Adaption AI डेटासेट प्रबंधक' : 'Adaption AI Dataset Ingestion'}
                </h3>
                <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                  Abhinav Dongre Run
                </span>
              </div>
              <p className="text-xs text-indigo-200 font-medium mt-0.5">
                {lang === 'hi'
                  ? 'Adaption Labs (adaptionlabs.ai) के डेटासेट को बिना किसी API Key के सीधे लोड करें'
                  : 'Directly ingest your generated Adaption Labs datasets — zero API keys required'}
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

        {/* Tab Toggle Ribbon */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 pt-3 pb-2 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setActiveTab('ADAPTION_DATASET'); setError(null); }}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'ADAPTION_DATASET'
                ? 'bg-white dark:bg-slate-900 text-[#5034df] dark:text-[#c4b5fd] shadow-xs border border-slate-200/90 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Adaption Labs Datasets (Success)</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('GEMINI_API'); setError(null); }}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'GEMINI_API'
                ? 'bg-white dark:bg-slate-900 text-[#5034df] dark:text-[#c4b5fd] shadow-xs border border-slate-200/90 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Gemini API (Optional)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-left">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <div className="leading-relaxed font-medium flex-1">{error}</div>
            </div>
          )}

          {importedOpps.length > 0 ? (
            /* Success Results View */
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold">
                      {lang === 'hi'
                        ? `${importedOpps.length} नए अवसर सफलतापूर्वक जोड़े गए!`
                        : `Successfully loaded ${importedOpps.length} verified opportunities from Adaption AI!`}
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                      {lang === 'hi' ? 'डैशबोर्ड और प्राथमिकता बार ग्राफ़ अपडेट हो चुके हैं।' : 'Saved to PostgreSQL database and active on your dashboard.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {importedOpps.map((opp) => {
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
                  onClick={() => setImportedOpps([])}
                  className="cursor-pointer px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  {lang === 'hi' ? 'और डेटा आयात करें' : 'Import Another'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer px-5 py-2 rounded-xl bg-[#5034df] hover:bg-[#3f25c7] text-white text-xs font-bold shadow-xs transition"
                >
                  {lang === 'hi' ? 'डैशबोर्ड देखें' : 'View on Dashboard'}
                </button>
              </div>
            </div>
          ) : activeTab === 'ADAPTION_DATASET' ? (
            /* Adaption AI Dataset Selection View */
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                  {lang === 'hi' ? 'Adaption Labs से पूर्ण डेटासेट (सत्यापित रन)' : 'Completed Datasets from Adaption Labs (Abhinav Dongre)'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  {lang === 'hi'
                    ? 'नीचे दिए गए दोनों डेटासेट आपके Adaption Labs खाते में सफलतापूर्वक उत्पन्न हो चुके हैं। किसी भी एक पर क्लिक करके तुरंत लोड करें:'
                    : 'Both datasets have finished generating on Adaption Labs. Click either card to instantly ingest it into your live dashboard:'}
                </p>

                {/* The Two Adaption AI Cards matching user's screenshot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Card 1: india_pg_entrance_exams */}
                  <div
                    onClick={() => handleImportPrebuiltDataset('india_pg_entrance_exams')}
                    className="cursor-pointer p-4 rounded-2xl border-2 border-[#5034df]/40 dark:border-[#5034df]/50 bg-[#f7f5ff] dark:bg-[#5034df]/15 hover:border-[#5034df] hover:shadow-md transition text-left space-y-2.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4.5 h-4.5 text-[#5034df] dark:text-[#c4b5fd]" />
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          india_pg_entrance_exams
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Success</span>
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                      Structured Indian postgraduate entrance examinations across diverse fields (GATE, CAT, CUET-PG, IIT JAM, NIMCET, CEED, NID, XAT, CLAT PG).
                    </p>

                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-[#5034df] dark:text-[#c4b5fd]">
                      <span>⚡ 1-Click Load into GyanSetu</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 2: india_edu_career_pathways */}
                  <div
                    onClick={() => handleImportPrebuiltDataset('india_edu_career_pathways')}
                    className="cursor-pointer p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-[#5034df] hover:shadow-md transition text-left space-y-2.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-4.5 h-4.5 text-amber-500" />
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          india_edu_career_pathways
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Success</span>
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                      Comprehensive verified Indian educational schemes, scholarships, and higher education admissions instruction dataset.
                    </p>

                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-[#5034df] dark:group-hover:text-[#c4b5fd]">
                      <span>⚡ 1-Click Load into GyanSetu</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Paste or Upload Custom Ingestion Box */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80">
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-[#5034df] dark:text-[#a594fd]" />
                      <span>{lang === 'hi' ? 'फ़ाइल अपलोड करें (1MB+ समर्थित)' : 'Upload Dataset File (1MB+ supported)'}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {lang === 'hi' ? 'डाउनलोड की गई .json, .jsonl या .csv फ़ाइल सीधे चुनें' : 'Directly select your downloaded .json, .jsonl or .csv file'}
                    </p>
                  </div>

                  <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#5034df] hover:bg-[#3f25c7] text-white text-xs font-bold shadow-xs transition shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'फ़ाइल चुनें...' : 'Choose File...'}</span>
                    <input
                      type="file"
                      accept=".json,.csv,.jsonl,text/plain,application/json"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isProcessing}
                    />
                  </label>
                </div>

                <details className="group">
                  <summary className="cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-between py-1">
                    <span>{lang === 'hi' ? 'या कच्चा JSON/CSV टेक्स्ट पेस्ट करें' : 'Or paste exported JSON / CSV text'}</span>
                    <span className="text-[10px] text-[#5034df] group-open:rotate-90 transition-transform">▼</span>
                  </summary>

                  <form onSubmit={handleCustomImport} className="mt-3 space-y-3">
                    <textarea
                      rows={4}
                      value={pastedContent}
                      onChange={(e) => setPastedContent(e.target.value)}
                      placeholder='[ { "title": "GATE 2027", "type": "HIGHER_STUDIES", "organization": "IITs", ... } ]'
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#5034df]"
                    />
                    <div className="flex items-center justify-end">
                      <button
                        type="submit"
                        disabled={isProcessing || !pastedContent.trim()}
                        className="cursor-pointer px-4 py-2 rounded-xl bg-[#5034df] hover:bg-[#3e23c7] text-white text-xs font-bold transition disabled:opacity-50"
                      >
                        {lang === 'hi' ? 'पेस्ट किया गया डेटा आयात करें' : 'Parse & Ingest Dataset'}
                      </button>
                    </div>
                  </form>
                </details>
              </div>

              {/* Processing Spinner */}
              {isProcessing && (
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 flex items-center gap-3 animate-pulse">
                  <RefreshCw className="w-5 h-5 animate-spin text-[#5034df] dark:text-[#a594fd] shrink-0" />
                  <div className="text-xs font-bold leading-tight">
                    {statusMessage || 'Loading Adaption AI dataset...'}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Gemini API View (Fallback) */
            <form onSubmit={handleGeminiGenerate} className="space-y-4 animate-in fade-in">
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#5034df]" />
                    <span>Gemini API Key</span>
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-[#5034df] hover:underline flex items-center gap-1"
                  >
                    <span>Get Free Key at Google AI Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    required
                    disabled={isProcessing}
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-[#5034df]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400"
                  >
                    {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={geminiCategory}
                    onChange={(e) => setGeminiCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    <option value="HIGHER_STUDIES">Higher Studies</option>
                    <option value="SCHOLARSHIP">Scholarships</option>
                    <option value="GOVT_EXAM">Government Exams</option>
                    <option value="ALL">All Categories Mix</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Count</label>
                  <select
                    value={geminiCount}
                    onChange={(e) => setGeminiCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    <option value={3}>3 Opportunities</option>
                    <option value={5}>5 Opportunities</option>
                    <option value={10}>10 Opportunities</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="submit"
                  disabled={isProcessing || !geminiApiKey.trim()}
                  className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#5034df] hover:bg-[#3f25c7] text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {isProcessing ? 'Generating...' : 'Generate with Gemini'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200/80 dark:border-slate-800 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Integrated with Adaption Labs Runs (Abhinav Dongre)</span>
          </div>
          <span className="text-[10px] text-slate-400">
            PostgreSQL Auto-Synced
          </span>
        </div>
      </div>
    </div>
  );
};

// Export as both AdaptionAiModal and GeminiAiModal for compatibility
export const GeminiAiModal = AdaptionAiModal;
