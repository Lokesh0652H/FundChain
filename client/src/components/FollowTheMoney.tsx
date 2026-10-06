import React, { useState } from 'react';
import { 
  Building2, 
  Landmark, 
  FolderKanban, 
  HardHat, 
  Flag, 
  Receipt, 
  Cpu, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../types';

export interface FollowTheMoneyStep {
  step: number;
  level: string;
  entity: string;
  date: string;
  amount: number;
  purpose: string;
  txHash: string;
  status?: string;
  details?: Record<string, any>;
}

interface Props {
  projects?: Project[];
  selectedProject?: Project;
  onSelectProject?: (project: Project) => void;
  steps?: FollowTheMoneyStep[];
  projectTitle?: string;
  projectCode?: string;
}

export const FollowTheMoney: React.FC<Props> = ({ 
  projects = [],
  selectedProject,
  onSelectProject,
  steps,
  projectTitle,
  projectCode
}) => {
  // Default mock fallback projects if none loaded
  const activeProj = selectedProject || (projects.length > 0 ? projects[0] : null);

  const defaultSteps: FollowTheMoneyStep[] = [
    {
      step: 1,
      level: 'GOVERNMENT',
      entity: 'Ministry of Finance, Govt. of India',
      date: '10 Dec 2025',
      amount: activeProj ? activeProj.totalBudget * 0.9 : 1258900000,
      purpose: 'Budget sanctioned from treasury to main escrow',
      txHash: '0x7b23d9a1f5e8401a71923057fa4891b0c953e201b17a02e64b81b2123d4e861c7',
    },
    {
      step: 2,
      level: 'DEPARTMENT',
      entity: activeProj?.department?.name || 'Jal Shakti & Sanitation Department',
      date: '12 Dec 2025',
      amount: activeProj ? activeProj.allocatedFunds : 1258900000,
      purpose: 'Budget allocation FY2026-Q4',
      txHash: '0x91dae2f4c6b8401a71923057fa4891b0c953e201b17a02e64b81b2123d4eb5a4',
    },
    {
      step: 3,
      level: 'PROJECT',
      entity: activeProj?.title || 'Stormwater Drainage Upgrade, Chennai',
      date: '15 Dec 2025',
      amount: activeProj ? activeProj.totalBudget : 1446100000,
      purpose: `Sanctioned budget: ${activeProj?.code || 'FC-2026-119'}`,
      txHash: '0x81fa0e59c6b8401a71923057fa4891b0c953e201b17a02e64b81b2123d4ec707',
    },
    {
      step: 4,
      level: 'CONTRACTOR',
      entity: activeProj?.contractor?.name || 'Brahmaputra Engineering',
      date: '26 Dec 2025',
      amount: activeProj ? activeProj.releasedFunds : 1084600000,
      purpose: 'Initial tranche release against approved milestones',
      txHash: '0x47e199d9c6b8401a71923057fa4891b0c953e201b17a02e64b81b2123d4ee282',
    },
    {
      step: 5,
      level: 'MILESTONE',
      entity: 'Foundation & Phase 1 Works',
      date: '19 Jan 2026',
      amount: activeProj ? activeProj.releasedFunds * 0.4 : 433800000,
      purpose: 'Approved - 32% of works completed and certified',
      txHash: '0x9815aac6b8401a71923057fa4891b0c953e201b17a02e64b81b2123d4ecbb9',
    },
    {
      step: 6,
      level: 'EXPENSE',
      entity: 'Consultancy & Testing Services',
      date: '17 May 2026',
      amount: activeProj ? activeProj.expenditure * 0.45 : 410500000,
      purpose: 'Payment for structural consultancy & core testing',
      txHash: '0x7a83d4c6b8401a71923057fa4891b0c953e201b17a02e64b81b2123d4eab85',
    },
    {
      step: 7,
      level: 'BLOCKCHAIN',
      entity: 'Block #18942698',
      date: '17 May 2026',
      amount: activeProj ? activeProj.expenditure : 944600000,
      purpose: '8 records hash-chained & verifiable on PoA ledger',
      txHash: '0x7ba451c6b8401a71923057fa4891b0c953e201b17a02e64b81b2123d4e6f81',
    }
  ];

  const currentSteps = steps || defaultSteps;

  const getStepIcon = (level: string) => {
    switch (level.toUpperCase()) {
      case 'GOVERNMENT': return Landmark;
      case 'DEPARTMENT': return Building2;
      case 'PROJECT': return FolderKanban;
      case 'CONTRACTOR': return HardHat;
      case 'MILESTONE': return Flag;
      case 'EXPENSE': return Receipt;
      case 'BLOCKCHAIN': return Cpu;
      default: return Landmark;
    }
  };

  const budget = activeProj ? (activeProj.totalBudget / 10000000).toFixed(2) : '144.61';
  const released = activeProj ? (activeProj.releasedFunds / 10000000).toFixed(2) : '108.46';
  const spent = activeProj ? (activeProj.expenditure / 10000000).toFixed(2) : '94.46';
  const utilized = activeProj && activeProj.totalBudget > 0
    ? Math.round((activeProj.expenditure / activeProj.totalBudget) * 100)
    : 65;

  return (
    <div className="space-y-8">
      
      {/* Section Header */}
      <div className="space-y-2 text-left">
        <span className="text-[11px] font-bold uppercase tracking-wider text-royal-600 block">
          FOLLOW THE MONEY
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Every rupee, every hand it passes through
        </h2>
        <p className="text-sm text-slate-500 max-w-3xl leading-relaxed">
          Trace a project's funds from the government to the last expense. Every step shows its date, amount, purpose and blockchain hash.
        </p>
      </div>

      {/* Main Grid: Left Card + Right Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Card: Choose a Project */}
        <div className="lg:col-span-4 bg-[#0B1528] rounded-[28px] p-6 sm:p-7 text-white shadow-xl space-y-6">
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              CHOOSE A PROJECT
            </span>

            {/* Custom Project Selector Dropdown */}
            <div className="relative">
              <select
                value={activeProj?.id || ''}
                onChange={(e) => {
                  const found = projects.find(p => p.id === e.target.value);
                  if (found && onSelectProject) onSelectProject(found);
                }}
                className="w-full appearance-none bg-[#132238] border border-slate-700/80 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-100 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {projects.length > 0 ? (
                  projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.code} - {p.title.slice(0, 28)}...
                    </option>
                  ))
                ) : (
                  <option value="">FC-2026-119 - Stormwater Drainage Upgrade</option>
                )}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 4 Stats Grid Inside Card */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Budget</span>
              <div className="text-xl font-bold text-white mt-0.5">
                ₹{budget} Cr
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Released</span>
              <div className="text-xl font-bold text-white mt-0.5">
                ₹{released} Cr
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Spent</span>
              <div className="text-xl font-bold text-white mt-0.5">
                ₹{spent} Cr
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Utilized</span>
              <div className="text-xl font-bold text-cyan-400 mt-0.5">
                {utilized}%
              </div>
            </div>
          </div>

          {/* Full Project Details Link */}
          {activeProj && (
            <div className="pt-2 border-t border-slate-800">
              <Link
                to={`/project/${activeProj.id}`}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
              >
                Full project details
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: 7 Sequential Connected Steps */}
        <div className="lg:col-span-8 space-y-4 relative">
          
          {/* Subtle vertical connector line */}
          <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-slate-200 z-0" />

          {currentSteps.map((s) => {
            const Icon = getStepIcon(s.level);
            const isBlockchain = s.level.toUpperCase() === 'BLOCKCHAIN';

            return (
              <div key={s.step} className="relative z-10 flex items-start gap-4 group">
                
                {/* Step Circular Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                  isBlockchain
                    ? 'bg-cyan-500 text-white shadow-glow-cyan'
                    : 'bg-[#15233C] text-white'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Step Card Content */}
                <div className="flex-1 bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all space-y-2">
                  
                  {/* Top Level + Date Row */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-royal-600 tracking-wider text-[11px] uppercase">
                      {s.step}. {s.level}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {s.date}
                    </span>
                  </div>

                  {/* Title & Entity */}
                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {s.entity}
                  </h4>

                  {/* Amount & Purpose & Hash Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-black text-slate-900 text-sm font-sans">
                        ₹{(s.amount / 10000000).toFixed(2)} Cr
                      </span>
                      <span className="text-xs text-slate-500">
                        {s.purpose}
                      </span>
                    </div>

                    {/* Hash Tag Pill */}
                    <Link
                      to={`/verify?hash=${s.txHash}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50/80 hover:bg-cyan-100 border border-cyan-200/60 text-cyan-800 text-[11px] font-mono font-medium transition-colors shrink-0"
                      title="Inspect hash on ledger"
                    >
                      <span>{s.txHash.substring(0, 8)}...{s.txHash.slice(-4)}</span>
                      <ExternalLink className="w-3 h-3 text-cyan-600" />
                    </Link>
                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
};
