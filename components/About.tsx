import React from 'react';
import { Globe, Users, Zap, Award, ArrowLeft, Target, Lightbulb } from 'lucide-react';
import { ViewState, SectionId } from '../types';
import { MY_NAME } from '../constants';

interface AboutProps {
  onNavigate: (view: ViewState) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white animate-fade-in-up">
      {/* Header / Nav Area */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-md z-30 flex items-center px-4 md:px-8 border-b border-slate-100">
         <div className="max-w-7xl mx-auto w-full flex items-center">
            <button 
              onClick={() => onNavigate(ViewState.HOME)}
              className="group flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-medium"
            >
              <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                 <ArrowLeft className="w-5 h-5" />
              </div>
              Back to Home
            </button>
         </div>
      </div>

      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3">
               <Globe className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6 leading-tight">
              We Are <span className="text-primary">{MY_NAME}</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed font-light">
              A forward-thinking digital studio blending creativity with engineering excellence. 
              We build software that matters, empowering businesses through transformative technology.
            </p>
          </div>

          {/* Grid Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
               <h3 className="text-2xl font-bold font-display text-slate-900 mb-4 flex items-center gap-3">
                 <Target className="w-6 h-6 text-primary" /> Our Mission
               </h3>
               <p className="text-slate-600 leading-relaxed text-lg">
                 To democratize access to high-quality digital solutions. We believe that powerful technology shouldn't be complicated. 
                 Whether it's AI integration, intuitive mobile apps, or complex enterprise systems, our goal is to make the digital future accessible to everyone.
               </p>
            </div>
             <div className="bg-secondary rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               <h3 className="text-2xl font-bold font-display text-white mb-4 flex items-center gap-3 relative z-10">
                 <Lightbulb className="w-6 h-6 text-accent" /> Our Vision
               </h3>
               <p className="text-slate-300 leading-relaxed text-lg relative z-10">
                 We envision a world where technology adapts to human needs, not the other way around. 
                 By leveraging cutting-edge tools like the Gemini API and React ecosystem, we are crafting the next generation of intelligent, responsive applications.
               </p>
            </div>
          </div>

          {/* Stats / Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
             <div className="text-center p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                   <Users className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">User Centric</h4>
                <p className="text-slate-500 text-sm">Every pixel is crafted with the end-user in mind, ensuring intuitive and engaging experiences.</p>
             </div>
             <div className="text-center p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
                   <Zap className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">High Performance</h4>
                <p className="text-slate-500 text-sm">Optimized for speed and scalability, our applications handle growth effortlessly.</p>
             </div>
             <div className="text-center p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                   <Award className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Quality First</h4>
                <p className="text-slate-500 text-sm">We adhere to rigorous coding standards and testing practices to deliver robust software.</p>
             </div>
          </div>

          {/* CTA */}
          <div className="bg-slate-900 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/10"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
               <h2 className="text-3xl font-display font-bold text-white mb-6">Ready to work with us?</h2>
               <p className="text-slate-300 mb-8 text-lg">
                 Join the hundreds of businesses that have transformed their digital presence with {MY_NAME}.
               </p>
               <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => onNavigate(ViewState.REGISTER)}
                    className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-primary/25"
                  >
                    Join Now
                  </button>
                  <button 
                    onClick={() => {
                      onNavigate(ViewState.HOME);
                      setTimeout(() => {
                        const element = document.getElementById(SectionId.CONTACT);
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="px-8 py-3 bg-white/10 backdrop-blur text-white font-bold rounded-full hover:bg-white/20 transition-colors border border-white/20"
                  >
                    Contact Us
                  </button>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;