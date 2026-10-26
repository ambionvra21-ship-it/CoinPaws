import React from 'react';

export default function DailyNewsTicker() {
  const marqueeText = "✦ ADS REWARDS • 🚶 WALKING STEPS • ONE WALLET • FRUIT MINI-GAME • SPIN WHEEL • SCRATCH CARDS ";

  return (
    <div className="w-full max-w-md mx-auto my-3 px-4">
      <div className="relative w-full overflow-hidden bg-slate-900/60 border border-slate-800 rounded-2xl py-3 px-1 backdrop-blur-md shadow-inner">
        {/* Left Indicator bar decoration */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-400 rounded-full z-10"></div>
        
        {/* Mask layer hiding outer overflow elements cleanly */}
        <div className="w-full overflow-hidden pl-4">
          <div className="animate-marquee whitespace-nowrap flex gap-4 select-none">
            {/* Primary Track */}
            <span className="text-sm font-bold tracking-wider text-slate-100 uppercase">
              {marqueeText}
            </span>
            {/* Duplicate Copy Track (Ensures seamless gapless looping animation) */}
            <span className="text-sm font-bold tracking-wider text-slate-100 uppercase" aria-hidden="true">
              {marqueeText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
