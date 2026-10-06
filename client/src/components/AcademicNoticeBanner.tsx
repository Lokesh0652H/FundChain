import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export const AcademicNoticeBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 border-b border-cyan-500/30 text-white px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 tracking-wider uppercase">
            Academic Demonstration Dataset
          </span>
          <span className="text-slate-300 hidden md:inline">
            Final-Year B.E. Major Project Prototype &bull; Simulated Ledger &amp; Public GovTech Integration
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[11px] text-cyan-300">PoA Network: Live</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Smart Contract:</span>
            <span className="font-mono text-cyan-300">0x5FbD...aa3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
