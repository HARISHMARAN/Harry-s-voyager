
import React, { useState } from 'react';
import { UserPreferences, TripItinerary } from '../types';
import { generateBriefingAudio } from '../services/geminiService';
import { playBriefing } from '../services/voiceService';
import { AssistantInterface } from './AssistantInterface';

interface DashboardProps {
  preferences: UserPreferences;
  itinerary: TripItinerary | null;
  setItinerary: React.Dispatch<React.SetStateAction<TripItinerary | null>>;
}

const Dashboard: React.FC<DashboardProps> = ({ preferences, itinerary, setItinerary }) => {
  const [activeDay, setActiveDay] = useState(1);
  const [isBriefing, setIsBriefing] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const activeDayPlan = itinerary?.days.find(d => d.dayNumber === activeDay) || itinerary?.days[0];

  const handleVoiceBriefing = async () => {
    if (!activeDayPlan) return;
    setIsBriefing(true);
    try {
      const briefingText = `Day ${activeDayPlan.dayNumber} in ${itinerary?.location}. Your morning begins at ${activeDayPlan.items[0].time} with ${activeDayPlan.items[0].title}. ${activeDayPlan.items[0].description}`;
      const base64 = await generateBriefingAudio(briefingText);
      if (base64) {
        await playBriefing(base64);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsBriefing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col pb-24">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-background-dark/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="text-xl font-display font-bold text-white tracking-tight">Voyager.ai</span>
          <div className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest text-slate-500">
            <span className="text-primary border-b border-primary pb-1">Orchestration</span>
            <span className="hover:text-white cursor-pointer transition-all">Transport</span>
            <span className="hover:text-white cursor-pointer transition-all">Events</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsAssistantOpen(true)}
            className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full hover:bg-primary/20 transition-all group"
          >
            <span className="material-symbols-outlined text-primary text-sm group-hover:rotate-12 transition-all">auto_awesome</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Voyager Assistant</span>
          </button>
          <div className="size-10 rounded-full border border-white/10 overflow-hidden shadow-2xl">
            <img src="https://picsum.photos/seed/voyager/100/100" alt="User" />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1700px] mx-auto w-full p-6 lg:p-12 flex flex-col lg:flex-row gap-12">
        {/* Logistics Panel */}
        <aside className="w-full lg:w-80 flex flex-col gap-8 shrink-0">
          <section>
            <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Trip Overview</p>
            <h1 className="text-3xl font-display font-bold mb-1">{itinerary?.location}</h1>
            <p className="text-slate-500 text-sm italic font-accent">{itinerary?.dates}</p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
               <span className="material-symbols-outlined text-sm text-primary">route</span> Transport Optimization
            </h3>
            
            <div className="space-y-4">
              {itinerary?.doorToDoor.outbound.map((segment, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i < (itinerary.doorToDoor.outbound.length - 1) && (
                    <div className="absolute left-4 top-10 bottom-0 w-px border-l border-dashed border-white/20"></div>
                  )}
                  <div className={`size-8 rounded-full flex items-center justify-center shrink-0 border border-white/10 ${segment.type === 'FLIGHT' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-400'}`}>
                    <span className="material-symbols-outlined text-lg">
                      {segment.type === 'TAXI' ? 'taxi_alert' : segment.type === 'FLIGHT' ? 'flight' : 'train'}
                    </span>
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-white">{segment.label}</p>
                      <span className="text-[10px] font-mono text-primary">{segment.cost}</span>
                    </div>
                    <p className="text-xs text-slate-500">{segment.duration} • {segment.notes || 'Optimized'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
             {itinerary?.aiInsights.map((insight, i) => (
                <div key={i} className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${insight.priority === 'HIGH' ? 'bg-orange-500/10 border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.05)]' : 'bg-white/5 border-white/10'}`}>
                    <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${insight.priority === 'HIGH' ? 'text-orange-500' : 'text-primary'}`}>{insight.title}</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{insight.message}</p>
                </div>
             ))}
          </section>
        </aside>

        {/* Timeline Center */}
        <section className="flex-1">
          <div className="flex gap-10 border-b border-white/5 mb-12 overflow-x-auto custom-scrollbar">
            {itinerary?.days.map(day => (
              <button 
                key={day.dayNumber}
                onClick={() => setActiveDay(day.dayNumber)}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${activeDay === day.dayNumber ? 'border-primary text-primary' : 'border-transparent text-slate-600 hover:text-slate-400'}`}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>

          <div className="space-y-16 relative">
            <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-primary/50 via-white/5 to-transparent"></div>
            
            {activeDayPlan?.items.map((item, idx) => (
              <div key={idx} className="relative pl-16 group animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="absolute left-[19px] top-2 size-3 rounded-full bg-background-dark border-2 border-primary ring-8 ring-primary/5 group-hover:scale-125 transition-all"></div>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <span className="text-[10px] font-mono text-primary font-bold tracking-[0.3em] uppercase">{item.time} — {item.period}</span>
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight">{item.title}</h2>
                  </div>

                  <div className={`max-w-4xl rounded-2xl overflow-hidden bg-[#141210] border border-white/5 shadow-2xl transition-all hover:border-white/10 ${item.imageUrl ? 'flex flex-col md:flex-row' : 'p-8'}`}>
                    {item.imageUrl && (
                      <div className="md:w-2/5 h-64 md:h-auto">
                         <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                      </div>
                    )}
                    <div className={`flex-1 flex flex-col justify-center ${item.imageUrl ? 'p-8' : ''}`}>
                       <p className="text-lg font-accent italic text-slate-300 leading-relaxed mb-6">"{item.description}"</p>
                       <div className="flex flex-wrap gap-4">
                          <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2">
                             <span className="material-symbols-outlined text-sm text-primary">wifi</span>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.meta?.wifi || 'Available'}</span>
                          </div>
                          <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2">
                             <span className="material-symbols-outlined text-sm text-primary">distance</span>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.meta?.distance || '15 min walk'}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 flex flex-col gap-8 shrink-0">
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Accommodation</h3>
               <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-bold border border-primary/20">CONFIRMED</span>
             </div>
             <div className="space-y-4">
               <img src={itinerary?.accommodation.imageUrl} alt="Hotel" className="w-full h-40 object-cover rounded-xl border border-white/10" />
               <div>
                  <h4 className="text-xl font-display font-bold text-white">{itinerary?.accommodation.name}</h4>
                  <p className="text-xs text-slate-500 mb-4">{itinerary?.accommodation.location}</p>
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-[10px] font-bold uppercase tracking-widest border border-white/10">Digital Key Loaded</button>
               </div>
             </div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">Financial Intelligence</h3>
             <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">USD</p>
                  <p className="text-2xl font-display">1.00</p>
                </div>
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">swap_horiz</span>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">{itinerary?.essentials.currency.to}</p>
                  <p className="text-2xl font-display">{itinerary?.essentials.currency.rate}</p>
                </div>
             </div>
          </section>
        </aside>
      </main>

      <AssistantInterface isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />

      <footer className="fixed bottom-0 left-0 right-0 bg-background-dark/90 backdrop-blur-3xl border-t border-white/5 z-50 py-6 px-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-6">
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] border border-white/10 transition-all">
              <span className="material-symbols-outlined text-lg">download</span>
              <span>Export PDF</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] border border-white/10 transition-all">
              <span className="material-symbols-outlined text-lg">share</span>
              <span>Share Trip</span>
            </button>
          </div>
          <button 
            onClick={handleVoiceBriefing}
            disabled={isBriefing}
            className="group relative flex items-center gap-3 px-10 py-4 rounded-2xl bg-primary text-background-dark text-xs font-bold uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20 disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-white/20 rounded-2xl scale-0 group-hover:scale-100 transition-all origin-center"></div>
            <span className="material-symbols-outlined text-xl">{isBriefing ? 'hourglass_top' : 'mic'}</span>
            <span>{isBriefing ? 'Briefing Live...' : 'Concierge Briefing'}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
