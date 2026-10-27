import React from 'react';
import { X, Calendar } from 'lucide-react';

interface DailyCheckinModalProps {
  consecutiveDays: number;
  hasClaimedToday: boolean;
  onClaim: () => void;
  onClose: () => void;
}

export const DailyCheckinModal: React.FC<DailyCheckinModalProps> = ({
  consecutiveDays,
  hasClaimedToday,
  onClaim,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-slate-200">Daily Login Bonus</span>
          <button onClick={onClose} className="text-slate-500"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex flex-col items-center gap-2 py-4">
          <Calendar className="w-12 h-12 text-cyan-400" />
          <span className="text-xl font-black text-slate-100">{consecutiveDays} Days Streak</span>
        </div>
        <button 
          disabled={hasClaimedToday}
          onClick={onClaim}
          className="w-full py-2.5 rounded-xl bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 font-bold text-xs uppercase tracking-wider text-slate-950"
        >
          {hasClaimedToday ? 'Already Claimed' : 'Claim Daily Reward'}
        </button>
      </div>
    </div>
  );
};
