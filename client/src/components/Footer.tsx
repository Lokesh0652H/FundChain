import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileCheck, Layers, GitBranch, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-slate-800 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-royal-600 flex items-center justify-center font-bold text-white text-sm">
                FC
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">FundChain</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Blockchain-Based Public Fund Tracking &amp; Transparency System. End-to-end accountability from state treasury to grassroot contractors.
            </p>
            <div className="pt-2 text-[10px] text-cyan-400 font-mono">
              Academic Demonstration Major Project
            </div>
          </div>

          {/* Core Flows */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Transparency Ledger
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/dashboard" className="hover:text-cyan-400 flex items-center gap-1 transition-colors">
                  Public Citizen Dashboard
                </Link>
              </li>
              <li>
                <Link to="/gis" className="hover:text-cyan-400 flex items-center gap-1 transition-colors">
                  GIS Infrastructure Map
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-cyan-400 flex items-center gap-1 transition-colors">
                  Verify Transaction Hash
                </Link>
              </li>
              <li>
                <Link to="/follow-the-money" className="hover:text-cyan-400 flex items-center gap-1 transition-colors">
                  Follow the Money Flow
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Role Portals
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/government" className="hover:text-cyan-400 transition-colors">
                  Government Treasury &amp; Approvals
                </Link>
              </li>
              <li>
                <Link to="/department" className="hover:text-cyan-400 transition-colors">
                  Department Work Management
                </Link>
              </li>
              <li>
                <Link to="/contractor" className="hover:text-cyan-400 transition-colors">
                  Contractor Milestone Desk
                </Link>
              </li>
              <li>
                <Link to="/auditor" className="hover:text-cyan-400 transition-colors">
                  CAG State Auditor &amp; AI Alerts
                </Link>
              </li>
            </ul>
          </div>

          {/* Blockchain & Tech */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              On-Chain Architecture
            </h4>
            <div className="space-y-2 text-[11px] text-slate-400 font-mono">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">SMART CONTRACT ADDRESS</div>
                <div className="text-cyan-300 font-bold break-all text-[10px]">
                  0x5FbDB2315678afecb367f032d93F642f64180aa3
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Proof of Authority Consensus</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Solidity ^0.8.20 &bull; Isolation Forest ML &bull; React &amp; TypeScript
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            &copy; 2026 FundChain. Developed for Final-Year B.E. Computer Science Engineering Major Project.
          </div>
          <div className="flex items-center gap-4 text-cyan-400">
            <span>"Track Every Rupee. Verify Every Record."</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
