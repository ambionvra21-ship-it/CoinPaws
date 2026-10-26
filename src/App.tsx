import React, { useState, useEffect, useCallback } from 'react';
import { loadUserState, saveUserState } from './utils/storage';
import { UserState, Transaction } from './types';
import { sound } from './utils/sound';
import { haptics } from './utils/haptics';
import { fireRewardConfetti } from './utils/confetti';
import { MainDashboard } from './components/MainDashboard';
import { CashOutModal } from './components/views/CashOutModal';
import { DailyCheckinModal } from './components/DailyCheckinModal';
import { WatchAndEarnModal } from './components/views/WatchAndEarnModal';
import { WalkingView } from './components/views/WalkingView';
import { MenuDrawer } from './components/MenuDrawer';
import { ProfileModal } from './components/ProfileModal';
import { ShareEarningsModal } from './components/ShareEarningsModal';

const initialFallbackState: UserState = {
  username: "Player",
  balancePhp: 0.00,
  totalEarnedPhp: 0.00,
  referralEarningsPhp: 0.00,
  tapMineCount: 0,
  stepsToday: 0,
  gamesPlayedToday: 0,
  adsWatchedToday: 0,
  consecutiveDays: 0,
  lastCheckinDate: "",
  freeSpins: 5,
  freeScratchCards: 5,
  claimedMissionIds: [],
  lastLuckyChestDate: "",
  personalGoals: [],
  triviaAnsweredDate: "",
  soundEnabled: true
};

export default function App() {
  const [state, setState] = useState<UserState>(initialFallbackState);
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeModal, setActiveModal] = useState<null | 'cashout' | 'dailyLogins' | 'watchAd' | 'walking' | 'menu' | 'profile' | 'shareEarnings'>(null);

  // Safe data hydration layout
  useEffect(() => {
    try {
      const savedData = loadUserState();
      if (savedData) setState(savedData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    sound.enabled = state.soundEnabled;
    haptics.enabled = state.soundEnabled;
  }, [state.soundEnabled, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try { saveUserState(state); } catch (e) { console.error(e); }
  }, [state, isHydrated]);

  useEffect(() => {
    const timer = setInterval(() => {
      setState((prev) => {
        const nextBalance = Number((prev.balancePhp + 0.01).toFixed(2));
        const nextTotal = Number((prev.totalEarnedPhp + 0.01).toFixed(2));
        return { ...prev, balancePhp: nextBalance, totalEarnedPhp: nextTotal };
      });
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  const addEarnings = useCallback((amount: number, title: string, type: Transaction['type']) => {
    setState((prev) => {
      const nextBalance = Number((prev.balancePhp + amount).toFixed(2));
      const nextTotal = Number((prev.totalEarnedPhp + amount).toFixed(2));
      const newTx: Transaction = {
        id: "tx-" + Date.now(),
        type,
        amountPhp: amount,
        title,
        timestamp: Date.now(),
        status: 'COMPLETED',
      };
      return {
        ...prev,
        balancePhp: nextBalance,
        totalEarnedPhp: nextTotal,
        transactions: [newTx, ...prev.transactions].slice(0, 50),
      };
    });
  }, []);

  const handleTapMine = useCallback(() => {
    setState((prev) => {
      const nextBalance = Number((prev.balancePhp + 0.01).toFixed(2));
      const nextTotal = Number((prev.totalEarnedPhp + 0.01).toFixed(2));
      return { ...prev, balancePhp: nextBalance, totalEarnedPhp: nextTotal, tapMineCount: prev.tapMineCount + 1 };
    });
  }, []);

  const handleAddSteps = useCallback((amount: number) => {
    setState((prev) => ({ ...prev, stepsToday: prev.stepsToday + amount }));
  }, []);

  const handleConvertSteps = useCallback((stepsConverted: number, cashReward: number) => {
    setState((prev) => {
      const nextBalance = Number((prev.balancePhp + cashReward).toFixed(2));
      const nextTotal = Number((prev.totalEarnedPhp + cashReward).toFixed(2));
      return { ...prev, balancePhp: nextBalance, totalEarnedPhp: nextTotal, stepsToday: Math.max(0, prev.stepsToday - stepsConverted) };
    });
  }, []);

  const handleWithdrawal = useCallback((amount: number, method: string, account: string) => {
    setState((prev) => {
      const nextBalance = Math.max(0, Number((prev.balancePhp - amount).toFixed(2)));
      return { ...prev, balancePhp: nextBalance };
    });
  }, []);

  const todayStr = new Date().toISOString().split('T');
  const hasClaimedCheckin = state.lastCheckinDate === todayStr;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-start pb-8">
      <MainDashboard
        balancePhp={state.balancePhp}
        targetThresholdPhp={state.targetThresholdPhp || 100}
        tapMineCount={state.tapMineCount}
        currentUserTotalEarned={state.totalEarnedPhp}
        currentUserName={state.username}
        stepsToday={state.stepsToday}
        gamesPlayedToday={state.gamesPlayedToday}
        adsWatchedToday={state.adsWatchedToday}
        hasClaimedCheckin={hasClaimedCheckin}
        claimedMissionIds={state.claimedMissionIds || []}
        lastLuckyChestDate={state.lastLuckyChestDate || ''}
        personalGoals={state.personalGoals || []}
        triviaAnsweredDate={state.triviaAnsweredDate || ''}
        onTapMine={handleTapMine}
        onOpenCashOut={() => setActiveModal('cashout')}
        onOpenShareEarnings={() => setActiveModal('shareEarnings')}
        onOpenMenu={() => setActiveModal('menu')}
        onOpenProfile={() => setActiveModal('profile')}
        onOpenDailyLogins={() => setActiveModal('dailyLogins')}
        onOpenWatchAd={() => setActiveModal('watchAd')}
        onOpenSpinWheel={() => {}}
        onOpenWalking={() => setActiveModal('walking')}
        onOpenScratchCards={() => {}}
        onOpenFruitTap={() => {}}
        onClaimMission={() => {}}
        onClaimChest={() => {}}
        onToggleGoal={() => {}}
        onAddGoal={() => {}}
        onTriviaReward={() => {}}
      />

      {activeModal === 'profile' && <ProfileModal userState={state} onClose={() => setActiveModal(null)} />}
      {activeModal === 'cashout' && <CashOutModal balancePhp={state.balancePhp} onConfirmWithdrawal={handleWithdrawal} onClose={() => setActiveModal(null)} />}
      {activeModal === 'dailyLogins' && <DailyCheckinModal consecutiveDays={state.consecutiveDays} hasClaimedToday={hasClaimedCheckin} onClaim={() => {}} onClose={() => setActiveModal(null)} />}
      {activeModal === 'walking' && <WalkingView stepsToday={state.stepsToday} onAddSteps={handleAddSteps} onConvertSteps={handleConvertSteps} onClose={() => setActiveModal(null)} />}
    </div>
  );
}
