import React, { useState, useEffect } from 'react';
import { 
  Menu, User, Coins, Share2, Wallet, Calendar, Play, 
  Award, Footprints, Layers, Sparkles, Trophy, HelpCircle, 
  Navigation, Flame, ChevronRight, CheckCircle2, ArrowUpRight
} from 'lucide-react';

export default function MainDashboard() {
  // Core Currencies & User Tier States
  const [balancePHP, setBalancePHP] = useState<number>(5.51);
  const [pawcoins, setPawcoins] = useState<number>(335);
  const [targetPayout, setTargetPayout] = useState<number>(50);
  const [canCheckIn, setCanCheckIn] = useState<boolean>(true);
  const [isMining, setIsMining] = useState<boolean>(false);
  const [miningProgress, setMiningProgress] = useState<number>(45);

  // Active missions state ledger
  const [missions, setMissions] = useState([
    { id: 'm1', title: 'Daily Walking', reward: '+150 Paws', desc: 'Complete 5,000 steps today', progress: '3,420 / 5,000', completed: false },
    { id: 'm2', title: 'Arcade Master', reward: '+75 Paws', desc: 'Play Fruit Slicer 3 times', progress: '2 / 3', completed: false },
    { id: 'm3', title: 'Ad Explorer', reward: '+50 Paws', desc: 'Watch 5 rewarded sponsors', progress: '5 / 5', completed: true },
    { id: 'm4', title: 'Streak Keeper', reward: '+200 Paws', desc: 'Maintain a 5-day login streak', progress: '4 / 5', completed: false }
  ]);

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 flex flex-col font-sans select-none antialiased pb-24">
      
      {/* 📱 NAVIGATION TITLE HEADER BAR */}
      <header className="px-4 py-3 bg-[#0a1424]/90 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between border-b border-slate-800/40">
        <button className="p-2 hover:bg-slate-800/60 rounded-xl text-slate-400 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
          <h1 className="font-black text-base tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            CoinPaws
          </h1>
        </div>
        <button className="p-2 hover:bg-slate-800/60 rounded-xl text-slate-400 transition-colors">
          <User className="w-5 h-5" />
        </button>
      </header>

      {/* 📢 MARQUEE REAL-TIME NOTIFICATION PLACEMENT TICKER */}
      <div className="bg-cyan-500/5 border-b border-cyan-500/10 px-4 py-1.5 overflow-hidden whitespace-nowrap">
        <div className="inline-block text-[11px] font-medium tracking-wide text-cyan-400/90 font-mono">
          🔥 PROMO: Cashout bonus tiers enabled! P2P integration complete • Next Target Threshold: ₱50.00 PHP • Standard conversion rates active
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto w-full flex-1">
        
        {/* 💵 TOTAL BALANCE AND CASHOUT CONTROL BOARD PANEL */}
        <section className="bg-gradient-to-b from-[#0d1b30] to-[#091424] p-4 rounded-2xl border border-cyan-500/20 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl"></div>
          <span className="text-[10px] font-bold text-cyan-400/80 tracking-widest uppercase block font-mono">
            Vona Informed Balance
          </span>
          
          <div className="flex items-baseline justify-between mt-1">
            <h2 className="text-3xl font-black text-white font-mono tracking-tight">
              ₱{balancePHP.toFixed(2)}
            </h2>
            <div className="flex gap-2">
              <button className="bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700/50 flex items-center gap-1 transition-all">
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-95 text-slate-950 text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md shadow-cyan-500/10 transition-all">
                <Wallet className="w-3.5 h-3.5 text-slate-950 fill-slate-950/10" /> Cash-Out
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Next Payout Threshold</span>
            <span className="text-cyan-400 font-mono font-bold">₱{balancePHP.toFixed(2)} / ₱{targetPayout}.00</span>
          </div>

          <div className="w-full bg-slate-950 h-2 rounded-full mt-1.5 overflow-hidden border border-slate-800/40 p-0.5 shadow-inner">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${(balancePHP / targetPayout) * 100}%` }}
            ></div>
          </div>
        </section>
        {/* ⏳ TIMED PROGRESS AND COMMISSIONS NODE BOX */}
        <section className="bg-[#0b1424]/80 p-3 rounded-xl border border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-cyan-500/20 animate-spin"></div>
              <div className="absolute w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-mono text-xs font-black">
                95%
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                Daily Revenue Node <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/20 uppercase font-mono">Running</span>
              </h4>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">₱5.51 accrued / ₱10.00 daily cap bounds</p>
            </div>
          </div>
          <div className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-right font-mono">
            <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">Cooldown</span>
            <span className="text-amber-400 font-black text-xs">02:44:12</span>
          </div>
        </section>

        {/* 🧩 8-TASK GRID INTERFACE SELECTION MATRIX */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Earning Vectors Core</h4>
            <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.2 rounded font-mono">PHP / USD STANDARD ECONOMICS</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            
            {/* 1. Daily Login card featuring custom breathing trigger handle */}
            <div className={`p-3 rounded-xl border transition-all flex flex-col justify-between h-20 relative cursor-pointer ${canCheckIn ? 'bg-[#0e1d33] border-amber-500/40 shadow-md shadow-amber-500/5' : 'bg-[#091424] border-slate-800/80 opacity-80'}`}>
              <div className="flex justify-between items-start">
                <Calendar className={`w-4 h-4 ${canCheckIn ? 'text-amber-400 animate-pulse-subtle filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-slate-500'}`} />
                <span className="text-[9px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1 rounded">Streak</span>
              </div>
              <div>
                <h5 className="text-[11px] font-bold text-slate-200">Daily Logins</h5>
                <p className="text-[9px] text-slate-500 mt-0.2">Claim 50 Pawcoins</p>
              </div>
            </div>

            {/* 2. Watch Rewarded Ads */}
            <div className="bg-[#091424] p-3 rounded-xl border border-slate-800/60 hover:border-slate-700/50 transition-all flex flex-col justify-between h-20 group">
              <div className="flex justify-between items-start">
                <Play className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-1 rounded">5 / 5 Admob</span>
              </div>
              <div>
                <h5 className="text-[11px] font-bold text-slate-200">Watch & Earn</h5>
                <p className="text-[9px] text-slate-500 mt-0.2">Rewarded Video Ads</p>
              </div>
            </div>

            {/* 3. Spin the Wheel */}
            <div className="bg-[#091424] p-3 rounded-xl border border-slate-800/60 hover:border-slate-700/50 transition-all flex flex-col justify-between h-20 group">
              <div className="flex justify-between items-start">
                <Award className="w-4 h-4 text-purple-400 group-hover:rotate-45 transition-transform" />
                <span className="text-[9px] font-mono bg-purple-500/10 border border-purple-500/20 text-purple-400 px-1 rounded">Cap 5x / day</span>
              </div>
              <div>
                <h5 className="text-[11px] font-bold text-slate-200">Spin the Wheel</h5>
                <p className="text-[9px] text-slate-500 mt-0.2">Lucky Reward Engine</p>
              </div>
            </div>

            {/* 4. Walking Tracker */}
            <div className="bg-[#091424] p-3 rounded-xl border border-slate-800/60 hover:border-slate-700/50 transition-all flex flex-col justify-between h-20 group">
              <div className="flex justify-between items-start">
                <Footprints className="w-4 h-4 text-emerald-400" />
                <span className="text-[9px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1 rounded">Pedometer</span>
              </div>
              <div>
                <h5 className="text-[11px] font-bold text-slate-200">Walking Steps</h5>
                <p className="text-[9px] text-slate-500 mt-0.2">Sensor Step Sync</p>
              </div>
            </div>

            {/* 5. Lucky Scratcher */}
            <div className="bg-[#091424] p-3 rounded-xl border border-slate-800/60 hover:border-slate-700/50 transition-all flex flex-col justify-between h-20 group">
              <div className="flex justify-between items-start">
                <Layers className="w-4 h-4 text-pink-400" />
                <span className="text-[9px] font-mono bg-pink-500/10 border border-pink-500/20 text-pink-400 px-1 rounded">Scratch Cards</span>
              </div>
              <div>
                <h5 className="text-[11px] font-bold text-slate-200">Scratch Matrix</h5>
                <p className="text-[9px] text-slate-500 mt-0.2">Touch-to-Reveal</p>
              </div>
            </div>

            {/* 6. Daily Tap Coins */}
            <div className="bg-[#091424] p-3 rounded-xl border border-slate-800/60 hover:border-slate-700/50 transition-all flex flex-col justify-between h-20 group">
              <div className="flex justify-between items-start">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-[9px] font-mono bg-orange-500/10 border border-orange-500/20 text-orange-400 px-1 rounded">Tap Daily</span>
              </div>
              <div>
                <h5 className="text-[11px] font-bold text-slate-200">Daily Paws Tap</h5>
                <p className="text-[9px] text-slate-500 mt-0.2">Instant Balance Booster</p>
              </div>
            </div>

          </div>
        </section>

        {/* ⛏️ ORIGINAL GLOWING CENTRAL MICRO-MINING PORTAL */}
        <section className="bg-gradient-to-b from-[#091424] to-[#050b14] py-6 px-4 rounded-2xl border border-slate-800/80 shadow-inner flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-3 left-3 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800 font-mono text-[9px] text-slate-400">
            Node: {isMining ? <span className="text-cyan-400 animate-pulse font-bold">ACTIVE</span> : <span className="text-slate-500">STANDBY</span>}
          </div>

          <div className="relative my-4 flex items-center justify-center">
            {/* Cyan Border Accent Capsule Ring */}
            <div className={`absolute w-32 h-32 rounded-full border-2 border-cyan-500/20 shadow-[0_0_25px_rgba(6,182,212,0.15)] ${isMining ? 'animate-pulse' : ''}`}></div>
            {isMining && (
              <div className="absolute w-36 h-36 border border-dashed border-cyan-400/40 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
            )}
            
            {/* Native Glowing Circle Shell with Paws Printing */}
            <button 
              onClick={() => setIsMining(!isMining)}
              className="w-24 h-24 rounded-full bg-[#0d1f38] border border-cyan-500/40 hover:border-cyan-400 shadow-lg flex flex-col items-center justify-center relative active:scale-95 transition-transform group"
            >
              <div className="text-2xl select-none animate-float drop-shadow-[0_0_12px_rgba(6,182,212,0.8)] flex items-center gap-0.5">
                <span>🐾</span>
              </div>
              <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mt-1 block font-mono group-hover:text-cyan-300">
                {isMining ? 'Mining' : 'Tap to Mine'}
              </span>
            </button>
          </div>
          <p className="text-[10px] text-slate-500 font-mono max-w-xs px-6">
            Tap the central paw circle to initialize cloud hash distributions. Est 95% revenue margin.
          </p>
        </section>
        {/* 📋 DAILY MISSIONS LEDGER MATRIX ROW BLOCKS */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-cyan-400" />
              <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Daily Tracker Missions</h4>
            </div>
            <span className="text-[9px] font-mono text-slate-500">Resets in 20h</span>
          </div>

          <div className="space-y-2">
            {missions.map((mission) => (
              <div 
                key={mission.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  mission.completed 
                    ? 'bg-[#081528]/40 border-slate-800/80 opacity-70' 
                    : 'bg-[#091424] border-slate-800/60 hover:border-slate-700/50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 p-1.5 rounded-lg border ${
                    mission.completed 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}>
                    {mission.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Footprints className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      {mission.title}
                      <span className="text-[9px] font-mono text-cyan-400 font-medium">{mission.reward}</span>
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">{mission.desc}</p>
                    <span className="text-[9px] font-mono text-slate-500 block mt-1">Progress: {mission.progress}</span>
                  </div>
                </div>

                <button 
                  disabled={mission.completed}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                    mission.completed
                      ? 'bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  {mission.completed ? 'Claimed' : 'Claim'}
                </button>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 🧭 ORIGINAL 3-TAB BOTTOM FIXED NAVIGATION PANEL */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0a1424]/95 backdrop-blur-md border-t border-slate-800/80 px-4 py-2 z-50 flex items-center justify-around max-w-md mx-auto rounded-t-xl shadow-2xl shadow-cyan-500/5">
        <button className="flex flex-col items-center gap-0.5 text-cyan-400 py-1 transition-all">
          <Smartphone className="w-4 h-4 shadow-[0_0_10px_rgba(6,182,212,0.4)]" />
          <span className="text-[9px] font-black tracking-wider uppercase">Dashboard</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-300 py-1 transition-all">
          <Navigation className="w-4 h-4" />
          <span className="text-[9px] font-bold tracking-wider uppercase">Payouts</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-300 py-1 transition-all">
          <HelpCircle className="w-4 h-4" />
          <span className="text-[9px] font-bold tracking-wider uppercase">Guidelines</span>
        </button>
      </footer>

    </div>
  );
}
