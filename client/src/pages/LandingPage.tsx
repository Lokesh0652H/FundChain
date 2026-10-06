import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Building2,
  FolderKanban,
  HardHat,
  Cpu,
  Users,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Project, SystemOverview } from '../types';
import { FollowTheMoney } from '../components/FollowTheMoney';
import { GISMap } from '../components/GISMap';
import { HashVerificationWidget } from '../components/HashVerificationWidget';

export const LandingPage: React.FC = () => {
  const [stats, setStats] = useState<SystemOverview | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, projRes] = await Promise.all([
          fetch('/api/stats/overview'),
          fetch('/api/projects')
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (projRes.ok) {
          const p = await projRes.json();
          setProjects(p);
          if (p.length > 0) setSelectedProject(p[0]);
        }
      } catch (err) {
        console.error('Error fetching landing data:', err);
      }
    };
    fetchData();
  }, []);

  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="space-y-24 pb-20">
      
      {/* Exact Hero Section from Template */}
      <section className="pt-10 sm:pt-16 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Subtitle, CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill: Built for people, powered by proof */}
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                Built for people, powered by proof
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-[#0A192F]">
              Track every rupee. <br />
              <span className="text-[#0284C7]">Verify every record.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
              FundChain makes public project funding simple to understand, easy to explore, and impossible to hide.
            </p>

            {/* CTAs */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/dashboard"
                  className="px-7 py-3.5 rounded-full bg-[#0A192F] hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 group"
                >
                  <span>Explore projects</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/verify"
                  className="px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs shadow-sm transition-all flex items-center gap-2"
                >
                  <span>View transparency dashboard</span>
                </Link>
              </div>

              {/* Verified on blockchain line */}
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium pt-2">
                <ShieldCheck className="w-4 h-4 text-[#059669]" />
                <span>Verified on blockchain &bull; Updated daily</span>
              </div>
            </div>

          </div>

          {/* Right Column: Exact White Follow the Money Card from Template */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-lg bg-white rounded-[32px] p-7 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 space-y-6 relative">
              
              {/* Header: FOLLOW THE MONEY + 78% on track */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  FOLLOW THE MONEY
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                  78% on track
                </span>
              </div>

              {/* Title & Location */}
              <div>
                <h3 className="text-2xl font-black text-[#0A192F]">
                  Kaveri River Bridge
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mysuru, Karnataka</span>
                </div>
              </div>

              {/* 5 Progression Steps with Progress Lines */}
              <div className="space-y-4 pt-1">
                
                {/* 1. Government Fund */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect width="18" height="14" x="3" y="5" rx="2" />
                          <path d="m3 7 9 6 9-6" />
                        </svg>
                      </div>
                      <span className="font-bold text-slate-800 text-xs">Government Fund</span>
                    </div>
                    <span className="font-bold text-slate-500 font-mono text-xs">₹48.6 Cr</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-[#0284C7] rounded-full w-full" />
                  </div>
                </div>

                {/* 2. Department */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect width="18" height="14" x="3" y="5" rx="2" />
                          <path d="m3 7 9 6 9-6" />
                        </svg>
                      </div>
                      <span className="font-bold text-slate-800 text-xs">Department</span>
                    </div>
                    <span className="font-bold text-slate-500 text-xs">PWD</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-[#0284C7] rounded-full w-full" />
                  </div>
                </div>

                {/* 3. Project */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect width="18" height="14" x="3" y="5" rx="2" />
                          <path d="m3 7 9 6 9-6" />
                        </svg>
                      </div>
                      <span className="font-bold text-slate-800 text-xs">Project</span>
                    </div>
                    <span className="font-bold text-slate-500 text-xs">Active</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-[#0284C7] rounded-full w-full" />
                  </div>
                </div>

                {/* 4. Contractor */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect width="18" height="14" x="3" y="5" rx="2" />
                          <path d="m3 7 9 6 9-6" />
                        </svg>
                      </div>
                      <span className="font-bold text-slate-800 text-xs">Contractor</span>
                    </div>
                    <span className="font-bold text-slate-500 text-xs">Shapoorji</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-[#0284C7] rounded-full w-full" />
                  </div>
                </div>

                {/* 5. Milestone */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                      </div>
                      <span className="font-bold text-slate-800 text-xs">Milestone</span>
                    </div>
                    <span className="font-bold text-[#059669] text-xs">Verified</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-[#059669] rounded-full w-full" />
                  </div>
                </div>

              </div>

              {/* Bottom Verification Footer */}
              <div className="rounded-full bg-[#F0FDF4] border border-[#DCFCE7] px-4 py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#059669] font-medium text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Last verified 2 min ago</span>
                </div>
                <span className="font-mono text-slate-400 text-[11px]">
                  0x7f...a92c
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4 KPI Stats Cards matching template */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-[28px] p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-2">
            <div className="text-4xl font-black text-[#0A192F] tracking-tight">
              ₹186 Cr
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Funds tracked
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[28px] p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-2">
            <div className="text-4xl font-black text-[#0A192F] tracking-tight">
              248
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Active projects
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-[28px] p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-2">
            <div className="text-4xl font-black text-[#0A192F] tracking-tight">
              96%
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Records verified
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-[28px] p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-2">
            <div className="text-4xl font-black text-[#0A192F] tracking-tight">
              72%
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Average progress
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-28">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284C7] block">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
            From sanction to verification in five steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:shadow-md transition-all flex flex-col justify-between h-56">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#0A192F] text-white flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-3xl font-black text-slate-100 select-none">1</span>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-sm text-[#0A192F]">Government sanctions</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Budgets are allocated to departments and sealed on the ledger.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:shadow-md transition-all flex flex-col justify-between h-56">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#0A192F] text-white flex items-center justify-center">
                <FolderKanban className="w-5 h-5" />
              </div>
              <span className="text-3xl font-black text-slate-100 select-none">2</span>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-sm text-[#0A192F]">Department plans</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Projects and milestones are created with clear amounts.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:shadow-md transition-all flex flex-col justify-between h-56">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#0A192F] text-white flex items-center justify-center">
                <HardHat className="w-5 h-5" />
              </div>
              <span className="text-3xl font-black text-slate-100 select-none">3</span>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-sm text-[#0A192F]">Contractor delivers</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Work is submitted with evidence; funds release on approval.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:shadow-md transition-all flex flex-col justify-between h-56">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shadow-sm">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-3xl font-black text-slate-100 select-none">4</span>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-sm text-[#0A192F]">Sealed on chain</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Each event is hashed and linked to the previous block.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:shadow-md transition-all flex flex-col justify-between h-56">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#0A192F] text-white flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-3xl font-black text-slate-100 select-none">5</span>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-sm text-[#0A192F]">Citizens verify</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anyone can trace the money and verify any record.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* FOLLOW THE MONEY Component Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FollowTheMoney
          projects={projects}
          selectedProject={selectedProject || undefined}
          onSelectProject={(p) => setSelectedProject(p)}
        />
      </section>

      {/* FEATURED: Projects in Motion */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284C7] block">
              FEATURED
            </span>
            <h2 className="text-3xl font-extrabold text-[#0A192F] tracking-tight mt-1">
              Projects in motion
            </h2>
          </div>

          <Link
            to="/dashboard"
            className="text-xs font-bold text-[#0284C7] hover:text-royal-800 flex items-center gap-1 transition-colors"
          >
            <span>All projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Projects in Motion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((p) => (
            <Link
              key={p.id}
              to={`/project/${p.id}`}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <Building2 className="w-5 h-5 text-slate-600" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-royal-700 border border-blue-200">
                    ● Ongoing
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-[#0A192F] group-hover:text-royal-600 transition-colors line-clamp-1">
                    {p.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{p.locationAddress}, {p.district}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-[#0A192F]">
                  ₹{(p.totalBudget / 10000000).toFixed(2)} Cr
                </span>
                <span className="font-bold text-emerald-600">
                  {p.physicalProgress}% Progress
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* GIS Map Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284C7] block">
              GEOSPATIAL INTELLIGENCE
            </span>
            <h2 className="text-3xl font-extrabold text-[#0A192F] tracking-tight mt-1">
              Geotagged Infrastructure Map
            </h2>
          </div>
          <Link
            to="/gis"
            className="text-xs font-bold text-[#0284C7] hover:text-royal-800 flex items-center gap-1"
          >
            <span>Full-Screen GIS Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-[32px] overflow-hidden border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <GISMap projects={projects} height="460px" />
        </div>
      </section>

      {/* Document SHA-256 Hash Verification Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[32px] overflow-hidden">
          <HashVerificationWidget />
        </div>
      </section>

    </div>
  );
};
