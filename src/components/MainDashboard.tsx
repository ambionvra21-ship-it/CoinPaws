import React, { useState, useEffect } from 'react';
import { Menu, User, Sparkles, Footprints, Tv, Calendar, RefreshCw, Share2 } from 'lucide-react';
import { sound } from '../utils/sound';
import { haptics } from '../utils/haptics';
import { fireRewardConfetti } from '../utils/confetti';
import { formatPhp } from '../utils/storage';
import { Leaderboard } from './Leaderboard';
import { DailyMissions } from './DailyMissions';
import DailyNewsTicker from './DailyNewsTicker';
import { DailyLuckyChest, ChestReward } from './DailyLuckyChest';
import { DailyTriviaQuiz } from './DailyTriviaQuiz';
import { PersonalGoalTracker } from './PersonalGoalTracker';
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
  const [floatingTaps, setFloatingTaps] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [nextId, setNextId] = useState(1);
  const [time, setTime] = useState('12:00 AM');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, '0');
      setTime(`${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`);
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  const handleTap = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    sound.playCoin();
    haptics.tapMine();
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientX : ('clientX' in e ? e.clientX : 0);
    const clientY = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientY : ('clientY' in e ? e.clientY : 0);
    const rect = e.currentTarget.getBoundingClientRect();
    
    setFloatingTaps((prev) => [...prev.slice(-5), { id: nextId, x: clientX ? clientX - rect.left : rect.width / 2, y: clientY ? clientY - rect.top : rect.height / 2 }]);
    setNextId((p) => p + 1);
    onTapMine();
    if ((tapMineCount + 1) % 25 === 0) fireRewardConfetti(0.4);
  };

  useEffect(() => {
    if (!floatingTaps.length) return;
    const t = setTimeout(() => setFloatingTaps((p) => p.slice(1)), 700);
    return () => clearTimeout(t);
  }, [floatingTaps]);

  const pct = Math.min(100, Math.max(3, (balancePhp / targetThresholdPhp) * 100));

  return (
    <div className="w-full flex flex-col justify-start select-none">
      <div className="w-full px-5 pt-2 flex items-center justify-between text-[11px] text-slate-300">
        <span>{time}</span>
        <div className="flex items-center gap-1">
          <span className="bg-slate-800 px-1 rounded text-cyan-300">4G LTE</span>
          <span>21%</span>
        </div>
      </div>

      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <button onClick={() => { sound.playClick(); onOpenMenu(); }} className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-400 flex items-center justify-center"><Menu className="w-5 h-5" /></button>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 rounded-2xl flex-1 max-w-[240px] justify-center">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="font-fredoka text-base font-black text-cyan-400">MoneyPaws</span>
        </div>
        <button onClick={() => { sound.playClick(); onOpenProfile(); }} className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-400 flex items-center justify-center"><User className="w-5 h-5" /></button>
      </div>

      <div className="px-4 flex flex-col gap-3 mt-1">
        <DailyNewsTicker />

        <div className="rounded-2xl bg-slate-900 border border-cyan-500/40 p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-cyan-300/80">TOTAL BALANCE</span>
              <h2 className="text-3xl font-black text-slate-100 mt-1">{formatPhp(balancePhp)}</h2>
            </div>
            <button onClick={() => { sound.playClick(); onOpenShareEarnings(); }} className="p-2 rounded-xl bg-slate-800 text-cyan-400"><Share2 className="w-4 h-4" /></button>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden"><div className="h-full bg-cyan-400" style={{ width: `${pct}%` }} /></div>
          </div>
          <button onClick={() => { sound.playClick(); onOpenCashOut(); }} className="w-full mt-4 py-2 bg-cyan-500 rounded-xl font-bold text-xs text-slate-950">Withdraw Balance</button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => { sound.playClick(); onOpenDailyLogins(); }} className="flex flex-col items-center p-2 rounded-xl bg-slate-900 text-slate-400 gap-1"><Calendar className="w-4 h-4 text-indigo-400" /><span className="text-[9px] font-bold">Logins</span></button>
          <button onClick={() => { sound.playClick(); onOpenWatchAd(); }} className="flex flex-col items-center p-2 rounded-xl bg-slate-900 text-slate-400 gap-1"><Tv className="w-4 h-4 text-rose-400" /><span className="text-[9px] font-bold">Ads</span></button>
          <button onClick={() => { sound.playClick(); onOpenSpinWheel(); }} className="flex flex-col items-center p-2 rounded-xl bg-slate-900 text-slate-400 gap-1"><RefreshCw className="w-4 h-4 text-amber-400" /><span className="text-[9px] font-bold">Spin</span></button>
          <button onClick={() => { sound.playClick(); onOpenWalking(); }} className="flex flex-col items-center p-2 rounded-xl bg-slate-900 text-slate-400 gap-1"><Footprints className="w-4 h-4 text-emerald-400" /><span className="text-[9px] font-bold">Walk</span></button>
        </div>

        <div className="flex justify-center my-4 relative">
          <button onMouseDown={handleTap} onTouchStart={handleTap} className={`w-36 h-36 rounded-full bg-cyan-500 flex flex-col items-center justify-center transition-transform ${isPressed ? 'scale-90' : ''}`}>
            <Sparkles className="w-10 h-10 text-slate-950" />
            <span className="text-[10px] font-black uppercase text-slate-950 mt-1">Tap to Mine</span>
            <span className="text-xs font-bold text-slate-900 bg-cyan-200/50 px-2 py-0.5 rounded-full mt-1">{tapMineCount}</span>
            {floatingTaps.map((f) => (<span key={f.id} className="absolute text-sm font-black text-emerald-400 pointer-events-none animate-float-up" style={{ left: f.x, top: f.y }}>+₱0.01</span>))}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DailyTriviaQuiz answeredDate={triviaAnsweredDate} onReward={onTriviaReward} />
          <DailyLuckyChest onClaimReward={onClaimChest} />
        </div>

        <DailyMissions stepsToday={stepsToday} gamesPlayedToday={gamesPlayedToday} adsWatchedToday={adsWatchedToday} claimedMissionIds={claimedMissionIds} onClaimReward={onClaimMission} />
        <PersonalGoalTracker goals={personalGoals} onToggleGoal={onToggleGoal} onAddGoal={onAddGoal} />
        <Leaderboard currentUserName={currentUserName} currentUserTotalEarned={currentUserTotalEarned} />
      </div>
    </div>
  );
};
