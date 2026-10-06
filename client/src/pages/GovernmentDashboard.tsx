import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Landmark, 
  Building2, 
  Coins, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  ExternalLink,
  ShieldCheck,
  Send,
  Loader2
} from 'lucide-react';
import { Project, Department, SystemOverview } from '../types';
import { useAuth } from '../context/AuthContext';

export const GovernmentDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<SystemOverview | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // Allocate funds modal
  const [allocModalOpen, setAllocModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [allocAmount, setAllocAmount] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [allocating, setAllocating] = useState(false);
  const [allocSuccess, setAllocSuccess] = useState<any>(null);

  // Release funds modal
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [releaseProjectId, setReleaseProjectId] = useState('');
  const [releaseAmount, setReleaseAmount] = useState('');
  const [releasing, setReleasing] = useState(false);
  const [releaseSuccess, setReleaseSuccess] = useState<any>(null);

  useEffect(() => {
    fetchGovData();
  }, []);

  const fetchGovData = async () => {
    try {
      const [statsRes, projRes, deptRes] = await Promise.all([
        fetch('/api/stats/overview'),
        fetch('/api/projects'),
        fetch('/api/departments')
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (projRes.ok) setProjects(await projRes.json());
      if (deptRes.ok) setDepartments(await deptRes.json());
    } catch (err) {
      console.error('Failed to load gov data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !allocAmount) return;

    setAllocating(true);
    setAllocSuccess(null);
    try {
      const res = await fetch('/api/funds/allocate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: selectedProjectId,
          amount: parseFloat(allocAmount),
          orderNumber: orderNumber || `GO-MS-AL-${Date.now().toString().slice(-4)}`
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAllocSuccess(data);
        fetchGovData();
      } else {
        const err = await res.json();
        alert(err.error || 'Allocation failed');
      }
    } catch {
      alert('Network error while allocating funds.');
    } finally {
      setAllocating(false);
    }
  };

  const handleRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!releaseProjectId || !releaseAmount) return;

    setReleasing(true);
    setReleaseSuccess(null);
    try {
      const res = await fetch('/api/funds/release', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: releaseProjectId,
          amount: parseFloat(releaseAmount)
        })
      });

      if (res.ok) {
        const data = await res.json();
        setReleaseSuccess(data);
        fetchGovData();
      } else {
        const err = await res.json();
        alert(err.error || 'Release failed');
      }
    } catch {
      alert('Network error while releasing funds.');
    } finally {
      setReleasing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-royal-700 bg-royal-50 px-2.5 py-1 rounded-full border border-royal-200">
              Government Executive Desk
            </span>
            <span className="text-xs text-slate-500">
              Finance &amp; Treasury Administration
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 mt-1">
            State Capital Outlay &amp; Treasury Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as: <strong>{user?.name || 'Dr. Ramesh Kumar (Principal Secretary, Finance)'}</strong> &bull; Treasury Signer Active
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setAllocModalOpen(true); setAllocSuccess(null); }}
            className="px-4 py-2.5 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Coins className="w-4 h-4" />
            Allocate Project Capital
          </button>
          <button
            onClick={() => { setReleaseModalOpen(true); setReleaseSuccess(null); }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            Release Milestone Tranche
          </button>
        </div>
      </div>

      {/* Macro Treasury Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Total State Sanctioned
          </span>
          <div className="text-2xl font-black text-navy-900 mt-1">
            ₹{stats ? (stats.summary.totalBudget / 10000000).toFixed(2) : '312.50'} Cr
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Across 10 State Departments
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-[10px] uppercase font-bold text-royal-600 block tracking-wider">
            Total Capital Allocated
          </span>
          <div className="text-2xl font-black text-royal-600 mt-1">
            ₹{stats ? (stats.summary.allocatedFunds / 10000000).toFixed(2) : '260.40'} Cr
          </div>
          <span className="text-[10px] text-royal-600 mt-1 block font-medium">
            Programmatically locked in escrow
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-[10px] uppercase font-bold text-emerald-600 block tracking-wider">
            Disbursed to Contractors
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ₹{stats ? (stats.summary.releasedFunds / 10000000).toFixed(2) : '224.80'} Cr
          </div>
          <span className="text-[10px] text-emerald-600 mt-1 block font-medium">
            Conditioned on physical milestones
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-[10px] uppercase font-bold text-amber-600 block tracking-wider">
            Active Disparity Alerts
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {stats ? stats.summary.anomaliesCount : 4} Projects
          </div>
          <Link to="/auditor" className="text-[10px] text-amber-700 underline font-semibold mt-1 block">
            Inspect via Auditor Desk &rarr;
          </Link>
        </div>

      </div>

      {/* Departments Budget Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-4">
        <h2 className="text-lg font-bold text-navy-900">
          Departmental Budget &amp; Utilization Status
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Department Name</th>
                <th className="py-3 px-4">Head Officer</th>
                <th className="py-3 px-4">Allocated Capital</th>
                <th className="py-3 px-4">Projects</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y font-mono text-[11px]">
              {departments.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 text-royal-700 font-bold">{d.code}</td>
                  <td className="py-3 px-4 font-sans font-bold text-slate-900">{d.name}</td>
                  <td className="py-3 px-4 font-sans text-slate-600">{d.headName}</td>
                  <td className="py-3 px-4 font-sans font-bold text-navy-900">
                    ₹{(d.budgetAllocated / 10000000).toFixed(2)} Cr
                  </td>
                  <td className="py-3 px-4 font-sans">{d._count?.projects || 3}</td>
                  <td className="py-3 px-4 font-sans">
                    <button
                      onClick={() => {
                        const proj = projects.find(p => p.departmentId === d.id);
                        if (proj) setSelectedProjectId(proj.id);
                        setAllocModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded bg-royal-50 hover:bg-royal-100 text-royal-700 font-bold text-[10px]"
                    >
                      Top-up Project
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Projects Table with Disparity & Action Flags */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-4">
        <h2 className="text-lg font-bold text-navy-900">
          Executive Project Portfolio
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Allocated</th>
                <th className="py-3 px-4">Released</th>
                <th className="py-3 px-4">Physical vs Financial</th>
                <th className="py-3 px-4">AI Review Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y font-mono text-[11px]">
              {projects.map((p) => {
                const isDisparity = p.financialProgress > (p.physicalProgress + 15) && p.financialProgress >= 20;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-sans">
                      <div className="font-bold text-slate-900 line-clamp-1">{p.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.code} &bull; {p.district}</div>
                    </td>
                    <td className="py-3 px-4 font-sans font-bold text-navy-900">
                      ₹{(p.totalBudget / 10000000).toFixed(2)} Cr
                    </td>
                    <td className="py-3 px-4 font-sans text-royal-600 font-bold">
                      ₹{(p.allocatedFunds / 10000000).toFixed(2)} Cr
                    </td>
                    <td className="py-3 px-4 font-sans text-emerald-600 font-bold">
                      ₹{(p.releasedFunds / 10000000).toFixed(2)} Cr
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <div className="text-[10px] flex items-center gap-1 font-bold">
                        <span className="text-emerald-700">{p.physicalProgress}% Phys</span>
                        <span className="text-slate-400">/</span>
                        <span className={isDisparity ? 'text-amber-700' : 'text-royal-700'}>
                          {p.financialProgress}% Fin
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      {isDisparity || p.aiReviewStatus === 'Review Required' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Review Required
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => { setReleaseProjectId(p.id); setReleaseModalOpen(true); }}
                          className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px]"
                        >
                          Release Tranche
                        </button>
                        <Link
                          to={`/project/${p.id}`}
                          className="p-1 text-slate-400 hover:text-royal-600"
                          title="Inspect Project"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Allocate Funds */}
      {allocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-navy-900">
              Treasury Fund Allocation (Smart Contract Escrow)
            </h3>
            
            <form onSubmit={handleAllocate} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Select Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                  required
                >
                  <option value="">-- Choose Project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.title.slice(0, 36)}... (Unallocated: ₹{((p.totalBudget - p.allocatedFunds) / 100000).toFixed(1)}L)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Allocation Amount (₹)</label>
                <input
                  type="number"
                  value={allocAmount}
                  onChange={(e) => setAllocAmount(e.target.value)}
                  placeholder="e.g. 5000000"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Government Order Ref</label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. GO-MS-FIN-2026-440"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              {allocSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Allocated &amp; Sealed On-Chain!
                  </div>
                  <div className="font-mono text-[10px] text-slate-600 break-all">
                    Tx: {allocSuccess.blockchainReceipt.txHash}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAllocModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={allocating}
                  className="px-5 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-bold flex items-center gap-1.5 shadow"
                >
                  {allocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
                  Execute On-Chain Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Release Funds */}
      {releaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-navy-900">
              Release Milestone Funds to Contractor Escrow
            </h3>

            <form onSubmit={handleRelease} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Select Project</label>
                <select
                  value={releaseProjectId}
                  onChange={(e) => setReleaseProjectId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                  required
                >
                  <option value="">-- Choose Project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.title.slice(0, 36)}... (Available: ₹{((p.allocatedFunds - p.releasedFunds) / 100000).toFixed(1)}L)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Release Tranche Amount (₹)</label>
                <input
                  type="number"
                  value={releaseAmount}
                  onChange={(e) => setReleaseAmount(e.target.value)}
                  placeholder="e.g. 2500000"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  required
                />
              </div>

              {releaseSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Funds Disbursed &amp; Mined!
                  </div>
                  <div className="font-mono text-[10px] text-slate-600 break-all">
                    Tx: {releaseSuccess.blockchainReceipt.txHash}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReleaseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={releasing}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow"
                >
                  {releasing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Release Funds On-Chain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
