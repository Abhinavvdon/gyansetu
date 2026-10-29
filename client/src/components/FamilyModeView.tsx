import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Users,
  IndianRupee,
  Calendar,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  Share2,
  Printer,
  Clock,
  ArrowRight,
  Languages,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BadgeCheck
} from 'lucide-react';
import type { StudentProfile, WeeklyDigest, ApplicationCostPlan, User, Opportunity } from '../types';
import type { MainNavTab } from './Sidebar';
import { formatStudentName } from '../utils/languageUtils';

interface FamilyModeViewProps {
  profile: StudentProfile;
  currentUser?: User | null;
  opportunities?: Opportunity[];
  digest: WeeklyDigest;
  costPlan: ApplicationCostPlan;
  lang: 'en' | 'hi';
  onToggleLanguage?: () => void;
  onNavigateTab?: (tab: MainNavTab) => void;
}

export const FamilyModeView: React.FC<FamilyModeViewProps> = ({
  profile,
  currentUser,
  opportunities = [],
  digest,
  costPlan,
  lang,
  onToggleLanguage,
  onNavigateTab
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeAudioSection, setActiveAudioSection] = useState<'all' | 'deadlines' | 'finances' | 'documents' | 'advisory' | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load available speech synthesis voices for crisp bilingual TTS
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop audio whenever language is switched to avoid reading wrong language script
  useEffect(() => {
    if ('speechSynthesis' in window && isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setActiveAudioSection(null);
    }
  }, [lang]);

  const rawFullName = currentUser?.name || profile.fullName || 'Student';
  const studentName = formatStudentName(rawFullName, lang);
  const firstName = formatStudentName(rawFullName.split(' ')[0], lang);

  // Calculate actual or eligible fee savings (fallback to standard category concessions if costPlan is 0)
  const feeSavings = costPlan.totalSavedViaWaivers > 0
    ? costPlan.totalSavedViaWaivers
    : (['OBC-NCL', 'SC', 'ST', 'EWS'].includes(profile.category) ? 2800 : 0);

  // Friendly category label
  const categoryLabel = {
    'General': lang === 'hi' ? 'सामान्य (General)' : 'General',
    'OBC-NCL': lang === 'hi' ? 'ओबीसी (OBC-NCL - अन्य पिछड़ा वर्ग)' : 'OBC-NCL',
    'SC': lang === 'hi' ? 'अनुसूचित जाति (SC)' : 'Scheduled Caste (SC)',
    'ST': lang === 'hi' ? 'अनुसूचित जनजाति (ST)' : 'Scheduled Tribe (ST)',
    'EWS': lang === 'hi' ? 'ईडब्ल्यूएस (EWS - आर्थिक रूप से कमजोर वर्ग)' : 'Economically Weaker Section (EWS)',
    'PwD': lang === 'hi' ? 'दिव्यांगजन (PwD)' : 'Persons with Benchmark Disabilities (PwD)'
  }[profile.category] || profile.category;

  // Bilingual Speech Synthesis Handler
  const speakSection = (
    section: 'all' | 'deadlines' | 'finances' | 'documents' | 'advisory',
    overrideRate?: number
  ) => {
    if (!('speechSynthesis' in window)) {
      alert(
        lang === 'hi'
          ? 'आपके ब्राउज़र में आवाज़ (Text-to-Speech) सुविधा उपलब्ध नहीं है।'
          : 'Text-to-Speech is not supported in your current browser.'
      );
      return;
    }

    // Toggle off if currently speaking the exact same section
    if (isPlayingAudio && activeAudioSection === section && !overrideRate) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setActiveAudioSection(null);
      return;
    }

    window.speechSynthesis.cancel();

    const currentRate = overrideRate ?? speechRate;

    // Bilingual Script Construction
    let narration = '';

    if (lang === 'hi') {
      if (section === 'all') {
        narration = `नमस्ते! ज्ञानसेतु अभिभावक व परिवार मार्गदर्शन केंद्र में आपका स्वागत है। विद्यार्थी ${studentName} के लिए इस सप्ताह की ताज़ा रिपोर्ट: ` +
          `पहली बात, महत्वपूर्ण अंतिम तारीखें: इस महीने ${digest.upcomingDeadlinesCount} मुख्य परीक्षाओं व छात्रवृत्तियों की अंतिम तिथि नज़दीक है, जिनमें गेट २०२७ और कैट २०२६ शामिल हैं। सर्वर की व्यस्तता से बचने के लिए फॉर्म कम से कम दो दिन पूर्व अवश्य जमा करें। ` +
          `दूसरी बात, सरकारी फीस छूट व छात्रवृत्ति: ${profile.category} श्रेणी के अंतर्गत फॉर्म फीस में छूट लगभग ₹${feeSavings.toLocaleString('en-IN')} है, तथा दो लाख रुपये तक की सरकारी छात्रवृत्ति सीधे विद्यार्थी के बैंक खाते में मिलने के अवसर हैं। ` +
          `तीसरी बात, तहसील के जरूरी कागजात: तहसील या जन सेवा केंद्र से नया पारिवारिक आय प्रमाण पत्र तुरंत बनवाएं, इसमें १४ से १८ कार्य दिवस का समय लगता है। ` +
          `चौथी बात, सतर्कता संदेश: किसी भी दलाल या अनजानी वेबसाइट को पैसे न दें। भारत सरकार के सभी आधिकारिक फॉर्म केवल अधिकृत .gov.in वेबसाइट पर ही भरे जाते हैं। धन्यवाद!`;
      } else if (section === 'deadlines') {
        narration = `अंतिम तारीखों की सूचना: विद्यार्थी ${firstName} के लिए इस महीने ${digest.upcomingDeadlinesCount} महत्वपूर्ण फॉर्म्स की अंतिम तिथि नज़दीक है। गेट २०२७ की अंतिम तिथि ३१ अक्टूबर, और कैट २०२६ की अंतिम तिथि १० नवंबर है। कृपया अंतिम दिन की प्रतीक्षा न करें और समय पूर्व फॉर्म भरवाएं।`;
      } else if (section === 'finances') {
        narration = `सरकारी छूट व आर्थिक लाभ विवरण: ${profile.category} श्रेणी के नियमानुसार फॉर्म फीस में लगभग ₹${feeSavings.toLocaleString('en-IN')} की बचत है। इसके अतिरिक्त, दो लाख रुपये तक की छात्रवृत्ति सीधे डीबीटी के माध्यम से बैंक खाते में जमा होती है।`;
      } else if (section === 'documents') {
        narration = `कागजात निर्देश: तहसील अथवा जन सेवा केंद्र से वित्तीय वर्ष २०२६-२७ का नया पारिवारिक आय प्रमाण पत्र तुरंत रिन्यू करवाएं। प्रक्रिया समय १४ से १८ दिन है। कृपया ध्यान दें कि विद्यार्थी का नाम अंकसूची व आधार कार्ड में एक जैसा होना चाहिए।`;
      } else if (section === 'advisory') {
        narration = `अभिभावकों के लिए मुख्य सलाह: घर में सकारात्मक व शांत माहौल बनाए रखें। सभी सरकारी आवेदन केवल अधिकृत .gov.in पोर्टल्स पर ही करें। किसी अनधिकृत एजेंट या फर्जी लिंक पर कभी पैसे न दें।`;
      }
    } else {
      if (section === 'all') {
        narration = `Welcome to the GyanSetu Parent and Family Guidance Center for ${studentName}. Here is your verified status report: ` +
          `First, upcoming deadlines: ${digest.upcomingDeadlinesCount} application forms have cutoffs approaching soon, including GATE 2027 closing on October 31 and CAT 2026 closing on November 10. We recommend completing submissions 48 hours early. ` +
          `Second, government fee concessions and financial aid: Under ${profile.category} category regulations, estimated fee savings are ₹${feeSavings.toLocaleString('en-IN')}, and direct scholarship grants up to ₹2,00,000 per year are unlocked. ` +
          `Third, documents to prepare: Please renew the Family Income Certificate at your local Tehsil or Common Service Center immediately; processing takes 14 to 18 working days. ` +
          `Finally, safety advisory: Authentic government exams and scholarships operate exclusively on official .gov.in portals. Never pay unauthorized agents or unverified links. Thank you.`;
      } else if (section === 'deadlines') {
        narration = `Upcoming deadlines briefing: ${digest.upcomingDeadlinesCount} key application deadlines are approaching for ${firstName} this month, including GATE 2027 closing on October 31 and CAT 2026 closing on November 10. Submit early to prevent server rush.`;
      } else if (section === 'finances') {
        narration = `Financial benefits summary: Under ${profile.category} category guidelines, eligible application fee concessions amount to ₹${feeSavings.toLocaleString('en-IN')}. Furthermore, up to ₹2,00,000 in direct scholarship grants are deposited straight into the student's bank account via DBT.`;
      } else if (section === 'documents') {
        narration = `Document checklist for parents: Renew the official Family Income Certificate for Financial Year 2026-27 at the local Tehsil or CSC center. Processing requires 14 to 18 days. Ensure names match exactly across school certificates and Aadhaar.`;
      } else if (section === 'advisory') {
        narration = `Parent guidance and safety advisory: Support ${firstName} with an encouraging, focused home routine. Never pay unofficial agents or cash—all authentic registrations take place strictly on verified .gov.in portals.`;
      }
    }

    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.rate = currentRate;
    utterance.pitch = 1.0;

    // Smart Voice Selection: Match Hindi or Indian/English voice
    if (lang === 'hi') {
      utterance.lang = 'hi-IN';
      const hindiVoice = availableVoices.find(
        (v) =>
          v.lang === 'hi-IN' ||
          v.lang.startsWith('hi') ||
          v.name.toLowerCase().includes('hindi') ||
          v.name.includes('हिन्दी')
      );
      if (hindiVoice) utterance.voice = hindiVoice;
    } else {
      utterance.lang = 'en-IN';
      const indianVoice = availableVoices.find(
        (v) => v.lang === 'en-IN' || v.name.toLowerCase().includes('india')
      );
      const generalEnVoice = indianVoice || availableVoices.find((v) => v.lang.startsWith('en'));
      if (generalEnVoice) utterance.voice = generalEnVoice;
    }

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setActiveAudioSection(null);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setActiveAudioSection(null);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
    setActiveAudioSection(section);
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setActiveAudioSection(null);
  };

  // WhatsApp Share for Parents (formatted beautifully)
  const shareWhatsAppSummary = () => {
    const text =
      lang === 'hi'
        ? `📢 *ज्ञानसेतु परिवार मार्गदर्शन रिपोर्ट - ${studentName}*\n\n` +
          `⏳ *आगामी अंतिम तारीखें:*\n• गेट २०२७ (३१ अक्टूबर)\n• कैट २०२६ (१० नवंबर)\n• पीएम-यूएसपी स्कॉलरशिप (३० नवंबर)\n\n` +
          `💰 *सरकारी फीस छूट व छात्रवृत्ति:*\n• श्रेणी: ${profile.category}\n• फॉर्म फीस में छूट: ₹${feeSavings.toLocaleString('en-IN')}\n• छात्रवृत्ति सहायता: ₹२,००,००० तक सीधे बैंक खाते में (DBT)\n\n` +
          `📑 *तहसील के जरूरी कागजात:*\n• नया पारिवारिक आय प्रमाण पत्र तुरंत बनवाएं (१४-१८ दिन समय लगता है)।\n\n` +
          `🛡️ *सतर्कता संदेश:* किसी दलाल को पैसे न दें। सभी फॉर्म केवल .gov.in आधिकारिक वेबसाइट पर ही भरें।\n\n` +
          `🔗 ज्ञानसेतु पोर्टल: ${window.location.origin}`
        : `📢 *GyanSetu Family Briefing - ${studentName}*\n\n` +
          `⏳ *Upcoming Deadlines:*\n• GATE 2027 (Closing Oct 31)\n• CAT 2026 (Closing Nov 10)\n• PM-USP Scholarship (Closing Nov 30)\n\n` +
          `💰 *Government Aid & Fee Waivers:*\n• Category: ${profile.category}\n• Fee Savings: ₹${feeSavings.toLocaleString('en-IN')}\n• Scholarship Aid Eligible: Up to ₹2,00,000/yr via DBT\n\n` +
          `📑 *Critical Document:*\n• Renew Family Income Certificate at local Tehsil/CSC (takes 14-18 days).\n\n` +
          `🛡️ *Safety Notice:* Apply only via official .gov.in portals. Never pay unauthorized agents.\n\n` +
          `🔗 GyanSetu Portal: ${window.location.origin}`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 print:p-0 print:m-0 print:space-y-4">
      {/* 1. Top Welcome Card with Voice Button and In-Page Language Switcher */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-900/15 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none opacity-15">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-white/30"></div>
          <div className="absolute right-16 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white/20 blur-xl"></div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>
                  {lang === 'hi'
                    ? 'अभिभावक एवं परिवार मार्गदर्शन केंद्र'
                    : 'Parent & Family Guidance Center'}
                </span>
              </div>

              {/* In-Page Language Toggle Pill (Instant Bilingual Switch) */}
              <div className="inline-flex p-0.5 rounded-xl bg-black/20 backdrop-blur-xs border border-white/20 text-xs font-bold print:hidden">
                <button
                  type="button"
                  onClick={() => lang !== 'en' && onToggleLanguage?.()}
                  className={`cursor-pointer px-2.5 py-0.5 rounded-lg transition ${
                    lang === 'en'
                      ? 'bg-white text-amber-900 shadow-xs'
                      : 'text-amber-100 hover:text-white'
                  }`}
                  title="Switch to English"
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => lang !== 'hi' && onToggleLanguage?.()}
                  className={`cursor-pointer px-2.5 py-0.5 rounded-lg transition ${
                    lang === 'hi'
                      ? 'bg-white text-amber-900 shadow-xs'
                      : 'text-amber-100 hover:text-white'
                  }`}
                  title="हिन्दी में बदलें"
                >
                  हिन्दी
                </button>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {lang === 'hi'
                ? `${studentName} के करियर व छात्रवृत्ति की स्थिति`
                : `Career & Scholarship Status for ${studentName}`}
            </h2>

            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed max-w-2xl">
              {lang === 'hi'
                ? 'माता-पिता और परिवार के लिए सरल हिंदी में स्पष्ट, सत्यापित व पारदर्शी जानकारी।'
                : 'Simplified, verified, and transparent updates prepared especially for parents and guardians.'}
            </p>
          </div>

          {/* Voice Assistance & TTS Control Center (Our Core USP) */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0 print:hidden">
            <div className="flex items-center gap-2">
              {/* Speed Preset Selector */}
              <div
                className="flex items-center gap-1 bg-black/20 p-1 rounded-2xl border border-white/20"
                title={lang === 'hi' ? 'आवाज़ की गति' : 'Speech Speed'}
              >
                {[0.8, 1.0, 1.2].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => {
                      setSpeechRate(rate);
                      if (isPlayingAudio && activeAudioSection) {
                        speakSection(activeAudioSection, rate);
                      }
                    }}
                    className={`cursor-pointer px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                      speechRate === rate
                        ? 'bg-white text-amber-900 shadow-xs'
                        : 'text-amber-100 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Main Listen Button */}
              <button
                type="button"
                onClick={() => speakSection('all')}
                className={`cursor-pointer px-4.5 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 ${
                  isPlayingAudio && activeAudioSection === 'all'
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-white text-amber-950 shadow-amber-900/20 hover:bg-amber-50'
                }`}
              >
                {isPlayingAudio && activeAudioSection === 'all' ? (
                  <>
                    <VolumeX className="w-5 h-5 text-white" />
                    <span>{lang === 'hi' ? 'आवाज़ रोकें (Stop)' : 'Stop Listening'}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5 text-amber-600" />
                    <span>
                      {lang === 'hi' ? '🔊 पूरा सार सुनें (Listen All)' : '🔊 Listen to Briefing'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Active Voice Equalizer Indicator */}
            {isPlayingAudio && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-xs border border-white/20 text-xs font-semibold">
                <div className="flex items-end gap-1 h-3.5">
                  <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:0ms] h-2"></span>
                  <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:150ms] h-3.5"></span>
                  <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:300ms] h-2.5"></span>
                  <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:75ms] h-3"></span>
                </div>
                <span className="text-[11px] font-bold text-amber-50">
                  {lang === 'hi'
                    ? `आवाज़ चालू है • ${speechRate}x (${activeAudioSection === 'all' ? 'संपूर्ण' : 'खंड'})`
                    : `Now Speaking • ${speechRate}x (${activeAudioSection})`}
                </span>
                <button
                  type="button"
                  onClick={stopAudio}
                  className="cursor-pointer ml-1 p-0.5 rounded-full hover:bg-white/20 text-amber-200"
                  title="Stop"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* WhatsApp Share & Print Bar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={shareWhatsAppSummary}
                className="cursor-pointer px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                title="Share briefing with family on WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'व्हाट्सएप पर भेजें' : 'Share on WhatsApp'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="cursor-pointer px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 transition"
                title="Print family handout"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'प्रिंट करें' : 'Print Handout'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Three Large Structured Family Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Deadlines (अंतिम तारीखें) */}
        <div
          className={`bg-white rounded-3xl border p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
            activeAudioSection === 'deadlines'
              ? 'ring-2 ring-amber-500 border-amber-300'
              : 'border-slate-200 hover:border-amber-200'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>

              {/* Individual Card Speaker Button */}
              <button
                type="button"
                onClick={() => speakSection('deadlines')}
                className={`cursor-pointer p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition ${
                  activeAudioSection === 'deadlines'
                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                } print:hidden`}
                title={lang === 'hi' ? 'केवल तारीखें सुनें' : 'Listen to deadlines'}
              >
                {activeAudioSection === 'deadlines' ? (
                  <VolumeX className="w-4 h-4 text-rose-600" />
                ) : (
                  <Volume2 className="w-4 h-4 text-amber-600" />
                )}
                <span className="text-[11px]">{lang === 'hi' ? 'सुनें' : 'Listen'}</span>
              </button>
            </div>

            <div>
              <h3 className="font-black text-slate-900 text-lg">
                {lang === 'hi' ? 'आगामी अंतिम तारीखें' : 'Upcoming Deadlines'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                {lang === 'hi'
                  ? `इस महीने ${digest.upcomingDeadlinesCount} परीक्षाओं व छात्रवृत्ति फॉर्म की अंतिम तिथि नजदीक है।`
                  : `${digest.upcomingDeadlinesCount} key application forms have cutoffs approaching soon.`}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 text-xs text-amber-950 font-bold border border-amber-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span>{lang === 'hi' ? '• गेट २०२७ (GATE 2027)' : '• GATE 2027 (IIT Roorkee)'}</span>
                <span className="text-amber-800 font-extrabold">{lang === 'hi' ? '३१ अक्टूबर' : '31 Oct'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{lang === 'hi' ? '• कैट २०२६ (CAT 2026)' : '• CAT 2026 (IIM Adm.)'}</span>
                <span className="text-amber-800 font-extrabold">{lang === 'hi' ? '१० नवंबर' : '10 Nov'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{lang === 'hi' ? '• पीएम-यूएसपी छात्रवृत्ति' : '• PM-USP Central Scholarship'}</span>
                <span className="text-amber-800 font-extrabold">{lang === 'hi' ? '३० नवंबर' : '30 Nov'}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-amber-700 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              {lang === 'hi' ? '२ दिन पहले फॉर्म भरें' : 'Apply 48h prior'}
            </span>
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('Documents')}
                className="cursor-pointer text-[#5034df] hover:underline font-bold text-xs flex items-center gap-1 print:hidden"
              >
                <span>{lang === 'hi' ? 'कैलेंडर' : 'Calendar'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Financial Relief & Concessions (फीस में सरकारी छूट व छात्रवृत्ति) */}
        <div
          className={`bg-white rounded-3xl border p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
            activeAudioSection === 'finances'
              ? 'ring-2 ring-emerald-500 border-emerald-300'
              : 'border-slate-200 hover:border-emerald-200'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <IndianRupee className="w-6 h-6" />
              </div>

              {/* Individual Card Speaker Button */}
              <button
                type="button"
                onClick={() => speakSection('finances')}
                className={`cursor-pointer p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition ${
                  activeAudioSection === 'finances'
                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                } print:hidden`}
                title={lang === 'hi' ? 'केवल छूट विवरण सुनें' : 'Listen to savings'}
              >
                {activeAudioSection === 'finances' ? (
                  <VolumeX className="w-4 h-4 text-rose-600" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                )}
                <span className="text-[11px]">{lang === 'hi' ? 'सुनें' : 'Listen'}</span>
              </button>
            </div>

            <div>
              <h3 className="font-black text-slate-900 text-lg">
                {lang === 'hi' ? 'फीस में सरकारी छूट व छात्रवृत्ति' : 'Government Waivers & Grants'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                {lang === 'hi'
                  ? `${categoryLabel} श्रेणी व मेरिट के तहत परिवार के लिए आर्थिक लाभ:`
                  : `${categoryLabel} category & merit-based financial relief for the family:`}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/80 text-xs text-emerald-950 font-bold border border-emerald-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span>{lang === 'hi' ? 'फॉर्म फीस में कुल बचत:' : 'Exam Fee Concessions:'}</span>
                <span className="text-emerald-800 font-extrabold text-sm">
                  ₹{feeSavings.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60">
                <span>{lang === 'hi' ? 'संभावित छात्रवृत्ति (DBT):' : 'Scholarship Grants (DBT):'}</span>
                <span className="text-emerald-800 font-extrabold text-xs">
                  {lang === 'hi' ? '₹२,००,००० तक' : 'Up to ₹2,00,000'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            <span className="text-emerald-700 font-bold">● </span>
            {lang === 'hi'
              ? 'राशि सीधे आधार-लिंक्ड बैंक खाते (DBT) में जमा होती है।'
              : 'Direct Benefit Transfer (DBT) deposited straight to bank.'}
          </div>
        </div>

        {/* Card 3: Tehsil Documents (कागजात जो तुरंत बनवाने हैं) */}
        <div
          className={`bg-white rounded-3xl border p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
            activeAudioSection === 'documents'
              ? 'ring-2 ring-rose-500 border-rose-300'
              : 'border-slate-200 hover:border-rose-200'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>

              {/* Individual Card Speaker Button */}
              <button
                type="button"
                onClick={() => speakSection('documents')}
                className={`cursor-pointer p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition ${
                  activeAudioSection === 'documents'
                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                } print:hidden`}
                title={lang === 'hi' ? 'कागजात निर्देश सुनें' : 'Listen to documents'}
              >
                {activeAudioSection === 'documents' ? (
                  <VolumeX className="w-4 h-4 text-rose-600" />
                ) : (
                  <Volume2 className="w-4 h-4 text-rose-600" />
                )}
                <span className="text-[11px]">{lang === 'hi' ? 'सुनें' : 'Listen'}</span>
              </button>
            </div>

            <div>
              <h3 className="font-black text-slate-900 text-lg">
                {lang === 'hi' ? 'कागजात जो तुरंत बनवाने हैं' : 'Documents to Prepare Now'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                {lang === 'hi'
                  ? 'तहसील या लोक सेवा केंद्र (CSC / जन सेवा केंद्र) से नया प्रमाण पत्र बनवाएं:'
                  : 'Obtain or renew certificates at your local Tehsil or Common Service Center (CSC):'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/80 text-xs text-rose-950 font-bold border border-rose-200/80 space-y-1.5">
              <div className="flex items-start gap-1.5">
                <span className="text-rose-700 font-black">१.</span>
                <span>
                  {lang === 'hi'
                    ? 'पारिवारिक आय प्रमाण पत्र (FY 2026-27)'
                    : 'Family Income Certificate (< ₹8 LPA)'}
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-rose-700 font-black">२.</span>
                <span>
                  {lang === 'hi'
                    ? `${categoryLabel} जाति/श्रेणी प्रमाण पत्र`
                    : `${categoryLabel} Category Certificate`}
                </span>
              </div>
              <div className="pt-1 text-[11px] text-rose-800 font-extrabold">
                {lang === 'hi' ? 'समय लगता है: १४ से १८ कार्य दिवस' : 'Processing time: 14 to 18 working days'}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="text-rose-700 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'अंतिम तिथि से पहले आवश्यक' : 'Required before portal closes'}
            </span>
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('Documents')}
                className="cursor-pointer text-[#5034df] hover:underline font-bold text-xs flex items-center gap-1 print:hidden"
              >
                <span>{lang === 'hi' ? 'चेकलिस्ट' : 'Checklist'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Comprehensive Parent Advisory & Fraud Prevention Shield */}
      <div
        className={`bg-white rounded-3xl border p-6 sm:p-8 shadow-xs space-y-5 transition-all ${
          activeAudioSection === 'advisory'
            ? 'ring-2 ring-[#5034df] border-[#5034df]/40'
            : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>
              {lang === 'hi'
                ? 'अभिभावकों के लिए मुख्य सलाह व मार्गदर्शन'
                : 'Parent Advisory & Guidance Report'}
            </span>
          </h3>

          <button
            type="button"
            onClick={() => speakSection('advisory')}
            className={`cursor-pointer p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition ${
              activeAudioSection === 'advisory'
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-[#ece8ff] hover:text-[#5034df]'
            } print:hidden`}
            title={lang === 'hi' ? 'सलाह सुनें' : 'Listen to advisory'}
          >
            {activeAudioSection === 'advisory' ? (
              <VolumeX className="w-4 h-4 text-rose-600" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#5034df]" />
            )}
            <span className="text-[11px]">{lang === 'hi' ? 'सलाह सुनें' : 'Listen to Advice'}</span>
          </button>
        </div>

        {/* Dynamic Verified Parent Advisory Body */}
        <div className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
          <p>
            {lang === 'hi'
              ? `आदरणीय अभिभावकगण, ${studentName} इस समय अपने करियर और उच्च शिक्षा की महत्वपूर्ण तैयारी कर रहे हैं। इस माह कई प्रमुख प्रतियोगी परीक्षाओं और केंद्रीय छात्रवृत्ति योजनाओं के आवेदन खुले हैं। परिवार की ओर से सबसे बड़ा व्यावहारिक सहयोग यह होगा कि तहसील या जन सेवा केंद्र से नया 'पारिवारिक आय प्रमाण पत्र' समय पर बनवा लें तथा घर में बिना परीक्षा तनाव के अध्ययन का शांत माहौल सुनिश्चित करें।`
              : `Dear Parents & Guardians, ${studentName} is currently preparing for key career milestones and scholarship applications. Multiple central opportunities are currently accepting submissions. Your most impactful practical support as a family this month is securing the updated Family Income Certificate from the Tehsil early, and providing a calm, encouraging routine at home without exam pressure.`}
          </p>
        </div>

        {/* Fraud, Broker & Scam Prevention Warning (Critical for rural & semi-urban families) */}
        <div className="p-4.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-3.5">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-800 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs text-amber-950 leading-relaxed space-y-1">
            <p className="font-extrabold text-amber-900">
              {lang === 'hi' ? '🔒 सतर्कता व सुरक्षा संदेश:' : '🔒 Official Verification & Scam Warning:'}
            </p>
            <p>
              {lang === 'hi'
                ? 'किसी भी निजी दलाल, एजेंट या व्हाट्सएप फॉरवर्ड पर पैसे न दें। भारत सरकार व राज्यों के सभी वास्तविक फॉर्म केवल ".gov.in" अथवा ".nic.in" अधिकृत पोर्टल्स पर ही भरे जाते हैं। ज्ञानसेतु केवल शत-प्रतिशत सत्यापित पोर्टल्स का मार्गदर्शन देता है।'
                : 'Never transfer money or share OTPs with private agents, brokers, or unofficial WhatsApp links. Authentic central and state government registrations strictly occur on genuine portals ending in ".gov.in" or ".nic.in". GyanSetu guides you safely to official portals.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
