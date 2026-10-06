import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  FolderKanban, 
  CheckCircle2, 
  HardHat, 
  ExternalLink,
  ShieldCheck,
  Send,
  Loader2,
  FileCheck
} from 'lucide-react';
import { Project, Contractor } from '../types';
import { useAuth } from '../context/AuthContext';

export const DepartmentDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);

  // New Project Form
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sector, setSector] = useState('Roads');
  const [totalBudget, setTotalBudget] = useState('');
  const [contractorId, setContractorId] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [district, setDistrict] = useState('Bengaluru Urban');
  const [lat, setLat] = useState('12.9716');
  const [lng, setLng] = useState('77.5946');
  const [creating, setCreating] = useState(false);
  const [createdSuccess, setCreatedSuccess] = useState<any>(null);

  // Milestone Approval Action
  const [approvingMilestoneId, setApprovingMilestoneId] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartmentProjects();
  }, []);

  const fetchDepartmentProjects = async () => {
    try {
      const [projRes, contRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/contractors')
      ]);

      if (projRes.ok) {
        const p = await projRes.json();
        // If user is from PWD, filter to PWD projects or show all
        setProjects(p);
      }
      if (contRes.ok) {
        setContractors(await contRes.json());
      }
    } catch (err) {
      console.error('Failed to load dept projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !totalBudget) return;

    setCreating(true);
    setCreatedSuccess(null);
    try {
      // Find user department ID or default to PWD
      const deptId = user?.departmentId || (projects[0]?.departmentId || '1');

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          departmentId: deptId,
          contractorId: contractorId || null,
          totalBudget: parseFloat(totalBudget),
          sector,
          locationAddress,
          district,
          locationLat: parseFloat(lat),
          locationLng: parseFloat(lng)
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCreatedSuccess(data);
        setTitle('');
        setDescription('');
        setTotalBudget('');
        fetchDepartmentProjects();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create project');
      }
    } catch {
      alert('Network failure creating project.');
    } finally {
      setCreating(false);
    }
  };

  const handleApproveMilestone = async (milestoneId: string) => {
    setApprovingMilestoneId(milestoneId);
    try {
      const res = await fetch(`/api/milestones/${milestoneId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Milestone Approved! On-Chain Tx: ${data.blockchainReceipt.txHash}`);
        fetchDepartmentProjects();
      } else {
        const err = await res.json();
        alert(err.error || 'Approval failed');
      }
    } catch {
      alert('Error connecting to blockchain node.');
    } finally {
      setApprovingMilestoneId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
              Department Portal
            </span>
            <span className="text-xs text-slate-500">
              Public Works Department (State Highways &amp; Bridges)
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 mt-1">
            Department Works &amp; Milestone Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as: <strong>{user?.name || 'Er. Rajeshwar Rao (Chief Engineer, PWD)'}</strong> &bull; Authorized Technical Verifier
          </p>
        </div>

        <button
          onClick={() => { setCreateModalOpen(true); setCreatedSuccess(null); }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-royal-600 to-cyan-600 hover:from-royal-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Propose New Project
        </button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Total Projects in Charge
          </span>
          <div className="text-2xl font-black text-navy-900 mt-1">
            {projects.length} Works
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Roads, Bridges &amp; Expressways
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-[10px] uppercase font-bold text-royal-600 block tracking-wider">
            Allocated Department Budget
          </span>
          <div className="text-2xl font-black text-royal-600 mt-1">
            ₹{(projects.reduce((acc, p) => acc + p.allocatedFunds, 0) / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[10px] text-royal-600 mt-1 block font-medium">
            Active Works Escrow
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-[10px] uppercase font-bold text-emerald-600 block tracking-wider">
            Milestones Verified On-Chain
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            48 / 64 Completed
          </div>
          <span className="text-[10px] text-emerald-600 mt-1 block font-medium">
            Physical Inspection Signoffs
          </span>
        </div>
      </div>

      {/* Projects List with Milestone Management */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-6">
        <h2 className="text-lg font-bold text-navy-900">
          Supervised Infrastructure Projects
        </h2>

        <div className="space-y-6">
          {projects.slice(0, 8).map((p) => (
            <div key={p.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-royal-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {p.code}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{p.sector}</span>
                  </div>
                  <h3 className="font-bold text-base text-navy-900 mt-1">
                    {p.title}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Contractor: <strong>{p.contractor?.name || 'Assigned Tenderer'}</strong> &bull; {p.locationAddress}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-navy-900">
                    ₹{(p.totalBudget / 10000000).toFixed(2)} Cr Outlay
                  </div>
                  <div className="text-xs font-bold text-emerald-600">
                    {p.physicalProgress}% Physical Progress
                  </div>
                </div>
              </div>

              {/* Milestones Inspection Bar */}
              <div className="pt-2 border-t border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                  Milestone Inspection Queue:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {p.milestones?.map((m) => (
                    <div key={m.id} className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">Phase {m.sequence}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          m.status === 'FundsReleased' ? 'bg-emerald-100 text-emerald-800' :
                          m.status === 'Approved' ? 'bg-blue-100 text-royal-800' :
                          m.status === 'Submitted' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 truncate">{m.title}</div>
                      
                      {m.status === 'Submitted' && (
                        <button
                          onClick={() => handleApproveMilestone(m.id)}
                          disabled={approvingMilestoneId === m.id}
                          className="w-full mt-2 py-1 px-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center gap-1"
                        >
                          {approvingMilestoneId === m.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileCheck className="w-3 h-3" />}
                          Verify &amp; Approve Milestone
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Modal: Create Project Wizard */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 my-8">
            <h3 className="text-xl font-black text-navy-900">
              Propose New Infrastructure Work (Smart Contract Bound)
            </h3>
            <p className="text-xs text-slate-500">
              Submitting this creates an immutable on-chain project ledger entry with escrow terms.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Project Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ring Road Phase-III Elevated Viaduct"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Scope &amp; Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe technical engineering deliverables..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 h-20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Sector</label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                  >
                    <option value="Roads">Roads &amp; Highways</option>
                    <option value="Schools">Schools &amp; Higher Education</option>
                    <option value="Hospitals">Hospitals &amp; Healthcare</option>
                    <option value="Water">Water Supply &amp; Drainage</option>
                    <option value="Infrastructure">Infrastructure &amp; Smart City</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Sanctioned Outlay (₹)</label>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    placeholder="e.g. 35000000"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Awarded Contractor</label>
                  <select
                    value={contractorId}
                    onChange={(e) => setContractorId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                  >
                    <option value="">-- Direct Department Works --</option>
                    {contractors.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (Rating: {c.rating})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Bengaluru Urban"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Site Location Address</label>
                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  placeholder="e.g. SH-87 Corridor, Bannerghatta Section"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">GPS Latitude</label>
                  <input
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">GPS Longitude</label>
                  <input
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              {createdSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Project Created on Immutable Ledger!
                  </div>
                  <div className="font-mono text-[10px] text-slate-600 break-all">
                    Tx: {createdSuccess.blockchainReceipt.txHash}
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-royal-600 to-cyan-600 hover:from-royal-500 hover:to-cyan-500 text-white font-bold flex items-center gap-2 shadow"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Register Project On-Chain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
