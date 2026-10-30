import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Send,
  Calendar,
  Sparkles,
  FileCheck2,
  IndianRupee,
  Share2
} from 'lucide-react';
import type { WeeklyDigest } from '../types';

interface WeeklyDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  digest: WeeklyDigest;
  lang: 'en' | 'hi';
}

export const WeeklyDigestModal: React.FC<WeeklyDigestModalProps> = ({
  isOpen,
  onClose,
  digest,
  lang
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(digest.whatsAppFormattedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(digest.whatsAppFormattedMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-indigo-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600/40 rounded-xl">
              <Share2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-base">
                {lang === 'hi' ? 'साप्ताहिक एक्शन डाइजेस्ट' : 'Weekly Action Digest'}
              </h2>
              <p className="text-xs text-emerald-200">
                {digest.weekLabel} • {digest.studentName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold">
              <div className="text-lg font-black">{digest.upcomingDeadlinesCount}</div>
              <div>{lang === 'hi' ? 'डेडलाइन' : 'Deadlines'}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold">
              <div className="text-lg font-black">₹{digest.feeSavingsToDate}</div>
              <div>{lang === 'hi' ? 'फीस बचत' : 'Fee Saved'}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-bold">
              <div className="text-lg font-black">{digest.documentsUrgentCount}</div>
              <div>{lang === 'hi' ? 'कागजात कार्य' : 'Doc Action'}</div>
            </div>
          </div>

          {/* WhatsApp Preview Box */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              WhatsApp & Email Message Preview:
            </label>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
              {digest.whatsAppFormattedMessage}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={copyToClipboard}
              className="cursor-pointer py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={shareWhatsApp}
              className="cursor-pointer py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
