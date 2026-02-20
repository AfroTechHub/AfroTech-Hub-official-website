import React, { useState, useEffect } from 'react';
import { Plus, LayoutDashboard, Image as ImageIcon, Link as LinkIcon, Save, X, Trash2, Edit2, Upload, AlertCircle, ArrowLeft, Github, Smartphone, Globe, Loader2, Download, BarChart3, Layers, Tag, Rocket, Eye } from 'lucide-react';
import { Project, User, AppStatus } from '../types';
import { storageService } from '../services/storage';

interface DeveloperConsoleProps {
  onProjectAdded: () => void;
  user: User;
}

const APP_CATEGORIES = [
  "Productivity", "Social", "Entertainment", "Education", "Health & Fitness", "Finance", "Utilities", "Games", "Shopping"
];

const DeveloperConsole: React.FC<DeveloperConsoleProps> = ({ onProjectAdded, user }) => {
  const [viewState, setViewState] = useState<'dashboard' | 'editor'>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Editor State
  const [activeTab, setActiveTab] = useState<'store_listing' | 'release' | 'graphics'>('store_listing');
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && user.id) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await storageService.getUserProjects(user.id);
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects", error);
    } finally {
      setIsLoading(false);
    }
  };

  const initNewProject = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      tags: [],
      demoUrl: '',
      repoUrl: '',
      pwaUrl: '',
      apkUrl: '',
      featured: false,
      status: 'draft',
      category: 'Utilities',
      version: '1.0.0',
      downloads: 0,
      rating: 0
    });
    setTagInput('');
    setErrors({});
    setActiveTab('store_listing');
    setViewState('editor');
  };

  const handleEdit = (project: Project) => {
    setFormData(project);
    setActiveTab('store_listing');
    setViewState('editor');
    setErrors({});
  };

  const handleDelete = async () => {
    if (deleteId) {
      setIsLoading(true);
      try {
        await storageService.deleteProject(deleteId);
        await loadProjects();
        onProjectAdded();
        setDeleteId(null);
      } catch (error) {
        console.error("Error deleting", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ... (Tag and Image handlers same as before)
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
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, imageUrl: 'File must be an image.' }));
        return;
      }
      if (file.size > 2000000) { 
         setErrors(prev => ({ ...prev, imageUrl: 'Image size > 2MB' }));
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
    
    // Only check image if we are publishing, allows drafts to be incomplete
    if (formData.status === 'published' && !formData.imageUrl?.trim()) {
      newErrors.imageUrl = 'Image is required for publishing';
      setActiveTab('graphics'); // Switch tab to show error
    }

    // URL Validation
    const validateUrl = (url: string | undefined, fieldName: string) => {
      if (!url || url.trim() === '') return;
      const trimmedUrl = url.trim();
      if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
         newErrors[fieldName] = 'URL must start with http:// or https://';
         return;
      }
      try { new URL(trimmedUrl); } catch (e) { newErrors[fieldName] = 'Invalid URL format'; }
    };

    validateUrl(formData.demoUrl, 'demoUrl');
    validateUrl(formData.repoUrl, 'repoUrl');
    validateUrl(formData.pwaUrl, 'pwaUrl');
    validateUrl(formData.apkUrl, 'apkUrl');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      const projectData = {
        ...formData,
        // Ensure defaults
        status: formData.status || 'draft',
        category: formData.category || 'Utilities',
        version: formData.version || '1.0.0',
        downloads: formData.downloads || 0,
        rating: formData.rating || 0,
        userId: user.id
      } as Project;

      if (formData.id) {
         await storageService.updateProject(projectData);
      } else {
         await storageService.addProject(projectData);
      }

      await loadProjects();
      onProjectAdded();
      setViewState('dashboard');
    } catch (error) {
      console.error("Error saving", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Sub-Components for Dashboard ---

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );

  const getStatusBadge = (status: AppStatus) => {
    switch(status) {
      case 'published': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold border border-green-200">Production</span>;
      case 'draft': return <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold border border-slate-200">Draft</span>;
      case 'in_review': return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-bold border border-amber-200">In Review</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">Developer Console</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900">
              {viewState === 'dashboard' ? 'Dashboard' : formData.id ? `Edit: ${formData.title}` : 'Create New App'}
            </h1>
          </div>
          {viewState === 'editor' && (
             <button onClick={() => setViewState('dashboard')} className="text-slate-500 hover:text-slate-800 flex items-center gap-2">
               <ArrowLeft className="w-4 h-4" /> Back to Dashboard
             </button>
          )}
        </div>

        {viewState === 'dashboard' && (
          <div className="animate-fade-in-up space-y-8">
            {/* Analytics Overview */}
            <div className="grid md:grid-cols-4 gap-6">
               <StatCard 
                 title="Total Apps" 
                 value={projects.length} 
                 icon={LayoutDashboard} 
                 color="bg-blue-500" 
               />
               <StatCard 
                 title="Published" 
                 value={projects.filter(p => p.status === 'published').length} 
                 icon={Globe} 
                 color="bg-green-500" 
               />
               <StatCard 
                 title="Total Downloads" 
                 value={projects.reduce((acc, p) => acc + (p.downloads || 0), 0).toLocaleString()} 
                 icon={Download} 
                 color="bg-purple-500" 
               />
               <StatCard 
                 title="Avg. Rating" 
                 value={(projects.reduce((acc, p) => acc + (p.rating || 0), 0) / (projects.length || 1)).toFixed(1)} 
                 icon={BarChart3} 
                 color="bg-orange-500" 
               />
            </div>

            {/* App List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="text-lg font-bold text-slate-900">Your Applications</h2>
                 <button 
                  onClick={initNewProject}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center gap-2 text-sm"
                 >
                   <Plus className="w-4 h-4" /> Create App
                 </button>
               </div>
               
               {projects.length === 0 ? (
                 <div className="p-12 text-center text-slate-500">
                    No apps found. Create your first one!
                 </div>
               ) : (
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-6 py-4">App</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Version</th>
                        <th className="px-6 py-4">Downloads</th>
                        <th className="px-6 py-4">Last Update</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {projects.map(project => (
                        <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                               <img src={project.imageUrl || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-lg bg-slate-200 object-cover" />
                               <span className="font-bold text-slate-900">{project.title}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(project.status || 'draft')}</td>
                          <td className="px-6 py-4 text-slate-600 font-mono text-xs">{project.version || '1.0.0'}</td>
                          <td className="px-6 py-4 text-slate-600">{project.downloads?.toLocaleString() || 0}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">Today</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleEdit(project)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600" title="Edit Store Listing"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => setDeleteId(project.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600" title="Delete App"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               )}
            </div>
          </div>
        )}

        {viewState === 'editor' && (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation for Editor */}
            <div className="lg:col-span-1 space-y-2">
              <button 
                onClick={() => setActiveTab('store_listing')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${activeTab === 'store_listing' ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                <LayoutDashboard className="w-4 h-4" /> Main Store Listing
              </button>
              <button 
                onClick={() => setActiveTab('graphics')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${activeTab === 'graphics' ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                <ImageIcon className="w-4 h-4" /> Graphics
              </button>
              <button 
                onClick={() => setActiveTab('release')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${activeTab === 'release' ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                <Rocket className="w-4 h-4" /> Distribution & Release
              </button>
            </div>

            {/* Main Form Area */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                
                {/* --- Store Listing Tab --- */}
                {activeTab === 'store_listing' && (
                  <div className="space-y-6 animate-fade-in-up">
                    <h2 className="text-xl font-bold border-b border-slate-100 pb-4 mb-6">App Details</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">App Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary"
                          value={formData.title}
                          onChange={e => setFormData({...formData, title: e.target.value})}
                          placeholder="e.g. Super App"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                        <select 
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary"
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                          {APP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Short Description</label>
                      <input 
                          type="text" 
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary"
                          value={formData.description?.substring(0, 80)}
                          onChange={e => setFormData({...formData, description: e.target.value})} // Simplification for demo
                          placeholder="A brief summary of your app..."
                        />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Full Description <span className="text-red-500">*</span></label>
                      <textarea 
                        rows={6}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Detailed description of features..."
                      />
                      {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Tags</label>
                      <div className="flex flex-wrap gap-2 mb-2 p-2 bg-slate-50 border border-slate-200 rounded-lg min-h-[42px]">
                         {formData.tags?.map(tag => (
                           <span key={tag} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs flex items-center gap-1">
                             {tag} <button type="button" onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
                           </span>
                         ))}
                         <input 
                           className="bg-transparent focus:outline-none text-sm min-w-[100px]"
                           placeholder="Add tag..."
                           value={tagInput}
                           onChange={e => setTagInput(e.target.value)}
                           onKeyDown={handleAddTag}
                         />
                      </div>
                    </div>
                  </div>
                )}

                {/* --- Graphics Tab --- */}
                {activeTab === 'graphics' && (
                   <div className="space-y-6 animate-fade-in-up">
                      <h2 className="text-xl font-bold border-b border-slate-100 pb-4 mb-6">Store Assets</h2>
                      
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">App Icon (512x512) <span className="text-red-500">*</span></label>
                        <div className="flex items-start gap-6">
                           <div className="w-32 h-32 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative">
                              {formData.imageUrl ? (
                                <img src={formData.imageUrl} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-8 h-8 text-slate-300" />
                              )}
                           </div>
                           <div className="flex-1">
                              <input 
                                type="url" 
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg mb-2"
                                placeholder="Image URL..."
                                value={formData.imageUrl}
                                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                              />
                              <label className="inline-block px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-200 text-sm font-medium">
                                <span className="flex items-center gap-2"><Upload className="w-4 h-4" /> Upload File</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                              </label>
                              {errors.imageUrl && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.imageUrl}</p>}
                           </div>
                        </div>
                      </div>
                   </div>
                )}

                {/* --- Release Tab --- */}
                {activeTab === 'release' && (
                  <div className="space-y-6 animate-fade-in-up">
                    <h2 className="text-xl font-bold border-b border-slate-100 pb-4 mb-6">Release Management</h2>
                    
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3 mb-6">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-amber-800 text-sm">Release Status</h4>
                        <p className="text-amber-700 text-xs mt-1">
                          'Published' apps are visible to everyone. 'Draft' apps are only visible to you.
                        </p>
                      </div>
                      <select 
                         className="ml-auto px-3 py-1 bg-white border border-amber-300 rounded text-sm font-bold text-amber-800"
                         value={formData.status}
                         onChange={e => setFormData({...formData, status: e.target.value as AppStatus})}
                      >
                        <option value="draft">Draft</option>
                        <option value="in_review">In Review</option>
                        <option value="published">Published</option>
                      </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                       <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Version Name</label>
                         <input 
                           type="text" 
                           className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                           placeholder="1.0.0"
                           value={formData.version}
                           onChange={e => setFormData({...formData, version: e.target.value})}
                         />
                       </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                       <h3 className="font-bold text-slate-700">Artifacts & Links</h3>
                       
                       <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-4 border border-slate-200 rounded-lg">
                             <div className="flex items-center gap-2 mb-2">
                               <Globe className="w-4 h-4 text-blue-600" />
                               <span className="font-bold text-sm">PWA URL</span>
                             </div>
                             <input 
                               className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded"
                               placeholder="https://..."
                               value={formData.pwaUrl}
                               onChange={e => setFormData({...formData, pwaUrl: e.target.value})}
                             />
                             {errors.pwaUrl && <p className="text-red-500 text-xs mt-1">{errors.pwaUrl}</p>}
                          </div>

                          <div className="p-4 border border-slate-200 rounded-lg">
                             <div className="flex items-center gap-2 mb-2">
                               <Smartphone className="w-4 h-4 text-green-600" />
                               <span className="font-bold text-sm">APK Download URL</span>
                             </div>
                             <input 
                               className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded"
                               placeholder="https://..."
                               value={formData.apkUrl}
                               onChange={e => setFormData({...formData, apkUrl: e.target.value})}
                             />
                             {errors.apkUrl && <p className="text-red-500 text-xs mt-1">{errors.apkUrl}</p>}
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 pt-8 mt-6 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setViewState('dashboard')}
                    className="px-6 py-2.5 text-slate-600 hover:text-slate-900 font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="px-8 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-orange-700 shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                     {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save & Release</>}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-fade-in-up">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Delete App?</h3>
            <p className="text-slate-500 text-center mb-6">
              This action will remove the app and all its data permanently.
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
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 rounded-lg font-bold text-white hover:bg-red-700 flex justify-center items-center"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperConsole;