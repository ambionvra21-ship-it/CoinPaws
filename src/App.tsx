/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { loadUserState, saveUserState, formatPhp } from './utils/storage';
import { UserState, Transaction, SupportTicket, SUPPORT_EMAIL } from './types';
import { sound } from './utils/sound';
import { haptics } from './utils/haptics';
import { fireRewardConfetti } from './utils/confetti';
import { MainDashboard } from './components/MainDashboard';
import { CashOutModal } from './components/views/CashOutModal';
import { DailyCheckinModal } from './components/DailyCheckinModal';
import { WatchAndEarnModal } from './components/views/WatchAndEarnModal';
import { WalkingView } from './components/views/WalkingView';
import { GamesView } from './components/views/GamesView';
import { MenuDrawer } from './components/MenuDrawer';
import { ProfileModal } from './components/ProfileModal';
import { ReferralModal } from './components/ReferralModal';
import { SupportView } from './components/views/SupportView';
import { ChestReward } from './components/DailyLuckyChest';
import { ShareEarningsModal } from './components/ShareEarningsModal';
import { Smartphone, Monitor, X, Sparkles } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<UserState>(() => loadUserState());
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Modal / View states
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

  // Synchronize sound & haptics enabled state
  useEffect(() => {
    sound.enabled = state.soundEnabled;
    haptics.enabled = state.soundEnabled;
  }, [state.soundEnabled]);

  // Persist state to localStorage on changes
  useEffect(() => {
    saveUserState(state);
  }, [state]);

  // Passive micro-mining tick (earns ₱0.01 every 45s while app is open)
  useEffect(() => {
    const timer = setInterval(() => {
      setState((prev) => {
        const nextBalance = Number((prev.balancePhp + 0.01).toFixed(2));
        const nextTotal = Number((prev.totalEarnedPhp + 0.01).toFixed(2));
        return {
          ...prev,
          balancePhp: nextBalance,
          totalEarnedPhp: nextTotal,
        };
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
          id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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

      return {
        ...prev,
        balancePhp: nextBalance,
        totalEarnedPhp: nextTotal,
        tapMineCount: prev.tapMineCount + 1,
      };
    });
  }, []);

  // Add walking steps
  const handleAddSteps = useCallback((amount: number) => {
    setState((prev) => ({
      ...prev,
      stepsToday: prev.stepsToday + amount,
    }));
  }, []);

  // Convert steps to real balance
  const handleConvertSteps = useCallback(
    (stepsConverted: number, cashReward: number) => {
      setState((prev) => {
        const nextBalance = Number((prev.balancePhp + cashReward).toFixed(2));
        const nextTotal = Number((prev.totalEarnedPhp + cashReward).toFixed(2));
        const nextSteps = Math.max(0, prev.stepsToday - stepsConverted);

        const newTx: Transaction = {
          id: `tx-walk-${Date.now()}`,
          type: 'WALK',
          amountPhp: cashReward,
          title: `Pedometer Step Conversion (${stepsConverted} steps)`,
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
        id: `tx-daily-${Date.now()}`,
        type: 'DAILY_LOGIN',
        amountPhp: earned,
        title: `Day ${day} Daily Login Bonus`,
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
    const cash = 0.20; // ₱0.20 per rewarded ad
    setState((prev) => {
      const nextBalance = Number((prev.balancePhp + cash).toFixed(2));
      const nextTotal = Number((prev.totalEarnedPhp + cash).toFixed(2));

      const newTx: Transaction = {
        id: `tx-ad-${Date.now()}`,
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

  // Simulate friend referral
  const handleSimulateReferral = useCallback(() => {
    const bonus = 1.00; // ₱1.00 per referral
    setState((prev) => {
      const nextBalance = Number((prev.balancePhp + bonus).toFixed(2));
      const nextTotal = Number((prev.totalEarnedPhp + bonus).toFixed(2));
      const nextReferralEarnings = Number((prev.referralEarningsPhp + bonus).toFixed(2));

      const newTx: Transaction = {
        id: `tx-ref-${Date.now()}`,
        type: 'REFERRAL',
        amountPhp: bonus,
        title: 'New Friend Referral Credit',
        timestamp: Date.now(),
        status: 'COMPLETED',
      };

      return {
        ...prev,
        balancePhp: nextBalance,
        totalEarnedPhp: nextTotal,
        referralCount: prev.referralCount + 1,
        referralEarningsPhp: nextReferralEarnings,
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
          id: `tx-wd-${Date.now()}`,
          type: 'WITHDRAWAL',
          amountPhp: -amount,
          title: `Cash Out via ${method}`,
          timestamp: Date.now(),
          status: 'PROCESSING',
          payoutMethod: method,
          accountNumber: account,
        };

        return {
          ...prev,
          balancePhp: nextBalance,
          transactions: [newTx, ...prev.transactions].slice(0, 50),
        };
      });
    },
    []
  );

  // Claim Daily Mission Reward
  const handleClaimMission = useCallback(
    (missionId: string, phpReward: number, pawsReward: number, title: string) => {
      setState((prev) => {
        if (prev.claimedMissionIds.includes(missionId)) return prev;
        const nextBalance = Number((prev.balancePhp + phpReward).toFixed(2));
        const nextTotal = Number((prev.totalEarnedPhp + phpReward).toFixed(2));

        const newTx: Transaction = {
          id: `tx-mission-${Date.now()}`,
          type: 'DAILY_MISSION',
          amountPhp: phpReward,
          title: `Daily Mission: ${title} (+${pawsReward} Paws)`,
          timestamp: Date.now(),
          status: 'COMPLETED',
        };

        return {
          ...prev,
          balancePhp: nextBalance,
          totalEarnedPhp: nextTotal,
          claimedMissionIds: [...prev.claimedMissionIds, missionId],
          freeSpins: missionId === 'm-mega-chest' ? prev.freeSpins + 1 : prev.freeSpins,
          transactions: [newTx, ...prev.transactions].slice(0, 50),
        };
      });
    },
    []
  );

  // Claim Daily Lucky Chest (Distinct Mystery Event)
  const handleClaimLuckyChest = useCallback((reward: ChestReward) => {
    setState((prev) => {
      const todayStr = new Date().toISOString().split('T')[0];
      const nextBalance = Number((prev.balancePhp + reward.php).toFixed(2));
      const nextTotal = Number((prev.totalEarnedPhp + reward.php).toFixed(2));
      const bonusSpins = reward.bonusSpins || 0;
      const bonusCards = reward.bonusCards || 0;

      const newTx: Transaction = {
        id: `tx-chest-${Date.now()}`,
        type: 'LUCKY_CHEST',
        amountPhp: reward.php,
        title: `Daily Lucky Chest: ${reward.tierName} (+${reward.paws} Paws)`,
        timestamp: Date.now(),
        status: 'COMPLETED',
      };

      return {
        ...prev,
        balancePhp: nextBalance,
        totalEarnedPhp: nextTotal,
        lastLuckyChestDate: todayStr,
        freeSpins: prev.freeSpins + bonusSpins,
        freeScratchCards: prev.freeScratchCards + bonusCards,
        transactions: [newTx, ...prev.transactions].slice(0, 50),
      };
    });
  }, []);

  // Add Support Ticket
  const handleAddTicket = useCallback((ticket: SupportTicket) => {
    setState((prev) => ({
      ...prev,
      tickets: [ticket, ...prev.tickets],
    }));
  }, []);

  // Sound Toggle
  const handleToggleSound = useCallback(() => {
    setState((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-0 md:p-4 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Top Floating View Switcher (Desktop only) */}
      <div className="hidden md:flex fixed top-3 right-4 z-40 items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/30 text-xs text-slate-300 shadow-xl">
        <span className="text-[11px] text-slate-400">Preview:</span>
        <button
          onClick={() => setIsPhoneFrame(true)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
            isPhoneFrame ? 'bg-cyan-500 text-slate-950' : 'hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Android Frame</span>
        </button>
        <button
          onClick={() => setIsPhoneFrame(false)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
            !isPhoneFrame ? 'bg-cyan-500 text-slate-950' : 'hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Full Width</span>
        </button>
      </div>

      {/* Main Container: Mobile Phone Shell or Responsive Canvas */}
      <main
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[410px] min-h-[840px] bg-slate-950 rounded-none md:rounded-[44px] border-0 md:border-[10px] md:border-slate-800 shadow-none md:shadow-[0_0_60px_rgba(6,182,212,0.25)] relative overflow-hidden flex flex-col'
            : 'max-w-2xl min-h-screen bg-slate-950 shadow-2xl relative overflow-hidden flex flex-col'
        }`}
      >
        {/* Android Speaker Grill & Camera Punch-hole (Frame mode) */}
        {isPhoneFrame && (
          <div className="hidden md:flex absolute top-2 left-1/2 -translate-x-1/2 z-30 items-center gap-3 pointer-events-none">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950 ring-1 ring-cyan-500/40" />
            </div>
            <div className="w-12 h-1 rounded-full bg-slate-800" />
          </div>
        )}

        {/* Primary Screen Content: Exactly replicating the uploaded mockup */}
        <div className="flex-1 w-full overflow-y-auto pb-6">
          <MainDashboard
            balancePhp={state.balancePhp}
            targetThresholdPhp={state.targetThresholdPhp}
            tapMineCount={state.tapMineCount}
            currentUserTotalEarned={state.totalEarnedPhp}
            currentUserName={state.userName}
            stepsToday={state.stepsToday}
            gamesPlayedToday={state.gamesPlayedToday}
            adsWatchedToday={state.adsWatchedToday}
            hasClaimedCheckin={state.lastCheckinDate === new Date().toISOString().split('T')[0]}
            claimedMissionIds={state.claimedMissionIds}
            lastLuckyChestDate={state.lastLuckyChestDate}
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
            onClaimChest={handleClaimLuckyChest}
          />
        </div>

        {/* Android Home Navigation Pill Indicator */}
        <div className="w-full py-2 flex items-center justify-center bg-slate-950/80 pointer-events-none">
          <div className="w-32 h-1 rounded-full bg-slate-700/80" />
        </div>
      </main>

      {/* ========================================================
          MODALS & SUB-SCREENS
          ======================================================== */}

      {/* Cash Out Modal */}
      <CashOutModal
        isOpen={activeModal === 'cashout'}
        onClose={() => setActiveModal(null)}
        balancePhp={state.balancePhp}
        targetThresholdPhp={state.targetThresholdPhp}
        onWithdraw={handleWithdrawal}
      />

      {/* Daily Check-in Streak Modal */}
      <DailyCheckinModal
        isOpen={activeModal === 'dailyLogins'}
        onClose={() => setActiveModal(null)}
        consecutiveDays={state.consecutiveDays}
        lastCheckinDate={state.lastCheckinDate}
        onClaimDaily={handleClaimDailyStreak}
      />

      {/* Watch Rewarded Ad Modal */}
      <WatchAndEarnModal
        isOpen={activeModal === 'watchAd'}
        onClose={() => setActiveModal(null)}
        onRewardClaimed={handleAdRewardClaimed}
        adsWatchedToday={state.adsWatchedToday}
      />

      {/* Walking Steps Modal / View */}
      {activeModal === 'walking' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-slate-950 border border-cyan-500/40 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                sound.playClick();
                setActiveModal(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <WalkingView
              stepsToday={state.stepsToday}
              stepsGoal={state.stepsGoal}
              onAddSteps={handleAddSteps}
              onConvertStepsToCash={handleConvertSteps}
              onClose={() => setActiveModal(null)}
            />
          </div>
        </div>
      )}

      {/* Spin the Wheel Modal / View */}
      {activeModal === 'spinWheel' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-slate-950 border border-cyan-500/40 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                sound.playClick();
                setActiveModal(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <GamesView
              paws={Math.round(state.balancePhp * 1000)}
              freeSpins={state.freeSpins}
              freeScratchCards={state.freeScratchCards}
              onAddPaws={(paws, title, type) => {
                const php = Number((paws / 1000).toFixed(2));
                addEarnings(php, title, type);
              }}
              onUseFreeSpin={() => {
                setState((prev) => ({ ...prev, freeSpins: Math.max(0, prev.freeSpins - 1) }));
              }}
              onUseScratchCard={() => {
                setState((prev) => ({ ...prev, freeScratchCards: Math.max(0, prev.freeScratchCards - 1) }));
              }}
              onOpenWatchAd={() => {
                setActiveModal('watchAd');
              }}
            />
          </div>
        </div>
      )}

      {/* Scratch & Win Paws Modal / View */}
      {activeModal === 'scratch' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-slate-950 border border-cyan-500/40 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                sound.playClick();
                setActiveModal(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <GamesView
              paws={Math.round(state.balancePhp * 1000)}
              freeSpins={state.freeSpins}
              freeScratchCards={state.freeScratchCards}
              onAddPaws={(paws, title, type) => {
                const php = Number((paws / 1000).toFixed(2));
                addEarnings(php, title, type);
              }}
              onUseFreeSpin={() => {
                setState((prev) => ({ ...prev, freeSpins: Math.max(0, prev.freeSpins - 1) }));
              }}
              onUseScratchCard={() => {
                setState((prev) => ({ ...prev, freeScratchCards: Math.max(0, prev.freeScratchCards - 1) }));
              }}
              onOpenWatchAd={() => {
                setActiveModal('watchAd');
              }}
            />
          </div>
        </div>
      )}

      {/* Fruit Tap Modal / View */}
      {activeModal === 'fruitTap' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-slate-950 border border-cyan-500/40 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                sound.playClick();
                setActiveModal(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <GamesView
              paws={Math.round(state.balancePhp * 1000)}
              freeSpins={state.freeSpins}
              freeScratchCards={state.freeScratchCards}
              onAddPaws={(paws, title, type) => {
                const php = Number((paws / 1000).toFixed(2));
                addEarnings(php, title, type);
              }}
              onUseFreeSpin={() => {
                setState((prev) => ({ ...prev, freeSpins: Math.max(0, prev.freeSpins - 1) }));
              }}
              onUseScratchCard={() => {
                setState((prev) => ({ ...prev, freeScratchCards: Math.max(0, prev.freeScratchCards - 1) }));
              }}
              onOpenWatchAd={() => {
                setActiveModal('watchAd');
              }}
            />
          </div>
        </div>
      )}

      {/* Slide-out Menu Drawer */}
      <MenuDrawer
        isOpen={activeModal === 'menu'}
        onClose={() => setActiveModal(null)}
        soundEnabled={state.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenReferral={() => setActiveModal('referral')}
        onOpenSupport={() => setActiveModal('support')}
        onOpenFaq={() => setActiveModal('support')}
        onOpenLeaderboard={() => {
          setActiveModal(null);
          setTimeout(() => {
            document.getElementById('leaderboard-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onOpenMissions={() => {
          setActiveModal(null);
          setTimeout(() => {
            document.getElementById('missions-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onOpenShareEarnings={() => setActiveModal('shareEarnings')}
      />

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={activeModal === 'profile'}
        onClose={() => setActiveModal(null)}
        userName={state.userName}
        userEmail={state.userEmail}
        balancePhp={state.balancePhp}
        totalEarnedPhp={state.totalEarnedPhp}
        consecutiveDays={state.consecutiveDays}
        referralCode={state.referralCode}
        onOpenSupport={() => setActiveModal('support')}
      />

      {/* Referral Program Modal */}
      <ReferralModal
        isOpen={activeModal === 'referral'}
        onClose={() => setActiveModal(null)}
        referralCode={state.referralCode}
        referralCount={state.referralCount}
        referralEarningsPhp={state.referralEarningsPhp}
        onSimulateReferral={handleSimulateReferral}
      />

      {/* Share Earnings Card Modal */}
      <ShareEarningsModal
        isOpen={activeModal === 'shareEarnings'}
        onClose={() => setActiveModal(null)}
        userName={state.userName}
        totalEarnedPhp={state.totalEarnedPhp}
        balancePhp={state.balancePhp}
        stepsToday={state.stepsToday}
        tapMineCount={state.tapMineCount}
        consecutiveDays={state.consecutiveDays}
        referralCode={state.referralCode}
      />

      {/* Support Center & FAQ Modal */}
      {activeModal === 'support' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-slate-950 border border-cyan-500/40 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                sound.playClick();
                setActiveModal(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <SupportView
              tickets={state.tickets}
              onAddTicket={handleAddTicket}
              onClose={() => setActiveModal(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
