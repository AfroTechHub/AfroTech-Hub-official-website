import { Project, User } from '../types';
import { PROJECTS as INITIAL_PROJECTS } from '../constants';

const USERS_KEY = 'afrotech_users';
const PROJECTS_KEY = 'afrotech_projects';
const SESSION_KEY = 'afrotech_session';

export const storageService = {
  // Projects
  getProjects: (): Project[] => {
    const stored = localStorage.getItem(PROJECTS_KEY);
    if (!stored) {
      // Initialize with default projects if empty
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(stored);
  },

  addProject: (project: Project): Project[] => {
    const current = storageService.getProjects();
    const updated = [project, ...current];
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
    return updated;
  },

  updateProject: (project: Project): Project[] => {
    const current = storageService.getProjects();
    const updated = current.map(p => p.id === project.id ? project : p);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteProject: (projectId: string): Project[] => {
    const current = storageService.getProjects();
    const updated = current.filter(p => p.id !== projectId);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
    return updated;
  },

  // Auth
  register: (user: User): boolean => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find((u: User) => u.email === user.email)) {
      return false; // User exists
    }
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  },

  login: (email: string): User | null => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: User) => u.email === email);
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  updateUser: (user: User): void => {
    // Update in USERS list
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const updatedUsers = users.map((u: User) => u.id === user.id ? user : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    
    // Update session if it matches the current user
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
    if (session.id === user.id) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    }
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }
};