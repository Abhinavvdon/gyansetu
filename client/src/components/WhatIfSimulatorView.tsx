import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  Sparkles,
  Unlock,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Award,
  HelpCircle
} from 'lucide-react';
import type { WhatIfSimulationResponse, WhatIfSimulationRequest, StudentProfile } from '../types';
import { GyanSetuApi } from '../api/client';

interface WhatIfSimulatorViewProps {
  profile: StudentProfile | null;
  lang: 'en' | 'hi';
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({ profile, lang }) => {
  const [ugMarks, setUgMarks] = useState<number>(profile?.ugMarksPercent ?? 75);
  const [twelfthMarks, setTwelfthMarks] = useState<number>(profile?.twelfthMarksPercent ?? 75);
  const [category, setCategory] = useState<string>(profile?.category ?? 'General');
  const [income, setIncome] = useState<number>(profile?.annualFamilyIncome ?? 500000);
  const [age, setAge] = useState<number>(profile?.age ?? 21);
  const [isDegreeCompleted, setIsDegreeCompleted] = useState<boolean>(profile?.educationLevel === 'UG Completed');

  const [simulationResult, setSimulationResult] = useState<WhatIfSimulationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await GyanSetuApi.simulateWhatIf({
        simulatedUgMarks: ugMarks,
        simulatedTwelfthMarks: twelfthMarks,
        simulatedCategory: category,
        simulatedIncome: income,
        simulatedAge: age,
        simulatedDegreeCompleted: isDegreeCompleted
      });
      setSimulationResult(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [ugMarks, twelfthMarks, category, income, age, isDegreeCompleted]);

  const resetToProfile = () => {
    setUgMarks(profile?.ugMarksPercent ?? 75);
    setTwelfthMarks(profile?.twelfthMarksPercent ?? 75);
    setCategory(profile?.category ?? 'General');
    setIncome(profile?.annualFamilyIncome ?? 500000);
    setAge(profile?.age ?? 21);
    setIsDegreeCompleted(profile?.educationLevel === 'UG Completed');
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-soft">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-400/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{lang === 'hi' ? 'व्हाट-इफ़ पात्रता प्रयोगशाला' : 'What-If Eligibility Simulation Lab'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {lang === 'hi'
            ? 'अगर आपके अंक या योग्यता बदलें, तो कौन-से नए अवसर खुलेंगे?'
            : 'Explore Newly Unlocked Doors: Test Changes in Marks, Category & Income'}
        </h2>
        <p className="text-sm text-emerald-100 mt-2 max-w-2xl leading-relaxed">
          {lang === 'hi'
            ? 'स्लाइडर्स को हिलाकर देखें कि कॉलेज में थोड़ा बेहतर स्कोर, आय में बदलाव या आरक्षण प्रमाणपत्र होने पर कितनी नई सरकारी नौकरियां व छात्रवृत्तियां अनलॉक हो सकती हैं।'
            : 'Interactive backward simulator demonstrating which scholarships, executive posts, or premier fellowships unlock at each milestone.'}
        </p>
      </div>

      {/* Simulator Controls & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Sliders (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'hi' ? 'सिम्युलेशन पैरामीटर्स' : 'Simulation Controls'}</span>
            </h3>
            <button
              onClick={resetToProfile}
              className="cursor-pointer text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{lang === 'hi' ? 'रीसेट' : 'Reset'}</span>
            </button>
          </div>

          {/* Graduation Marks Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>{lang === 'hi' ? 'ग्रेजुएशन प्राप्तांक %' : 'Graduation / UG Marks:'}</span>
              <span className="font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                {ugMarks}%
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="95"
              step="1"
              value={ugMarks}
              onChange={(e) => setUgMarks(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-medium">
              <span>40% Pass</span>
              <span className="text-amber-700 font-semibold">50% Cutoff</span>
              <span className="text-emerald-700 font-semibold">60% 1st Class</span>
              <span>95% Distinction</span>
            </div>
          </div>

          {/* Class 12th Marks Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>{lang === 'hi' ? '12वीं बोर्ड प्राप्तांक %' : 'Class 12th Board Marks:'}</span>
              <span className="font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                {twelfthMarks}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="98"
              step="1"
              value={twelfthMarks}
              onChange={(e) => setTwelfthMarks(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-medium">
              <span>50%</span>
              <span className="text-amber-700 font-semibold">80% NSP Cutoff</span>
              <span>98%</span>
            </div>
          </div>

          {/* Category Switcher */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700">
              {lang === 'hi' ? 'आरक्षण श्रेणी सिम्युलेट करें:' : 'Simulate Category:'}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['General', 'OBC-NCL', 'SC', 'ST', 'EWS'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`cursor-pointer py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                    category === cat
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Annual Income Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>{lang === 'hi' ? 'पारिवारिक वार्षिक आय:' : 'Annual Family Income:'}</span>
              <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                ₹{income.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="100000"
              max="900000"
              step="50000"
              value={income}
              onChange={(e) => setIncome(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-medium">
              <span>₹1 Lakh</span>
              <span className="text-emerald-700 font-semibold">₹2.5L (Post-Matric)</span>
              <span className="text-indigo-700 font-semibold">₹4.5L (PM-USP)</span>
              <span>₹9 Lakh</span>
            </div>
          </div>

          {/* Age Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>{lang === 'hi' ? 'उम्र सिम्युलेट करें:' : 'Simulate Age:'}</span>
              <span className="font-mono text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded">
                {age} Years
              </span>
            </div>
            <input
              type="range"
              min="18"
              max="35"
              step="1"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Column: Unlocked Opportunities Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top Score Comparison */}
          {simulationResult && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {lang === 'hi' ? 'सिम्युलेशन परिणाम' : 'Simulation Impact'}
                </div>
                <div className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
                  <span>{simulationResult.simulatedEligibleCount} Opportunities</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    +{simulationResult.netUnlockedCount} Newly Unlocked!
                  </span>
                </div>
              </div>
              <div className="text-right text-xs text-slate-500">
                Baseline: <strong>{simulationResult.baselineEligibleCount}</strong>
              </div>
            </div>
          )}

          {/* Unlocked Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'hi' ? 'सिम्युलेशन से खुले नए अवसर (Newly Unlocked Opportunities)' : 'Opportunities Unlocked with Current Sliders'}</span>
            </h4>

            {simulationResult?.unlockedOpportunities.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs relative overflow-hidden transition-all hover:shadow-card"
              >
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Unlocked!</span>
                </div>

                <div className="pr-16">
                  <h4 className="font-extrabold text-slate-900 text-base">
                    {item.title}
                  </h4>
                  <div className="text-xs text-emerald-800 font-semibold mt-1">
                    {item.benefits}
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-slate-700 leading-relaxed">
                  <strong>Why it unlocked:</strong> {item.unlockReason}
                </div>
              </div>
            ))}
          </div>

          {/* AI Strategic Insights */}
          {simulationResult && simulationResult.strategicInsights.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-5 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>{lang === 'hi' ? 'एआई रणनीतिक सुझाव' : 'Strategic Action Plan'}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 pl-4 list-disc">
                {simulationResult.strategicInsights.map((insight, idx) => (
                  <li key={idx} className="leading-relaxed">{insight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
