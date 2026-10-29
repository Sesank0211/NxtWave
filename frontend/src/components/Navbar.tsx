import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleRegisterClick = () => {
    setMobileMenuOpen(false);
    navigate('/register');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* ProjectZero Logo */}
        <button
          onClick={() => handleNavClick('top')}
          className="flex items-center gap-2.5 focus:outline-none group text-left cursor-pointer"
        >
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Project<span className="text-blue-600">Zero</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-500 border border-slate-200 rounded px-1.5 py-0.5">
              Growth Engine
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNavClick('top')}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('about-workshop')}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            About Workshop
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Admin</span>
          </button>
        </div>

        {/* Desktop Register Button */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={handleRegisterClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/30 transition-all duration-200 cursor-pointer"
          >
            <span>Register</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => handleNavClick('top')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('about-workshop')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
          >
            About Workshop
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/admin');
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            Admin Dashboard
          </button>
          <div className="pt-2">
            <button
              onClick={handleRegisterClick}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
            >
              <span>Register for Workshop</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
