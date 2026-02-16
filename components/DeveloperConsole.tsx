import React, { useState, useEffect } from 'react';
import { Plus, LayoutDashboard, Image as ImageIcon, Link as LinkIcon, Save, X, Trash2, Edit2, Upload, AlertCircle, ArrowLeft } from 'lucide-react';
import { Project } from '../types';
import { storageService } from '../services/storage';

interface DeveloperConsoleProps {
  onProjectAdded: () => void;
}

const DeveloperConsole: React.FC<DeveloperConsoleProps> = ({ onProjectAdded }) => {
  const [viewState, setViewState] = useState<'list' | 'form'>('list');
  const [projects, setProjects] = useState<Project[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    imageUrl: '',
    tags: [],
    demoUrl: '',
    repoUrl: '',
    featured: false
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    setProjects(storageService.getProjects());
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      tags: [],
      demoUrl: '',
      repoUrl: '',
      featured: false
    });
    setTagInput('');
    setErrors({});
    setViewState('list');
  };

  const handleEdit = (project: Project) => {
    setFormData(project);
    setViewState('form');
    setErrors({});
  };

  const handleDelete = () => {
    if (deleteId) {
      storageService.deleteProject(deleteId);
      loadProjects();
      onProjectAdded();
      setDeleteId(null);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2000000) { // 2MB limit
         setErrors(prev => ({ ...prev, imageUrl: 'Image size should be less than 2MB' }));
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        setErrors(prev => ({ ...prev, imageUrl: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = 'App Name is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.imageUrl?.trim()) newErrors.imageUrl = 'Image is required';
    
    // URL Validation Regex
    const urlRegex = /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    
    if (formData.demoUrl && !urlRegex.test(formData.demoUrl)) {
      newErrors.demoUrl = 'Invalid URL format (must start with http:// or https://)';
    }
    if (formData.repoUrl && !urlRegex.test(formData.repoUrl)) {
      newErrors.repoUrl = 'Invalid URL format (must start with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    if (formData.id) {
       // Update
       storageService.updateProject(formData as Project);
    } else {
       // Create
       const newProject: Project = {
        id: Date.now().toString(),
        title: formData.title || 'Untitled',
        description: formData.description || '',
        imageUrl: formData.imageUrl || '',
        tags: formData.tags || [],
        demoUrl: formData.demoUrl,
        repoUrl: formData.repoUrl,
        featured: formData.featured || false
      };
      storageService.addProject(newProject);
    }

    loadProjects();
    onProjectAdded();
    resetForm();
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Developer Console</h1>
            <p className="text-slate-600">Manage your applications and deployments.</p>
          </div>
          {viewState === 'list' && (
            <button 
              onClick={() => { resetForm(); setViewState('form'); }}
              className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> New App
            </button>
          )}
        </div>

        {viewState === 'form' && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-12 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-primary" /> 
                {formData.id ? 'Edit App' : 'New App Details'}
              </h2>
              <button 
                 onClick={resetForm}
                 className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">App Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-2 bg-slate-50 border rounded-lg focus:ring-1 focus:ring-primary ${errors.title ? 'border-red-500' : 'border-slate-200'}`}
                    placeholder="e.g. Nebula Dashboard"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.title}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">App Image <span className="text-red-500">*</span></label>
                  <div className="space-y-3">
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="url" 
                        className={`w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-lg focus:ring-1 focus:ring-primary ${errors.imageUrl ? 'border-red-500' : 'border-slate-200'}`}
                        placeholder="https://..."
                        value={formData.imageUrl}
                        onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-px bg-slate-200 flex-1"></div>
                      <span className="text-xs text-slate-400 font-medium">OR UPLOAD</span>
                      <div className="h-px bg-slate-200 flex-1"></div>
                    </div>
                    <label className="flex items-center justify-center w-full px-4 py-2 bg-slate-50 border border-slate-300 border-dashed rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                        <Upload className="w-4 h-4" />
                        <span>Choose Image File</span>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                  {errors.imageUrl && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.imageUrl}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description <span className="text-red-500">*</span></label>
                <textarea 
                  rows={3}
                  className={`w-full px-4 py-2 bg-slate-50 border rounded-lg focus:ring-1 focus:ring-primary ${errors.description ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="Describe your application..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.description}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Demo Link</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="url" 
                      className={`w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-lg focus:ring-1 focus:ring-primary ${errors.demoUrl ? 'border-red-500' : 'border-slate-200'}`}
                      placeholder="https://app.demo.com"
                      value={formData.demoUrl}
                      onChange={e => setFormData({...formData, demoUrl: e.target.value})}
                    />
                  </div>
                  {errors.demoUrl && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.demoUrl}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tech Stack (Tags)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Type and press Enter..."
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags?.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="px-6 py-2 text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-orange-700 shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> {formData.id ? 'Update App' : 'Publish App'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects List */}
        {viewState === 'list' && (
          <div className="grid gap-4">
            {projects.length === 0 ? (
               <div className="bg-slate-50 rounded-2xl border border-slate-200 p-12 text-center">
                <LayoutDashboard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">No Apps Published</h3>
                <p className="text-slate-500 max-w-md mx-auto mt-2 mb-6">
                  Get started by creating your first application deployment.
                </p>
                <button 
                  onClick={() => setViewState('form')}
                  className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Create App
                </button>
              </div>
            ) : (
              projects.map(project => (
                <div key={project.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-20 h-20 rounded-lg object-cover bg-slate-100"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-bold text-lg text-slate-900">{project.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-1">{project.description}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                      {project.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(project)}
                      className="p-2 text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setDeleteId(project.id)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-fade-in-up">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Delete Application?</h3>
            <p className="text-slate-500 text-center mb-6">
              Are you sure you want to delete this app? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 rounded-lg font-bold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperConsole;