import React from 'react';
import { SOCIALS, MY_NAME } from '../constants';
import { Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-2 mb-4 text-white">
                <Globe className="w-6 h-6 text-primary" />
                <span className="text-lg font-display font-bold">AfroTech Hub</span>
             </div>
             <p className="text-sm leading-relaxed mb-4">
               Innovating for a better digital future. Building scalable, intelligent solutions for the modern web.
             </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Browse Apps</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Developer API</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Connect</h4>
            <div className="flex gap-4">
              {SOCIALS.map(social => (
                <a 
                  key={social.platform} 
                  href={social.url} 
                  className="p-2 bg-slate-800 rounded-full hover:bg-primary hover:text-white transition-all"
                  aria-label={social.platform}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {MY_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;