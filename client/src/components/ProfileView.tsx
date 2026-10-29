import React, { useState } from 'react';
import {
  User as UserIcon,
  GraduationCap,
  Percent,
  Landmark,
  MapPin,
  Calendar,
  Save,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import type { StudentProfile, User } from '../types';

interface ProfileViewProps {
  profile: StudentProfile;
  currentUser: User | null;
  onSave: (updated: StudentProfile) => Promise<void>;
  lang: 'en' | 'hi';
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  currentUser,
  onSave,
  lang
}) => {
  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const calculateProfileStrength = () => {
    let score = 0;
    if (formData.fullName) score += 15;
    if (formData.currentDegree) score += 15;
    if (formData.tenthMarksPercent > 0) score += 15;
    if (formData.twelfthMarksPercent > 0) score += 15;
    if (formData.ugMarksPercent > 0) score += 15;
    if (formData.category) score += 10;
    if (formData.annualFamilyIncome > 0) score += 10;
    if (formData.stateDomicile) score += 5;
    return Math.min(100, score);
  };

  const strength = calculateProfileStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onSave(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#5034df] to-[#7f5af0] text-white flex items-center justify-center font-black text-2xl shadow-md shadow-[#5034df]/20">
            {formData.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {formData.fullName}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#ece8ff] text-[#5034df]">
                {formData.category}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {formData.currentDegree} • {formData.stream} • Year {formData.currentYear}
            </p>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{formData.stateDomicile} Domicile</span>
              <span>•</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Age {formData.age} yrs</span>
            </div>
          </div>
        </div>

        {/* Profile Strength Indicator */}
        <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 min-w-[220px]">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {lang === 'hi' ? 'प्रोफ़ाइल पूर्णता' : 'Profile Strength'}
            </span>
            <span className="text-[#5034df]">{strength}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#5034df] to-[#7f5af0] h-2 rounded-full transition-all duration-500"
              style={{ width: `${strength}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">
            {strength >= 90
              ? 'Excellent! AI matching has maximum accuracy.'
              : 'Add missing marks for better scholarship matching.'}
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            {lang === 'hi'
              ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई और पात्रता इंजन में पुनर्गणना की गई!'
              : 'Profile updated successfully and eligibility engines recalculated!'}
          </span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-[#5034df] flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            <span>{lang === 'hi' ? '1. व्यक्तिगत विवरण' : '1. Personal Information'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'hi' ? 'पूरा नाम' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'hi' ? 'लिंग' : 'Gender'}
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female (Eligible for Pragati/Girl Child Schemes)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'hi' ? 'आयु (वर्षों में)' : 'Age (Years)'}
              </label>
              <input
                type="number"
                min="14"
                max="50"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-[#5034df] flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>{lang === 'hi' ? '2. शैक्षणिक योग्यता व अंक' : '2. Academic Qualifications & Marks'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'hi' ? 'वर्तमान डिग्री / पाठ्यक्रम' : 'Current Degree'}
              </label>
              <input
                type="text"
                value={formData.currentDegree}
                onChange={(e) => setFormData({ ...formData, currentDegree: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'hi' ? 'वर्तमान वर्ष' : 'Current Year'}
              </label>
              <select
                value={formData.currentYear}
                onChange={(e) => setFormData({ ...formData, currentYear: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none bg-white"
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year (Final Year)</option>
                <option value={4}>4th Year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'hi' ? 'स्ट्रीम / विषय क्षेत्र' : 'Academic Stream'}
              </label>
              <input
                type="text"
                value={formData.stream}
                onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>{lang === 'hi' ? '10वीं बोर्ड अंक (%)' : '10th Board Marks (%)'}</span>
                <span className="text-slate-400 font-mono">{formData.tenthMarksPercent}%</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="35"
                max="100"
                value={formData.tenthMarksPercent}
                onChange={(e) => setFormData({ ...formData, tenthMarksPercent: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>{lang === 'hi' ? '12वीं बोर्ड अंक (%)' : '12th Board Marks (%)'}</span>
                <span className="text-slate-400 font-mono">{formData.twelfthMarksPercent}%</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="35"
                max="100"
                value={formData.twelfthMarksPercent}
                onChange={(e) => setFormData({ ...formData, twelfthMarksPercent: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>{lang === 'hi' ? 'स्नातक / UG अंक (%)' : 'UG / Graduation Marks (%)'}</span>
                <span className="text-slate-400 font-mono">{formData.ugMarksPercent}%</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="35"
                max="100"
                value={formData.ugMarksPercent}
                onChange={(e) => setFormData({ ...formData, ugMarksPercent: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-[#5034df] flex items-center gap-2">
            <Landmark className="w-4 h-4" />
            <span>{lang === 'hi' ? '3. सामाजिक श्रेणी व पारिवारिक आय' : '3. Social Category & Family Income'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'hi' ? 'आरक्षण श्रेणी' : 'Reservation Category'}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none bg-white font-semibold"
              >
                <option value="General">General (Unreserved)</option>
                <option value="OBC-NCL">OBC-NCL (Age +3 yrs relaxation)</option>
                <option value="SC">SC (Scheduled Caste - 100% Fee Waiver)</option>
                <option value="ST">ST (Scheduled Tribe - 100% Fee Waiver)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
                <option value="PwD">PwD (Persons with Benchmark Disabilities)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>{lang === 'hi' ? 'वार्षिक पारिवारिक आय' : 'Annual Family Income (₹)'}</span>
                <span className="text-slate-400 font-mono">₹{formData.annualFamilyIncome.toLocaleString('en-IN')}</span>
              </label>
              <input
                type="number"
                step="10000"
                min="0"
                max="2500000"
                value={formData.annualFamilyIncome}
                onChange={(e) => setFormData({ ...formData, annualFamilyIncome: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'hi' ? 'मूल निवास राज्य (Domicile State)' : 'State of Domicile'}
              </label>
              <select
                value={formData.stateDomicile}
                onChange={(e) => setFormData({ ...formData, stateDomicile: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none bg-white font-semibold"
              >
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Bihar">Bihar</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Karnataka">Karnataka</option>
                <option value="All India">All India</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Profile changes automatically update eligibility across all scholarships and government exams.</span>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer px-6 py-2.5 rounded-full bg-[#5034df] hover:bg-[#3f24cb] text-white text-xs font-bold shadow-md shadow-[#5034df]/20 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : lang === 'hi' ? 'प्रोफ़ाइल सहेजें' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
