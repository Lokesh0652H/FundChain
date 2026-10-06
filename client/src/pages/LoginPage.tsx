import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Landmark, 
  Building2, 
  HardHat, 
  UserCheck, 
  Users, 
  ArrowRight, 
  Lock, 
  Mail,
  Loader2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  // Active portal tab: 'government' | 'department' | 'contractor' | 'auditor' | 'citizen'
  const [activePortal, setActivePortal] = useState<'government' | 'department' | 'contractor' | 'auditor' | 'citizen'>('government');

  const [email, setEmail] = useState('gov@fundchain.gov.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const portalConfigs = {
    citizen: {
      role: 'CITIZEN',
      title: 'Citizen Public Transparency Portal',
      subtitle: 'Public read-only audit of state expenditures and live blockchain transactions.',
      defaultEmail: 'citizen@fundchain.org',
      icon: Users,
      badge: 'Public Access &bull; No Login Required',
      redirectPath: '/dashboard',
      buttonText: 'Open Citizen Projects Explorer',
      themeColor: 'text-[#059669] bg-[#ECFDF5] border-[#A7F3D0]',
      btnColor: 'bg-[#0A192F] hover:bg-slate-800'
    },
    government: {
      role: 'GOVERNMENT',
      title: 'State Treasury & Finance Ministry Portal',
      subtitle: 'Authorizing state budget allocations, milestone escrow disbursements, and scheme governance.',
      defaultEmail: 'gov@fundchain.gov.in',
      icon: Landmark,
      badge: 'Treasury Officer Clearance',
      redirectPath: '/government',
      buttonText: 'Enter Government Treasury Portal',
      themeColor: 'text-royal-700 bg-blue-50 border-blue-200',
      btnColor: 'bg-royal-600 hover:bg-royal-700'
    },
    department: {
      role: 'DEPARTMENT',
      title: 'Public Works & Department Engineering Portal',
      subtitle: 'Executive engineering desk for proposing projects, assigning tenders, and approving physical milestones.',
      defaultEmail: 'dept.pwd@fundchain.gov.in',
      icon: Building2,
      badge: 'Technical Verifier Clearance',
      redirectPath: '/department',
      buttonText: 'Enter Department Works Portal',
      themeColor: 'text-cyan-800 bg-cyan-50 border-cyan-200',
      btnColor: 'bg-cyan-600 hover:bg-cyan-700'
    },
    contractor: {
      role: 'CONTRACTOR',
      title: 'Contractor & Tender Execution Portal',
      subtitle: 'Submitting geotagged milestone completion proofs, test certificates, and itemized procurement invoices.',
      defaultEmail: 'contractor.apex@fundchain.com',
      icon: HardHat,
      badge: 'Escrow Signer Clearance',
      redirectPath: '/contractor',
      buttonText: 'Enter Contractor Desk',
      themeColor: 'text-amber-800 bg-amber-50 border-amber-200',
      btnColor: 'bg-amber-600 hover:bg-amber-700'
    },
    auditor: {
      role: 'AUDITOR',
      title: 'State Auditor & Forensic AI Compliance Portal',
      subtitle: 'Inspecting statistical machine learning anomalies, physical-financial progress disparities, and hash integrity.',
      defaultEmail: 'auditor@fundchain.gov.in',
      icon: UserCheck,
      badge: 'CAG Compliance Clearance',
      redirectPath: '/auditor',
      buttonText: 'Enter Auditor & AI Desk',
      themeColor: 'text-purple-800 bg-purple-50 border-purple-200',
      btnColor: 'bg-purple-600 hover:bg-purple-700'
    }
  };

  const handlePortalSwitch = (portalKey: 'government' | 'department' | 'contractor' | 'auditor' | 'citizen') => {
    setActivePortal(portalKey);
    setEmail(portalConfigs[portalKey].defaultEmail);
    setPassword('password123');
    setError(null);
  };

  const handleInstantLogin = async () => {
    const config = portalConfigs[activePortal];
    if (activePortal === 'citizen') {
      navigate('/dashboard');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await demoLogin(config.role);
      navigate(config.redirectPath);
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const config = portalConfigs[activePortal];
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate(config.redirectPath);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials for this portal');
    } finally {
      setLoading(false);
    }
  };

  const activeConfig = portalConfigs[activePortal];
  const IconComponent = activeConfig.icon;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
          Role-Separated Governance Portals
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A192F] tracking-tight">
          Select Your Portal Access
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
          Dedicated, role-specific authentication portals with granular permissions for Citizens, Government, Departments, Contractors, and State Auditors.
        </p>
      </div>

      {/* Portal Selection Tabs (Horizontal Curved Pills) */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        <div className="bg-slate-100 p-1.5 rounded-full flex items-center gap-1">
          
          <button
            onClick={() => handlePortalSwitch('citizen')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activePortal === 'citizen'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Citizen
          </button>

          <button
            onClick={() => handlePortalSwitch('government')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activePortal === 'government'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            Government
          </button>

          <button
            onClick={() => handlePortalSwitch('department')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activePortal === 'department'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Department
          </button>

          <button
            onClick={() => handlePortalSwitch('contractor')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activePortal === 'contractor'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            Contractor
          </button>

          <button
            onClick={() => handlePortalSwitch('auditor')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activePortal === 'auditor'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Auditor
          </button>

        </div>
      </div>

      {/* Main Login Card with Curved Corners and Breathable Spacing */}
      <div className="max-w-2xl mx-auto bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 sm:p-12 space-y-8 animate-fadeIn">
        
        {/* Header of Active Portal */}
        <div className="space-y-3 border-b border-slate-100 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0A192F] text-white flex items-center justify-center shadow-sm">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0A192F]">
                  {activeConfig.title}
                </h2>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                  Secure Access Channel
                </span>
              </div>
            </div>

            <span className={`hidden sm:inline-flex px-3 py-1 rounded-full text-[11px] font-bold border ${activeConfig.themeColor}`}>
              {activeConfig.badge}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-1">
            {activeConfig.subtitle}
          </p>
        </div>

        {/* If Citizen: Direct Access Banner */}
        {activePortal === 'citizen' ? (
          <div className="space-y-6 text-center py-4">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#059669] mx-auto" />
              <h3 className="text-base font-bold text-[#0A192F]">
                Open Citizen Public Dashboard
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                As a citizen, you do not require any login or registration. You have full access to search projects, inspect financial progress, view GIS maps, and trace funds.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="w-full py-4 rounded-full bg-[#0A192F] hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <span>Explore Projects Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          /* Official Portals: Separate Login Form + 1-Click Access */
          <div className="space-y-6">
            
            {/* Quick 1-Click Instant Login */}
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-royal-800 block">
                  Examiner &amp; Evaluation 1-Click Access
                </span>
                <span className="text-[11px] text-slate-500">
                  Instant sign-in with pre-configured {activeConfig.role.toLowerCase()} credentials.
                </span>
              </div>

              <button
                type="button"
                onClick={handleInstantLogin}
                disabled={loading}
                className={`px-6 py-2.5 rounded-full text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${activeConfig.btnColor}`}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>1-Click Authenticate</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative bg-white px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">or enter credentials</span>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {error}
              </div>
            )}

            {/* Credential Form */}
            <form onSubmit={handleFormLogin} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Official Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-royal-500 font-medium text-slate-800 text-xs"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-royal-500 font-medium text-slate-800 text-xs"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 rounded-full text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${activeConfig.btnColor}`}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>{activeConfig.buttonText}</span>
                </button>
              </div>
            </form>

            <div className="text-[11px] text-slate-400 text-center">
              Default Evaluation Password for all roles: <code className="font-bold text-slate-700">password123</code>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
