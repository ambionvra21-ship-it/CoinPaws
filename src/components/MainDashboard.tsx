import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Coins, 
  User, 
  Menu, 
  HelpCircle, 
  ChevronRight, 
  Play, 
  TrendingUp, 
  Award, 
  Share2, 
  Layers, 
  Smartphone,
  Navigation
} from 'lucide-react';

export default function MainDashboard() {
  // App Core Currencies & Rewards States
  const [pawcoins, setPawcoins] = useState<number>(() => {
    const saved = localStorage.getItem('coinpaws_balance');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [walkingSteps, setWalkingSteps] = useState<number>(4250);
  const [isMining, setIsMining] = useState<boolean>(false);
  const [miningProgress, setMiningProgress] = useState<number>(0);
  
  // Daily Login Streak Tracking Configuration
  const [canCheckIn, setCanCheckIn] = useState<boolean>(true);
  const [currentStreak, setCurrentStreak] = useState<number>(3);
  const [showNotification, setShowNotification] = useState<string>("Welcome back! Tap the Daily Check-in below to maintain your streak.");

  // Save balance automatically on updates
  useEffect(() => {
    localStorage.setItem('coinpaws_balance', pawcoins.toString());
  }, [pawcoins]);

  // Simulated passive background mining ticks
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMining) {
      interval = setInterval(() => {
        setMiningProgress((prev) => {
          if (prev >= 100) {
            setPawcoins(c => c + 15); // Award 15 pawcoins per completed run
            return 0;
          }
          return prev + 5;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMining]);

  const handleCheckIn = () => {
    if (!canCheckIn) return;
    setPawcoins(c => c + 50); // 50 Pawcoins daily bonus payout
    setCurrentStreak(s => s + 1);
    setCanCheckIn(false);
    setShowNotification("🎉 50 Pawcoins claimed! Daily login streak updated successfully.");
  };

  const toggleMining = () => {
    setIsMining(!isMining);
    if(!isMining) {
      setShowNotification("⛏️ Passive mining chest node initialized. Earning points automatically!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      
      {/* 📱 TOP BAR NAVIGATION BAR */}
      <header className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3 border-b border-slate-800/60 flex items-center justify-between">
        <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
          <Menu className="w-6 " />
        </button>
        
        <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800/80 shadow-inner">
          <Coins className="w-5 h-5 text-amber-500 fill-amber-500/20" />
          <span className="font-bold text-amber-400 tracking-wide font-mono text-sm">
            {pawcoins} <span className="text-xs text-slate-500 font-sans font-medium">🐾</span>
          </span>
        </div>

        <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
          <User className="w-6 h-6" />
        </button>
      </header>

      {/* 📢 ROLLING TEXT MARQUEE LOG */}
      {showNotification && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee text-xs font-medium text-amber-400">
            {showNotification} &nbsp;&nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp;&nbsp; Conversion Index Rate: 1,000 Paws = $1.00 USD (₱58.00 PHP Tiers)
          </div>
        </div>
      )}
      {/* ⚙️ MAIN LAYOUT BODY */}
      <main className="flex-1 p-4 space-y-4 max-w-md mx-auto w-full pb-24">
        
        {/* ⭐ WALKING PEDOMETER MILESTONE RADAR */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-2xl border border-slate-800/60 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Pedometer Step tracker</h2>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-0.5">{walkingSteps} <span className="text-xs font-sans text-slate-500 font-medium">/ 10,000 steps</span></p>
            </div>
            <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500" style={{ width: `${(walkingSteps/10000)*100}%` }}></div>
          </div>
          <div className="flex justify-between items-center mt-3 text-xs text-slate-400">
            <span>Est. Earned: <strong className="text-amber-400 font-mono">+{Math.floor(walkingSteps / 100)} Paws</strong></span>
            <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50 font-mono text-[10px] text-slate-400">Active Sensors</span>
          </div>
        </section>

        {/* ⛏️ CENTRAL PAW MINING INTERFACE BOX */}
        <section className="bg-slate-900/40 backdrop-blur-sm py-8 px-4 rounded-3xl border border-slate-800/50 shadow-xl flex flex-col items-center justify-center text-center relative">
          <div className="absolute top-4 left-4 bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-800/60 text-[10px] font-mono text-slate-400">
            Status: {isMining ? <span className="text-cyan-400 animate-pulse">MINING</span> : <span className="text-slate-500">IDLE</span>}
          </div>

          {/* Glowing Target Ring Asset Container */}
          <div className="relative mb-6 flex items-center justify-center">
            {isMining && (
              <div className="absolute w-36 h-36 border-2 border-dashed border-cyan-500/30 rounded-full animate-spin"></div>
            )}
            <div className={`w-28 h-28 rounded-full bg-cyan-500/15 border border-cyan-400/40 flex flex-col items-center justify-center shadow-lg transition-transform ${isMining ? 'scale-105' : 'hover:scale-102'}`}>
              <div className="flex items-center gap-1.5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.9)] animate-float">
                <span className="text-3xl select-none">🐾</span>
                <span className="text-2xl select-none -mt-2">🐾</span>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-bold text-white tracking-wide">CoinPaws Micro-Mining Portal</h2>
          <p className="text-xs text-slate-400 max-w-xs mt-1.5 px-4">
            Initialize your background processor engine node to securely mine passive revenue shares while traveling.
          </p>

          {isMining && (
            <div className="w-48 bg-slate-950 border border-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-cyan-400 h-full transition-all duration-300" style={{ width: `${miningProgress}%` }}></div>
            </div>
          )}

          <button 
            onClick={toggleMining}
            className={`mt-5 px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-200 transform shadow-md ${
              isMining 
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black hover:opacity-95 active:scale-98'
            }`}
          >
            {isMining ? 'Halt Process' : 'Start Mining'}
          </button>
        </section>

        {/* 📆 UPDATE AREA: ENGAGEMENT STREAK CARD FEATURE */}
        <section 
          onClick={handleCheckIn}
          className={`p-4 rounded-2xl border transition-all duration-300 shadow-md flex items-center justify-between cursor-pointer ${
            canCheckIn 
              ? 'bg-slate-900 border-amber-500/40 hover:border-amber-500/60 shadow-amber-500/5' 
              : 'bg-slate-900/40 border-slate-800/80 opacity-75'
          }`}
        >
          <div className="flex items-center gap-3.5">
            {/* 💡 TARGET REFINEMENT: Injected conditional breathing CSS keyframe animation framework */}
            <div className={`p-3 rounded-xl border transition-all ${
              canCheckIn 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse-subtle filter drop-shadow-[0_0_8px_rgba(245,158,11,0.45)]' 
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}>
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-100">Daily Login Streak Bonus</h3>
                <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/20 font-mono">
                  {currentStreak} Days
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {canCheckIn ? "Claim your daily check-in bonus now!" : "Streak successfully preserved. Return tomorrow!"}
              </p>
            </div>
          </div>
          {canCheckIn && (
            <ChevronRight className="w-5 h-5 text-amber-400 animate-bounce-x" />
          )}
        </section>
        {/* 🎮 MONEYPAWS ARCADE FEATURES SELECTION ENGINE GRID */}
        <section className="space-y-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Earn Tasks Grid Matrix</h4>
          
          <div className="grid grid-cols-2 gap-3">
            {/* watch ads interaction card */}
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800/60 hover:border-slate-700/50 transition-all flex flex-col justify-between h-28 group relative">
              <div className="flex justify-between items-start text-slate-400">
                <Play className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded">Limit: 5/5</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-200">Watch & Earn</h5>
                <p className="text-[10px] text-slate-500 mt-0.5">Sponsor Video Modules</p>
              </div>
            </div>

            {/* lucky spin wheel option element */}
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800/60 hover:border-slate-700/50 transition-all flex flex-col justify-between h-28 group">
              <div className="flex justify-between items-start text-slate-400">
                <Award className="w-5 h-5 text-purple-400 group-hover:rotate-45 transition-transform" />
                <span className="text-[10px] font-mono bg-purple-500/10 border border-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">Capped 5x</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-200">Lucky Spin Wheel</h5>
                <p className="text-[10px] text-slate-500 mt-0.5">Randomized Multipliers</p>
              </div>
            </div>

            {/* scratch cards interaction grid block */}
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800/60 hover:border-slate-700/50 transition-all flex flex-col justify-between h-28 group">
              <div className="flex justify-between items-start text-slate-400">
                <Layers className="w-5 h-5 text-pink-400" />
                <span className="text-[10px] font-mono bg-pink-500/10 border border-pink-500/20 text-pink-400 px-1.5 py-0.5 rounded">Hot Drop</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-200">Lucky Scratcher</h5>
                <p className="text-[10px] text-slate-500 mt-0.5">Touch Scratch Overlays</p>
              </div>
            </div>

            {/* referral system interaction module */}
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800/60 hover:border-slate-700/50 transition-all flex flex-col justify-between h-28 group">
              <div className="flex justify-between items-start text-slate-400">
                <Share2 className="w-5 h-5 text-orange-400" />
                <span className="text-[10px] font-mono bg-orange-500/10 border border-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded">Invite</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-200">Referral Network</h5>
                <p className="text-[10px] text-slate-500 mt-0.5">V98HAR Code Bonus</p>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* 🧭 BOTTOM FOOTER GRID NAVIGATION MENU BAR */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800/80 px-4 py-2.5 z-50 flex items-center justify-around max-w-md mx-auto rounded-t-2xl shadow-2xl">
        <button className="flex flex-col items-center gap-1 text-cyan-400">
          <Smartphone className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-wide">Dashboard</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
          <Navigation className="w-5 h-5" />
          <span className="text-[10px] font-medium">Payouts</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
          <HelpCircle className="w-5 h-5" />
          <span className="text-[10px] font-medium">Guidelines</span>
        </button>
      </footer>

    </div>
  );
}
