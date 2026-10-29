import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  ExternalLink,
  Clock,
  AlertTriangle,
  Info,
  Mail,
  Send,
  Sparkles,
  CheckCircle2,
  X,
  FileText
} from 'lucide-react';
import type { DeadlineNotification, User } from '../types';
import { GyanSetuApi } from '../api/client';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: DeadlineNotification[];
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
  currentUser: User | null;
  onSelectOpportunity?: (oppId: string) => void;
  lang: 'en' | 'hi';
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  currentUser,
  onSelectOpportunity,
  lang
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'URGENT' | 'APPROACHING' | 'CHANGES'>('ALL');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState<boolean>(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'URGENT') return n.severity === 'CRITICAL' || n.daysRemaining <= 3;
    if (activeFilter === 'APPROACHING') return n.severity === 'WARNING';
    if (activeFilter === 'CHANGES') return n.type === 'DATE_EXTENDED';
    return true;
  });

  const handleSendTestEmail = async () => {
    setIsSendingTestEmail(true);
    setTestEmailResult(null);
    try {
      const email = currentUser?.email || 'student.alerts@gyansetu.edu.in';
      const userId = currentUser?.id;
      const res = await GyanSetuApi.sendTestDeadlineEmail(email, userId);
      setTestEmailResult({
        success: res.success,
        message: res.message
      });
      setTimeout(() => setTestEmailResult(null), 4000);
    } catch {
      setTestEmailResult({
        success: false,
        message: 'Could not send test email alert. Check backend connection.'
      });
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const getSeverityBadge = (n: DeadlineNotification) => {
    if (n.severity === 'CRITICAL' || n.daysRemaining <= 2) {
      return {
        bg: 'bg-rose-50 border-rose-200 text-rose-700',
        dot: 'bg-rose-500 animate-pulse',
        icon: AlertTriangle,
        label: n.daysRemaining <= 1 ? 'CLOSING NOW' : `${n.daysRemaining} DAYS LEFT`
      };
    }
    if (n.severity === 'WARNING' || n.daysRemaining <= 7) {
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-800',
        dot: 'bg-amber-500',
        icon: Clock,
        label: `${n.daysRemaining} DAYS REMAINING`
      };
    }
    return {
      bg: 'bg-indigo-50 border-indigo-200 text-[#5034df]',
      dot: 'bg-[#5034df]',
      icon: Info,
      label: n.type === 'DATE_EXTENDED' ? 'DATE EXTENDED' : 'UPCOMING'
    };
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-[390px] sm:w-[440px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Top Header Ribbon */}
      <div className="bg-gradient-to-r from-[#1c1257] via-[#33209b] to-[#5940e2] text-white p-4.5 pb-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-white shadow-inner">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold tracking-tight">
                  {lang === 'hi' ? 'समय-सीमा अलर्ट व सूचनाएं' : 'Deadline Alerts & Notices'}
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.2 rounded-full shadow-xs">
                    {unreadCount} {lang === 'hi' ? 'नए' : 'New'}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-indigo-200 font-medium">
                {lang === 'hi'
                  ? 'आधिकारिक तारीखें और ईमेल अलर्ट'
                  : 'Official deadlines & verified email notifications'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="cursor-pointer text-[11px] bg-white/15 hover:bg-white/25 text-white font-semibold px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/15 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`cursor-pointer px-2.5 py-1 rounded-full transition ${
              activeFilter === 'ALL'
                ? 'bg-white text-indigo-950 font-bold shadow-xs'
                : 'text-indigo-200 hover:text-white hover:bg-white/10'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('URGENT')}
            className={`cursor-pointer px-2.5 py-1 rounded-full transition flex items-center gap-1 ${
              activeFilter === 'URGENT'
                ? 'bg-white text-indigo-950 font-bold shadow-xs'
                : 'text-indigo-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <span>Urgent</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('APPROACHING')}
            className={`cursor-pointer px-2.5 py-1 rounded-full transition ${
              activeFilter === 'APPROACHING'
                ? 'bg-white text-indigo-950 font-bold shadow-xs'
                : 'text-indigo-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Approaching
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('CHANGES')}
            className={`cursor-pointer px-2.5 py-1 rounded-full transition ${
              activeFilter === 'CHANGES'
                ? 'bg-white text-indigo-950 font-bold shadow-xs'
                : 'text-indigo-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Corrigendums
          </button>
        </div>
      </div>

      {/* Notifications Scroll List */}
      <div className="max-h-[380px] overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100/70">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-700">All caught up!</p>
            <p className="text-[11px] text-slate-400">
              No pending alerts under this category.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const badge = getSeverityBadge(notif);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={notif.id}
                className={`pt-2.5 first:pt-0 transition-all rounded-xl p-2.5 ${
                  notif.read ? 'bg-white opacity-80' : 'bg-slate-50/70 border border-slate-200/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider border ${badge.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                      <span>{badge.label}</span>
                    </span>

                    <span className="text-[10px] font-semibold text-slate-400">
                      {notif.opportunityTitle}
                    </span>
                  </div>

                  {!notif.read && (
                    <button
                      type="button"
                      onClick={() => onMarkRead(notif.id)}
                      className="cursor-pointer text-[10px] text-[#5034df] hover:underline font-bold shrink-0"
                    >
                      Mark read
                    </button>
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {notif.title}
                </h4>

                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {notif.message}
                </p>

                {/* Card Actions */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] pt-1">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    {notif.emailSent && (
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                        <Mail className="w-3 h-3" />
                        <span>Email Sent</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {onSelectOpportunity && notif.opportunityId && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectOpportunity(notif.opportunityId);
                          onClose();
                        }}
                        className="cursor-pointer text-[#5034df] hover:text-[#3821b0] font-bold text-[11px]"
                      >
                        View Details
                      </button>
                    )}

                    {notif.officialUrl && (
                      <a
                        href={notif.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="cursor-pointer inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold text-[11px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-lg transition"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Email Alert Dispatcher Section */}
      <div className="bg-slate-50 border-t border-slate-200/80 p-3.5 space-y-2">
        {testEmailResult && (
          <div
            className={`p-2 rounded-xl text-xs flex items-center gap-2 animate-in fade-in ${
              testEmailResult.success
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            {testEmailResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="text-[11px] font-semibold">{testEmailResult.message}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="truncate text-left">
            <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#5034df]" />
              <span>Email Deadline Alerts</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {currentUser?.email ? (
                <span>Connected: {currentUser.email}</span>
              ) : (
                <span>Delivers to registered student email</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSendTestEmail}
            disabled={isSendingTestEmail}
            className="cursor-pointer px-3 py-1.5 rounded-xl bg-[#5034df] hover:bg-[#3f25c7] text-white text-[11px] font-bold shadow-xs flex items-center gap-1.5 transition disabled:opacity-60 shrink-0"
            title="Dispatch a test deadline email alert"
          >
            {isSendingTestEmail ? (
              <span className="animate-spin text-xs">⏳</span>
            ) : (
              <>
                <Send className="w-3 h-3" />
                <span>Test Alert Email</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
