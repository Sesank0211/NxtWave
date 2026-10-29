import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  RotateCcw, 
  Calendar, 
  Mail, 
  GraduationCap, 
  User, 
  Database,
  Hash,
  Copy,
  Check,
  Share2,
  Users,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import type { RegistrationResult, ReferralStats } from '../types';
import { registrationService } from '../services';

interface RegistrationConfirmationProps {
  result: RegistrationResult;
  onReset: () => void;
}

export const RegistrationConfirmation: React.FC<RegistrationConfirmationProps> = ({
  result,
  onReset,
}) => {
  const navigate = useNavigate();
  const data = result.data;

  const referralCode = data?.referralCode || '';
  const referralLink = data?.referralLink || `${window.location.origin}/register?ref=${referralCode}`;

  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Fetch real-time referral statistics from backend
  const fetchStats = async () => {
    if (!referralCode) return;
    setIsLoadingStats(true);
    try {
      const res = await registrationService.getReferralStats(referralCode);
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch {
      // Keep existing stats if fetch fails
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [referralCode]);

  // Copy referral link to clipboard with reliable fallback
  const handleCopyLink = async () => {
    setCopyError(null);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        return;
      }

      // Fallback for older browsers or non-HTTPS contexts
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        setCopyError('Unable to copy automatically. Please copy the link manually.');
      }
    } catch {
      setCopyError('Unable to copy automatically. Please copy the link manually.');
    }
  };

  // WhatsApp sharing with pre-filled, editable text
  const handleWhatsAppShare = () => {
    const message = `Hey! I'm joining a free 60-minute AI workshop for engineering students. You can register here too: ${referralLink}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const successfulReferralsCount = stats?.referralCount ?? data?.referralCount ?? 0;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Database Confirmation Badge */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-950 text-xs sm:text-sm flex items-start gap-3">
        <Database className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-emerald-900">
            Saved to MongoDB & Seat Confirmed
          </p>
          <p className="text-emerald-800/90 leading-relaxed text-xs">
            Your registration is recorded in the ProjectZero database. A confirmation has been logged for your workshop session.
          </p>
        </div>
      </div>

      {/* Success Badge & Headline */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
          <Sparkles className="h-3 w-3 text-blue-600" />
          Seat Confirmed
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          You're Registered!
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          "Build Your First AI Project in 60 Minutes"
        </p>
      </div>

      {/* REFERRAL SHARING SECTION */}
      {referralCode && (
        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/80 rounded-2xl border border-indigo-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Share2 className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-bold text-slate-900">Invite Your Classmates</span>
            </div>
            
            {/* Live Referral Count Badge */}
            <div className="flex items-center gap-1.5">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
                <Users className="h-3.5 w-3.5 text-indigo-600" />
                <span>{successfulReferralsCount} {successfulReferralsCount === 1 ? 'Referral' : 'Referrals'}</span>
              </div>
              <button
                type="button"
                onClick={fetchStats}
                title="Refresh referral count from database"
                disabled={isLoadingStats}
                className="p-1 rounded-md text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100/60 transition-colors"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoadingStats ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Share your unique invite link with friends from college. They can register for free and join you in the hands-on session!
          </p>

          {/* Referral Code Display */}
          <div className="bg-white rounded-xl p-3 border border-indigo-200/70 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Your Referral Code
              </span>
              <span className="text-lg font-extrabold text-indigo-600 tracking-wider font-mono">
                {referralCode}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">Status</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                Active & Verified
              </span>
            </div>
          </div>

          {/* Complete Referral Link Box */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-700 block">
              Complete Referral Link:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono select-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-xs cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
            {copyError && (
              <p className="text-xs text-rose-600 mt-1">{copyError}</p>
            )}
          </div>

          {/* Share on WhatsApp Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all duration-150 cursor-pointer"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Share on WhatsApp</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-1.5">
              Opens WhatsApp with a pre-filled invitation you can edit before sending.
            </p>
          </div>
        </div>
      )}

      {/* Registration Details Card */}
      {data && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3.5 text-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Registration Record
            </span>
            {data.id && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                <Hash className="h-3 w-3 text-slate-400" />
                {data.id}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100/60 text-blue-700 flex items-center justify-center shrink-0">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs text-slate-500 block">Student Name</span>
              <span className="font-semibold text-slate-900 truncate block">{data.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100/60 text-blue-700 flex items-center justify-center shrink-0">
              <Mail className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs text-slate-500 block">Registered Email</span>
              <span className="font-semibold text-slate-900 truncate block">{data.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-100/60 text-violet-700 flex items-center justify-center shrink-0">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs text-slate-500 block">College / University</span>
              <span className="font-semibold text-slate-900 truncate block">{data.collegeName}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-100/60 text-violet-700 flex items-center justify-center shrink-0">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs text-slate-500 block">Graduation Batch</span>
              <span className="font-semibold text-slate-900 block">
                Class of {data.graduationYear} {data.graduationYear === '2027' && '• Target Batch'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <button
          onClick={() => navigate('/')}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Workshop Landing Page</span>
        </button>

        <button
          onClick={onReset}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm border border-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-4 w-4 text-slate-500" />
          <span>Register Another Student</span>
        </button>
      </div>
    </div>
  );
};
