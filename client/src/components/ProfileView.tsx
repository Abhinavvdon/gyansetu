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
  AlertCircle,
  BookOpen,
  Award,
  Clock
} from 'lucide-react';
import type { StudentProfile, User } from '../types';
import { formatStudentName } from '../utils/languageUtils';

interface ProfileViewProps {
  profile: StudentProfile;
  currentUser: User | null;
  onSave: (updated: StudentProfile) => Promise<void>;
  lang: 'en' | 'hi';
}

const INDIAN_STATES = [
  'All India', 'Madhya Pradesh', 'Uttar Pradesh', 'Bihar', 'Rajasthan', 'Maharashtra',
  'Karnataka', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Delhi', 'Haryana',
  'Punjab', 'Jharkhand', 'Chhattisgarh', 'Odisha', 'Kerala', 'Telangana', 'Andhra Pradesh',
  'Assam', 'Himachal Pradesh', 'Uttarakhand', 'Jammu & Kashmir', 'Goa'
];

const STREAMS_12TH = [
  'Science (PCM - Physics, Chemistry, Maths)',
  'Science (PCB - Physics, Chemistry, Biology)',
  'Science (PCMB - All Sciences)',
  'Commerce / Business Studies with Maths',
  'Commerce without Maths',
  'Arts & Humanities',
  'Vocational / Technical Stream'
];

const UG_COURSES = [
  'B.Tech / B.E. (Engineering & Technology)',
  'B.Sc (Physical / Mathematical / Computing Sciences)',
  'B.Sc (Life Sciences / Bio / Agriculture)',
  'B.Com / B.Com (Honours)',
  'B.A. (Arts / Humanities / Social Sciences)',
  'BCA (Bachelor of Computer Applications)',
  'BBA / BMS (Bachelor of Business Administration)',
  'MBBS / BDS / BAMS (Medical)',
  'B.Pharm (Pharmacy)',
  'LLB / Integrated BA-LLB / BBA-LLB (Law)',
  'B.Des (Design / Architecture)',
  'Other Undergraduate Degree'
];

