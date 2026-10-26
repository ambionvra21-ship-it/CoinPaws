import React, { useState } from 'react';
import { X, Wallet, ShieldCheck, ArrowRight, Info, Copy, Check, ExternalLink } from 'lucide-react';
import sound from '../../utils/sound';

interface CashOutModalProps {
  balancePhp: number;
  onConfirmWithdrawal: (amount: number, method: string, account: string) => void;
  onClose: () => void;
}

type PaymentMethod = 'GCASH' | 'MAYA' | 'PAYPAL' | 'ONE_WALLET';

export const CashOutModal: React.FC<CashOutModalProps> = ({
  balancePhp,
  onConfirmWithdrawal,
  onClose,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('GCASH');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(10);
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [hasOneWalletAccount, setHasOneWalletAccount] = useState<string>('yes');
  const [copiedCode, setCopiedCode] = useState(false);

  // Complete array of your requested payment tiers
  const cashoutTiers =;

  const handleCopyCode = () => {
    navigator.clipboard.writeText('V98HAR');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();

    if (!accountNumber.trim()) {
      alert('Please enter your account details or mobile number.');
      return;
    }

    if (balancePhp < withdrawAmount) {
      alert('Insufficient balance for this payout tier.');
      return;
    }

    onConfirmWithdrawal(withdrawAmount, selectedMethod, accountNumber);
    alert(`Withdrawal request for ₱${withdrawAmount} via ${selectedMethod} submitted successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl rounded-b-xl p-5 shadow-2xl shadow-cyan-950/50 flex flex-col justify-start max-h-[92vh] overflow-y-auto">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-cyan-400">
            <Wallet className="w-5 h-5 stroke-[2.2]" />
            <h2 className="font-fredoka text-lg font-bold tracking-wide text-slate-100">Withdraw Earnings</h2>
          </div>
          <button 
            onClick={() => { sound.playClick(); onClose(); }}
            className="w-8 h-8 rounded-lg bg-slate-800/50 border border-slate-700/40 text-slate-400 flex items-center justify-center active:scale-90 transition-all"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Status Display */}
        <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-3.5 my-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Balance</span>
            <div className="text-xl font-black text-cyan-400 font-mono mt-0.5">₱{balancePhp.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Processing Fee</span>
            <div className="text-xs font-semibold text-emerald-400 mt-0.5">₱0.00 (FREE)</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          {/* Select Payment Method Container */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-2">
              Select Payout Platform
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['GCASH', 'MAYA', 'PAYPAL', 'ONE_WALLET'] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => { sound.playClick(); setSelectedMethod(method); }}
                  className={`p-3 rounded-xl border font-sans font-bold text-xs text-left transition-all relative flex flex-col gap-1 ${
                    selectedMethod === method
                      ? 'bg-cyan-950/30 border-cyan-500 text-slate-100 shadow-md shadow-cyan-950/30'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>
                    {method === 'ONE_WALLET' ? 'ONE Wallet' : method.charAt(0) + method.slice(1).toLowerCase()}
                  </span>
                  <span className="text-[9px] font-medium opacity-60">
                    {method === 'ONE_WALLET' ? 'Instant Bonus Match' : 'Standard Delivery'}
                  </span>
                  {selectedMethod === method && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional ONE Wallet Referral Guide Block */}
          {selectedMethod === 'ONE_WALLET' && (
            <div className="p-3.5 bg-slate-950/80 border border-cyan-900/40 rounded-xl space-y-3 animate-slideUp">
              <div className="flex items-start gap-2 text-xs text-cyan-300">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
                <p className="font-medium leading-relaxed">
                  Do you already have a verified account with <strong>ONE Digital Bank</strong>?
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <label className={`p-2 rounded-lg border text-center text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  hasOneWalletAccount === 'yes' ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300' : 'bg-slate-900/40 border-slate-800 text-slate-400'
                }`}>
                  <input 
                    type="radio" 
                    name="oneWalletCheck" 
                    value="yes" 
                    checked={hasOneWalletAccount === 'yes'}
                    onChange={() => setHasOneWalletAccount('yes')}
                    className="sr-only" 
                  />
                  Yes, I have one
                </label>
                <label className={`p-2 rounded-lg border text-center text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  hasOneWalletAccount === 'no' ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300' : 'bg-slate-900/40 border-slate-800 text-slate-400'
                }`}>
                  <input 
                    type="radio" 
                    name="oneWalletCheck" 
                    value="no" 
                    checked={hasOneWalletAccount === 'no'}
                    onChange={() => setHasOneWalletAccount('no')}
                    className="sr-only" 
                  />
                  No, not yet
                </label>
              </div>

              {hasOneWalletAccount === 'no' && (
                <div className="mt-2 pt-3 border-t border-slate-800/80 space-y-2.5 text-[11px] text-slate-300 leading-normal">
                  <p>
                    🎁 Get a free <strong>₱100 instantly</strong> credited to your account! Go to <a href="https://uno.global" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-bold inline-flex items-center gap-0.5">uno.global <ExternalLink className="w-2.5 h-2.5" /></a> and register.
                  </p>
                  <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg p-2 mt-1">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">Required Referral Code:</span>
                      <span className="text-sm font-black font-mono text-slate-100 tracking-wider">V98HAR</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-md font-bold flex items-center gap-1 active:scale-95 transition-all"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedCode ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Select Cash Incentive Tier */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-2">
              Select Payout Amount
            </label>
            <div className="grid grid-cols-3 gap-2">
              {cashoutTiers.map((tier) => {
                const isLocked = balancePhp < tier;
                return (
                  <button
                    key={tier}
                    type="button"
                    disabled={isLocked}
                    onClick={() => { sound.playClick(); setWithdrawAmount(tier); }}
                    className={`p-2.5 rounded-xl border font-mono font-bold text-sm text-center transition-all ${
                      withdrawAmount === tier
                        ? 'bg-gradient-to-b from-cyan-500 to-sky-500 text-slate-950 border-cyan-400 shadow-md'
                        : isLocked
                        ? 'bg-slate-950/10 border-slate-900/60 text-slate-600 cursor-not-allowed line-through'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    ₱{tier}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Destination Form Field Input */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
              {selectedMethod === 'PAYPAL' ? 'PayPal Email Address' : 'Account Mobile Number / Details'}
            </label>
            <input
              type={selectedMethod === 'PAYPAL' ? 'email' : 'text'}
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder={selectedMethod === 'PAYPAL' ? 'example@paypal.com' : 'e.g., 0927XXXXXXX'}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans transition-all shadow-inner"
            />
          </div>

          {/* Bottom Submission Action Trigger */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 font-sans font-bold text-sm text-slate-950 rounded-xl shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
              <span>Submit Cash Out Request</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
