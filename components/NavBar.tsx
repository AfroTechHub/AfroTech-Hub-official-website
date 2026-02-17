import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Globe, User as UserIcon, LogOut, LayoutDashboard, ChevronDown, Sparkles } from 'lucide-react';
import { SectionId, User, ViewState } from '../types';
import { storageService } from '../services/storage';

interface NavBarProps {
  user: User | null;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
  currentView: ViewState;
}

const NavBar: React.FC<NavBarProps> = ({ user, onNavigate, onLogout, onUserUpdate, currentView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (id: string, isView: boolean = false) => {
    if (isView) {
      if (id === SectionId.ABOUT) {
        onNavigate(ViewState.ABOUT);
      }
    } else {
      if (currentView !== ViewState.HOME) {
        onNavigate(ViewState.HOME);
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleUpgrade = () => {
    if (user) {
      const updatedUser: User = { ...user, role: 'developer' };
      storageService.updateUser(updatedUser);
      onUserUpdate(updatedUser);
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
      onNavigate(ViewState.CONSOLE);
    }
  };

  const navItems = [
    { label: 'Apps', id: SectionId.APPS, isView: false },
    { label: 'About', id: SectionId.ABOUT, isView: true },
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
                onClick={() => handleNavClick(item.id, item.isView)}
                className={`text-sm font-semibold transition-colors relative hover:text-primary ${
                  isScrolled || currentView !== ViewState.HOME ? 'text-slate-600' : 'text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="h-6 w-px bg-slate-300 mx-2" />

            {user ? (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                   <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                     {user.name.charAt(0).toUpperCase()}
                   </div>
                   <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">{user.name}</span>
                   <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fade-in-up origin-top-right">
                    <div className="px-4 py-3 border-b border-slate-100 mb-2">
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    
                    {user.role === 'developer' ? (
                      <button
                        onClick={() => {
                          onNavigate(ViewState.CONSOLE);
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Developer Console
                      </button>
                    ) : (
                      <button
                        onClick={handleUpgrade}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary flex items-center gap-2 group"
                      >
                        <Sparkles className="w-4 h-4 text-accent group-hover:text-primary" /> Become a Developer
                      </button>
                    )}
                    
                    <div className="my-2 border-t border-slate-100" />
                    
                    <button
                      onClick={() => {
                        onLogout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
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
              onClick={() => handleNavClick(item.id, item.isView)}
              className="block w-full text-left px-4 py-3 text-base font-semibold text-slate-700 hover:text-primary hover:bg-orange-50 rounded-lg"
            >
              {item.label}
            </button>
          ))}
          <div className="border-t border-slate-100 my-2 pt-2">
            {user ? (
              <>
                <div className="px-4 py-2 mb-2">
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                 {user.role === 'developer' ? (
                  <button
                    onClick={() => { onNavigate(ViewState.CONSOLE); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-3 text-base font-semibold text-slate-700 hover:text-primary hover:bg-orange-50 rounded-lg flex items-center gap-2"
                  >
                     <LayoutDashboard className="w-4 h-4" /> Developer Console
                  </button>
                ) : (
                  <button
                    onClick={handleUpgrade}
                    className="block w-full text-left px-4 py-3 text-base font-semibold text-slate-700 hover:text-primary hover:bg-orange-50 rounded-lg flex items-center gap-2"
                  >
                     <Sparkles className="w-4 h-4 text-accent" /> Upgrade to Developer
                  </button>
                )}
                <button
                  onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                  className="block w-full text-left px-4 py-3 text-base font-semibold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
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