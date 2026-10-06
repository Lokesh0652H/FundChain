import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HardHat, 
  Upload, 
  Receipt, 
  CheckCircle2, 
  ShieldCheck, 
  Coins, 
  FileText,
  Clock,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { Project, Milestone } from '../types';
import { useAuth } from '../context/AuthContext';

export const ContractorDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Evidence Submission Modal
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState('');
  const [evidenceDescription, setEvidenceDescription] = useState('');
  const [submittingEvidence, setSubmittingEvidence] = useState(false);
  const [evidenceResult, setEvidenceResult] = useState<any>(null);

  // Expense Invoice Submission Modal
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expenseProjectId, setExpenseProjectId] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Material');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [recordingExpense, setRecordingExpense] = useState(false);
  const [expenseResult, setExpenseResult] = useState<any>(null);

  useEffect(() => {
    fetchContractorProjects();
  }, []);

  const fetchContractorProjects = async () => {
    try {
      const res = await fetch('/api/contractors/my-projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setProjects(await res.json());
      }
    } catch (err) {
      console.error('Failed to load contractor projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestoneId || !evidenceDescription) return;

    setSubmittingEvidence(true);
    setEvidenceResult(null);
    try {
      const res = await fetch(`/api/milestones/${selectedMilestoneId}/submit-evidence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          evidenceDescription,
          fileName: 'site_completion_inspection_report.pdf'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setEvidenceResult(data);
        fetchContractorProjects();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to submit evidence');
      }
    } catch {
      alert('Network failure submitting evidence.');
    } finally {
      setSubmittingEvidence(false);
    }
  };

  const handleRecordExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseProjectId || !vendorName || !amount) return;

    setRecordingExpense(true);
    setExpenseResult(null);
    try {
      const res = await fetch('/api/funds/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: expenseProjectId,
          vendorName,
          amount: parseFloat(amount),
          category,
          invoiceNumber: invoiceNumber || `INV-TENDER-${Date.now().toString().slice(-4)}`
        })
      });

      if (res.ok) {
        const data = await res.json();
        setExpenseResult(data);
        setVendorName('');
        setAmount('');
        setInvoiceNumber('');
        fetchContractorProjects();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to record expense');
      }
    } catch {
      alert('Network failure recording expense.');
    } finally {
      setRecordingExpense(false);
    }
  };

  // Flatten milestones across projects
  const allMilestones: (Milestone & { projectTitle: string; projectCode: string })[] = [];
  projects.forEach((p) => {
    p.milestones?.forEach((m) => {
      allMilestones.push({
        ...m,
        projectTitle: p.title,
        projectCode: p.code
      });
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Contractor Execution Desk
            </span>
            <span className="text-xs text-slate-500">
              Apex Infra Projects Pvt Ltd &bull; Escrow Bound
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 mt-1">
            Contractor Works &amp; Evidence Submission
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as: <strong>{user?.name || 'Sanjay Deshmukh (Managing Director, Apex Infra)'}</strong> &bull; Wallet: 0x3C44...93BC
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setEvidenceModalOpen(true); setEvidenceResult(null); }}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            Submit Milestone Proof
          </button>
          <button
            onClick={() => { setExpenseModalOpen(true); setExpenseResult(null); }}
            className="px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-royal-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Receipt className="w-4 h-4" />
            Record Invoice Expense
          </button>
        </div>
      </div>

      {/* Contractor KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Assigned Contracts
          </span>
          <div className="text-2xl font-black text-navy-900 mt-1">
            {projects.length} Works
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Government Escrow Backed
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-[10px] uppercase font-bold text-emerald-600 block tracking-wider">
            Total Payments Received
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ₹{(projects.reduce((acc, p) => acc + p.releasedFunds, 0) / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[10px] text-emerald-600 mt-1 block font-medium">
            Mined directly to escrow wallet
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-[10px] uppercase font-bold text-royal-600 block tracking-wider">
            Contractor Performance Rating
          </span>
          <div className="text-2xl font-black text-royal-600 mt-1">
            4.8 / 5.0
          </div>
          <span className="text-[10px] text-royal-600 mt-1 block font-medium">
            Class A Heavy Civil License
          </span>
        </div>
      </div>

      {/* Assigned Projects */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-4">
        <h2 className="text-lg font-bold text-navy-900">
          Assigned Projects &amp; Milestone Tracking
        </h2>

        <div className="space-y-6">
          {projects.map((p) => (
            <div key={p.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-royal-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {p.code}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{p.sector}</span>
                  </div>
                  <h3 className="font-bold text-base text-navy-900 mt-1">{p.title}</h3>
                  <span className="text-xs text-slate-500">{p.locationAddress}, {p.district}</span>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-navy-900">
                    ₹{(p.totalBudget / 10000000).toFixed(2)} Cr Contract
                  </div>
                  <div className="text-xs font-bold text-emerald-600">
                    ₹{(p.releasedFunds / 10000000).toFixed(2)} Cr Disbursed
                  </div>
                </div>
              </div>

              {/* Milestones list for this project */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                  Contract Milestones:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {p.milestones?.map((m) => (
                    <div key={m.id} className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5">
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
                      <div className="font-bold text-navy-900">₹{(m.targetAmount / 100000).toFixed(1)} Lakhs</div>

                      {m.status === 'Pending' && (
                        <button
                          onClick={() => {
                            setSelectedMilestoneId(m.id);
                            setEvidenceModalOpen(true);
                            setEvidenceResult(null);
                          }}
                          className="w-full mt-2 py-1 px-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] flex items-center justify-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          Submit Evidence
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

      {/* Modal: Submit Milestone Evidence */}
      {evidenceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-navy-900">
              Submit Geotagged Milestone Completion Proof
            </h3>
            <p className="text-xs text-slate-500">
              Generates a cryptographic SHA-256 seal and registers completion on the FundChain ledger.
            </p>

            <form onSubmit={handleSubmitEvidence} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Select Milestone</label>
                <select
                  value={selectedMilestoneId}
                  onChange={(e) => setSelectedMilestoneId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                  required
                >
                  <option value="">-- Choose Milestone --</option>
                  {allMilestones.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.projectCode} &bull; Phase {m.sequence}: {m.title} ({m.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Completion Description &amp; Test Certificates</label>
                <textarea
                  value={evidenceDescription}
                  onChange={(e) => setEvidenceDescription(e.target.value)}
                  placeholder="Detail completion metrics, concrete core tests, quality surveyor signoffs..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 h-24"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                <FileText className="w-4 h-4 text-royal-600" />
                <span>Simulated File: <strong>site_completion_inspection_report.pdf</strong> (Will compute SHA-256)</span>
              </div>

              {evidenceResult && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Evidence Registered on Smart Contract!
                  </div>
                  <div className="font-mono text-[10px] text-slate-600 break-all">
                    Evidence Hash: {evidenceResult.evidenceHash}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEvidenceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={submittingEvidence}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1.5 shadow"
                >
                  {submittingEvidence ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Submit to Smart Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Invoice Expense */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-navy-900">
              Record Procurement Invoice (SHA-256 Hashed)
            </h3>

            <form onSubmit={handleRecordExpense} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Select Project</label>
                <select
                  value={expenseProjectId}
                  onChange={(e) => setExpenseProjectId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                  required
                >
                  <option value="">-- Choose Project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Vendor / Beneficiary Name</label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="e.g. UltraTech Cement Direct Ltd"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Invoice Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 1500000"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  >
                    <option value="Material">Material</option>
                    <option value="Labor">Labor</option>
                    <option value="Machinery">Machinery</option>
                    <option value="Inspection">Inspection</option>
                    <option value="Subcontract">Subcontract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="e.g. INV-2026-APEX-889"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              {expenseResult && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Invoice Recorded On-Chain!
                  </div>
                  <div className="font-mono text-[10px] text-slate-600 break-all">
                    Tx: {expenseResult.blockchainReceipt.txHash}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={recordingExpense}
                  className="px-5 py-2 rounded-xl bg-navy-900 hover:bg-royal-600 text-white font-bold flex items-center gap-1.5 shadow"
                >
                  {recordingExpense ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />}
                  Register Invoice On-Chain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
