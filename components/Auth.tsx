import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, ArrowRight, ArrowLeft, Loader2, AlertCircle, CheckCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { storageService } from '../services/storage';
import { User as UserType, ViewState } from '../types';

interface AuthProps {
  onLogin: (user: UserType) => void;
  onNavigate: (view: ViewState) => void;
  initialStep?: AuthStep;
}

export type AuthStep = 'email' | 'password-login' | 'register-details' | 'forgot-password' | 'verify-email';

const Auth: React.FC<AuthProps> = ({ onLogin, onNavigate, initialStep = 'email' }) => {
  const [step, setStep] = useState<AuthStep>(initialStep);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  useEffect(() => {
    if (initialStep) {
      setStep(initialStep);
    }
  }, [initialStep]);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const user = await storageService.loginWithGoogle();
      onLogin(user);
    } catch (err: any) {
      console.error(err);
      setError('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  // Handle "Next" after email input
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    
    setError('');
    setIsCheckingEmail(true);

    try {
      const status = await storageService.checkUserExists(email);
      
      if (status === 'google') {
        setError('This email uses Google Sign-In. Please click the button below.');
        setIsCheckingEmail(false);
        return;
      }
      
      if (status === 'exists') {
        setStep('password-login');
      } else {
        setStep('register-details');
      }
    } catch (err) {
      setStep('register-details');
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Handle Login with Password
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await storageService.login(email, password);
      if (!user.emailVerified) {
        setStep('verify-email');
        setIsLoading(false);
        return;
      }
      onLogin(user);
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
      setIsLoading(false);
    }
  };

  // Handle Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await storageService.register(name, email, password);
      // Don't log in immediately, require verification
      setStep('verify-email');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await storageService.resetPassword(email);
      setSuccess('Password reset link sent! Check your inbox.');
    } catch (err: any) {
      setError('Failed to send reset email. Please verify the email address.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await storageService.resendVerification();
      setSuccess('New verification link sent!');
    } catch (err: any) {
      setError('Failed to resend. Please try signing in again first.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-6">
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
            autoFocus
          />
        </div>
      </div>
      <button 
        type="submit"
        disabled={isCheckingEmail}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isCheckingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4" /></>}
      </button>
    </form>
  );

  const renderPasswordStep = () => (
    <form onSubmit={handleLoginSubmit} className="space-y-6 animate-fade-in-up">
      <div>
         <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <button 
              type="button" 
              onClick={() => setStep('email')} 
              className="text-xs text-primary hover:underline"
            >
              Not {email}?
            </button>
         </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="password" 
            required
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
        </div>
        <div className="text-right mt-1">
          <button 
            type="button"
            onClick={() => setStep('forgot-password')}
            className="text-xs text-slate-500 hover:text-primary transition-colors"
          >
            Forgot Password?
          </button>
        </div>
      </div>
      <button 
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
      </button>
    </form>
  );

  const renderForgotPasswordStep = () => (
    <form onSubmit={handleForgotPassword} className="space-y-6 animate-fade-in-up">
      <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2 mb-4">
        <div className="min-w-4 pt-0.5"><CheckCircle className="w-4 h-4" /></div>
        <p>Enter your email address and we'll send you a link to reset your password.</p>
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

      <button 
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
      </button>

      <button 
        type="button"
        onClick={() => setStep('password-login')}
        className="w-full text-center text-sm text-slate-600 hover:text-slate-900 font-medium"
      >
        Back to Sign In
      </button>
    </form>
  );

  const renderVerifyEmailStep = () => (
    <div className="space-y-6 animate-fade-in-up text-center">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center relative">
           <ShieldCheck className="w-10 h-10" />
           <div className="absolute top-0 right-0 bg-primary rounded-full p-1.5 border-4 border-white">
             <Mail className="w-3 h-3 text-white" />
           </div>
        </div>
      </div>
      
      <h3 className="text-2xl font-display font-bold text-slate-900">Verify your inbox</h3>
      
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left">
        <p className="text-slate-600 text-sm leading-relaxed mb-3">
          Hi <strong>{name || 'there'}</strong>, we're excited to have you! To keep your account secure and unlock full access to AfroTech Hub, please confirm your email address.
        </p>
        <div className="flex items-center gap-2 text-sm text-slate-700 font-medium bg-white p-2 rounded-lg border border-slate-200">
           <Mail className="w-4 h-4 text-slate-400" />
           {email}
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Can't find it? Check your spam folder or let us know.
      </p>

      {success && (
         <div className="p-3 bg-green-50 text-green-700 text-sm font-medium rounded-lg flex items-center justify-center gap-2 animate-pulse">
            <CheckCircle className="w-4 h-4" /> {success}
         </div>
      )}

      <div className="space-y-3 pt-2">
        <button 
          onClick={handleLoginSubmit}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
        >
          <span>I've Verified My Email</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <button 
          onClick={handleResendVerification}
          disabled={isLoading}
          className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
        >
           {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><RefreshCw className="w-4 h-4" /> Resend Verification Email</>}
        </button>
        
        <button 
          onClick={() => {
             storageService.logout();
             setStep('email');
          }}
          className="text-sm text-slate-500 hover:text-slate-800 py-2"
        >
          Sign in with a different email
        </button>
      </div>
    </div>
  );

  const renderRegisterStep = () => (
    <form onSubmit={handleRegisterSubmit} className="space-y-6 animate-fade-in-up">
      <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 mb-4">
        <CheckCircle className="w-4 h-4" />
        Looks like you're new here. Let's create an account.
      </div>
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
            autoFocus
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-slate-700">Choose Password</label>
            <button 
              type="button" 
              onClick={() => setStep('email')} 
              className="text-xs text-primary hover:underline"
            >
              Change email?
            </button>
         </div>
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
        className="w-full bg-primary hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
      </button>
    </form>
  );

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
          {step !== 'verify-email' && (
            <h2 className="text-3xl font-display font-bold text-slate-900">
              {step === 'email' ? 'Welcome' : 
               step === 'password-login' ? 'Welcome Back' : 
               step === 'forgot-password' ? 'Reset Password' :
               'Join Us'}
            </h2>
          )}
          {step !== 'verify-email' && (
            <p className="text-slate-600 mt-2">
              {step === 'email' ? 'Enter your email to continue' : 
               step === 'password-login' ? 'Sign in to your account' : 
               step === 'forgot-password' ? 'Recover your account access' :
               'Create your AfroTech Hub profile'}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-fade-in-up">
            <AlertCircle className="w-4 h-4 shrink-0" /> <span>{error}</span>
          </div>
        )}
        
        {success && step !== 'verify-email' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2 text-green-700 text-sm animate-fade-in-up">
            <CheckCircle className="w-4 h-4 shrink-0" /> <span>{success}</span>
          </div>
        )}

        {/* Dynamic Form Step */}
        {step === 'email' && renderEmailStep()}
        {step === 'password-login' && renderPasswordStep()}
        {step === 'register-details' && renderRegisterStep()}
        {step === 'forgot-password' && renderForgotPasswordStep()}
        {step === 'verify-email' && renderVerifyEmailStep()}

        {/* Divider / Google Auth (Only on Email Step) */}
        {step === 'email' && (
          <>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
               <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26+-.19-.58z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;