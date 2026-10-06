import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Layers, 
  TrendingUp, 
  Building2, 
  ShieldCheck, 
  MapPin, 
  X, 
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { Project, Department } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { FollowTheMoney, FollowTheMoneyStep } from '../components/FollowTheMoney';
import { fallbackProjects, fallbackDepartments } from '../data/mockData';

export const CitizenDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [departments, setDepartments] = useState<Department[]>(fallbackDepartments);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [budgetRange, setBudgetRange] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');

  // Follow the money modal state
  const [followProject, setFollowProject] = useState<Project | null>(null);
  const [followSteps, setFollowSteps] = useState<FollowTheMoneyStep[] | null>(null);
  const [loadingSteps, setLoadingSteps] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [projRes, deptRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/departments')
      ]);

      if (projRes.ok) {
        const p = await projRes.json();
        if (p && p.length > 0) setProjects(p);
      }
      if (deptRes.ok) {
        const d = await deptRes.json();
        if (d && d.length > 0) setDepartments(d);
      }
    } catch (err) {
      console.warn('API cold-start or offline, using verified dataset:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFollowTheMoney = async (project: Project) => {
    setFollowProject(project);
    setLoadingSteps(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/follow-the-money`);
      if (res.ok) {
        const data = await res.json();
        setFollowSteps(data.steps);
      }
    } catch {
      // fallback
    } finally {
      setLoadingSteps(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedDept('All');
    setSelectedSector('All');
    setSelectedStatus('All');
    setSelectedDistrict('All');
    setBudgetRange('All');
  };

  // Filter projects client-side for ultra-fast, smooth responsiveness
  const filteredProjects = projects.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCode = p.code.toLowerCase().includes(q);
      const matchDist = p.district.toLowerCase().includes(q);
      const matchAddr = p.locationAddress.toLowerCase().includes(q);
      const matchDept = p.department?.name.toLowerCase().includes(q);
      const matchCont = p.contractor?.name.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchDist && !matchAddr && !matchDept && !matchCont) {
        return false;
      }
    }

    if (selectedDept !== 'All' && p.departmentId !== selectedDept) return false;
    if (selectedSector !== 'All' && p.sector !== selectedSector) return false;
    if (selectedStatus !== 'All') {
      if (selectedStatus === 'Ongoing' && p.status !== 'Active') return false;
      if (selectedStatus !== 'Ongoing' && p.status !== selectedStatus) return false;
    }
    if (selectedDistrict !== 'All' && p.district !== selectedDistrict) return false;

    if (budgetRange === 'Low' && p.totalBudget >= 20000000) return false;
    if (budgetRange === 'Medium' && (p.totalBudget < 20000000 || p.totalBudget > 50000000)) return false;
    if (budgetRange === 'High' && p.totalBudget <= 50000000) return false;

    return true;
  });

  const districts = ['All', ...new Set(projects.map((p) => p.district))];
  const sectors = ['All', 'Roads', 'Schools', 'Hospitals', 'Water', 'Infrastructure'];
  const statuses = ['All', 'Active', 'Completed', 'Delayed'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-royal-600 bg-royal-50 px-2.5 py-1 rounded-full border border-royal-200">
              Public Citizen Dashboard
            </span>
            <span className="text-xs font-medium text-slate-500">
              No Registration or Login Required
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 mt-1">
            Citizen Fund &amp; Infrastructure Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time public audit of government schemes, contractor tranches, and physical milestones.
          </p>
        </div>

        {/* Quick count chips */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-medium">
            Showing <strong className="text-navy-900">{filteredProjects.length}</strong> of {projects.length} Projects
          </div>
          <button
            onClick={resetFilters}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, project code (e.g. FC-2026), contractor, location, or department..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-royal-500 text-xs text-slate-900"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          
          {/* Department Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-royal-500"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} - {d.name.slice(0, 24)}...
                </option>
              ))}
            </select>
          </div>

          {/* Sector Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Sector
            </label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-royal-500"
            >
              {sectors.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Project Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-royal-500"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              District / Region
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-royal-500"
            >
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Budget Range Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Sanctioned Outlay
            </label>
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value as any)}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-royal-500"
            >
              <option value="All">All Budgets</option>
              <option value="Low">&lt; ₹2.0 Crores</option>
              <option value="Medium">₹2.0 - ₹5.0 Crores</option>
              <option value="High">&gt; ₹5.0 Crores</option>
            </select>
          </div>

        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-navy-900">No matching projects found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search query or selecting 'All' across filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg bg-royal-600 text-white font-bold text-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onOpenFollowTheMoney={handleOpenFollowTheMoney}
            />
          ))}
        </div>
      )}

      {/* "Follow the Money" Modal */}
      {followProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative p-6 lg:p-8">
            <button
              onClick={() => { setFollowProject(null); setFollowSteps(null); }}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {loadingSteps ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-royal-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">
                  Loading cryptographic audit path for {followProject.code}...
                </p>
              </div>
            ) : (
              <FollowTheMoney
                steps={followSteps || undefined}
                projectTitle={followProject.title}
                projectCode={followProject.code}
              />
            )}
          </div>
        </div>
      )}

    </div>
  );
};
