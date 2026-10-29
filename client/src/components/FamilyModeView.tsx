import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Users,
  IndianRupee,
  Calendar,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import type { StudentProfile, WeeklyDigest, ApplicationCostPlan } from '../types';

interface FamilyModeViewProps {
  profile: StudentProfile;
  digest: WeeklyDigest;
  costPlan: ApplicationCostPlan;
}

export const FamilyModeView: React.FC<FamilyModeViewProps> = ({
  profile,
  digest,
  costPlan
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const speakText = () => {
    if (!('speechSynthesis' in window)) {
      alert('आपके ब्राउज़र में आवाज़ (Text-to-Speech) सुविधा उपलब्ध नहीं है।');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const narration = `नमस्ते! ज्ञानसेतु परिवार मोड में आपका स्वागत है। 
    विद्यार्थी ${profile.fullName} के लिए इस सप्ताह की ताज़ा रिपोर्ट: 
    ${digest.hindiParentSummary} 
    सरकारी छूट के कारण फॉर्म फीस में कुल ₹${costPlan.totalSavedViaWaivers.toLocaleString('en-IN')} की बचत हो रही है। 
    कृपया तहसील या सीएससी सेंटर जाकर समय पर आय प्रमाण पत्र बनवा लें ताकि छात्रवृत्ति का लाभ न छूटे।`;

    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Welcome Card with Voice Button */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>अभिभावक एवं परिवार मार्गदर्शन केंद्र</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {profile.fullName} के करियर व छात्रवृत्ति की स्थिति
            </h2>
            <p className="text-sm text-amber-100 mt-1.5 leading-relaxed">
              माता-पिता और परिवार के लिए सरल हिंदी में स्पष्ट जानकारी।
            </p>
          </div>

          {/* Voice Assistance Button */}
          <button
            onClick={speakText}
            className={`cursor-pointer px-4 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 shrink-0 ${
              isPlayingAudio
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-white text-amber-900 shadow-amber-900/20'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-5 h-5 text-white" />
                <span>आवाज़ रोकें (Stop)</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 text-amber-600" />
                <span>🔊 आवाज़ में सुनें (Listen)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3 Large Simple Family Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Deadlines */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-black text-slate-900 text-lg">
            अंतिम तारीखें
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            इस सप्ताह <strong>{digest.upcomingDeadlinesCount} परीक्षाओं/फॉर्म्स</strong> की अंतिम तारीख नजदीक है।
          </p>
          <div className="p-3 rounded-xl bg-amber-50 text-xs text-amber-950 font-bold border border-amber-200">
            • GATE 2027 (३१ अक्टूबर)<br />
            • CAT 2026 (१० नवंबर)
          </div>
        </div>

        {/* Card 2: Financial Relief */}
        <div className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
          <h3 className="font-black text-slate-900 text-lg">
            फीस में सरकारी बचत
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {profile.category} श्रेणी व सरकारी छूट के तहत फॉर्म फीस में बड़ी बचत:
          </p>
          <div className="p-3 rounded-xl bg-emerald-50 text-xs text-emerald-950 font-black border border-emerald-200">
            कुल बचत: ₹{costPlan.totalSavedViaWaivers.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Card 3: Tehsil Documents */}
        <div className="bg-white rounded-3xl border border-rose-200 p-6 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <h3 className="font-black text-slate-900 text-lg">
            कागजात जो बनवाने हैं
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            तहसील या लोक सेवा केंद्र (CSC) से नया <strong>आय प्रमाण पत्र</strong> तुरंत बनवाएं।
          </p>
          <div className="p-3 rounded-xl bg-rose-50 text-xs text-rose-950 font-bold border border-rose-200">
            समय लगता है: १४ से १८ दिन
          </div>
        </div>
      </div>

      {/* Parent Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>अभिभावकों के लिए मुख्य सलाह</span>
        </h3>
        <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
          {digest.hindiParentSummary}
        </p>

        {/* Safety caution */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 leading-relaxed">
            <strong>सतर्कता संदेश:</strong> किसी भी अनाधिकृत दलाल या अनजानी वेबसाइट को पैसे न दें। सभी फॉर्म भारत सरकार के आधिकारिक पोर्टल पर ही भरे जाते हैं।
          </div>
        </div>
      </div>
    </div>
  );
};
