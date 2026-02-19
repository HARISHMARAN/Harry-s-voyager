
import React, { useState } from 'react';
import { AppState, UserPreferences, TripItinerary } from './types';
import { INITIAL_PREFERENCES, FALLBACK_ITINERARY } from './constants';
import LandingPage from './components/LandingPage';
import PlanningWizard from './components/PlanningWizard';
import GenerationOverlay from './components/GenerationOverlay';
import Dashboard from './components/Dashboard';
import { generateItinerary } from './services/geminiService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppState>(AppState.LANDING);
  const [preferences, setPreferences] = useState<UserPreferences>(INITIAL_PREFERENCES as UserPreferences);
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);

  const startPlanning = () => setCurrentPage(AppState.PLANNING);
  
  const handlePlanningComplete = async (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    setCurrentPage(AppState.GENERATING);
    
    try {
      const result = await generateItinerary(newPrefs);
      setItinerary(result);
      setCurrentPage(AppState.DASHBOARD);
    } catch (error) {
      console.error("Failed to orchestrate trip:", error);
      // Fallback is now correctly typed
      setItinerary(FALLBACK_ITINERARY);
      setCurrentPage(AppState.DASHBOARD);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark selection:bg-primary selection:text-white">
      {currentPage === AppState.LANDING && (
        <LandingPage onPlanClick={startPlanning} />
      )}
      {currentPage === AppState.PLANNING && (
        <PlanningWizard onComplete={handlePlanningComplete} />
      )}
      {currentPage === AppState.GENERATING && (
        <GenerationOverlay />
      )}
      {currentPage === AppState.DASHBOARD && (
        <Dashboard 
          preferences={preferences} 
          itinerary={itinerary} 
          setItinerary={setItinerary}
        />
      )}
    </div>
  );
};

export default App;
