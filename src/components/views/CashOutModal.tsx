import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, AlertCircle, History, Clock } from 'lucide-react';
import { sound } from '../../utils/sound';
import { fireRewardConfetti } from '../../utils/confetti';
import { formatPhp } from '../../utils/storage';
import { SUPPORT_EMAIL } from '../../types';

interface CashOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  balancePhp: number;
  targetThresholdPhp: number;
  onWithdraw: (amountPhp: number, method: string, account: string) => void;
}

interface PayoutMethod {
  id: string;
  name: string;
  icon: string;
  color: string;
  accountPlaceholder: string;
  minAmount: number;
}

const PAYOUT_METHODS: PayoutMethod[] = [
  {
    id: 'gcash',
    name: 'GCash',
    icon: '📱',
    color: 'from-blue-600 to-sky-500',
    accountPlaceholder: '09XX XXX XXXX (11 digits)',
    minAmount: 5.50,
  },
  {
    id: 'maya',
    name: 'Maya / PayMaya',
    icon: '💳',
    color: 'from-emerald-600 to-teal-500',
    accountPlaceholder: '09XX XXX XXXX (11 digits)',
    minAmount: 5.50,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '🌐',
    color: 'from-blue-700 to-indigo-600',
    accountPlaceholder: 'your-email@example.com',
    minAmount: 50.00,
  },
  {
    id: 'binance',
    name: 'Binance / USDT',
    icon: '🪙',
    color: 'from-amber-600 to-yellow-500',
    accountPlaceholder: 'BEP20 / TRC20 Wallet or Pay ID',
    minAmount: 50.00,
  },
  {
    id: 'shopeepay',
    name: 'ShopeePay',
    icon: '🛍️',
    color: 'from-orange-600 to-amber-500',
    accountPlaceholder: '09XX XXX XXXX',
    minAmount: 10.00,
  },
];

export const CashOutModal: React.FC<CashOutModalProps> = ({
  isOpen,
  onClose,
  balancePhp,
  targetThresholdPhp,
  onWithdraw,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PayoutMethod>(PAYOUT_METHODS[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [requestedAmount, setRequestedAmount] = useState(5.50);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastTxId, setLastTxId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const hasEnough = balancePhp >= requestedAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!accountNumber.trim()) {
      setErrorMsg('Please enter your account number or email');
      sound.playClick();
      return;
    }

    if (!hasEnough) {
      setErrorMsg(`Insufficient balance. Current balance is ${formatPhp(balancePhp)} (Target: ${formatPhp(requestedAmount)})`);
      sound.playClick();
      return;
    }

    sound.playFanfare();
    fireRewardConfetti(0.4);
    const txId = `MP-${Math.floor(100000 + Math.random() * 900000)}`;
    setLastTxId(txId);
    setIsSuccess(true);
    onWithdraw(requestedAmount, selectedMethod.name, accountNumber);
  };

  const handleSimulateFastFill = () => {
    // Helpful demo helper for instant verification
    sound.playCoin();
    setRequestedAmount(5.50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-950/60 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-lg">💸</span>
            <h3 className="font-fredoka text-lg font-bold text-white">Cash Out Rewards</h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {isSuccess ? (
            <div className="text-center py-6 flex flex-col items-center animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-pulse" />
              </div>
              <h4 className="font-fredoka text-xl font-bold text-white">Withdrawal Submitted!</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xs">
                Your request of <strong className="text-emerald-400 font-mono text-sm">{formatPhp(requestedAmount)}</strong> via {selectedMethod.name} has been queued.
              </p>

              <div className="my-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-left w-full text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Reference ID:</span>
                  <span className="font-mono text-cyan-300 font-bold">{lastTxId}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Payout Method:</span>
                  <span className="text-white font-medium">{selectedMethod.name}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Destination:</span>
                  <span className="font-mono text-white truncate max-w-[150px]">{accountNumber}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Fee:</span>
                  <span className="text-emerald-400 font-bold">₱0.00 (Zero Fee)</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                  <span>Est. Time:</span>
                  <span className="text-cyan-300 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Within 12-24 hours
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Inquiries? Contact support at <br />
                <span className="text-cyan-300 font-mono">{SUPPORT_EMAIL}</span>
              </p>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsSuccess(false);
                  onClose();
                }}
                className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Balance Summary Card */}
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-cyan-300 uppercase font-bold tracking-wider">
                    Available Balance
                  </span>
                  <div className="font-mono text-xl font-extrabold text-cyan-400">
                    {formatPhp(balancePhp)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Next Threshold</span>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {formatPhp(targetThresholdPhp)}
                  </span>
                </div>
              </div>

              {/* Method Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Select Payout Channel
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYOUT_METHODS.map((method) => {
                    const isSelected = selectedMethod.id === method.id;
                    return (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => {
                          sound.playClick();
                          setSelectedMethod(method);
                          setRequestedAmount(method.minAmount);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/20 text-white'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-xl">{method.icon}</span>
                        <div className="truncate">
                          <span className="text-xs font-bold block truncate">{method.name}</span>
                          <span className="text-[9px] text-slate-400 block">Min: {formatPhp(method.minAmount)}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Account Number Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {selectedMethod.name} Account / Mobile No.
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder={selectedMethod.accountPlaceholder}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Cashout Amount
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[5.50, 10.00, 25.00, 50.00, 100.00].map((amt) => {
                    const isSelected = requestedAmount === amt;
                    return (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => {
                          sound.playClick();
                          setRequestedAmount(amt);
                        }}
                        className={`py-2 px-1 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {formatPhp(amt)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg ${
                  hasEnough
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold shadow-cyan-500/30 active:scale-98'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-750'
                }`}
              >
                <span>Confirm {formatPhp(requestedAmount)} Cash Out</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero processing fee • Verified safe payout</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
