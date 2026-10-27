import React from 'react';
import { Gift } from 'lucide-react';
import { sound } from '../utils/sound';
import { haptics } from '../utils/haptics';

export interface ChestReward {
  php: number;
  paws: number;
  title: string;
}

interface DailyLuckyChestProps {
  onClaimReward: (reward: ChestReward) => void;
}

export const DailyLuckyChest: React.FC<DailyLuckyChestProps> = ({ onClaimReward }) => {
  const handleOpenChest = () => {
    sound.playCoin();
    haptics.tapMine();
    onClaimReward({ php: 2.50, paws: 25, title: 'Lucky Chest Reward' });
  };

  return (
    <button 
      onClick={handleOpenChest}
      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex flex-col items-center justify-center min-h-[170px] gap-2 active:scale-95 transition-transform w-full"
    >
      <Gift className="w-8 h-8 text-purple-400 animate-bounce" />
      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Daily Lucky Chest</span>
      <span className="text-[9px] text-slate-400 text-center">Tap to open and claim today's secret reward</span>
    </button>
  );
};
