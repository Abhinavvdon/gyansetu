import React from 'react';
import {
  Users,
  GraduationCap,
  Award,
  Sparkles,
  Quote,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import type { PeerSuccessStory } from '../types';

interface PeerSuccessViewProps {
  peerStories: PeerSuccessStory[];
  lang: 'en' | 'hi';
}

export const PeerSuccessView: React.FC<PeerSuccessViewProps> = ({ peerStories, lang }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-soft">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-400/20 text-purple-200 text-xs font-semibold mb-3 border border-purple-400/30">
          <Users className="w-3.5 h-3.5 text-amber-300" />
          <span>{lang === 'hi' ? 'साथियों के सफल रास्ते (Peer Success Paths)' : 'Peer Success Paths & Combination Blueprints'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {lang === 'hi'
            ? 'समान प्रोफ़ाइल वाले विद्यार्थियों ने कैसे पाई सफलता?'
            : 'How Students with Similar Marks & Backgrounds Succeeded'}
        </h1>
        <p className="text-sm text-purple-200 mt-2 max-w-2xl leading-relaxed">
          {lang === 'hi'
            ? 'औसत अंक होने के बावजूद सही परीक्षाओं और छात्रवृत्तियों का संयोजन चुनकर साथियों ने सरकारी नौकरियां व उच्च शिक्षा छात्रवृत्ति प्राप्त की। उनके सफल संयोजन देखें।'
            : 'Anonymized case studies showing real strategy combinations that worked: pairing zero-marks-barrier exams with state domicile fee reimbursements.'}
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {peerStories.map((story) => (
          <div
            key={story.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-card transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Alias & Origin */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="font-extrabold text-slate-900 text-base">
                    {story.studentAlias}
                  </h2>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-amber-600" />
                    <span>{story.homeState}</span>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {story.socialCategory}
                </span>
              </div>

              {/* Initial Academic Baseline */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                <span className="text-slate-600 font-semibold block text-[10px] uppercase">
                  Baseline Profile:
                </span>
                <strong>{story.collegeBackground}</strong> ({story.graduationMarks}% Marks)
              </div>

              {/* Winning Combination Tags */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Winning Applied Combo:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {story.appliedCombo.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Outcome Highlight */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                <div className="font-bold text-amber-950 flex items-center gap-1.5 mb-0.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Cleared & Appointed:</span>
                </div>
                <div className="text-slate-800 font-bold">
                  {story.clearedExamOrAward}
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                  {story.currentRoleOrStipend}
                </div>
              </div>

              {/* Strategy Quote */}
              <div className="text-xs text-slate-600 italic leading-relaxed pt-1 relative">
                <Quote className="w-4 h-4 text-indigo-200 inline mr-1" />
                "{story.strategicQuote}"
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
