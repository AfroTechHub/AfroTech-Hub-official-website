import React from 'react';
import { ArrowRight, ChevronDown, Layout, Database, Terminal, Cpu, CheckCircle2, Globe } from 'lucide-react';
import NavBar from './components/NavBar';
import ProjectCard from './components/ProjectCard';
import AIChat from './components/AIChat';
import { PROJECTS, SKILLS, SOCIALS, MY_NAME, MY_ROLE, MY_BIO } from './constants';
import { SectionId } from './types';

function App() {
  const categories = Array.from(new Set(SKILLS.map(s => s.category)));

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'frontend': return <Layout className="w-6 h-6" />;
      case 'backend': return <Database className="w-6 h-6" />;
      case 'tools': return <Terminal className="w-6 h-6" />;
      case 'ai': return <Cpu className="w-6 h-6" />;
      default: return null;
    }
  };

  const getCategoryLabel = (cat: string) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <div className="bg-light-50 min-h-screen text-slate-800 font-sans selection:bg-primary/20 selection:text-primary">
      <NavBar />
      
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
              <a 
                href={`#${SectionId.APPS}`}
                className="px-8 py-4 bg-primary text-white rounded-lg font-bold hover:bg-orange-700 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
              >
                View Our Portfolio <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href={`#${SectionId.CONTACT}`}
                className="px-8 py-4 bg-white text-slate-800 border border-slate-200 rounded-lg font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center"
              >
                Let's Talk
              </a>
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
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id={SectionId.SKILLS} className="py-24 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Capabilities</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Our Tech Stack</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category} className="bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-all group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-orange-50 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{getCategoryLabel(category)}</h3>
                </div>
                <div className="space-y-4">
                  {SKILLS.filter(s => s.category === category).map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-700 font-medium">{skill.name}</span>
                        <span className="text-slate-400 text-xs">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id={SectionId.ABOUT} className="py-24 px-4 bg-secondary text-white relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 bg-primary mx-auto rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/30 rotate-3">
             <Globe className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">Who We Are</h2>
          <div className="space-y-6 text-slate-300 leading-relaxed text-lg md:text-xl font-light">
            <p>
              <span className="text-white font-medium">AfroTech Hub</span> is a forward-thinking digital studio. 
              We blend creativity with engineering excellence to build software that matters.
            </p>
            <p>
              From intuitive mobile apps to complex enterprise systems, our mission is to empower businesses through technology.
              We are deeply committed to the React ecosystem and the transformative power of AI.
            </p>
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

      {/* AI Chat Widget */}
      <AIChat />
    </div>
  );
}

export default App;