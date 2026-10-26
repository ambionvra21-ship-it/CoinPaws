import React, { useState } from 'react';
import { X, Wallet, ShieldCheck, ArrowRight, Info, Copy, Check, ExternalLink } from 'lucide-react';

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

  const handleCopyCode = () => {
    navigator.clipboard.writeText('V98HAR');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim()) return;
    if (balancePhp < withdrawAmount) return;
    onConfirmWithdrawal(withdrawAmount, selectedMethod, accountNumber);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl rounded-b-xl p-5 max-h-[92vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-cyan-400">
            <Wallet className="w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-100 font-sans">Withdraw Earnings</h2>
          </div>
          <button onClick={onClose} className="text-slate-400" type="button"><X className="w-4 h-4" /></button>
        </div>

        <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-3.5 my-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Available Balance</span>
            <div className="text-xl font-black text-cyan-400 font-mono">₱{balancePhp.toFixed(2)}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-2 uppercase">Select Payout Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {(['GCASH', 'MAYA', 'PAYPAL', 'ONE_WALLET'] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setSelectedMethod(method)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all relative ${
                    selectedMethod === method ? 'bg-cyan-950/30 border-cyan-500 text-slate-100' : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                  }`}
                >
                  {method === 'ONE_WALLET' ? 'ONE Wallet' : method.charAt(0) + method.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {selectedMethod === 'ONE_WALLET' && (
            <div className="p-3.5 bg-slate-950/80 border border-cyan-900/40 rounded-xl space-y-3">
              <p className="text-xs text-cyan-300 font-medium leading-relaxed">Do you already have a verified account with ONE Digital Bank?</p>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setHasOneWalletAccount('yes')} className={`p-2 rounded-lg border text-xs font-bold ${hasOneWalletAccount === 'yes' ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300' : 'bg-slate-900/40 border-slate-800 text-slate-400'}`}>Yes</button>
                <button type="button" onClick={() => setHasOneWalletAccount('no')} className={`p-2 rounded-lg border text-xs font-bold ${hasOneWalletAccount === 'no' ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300' : 'bg-slate-900/40 border-slate-800 text-slate-400'}`}>No</button>
              </div>

              {hasOneWalletAccount === 'no' && (
                <div className="pt-2 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-300">
                  <p>🎁 Get a free <strong>₱100 instantly</strong>! Go to <a href="https://uno.global" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-bold inline-flex items-center gap-0.5">uno.global <ExternalLink className="w-2.5 h-2.5" /></a> and register.</p>
                  <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Referral Code:</span>
                      <span className="text-sm font-bold font-mono text-slate-100 tracking-wider">V98HAR</span>
                    </div>
                    <button type="button" onClick={handleCopyCode} className="px-2.5 py-1.5 bg-slate-800 text-xs rounded font-bold text-slate-200">{copiedCode ? 'Copied' : 'Copy'}</button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-2 uppercase">Select Payout Amount</label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 20, 50, 100, 200, 300, 400, 500, 1000].map((tier) => {
                const isLocked = balancePhp < tier;
                return (
                  <button
                    key={tier}
                    type="button"
                    disabled={isLocked}
                    onClick={() => setWithdrawAmount(tier)}
                    className={`p-2.5 rounded-xl border font-mono text-sm text-center transition-all ${
                      withdrawAmount === tier ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold' : isLocked ? 'bg-slate-950/10 text-slate-700 border-slate-900/40 line-through' : 'bg-slate-950/40 border-slate-800 text-slate-300'
                    }`}
                  >
                    ₱{tier}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1.5 uppercase">{selectedMethod === 'PAYPAL' ? 'PayPal Email Address' : 'Account Mobile Number / Details'}</label>
            <input
              type={selectedMethod === 'PAYPAL' ? 'email' : 'text'}
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder={selectedMethod === 'PAYPAL' ? 'example@paypal.com' : 'e.g., 0927XXXXXXX'}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full h-12 bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 rounded-xl font-bold flex items-center justify-center gap-2 font-sans text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Submit Cash Out Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
