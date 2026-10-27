import React from 'react';
import { Menu, User, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface DashboardHeaderProps {
  currentTime: string;
  onOpenMenu: () => void;
  onOpenProfile: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentTime,
  onOpenMenu,
  onOpenProfile,
}) => {
  return (
    <>
      <div className="w-full px-5 pt-1.5 pb-1 flex items-center justify-between text-[11px] font-medium text-slate-300">
        <span className="font-semibold text-slate-200">{currentTime}</span>
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <span className="text-[9px] font-mono font-bold bg-slate-800/80 px-1 py-0.2 rounded text-cyan-300">Vo LTE</span>
          <span className="text-[9px] font-mono font-bold bg-slate-800/80 px-1 py-0.2 rounded text-cyan-300">4G LTE</span>
          <div className="flex items-center gap-0.5">
            <span className="text-[10px] text-cyan-300 font-mono">21%</span>
            <div className="w-4 h-2.5 rounded-xs border border-cyan-400 p-0.2 flex items-center">
              <div className="h-full bg-cyan-400 w-1/4 rounded-2xs" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <button
          onClick={() => { sound.playClick(); onOpenMenu(); }}
          className="w-10 h-10 shrink-0 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-md"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-950/40 border border-slate-800/60 rounded-2xl flex-1 max-w-[240px]">
          <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.4)] animate-pulse">
            <Sparkles className="w-4 h-4 fill-slate-950 stroke-none" />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="font-fredoka text-base font-black tracking-wide bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
              MoneyPaws
            </span>
            <span className="text-[8px] font-bold text-cyan-400/60 font-sans tracking-widest uppercase mt-0.5">
              Secure Eco-System
            </span>
          </div>
        </div>

        <button
          onClick={() => { sound.playClick(); onOpenProfile(); }}
          className="w-10 h-10 shrink-0 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-md"
        >
          <User className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>
    </>
  );
};
import React from 'react';
import { Share2 } from 'lucide-react';
import { sound } from '../utils/sound';
import { formatPhp } from '../utils/storage';

