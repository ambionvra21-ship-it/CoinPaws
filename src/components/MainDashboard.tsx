import React, { useState, useEffect } from 'react';
import { Menu, User, Sparkles, Footprints, Tv, Calendar, RefreshCw, Trophy, Share2 } from 'lucide-react';

// FIX: Removed curly braces to match your project's default exports
import sound from '../utils/sound';
import haptics from '../utils/haptics';
import fireRewardConfetti from '../utils/confetti';
import { formatPhp } from '../utils/storage';

import { Leaderboard } from './Leaderboard';
import { DailyMissions } from './DailyMissions';
import { DailyNewsTicker } from './DailyNewsTicker';
import { DailyLuckyChest, ChestReward } from './DailyLuckyChest';
import { DailyProgressRing } from './DailyProgressRing';
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
  hasClaimedCheckin,
  claimedMissionIds,
  lastLuckyChestDate,
  theme = 'slate',
  batterySaver = false,
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
  onOpenScratchCards,
  onOpenFruitTap,
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

  // Realistic Android clock
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
  // Handle central "TAP TO MINE"
  const handleTap = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    sound.playCoin();
    haptics.tapMine();
    setIsMiningPressed(true);
    setTimeout(() => setIsMiningPressed(false), 150);

    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches.clientX;
      clientY = e.touches.clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const relX = clientX ? clientX - rect.left : rect.width / 2;
    const relY = clientY ? clientY - rect.top : rect.height / 2;

    const newFloat: FloatingTap = {
      id: nextId,
      x: relX,
      y: relY,
      text: '+₱0.01',
    };

    setNextId((prev) => prev + 1);
    setFloatingTaps((prev) => [...prev.slice(-6), newFloat]);

    onTapMine();

    if ((tapMineCount + 1) % 25 === 0) {
      fireRewardConfetti(0.4);
    }
  };

  useEffect(() => {
    if (floatingTaps.length === 0) return;
    const timer = setTimeout(() => {
      setFloatingTaps((prev) => prev.slice(1));
    }, 700);
    return () => clearTimeout(timer);
  }, [floatingTaps]);

  const thresholdPercent = Math.min(100, Math.max(3, (balancePhp / targetThresholdPhp) * 100));

  return (
    <div className="w-full flex flex-col justify-start select-none">
      {/* Android Top Status Bar */}
      <div className="w-full px-5 pt-1.5 pb-1 flex items-center justify-between text-[11px] font-medium text-slate-300">
        <span className="font-semibold text-slate-200">{currentTime}</span>
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <span className="text-[9px] font-mono font-bold bg-slate-800/80 px-1 py-0.2 rounded text-cyan-300">
            Vo LTE
          </span>
          <span className="text-[9px] font-mono font-bold bg-slate-800/80 px-1 py-0.2 rounded text-cyan-300">
            4G LTE
          </span>
          <div className="flex items-center gap-0.5">
            <span className="text-[10px] text-cyan-300 font-mono">21%</span>
            <div className="w-4 h-2.5 rounded-xs border border-cyan-400 p-0.2 flex items-center">
              <div className="h-full bg-cyan-400 w-1/4 rounded-2xs" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onOpenMenu();
          }}
          className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-cyan-500/30 text-cyan-400 flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-md shadow-cyan-950/40"
          title="Open Menu"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
        </button>

        <h1 className="font-fredoka text-2xl font-bold tracking-normal bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">
          MoneyPaws
        </h1>

        <button
          onClick={() => {
            sound.playClick();
            onOpenProfile();
          }}
          className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-cyan-500/30 text-cyan-400 flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-md shadow-cyan-950/40"
          title="User Profile"
        >
          <User className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>

      <div className="px-4 flex flex-col gap-3 mt-1">
        <DailyNewsTicker />

        {/* TOTAL EARNINGS CARD */}
        <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/95 via-cyan-950/35 to-slate-900/95 border border-cyan-500/40 p-4 shadow-[0_0_20px_rgba(6,182,212,0.18)] overflow-hidden">
          <div className="absolute -top-10 left-1/4 w-40 h-20 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300/80">
                TOTAL EARNINGS BALANCE
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-slate-100 font-sans tracking-tight">
                  {formatPhp(balancePhp)}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenShareEarnings();
                }}
                className="w-9 h-9 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-300 active:scale-95 transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenCashOut();
                }}
                className="px-4 h-9 font-sans font-bold text-sm bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 rounded-lg shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                Cash Out
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60">
            <div className="w-full bg-slate-950/80 rounded-full h-1.5 p-0.5 border border-slate-800/50">
              <div
                className="bg-gradient-to-r from-cyan-500 via-sky-400 to-cyan-300 h-full rounded-full transition-all duration-500 relative"
                style={{ width: `${thresholdPercent}%` }}
              >
                <div className="absolute -right-1.5 -top-1 w-2.5 h-2.5 rounded-full bg-cyan-200 animate-pulse shadow-md shadow-cyan-400" />
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] mt-2 font-medium text-slate-400">
              <span>Next Target Threshold:</span>
              <span className="font-bold text-cyan-300 font-mono">
                {formatPhp(balancePhp)} / {formatPhp(targetThresholdPhp)}
              </span>
            </div>
          </div>
        </div>
        {/* FEATURES GRID LINKS */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          <button
            onClick={() => {
              sound.playClick();
              onOpenDailyLogins();
            }}
            className="group relative p-4 flex flex-col items-center justify-center bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl transition-all cursor-pointer active:scale-95 overflow-hidden"
          >
            {!hasClaimedCheckin && (
              <span className="absolute top-3 right-3 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            )}
            <div className={`p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/60 text-cyan-400 mb-2.5 ${
              !hasClaimedCheckin ? 'animate-breathe' : 'group-hover:scale-105 transition-transform'
            }`}>
              <Calendar className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-slate-200 tracking-wide">Daily Check-In</span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              {!hasClaimedCheckin ? 'Claim Reward!' : 'Done Today'}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenWatchAd();
            }}
            className="group p-4 flex flex-col items-center justify-center bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl transition-all cursor-pointer active:scale-95"
          >
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/60 text-cyan-400 mb-2.5 group-hover:scale-105 transition-transform">
              <Tv className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-slate-200 tracking-wide">Watch & Earn</span>
            <span className="text-[10px] text-cyan-400/80 mt-0.5 font-semibold font-mono">
              {adsWatchedToday} Watched
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenWalking();
            }}
            className="group p-4 flex flex-col items-center justify-center bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl transition-all cursor-pointer active:scale-95"
          >
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/60 text-cyan-400 mb-2.5 group-hover:scale-105 transition-transform">
              <Footprints className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-slate-200 tracking-wide">Pedometer Walk</span>
            <span className="text-[10px] text-slate-400 mt-0.5 font-mono">{stepsToday} Steps</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenSpinWheel();
            }}
            className="group p-4 flex flex-col items-center justify-center bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl transition-all cursor-pointer active:scale-95"
          >
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/60 text-cyan-400 mb-2.5 group-hover:scale-105 transition-transform">
              <RefreshCw className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-slate-200 tracking-wide">Lucky Spin</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Test Your Luck</span>
          </button>
        </div>

        {/* PAW MINING INTERACTIVE SECTION AREA */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-4 flex flex-col items-center mt-1 relative overflow-hidden">
          <div className="text-center mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Paw Mine Pool</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Tap the core sphere directly to mine rewards</p>
          </div>

          <div className="relative w-40 h-40 flex items-center justify-center my-2">
            {floatingTaps.map((tap) => (
              <span
                key={tap.id}
                className="absolute text-sm font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] pointer-events-none animate-[ping_0.7s_ease-out_forwards] font-mono z-30"
                style={{ left: tap.x, top: tap.y }}
              >
                {tap.text}
              </span>
            ))}

            <button
              onClick={handleTap}
              onTouchStart={() => haptics.light()}
              className={`w-32 h-32 rounded-full bg-slate-950 border-2 border-cyan-500/40 flex flex-col items-center justify-center shadow-lg cursor-pointer transition-all duration-100 select-none outline-hidden relative group overflow-hidden ${
                isMiningPressed 
                  ? 'scale-90 shadow-cyan-500/10 border-cyan-400' 
                  : 'hover:border-cyan-400/70 shadow-cyan-950/60'
              }`}
            >
              <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-pulse group-hover:border-cyan-400/40" />
              <Sparkles className={`w-8 h-8 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)] mb-1 ${
                isMiningPressed ? 'rotate-12' : 'group-hover:animate-spin'
              }`} />
              <span className="text-[10px] font-black tracking-widest text-cyan-300 font-fredoka uppercase">
                TAP TO MINE
              </span>
              <span className="text-[11px] font-bold text-slate-400 font-mono mt-0.5">
                {tapMineCount}
              </span>
            </button>
          </div>
        </div>
        {/* PROGRESS RING TARGET METRICS CARD */}
        <DailyProgressRing 
          stepsToday={stepsToday}
          gamesPlayedToday={gamesPlayedToday}
          adsWatchedToday={adsWatchedToday}
        />

        {/* LUCKY CHEST HOOK MODULE */}
        <DailyLuckyChest 
          lastOpenedDate={lastLuckyChestDate}
          onClaimReward={onClaimChest}
        />

        {/* TRIVIA QUIZ ENGAGEMENT HUB */}
        <DailyTriviaQuiz 
          answeredDate={triviaAnsweredDate}
          onRewardEarned={onTriviaReward}
        />

        {/* GOALS TRACKING MANAGEMENT TAB */}
        <PersonalGoalTracker 
          goals={personalGoals}
          onToggleGoal={onToggleGoal}
          onAddGoal={onAddGoal}
        />

        {/* MISSIONS REWARDS PANEL CHECKER */}
        <DailyMissions 
          stepsToday={stepsToday}
          gamesPlayedToday={gamesPlayedToday}
          adsWatchedToday={adsWatchedToday}
          claimedMissionIds={claimedMissionIds}
          onClaimReward={onClaimMission}
        />

        {/* LEADERBOARDS RANKINGS COMPONENT CARD */}
        <Leaderboard 
          currentUserEarned={currentUserTotalEarned}
          currentUserName={currentUserName}
        />

        {/* FOOTER CREDITS BRAND LOGO MARKS */}
        <div className="w-full text-center py-6 text-[10px] text-slate-600 font-medium tracking-wide flex flex-col items-center gap-1.5 border-t border-slate-900/60 mt-4">
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3 text-amber-500/50" />
            <span>MONEYPAWS PASSIVE RUNTIME V4.2</span>
          </div>
          <p>© 2026 MoneyPaws Ecosystem. All Rights Reserved.</p>
        </div>

      </div>
    </div>
  );
};
