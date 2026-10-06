import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Play, 
  Loader2, 
  FileCheck, 
  ExternalLink,
  Info
} from 'lucide-react';
import { Anomaly, Project } from '../types';
import { useAuth } from '../context/AuthContext';
import { HashVerificationWidget } from '../components/HashVerificationWidget';

export const AuditorDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // Resolution modal
  const [resolvingAnomaly, setResolvingAnomaly] = useState<Anomaly | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    fetchAnomalies();
  }, []);

  const fetchAnomalies = async () => {
    try {
      const res = await fetch('/api/anomalies');
      if (res.ok) {
        setAnomalies(await res.json());
      }
    } catch (err) {
      console.error('Failed to load anomalies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunBatchScan = async () => {
    setScanning(true);
    setScanResult(null);
    try {
      const res = await fetch('/api/anomalies/scan-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setScanResult(data);
        fetchAnomalies();
      } else {
        const err = await res.json();
        alert(err.error || 'Scan failed');
      }
    } catch {
      alert('Error triggering AI microservice.');
    } finally {
      setScanning(false);
    }
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingAnomaly) return;

    setResolving(true);
    try {
      const res = await fetch(`/api/anomalies/${resolvingAnomaly.id}/resolve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: resolutionNote })
      });

      if (res.ok) {
        setResolvingAnomaly(null);
        setResolutionNote('');
        fetchAnomalies();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to resolve finding');
      }
    } catch {
      alert('Network failure resolving anomaly.');
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              CAG State Audit &amp; AI Compliance Desk
            </span>
            <span className="text-xs text-slate-500">
              Automated Forensic &amp; Disparity Detection
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 mt-1">
            Auditor Oversight &amp; Anomaly Feed
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as: <strong>{user?.name || 'Vandana Shastri (Senior State Auditor, CAG)'}</strong> &bull; Isolation Forest Microservice Active
          </p>
        </div>

        {/* Scan All Trigger */}
        <button
          onClick={handleRunBatchScan}
          disabled={scanning}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-60"
        >
          {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          Run ML Batch Audit Across All 30 Projects
        </button>
      </div>

      {/* Batch Scan Alert Report */}
      {scanResult && (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              Machine Learning Scan Complete
            </span>
            <span className="font-mono text-purple-700">
              Scanned {scanResult.totalScanned} Projects &bull; Flagged: {scanResult.flaggedCount} Review Items
            </span>
          </div>
          <p className="text-xs text-purple-900/80">
            {scanResult.message} Isolation Forest baseline checked physical-financial progress convergence, disbursement velocity, and document SHA-256 validity.
          </p>
        </div>
      )}

      {/* Audit Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Total Projects Monitored
          </span>
          <div className="text-2xl font-black text-navy-900 mt-1">
            30 Projects
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            10 State Departments
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-[10px] uppercase font-bold text-amber-600 block tracking-wider">
            Items Requiring Engineering Review
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {anomalies.filter(a => a.status === 'Under Review').length} Findings
          </div>
          <span className="text-[10px] text-amber-700 mt-1 block font-medium">
            Financial progress &gt; physical progress
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-[10px] uppercase font-bold text-emerald-600 block tracking-wider">
            Resolved / Cleared Audits
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {anomalies.filter(a => a.status === 'Resolved').length} Cleared
          </div>
          <span className="text-[10px] text-emerald-600 mt-1 block font-medium">
            Verified with legitimate ground variance
          </span>
        </div>

      </div>

      {/* Compliance Mandate Alert */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-950 text-xs flex items-start gap-2.5">
        <Info className="w-5 h-5 text-royal-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">Standard Auditor Code of Conduct</span>
          <p className="text-blue-900/80 leading-relaxed text-[11px]">
            Statutory notice: AI review indicators identify statistical and scheduling disparities for administrative verification. Anomalies must never be described or presumed as conclusive proof of fraud.
          </p>
        </div>
      </div>

      {/* Anomalies List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-900">
            Active Review Queue
          </h2>
          <span className="text-xs text-slate-500">
            Sorted by detection timestamp
          </span>
        </div>

        <div className="space-y-4">
          {anomalies.map((anom) => (
            <div
              key={anom.id}
              className={`p-5 rounded-2xl border transition-all space-y-3 ${
                anom.status === 'Resolved'
                  ? 'bg-slate-50 border-slate-200 opacity-70'
                  : 'bg-amber-50/60 border-amber-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    anom.severity === 'High' ? 'bg-amber-500 text-white' : 'bg-blue-100 text-royal-800'
                  }`}>
                    {anom.severity} Priority
                  </span>
                  <span className="font-mono text-xs font-bold text-navy-900">
                    {anom.project?.code} &bull; {anom.project?.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    anom.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {anom.status}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(anom.detectedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs font-medium text-slate-800">
                {anom.description}
              </div>

              {/* Project metrics summary */}
              {anom.project && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Outlay</span>
                    <div className="font-bold text-navy-900">₹{(anom.project.totalBudget / 10000000).toFixed(2)} Cr</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Disbursed Funds</span>
                    <div className="font-bold text-royal-600">{anom.project.financialProgress}%</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Physical Progress</span>
                    <div className="font-bold text-emerald-600">{anom.project.physicalProgress}%</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">ML Confidence</span>
                    <div className="font-bold text-purple-600">{(anom.confidenceScore * 100).toFixed(0)}%</div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <Link
                  to={`/project/${anom.projectId}`}
                  className="text-xs font-bold text-royal-600 hover:underline flex items-center gap-1"
                >
                  Inspect Full Audit Trail &amp; Invoices <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                {anom.status === 'Under Review' && (
                  <button
                    onClick={() => {
                      setResolvingAnomaly(anom);
                      setResolutionNote('Site visit and material purchase bills physically verified.');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Clear / Resolve Finding
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document SHA-256 Verification Section */}
      <section>
        <HashVerificationWidget />
      </section>

      {/* Modal: Resolve Anomaly */}
      {resolvingAnomaly && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-navy-900">
              Resolve Audit Finding
            </h3>
            <p className="text-xs text-slate-500">
              Record verified ground explanation for {resolvingAnomaly.project?.code}.
            </p>

            <form onSubmit={handleResolve} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Auditor Resolution Notes
                </label>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="e.g. Bulk material mobilization advance cleared; verified concrete test reports match schedule..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 h-24"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResolvingAnomaly(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resolving}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow"
                >
                  {resolving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                  Mark Verified &amp; Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
