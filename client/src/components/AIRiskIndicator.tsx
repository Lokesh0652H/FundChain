import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Info, Activity } from 'lucide-react';

interface Props {
  severity?: 'NORMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | string;
  isFlagged?: boolean;
  primaryReason?: string | null;
  allReasons?: string[];
  riskScore?: number;
  metrics?: {
    financialProgressPct: number;
    physicalProgressPct: number;
    disparityDelta: number;
    budgetUtilization: number;
    expenseRatio: number;
  };
}

export const AIRiskIndicator: React.FC<Props> = ({
  severity = 'NORMAL',
  isFlagged = false,
  primaryReason,
  allReasons = [],
  riskScore = 0.1,
  metrics
}) => {
  const normSeverity = (severity || 'NORMAL').toUpperCase();

  const getBadgeStyle = () => {
    switch (normSeverity) {
      case 'HIGH':
        return {
          wrapper: 'bg-amber-50/90 border-amber-300 text-amber-900',
          badge: 'bg-amber-500/20 text-amber-800 border-amber-400/40',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
          title: 'AI Review Indicator — Disparity Flagged'
        };
      case 'MEDIUM':
        return {
          wrapper: 'bg-amber-50/70 border-amber-200 text-amber-900',
          badge: 'bg-amber-500/20 text-amber-800 border-amber-300',
          icon: AlertTriangle,
          iconColor: 'text-amber-500',
          title: 'AI Review Indicator — Variance Advisory'
        };
      case 'LOW':
        return {
          wrapper: 'bg-blue-50/80 border-blue-200 text-blue-900',
          badge: 'bg-blue-500/10 text-royal-700 border-blue-200',
          icon: Info,
          iconColor: 'text-royal-500',
          title: 'AI Review Indicator — Minor Divergence'
        };
      default:
        return {
          wrapper: 'bg-emerald-50/60 border-emerald-200 text-emerald-950',
          badge: 'bg-emerald-500/15 text-emerald-800 border-emerald-300/40',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600',
          title: 'AI Review Indicator — Healthy Alignment'
        };
    }
  };

  const style = getBadgeStyle();
  const IconComponent = style.icon;

  return (
    <div className={`rounded-2xl border p-5 shadow-sm transition-all ${style.wrapper}`}>
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white shadow-sm">
            <IconComponent className={`w-5 h-5 ${style.iconColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold tracking-tight">
                {style.title}
              </h4>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${style.badge}`}>
                {normSeverity === 'NORMAL' ? 'Standard Variance' : `${normSeverity} Priority Review`}
              </span>
            </div>
            <p className="text-[11px] opacity-80 mt-0.5">
              Scikit-Learn Isolation Forest &amp; Multi-Parameter Disparity Analysis
            </p>
          </div>
        </div>

        {/* Risk meter */}
        <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500 text-[11px]">ML Anomaly Score:</span>
          <span className="font-mono font-bold text-slate-900">
            {(riskScore * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Primary Reason / Neutral Notice */}
      <div className="bg-white/90 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
        <div className="text-xs font-semibold leading-relaxed">
          {primaryReason || (
            normSeverity === 'NORMAL'
              ? 'Disbursements and milestone physical validations track within expected tolerance envelopes.'
              : 'Review Required — Financial progress is higher than reported physical progress.'
          )}
        </div>

        {allReasons && allReasons.length > 1 && (
          <ul className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600 list-disc list-inside">
            {allReasons.slice(1).map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-white/70 border border-slate-200/60">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Financial Progress</span>
            <span className="font-mono font-bold text-royal-700">{metrics.financialProgressPct}%</span>
          </div>
          <div className="p-2 rounded-lg bg-white/70 border border-slate-200/60">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Physical Progress</span>
            <span className="font-mono font-bold text-emerald-700">{metrics.physicalProgressPct}%</span>
          </div>
          <div className="p-2 rounded-lg bg-white/70 border border-slate-200/60">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Progress Delta</span>
            <span className={`font-mono font-bold ${metrics.disparityDelta > 15 ? 'text-amber-700' : 'text-slate-700'}`}>
              {metrics.disparityDelta > 0 ? `+${metrics.disparityDelta}%` : `${metrics.disparityDelta}%`}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-white/70 border border-slate-200/60">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Budget Utilized</span>
            <span className="font-mono font-bold text-slate-800">{metrics.budgetUtilization}%</span>
          </div>
        </div>
      )}

      {/* Audit Mandate Disclaimer */}
      <div className="mt-3 text-[10px] opacity-75 leading-normal italic">
        * Compliance Standard: Anomaly indicators are automated statistical triggers generated for internal audit inspection and are never to be construed as conclusive proof of fraud.
      </div>

    </div>
  );
};
