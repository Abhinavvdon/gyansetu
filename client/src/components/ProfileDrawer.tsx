import React, { useState } from 'react';
import { X, Save, User, Award, IndianRupee, MapPin, GraduationCap, CheckCircle2, Clock } from 'lucide-react';
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

  const [isSavedNotice, setIsSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

    onSave(toSave);
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

  const handleAlreadyPursuedChange = (level: string) => {
    const updated = { ...formData, alreadyPursuedLevel: level };
    if (level === '10th' || level === '12th' || level === 'Diploma') {
      updated.ugMarksPercent = 0;
      updated.pgMarksPercent = 0;
    }
    setFormData(updated);
  };

  const is12thDone = ['12th', 'UG', 'PG', 'PhD'].includes(formData.alreadyPursuedLevel || '');
  const isDiplomaDone = formData.alreadyPursuedLevel === 'Diploma';
  const isUgDone = ['UG', 'PG', 'PhD'].includes(formData.alreadyPursuedLevel || '');
  const isPgDone = ['PG', 'PhD'].includes(formData.alreadyPursuedLevel || '');
  const isPhdDone = formData.alreadyPursuedLevel === 'PhD';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-700/60 rounded-lg">
              <User className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {lang === 'hi' ? 'विद्यार्थी प्रोफ़ाइल' : 'Personalised Student Profile'}
              </h2>
              <p className="text-xs text-indigo-200">
                {lang === 'hi'
                  ? 'सटीक जानकारी भरें ताकि एआई सही अवसर ढूंढ सके।'
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Male">Male (पुरुष)</option>
                  <option value="Female">Female (महिला - 100% Fee Waivers)</option>
                  <option value="Other">Other (अन्य)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Age (Years)
                </label>
                <input
                  type="number"
                  min="14"
                  max="50"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 20 })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  State Domicile
                </label>
                <select
                  value={formData.stateDomicile}
                  onChange={(e) => setFormData({ ...formData, stateDomicile: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Academic Qualifications & Marks */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'hi' ? '2. शैक्षणिक योग्यता व अंक' : '2. Academic Qualifications & Marks'}</span>
            </h3>

            {/* Block A: Already Pursued */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Already Pursued (Completed Education)
                </span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  Completed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Highest Completed Level
                  </label>
                  <select
                    value={formData.alreadyPursuedLevel}
                    onChange={(e) => handleAlreadyPursuedChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                  >
                    <option value="10th">Class 10th (Secondary School - X)</option>
                    <option value="12th">Class 12th (Senior Secondary - XII)</option>
                    <option value="Diploma">Diploma / Polytechnic</option>
                    <option value="UG">Undergraduate (UG Degree)</option>
                    <option value="PG">Postgraduate (PG Degree)</option>
                    <option value="PhD">Ph.D. / Doctorate</option>
                  </select>
                </div>

                {is12thDone && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      12th Board Stream
                    </label>
                    <select
                      value={formData.alreadyPursuedStream}
                      onChange={(e) => setFormData({ ...formData, alreadyPursuedStream: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      {STREAMS_12TH.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Marks Inputs */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    10th Marks (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="35"
                    max="100"
                    required
                    value={formData.tenthMarksPercent}
                    onChange={(e) => setFormData({ ...formData, tenthMarksPercent: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                  />
                </div>

                {is12thDone && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      12th Marks (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="35"
                      max="100"
                      required
                      value={formData.twelfthMarksPercent}
                      onChange={(e) => setFormData({ ...formData, twelfthMarksPercent: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                    />
                  </div>
                )}

                {isDiplomaDone && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Diploma Aggregate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="35"
                      max="100"
                      required
                      value={formData.diplomaMarksPercent || 0}
                      onChange={(e) => setFormData({ ...formData, diplomaMarksPercent: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                    />
                  </div>
                )}

                {isUgDone && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      UG Degree Marks (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="35"
                      max="100"
                      required
                      value={formData.ugMarksPercent}
                      onChange={(e) => setFormData({ ...formData, ugMarksPercent: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                    />
                  </div>
                )}

                {isPgDone && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      PG Degree Marks (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="35"
                      max="100"
                      required
                      value={formData.pgMarksPercent || 0}
                      onChange={(e) => setFormData({ ...formData, pgMarksPercent: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Block B: Currently Pursuing */}
            <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
              <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-900/40 pb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Currently Pursuing (Ongoing Studies)
                </span>
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                  Active Enrolment
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Currently Pursuing Level
                  </label>
                  <select
                    value={formData.currentlyPursuingLevel || 'UG'}
                    onChange={(e) => setFormData({ ...formData, currentlyPursuingLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                  >
                    <option value="None">None / Gap Year / Job Seeking</option>
                    <option value="10th">Class 10th (X)</option>
                    <option value="12th">Class 12th (XII with stream)</option>
                    <option value="Diploma">Diploma / Polytechnic</option>
                    <option value="UG">Undergraduate (UG Courses)</option>
                    <option value="PG">Postgraduate (PG Courses)</option>
                    <option value="PhD">Ph.D. / Doctoral Research</option>
                  </select>
                </div>

                {formData.currentlyPursuingLevel === 'UG' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Current UG Degree
                      </label>
                      <input
                        type="text"
                        value={formData.currentlyPursuingCourse || formData.currentDegree}
                        onChange={(e) => setFormData({ ...formData, currentlyPursuingCourse: e.target.value, currentDegree: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Current Year
                      </label>
                      <select
                        value={formData.currentlyPursuingYear || formData.currentYear || 3}
                        onChange={(e) => setFormData({ ...formData, currentlyPursuingYear: parseInt(e.target.value) || 1, currentYear: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value={1}>1st Year</option>
                        <option value={2}>2nd Year</option>
                        <option value={3}>3rd Year (Final/Pre-final)</option>
                        <option value={4}>4th Year (Final Year)</option>
                        <option value={5}>5th Year</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Ongoing CGPA / Aggregate % (Optional)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={formData.currentCgpaOrAggregate || 0}
                        onChange={(e) => setFormData({ ...formData, currentCgpaOrAggregate: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Reservation Category & Family Income */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'hi' ? '3. आरक्षण श्रेणी व आय' : '3. Category & Family Income'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Social Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                >
                  <option value="General">General (UR)</option>
                  <option value="OBC-NCL">OBC-NCL (Age +3yr relaxation)</option>
                  <option value="SC">SC (₹0 Fee, Age +5yr relaxation)</option>
                  <option value="ST">ST (₹0 Fee, Age +5yr relaxation)</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                  <option value="PwD">PwD (Benchmark Disabilities)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Annual Family Income (₹)
                </label>
                <input
                  type="number"
                  step="10000"
                  required
                  value={formData.annualFamilyIncome}
                  onChange={(e) => setFormData({ ...formData, annualFamilyIncome: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Career Goals */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-600" />
              <span>{lang === 'hi' ? '4. लक्ष्य एवं रुचियां' : '4. Target Goals'}</span>
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
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 font-semibold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span>{goal}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 sticky bottom-0 bg-white dark:bg-slate-900">
            <button
              type="submit"
              className="cursor-pointer w-full py-3 bg-[#5034df] hover:bg-[#3f25c7] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-[#5034df]/20 transition-all"
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
