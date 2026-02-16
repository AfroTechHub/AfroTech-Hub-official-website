import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { SectionId, User, ViewState } from '../types';

interface NavBarProps {
  user: User | null;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  currentView: ViewState;
}

const NavBar: React.FC<NavBarProps> = ({ user, onNavigate, onLogout, currentView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: SectionId) => {
    if (currentView !== ViewState.HOME) {
      onNavigate(ViewState.HOME);
      // Wait for route change before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Apps', id: SectionId.APPS },
    { label: 'About', id: SectionId.ABOUT },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled || currentView !== ViewState.HOME ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => onNavigate(ViewState.HOME)}
          >
            <div className={`p-2 rounded-lg transition-colors ${isScrolled || currentView !== ViewState.HOME ? 'bg-primary/10' : 'bg-white/10'}`}>
              <Globe className={`w-6 h-6 ${isScrolled || currentView !== ViewState.HOME ? 'text-primary' : 'text-primary'}`} />
            </div>
            <span className={`text-xl font-display font-bold tracking-tight ${isScrolled || currentView !== ViewState.HOME ? 'text-slate-900' : 'text-slate-900'}`}>
              AfroTech <span className="text-primary">Hub</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-semibold transition-colors relative hover:text-primary ${
                  isScrolled || currentView !== ViewState.HOME ? 'text-slate-600' : 'text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="h-6 w-px bg-slate-300 mx-2" />

            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'developer' && (
                  <button
                    onClick={() => onNavigate(ViewState.CONSOLE)}
                    className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-primary transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Console
                  </button>
                )}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                  <span className="text-sm font-medium text-slate-900">Hi, {user.name}</span>
                  <button 
                    onClick={onLogout}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                 <button 
                  onClick={() => onNavigate(ViewState.LOGIN)}
                  className={`text-sm font-bold ${isScrolled || currentView !== ViewState.HOME ? 'text-slate-700 hover:text-primary' : 'text-slate-700 hover:text-primary'}`}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onNavigate(ViewState.REGISTER)}
                  className="px-6 py-2.5 rounded-full bg-primary hover:bg-orange-700 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden p-2 text-slate-800`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl transition-all duration-300 overflow-hidden ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="block w-full text-left px-4 py-3 text-base font-semibold text-slate-700 hover:text-primary hover:bg-orange-50 rounded-lg"
            >
              {item.label}
            </button>
          ))}
          <div className="border-t border-slate-100 my-2 pt-2">
            {user ? (
              <>
                 {user.role === 'developer' && (
                  <button
                    onClick={() => { onNavigate(ViewState.CONSOLE); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-3 text-base font-semibold text-slate-700 hover:text-primary hover:bg-orange-50 rounded-lg"
                  >
                    Developer Console
                  </button>
                )}
                <button
                  onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                  className="block w-full text-left px-4 py-3 text-base font-semibold text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { onNavigate(ViewState.LOGIN); setIsMobileMenuOpen(false); }}
                  className="block w-full text-left px-4 py-3 text-base font-semibold text-slate-700 hover:text-primary hover:bg-orange-50 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { onNavigate(ViewState.REGISTER); setIsMobileMenuOpen(false); }}
                  className="block w-full text-left px-4 py-3 text-base font-semibold text-primary hover:bg-orange-50 rounded-lg"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;