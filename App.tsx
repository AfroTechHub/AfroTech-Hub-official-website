import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, Layout, Terminal, Cpu, CheckCircle2, Globe } from 'lucide-react';
import NavBar from './components/NavBar';
import ProjectCard from './components/ProjectCard';
import AIChat from './components/AIChat';
import Login from './components/Login';
import Register from './components/Register';
import DeveloperConsole from './components/DeveloperConsole';
import AppDetails from './components/AppDetails';
import About from './components/About';
import { SOCIALS, MY_NAME, MY_BIO } from './constants';
import { SectionId, Project, User, ViewState } from './types';
import { storageService } from './services/storage';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    // Load initial data
    const user = storageService.getCurrentUser();
    setCurrentUser(user);
    setProjects(storageService.getProjects());
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Standard users go to home, developers *can* access console but default to home to explore first
    setCurrentView(ViewState.HOME);
  };

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
    setCurrentView(ViewState.HOME);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleProjectAdded = () => {
    setProjects(storageService.getProjects());
    setCurrentView(ViewState.HOME);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setCurrentView(ViewState.APP_DETAILS);
    window.scrollTo(0, 0);
  };

  // Render Logic
  const renderContent = () => {
    switch(currentView) {
      case ViewState.LOGIN:
        return <Login onLogin={handleLogin} onNavigate={setCurrentView} />;
      case ViewState.REGISTER:
        return <Register onLogin={handleLogin} onNavigate={setCurrentView} />;
      case ViewState.CONSOLE:
        return <DeveloperConsole onProjectAdded={handleProjectAdded} />;
      case ViewState.ABOUT:
        return <About onNavigate={setCurrentView} />;
      case ViewState.APP_DETAILS:
        return selectedProject ? (
          <AppDetails 
            project={selectedProject} 
            onBack={() => setCurrentView(ViewState.HOME)} 
          />
        ) : (
          /* Fallback if state is inconsistent */
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
              {/* Abstract Background Shapes */}
              <div className="absolute right-0 top-0 w-1/2 h-full bg-light-100 skew-x-12 translate-x-32 hidden lg:block" />
              <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

              <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-left animate-fade-in-up">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-xs font-bold text-primary tracking-wide uppercase">Leading Innovation</span>
                  </div>

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
                   {/* Decorative Grid/Tech Visual */}
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

            {/* Stats / Trust Bar (Optional - adds professionalism) */}
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
            <section id={SectionId.CONTACT} className="py-24 px-4 bg-light-50">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">Let's Build Something Great</h2>
                <p className="text-slate-600 text-lg mb-12">
                  Ready to start your next project? Reach out to us for a consultation.
                </p>
                
                <div className="flex flex-wrap justify-center gap-6">
                  {SOCIALS.map((social) => (
                    <a
                      key={social.platform}
                      href={social.url}
                      className="group flex items-center gap-3 px-8 py-5 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all"
                    >
                      <span className="text-slate-400 group-hover:text-primary transition-colors">
                        {social.icon}
                      </span>
                      <span className="font-bold text-slate-700 group-hover:text-slate-900">{social.platform}</span>
                    </a>
                  ))}
                </div>

                <div className="mt-20 pt-8 border-t border-slate-200 text-slate-400 text-sm">
                  <p>&copy; {new Date().getFullYear()} {MY_NAME}. All rights reserved.</p>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="bg-light-50 min-h-screen text-slate-800 font-sans selection:bg-primary/20 selection:text-primary">
      {currentView !== ViewState.APP_DETAILS && currentView !== ViewState.LOGIN && currentView !== ViewState.REGISTER && (
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