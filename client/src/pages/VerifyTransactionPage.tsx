import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Copy, 
  Check, 
  ExternalLink,
  Code,
  Layers,
  Clock,
  Landmark,
  UserCheck
} from 'lucide-react';
import { BlockchainTransaction } from '../types';

export const VerifyTransactionPage: React.FC = () => {
  const location = useLocation();
  const [hashInput, setHashInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [txDetails, setTxDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<BlockchainTransaction[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Check URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const h = params.get('hash');
    if (h) {
      setHashInput(h);
      verifyHash(h);
    }
    fetchRecent();
  }, [location.search]);

  const fetchRecent = async () => {
    try {
      const res = await fetch('/api/blockchain/transactions?limit=8');
      if (res.ok) {
        const data = await res.json();
        setRecentTransactions(data.transactions || []);
      }
    } catch {
      // ignore
    }
  };

  const verifyHash = async (hashToVerify: string) => {
    if (!hashToVerify.trim()) return;
    setLoading(true);
    setError(null);
    setTxDetails(null);

    try {
      const cleanHash = hashToVerify.trim();
      const res = await fetch(`/api/blockchain/verify/${cleanHash}`);
      if (res.ok) {
        const json = await res.json();
        setTxDetails(json.data);
      } else {
        const err = await res.json();
        setError(err.error || 'Transaction hash could not be verified on the FundChain ledger.');
      }
    } catch {
      setError('Communication failure with PoA consensus node. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyHash(hashInput);
  };

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-cyan-600" />
          Proof of Authority Blockchain Explorer
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
          Verify Blockchain Record
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Query the immutable smart contract ledger by transaction hash to verify sender, receiver, project ID, released amounts, and tamper-proof state receipts.
        </p>
      </div>

      {/* Hash Query Input Form */}
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="Paste transaction hash (e.g. 0x8f2d...)"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-xs text-slate-900 shadow-inner bg-white"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="submit"
              disabled={loading || !hashInput.trim()}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-royal-600 to-cyan-600 hover:from-royal-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Cpu className="w-4 h-4" />
              {loading ? 'Verifying on-chain...' : 'Verify Transaction'}
            </button>
          </div>
        </form>
      </div>

      {/* Error View */}
      {error && (
        <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-3">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <span className="font-bold block">Verification Failed</span>
            <span className="text-rose-700">{error}</span>
          </div>
        </div>
      )}

      {/* Verified Details Receipt Card */}
      {txDetails && (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden animate-fadeIn">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 text-white p-6 sm:p-8 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {txDetails.verificationStatus}
                </span>
                <h3 className="text-xl font-bold text-white">
                  Event: {txDetails.eventType}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Mined in Block #{txDetails.blockNumber} &bull; {new Date(txDetails.timestamp).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Transaction Value</span>
                <span className="text-2xl font-black text-cyan-300 font-mono">
                  {txDetails.amount > 0 ? `₹${txDetails.amount.toLocaleString('en-IN')}` : '0 (Receipt Seal)'}
                </span>
              </div>
            </div>
          </div>

          {/* Core Specifications Table */}
          <div className="p-6 sm:p-8 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Tx Hash */}
              <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Transaction Hash
                </span>
                <div className="flex items-center justify-between gap-2">
                  <code className="font-mono text-xs text-navy-900 break-all">
                    {txDetails.txHash}
                  </code>
                  <button
                    onClick={() => handleCopy('txHash', txDetails.txHash)}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-500"
                    title="Copy"
                  >
                    {copiedField === 'txHash' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sender */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Sender (From Address)
                </span>
                <code className="font-mono text-[11px] text-slate-800 break-all block">
                  {txDetails.sender}
                </code>
                <span className="text-[10px] text-slate-500 block">
                  Treasury Authorized Signer
                </span>
              </div>

              {/* Receiver */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Receiver (To Address / Entity)
                </span>
                <code className="font-mono text-[11px] text-slate-800 break-all block">
                  {txDetails.receiver}
                </code>
                <span className="text-[10px] text-slate-500 block">
                  Beneficiary / Escrow Address
                </span>
              </div>

              {/* Associated Project */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Associated Project
                </span>
                <span className="font-bold text-navy-900 block">
                  {txDetails.projectCode || 'FC-TREASURY'} &bull; {txDetails.projectTitle || 'State Central Allocation'}
                </span>
                {txDetails.projectId && (
                  <Link
                    to={`/project/${txDetails.projectId}`}
                    className="text-[11px] font-bold text-royal-600 hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    View Project Audit Trail <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {/* Network Parameters */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Ledger Consensus
                </span>
                <span className="font-bold text-slate-800 block">
                  {txDetails.consensusMechanism}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Gas Consumption: {txDetails.gasUsed} Units
                </span>
              </div>

            </div>

            {/* Raw Cryptographic Payload */}
            {txDetails.rawPayload && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Code className="w-4 h-4 text-cyan-600" />
                  Decoded Smart Contract Payload Receipt
                </div>
                <pre className="p-4 rounded-xl bg-slate-900 text-cyan-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
                  {JSON.stringify(txDetails.rawPayload, null, 2)}
                </pre>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Quick Picks: Recent Transactions */}
      <div className="max-w-4xl mx-auto space-y-4 pt-4">
        <h3 className="text-base font-bold text-navy-900">
          Or Select a Recent On-Chain Transaction to Inspect:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recentTransactions.map((tx) => (
            <button
              key={tx.id}
              onClick={() => {
                setHashInput(tx.txHash);
                verifyHash(tx.txHash);
              }}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-cyan-400 hover:shadow-card text-left transition-all space-y-1 group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 group-hover:text-royal-600 transition-colors">
                  {tx.eventType}
                </span>
                <span className="font-mono text-cyan-700 font-bold text-[11px]">
                  #{tx.blockNumber}
                </span>
              </div>
              <code className="text-[11px] font-mono text-slate-500 truncate block">
                {tx.txHash}
              </code>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>{tx.project?.code || 'FC-CAPITAL'}</span>
                <span className="font-bold text-navy-900 font-sans">
                  {tx.amount > 0 ? `₹${(tx.amount / 100000).toFixed(1)}L` : 'Sealed'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
