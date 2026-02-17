import React from 'react';
import { ArrowLeft, Star, Download, ShieldCheck, Share2, Info, ExternalLink, Github, Check, MonitorPlay, Smartphone, Globe } from 'lucide-react';
import { Project } from '../types';

interface AppDetailsProps {
  project: Project;
  onBack: () => void;
}

const AppDetails: React.FC<AppDetailsProps> = ({ project, onBack }) => {
  // Generate random stats for "store" feel
  const rating = (4.0 + Math.random()).toFixed(1);
  const reviews = Math.floor(Math.random() * 500) + 50 + 'K';
  const downloads = Math.floor(Math.random() * 10) + 1 + 'M+';
  const size = Math.floor(Math.random() * 50) + 10 + ' MB';

  return (
    <div className="min-h-screen bg-white pt-20 pb-12 animate-fade-in-up">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md z-30 flex items-center px-4 border-b border-slate-100">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors mr-4"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="font-display font-bold text-lg text-slate-900 truncate">{project.title}</h1>
        <div className="ml-auto">
             <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
                <Share2 className="w-5 h-5" />
             </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8 mt-4">
          <div className="shrink-0 mx-auto sm:mx-0">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover shadow-lg border border-slate-100"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-2">{project.title}</h1>
            <p className="text-primary font-medium mb-4">AfroTech Hub Studios</p>
            
            <div className="flex items-center justify-center sm:justify-start gap-6 text-sm text-slate-600 mb-6">
              <div className="text-center sm:text-left">
                <div className="font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1">
                  {rating} <Star className="w-3 h-3 fill-slate-900 text-slate-900" />
                </div>
                <div className="text-xs">{reviews} reviews</div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="text-center sm:text-left">
                <div className="font-bold text-slate-900">{downloads}</div>
                <div className="text-xs">Downloads</div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="text-center sm:text-left">
                <div className="font-bold text-slate-900">E</div>
                <div className="text-xs">Everyone</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
               {/* APK Download Button */}
               {project.apkUrl && (
                  <a 
                    href={project.apkUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-green-600/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Smartphone className="w-5 h-5" /> Download APK
                  </a>
               )}

               {/* PWA / Web App Button */}
               {project.pwaUrl ? (
                  <a 
                    href={project.pwaUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-primary hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Globe className="w-5 h-5" /> Launch Web App
                  </a>
               ) : project.demoUrl ? (
                   // Fallback for generic demo link
                  <a 
                    href={project.demoUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-primary hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
                  >
                    <MonitorPlay className="w-5 h-5" /> Open Website
                  </a>
               ) : (!project.apkUrl && (
                  <button disabled className="flex-1 bg-slate-200 text-slate-500 font-bold py-3 px-8 rounded-full cursor-not-allowed flex items-center justify-center gap-2">
                    Coming Soon
                  </button>
               ))}
               
               {project.repoUrl && (
                  <a 
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 px-8 rounded-full transition-all flex items-center justify-center gap-2"
                  >
                    <Github className="w-5 h-5" /> Source Code
                  </a>
               )}
            </div>
          </div>
        </div>

        {/* Screenshots Placeholder (Carousel effect) */}
        <div className="mb-10 overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-4 min-w-max">
                <div className="w-64 h-40 rounded-xl overflow-hidden shadow-md relative group">
                    <img src={project.imageUrl} className="w-full h-full object-cover" alt="Screenshot 1" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="w-64 h-40 bg-slate-100 rounded-xl flex items-center justify-center shadow-inner border border-slate-200">
                    <p className="text-slate-400 text-sm font-medium">Dashboard View</p>
                </div>
                <div className="w-64 h-40 bg-slate-100 rounded-xl flex items-center justify-center shadow-inner border border-slate-200">
                    <p className="text-slate-400 text-sm font-medium">Mobile Interface</p>
                </div>
                <div className="w-64 h-40 bg-slate-100 rounded-xl flex items-center justify-center shadow-inner border border-slate-200">
                    <p className="text-slate-400 text-sm font-medium">Settings Panel</p>
                </div>
            </div>
        </div>

        {/* About Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-900">About this app</h2>
                  <button className="text-primary text-sm font-bold hover:underline">
                    <ArrowLeft className="w-4 h-4 inline rotate-180" />
                  </button>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  {project.description}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Experience the power of modern web technology. Built with performance and scalability in mind, 
                  this application demonstrates the capabilities of the AfroTech Hub ecosystem.
                </p>
                
                <div className="mt-6 flex flex-wrap gap-2">
                   {project.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600">
                        {tag}
                      </span>
                   ))}
                </div>
             </div>

             <div>
               <h2 className="text-xl font-bold text-slate-900 mb-4">Data safety</h2>
               <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-slate-600 mb-2">
                      Safety starts with understanding how developers collect and share your data. Data privacy and security practices may vary based on your use, region, and age.
                    </p>
                    <a href="#" className="text-sm font-bold text-slate-900 underline">See details</a>
                  </div>
               </div>
             </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
             <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">App Info</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Version</span>
                      <span className="text-slate-900 font-medium">1.0.{Math.floor(Math.random() * 10)}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Updated on</span>
                      <span className="text-slate-900 font-medium">Oct 24, 2024</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Downloads</span>
                      <span className="text-slate-900 font-medium">{downloads}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Download size</span>
                      <span className="text-slate-900 font-medium">{size}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Released on</span>
                      <span className="text-slate-900 font-medium">Jan 15, 2024</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Offered by</span>
                      <span className="text-slate-900 font-medium">AfroTech Hub</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
        
        {/* Footer Rating */}
        <div className="mt-12 py-8 border-t border-slate-100">
           <h2 className="text-xl font-bold text-slate-900 mb-6">Ratings and reviews</h2>
           <div className="flex items-center gap-8">
              <div className="text-center">
                 <div className="text-6xl font-display font-bold text-slate-900">{rating}</div>
                 <div className="flex text-primary justify-center my-2">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4" />
                 </div>
                 <div className="text-xs text-slate-500">{reviews} reviews</div>
              </div>
              
              <div className="flex-1 max-w-sm hidden sm:block">
                 {[5, 4, 3, 2, 1].map((star, i) => (
                    <div key={star} className="flex items-center gap-3 text-xs text-slate-600 mb-1">
                       <span className="w-2">{star}</span>
                       <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${[80, 15, 3, 1, 1][i]}%` }} 
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AppDetails;