const PG_COURSES = [
  'M.Tech / M.E. (Master of Technology)',
  'MBA / PGDM (Master of Business Administration)',
  'M.Sc (Master of Science)',
  'M.Com (Master of Commerce)',
  'M.A. (Master of Arts)',
  'MCA (Master of Computer Applications)',
  'LLM (Master of Law)',
  'MD / MS (Medical Postgraduate)',
  'M.Pharm (Pharmacy)',
  'Other Postgraduate Degree'
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  currentUser,
  onSave,
  lang
}) => {
  const [formData, setFormData] = useState<StudentProfile>(() => ({
    ...profile,
    alreadyPursuedLevel: profile.alreadyPursuedLevel || '12th',
    alreadyPursuedStream: profile.alreadyPursuedStream || 'Science (PCM - Physics, Chemistry, Maths)',
    alreadyPursuedCourse: profile.alreadyPursuedCourse || '',
    diplomaMarksPercent: profile.diplomaMarksPercent || 0,
    pgMarksPercent: profile.pgMarksPercent || 0,
    phdStatus: profile.phdStatus || '',
    currentlyPursuingLevel: profile.currentlyPursuingLevel || 'UG',
    currentlyPursuingCourse: profile.currentlyPursuingCourse || profile.currentDegree || 'B.Tech Electronics and Telecommunication',
    currentlyPursuingYear: profile.currentlyPursuingYear || profile.currentYear || 3,
    currentlyPursuingStream: profile.currentlyPursuingStream || profile.stream || 'Engineering / Technology',
    currentCgpaOrAggregate: profile.currentCgpaOrAggregate || 0
  }));

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const calculateProfileStrength = () => {
    let score = 0;
    if (formData.fullName) score += 15;
    if (formData.alreadyPursuedLevel) score += 15;
    if (formData.tenthMarksPercent > 0) score += 15;
    if (formData.alreadyPursuedLevel !== '10th' && (formData.twelfthMarksPercent > 0 || (formData.diplomaMarksPercent || 0) > 0)) score += 15;
    if (formData.currentlyPursuingLevel) score += 15;
    if (formData.category) score += 10;
    if (formData.annualFamilyIncome > 0) score += 10;
    if (formData.stateDomicile) score += 5;
    return Math.min(100, score);
  };

  const strength = calculateProfileStrength();

  const handleAlreadyPursuedChange = (level: string) => {
    const updated = { ...formData, alreadyPursuedLevel: level };
    // If not completed UG, ensure ugMarksPercent is 0 so it never triggers false validation
    if (level === '10th' || level === '12th' || level === 'Diploma') {
      updated.ugMarksPercent = 0;
      updated.pgMarksPercent = 0;
    }
    setFormData(updated);
  };

  const handleCurrentlyPursuingChange = (level: string) => {
    const updated = { ...formData, currentlyPursuingLevel: level };
    if (level === 'None') {
      updated.educationLevel = formData.alreadyPursuedLevel + ' Completed';
    } else {
      updated.educationLevel = level + ' Pursuing';
    }
    setFormData(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Sync legacy fields
    const toSave: StudentProfile = {
      ...formData,
      currentDegree: formData.currentlyPursuingLevel !== 'None' 
        ? formData.currentlyPursuingCourse || formData.currentDegree 
        : (formData.alreadyPursuedCourse || formData.alreadyPursuedLevel || 'Completed'),
      currentYear: formData.currentlyPursuingYear || formData.currentYear || 1,
      stream: formData.currentlyPursuingStream || formData.stream || 'Engineering / Technology',
      educationLevel: formData.currentlyPursuingLevel !== 'None' 
        ? `${formData.currentlyPursuingLevel} Pursuing` 
        : `${formData.alreadyPursuedLevel} Completed`
    };

    try {
      await onSave(toSave);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper booleans for conditional marks fields
  const is12thDone = ['12th', 'UG', 'PG', 'PhD'].includes(formData.alreadyPursuedLevel || '');
  const isDiplomaDone = formData.alreadyPursuedLevel === 'Diploma';
  const isUgDone = ['UG', 'PG', 'PhD'].includes(formData.alreadyPursuedLevel || '');
  const isPgDone = ['PG', 'PhD'].includes(formData.alreadyPursuedLevel || '');
  const isPhdDone = formData.alreadyPursuedLevel === 'PhD';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#5034df] to-[#7f5af0] text-white flex items-center justify-center font-black text-2xl shadow-md shadow-[#5034df]/20">
            {formData.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {formatStudentName(formData.fullName, lang)}
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-[#ece8ff] dark:bg-[#5034df]/20 text-[#5034df] dark:text-[#c4b5fd]">
                {formData.category}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {formData.currentlyPursuingLevel !== 'None' ? (
                <>Currently Pursuing: <strong className="text-slate-700 dark:text-slate-200">{formData.currentlyPursuingCourse || formData.currentDegree}</strong> (Year {formData.currentlyPursuingYear})</>
              ) : (
                <>Highest Completed: <strong className="text-slate-700 dark:text-slate-200">{formData.alreadyPursuedLevel}</strong></>
              )}
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
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-4 min-w-[220px]">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'hi' ? 'प्रोफ़ाइल पूर्णता' : 'Profile Strength'}</span>
            </span>
            <span className="text-[#5034df] dark:text-[#a594fd]">{strength}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#5034df] to-[#7f5af0] h-2 rounded-full transition-all duration-500"
              style={{ width: `${strength}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">
            {strength >= 90
              ? 'Excellent! AI matching has maximum accuracy.'
              : 'Add missing marks for comprehensive eligibility evaluation.'}
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold">
            {lang === 'hi'
              ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई और सभी छात्रवृत्ति/परीक्षा पात्रताएं पुनः जांची गईं!'
              : 'Profile updated successfully! Eligibility across scholarships, exams, and admissions recalculated.'}
          </span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-7 transition-colors">
        
        {/* 1. PERSONAL INFORMATION */}
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#5034df] dark:text-[#a594fd] flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            <span>{lang === 'hi' ? '1. व्यक्तिगत विवरण' : '1. Personal Information'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'hi' ? 'पूरा नाम' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'hi' ? 'लिंग' : 'Gender'}
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none font-medium"
              >
                <option value="Male">Male (पुरुष)</option>
                <option value="Female">Female (महिला - 100% Fee Waivers & Pragati Scheme)</option>
                <option value="Other">Other (अन्य)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'hi' ? 'आयु (वर्षों में)' : 'Age (Years)'}
              </label>
              <input
                type="number"
                min="14"
                max="50"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. ACADEMIC QUALIFICATIONS & MARKS (REVAMPED) */}
        <div className="pt-5 border-t border-slate-100 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#5034df] dark:text-[#a594fd] flex items-center gap-2">
              <GraduationCap className="w-4.5 h-4.5" />
              <span>{lang === 'hi' ? '2. शैक्षणिक योग्यता व प्राप्तांक' : '2. Academic Qualifications & Marks'}</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              Hierarchical qualifications & ongoing pursuit
            </span>
          </div>

          {/* SUBSECTION A: ALREADY PURSUED (COMPLETED) */}
          <div className="p-4.5 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/70 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {lang === 'hi' ? 'पूर्व में पूर्ण की गई योग्यता (Already Pursued)' : 'Already Pursued (Completed Education)'}
                </span>
              </div>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                Completed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Highest Completed Qualification Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'hi' ? 'सर्वोच्च पूर्ण योग्यता' : 'Highest Completed Level'}
                </label>
                <select
                  value={formData.alreadyPursuedLevel}
                  onChange={(e) => handleAlreadyPursuedChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none font-semibold"
                >
                  <option value="10th">Class 10th (Secondary School - X)</option>
                  <option value="12th">Class 12th (Senior Secondary - XII)</option>
                  <option value="Diploma">Diploma / Polytechnic</option>
                  <option value="UG">Undergraduate (UG Degree - B.Tech, B.Sc, B.Com, B.A.)</option>
                  <option value="PG">Postgraduate (PG Degree - M.Tech, MBA, M.Sc, M.A.)</option>
                  <option value="PhD">Ph.D. / Doctoral Degree</option>
                </select>
              </div>

              {/* Conditional Stream for 12th */}
              {is12thDone && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? '12वीं स्ट्रीम (12th Stream)' : '12th Board Stream'}
                  </label>
                  <select
                    value={formData.alreadyPursuedStream}
                    onChange={(e) => setFormData({ ...formData, alreadyPursuedStream: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
                  >
                    {STREAMS_12TH.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Conditional Diploma Course */}
              {isDiplomaDone && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Diploma Branch / Stream
                  </label>
                  <input
                    type="text"
                    value={formData.alreadyPursuedCourse}
                    onChange={(e) => setFormData({ ...formData, alreadyPursuedCourse: e.target.value })}
                    placeholder="e.g. Polytechnic in Mechanical / Electrical / CS"
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
                  />
                </div>
              )}

              {/* Conditional UG Course */}
              {isUgDone && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Completed UG Course
                  </label>
                  <select
                    value={formData.alreadyPursuedCourse || 'B.Tech / B.E. (Engineering & Technology)'}
                    onChange={(e) => setFormData({ ...formData, alreadyPursuedCourse: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
                  >
                    {UG_COURSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Conditional PG Course */}
              {isPgDone && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Completed PG Course
                  </label>
                  <select
                    value={formData.alreadyPursuedCourse || 'M.Tech / M.E. (Master of Technology)'}
                    onChange={(e) => setFormData({ ...formData, alreadyPursuedCourse: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
                  >
                    {PG_COURSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Conditional PhD Domain */}
              {isPhdDone && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Doctoral Research Discipline
                  </label>
                  <input
                    type="text"
                    value={formData.phdStatus}
                    onChange={(e) => setFormData({ ...formData, phdStatus: e.target.value })}
                    placeholder="e.g. AI / Renewable Energy / Physics"
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
                  />
                </div>
              )}
            </div>

            {/* MARKS SECTION: Automatically asks marks in selected category as well as categories already meant to be completed */}
            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-2.5">
                Marks obtained in completed qualifications (Foundation & Qualifying scores):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* 10th Marks (Always required for any Indian educational pathway) */}
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center justify-between">
                    <span>10th Board Marks</span>
                    <span className="text-[#5034df] dark:text-[#a594fd] font-mono">{formData.tenthMarksPercent}%</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="35"
                    max="100"
                    required
                    value={formData.tenthMarksPercent}
                    onChange={(e) => setFormData({ ...formData, tenthMarksPercent: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-[#5034df]"
                  />
                </div>

                {/* 12th Marks (Required if 12th, UG, PG, or PhD is already pursued) */}
                {is12thDone && (
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center justify-between">
                      <span>12th Board Marks</span>
                      <span className="text-[#5034df] dark:text-[#a594fd] font-mono">{formData.twelfthMarksPercent}%</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="35"
                      max="100"
                      required
                      value={formData.twelfthMarksPercent}
                      onChange={(e) => setFormData({ ...formData, twelfthMarksPercent: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-[#5034df]"
                    />
                  </div>
                )}

                {/* Diploma Marks (Required if Diploma is pursued) */}
                {isDiplomaDone && (
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center justify-between">
                      <span>Diploma Aggregate</span>
                      <span className="text-[#5034df] dark:text-[#a594fd] font-mono">{formData.diplomaMarksPercent || 0}%</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="35"
                      max="100"
                      required
                      value={formData.diplomaMarksPercent || 0}
                      onChange={(e) => setFormData({ ...formData, diplomaMarksPercent: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-[#5034df]"
                    />
                  </div>
                )}

                {/* UG / Graduation Marks (Asked ONLY if UG, PG, or PhD is ALREADY completed) */}
                {isUgDone && (
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center justify-between">
                      <span>UG Degree Aggregate</span>
                      <span className="text-[#5034df] dark:text-[#a594fd] font-mono">{formData.ugMarksPercent}%</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="35"
                      max="100"
                      required
                      value={formData.ugMarksPercent}
                      onChange={(e) => setFormData({ ...formData, ugMarksPercent: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-[#5034df]"
                    />
                  </div>
                )}

                {/* PG Marks (Asked ONLY if PG or PhD is ALREADY completed) */}
                {isPgDone && (
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center justify-between">
                      <span>PG Master Marks</span>
                      <span className="text-[#5034df] dark:text-[#a594fd] font-mono">{formData.pgMarksPercent || 0}%</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="35"
                      max="100"
                      required
                      value={formData.pgMarksPercent || 0}
                      onChange={(e) => setFormData({ ...formData, pgMarksPercent: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-[#5034df]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SUBSECTION B: CURRENTLY PURSUING (ONGOING EDUCATION) */}
          <div className="p-4.5 sm:p-5 rounded-2xl bg-indigo-50/50 dark:bg-[#5034df]/10 border border-indigo-100 dark:border-[#5034df]/30 space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-100 dark:border-[#5034df]/30 pb-2.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5034df] dark:text-[#a594fd]" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {lang === 'hi' ? 'वर्तमान में जारी अध्ययन (Currently Pursuing)' : 'Currently Pursuing (Ongoing Education)'}
                </span>
              </div>
              <span className="text-[10px] bg-[#ece8ff] dark:bg-[#5034df]/30 text-[#5034df] dark:text-[#c4b5fd] font-bold px-2 py-0.5 rounded-full">
                Active Enrolment
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Currently Pursuing Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'hi' ? 'वर्तमान में क्या कर रहे हैं?' : 'Currently Pursuing Level'}
                </label>
                <select
                  value={formData.currentlyPursuingLevel || 'UG'}
                  onChange={(e) => handleCurrentlyPursuingChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none font-semibold"
                >
                  <option value="None">None / Preparing for Exams / Gap Year</option>
                  <option value="10th">Class 10th (Secondary School - X)</option>
                  <option value="12th">Class 12th (Senior Secondary - XII)</option>
                  <option value="Diploma">Diploma / Polytechnic</option>
                  <option value="UG">Undergraduate (UG Courses - B.Tech, B.Sc, B.Com, etc.)</option>
                  <option value="PG">Postgraduate (PG Courses - M.Tech, MBA, M.Sc, etc.)</option>
                  <option value="PhD">Ph.D. / Doctoral Research</option>
                </select>
              </div>

              {/* Conditional Stream if pursuing 12th */}
              {formData.currentlyPursuingLevel === '12th' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ongoing 12th Stream
                  </label>
                  <select
                    value={formData.currentlyPursuingStream || 'Science (PCM - Physics, Chemistry, Maths)'}
                    onChange={(e) => setFormData({ ...formData, currentlyPursuingStream: e.target.value, stream: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
                  >
                    {STREAMS_12TH.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Conditional fields if pursuing UG */}
              {formData.currentlyPursuingLevel === 'UG' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Enrolled Degree / Course Title
                    </label>
                    <input
                      type="text"
                      value={formData.currentlyPursuingCourse || formData.currentDegree}
                      onChange={(e) => setFormData({ ...formData, currentlyPursuingCourse: e.target.value, currentDegree: e.target.value })}
                      placeholder="e.g. B.Tech Electronics and Telecommunication"
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Current Year
                    </label>
                    <select
                      value={formData.currentlyPursuingYear || formData.currentYear || 3}
                      onChange={(e) => setFormData({ ...formData, currentlyPursuingYear: parseInt(e.target.value) || 1, currentYear: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none font-medium"
                    >
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year (Final/Pre-final Year)</option>
                      <option value={4}>4th Year (Final Year)</option>
                      <option value={5}>5th Year (Integrated / Dual Degree)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Academic Stream
                    </label>
                    <input
                      type="text"
                      value={formData.currentlyPursuingStream || formData.stream}
                      onChange={(e) => setFormData({ ...formData, currentlyPursuingStream: e.target.value, stream: e.target.value })}
                      placeholder="e.g. Engineering / Technology"
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                      <span>Ongoing CGPA / Aggregate % (Optional)</span>
                      <span className="text-slate-400 font-mono">{formData.currentCgpaOrAggregate || 0}%</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.currentCgpaOrAggregate || 0}
                      onChange={(e) => setFormData({ ...formData, currentCgpaOrAggregate: parseFloat(e.target.value) || 0 })}
                      placeholder="Leave 0 if awaiting results"
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none font-mono"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      No minimum block — leave 0 if awaiting degree completion.
                    </span>
                  </div>
                </>
              )}

              {/* Conditional fields if pursuing PG */}
              {formData.currentlyPursuingLevel === 'PG' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Enrolled PG Program
                    </label>
                    <input
                      type="text"
                      value={formData.currentlyPursuingCourse || 'M.Tech / MBA'}
                      onChange={(e) => setFormData({ ...formData, currentlyPursuingCourse: e.target.value, currentDegree: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      PG Current Year
                    </label>
                    <select
                      value={formData.currentlyPursuingYear || 1}
                      onChange={(e) => setFormData({ ...formData, currentlyPursuingYear: parseInt(e.target.value) || 1, currentYear: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
                    >
                      <option value={1}>1st Year (Junior Master)</option>
                      <option value={2}>2nd Year (Final Year Master)</option>
                    </select>
                  </div>
                </>
              )}

              {/* Conditional fields if pursuing PhD */}
              {formData.currentlyPursuingLevel === 'PhD' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Research Topic / Doctoral Discipline
                    </label>
                    <input
                      type="text"
                      value={formData.currentlyPursuingCourse || 'Doctoral Research'}
                      onChange={(e) => setFormData({ ...formData, currentlyPursuingCourse: e.target.value, currentDegree: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Doctoral Research Year
                    </label>
                    <select
                      value={formData.currentlyPursuingYear || 1}
                      onChange={(e) => setFormData({ ...formData, currentlyPursuingYear: parseInt(e.target.value) || 1, currentYear: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
                    >
                      <option value={1}>1st Year (Coursework)</option>
                      <option value={2}>2nd Year (Comprehensive / Proposal)</option>
                      <option value={3}>3rd Year (Active Research / Data)</option>
                      <option value={4}>4th+ Year (Thesis Preparation)</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 3. SOCIAL CATEGORY & FAMILY INCOME */}
        <div className="pt-5 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#5034df] dark:text-[#a594fd] flex items-center gap-2">
            <Landmark className="w-4 h-4" />
            <span>{lang === 'hi' ? '3. सामाजिक श्रेणी व पारिवारिक आय' : '3. Social Category & Family Income'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'hi' ? 'आरक्षण श्रेणी' : 'Reservation Category'}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none font-semibold"
              >
                <option value="General">General (Unreserved)</option>
                <option value="OBC-NCL">OBC-NCL (Age +3 yrs relaxation)</option>
                <option value="SC">SC (Age +5 yrs, 100% Fee Exemption)</option>
                <option value="ST">ST (Age +5 yrs, 100% Fee Exemption)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
                <option value="PwD">PwD (Benchmark Disabilities - +10 yrs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>{lang === 'hi' ? 'वार्षिक पारिवारिक आय (₹)' : 'Annual Family Income (₹)'}</span>
                <span className="text-slate-400 font-mono">₹{formData.annualFamilyIncome.toLocaleString('en-IN')}</span>
              </label>
              <input
                type="number"
                step="10000"
                min="0"
                required
                value={formData.annualFamilyIncome}
                onChange={(e) => setFormData({ ...formData, annualFamilyIncome: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'hi' ? 'मूल निवास राज्य' : 'State of Domicile'}
              </label>
              <select
                value={formData.stateDomicile}
                onChange={(e) => setFormData({ ...formData, stateDomicile: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#5034df]/20 focus:border-[#5034df] outline-none"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Profile changes automatically update eligibility across all scholarships and government exams.</span>
          </p>

          <button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5034df] hover:bg-[#3f25c7] text-white text-xs font-bold transition shadow-md shadow-[#5034df]/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : (lang === 'hi' ? 'बदलाव सुरक्षित करें' : 'Save Changes')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
