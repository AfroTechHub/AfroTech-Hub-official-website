import React, { useState } from 'react';
import { User, Mail, Lock, CheckCircle, Briefcase, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { storageService } from '../services/storage';
import { User as UserType, ViewState } from '../types';

interface RegisterProps {
  onLogin: (user: UserType) => void;
  onNavigate: (view: ViewState) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const newUser = await storageService.register(name, email, password);
      onLogin(newUser);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already in use.');
      } else {
        setError(err.message || 'Registration failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 animate-fade-in-up">
       {/* Back Navigation */}
       <button 
        onClick={() => onNavigate(ViewState.HOME)}
        className="absolute top-8 left-8 p-2 rounded-full bg-white text-slate-600 hover:text-primary hover:shadow-md transition-all border border-slate-100 hidden md:block"
        title="Back to Home"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 relative">
        <button 
           onClick={() => onNavigate(ViewState.HOME)}
           className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-700 md:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-slate-900">Create Account</h2>
          <p className="text-slate-600 mt-2">Join the AfroTech Hub community</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="password" 
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1 ml-1">Must be at least 6 characters</p>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
             {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <button 
            onClick={() => onNavigate(ViewState.LOGIN)}
            className="text-primary font-bold hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;