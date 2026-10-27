import React from 'react';
import { Trophy, CheckCircle2, Footprints, Tv, RefreshCw, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';
import { haptics } from '../utils/haptics';

interface DailyMissionsProps {
  stepsToday: number;
  gamesPlayedToday: number;
  adsWatchedToday: number;
  claimedMissionIds: string[];
  onClaimReward: (missionId: string, phpReward: number, pawsReward: number, title: string) => void;
}

interface MissionItem {
  id: string;
  title: string;
  description: string;
  targetType: 'steps' | 'ads' | 'games';
  targetValue: number;
  phpReward: number;
  pawsReward: number;
}

const dailyMissionsList: MissionItem[] = [
  {
    id: 'mission_walk_1',
    title: 'Morning Stroll',
    description: 'Walk 100 steps to activate rewards',
    targetType: 'steps',
    targetValue: 100,
    phpReward: 1.50,
    pawsReward: 15,
  },
  {
    id: 'mission_ads_1',
    title: 'Ad Supporter',
    description: 'Watch 2 video announcements',
    targetType: 'ads',
    targetValue: 2,
    phpReward: 2.00,
    pawsReward: 20,
  },
  {
    id: 'mission_games_1',
    title: 'Mini-Game Master',
    description: 'Play 3 mini-games today',
    targetType: 'games',
    targetValue: 3,
    phpReward: 3.50,
    pawsReward: 35,
  },
];
export const DailyMissions: React.FC<DailyMissionsProps> = ({
  stepsToday,
  gamesPlayedToday,
  adsWatchedToday,
  claimedMissionIds,
  onClaimReward,
}) => {

  const getCurrentValue = (type: 'steps' | 'ads' | 'games'): number => {
    switch (type) {
      case 'steps': return stepsToday;
      case 'ads': return adsWatchedToday;
      case 'games': return gamesPlayedToday;
      default: return 0;
    }
  };

  const handleClaim = (mission: MissionItem) => {
    sound.playSuccess();
    haptics.notificationSuccess();
    onClaimReward(mission.id, mission.phpReward, mission.pawsReward, mission.title);
  };

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 flex flex-col gap-3 shadow-md">
      {/* Module Title Section */}
      <div className="flex items-center gap-2 border-b border-slate-800/60 pb-2">
        <Trophy className="w-5 h-5 text-cyan-400 stroke-[2.2]" />
        <h3 className="font-fredoka text-sm font-black uppercase tracking-wide text-slate-200">
          Daily Tasks & Milestones
        </h3>
      </div>

      {/* Mission Row Stack List */}
      <div className="flex flex-col gap-2.5">
        {dailyMissionsList.map((mission) => {
          const currentProgress = getCurrentValue(mission.targetType);
          const isCompleted = currentProgress >= mission.targetValue;
          const isClaimed = claimedMissionIds.includes(mission.id);

          // Get dynamic icon based on target metric category
          const renderMissionIcon = () => {
            switch (mission.targetType) {
              case 'steps': return <Footprints className="w-4 h-4 text-emerald-400" />;
              case 'ads': return <Tv className="w-4 h-4 text-rose-400" />;
              case 'games': return <RefreshCw className="w-4 h-4 text-amber-400" />;
            }
          };

          return (
            <div 
              key={mission.id}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                isClaimed 
                  ? 'bg-slate-950/40 border-slate-900 opacity-60' 
                  : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700/50'
              }`}
            >
              {/* Left Context Metadata Area */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
                  {renderMissionIcon()}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-200 truncate">{mission.title}</span>
                  <span className="text-[10px] text-slate-400 leading-normal line-clamp-1">{mission.description}</span>
                  
                  {/* Visual Progress Bar Percentage Tracking */}
                  {!isClaimed && (
                    <div className="flex items-center gap-2 mt-1.5 w-full max-w-[140px]">
                      <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/40">
                        <div 
                          className="h-full bg-cyan-400 transition-all duration-300 rounded-full"
                          style={{ width: `${Math.min(100, (currentProgress / mission.targetValue) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-slate-500 shrink-0">
                        {Math.min(mission.targetValue, currentProgress)}/{mission.targetValue}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Action Button Control Area */}
              <div className="shrink-0 flex flex-col items-end gap-1.5">
                {isClaimed ? (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide bg-slate-950/60 px-2.5 py-1.5 rounded-xl border border-slate-900/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Claimed</span>
                  </div>
                ) : isCompleted ? (
                  <button
                    onClick={() => handleClaim(mission)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider shadow-[0_3px_10px_rgba(16,185,129,0.25)] active:scale-95 transition-transform animate-pulse"
                  >
                    Claim Reward
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-0.5 px-2 py-1 rounded-xl bg-slate-950/50 border border-slate-900">
                    <span className="text-[10px] font-fredoka font-black text-cyan-400">₱{mission.phpReward.toFixed(2)}</span>
                    <span className="text-[8px] font-mono font-bold text-purple-400/80">+{mission.pawsReward} Paws</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
