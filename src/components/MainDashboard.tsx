import React, { useState, useEffect } from 'react';
import { Menu, User, Sparkles, Footprints, Tv, Calendar, RefreshCw, Trophy, Share2 } from 'lucide-react';
import { sound } from '../utils/sound';
import { haptics } from '../utils/haptics';
import { fireRewardConfetti } from '../utils/confetti';
import { formatPhp } from '../utils/storage';
import { Leaderboard } from './Leaderboard';
import { DailyMissions } from './DailyMissions';
import DailyNewsTicker from './DailyNewsTicker';
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

    let clientX = 0;
    let clientY = 0;
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
        {/* QUICK SHORTCUT ACTIONS GRID */}
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

        {/* MINING TAP INTERACTIVE BUTTON SECTION */}
        <div className="flex flex-col items-center justify-center my-2 relative">
          <button
            onMouseDown={handleTap}
            onTouchStart={handleTap}
            className={`relative w-40 h-40 rounded-full bg-gradient-to-b from-cyan-600 via-cyan-500 to-sky-600 border-[6px] border-slate-900 shadow-[0_0_30px_rgba(6,182,212,0.4)] flex flex-col items-center justify-center cursor-pointer transition-transform duration-700 outline-none ${
              isMiningPressed ? 'scale-90 duration-75 brightness-110' : ''
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            <div className="absolute inset-2 border-2 border-dashed border-cyan-200/30 rounded-full" />
            <Sparkles className="w-12 h-12 text-slate-950 fill-cyan-100" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-950 mt-1 font-fredoka">Tap to Mine</span>
            <span className="text-xs font-mono font-bold text-slate-900 bg-cyan-200/60 px-2 py-0.5 rounded-full mt-1.5">{tapMineCount}</span>
            
            {/* Render absolute floating reward indicator text animations */}
            {floatingTaps.map((f) => (
              <span
                key={f.id}
                className="absolute text-sm font-black font-fredoka text-emerald-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pointer-events-none animate-float-up"
                style={{ left: f.x, top: f.y }}
              >
                {f.text}
              </span>
            ))}
          </button>
        </div>

        {/* TRIVIA & PROGRESS RINGS SUB MODULE COMPONENT ROW */}
        <div className="grid grid-cols-2 gap-3">
          <DailyTriviaQuiz 
            answeredDate={triviaAnsweredDate} 
            onReward={onTriviaReward} 
          />
          <DailyLuckyChest 
            lastChestDate={lastLuckyChestDate} 
            onClaimReward={onClaimChest} 
          />
        </div>

        {/* MISSIONS SUBMODULE COMPONENT */}
        <DailyMissions 
          stepsToday={stepsToday}
          gamesPlayedToday={gamesPlayedToday}
          adsWatchedToday={adsWatchedToday}
          claimedMissionIds={claimedMissionIds}
          onClaimReward={onClaimMission}
        />

        {/* GOALS TRACKER AND GLOBAL LEADERBOARD GRAPH COMPONENT */}
        <PersonalGoalTracker 
          goals={personalGoals} 
          onToggleGoal={onToggleGoal} 
          onAddGoal={onAddGoal} 
        />

        <Leaderboard 
          stepsToday={stepsToday} 
          gamesPlayedToday={gamesPlayedToday} 
          adsWatchedToday={adsWatchedToday} 
          claimedMissionIds={claimedMissionIds}
          currentUserName={currentUserName}
          currentUserTotalEarned={currentUserTotalEarned}
        />
      </div>
    </div>
  );
};
