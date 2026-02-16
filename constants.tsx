import { Project, SocialLink } from './types';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import React from 'react';

export const MY_NAME = "AfroTech Hub";
export const MY_ROLE = "Innovative App Development Studio";
export const MY_BIO = "We build scalable, high-performance web and mobile applications with a focus on intuitive UI/UX and cutting-edge AI integration.";

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Nebula Dashboard',
    description: 'A real-time analytics platform for SaaS businesses, featuring customizable widgets and AI-driven insights.',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    tags: ['React', 'TypeScript', 'D3.js', 'Node.js'],
    demoUrl: '#',
    repoUrl: '#',
    featured: true,
  },
  {
    id: '2',
    title: 'Gemini Lens',
    description: 'An AI-powered image analysis tool that helps users identify objects and generate creative captions instantly.',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    tags: ['Next.js', 'Gemini API', 'Tailwind'],
    demoUrl: '#',
    repoUrl: '#',
    featured: true,
  },
  {
    id: '3',
    title: 'FlowState Task',
    description: 'A productivity app designed for deep work, integrating Pomodoro techniques with ambient soundscapes.',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    tags: ['React Native', 'Redux', 'Firebase'],
    demoUrl: '#',
    featured: false,
  },
  {
    id: '4',
    title: 'CryptoWatch',
    description: 'Live cryptocurrency tracker with price alerts and portfolio management features.',
    imageUrl: 'https://picsum.photos/800/600?random=4',
    tags: ['Vue.js', 'WebSockets', 'Chart.js'],
    repoUrl: '#',
    featured: false,
  }
];

export const SOCIALS: SocialLink[] = [
  { platform: 'GitHub', url: 'https://github.com', icon: <Github className="w-5 h-5" /> },
  { platform: 'LinkedIn', url: 'https://linkedin.com', icon: <Linkedin className="w-5 h-5" /> },
  { platform: 'Twitter', url: 'https://twitter.com', icon: <Twitter className="w-5 h-5" /> },
  { platform: 'Email', url: 'mailto:hello@example.com', icon: <Mail className="w-5 h-5" /> },
];

export const SYSTEM_INSTRUCTION = `
You are an AI assistant for ${MY_NAME}. 
Your goal is to answer questions about ${MY_NAME}'s applications and services based on the following information:

Name: ${MY_NAME}
Role: ${MY_ROLE}
Bio: ${MY_BIO}

Projects (Our Apps):
${PROJECTS.map(p => `- ${p.title}: ${p.description} (Tech: ${p.tags.join(', ')})`).join('\n')}

Guidelines:
1. Be professional, friendly, and concise.
2. Refer to AfroTech Hub as "we" or "the hub".
3. Only answer questions related to ${MY_NAME}'s apps, technology, and services.
4. If asked about contact info, refer them to the contact section or the email provided.
5. If asked something outside this scope, politely decline and steer the conversation back to our apps.
`;