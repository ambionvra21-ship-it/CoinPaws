          id: `tx-wd-${Date.now()}`,
          type: 'WITHDRAWAL',
          amountPhp: amount,
          title: `Cash Out Withdrawal Request (${method})`,
          timestamp: Date.now(),
          status: 'PENDING',
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
      const newGoal: PersonalGoal = {
        id: `goal-${Date.now()}`,
        title,
        icon,
        completed: false,
      };
      return {
        ...prev,
        personalGoals: [...prev.personalGoals, newGoal],
      };
    });
  }, []);
  // Claim milestone missions bounty handler
  const handleClaimMission = useCallback(
    (missionId: string, phpReward: number, pawsReward: number, title: string) => {
      addEarnings(phpReward, `Completed Mission: ${title}`, 'MISSION');
      setState((prev) => ({
        ...prev,
        claimedMissionIds: [...prev.claimedMissionIds, missionId],
      }));
      fireRewardConfetti(0.5);
    },
    [addEarnings]
  );

  // Claim lucky random mystery chest items handler
  const handleClaimChest = useCallback(
    (reward: ChestReward) => {
      addEarnings(reward.phpReward, 'Lucky Chest Loot Box Unlocked', 'CHEST');
      setState((prev) => ({
        ...prev,
        lastLuckyChestDate: new Date().toISOString().split('T')[0],
      }));
      fireRewardConfetti(0.6);
    },
    [addEarnings]
  );

  // Trivia questionnaire reward claim handler
  const handleTriviaReward = useCallback(
    (php: number, paws: number, title: string) => {
      addEarnings(php, `Trivia Reward: ${title}`, 'TRIVIA');
      setState((prev) => ({
        ...prev,
        triviaAnsweredDate: new Date().toISOString().split('T')[0],
      }));
      fireRewardConfetti(0.5);
    },
    [addEarnings]
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const hasClaimedCheckin = state.lastCheckinDate === todayStr;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-start pb-8">
      {/* RENDER DYNAMIC DASHBOARD PORTVIEW SHELL */}
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

      {/* RENDER MODAL ROUTER PORTALS CONDITIONALLY */}
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
