import React, { useState } from 'react';
import { User, Mail, Lock, CheckCircle, Briefcase } from 'lucide-react';
import { storageService } from '../services/storage';
import { User as UserType, ViewState } from '../types';

interface RegisterProps {
  onLogin: (user: UserType) => void;
  onNavigate: (view: ViewState) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isDeveloper, setIsDeveloper] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserType = {
      id: Date.now().toString(),
      name,
      email,
      role: isDeveloper ? 'developer' : 'user',
    };

    if (storageService.register(newUser)) {
      storageService.login(email); // Auto login
      onLogin(newUser);
    } else {
      alert('User already exists!');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-slate-900">Create Account</h2>
          <p className="text-slate-600 mt-2">Join the AfroTech Hub community</p>
        </div>

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
              />
            </div>
          </div>

          <div 
            className={`p-4 border rounded-xl cursor-pointer transition-all ${
              isDeveloper ? 'bg-primary/5 border-primary' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
            onClick={() => setIsDeveloper(!isDeveloper)}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${isDeveloper ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900">Developer Account</div>
                <div className="text-xs text-slate-500">I want to publish my own apps to the hub.</div>
              </div>
              {isDeveloper && <CheckCircle className="w-6 h-6 text-primary" />}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all"
          >
            Create Account
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