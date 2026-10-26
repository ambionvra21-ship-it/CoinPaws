import React, { useState, useEffect, useCallback } from 'react';
import { loadUserState, saveUserState, formatPhp } from './utils/storage';
import { UserState, Transaction } from './types';
import { sound } from './utils/sound';
import { haptics } from './utils/haptics';
import { fireRewardConfetti } from './utils/confetti';
import { MainDashboard } from './components/views/MainDashboard';
import { CashOutModal } from './components/views/CashOutModal';
import { DailyCheckinModal } from './components/DailyCheckinModal';
import { WatchAndEarnModal } from './components/views/WatchAndEarnModal';
import { WalkingView } from './components/views/WalkingView';
import { MenuDrawer } from './components/MenuDrawer';
import { ProfileModal } from './components/ProfileModal';
import { ShareEarningsModal } from './components/ShareEarningsModal';

export default function App() {
  const [state, setState] = useState<UserState>(() => loadUserState());
  const [activeModal, setActiveModal] = useState<
    | null
    | 'cashout'
    | 'dailyLogins'
    | 'watchAd'
    | 'spinWheel'
    | 'walking'
    | 'scratch'
    | 'fruitTap'
    | 'menu'
    | 'profile'
    | 'referral'
    | 'support'
    | 'shareEarnings'
  >(null);

  useEffect(() => {
    sound.enabled = state.soundEnabled;
    haptics.enabled = state.soundEnabled;
  }, [state.soundEnabled]);

  useEffect(() => {
    saveUserState(state);
  }, [state]);

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
  // Add earnings helper
  const addEarnings = useCallback(
    (amount: number, title: string, type: Transaction['type']) => {
      setState((prev) => {
        const nextBalance = Number((prev.balancePhp + amount).toFixed(2));
        const nextTotal = Number((prev.totalEarnedPhp + amount).toFixed(2));

        const newTx: Transaction = {
          id: "tx-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
          type,
          amountPhp: amount,
          title,
          timestamp: Date.now(),
          status: 'COMPLETED',
        };

        const isGame = type === 'GAME_FRUIT' || type === 'GAME_SPIN' || type === 'GAME_SCRATCH';

        return {
          ...prev,
          balancePhp: nextBalance,
          totalEarnedPhp: nextTotal,
          gamesPlayedToday: isGame ? prev.gamesPlayedToday + 1 : prev.gamesPlayedToday,
          transactions: [newTx, ...prev.transactions].slice(0, 50),
        };
      });
    },
    []
  );

  // TAP TO MINE handler
  const handleTapMine = useCallback(() => {
    setState((prev) => {
      const increment = 0.01;
      const nextBalance = Number((prev.balancePhp + increment).toFixed(2));
      const nextTotal = Number((prev.totalEarnedPhp + increment).toFixed(2));
      return { ...prev, balancePhp: nextBalance, totalEarnedPhp: nextTotal, tapMineCount: prev.tapMineCount + 1 };
    });
  }, []);

  // Add walking steps
  const handleAddSteps = useCallback((amount: number) => {
    setState((prev) => ({ ...prev, stepsToday: prev.stepsToday + amount }));
  }, []);

  // Convert steps to real balance
  const handleConvertSteps = useCallback(
    (stepsConverted: number, cashReward: number) => {
      setState((prev) => {
        const nextBalance = Number((prev.balancePhp + cashReward).toFixed(2));
        const nextTotal = Number((prev.totalEarnedPhp + cashReward).toFixed(2));
        const nextSteps = Math.max(0, prev.stepsToday - stepsConverted);

        const newTx: Transaction = {
          id: "tx-walk-" + Date.now(),
          type: 'WALK',
          amountPhp: cashReward,
          title: "Pedometer Step Conversion (" + stepsConverted + " steps)",
          timestamp: Date.now(),
          status: 'COMPLETED',
        };

        return {
          ...prev,
          balancePhp: nextBalance,
          totalEarnedPhp: nextTotal,
          stepsToday: nextSteps,
          transactions: [newTx, ...prev.transactions].slice(0, 50),
        };
      });
    },
    []
  );

  // Daily Streak Claim
  const handleClaimDailyStreak = useCallback((day: number) => {
    const rewards = [0.50, 0.75, 1.00, 1.25, 1.50, 2.00, 5.00];
    const earned = rewards[Math.min(day - 1, rewards.length - 1)] || 0.50;

    setState((prev) => {
      const nextBalance = Number((prev.balancePhp + earned).toFixed(2));
      const nextTotal = Number((prev.totalEarnedPhp + earned).toFixed(2));
      const todayStr = new Date().toISOString().split('T')[0];

      const newTx: Transaction = {
        id: "tx-daily-" + Date.now(),
        type: 'DAILY_LOGIN',
        amountPhp: earned,
        title: "Day " + day + " Daily Login Bonus",
        timestamp: Date.now(),
        status: 'COMPLETED',
      };

      return {
        ...prev,
        balancePhp: nextBalance,
        totalEarnedPhp: nextTotal,
        consecutiveDays: prev.consecutiveDays + 1,
        lastCheckinDate: todayStr,
        freeSpins: prev.freeSpins + 1,
        freeScratchCards: prev.freeScratchCards + 1,
        transactions: [newTx, ...prev.transactions].slice(0, 50),
      };
    });
  }, []);

  // Watch Rewarded Ad Completed
  const handleAdRewardClaimed = useCallback((pawsScore: number) => {
    const cash = 0.20;
    setState((prev) => {
      const nextBalance = Number((prev.balancePhp + cash).toFixed(2));
      const nextTotal = Number((prev.totalEarnedPhp + cash).toFixed(2));

      const newTx: Transaction = {
        id: "tx-ad-" + Date.now(),
        type: 'WATCH_AD',
        amountPhp: cash,
        title: 'Watch Rewarded Ad Sponsor Bounty',
        timestamp: Date.now(),
        status: 'COMPLETED',
      };

      return {
        ...prev,
        balancePhp: nextBalance,
        totalEarnedPhp: nextTotal,
        adsWatchedToday: prev.adsWatchedToday + 1,
        freeSpins: prev.freeSpins + 1,
        transactions: [newTx, ...prev.transactions].slice(0, 50),
      };
    });
  }, []);

  // Withdrawal Cash Out Request
  const handleWithdrawal = useCallback(
    (amount: number, method: string, account: string) => {
      setState((prev) => {
        const nextBalance = Math.max(0, Number((prev.balancePhp - amount).toFixed(2)));

        const newTx: Transaction = {
          id: "tx-wd-" + Date.now(),
          type: 'WITHDRAWAL',
          amountPhp: amount,
          title: "Cash Out Withdrawal Request (" + method + ")",
          timestamp: Date.now(),
          status: 'PENDING',
        };

        return { ...prev, balancePhp: nextBalance, transactions: [newTx, ...prev.transactions].slice(0, 50) };
      });
    },
    []
  );
  // Toggle personal goals check status
  const handleToggleGoal = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      personalGoals: prev.personalGoals.map((g) =>
        g.id === id ? { ...g, completed: !g.completed } : g
      ),
    }));
  }, []);

  // Create a new customized goal tracker item
  const handleAddGoal = useCallback((title: string, icon: string) => {
    setState((prev) => {
      const newGoal = { id: "goal-" + Date.now(), title, icon, completed: false };
      return { ...prev, personalGoals: [...prev.personalGoals, newGoal] };
    });
  }, []);

  const handleClaimMission = useCallback(
    (missionId: string, phpReward: number, pawsReward: number, title: string) => {
      addEarnings(phpReward, "Completed Mission: " + title, 'MISSION');
      setState((prev) => ({ ...prev, claimedMissionIds: [...prev.claimedMissionIds, missionId] }));
      fireRewardConfetti(0.5);
    },
    [addEarnings]
  );

  const handleClaimChest = useCallback(
    (reward: any) => {
      addEarnings(reward.phpReward, 'Lucky Chest Loot Box Unlocked', 'CHEST');
      setState((prev) => ({ ...prev, lastLuckyChestDate: new Date().toISOString().split('T') }));
      fireRewardConfetti(0.6);
    },
    [addEarnings]
  );

  const handleTriviaReward = useCallback(
    (php: number, paws: number, title: string) => {
      addEarnings(php, "Trivia Reward: " + title, 'TRIVIA');
      setState((prev) => ({ ...prev, triviaAnsweredDate: new Date().toISOString().split('T') }));
      fireRewardConfetti(0.5);
    },
    [addEarnings]
  );

  const todayStr = new Date().toISOString().split('T');
  const hasClaimedCheckin = state.lastCheckinDate === todayStr;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-start pb-8">
      <MainDashboard
        balancePhp={state.balancePhp}
        targetThresholdPhp={state.targetThresholdPhp}
        tapMineCount={state.tapMineCount}
        currentUserTotalEarned={state.totalEarnedPhp}
        currentUserName={state.username}
        stepsToday={state.stepsToday}
        gamesPlayedToday={state.gamesPlayedToday}
        adsWatchedToday={state.adsWatchedToday}
        hasClaimedCheckin={hasClaimedCheckin}
        claimedMissionIds={state.claimedMissionIds}
        lastLuckyChestDate={state.lastLuckyChestDate}
        personalGoals={state.personalGoals}
        triviaAnsweredDate={state.triviaAnsweredDate}
        onTapMine={handleTapMine}
        onOpenCashOut={() => setActiveModal('cashout')}
        onOpenShareEarnings={() => setActiveModal('shareEarnings')}
        onOpenMenu={() => setActiveModal('menu')}
        onOpenProfile={() => setActiveModal('profile')}
        onOpenDailyLogins={() => setActiveModal('dailyLogins')}
        onOpenWatchAd={() => setActiveModal('watchAd')}
        onOpenSpinWheel={() => setActiveModal('spinWheel')}
        onOpenWalking={() => setActiveModal('walking')}
        onOpenScratchCards={() => setActiveModal('scratch')}
        onOpenFruitTap={() => setActiveModal('fruitTap')}
        onClaimMission={handleClaimMission}
        onClaimChest={handleClaimChest}
        onToggleGoal={handleToggleGoal}
        onAddGoal={handleAddGoal}
        onTriviaReward={handleTriviaReward}
      />

      {activeModal === 'menu' && (
        <MenuDrawer onClose={() => setActiveModal(null)} onNavigate={(view) => setActiveModal(view as any)} />
      )}
      {activeModal === 'profile' && (
        <ProfileModal userState={state} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'cashout' && (
        <CashOutModal balancePhp={state.balancePhp} onConfirmWithdrawal={handleWithdrawal} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'dailyLogins' && (
        <DailyCheckinModal consecutiveDays={state.consecutiveDays} hasClaimedToday={hasClaimedCheckin} onClaim={handleClaimDailyStreak} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'watchAd' && (
        <WatchAndEarnModal adsWatchedToday={state.adsWatchedToday} onAdRewardClaimed={handleAdRewardClaimed} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'walking' && (
        <WalkingView stepsToday={state.stepsToday} onAddSteps={handleAddSteps} onConvertSteps={handleConvertSteps} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'shareEarnings' && (
        <ShareEarningsModal balancePhp={state.balancePhp} username={state.username} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
