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

export interface Skill {
  name: string;
  icon: string; // Lucide icon name or image url
  category: 'frontend' | 'backend' | 'tools' | 'ai';
  level: number; // 1-100
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

export enum SectionId {
  HERO = 'home',
  APPS = 'apps',
  SKILLS = 'skills',
  ABOUT = 'about',
  CONTACT = 'contact',
}