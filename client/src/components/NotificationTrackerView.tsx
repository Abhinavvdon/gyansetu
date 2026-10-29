import React from 'react';
import {
  Bell,
  Calendar,
  TrendingUp,
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import type { NotificationChange } from '../types';

interface NotificationTrackerViewProps {
  notifications: NotificationChange[];
  lang: 'en' | 'hi';
}

export const NotificationTrackerView: React.FC<NotificationTrackerViewProps> = ({
  notifications,
  lang
}) => {
  const getBadge = (type: string) => {
    switch (type) {
      case 'DEADLINE_EXTENDED':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          label: lang === 'hi' ? 'समय-सीमा बढ़ाई गई (Deadline Extended)' : 'Deadline Extended',
          icon: Clock
        };
      case 'VACANCY_INCREASED':
        return {
          bg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          label: lang === 'hi' ? 'पद संख्या में वृद्धि (Vacancies Added)' : 'Vacancies Increased',
          icon: TrendingUp
        };
      case 'CORRIGENDUM':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          label: lang === 'hi' ? 'आधिकारिक शुद्धिपत्र (Official Corrigendum)' : 'Official Corrigendum',
          icon: FileText
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          label: type,
          icon: Bell
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-soft">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/20 text-blue-200 text-xs font-semibold mb-3 border border-blue-400/30">
          <Bell className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'अधिसूचना परिवर्तन संसूचक (Change Tracker)' : 'Live Notification Change Tracker'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {lang === 'hi'
            ? 'सरकारी शुद्धिपत्र, बढ़ाई गई तिथियां व पद वृद्धि की ताज़ा सूचना'
            : 'Track Live Notification Amendments, Extensions & Corrigendums'}
        </h2>
        <p className="text-sm text-blue-200 mt-2 max-w-2xl leading-relaxed">
          {lang === 'hi'
            ? 'सरकारी आयोग अक्सर सर्वर लोड या नियमों के कारण आवेदन की अंतिम तिथि बढ़ाते हैं या रिक्त पदों की संख्या जोड़ते हैं। यहां आधिकारिक राजपत्र से सत्यापित बदलाव देखें।'
            : 'Government recruitment bodies frequently publish addendums, age ceiling relaxations, and extended registration dates. Stay updated without falling for rumors.'}
        </p>
      </div>

      {/* Notifications Feed */}
      <div className="space-y-4">
        {notifications.map((item) => {
          const badge = getBadge(item.changeType);
          const Icon = badge.icon;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-card transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-xs text-slate-400">
                    Detected: <strong>{item.dateDetected}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Admin Verified from Official Gazette</span>
                </div>
              </div>

              {/* Title & Summary */}
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                  {item.headline}
                </h3>
                <div className="text-xs font-semibold text-indigo-600 mt-0.5">
                  Target: {item.opportunityTitle}
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              {/* Before vs After Visual Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {lang === 'hi' ? 'पूर्व स्थिति (Previous Value)' : 'Previous Setting'}
                  </div>
                  <div className="font-semibold text-slate-500 line-through mt-0.5">
                    {item.oldValue}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    {lang === 'hi' ? 'संशोधित स्थिति (Amended / New Value)' : 'New Official Setting'}
                  </div>
                  <div className="font-bold text-emerald-700 mt-0.5">
                    {item.newValue}
                  </div>
                </div>
              </div>

              {/* Official Link */}
              <div className="pt-2 flex items-center justify-end">
                <a
                  href={item.officialGazetteLink}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'आधिकारिक शुद्धिपत्र PDF देखें' : 'View Official Corrigendum Notice'}</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
