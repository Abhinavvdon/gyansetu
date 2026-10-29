import React, { useState } from 'react';
import { X, Save, User, Award, IndianRupee, MapPin, GraduationCap, CheckCircle } from 'lucide-react';
import type { StudentProfile } from '../types';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSave: (updated: StudentProfile) => void;
  lang: 'en' | 'hi';
}

const INDIAN_STATES = [
  'All India', 'Madhya Pradesh', 'Uttar Pradesh', 'Bihar', 'Rajasthan', 'Maharashtra',
  'Karnataka', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Delhi', 'Haryana',
  'Punjab', 'Jharkhand', 'Chhattisgarh', 'Odisha', 'Kerala', 'Telangana', 'Andhra Pradesh'
];

const STREAMS = [
  'Engineering / Technology',
  'Science PCM',
  'Science PCB / Medical',
  'Commerce / Accountancy',
  'Arts & Humanities',
  'Law / Legal Studies',
  'Any Stream (General Graduation)'
];

const CAREER_GOALS_LIST = [
  'Govt Jobs (SSC / UPSC / State PSC)',
  'Public Sector Banking (IBPS / SBI PO)',
  'Indian Railways (RRB NTPC)',
  'Higher Studies (GATE / M.Tech / PhD)',
  'Premier Management (CAT / IIMs)',
  'National & State Scholarships (DBT Cash Grants)',
  'Defence & Paramilitary (CDS / AFCAT)'
];

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  lang
}) => {
  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 800);
  };

  const toggleGoal = (goal: string) => {
    const set = new Set(formData.careerGoals);
    if (set.has(goal)) set.delete(goal);
    else set.add(goal);
    setFormData({ ...formData, careerGoals: Array.from(set) });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-700/60 rounded-lg">
              <User className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {lang === 'hi' ? 'विद्यार्थी प्रोफ़ाइल (Personalised Profile)' : 'Personalised Student Profile'}
              </h2>
              <p className="text-xs text-indigo-200">
                {lang === 'hi'
                  ? 'सटीक जानकारी भरें ताकि एआई पात्रता इंजन सही अवसर ढूंढ सके।'
                  : 'Power your AI eligibility matching and fee concession engine.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-500" />
              <span>{lang === 'hi' ? '1. व्यक्तिगत जानकारी' : '1. Personal Details'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'पूरा नाम (Full Name)' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'लिंग (Gender)' : 'Gender'}
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  <option value="Male">Male (पुरुष)</option>
                  <option value="Female">Female (महिला - 100% Fee Waivers)</option>
                  <option value="Other">Other (अन्य)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'उम्र (Age in Years)' : 'Age (in Years)'}
                </label>
                <input
                  type="number"
                  min="15"
                  max="45"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 20 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'मूल निवास राज्य (State Domicile)' : 'State Domicile'}
                </label>
                <select
                  value={formData.stateDomicile}
                  onChange={(e) => setFormData({ ...formData, stateDomicile: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Reservation Category & Family Income */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'hi' ? '2. आरक्षण श्रेणी व आय' : '2. Category & Family Income'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'आरक्षण वर्ग (Category)' : 'Social Category'}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium"
                >
                  <option value="General">General (UR)</option>
                  <option value="OBC-NCL">OBC-NCL (Non-Creamy Layer - 3yr Age Relax)</option>
                  <option value="SC">SC (Scheduled Caste - ₹0 Fee, 5yr Age Relax)</option>
                  <option value="ST">ST (Scheduled Tribe - ₹0 Fee, 5yr Age Relax)</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                  <option value="PwD">PwD (Persons with Benchmark Disabilities)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'वार्षिक पारिवारिक आय (Annual Income)' : 'Annual Family Income (₹)'}
                </label>
                <input
                  type="number"
                  step="10000"
                  required
                  value={formData.annualFamilyIncome}
                  onChange={(e) => setFormData({ ...formData, annualFamilyIncome: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  ₹{formData.annualFamilyIncome.toLocaleString('en-IN')}/year
                  {formData.annualFamilyIncome <= 250000 && (
                    <span className="text-emerald-700 font-semibold ml-1.5">
                      ✓ Eligible for Post-Matric Free Ship
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Education & Qualifications */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'hi' ? '3. शैक्षणिक योग्यता (Qualifications)' : '3. Educational Status & Marks'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'वर्तमान स्तर (Current Level)' : 'Education Level'}
                </label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  <option value="12th Pursuing/Passed">Class 12th</option>
                  <option value="UG Pursuing">UG Pursuing (Ongoing Degree)</option>
                  <option value="UG Completed">UG Completed (Graduate)</option>
                  <option value="PG Pursuing/Completed">Post-Graduate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'कोर्स / डिग्री का नाम (Degree Title)' : 'Degree / Program'}
                </label>
                <input
                  type="text"
                  value={formData.currentDegree}
                  onChange={(e) => setFormData({ ...formData, currentDegree: e.target.value })}
                  placeholder="e.g. B.Tech Computer Science, B.Sc, B.Com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'विषय स्ट्रीम (Subject Stream)' : 'Academic Stream'}
                </label>
                <select
                  value={formData.stream}
                  onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  {STREAMS.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? '12वीं में प्राप्तांक % (Class 12th %)' : '12th Board Marks (%)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="100"
                  value={formData.twelfthMarksPercent}
                  onChange={(e) => setFormData({ ...formData, twelfthMarksPercent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'ग्रेजुएशन प्राप्तांक % (UG Degree %)' : 'Graduation / UG Marks (%)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="100"
                  value={formData.ugMarksPercent}
                  onChange={(e) => setFormData({ ...formData, ugMarksPercent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Career Goals */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-600" />
              <span>{lang === 'hi' ? '4. लक्ष्य एवं रुचियां (Career Ambitions)' : '4. Career Interests & Target Sectors'}</span>
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {CAREER_GOALS_LIST.map((goal) => {
                const isSelected = formData.careerGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`cursor-pointer w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{goal}</span>
                    {isSelected && <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-4 border-t border-slate-200 sticky bottom-0 bg-white">
            <button
              type="submit"
              className="cursor-pointer w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>
                {isSavedNotice
                  ? (lang === 'hi' ? '✓ सुरक्षित हो गया!' : '✓ Profile Saved!')
                  : (lang === 'hi' ? 'प्रोफ़ाइल सहेजें एवं पात्रता जांचें' : 'Save Profile & Recalculate AI Matches')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
