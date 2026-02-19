
import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { INITIAL_PREFERENCES } from '../constants';

interface PlanningWizardProps {
  onComplete: (prefs: UserPreferences) => void;
}

const PlanningWizard: React.FC<PlanningWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<UserPreferences>({
    ...INITIAL_PREFERENCES,
    travelerCount: 1,
    dietary: []
  });

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => Math.max(1, s - 1));

  const steps = [
    { title: "Origins", desc: "Where are you starting from?" },
    { title: "Destinations", desc: "Where is the heart calling?" },
    { title: "Companions", desc: "Who is joining the voyage?" },
    { title: "Mood & Vibe", desc: "What kind of energy are we chasing?" },
    { title: "Logistics", desc: "Budget and constraints." }
  ];

  return (
    <div className="min-h-screen sunset-gradient flex flex-col p-6 md:p-12">
      <header className="flex justify-between items-center mb-12">
        <span className="text-2xl font-display font-bold text-white">Voyager.ai</span>
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 w-8 rounded-full transition-all ${step > i ? 'bg-primary' : 'bg-white/10'}`}></div>
          ))}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center max-w-4xl mx-auto w-full">
        <div className="w-full">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">Phase 0{step}</p>
          <h1 className="text-5xl font-display font-bold text-white mb-2">{steps[step-1].title}</h1>
          <p className="text-slate-400 text-lg mb-12">{steps[step-1].desc}</p>

          <div className="min-h-[300px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            {step === 1 && (
              <div className="space-y-6">
                <input 
                  type="text" 
                  placeholder="Enter Postcode" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-2xl text-white outline-none focus:border-primary/50 transition-all"
                  value={prefs.postcode}
                  onChange={e => setPrefs({...prefs, postcode: e.target.value})}
                  autoFocus
                />
                <p className="text-sm text-slate-500 italic">We use this to calculate taxi routes and nearest airport clusters.</p>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Tokyo & Kyoto', 'Paris & Riviera', 'Amalfi Coast', 'Iceland Ring Road'].map(d => (
                  <button 
                    key={d}
                    onClick={() => setPrefs({...prefs, destination: d})}
                    className={`p-8 rounded-2xl border text-left transition-all ${prefs.destination === d ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                  >
                    <span className="text-xl font-display text-white">{d}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Solo', 'Partner', 'Family', 'Friends'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setPrefs({...prefs, companion: c as any})}
                      className={`p-6 rounded-xl border text-center transition-all ${prefs.companion === c ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5'}`}
                    >
                      <span className="text-sm font-bold text-white uppercase tracking-wider">{c}</span>
                    </button>
                  ))}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-4 block">Traveler Count</label>
                  <input 
                    type="range" min="1" max="12" step="1"
                    className="w-full accent-primary"
                    value={prefs.travelerCount}
                    onChange={e => setPrefs({...prefs, travelerCount: parseInt(e.target.value)})}
                  />
                  <div className="text-center mt-2 text-2xl font-display text-white">{prefs.travelerCount} Persons</div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="grid grid-cols-2 gap-4">
                {['Adventurous', 'Relaxed', 'Cultural', 'Luxury'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setPrefs({...prefs, mood: m as any})}
                    className={`p-10 rounded-2xl border text-left transition-all ${prefs.mood === m ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5'}`}
                  >
                    <span className="text-2xl font-display text-white">{m}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-8">
                <div className="flex gap-4">
                  {['Economy', 'Business', 'Elite'].map(b => (
                    <button 
                      key={b}
                      onClick={() => setPrefs({...prefs, budget: b as any})}
                      className={`flex-1 p-6 rounded-xl border transition-all ${prefs.budget === b ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5'}`}
                    >
                      <span className="text-sm font-bold text-white uppercase tracking-widest">{b}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['Cheapest', 'Fastest', 'Balanced'].map(mode => (
                    <button 
                      key={mode}
                      onClick={() => setPrefs({...prefs, travelMode: mode as any})}
                      className={`p-6 rounded-xl border transition-all ${prefs.travelMode === mode ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5'}`}
                    >
                      <span className="text-sm font-bold text-white">{mode}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 flex justify-between">
            <button 
              onClick={back}
              className={`text-slate-500 font-bold uppercase tracking-widest hover:text-white transition-all ${step === 1 ? 'opacity-0' : ''}`}
            >
              Back
            </button>
            <button 
              onClick={step === 5 ? () => onComplete(prefs) : next}
              className="bg-primary text-white px-12 py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              {step === 5 ? 'Orchestrate Voyage' : 'Continue'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlanningWizard;
