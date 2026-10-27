import React from 'react';
import { Footprints, ArrowRight } from 'lucide-react';

interface WalkingViewProps {
  stepsToday: number;
  onAddSteps: (amount: number) => void;
  onConvertSteps: (stepsConverted: number, cashReward: number) => void;
  onClose: () => void;
}

export const WalkingView: React.FC<WalkingViewProps> = ({
  stepsToday,
  onAddSteps,
  onConvertSteps,
  onClose,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Footprints className="w-5 h-5 text-emerald-400" />
        <h3 className="text-sm font-bold text-slate-200">Step Counter System</h3>
      </div>
      <div className="bg-slate-950 p-4 rounded-xl text-center">
        <span className="text-3xl font-black font-mono text-emerald-400">{stepsToday}</span>
        <span className="text-[10px] text-slate-500 block uppercase mt-1">Steps Walked Today</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => onAddSteps(50)} className="py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-200">+50 Test Steps</button>
        <button 
          disabled={stepsToday < 10}
          onClick={() => onConvertSteps(stepsToday, stepsToday * 0.01)}
          className="py-2 rounded-xl bg-emerald-500 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-bold text-xs flex items-center justify-center gap-1"
        >
          Convert <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      <button onClick={onClose} className="w-full py-2 text-xs font-bold text-slate-400 bg-slate-950 rounded-xl border border-slate-900">Back to Dashboard</button>
    </div>
  );
};
