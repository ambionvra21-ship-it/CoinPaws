import React from 'react';
import { X, User, Wallet, BarChart3, Shield, Info, LogOut } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatPhp } from '../utils/storage';

interface EarningDataPoint {
  day: string;
  amount: number;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  email: string;
  balancePhp: number;
  totalPawsEarned: number;
  onLogout?: () => void;
}

// Explicitly typed mock historical analytics data for Recharts
const monthlyAnalyticsData: EarningDataPoint[] = [
  { day: 'Mon', amount: 15.50 },
  { day: 'Tue', amount: 32.10 },
  { day: 'Wed', amount: 24.80 },
  { day: 'Thu', amount: 55.00 },
  { day: 'Fri', amount: 48.20 },
  { day: 'Sat', amount: 75.60 },
  { day: 'Sun', amount: 90.00 },
];
export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  username,
  email,
  balancePhp,
  totalPawsEarned,
  onLogout,
}) => {
  if (!isOpen) return null;

  // Custom tooltips and formatters explicitly typed to eliminate implicit 'any' warnings
  const formatYAxisValue = (value: number): string => `₱${value.toFixed(0)}`;
  
  const renderCustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 border border-cyan-500/40 p-2 rounded-xl shadow-lg">
          <p className="text-xs font-bold text-slate-300">Earnings</p>
          <p className="text-sm font-black text-cyan-400 font-mono mt-0.5">
            {formatPhp(payload[0].value)}
          </p>
        </div>
      );
    };
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col max-h-[90vh]">
        
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-2 text-cyan-400">
            <User className="w-5 h-5 stroke-[2.2]" />
            <h3 className="font-fredoka text-base font-black uppercase tracking-wide">Account Profile</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-400 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Container Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          
          {/* Identity Credentials Box */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center text-slate-950 shadow-md">
              <User className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-fredoka text-base font-black text-slate-200 truncate">{username}</span>
              <span className="text-xs text-slate-400 truncate">{email}</span>
            </div>
          </div>

          {/* Earnings Financial Cards Metrics Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-gradient-to-b from-slate-900 to-cyan-950/20 border border-cyan-500/20 shadow-sm flex flex-col">
              <span className="text-[10px] font-bold text-cyan-400/70 uppercase tracking-wider flex items-center gap-1">
                <Wallet className="w-3 h-3" /> Available Balance
              </span>
              <span className="text-xl font-black font-fredoka text-slate-100 tracking-tight mt-1">
                {formatPhp(balancePhp)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-b from-slate-900 to-purple-950/20 border border-purple-500/20 shadow-sm flex flex-col">
              <span className="text-[10px] font-bold text-purple-400/70 uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-3 h-3" /> Total Pawcoins
              </span>
              <span className="text-xl font-black font-fredoka text-slate-100 tracking-tight mt-1 font-mono">
                {totalPawsEarned.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Recharts Analytics Chart Box Block */}
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" /> Weekly Earnings Growth
            </span>
            <div className="w-full h-44 mt-1 pr-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyAnalyticsData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={formatYAxisValue} />
                  <Tooltip content={renderCustomTooltip} cursor={{ stroke: '#06b6d4', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="amount" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEarnings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Device Info App Indicator */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-500/70 shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed text-slate-400 font-medium">
              Your profile ecosystem syncs across trusted standards. Daily caps reset every 12:00 AM server time.
            </p>
          </div>
        </div>

        {/* Footer Actions Panel */}
        {onLogout && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/20">
            <button
              onClick={onLogout}
              className="w-full py-2 flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-500/30 text-slate-300 hover:text-rose-400 font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-[0.98]"
            >
              <LogOut className="w-4 h-4" /> Sign Out Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
