
import React, { useState, useEffect } from 'react';

const GenerationOverlay: React.FC = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Resolving postcode geolocation...",
    "Scanning nearest airport availability...",
    "Calculating door-to-door logistics...",
    "Optimizing hotel proximity to interest clusters...",
    "Aggregating local cultural events...",
    "Fetching real-time currency & eSIM plans...",
    "Synthesizing personalized AI Briefing..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % steps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-background-dark flex flex-col items-center justify-center p-12 overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
      </div>
      
      <div className="relative size-32 mb-12">
        <div className="absolute inset-0 border-[6px] border-white/5 rounded-full"></div>
        <div className="absolute inset-0 border-[6px] border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-4 bg-white/5 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-4xl animate-pulse">auto_awesome</span>
        </div>
      </div>

      <div className="text-center max-w-md">
        <h2 className="text-3xl font-display font-bold text-white mb-4">Voyager OS v2.5</h2>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-8">
            <div className="h-full bg-primary transition-all duration-500 ease-in-out" style={{ width: `${((step + 1) / steps.length) * 100}%` }}></div>
        </div>
        <p className="text-slate-400 font-mono text-sm tracking-widest uppercase transition-all animate-in fade-in slide-in-from-bottom-2">
            {steps[step]}
        </p>
      </div>
    </div>
  );
};

export default GenerationOverlay;
