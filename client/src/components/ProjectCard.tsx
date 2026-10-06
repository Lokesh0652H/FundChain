import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  HardHat 
} from 'lucide-react';
import { Project } from '../types';

interface Props {
  project: Project;
  onOpenFollowTheMoney?: (project: Project) => void;
}

export const ProjectCard: React.FC<Props> = ({ project, onOpenFollowTheMoney }) => {
  const isDisparity = project.financialProgress > (project.physicalProgress + 15) && project.financialProgress >= 20;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
            <Clock className="w-3 h-3 text-amber-600" /> Delayed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-royal-700 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-royal-600" /> Ongoing
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-[28px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden group p-6 space-y-5">
      
      {/* Top Identifiers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-royal-700 bg-blue-50/80 px-2.5 py-0.5 rounded-full border border-blue-100">
              {project.code}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
              {project.sector}
            </span>
          </div>
          {getStatusBadge(project.status)}
        </div>

        <Link to={`/project/${project.id}`} className="block group-hover:text-royal-600 transition-colors">
          <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
            {project.title}
          </h3>
        </Link>

        {/* Location & Department */}
        <div className="space-y-1 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{project.department?.name}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{project.locationAddress}, {project.district}</span>
          </div>
        </div>
      </div>

      {/* Disparity Warning (Neutral Wording) */}
      {(isDisparity || project.aiReviewStatus === 'Review Required') && (
        <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-[11px] flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span className="font-medium leading-tight">
            <strong>Review Required</strong> — Financial progress ({project.financialProgress}%) is higher than reported physical progress ({project.physicalProgress}%).
          </span>
        </div>
      )}

      {/* Financial Numbers Row */}
      <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 grid grid-cols-3 gap-2 text-center">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Budget
          </span>
          <span className="text-xs font-black text-slate-900">
            ₹{(project.totalBudget / 10000000).toFixed(2)} Cr
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Released
          </span>
          <span className="text-xs font-black text-royal-600">
            ₹{(project.releasedFunds / 10000000).toFixed(2)} Cr
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Expended
          </span>
          <span className="text-xs font-black text-emerald-600">
            ₹{(project.expenditure / 10000000).toFixed(2)} Cr
          </span>
        </div>
      </div>

      {/* Dual Progress Bars */}
      <div className="space-y-2.5">
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-medium text-slate-600">Physical Progress</span>
            <span className="font-bold text-emerald-600 font-mono">{project.physicalProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${project.physicalProgress}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-medium text-slate-600">Financial Disbursed</span>
            <span className="font-bold text-royal-600 font-mono">{project.financialProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isDisparity ? 'bg-amber-500' : 'bg-royal-600'
              }`}
              style={{ width: `${project.financialProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-800 bg-cyan-50/70 px-2.5 py-1 rounded-full border border-cyan-100">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
          <span>Hash-chained</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenFollowTheMoney && onOpenFollowTheMoney(project)}
            className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-royal-300 bg-white text-royal-700 hover:bg-royal-50 text-xs font-semibold transition-all flex items-center gap-1"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Flow
          </button>
          <Link
            to={`/project/${project.id}`}
            className="px-4 py-1.5 rounded-full bg-slate-900 hover:bg-royal-600 text-white text-xs font-bold transition-all flex items-center gap-1"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

    </div>
  );
};
