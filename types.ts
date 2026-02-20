import React from 'react';

export type AppStatus = 'draft' | 'in_review' | 'published' | 'archived';

export interface Project {
  id: string;
  userId?: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  
  // Professional Fields
  status: AppStatus;
  category: string;
  version: string;
  releaseNotes?: string;
  
  // Metrics (Mocked for now, but essential for a console)
  downloads: number;
  rating: number;
  
  // Links
  demoUrl?: string;
  repoUrl?: string;
  pwaUrl?: string;
  apkUrl?: string;
  featured: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'user';
  avatar?: string;
  emailVerified?: boolean;
}

export enum SectionId {
  HERO = 'home',
  APPS = 'apps',
  ABOUT = 'about',
  CONTACT = 'contact',
}

export enum ViewState {
  HOME = 'HOME',
  AUTH = 'AUTH',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  CONSOLE = 'CONSOLE',
  APP_DETAILS = 'APP_DETAILS',
  ABOUT = 'ABOUT',
}