
import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { INITIAL_PREFERENCES } from '../constants';

interface OnboardingProps {
  onComplete: (prefs: UserPreferences) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  // Assert type to satisfy required travelerCount in UserPreferences
  const [prefs, setPrefs] = useState<UserPreferences>(INITIAL_PREFERENCES as UserPreferences);

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
    else onComplete(prefs);
  };

  return (
    <div className="min-h-screen sunset-gradient flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] size-[800px] bg-primary/5 blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-20%] left-[-5%] size-[600px] bg-orange-900/10 blur-[130px] rounded-full opacity-40"></div>
      </div>

      <header className="px-8 py-6 flex justify-between items-center border-b border-white/5">
        <span className="text-xl font-display font-bold text-white">Voyager.ai</span>
        <div className="flex items-center gap-2">
            <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${(step/4)*100}%` }}
                ></div>
            </div>
            <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Step 0{step} / 04</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full flex flex-col gap-12">
            
            {step === 1 && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-start gap-6">
                        <div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 float-animation shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                            <span className="material-symbols-outlined text-primary">auto_awesome</span>
                        </div>
                        <div className="flex-1">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold block mb-2">Concierge Intelligence</span>
                            <div className="glass-panel p-8 rounded-3xl rounded-tl-none border-primary/20 bg-slate-900/40 backdrop-blur-xl border border-white/10">
                                <h2 className="text-4xl font-display leading-tight mb-4 text-white">
                                    To begin, could you provide your <span className="text-primary">postcode</span>?
                                </h2>
                                <p className="text-slate-400 text-lg">This helps us synchronize travel logistics from your exact local area.</p>
                            </div>
                        </div>
                    </div>
                    <div className="ml-20 max-w-md">
                        <input 
                            type="text" 
                            autoFocus
                            placeholder="Enter postcode (e.g. SW1A)" 
                            className="w-full h-16 bg-background-dark border border-white/10 rounded-2xl px-6 text-xl text-white focus:border-primary/50 focus:ring-0 transition-all mb-4"
                            value={prefs.postcode}
                            onChange={e => setPrefs({...prefs, postcode: e.target.value})}
                        />
                        <button 
                            onClick={nextStep}
                            disabled={!prefs.postcode}
                            className="w-full h-16 bg-gradient-to-r from-primary to-orange-600 rounded-2xl font-bold text-white flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-xl shadow-primary/10"
                        >
                            Securely Continue <span className="material-symbols-outlined">arrow_right_alt</span>
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-4xl font-display text-white text-center">Where would you like to explore?</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {['Tokyo & Kyoto', 'Paris & Riviera', 'New York City', 'Amalfi Coast'].map(dest => (
                            <button 
                                key={dest}
                                onClick={() => { setPrefs({...prefs, destination: dest}); nextStep(); }}
                                className={`p-8 rounded-2xl glass border transition-all text-left group ${prefs.destination === dest ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/30'}`}
                            >
                                <span className="text-xl font-display block mb-1">{dest}</span>
                                <span className="text-xs text-slate-500 uppercase tracking-widest group-hover:text-primary transition-colors">Select Location</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-4xl font-display text-white text-center">Set your travel <span className="text-primary italic">mood</span></h2>
                    <div className="grid grid-cols-2 gap-4">
                        {['Adventurous', 'Relaxed', 'Cultural', 'Luxury'].map((m: any) => (
                            <button 
                                key={m}
                                onClick={() => { setPrefs({...prefs, mood: m}); nextStep(); }}
                                className={`p-8 rounded-2xl glass border transition-all text-left ${prefs.mood === m ? 'border-primary bg-primary/10' : 'border-white/10'}`}
                            >
                                <span className="text-xl font-display block">{m}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-4xl font-display text-white text-center">Finalizing your profile</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-primary uppercase tracking-widest block mb-3">Companion</label>
                            <div className="flex gap-2">
                                {['Solo', 'Partner', 'Family', 'Friends'].map((c: any) => (
                                    <button 
                                        key={c}
                                        onClick={() => setPrefs({...prefs, companion: c})}
                                        className={`px-6 py-3 rounded-full border text-sm transition-all ${prefs.companion === c ? 'bg-primary border-primary text-white' : 'border-white/10 text-slate-400'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-primary uppercase tracking-widest block mb-3">Budget Tier</label>
                            <div className="flex gap-2">
                                {['Economy', 'Business', 'Elite'].map((b: any) => (
                                    <button 
                                        key={b}
                                        onClick={() => setPrefs({...prefs, budget: b})}
                                        className={`px-6 py-3 rounded-full border text-sm transition-all ${prefs.budget === b ? 'bg-primary border-primary text-white' : 'border-white/10 text-slate-400'}`}
                                    >
                                        {b}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={nextStep}
                        className="mt-8 w-full h-16 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Generate My Itinerary
                    </button>
                </div>
            )}

        </div>
      </main>

      <footer className="p-8 flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-[0.25em] font-bold">
        <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
            Engine Online
        </div>
        <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px]">verified_user</span>
            Encrypted Session
        </div>
        <div>Experts on standby</div>
      </footer>
    </div>
  );
};

export default Onboarding;
