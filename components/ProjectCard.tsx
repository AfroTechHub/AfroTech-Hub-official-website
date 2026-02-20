import React from 'react';
import { ExternalLink, Github, Zap, Smartphone, Globe, Tag } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div 
      onClick={() => onClick && onClick(project)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-slate-100 hover:border-primary/20 hover:-translate-y-1 cursor-pointer"
    >
      {/* Platform Indicators - Top Right */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {project.pwaUrl && (
          <div className="bg-white/90 p-1.5 rounded-full shadow-sm backdrop-blur-sm border border-blue-100" title="PWA Available">
            <Globe className="w-4 h-4 text-blue-600" />
          </div>
        )}
        {project.apkUrl && (
          <div className="bg-white/90 p-1.5 rounded-full shadow-sm backdrop-blur-sm border border-green-100" title="Android App">
            <Smartphone className="w-4 h-4 text-green-600" />
          </div>
        )}
      </div>

      {project.featured && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 text-primary text-xs font-bold rounded-full shadow-sm flex items-center gap-1 backdrop-blur-sm">
          <Zap className="w-3 h-3 fill-primary" /> Featured App
        </div>
      )}
      
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
           <h3 className="text-xl font-display font-bold text-slate-900 group-hover:text-primary transition-colors">{project.title}</h3>
           {project.category && (
             <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
               {project.category}
             </span>
           )}
        </div>
        
        <p className="text-slate-600 text-sm leading-relaxed mb-6 h-12 overflow-hidden line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {(project.tags || []).map(tag => (
            <span key={tag} className="px-2.5 py-1 bg-slate-50 text-slate-600 font-medium text-xs rounded-md border border-slate-200">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
          <button className="text-sm font-bold text-primary flex items-center gap-1">
             View Details
          </button>
          {/* Prevent bubble up if user clicks specifically on repo link */}
          {project.repoUrl && (
            <div onClick={(e) => e.stopPropagation()} className="ml-auto">
                <a 
                href={project.repoUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-800 transition-colors"
                >
                <Github className="w-4 h-4" />
                </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;