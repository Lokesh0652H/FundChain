import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  Menu, 
  X,
  LogOut,
  ChevronDown,
  User,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, role, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Explore projects', path: '/dashboard' },
    { label: 'How it works', path: '/#how-it-works' },
    { label: 'Transparency', path: '/verify' },
  ];

  const handleNavClick = (path: string) => {
    if (path.startsWith('/#')) {
      const el = document.getElementById(path.substring(2));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          document.getElementById(path.substring(2))?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      navigate(path);
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 text-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand matching template */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-[#0D9488] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="14" x="3" y="5" rx="3" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#0A192F] block leading-none font-sans">
                FundChain
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1 block">
                PUBLIC TRUST, VERIFIED
              </span>
            </div>
          </Link>

          {/* Desktop Center Links */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.path)}
                  className={`text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-[#0284C7]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Right Action: For Government / Portal Button */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated && role !== 'CITIZEN' ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 shadow-sm transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{role} Portal</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-3xl shadow-xl py-2 z-50 text-xs animate-fadeIn">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Logged In As</span>
                      <span className="font-bold text-slate-900 block truncate">{user?.name}</span>
                    </div>

                    <Link
                      to={`/${role.toLowerCase()}`}
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 font-semibold text-slate-700 block"
                    >
                      Open {role.charAt(0) + role.slice(1).toLowerCase()} Desk
                    </Link>

                    <Link
                      to="/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 font-semibold text-slate-700 block"
                    >
                      Switch Portal Login
                    </Link>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => { logout(); setUserDropdownOpen(false); navigate('/'); }}
                        className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-[#0A192F] text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 group"
              >
                <span>For government</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.path)}
                className="text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-royal-600 hover:bg-blue-50 flex items-center justify-between"
            >
              <span>For government portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
