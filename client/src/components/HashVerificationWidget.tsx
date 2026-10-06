import React, { useState } from 'react';
import { ShieldCheck, Search, FileText, CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HashVerificationWidget: React.FC = () => {
  const [inputHash, setInputHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputHash.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const cleanHash = inputHash.trim();
      const res = await fetch(`/api/blockchain/verify-hash/${cleanHash}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        const err = await res.json();
        setError(err.message || 'Hash not found on-chain');
      }
    } catch {
      setError('Unable to query verification node. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const sampleHashes = [
    { label: 'Sample DPR Hash', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { label: 'Sample Invoice Hash', hash: '0xd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-5">
        
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
            Zero-Knowledge Cryptographic Integrity
          </div>
          <h3 className="text-2xl font-black text-navy-900 tracking-tight">
            Verify Document &amp; Invoice SHA-256
          </h3>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Check any contractor invoice, detailed project report (DPR), or inspection certificate against the immutable smart contract ledger.
          </p>
        </div>

        {/* Search input form */}
        <form onSubmit={handleVerify} className="relative">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputHash}
                onChange={(e) => setInputHash(e.target.value)}
                placeholder="Enter SHA-256 hash or document fingerprint (e.g. 0x8f2d...)"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-xs text-slate-900 shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="submit"
              disabled={loading || !inputHash.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-royal-600 to-cyan-600 hover:from-royal-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Check Ledger
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick sample chips */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500">
          <span className="text-[11px] font-medium">Try test hash:</span>
          {sampleHashes.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { setInputHash(s.hash); }}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Verification Success Result */}
        {result && (
          <div className="bg-emerald-50/80 border border-emerald-300 rounded-xl p-4 text-emerald-950 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-sm text-emerald-900">
                  Cryptographic Verification Successful
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200/60 text-emerald-900 uppercase">
                {result.type || 'On-Chain Seal'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Record Title</span>
                <span className="font-bold text-slate-900">{result.title || result.vendor || 'Official Record'}</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Project Association</span>
                <span className="font-bold text-slate-900">{result.projectCode} &bull; {result.projectTitle}</span>
              </div>
            </div>

            {result.blockchainTxHash && (
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-mono text-[11px] text-slate-600 truncate max-w-xs">
                  Tx: {result.blockchainTxHash}
                </span>
                <Link
                  to={`/verify?hash=${result.blockchainTxHash}`}
                  className="font-bold text-royal-700 hover:underline flex items-center gap-1"
                >
                  Inspect Block #{result.blockNumber} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Error Result */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-900 text-xs flex items-center gap-2.5">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold block">Hash Unmatched on Smart Contract</span>
              <span className="text-rose-700 text-[11px]">{error}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
