
import React from 'react';

interface LandingPageProps {
  onPlanClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onPlanClick }) => {
  return (
    <div className="relative">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-none bg-background-dark/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-display font-bold text-white tracking-tight">Voyager.ai</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-primary transition-colors">Flights</a>
            <a href="#" className="hover:text-primary transition-colors">Hotels</a>
            <a href="#" className="hover:text-primary transition-colors">Experiences</a>
            <a href="#" className="hover:text-primary transition-colors">Concierge</a>
          </div>
          <button 
            onClick={onPlanClick}
            className="bg-primary text-white px-6 py-2.5 rounded-md font-medium text-sm hover:brightness-110 transition-all active:scale-95"
          >
            Plan My Trip
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background-dark/20 via-background-dark/60 to-background-dark z-10"></div>
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXLDKsk5a9v4nKru6E9H_dJ50DfwbuZ6lt3ShQG1ifcrc6bNAGZWEpnffY_ZVSL8yDqu-gwD4dlZwlN13I5qLptaAYASCrls6VLYWLSfGds-KvYeSErqxpCB9XfmkwcSzUlCVeihCT5fGfImpYzUoNKGwzMS4wSmSzGmpLq7dIVieibFvwuIXOfrYHS0J7O4Ifw_k7uF21GWWUOxRzE0lmXnKJP0MuY396CxhJsznv7pleI_P-hCIXCEBm1VXBY4owPkqL-ZFKzZU" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 max-w-4xl px-6 text-center">
          <h1 className="font-display text-5xl md:text-8xl font-bold text-white leading-[1.1] mb-8">
            Door-to-Door <br/>
            <span className="text-primary italic">Intelligent</span> Travel
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-normal mb-12 max-w-2xl mx-auto leading-relaxed">
            From your postcode to your return home. Flights. Hotels. Food. Transport. Events. Currency. eSIM. Everything.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onPlanClick}
              className="bg-primary text-white px-10 py-4 rounded-md font-medium text-lg hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all"
            >
              Plan My Trip
            </button>
            <button className="bg-white/5 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-md font-medium text-lg hover:bg-white/10 transition-all">
              Explore Premium
            </button>
          </div>
        </div>
      </header>

      {/* Magnificent 7 Features */}
      <section className="py-24 px-6 bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-primary font-bold tracking-widest text-xs uppercase block mb-4">Exclusives</span>
            <h2 className="font-display text-4xl md:text-6xl font-semibold mb-8">The Magnificent 7</h2>
            <p className="text-slate-400 max-w-2xl text-xl font-normal leading-relaxed">
              Experience the future of travel with our proactive AI-driven suite, meticulously designed for the elite voyager.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              num="01" 
              icon="confirmation_number" 
              title="Live Events Integration" 
              desc="Real-time access to global events, exclusive backstage passes, and seamless instant booking."
            />
            <FeatureCard 
              num="02" 
              icon="mic" 
              title="Voice Agent/Podcast" 
              desc="Personalized audio travel briefings. Wake up to a custom daily podcast of your itinerary."
            />
            <FeatureCard 
              num="03" 
              icon="precision_manufacturing" 
              title="Proactive AI" 
              desc="Automated flight and delay handling. We've rebooked you before the delay hits the board."
            />
            <FeatureCard 
              num="04" 
              icon="face_6" 
              title="Virtual Scheffler" 
              desc="Expertly curated itineraries tailored to your unique taste and deep lifestyle preferences."
            />
            <FeatureCard 
              num="05" 
              icon="restaurant" 
              title="Smart Food Intel" 
              desc="Advanced preference tracking. Every chef on your route is briefed on your palate before you arrive."
            />
            <FeatureCard 
              num="06" 
              icon="language" 
              title="eSIM/Currency Finder" 
              desc="Instant digital connectivity and financial tools that activate the moment you cross a border."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ num, icon, title, desc }: { num: string; icon: string; title: string; desc: string }) => (
  <div className="glass-card p-8 rounded-xl flex flex-col h-full relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
    <div className="absolute top-4 right-4 text-7xl font-display font-bold text-primary/5 group-hover:text-primary/10 transition-colors">{num}</div>
    <span className="material-symbols-outlined text-primary text-4xl mb-6">{icon}</span>
    <h3 className="font-display text-2xl font-semibold mb-4 text-white">{title}</h3>
    <p className="text-slate-400 text-base leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
