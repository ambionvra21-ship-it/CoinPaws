import React from 'react';
import { X, Award, Flame, Wallet, Users, Mail, Copy, Check } from 'lucide-react';
import { sound } from '../utils/sound';
import { formatPhp } from '../utils/storage';
import { SUPPORT_EMAIL } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  balancePhp: number;
  totalEarnedPhp: number;
  consecutiveDays: number;
  referralCode: string;
  onOpenSupport: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userName,
  userEmail,
  balancePhp,
  totalEarnedPhp,
  consecutiveDays,
  referralCode,
  onOpenSupport,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    sound.playClick();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-2xl">
              🐾
            </div>
          </div>
          <div>
            <h3 className="font-fredoka text-lg font-bold text-white">{userName}</h3>
            <span className="text-[11px] text-cyan-300 font-mono">Android Member</span>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
              <span>Status:</span>
              <span className="text-emerald-400 font-bold">Active Earner</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Balance</span>
            <span className="text-xs font-bold text-cyan-300 font-mono">
              {formatPhp(balancePhp)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Streak</span>
            <span className="text-xs font-bold text-orange-400 font-mono flex items-center justify-center gap-0.5">
              <Flame className="w-3 h-3 fill-orange-400" />
              {consecutiveDays}d
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Total Paid</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {formatPhp(totalEarnedPhp)}
            </span>
          </div>
        </div>

        {/* Referral Card */}
        <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Your Referral Code</span>
            <span className="font-mono font-bold text-sm text-cyan-300">{referralCode}</span>
          </div>
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Support email contact */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px]">Need help or payout info?</span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
              onOpenSupport();
            }}
            className="text-cyan-400 hover:text-cyan-300 font-bold underline text-xs cursor-pointer"
          >
            Open Help
          </button>
        </div>
      </div>
    </div>
  );
};
