import React, { useState, useEffect } from 'react';
import { MainDashboard } from './components/MainDashboard';
import { ProfileModal } from './components/ProfileModal';
import { DailyCheckinModal } from './components/DailyCheckinModal';
import { WalkingView } from './components/views/WalkingView';
import { PersonalGoal, ChestReward } from './types';

interface UserState {
  userName: string;
  email: string;
  balancePhp: number;
  totalEarnedPhp: number;
  referralEarningsPhp: number;
  tapMineCount: number;
  stepsToday: number;
  gamesPlayedToday: number;
  adsWatchedToday: number;
  consecutiveDays: number;
  soundEnabled: boolean;
  targetThresholdPhp: number;
  stepsGoal: number;
  minerBatteryPercent: number;
  minerLastClaimed: string;
  claimedMissionIds: string[];
  lastLuckyChestDate: string;
  triviaAnsweredDate: string;
  personalGoals: PersonalGoal[];
  hasClaimedCheckin: boolean;
  totalPawsEarned: number;
}

const initialUserState: UserState = {
  userName: "PlayerOne",
  email: "playerone@moneypaws.com",
  balancePhp: 12.50,
  totalEarnedPhp: 12.50,
  referralEarningsPhp: 0,
  tapMineCount: 150,
  stepsToday: 45,
  gamesPlayedToday: 1,
  adsWatchedToday: 0,
  consecutiveDays: 3,
  soundEnabled: true,
  targetThresholdPhp: 500,
  stepsGoal: 5000,
  minerBatteryPercent: 100,
  minerLastClaimed: new Date().toISOString(),
  claimedMissionIds: [],
  lastLuckyChestDate: "",
  triviaAnsweredDate: "",
  personalGoals: [
    { id: 'goal_1', title: 'Complete Daily Missions', icon: 'Trophy', completed: false }
  ],
  hasClaimedCheckin: false,
  totalPawsEarned: 1500
};

export default function App() {
  const [userState, setUserState] = useState<UserState>(initialUserState);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'walking'>('dashboard');

  const handleTapMine = () => {
    setUserState(prev => ({
      ...prev,
      tapMineCount: prev.tapMineCount + 1,
      balancePhp: prev.balancePhp + 0.01,
      totalEarnedPhp: prev.totalEarnedPhp + 0.01
    }));
  };

  const handleClaimMission = (id: string, php: number, paws: number) => {
    setUserState(prev => ({
      ...prev,
      claimedMissionIds: [...prev.claimedMissionIds, id],
      balancePhp: prev.balancePhp + php,
      totalEarnedPhp: prev.totalEarnedPhp + php,
      totalPawsEarned: prev.totalPawsEarned + paws
    }));
  };

  const handleClaimChest = (reward: ChestReward) => {
    setUserState(prev => ({
      ...prev,
      lastLuckyChestDate: new Date().toISOString().split('T')[0],
      balancePhp: prev.balancePhp + reward.php,
      totalEarnedPhp: prev.totalEarnedPhp + reward.php,
      totalPawsEarned: prev.totalPawsEarned + reward.paws
    }));
  };

  const handleTriviaReward = (php: number, paws: number) => {
    const todayStr = new Date().toISOString().split('T')[0]; // Extracting index 0 directly to fix Error 124
    setUserState(prev => ({
      ...prev,
      triviaAnsweredDate: todayStr,
      balancePhp: prev.balancePhp + php,
      totalEarnedPhp: prev.totalEarnedPhp + php,
      totalPawsEarned: prev.totalPawsEarned + paws
    }));
  };
  const handleConvertSteps = (steps: number, cash: number) => {
    setUserState(prev => ({
      ...prev,
      stepsToday: 0,
      balancePhp: prev.balancePhp + cash,
      totalEarnedPhp: prev.totalEarnedPhp + cash
    }));
  };

  const handleToggleGoal = (id: string) => {
    setUserState(prev => ({
      ...prev,
      personalGoals: prev.personalGoals.map(g => g.id === id ? { ...g, completed: !g.completed } : g)
    }));
  };

  const handleAddGoal = (title: string, icon: string) => {
    const newGoal: PersonalGoal = { id: `goal_${Date.now()}`, title, icon, completed: false };
    setUserState(prev => ({ ...prev, personalGoals: [...prev.personalGoals, newGoal] }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center">
      <div className="w-full max-w-md bg-slate-900 shadow-xl overflow-hidden min-h-screen flex flex-col justify-between">
        
        {activeView === 'dashboard' ? (
          <MainDashboard
            balancePhp={userState.balancePhp}
            targetThresholdPhp={userState.targetThresholdPhp}
            tapMineCount={userState.tapMineCount}
            currentUserTotalEarned={userState.totalEarnedPhp}
            currentUserName={userState.userName}
            stepsToday={userState.stepsToday}
            gamesPlayedToday={userState.gamesPlayedToday}
            adsWatchedToday={userState.adsWatchedToday}
            hasClaimedCheckin={userState.hasClaimedCheckin}
            claimedMissionIds={userState.claimedMissionIds}
            lastLuckyChestDate={userState.lastLuckyChestDate}
            personalGoals={userState.personalGoals}
            triviaAnsweredDate={userState.triviaAnsweredDate}
            onTapMine={handleTapMine}
            onOpenCashOut={() => console.log('Cashout triggered')}
            onOpenShareEarnings={() => console.log('Share triggered')}
            onOpenMenu={() => console.log('Menu triggered')}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenDailyLogins={() => setIsCheckinOpen(true)}
            onOpenWatchAd={() => setUserState(p => ({ ...p, adsWatchedToday: p.adsWatchedToday + 1 }))}
            onOpenSpinWheel={() => console.log('Spin triggered')}
            onOpenWalking={() => setActiveView('walking')}
            onOpenScrchedCards={() => console.log('Scratch triggered')}
            onOpenFruitTap={() => console.log('Fruit triggered')}
            onClaimMission={handleClaimMission}
            onClaimChest={handleClaimChest}
            onToggleGoal={handleToggleGoal}
            onAddGoal={handleAddGoal}
            onTriviaReward={handleTriviaReward}
          />
        ) : (
          <WalkingView
            stepsToday={userState.stepsToday}
            onAddSteps={(amt) => setUserState(p => ({ ...p, stepsToday: p.stepsToday + amt }))}
            onConvertSteps={handleConvertSteps}
            onClose={() => setActiveView('dashboard')}
          />
        )}

        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          userName={userState.userName}
          email={userState.email}
          balancePhp={userState.balancePhp}
          totalPawsEarned={userState.totalPawsEarned}
        />

        {isCheckinOpen && (
          <DailyCheckinModal
            consecutiveDays={userState.consecutiveDays}
            hasClaimedToday={userState.hasClaimedCheckin}
            onClaim={() => setUserState(p => ({ ...p, hasClaimedCheckin: true, balancePhp: p.balancePhp + 1.00 }))}
            onClose={() => setIsCheckinOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
