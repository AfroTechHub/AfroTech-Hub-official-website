import React from 'react';

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  demoUrl?: string;
  repoUrl?: string;
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
}

export enum SectionId {
  HERO = 'home',
  APPS = 'apps',
  ABOUT = 'about',
  CONTACT = 'contact',
}

export enum ViewState {
  HOME = 'HOME',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  CONSOLE = 'CONSOLE',
  APP_DETAILS = 'APP_DETAILS',
}