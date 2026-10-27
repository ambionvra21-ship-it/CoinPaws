import React from 'react';
import { X, User, Wallet, BarChart3, Shield, Info } from 'lucide-react';
import { formatPhp } from '../utils/storage';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  email: string;
  balancePhp: number;
  totalPawsEarned: number;
}

const mockStats = [
  { day: 'Mon', value: 40 },
  { day: 'Tue', value: 65 },
  { day: 'Wed', value: 50 },
  { day: 'Thu', value: 85 },
  { day: 'Fri', value: 70 },
  { day: 'Sat', value: 95 },
  { day: 'Sun', value: 100 },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  username,
  email,
  balancePhp,
  totalPawsEarned,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl flex flex-col">
        
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400">
            <User className="w-5 h-5" />
            <h3 className="font-fredoka text-base font-black uppercase">Account Profile</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center text-slate-950 font-bold">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-fredoka text-base font-black text-slate-200 truncate">{username}</span>
              <span className="text-xs text-slate-400 truncate">{email}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/20">
              <span className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1"><Wallet className="w-3 h-3" /> Balance</span>
              <span className="text-lg font-black text-slate-100 block mt-1">{formatPhp(balancePhp)}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-purple-500/20">
              <span className="text-[10px] font-bold text-purple-400 uppercase flex items-center gap-1"><Shield className="w-3 h-3" /> Pawcoins</span>
              <span className="text-lg font-black text-slate-100 block mt-1">{totalPawsEarned.toLocaleString()}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5 text-cyan-400" /> Weekly Activity Peak</span>
            <div className="flex items-end justify-between h-24 pt-4 px-2 bg-slate-950/40 rounded-lg border border-slate-900">
              {mockStats.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-3 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-sm transition-all" style={{ height: `${s.value}%`, minHeight: '4px' }} />
                  <span className="text-[8px] font-bold text-slate-500">{s.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-400">Account status securely synchronized. Caps reset daily at 12:00 AM server time.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