interface BalanceCardProps {
  balancePhp: number;
  targetThresholdPhp: number;
  onOpenShareEarnings: () => void;
  onOpenCashOut: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balancePhp,
  targetThresholdPhp,
  onOpenShareEarnings,
  onOpenCashOut,
}) => {
  const thresholdPercent = Math.min(100, Math.max(3, (balancePhp / targetThresholdPhp) * 100));

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/95 via-cyan-950/35 to-slate-900/95 border border-cyan-500/40 p-4 shadow-[0_0_20px_rgba(6,182,212,0.18)] overflow-hidden">
      <div className="absolute -top-10 left-1/4 w-40 h-20 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300/80">TOTAL EARNINGS BALANCE</span>
          <h2 className="text-3xl font-black font-fredoka text-slate-100 tracking-tight mt-1 bg-gradient-to-r from-slate-50 to-slate-300 bg-clip-text text-transparent">
            {formatPhp(balancePhp)}
          </h2>
        </div>
        <button
          onClick={() => { sound.playClick(); onOpenShareEarnings(); }}
          className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-cyan-400 active:scale-95 transition-all"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4">
        <div className="w-full h-2 bg-slate-950/80 rounded-full border border-slate-800/60 overflow-hidden p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.6)]" 
            style={{ width: `${thresholdPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
          <span>Progress to Cashout</span>
          <span className="text-cyan-400 font-mono">{thresholdPercent.toFixed(1)}%</span>
        </div>
      </div>

      <button
        onClick={() => { sound.playClick(); onOpenCashOut(); }}
        className="w-full mt-4 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-500 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(6,182,212,0.3)] hover:brightness-110"
      >
        Withdraw Balance
      </button>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Sparkles, Footprints, Tv, Calendar, RefreshCw } from 'lucide-react';
import { sound } from '../utils/sound';
import { haptics } from '../utils/haptics';
import { fireRewardConfetti } from '../utils/confetti';
import { Leaderboard } from './Leaderboard';
import { DailyMissions } from './DailyMissions';
import DailyNewsTicker from './DailyNewsTicker';
import { DailyLuckyChest, ChestReward } from './DailyLuckyChest';
import { DailyTriviaQuiz } from './DailyTriviaQuiz';
import { PersonalGoalTracker } from './PersonalGoalTracker';
import { DashboardHeader } from './DashboardHeader';
import { BalanceCard } from './BalanceCard';
import { PersonalGoal } from '../types';

interface MainDashboardProps {
  balancePhp: number;
  targetThresholdPhp: number;
  tapMineCount: number;
  currentUserTotalEarned: number;
  currentUserName: string;
  stepsToday: number;
  gamesPlayedToday: number;
  adsWatchedToday: number;
  hasClaimedCheckin: boolean;
  claimedMissionIds: string[];
  lastLuckyChestDate: string;
  theme?: 'slate' | 'amoled';
  batterySaver?: boolean;
  personalGoals: PersonalGoal[];
  triviaAnsweredDate: string;
  onTapMine: () => void;
  onOpenCashOut: () => void;
  onOpenShareEarnings: () => void;
  onOpenMenu: () => void;
  onOpenProfile: () => void;
  onOpenDailyLogins: () => void;
  onOpenWatchAd: () => void;
  onOpenSpinWheel: () => void;
  onOpenWalking: () => void;
  onOpenScratchCards: () => void;
  onOpenFruitTap: () => void;
  onClaimMission: (missionId: string, phpReward: number, pawsReward: number, title: string) => void;
  onClaimChest: (reward: ChestReward) => void;
  onToggleGoal: (id: string) => void;
  onAddGoal: (title: string, icon: string) => void;
  onTriviaReward: (php: number, paws: number, title: string) => void;
}

interface FloatingTap {
  id: number;
  x: number;
  y: number;
  text: string;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  balancePhp,
  targetThresholdPhp,
  tapMineCount,
  currentUserTotalEarned,
  currentUserName,
  stepsToday,
  gamesPlayedToday,
  adsWatchedToday,
  claimedMissionIds,
  lastLuckyChestDate,
  personalGoals,
  triviaAnsweredDate,
  onTapMine,
  onOpenCashOut,
  onOpenShareEarnings,
  onOpenMenu,
  onOpenProfile,
  onOpenDailyLogins,
  onOpenWatchAd,
  onOpenSpinWheel,
  onOpenWalking,
  onClaimMission,
  onClaimChest,
  onToggleGoal,
  onAddGoal,
  onTriviaReward,
}) => {
  const [floatingTaps, setFloatingTaps] = useState<FloatingTap[]>([]);
  const [isMiningPressed, setIsMiningPressed] = useState(false);
  const [nextId, setNextId] = useState(1);
  const [currentTime, setCurrentTime] = useState('12:04 AM');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTap = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    sound.playCoin();
    haptics.tapMine();
    setIsMiningPressed(true);
    setTimeout(() => setIsMiningPressed(false), 150);

    let clientX = 0, clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const relX = clientX ? clientX - rect.left : rect.width / 2;
    const relY = clientY ? clientY - rect.top : rect.height / 2;

    const newFloat: FloatingTap = { id: nextId, x: relX, y: relY, text: '+₱0.01' };
    setNextId((prev) => prev + 1);
    setFloatingTaps((prev) => [...prev.slice(-6), newFloat]);
    onTapMine();

    if ((tapMineCount + 1) % 25 === 0) fireRewardConfetti(0.4);
  };

  useEffect(() => {
    if (floatingTaps.length === 0) return;
    const timer = setTimeout(() => setFloatingTaps((prev) => prev.slice(1)), 700);
    return () => clearTimeout(timer);
  }, [floatingTaps]);

  return (
    <div className="w-full flex flex-col justify-start select-none">
      <DashboardHeader currentTime={currentTime} onOpenMenu={onOpenMenu} onOpenProfile={onOpenProfile} />
      <div className="px-4 flex flex-col gap-3 mt-1">
        <DailyNewsTicker />
        <BalanceCard balancePhp={balancePhp} targetThresholdPhp={targetThresholdPhp} onOpenShareEarnings={onOpenShareEarnings} onOpenCashOut={onOpenCashOut} />
        
        <div className="grid grid-cols-4 gap-2.5">
          <button onClick={() => { sound.playClick(); onOpenDailyLogins(); }} className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-slate-200 active:scale-95 transition-all gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400"><Calendar className="w-4 h-4" /></div>
            <span className="text-[9px] font-bold uppercase tracking-tight text-slate-400">Logins</span>
          </button>
          <button onClick={() => { sound.playClick(); onOpenWatchAd(); }} className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-slate-200 active:scale-95 transition-all gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400"><Tv className="w-4 h-4" /></div>
            <span className="text-[9px] font-bold uppercase tracking-tight text-slate-400">Ads</span>
          </button>
          <button onClick={() => { sound.playClick(); onOpenSpinWheel(); }} className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-slate-200 active:scale-95 transition-all gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400"><RefreshCw className="w-4 h-4" /></div>
            <span className="text-[9px] font-bold uppercase tracking-tight text-slate-400">Spin</span>
          </button>
          <button onClick={() => { sound.playClick(); onOpenWalking(); }} className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-slate-200 active:scale-95 transition-all gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><Footprints className="w-4 h-4" /></div>
            <span className="text-[9px] font-bold uppercase tracking-tight text-slate-400">Walk</span>
          </button>
        </div>

        <div className="flex flex-col items-center justify-center my-2 relative">
          <button
            onMouseDown={handleTap} onTouchStart={handleTap}
            className={`relative w-40 h-40 rounded-full bg-gradient-to-b from-cyan-600 via-cyan-500 to-sky-600 border-[6px] border-slate-900 shadow-[0_0_30px_rgba(6,182,212,0.4)] flex flex-col items-center justify-center cursor-pointer transition-transform duration-700 outline-none ${isMiningPressed ? 'scale-90 duration-75 brightness-110' : ''}`}
            style={{ touchAction: 'manipulation' }}
          >
            <div className="absolute inset-2 border-2 border-dashed border-cyan-200/30 rounded-full" />
            <Sparkles className="w-12 h-12 text-slate-950 fill-cyan-100" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-950 mt-1 font-fredoka">Tap to Mine</span>
            <span className="text-xs font-mono font-bold text-slate-900 bg-cyan-200/60 px-2 py-0.5 rounded-full mt-1.5">{tapMineCount}</span>
            {floatingTaps.map((f) => (
              <span key={f.id} className="absolute text-sm font-black font-fredoka text-emerald-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pointer-events-none animate-float-up" style={{ left: f.x, top: f.y }}>{f.text}</span>
            ))}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DailyTriviaQuiz answeredDate={triviaAnsweredDate} onReward={onTriviaReward} />
          <DailyLuckyChest lastChestDate={lastLuckyChestDate} onClaimReward={onClaimChest} />
        </div>

        <DailyMissions stepsToday={stepsToday} gamesPlayedToday={gamesPlayedToday} adsWatchedToday={adsWatchedToday} claimedMissionIds={claimedMissionIds} onClaimReward={onClaimMission} />
        <PersonalGoalTracker goals={personalGoals} onToggleGoal={onToggleGoal} onAddGoal={onAddGoal} />
        <Leaderboard stepsToday={stepsToday} gamesPlayedToday={gamesPlayedToday} adsWatchedToday={adsWatchedToday} claimedMissionIds={claimedMissionIds} currentUserName={currentUserName} currentUserTotalEarned={currentUserTotalEarned} />
      </div>
    </div>
  );
};
