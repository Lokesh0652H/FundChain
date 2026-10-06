import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  HardHat, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Receipt, 
  Cpu, 
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  Download
} from 'lucide-react';
import { Project } from '../types';
import { AIRiskIndicator } from '../components/AIRiskIndicator';
import { FollowTheMoney } from '../components/FollowTheMoney';

export const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'expenses' | 'documents' | 'blockchain' | 'follow'>('overview');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      }
    } catch (err) {
      console.error('Failed to load project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-12 h-12 border-4 border-royal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Fetching on-chain project records...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-navy-900">Project Not Found</h2>
        <Link to="/dashboard" className="px-4 py-2 bg-royal-600 text-white rounded-lg text-xs font-bold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isDisparity = project.financialProgress > (project.physicalProgress + 15) && project.financialProgress >= 20;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between text-xs">
        <Link to="/dashboard" className="flex items-center gap-1.5 text-royal-600 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Citizen Explorer
        </Link>
        <span className="font-mono text-slate-400">
          Smart Contract Index: #{project.smartContractProjectId || 1}
        </span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-black text-royal-700 bg-royal-50 px-2.5 py-1 rounded-lg border border-royal-200">
                {project.code}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 uppercase tracking-wider">
                {project.sector}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                project.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                project.status === 'Delayed' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                'bg-blue-50 text-royal-700 border border-blue-200'
              }`}>
                Status: {project.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-navy-900 leading-tight">
              {project.title}
            </h1>

            <p className="text-xs text-slate-600 leading-relaxed">
              {project.description}
            </p>

            {/* Department, Contractor, Location Info Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <Building2 className="w-4 h-4 text-royal-600 shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Nodal Department</span>
                  <span className="font-bold text-slate-800 truncate block">{project.department?.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <HardHat className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Contractor</span>
                  <span className="font-bold text-slate-800 truncate block">{project.contractor?.name || 'Public Works Unit'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Location &amp; District</span>
                  <span className="font-bold text-slate-800 truncate block">{project.locationAddress}, {project.district}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Ledger Stamp */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3 min-w-[260px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Ledger Assurance</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">
                Smart Contract
              </div>
              <div className="font-mono text-xs text-slate-300 break-all">
                0x5FbDB2315678afecb367f032d93F642f64180aa3
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">On-Chain Tx Count:</span>
              <span className="font-mono font-bold text-cyan-300">{project.blockchainTransactions?.length || 0}</span>
            </div>
          </div>

        </div>

        {/* Disparity Warning Box (Exact neutral wording requirement) */}
        {(isDisparity || project.aiReviewStatus === 'Review Required') && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-sm text-amber-900 block">
                Review Required — Financial progress is higher than reported physical progress.
              </span>
              <p className="text-slate-700 leading-relaxed">
                Notice: Recorded disbursements total <strong>{project.financialProgress}%</strong> of the project outlay while validated physical works stand at <strong>{project.physicalProgress}%</strong>. This advisory requires engineering cross-verification before the next milestone tranche release.
              </p>
            </div>
          </div>
        )}

        {/* 4 Financial KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Total Sanctioned Budget
            </span>
            <div className="text-xl font-black text-navy-900 mt-1">
              ₹{project.totalBudget.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">
              ₹{(project.totalBudget / 10000000).toFixed(2)} Crores
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
            <span className="text-[10px] uppercase font-bold text-royal-600 block tracking-wider">
              Released Funds
            </span>
            <div className="text-xl font-black text-royal-700 mt-1">
              ₹{project.releasedFunds.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-royal-600 font-medium">
              {project.financialProgress}% of Total Budget
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider">
              Actual Expenditure
            </span>
            <div className="text-xl font-black text-emerald-700 mt-1">
              ₹{project.expenditure.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">
              {((project.expenditure / (project.releasedFunds || 1)) * 100).toFixed(0)}% of Released Funds
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Remaining Budget
            </span>
            <div className="text-xl font-black text-slate-800 mt-1">
              ₹{(project.totalBudget - project.releasedFunds).toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">
              ₹{((project.totalBudget - project.releasedFunds) / 10000000).toFixed(2)} Crores Unreleased
            </span>
          </div>

        </div>

        {/* Dual Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Physical Progress (Engineered Works)</span>
              <span className="font-black text-emerald-600 font-mono text-sm">{project.physicalProgress}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                style={{ width: `${project.physicalProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">
              Based on geotagged site inspection reports &amp; material test clearances
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Financial Progress (Disbursed Outlay)</span>
              <span className="font-black text-royal-600 font-mono text-sm">{project.financialProgress}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isDisparity ? 'bg-amber-500' : 'bg-gradient-to-r from-blue-500 to-royal-600'
                }`}
                style={{ width: `${project.financialProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">
              Cumulative tranche releases executed through smart contract escrow
            </span>
          </div>

        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-royal-600 text-royal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Overview &amp; AI Analysis
        </button>

        <button
          onClick={() => setActiveTab('milestones')}
          className={`pb-3 px-4 transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'milestones'
              ? 'border-royal-600 text-royal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Milestones ({project.milestones?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`pb-3 px-4 transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'expenses'
              ? 'border-royal-600 text-royal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Expenses ({project.expenses?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 px-4 transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'documents'
              ? 'border-royal-600 text-royal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Document Hashes ({project.documents?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('blockchain')}
          className={`pb-3 px-4 transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'blockchain'
              ? 'border-royal-600 text-royal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          On-Chain Ledger ({project.blockchainTransactions?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('follow')}
          className={`pb-3 px-4 transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'follow'
              ? 'border-royal-600 text-royal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Follow the Money
        </button>
      </div>

      {/* Tab 1: Overview & AI Analysis */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* AI Risk Component */}
          <AIRiskIndicator
            severity={project.aiAnalysis?.severity || (isDisparity ? 'HIGH' : 'NORMAL')}
            isFlagged={project.aiAnalysis?.isFlagged || isDisparity}
            primaryReason={project.aiAnalysis?.primaryReason || (isDisparity ? 'Review Required — Financial progress is higher than reported physical progress.' : null)}
            allReasons={project.aiAnalysis?.allReasons}
            riskScore={project.aiAnalysis?.riskScore || (isDisparity ? 0.92 : 0.08)}
            metrics={project.aiAnalysis?.metrics || {
              financialProgressPct: project.financialProgress,
              physicalProgressPct: project.physicalProgress,
              disparityDelta: project.financialProgress - project.physicalProgress,
              budgetUtilization: Math.round((project.expenditure / (project.allocatedFunds || 1)) * 100),
              expenseRatio: Math.round((project.expenditure / (project.releasedFunds || 1)) * 100)
            }}
          />

          {/* Timeline of Major Sanctions & Work */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-navy-900">
              Project Audit Timeline
            </h3>

            <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 py-2">
              
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-royal-600 border-2 border-white" />
                <div className="text-[11px] font-bold text-slate-400">
                  {new Date(project.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="text-xs font-bold text-navy-900">
                  Administrative Approval &amp; Treasury Sanction
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Capital outlay approved under order {project.fundAllocations?.[0]?.orderNumber || 'GO-MS-01'}.
                </p>
              </div>

              {project.milestones?.map((m) => (
                <div key={m.id} className="relative pl-6">
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                    m.status === 'FundsReleased' ? 'bg-emerald-500' :
                    m.status === 'Approved' ? 'bg-blue-500' : 'bg-slate-300'
                  }`} />
                  <div className="text-[11px] font-bold text-slate-400">
                    Phase {m.sequence} Milestone: {m.status}
                  </div>
                  <div className="text-xs font-bold text-navy-900">
                    {m.title}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Target: ₹{(m.targetAmount / 10000000).toFixed(2)} Cr &bull; Physical Weightage: {m.physicalWeightage}%
                  </p>
                </div>
              ))}

              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-cyan-500 border-2 border-white" />
                <div className="text-[11px] font-bold text-slate-400">
                  Target Completion Date: {new Date(project.targetCompletionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="text-xs font-bold text-navy-900">
                  Final Quality Commissioning &amp; Handover
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Milestones */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-navy-900">
              Verified Project Milestones
            </h3>
            <p className="text-xs text-slate-500">
              Contractor fund releases are programmatically locked until physical progress matches each milestone definition.
            </p>

            <div className="space-y-4">
              {project.milestones?.map((m) => (
                <div key={m.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-navy-900 text-white font-bold text-xs flex items-center justify-center">
                        {m.sequence}
                      </span>
                      <h4 className="text-sm font-bold text-navy-900">
                        {m.title}
                      </h4>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      m.status === 'FundsReleased' ? 'bg-emerald-100 text-emerald-800' :
                      m.status === 'Approved' ? 'bg-blue-100 text-royal-800' :
                      m.status === 'Submitted' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {m.status === 'FundsReleased' ? 'Funds Disbursed' : m.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    {m.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Target Value</span>
                      <div className="font-bold text-navy-900">₹{m.targetAmount.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Physical Weight</span>
                      <div className="font-bold text-emerald-600">{m.physicalWeightage}% of Total</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Approved By</span>
                      <div className="font-bold text-slate-800">{m.approvedBy || 'Pending Inspection'}</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Evidence SHA-256</span>
                      <div className="font-mono text-[10px] text-cyan-700 truncate">
                        {m.evidenceDocHash ? `${m.evidenceDocHash.slice(0, 14)}...` : 'Not submitted yet'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Expenses */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-navy-900">
                Itemized Procurement &amp; Invoices
              </h3>
              <p className="text-xs text-slate-500">
                Every procurement invoice is hashed and verified before release.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              Total Spent: ₹{project.expenditure.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b">
                <tr>
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Vendor / Beneficiary</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Invoice SHA-256</th>
                  <th className="py-2.5 px-3">Ledger Tx</th>
                </tr>
              </thead>
              <tbody className="divide-y font-mono text-[11px]">
                {project.expenses?.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-800">{e.invoiceNumber}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-700">{e.vendorName}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold">
                        {e.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans font-bold text-emerald-700">₹{e.amount.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-slate-500 truncate max-w-[130px]" title={e.invoiceDocHash}>
                      {e.invoiceDocHash.substring(0, 12)}...
                    </td>
                    <td className="py-2.5 px-3">
                      {e.blockchainTxHash ? (
                        <Link to={`/verify?hash=${e.blockchainTxHash}`} className="text-royal-600 hover:underline">
                          Block #{e.blockNumber}
                        </Link>
                      ) : 'Verified'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-navy-900">
              Cryptographic Document Registry
            </h3>
            <p className="text-xs text-slate-500">
              Sensitive files remain off-chain while immutable SHA-256 fingerprints are registered on the smart contract.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.documents?.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-royal-100 text-royal-800 uppercase">
                    {doc.docType}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> On-Chain Sealed
                  </span>
                </div>

                <div className="font-bold text-slate-900 text-sm">
                  {doc.title}
                </div>

                <div className="space-y-1 pt-1 font-mono text-[10px]">
                  <div className="text-slate-500 truncate">
                    SHA-256: <span className="text-slate-800">{doc.fileHash}</span>
                  </div>
                  {doc.ipfsHash && (
                    <div className="text-slate-500 truncate">
                      IPFS CID: <span className="text-cyan-700">{doc.ipfsHash}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                  <span className="text-slate-500">Uploaded by: {doc.uploadedBy}</span>
                  {doc.blockchainTxHash && (
                    <Link to={`/verify?hash=${doc.blockchainTxHash}`} className="font-bold text-royal-600 hover:underline">
                      Verify Tx
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Blockchain Ledger */}
      {activeTab === 'blockchain' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-navy-900">
                Blockchain Audit Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Immutable event stream mined on the FundChain PoA network for this project.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-mono font-bold">
              PoA Consensus
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b">
                <tr>
                  <th className="py-2.5 px-3">Block #</th>
                  <th className="py-2.5 px-3">Event Type</th>
                  <th className="py-2.5 px-3">Tx Hash</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Gas Used</th>
                  <th className="py-2.5 px-3">Verify</th>
                </tr>
              </thead>
              <tbody className="divide-y font-mono text-[11px]">
                {project.blockchainTransactions?.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 text-cyan-700 font-bold">#{tx.blockNumber}</td>
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-800">{tx.eventType}</td>
                    <td className="py-2.5 px-3 text-slate-500 truncate max-w-[140px]" title={tx.txHash}>
                      {tx.txHash.substring(0, 14)}...
                    </td>
                    <td className="py-2.5 px-3 font-sans font-bold text-navy-900">
                      {tx.amount > 0 ? `₹${tx.amount.toLocaleString('en-IN')}` : '0 (Receipt)'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{tx.gasUsed}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <Link
                        to={`/verify?hash=${tx.txHash}`}
                        className="px-2.5 py-1 rounded bg-royal-50 text-royal-700 hover:bg-royal-100 font-bold text-[10px]"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Follow the Money */}
      {activeTab === 'follow' && (
        <FollowTheMoney
          projectTitle={project.title}
          projectCode={project.code}
        />
      )}

    </div>
  );
};
