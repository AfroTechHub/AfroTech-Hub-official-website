import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, Layout, Terminal, Cpu, CheckCircle2, Globe, Loader2, Sparkles, Mail, Send } from 'lucide-react';
import NavBar from './components/NavBar';
import ProjectCard from './components/ProjectCard';
import AIChat from './components/AIChat';
import Auth from './components/Auth';
import DeveloperConsole from './components/DeveloperConsole';
import AppDetails from './components/AppDetails';
import About from './components/About';
import Footer from './components/Footer';
import { SOCIALS, MY_NAME, MY_BIO } from './constants';
import { SectionId, Project, User, ViewState } from './types';
import { storageService } from './services/storage';
import { generateDraftMessage } from './services/geminiService';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [draftTopic, setDraftTopic] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    // Auth Listener
    const unsubscribe = storageService.onAuthChange((user) => {
      setCurrentUser(user);
      if (user && !user.emailVerified) {
         setCurrentView(ViewState.AUTH);
      }
    });

    // Load Data
    const loadProjects = async () => {
      try {
        const data = await storageService.getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();

    return () => unsubscribe();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentView(ViewState.HOME);
  };

  const handleLogout = async () => {
    await storageService.logout();
    setCurrentUser(null);
    setCurrentView(ViewState.HOME);
  };

  const handleUserUpdate = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleProjectAdded = async () => {
    setIsLoading(true);
    const data = await storageService.getProjects();
    setProjects(data);
    setIsLoading(false);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setCurrentView(ViewState.APP_DETAILS);
    window.scrollTo(0, 0);
  };

  const handleDraftMessage = async () => {
    if (!draftTopic.trim()) return;
    setIsDrafting(true);
    try {
      const draft = await generateDraftMessage(draftTopic);
      setContactForm(prev => ({ ...prev, message: draft }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate network request
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setContactForm({ name: '', email: '', message: '' });
      setDraftTopic('');
      setTimeout(() => setSentSuccess(false), 5000);
    }, 1500);
  };

  // Render Logic
  const renderContent = () => {
    if (isLoading && projects.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-light-50">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      );
    }

    switch(currentView) {
      case ViewState.AUTH:
      case ViewState.LOGIN:
      case ViewState.REGISTER:
        return <Auth 
                  onLogin={handleLogin} 
                  onNavigate={setCurrentView} 
                  initialStep={currentUser && !currentUser.emailVerified ? 'verify-email' : undefined}
               />;
      case ViewState.CONSOLE:
        if (currentUser && !currentUser.emailVerified) return <Auth onLogin={handleLogin} onNavigate={setCurrentView} initialStep="verify-email" />;
        if (!currentUser) return <Auth onLogin={handleLogin} onNavigate={setCurrentView} />;
        return <DeveloperConsole onProjectAdded={handleProjectAdded} user={currentUser} />;
      case ViewState.ABOUT:
        return <About onNavigate={setCurrentView} />;
      case ViewState.APP_DETAILS:
        return selectedProject ? (
          <AppDetails 
            project={selectedProject} 
            onBack={() => setCurrentView(ViewState.HOME)} 
          />
        ) : (
          <div className="pt-24 text-center">App not found. <button onClick={() => setCurrentView(ViewState.HOME)} className="text-primary underline">Go Home</button></div>
        );
      case ViewState.HOME:
      default:
        return (
          <>
            {/* Hero Section */}
            <section 
              id={SectionId.HERO} 
              className="relative min-h-[90vh] flex items-center pt-20 px-4 overflow-hidden bg-white"
            >
              <div className="absolute right-0 top-0 w-1/2 h-full bg-light-100 skew-x-12 translate-x-32 hidden lg:block" />
              <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

              <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-left animate-fade-in-up">
                  <h1 className="text-5xl md:text-7xl font-display font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                    Building the <br />
                    <span className="text-primary">Digital Future</span>
                  </h1>

                  <p className="text-xl text-slate-600 max-w-lg mb-10 leading-relaxed font-light">
                    Welcome to <strong>{MY_NAME}</strong>. {MY_BIO} We transform complex ideas into elegant, scalable digital solutions.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => {
                         const el = document.getElementById(SectionId.APPS);
                         el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-8 py-4 bg-primary text-white rounded-lg font-bold hover:bg-orange-700 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                    >
                      View Our Portfolio <ArrowRight className="w-5 h-5" />
                    </button>
                    <button 
                       onClick={() => {
                         const el = document.getElementById(SectionId.CONTACT);
                         el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-8 py-4 bg-white text-slate-800 border border-slate-200 rounded-lg font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center"
                    >
                      Let's Talk
                    </button>
                  </div>
                </div>
                
                <div className="hidden lg:block relative">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4 mt-8">
                        <div className="h-40 bg-slate-50 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                          <Layout className="w-12 h-12 text-primary/40" />
                        </div>
                        <div className="h-56 bg-secondary text-white rounded-2xl shadow-xl flex flex-col p-6 justify-between transform hover:-translate-y-2 transition-transform">
                          <Cpu className="w-10 h-10 text-primary" />
                          <div>
                            <div className="text-2xl font-bold font-display">AI Core</div>
                            <div className="text-slate-400 text-sm">Powered by Gemini</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                         <div className="h-56 bg-primary text-white rounded-2xl shadow-xl flex flex-col p-6 justify-between transform hover:-translate-y-2 transition-transform">
                          <Globe className="w-10 h-10 text-white" />
                          <div>
                            <div className="text-2xl font-bold font-display">Global</div>
                            <div className="text-orange-100 text-sm">Scalable Solutions</div>
                          </div>
                         </div>
                         <div className="h-40 bg-slate-50 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                           <Terminal className="w-12 h-12 text-slate-300" />
                         </div>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-slate-400">
                <ChevronDown className="w-6 h-6" />
              </div>
            </section>

            {/* Stats / Trust Bar */}
            <div className="border-y border-slate-200 bg-white py-8">
              <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center md:justify-between gap-8 text-slate-400 font-semibold uppercase tracking-wider text-sm">
                 <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Modern Architecture</span>
                 <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Scalable Cloud</span>
                 <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> AI Integration</span>
                 <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> User Centric</span>
              </div>
            </div>

            {/* Apps Section */}
            <section id={SectionId.APPS} className="py-24 px-4 bg-light-50">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                  <div>
                    <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Portfolio</h2>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Featured Applications</h3>
                  </div>
                  <p className="text-slate-600 max-w-md">
                    Explore our diverse ecosystem of high-performance applications designed to solve real-world problems.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onClick={handleProjectClick}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id={SectionId.CONTACT} className="py-24 px-4 bg-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-light-50 skew-y-3 origin-top-left -z-10" />
               
               <div className="max-w-7xl mx-auto">
                 <div className="grid lg:grid-cols-2 gap-16 items-start">
                   {/* Left Col: Info */}
                   <div>
                      <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Get In Touch</h2>
                      <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">Let's Build Something Great</h2>
                      <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                        Ready to start your next project? We are always looking for new challenges and opportunities to innovate. 
                        Reach out to us for a consultation or just to say hello.
                      </p>
                      
                      <div className="space-y-8">
                        <div className="flex items-center gap-5">
                           <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                             <Mail className="w-6 h-6" />
                           </div>
                           <div>
                             <h4 className="font-bold text-slate-900 text-lg">Email Us</h4>
                             <p className="text-slate-600">hello@afrotechhub.com</p>
                             <p className="text-slate-400 text-sm">We reply within 24 hours</p>
                           </div>
                        </div>
                      </div>

                      <div className="mt-12">
                        <h4 className="font-bold text-slate-900 mb-4">Follow Us</h4>
                        <div className="flex gap-4">
                           {SOCIALS.map(social => (
                             <a 
                                key={social.platform} 
                                href={social.url}
                                target="_blank"
                                rel="noreferrer" 
                                className="p-3 bg-white border border-slate-200 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                              >
                                {social.icon}
                              </a>
                           ))}
                        </div>
                      </div>
                   </div>

                   {/* Right Col: Form */}
                   <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                      {sentSuccess ? (
                        <div className="h-[400px] flex flex-col items-center justify-center text-center animate-fade-in-up">
                           <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                             <CheckCircle2 className="w-10 h-10" />
                           </div>
                           <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                           <p className="text-slate-600">Thanks for reaching out. We'll get back to you soon.</p>
                           <button onClick={() => setSentSuccess(false)} className="mt-6 text-primary font-bold hover:underline">
                             Send another message
                           </button>
                        </div>
                      ) : (
                        <>
                          {/* AI Drafter Widget */}
                          <div className="mb-8 bg-slate-50 p-5 rounded-xl border border-slate-200 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                               <Sparkles className="w-24 h-24 rotate-12" />
                             </div>
                             <div className="flex items-center gap-2 mb-3 text-sm font-bold text-slate-700 relative z-10">
                                <Sparkles className="w-4 h-4 text-primary" /> AI Assistant
                             </div>
                             <p className="text-xs text-slate-500 mb-3 relative z-10">Not sure what to write? Tell us your topic and let AI draft a professional message for you.</p>
                             <div className="flex gap-2 relative z-10">
                                <input 
                                  placeholder="e.g., I need a mobile app for my bakery..." 
                                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                                  value={draftTopic}
                                  onChange={(e) => setDraftTopic(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleDraftMessage()}
                                />
                                <button 
                                  onClick={handleDraftMessage} 
                                  disabled={isDrafting || !draftTopic.trim()}
                                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center gap-2"
                                >
                                  {isDrafting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Draft'}
                                </button>
                             </div>
                          </div>

                          <form onSubmit={handleContactSubmit} className="space-y-5">
                             <div>
                               <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                               <input 
                                 required
                                 className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                 placeholder="John Doe"
                                 value={contactForm.name}
                                 onChange={e => setContactForm({...contactForm, name: e.target.value})}
                               />
                             </div>
                             <div>
                               <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                               <input 
                                 type="email"
                                 required
                                 className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                 placeholder="john@example.com"
                                 value={contactForm.email}
                                 onChange={e => setContactForm({...contactForm, email: e.target.value})}
                               />
                             </div>
                             <div>
                               <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                               <textarea 
                                 required
                                 rows={4}
                                 className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                 placeholder="How can we help you?"
                                 value={contactForm.message}
                                 onChange={e => setContactForm({...contactForm, message: e.target.value})}
                               />
                             </div>
                             
                             <button 
                               type="submit"
                               disabled={isSending}
                               className="w-full bg-primary hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 mt-2"
                             >
                               {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Send Message</>}
                             </button>
                          </form>
                        </>
                      )}
                   </div>
                 </div>
               </div>
            </section>
            
            <Footer />
          </>
        );
    }
  };

  return (
    <div className="bg-light-50 min-h-screen text-slate-800 font-sans selection:bg-primary/20 selection:text-primary">
      {currentView !== ViewState.APP_DETAILS && currentView !== ViewState.AUTH && currentView !== ViewState.LOGIN && currentView !== ViewState.REGISTER && (
        <NavBar 
          user={currentUser} 
          onNavigate={setCurrentView}
          onLogout={handleLogout}
          onUserUpdate={handleUserUpdate}
          currentView={currentView}
        />
      )}
      {renderContent()}
      <AIChat />
    </div>
  );
}

export default App;