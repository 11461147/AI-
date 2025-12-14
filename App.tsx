import React, { useState, useEffect, useCallback } from 'react';
import { PresentationData, AppState, DEFAULT_PROMPT } from './types';
import { generatePresentationContent } from './services/geminiService';
import Slide from './components/Slide';
import Controls from './components/Controls';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [userInput, setUserInput] = useState<string>(DEFAULT_PROMPT);
  const [apiKey, setApiKey] = useState<string>('');
  const [presentationData, setPresentationData] = useState<PresentationData | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (appState !== AppState.PRESENTING) return;

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          nextSlide();
          break;
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'Escape':
          setAppState(AppState.INPUT);
          break;
        case 'n':
            setShowNotes(prev => !prev);
            break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState, currentSlideIndex, presentationData]);

  const handleGenerate = async () => {
    if (!userInput.trim() || !apiKey.trim()) return;
    
    setAppState(AppState.GENERATING);
    setError(null);
    
    try {
      const data = await generatePresentationContent(userInput, apiKey);
      setPresentationData(data);
      setCurrentSlideIndex(0);
      setAppState(AppState.PRESENTING);
    } catch (err) {
      setError("Failed to generate presentation. Please check your API key and try again.");
      setAppState(AppState.INPUT);
    }
  };

  const nextSlide = useCallback(() => {
    if (presentationData && currentSlideIndex < presentationData.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  }, [presentationData, currentSlideIndex]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  }, [currentSlideIndex]);

  // View: Generating Loading Screen
  if (appState === AppState.GENERATING) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <div className="absolute inset-3 border-t-4 border-purple-500 border-solid rounded-full animate-spin reverse-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Architecting your talk...</h2>
        <p className="text-slate-400">Consulting Gemini for the best flow and analogies.</p>
      </div>
    );
  }

  // View: Presentation Mode
  if (appState === AppState.PRESENTING && presentationData) {
    const currentSlideData = presentationData.slides[currentSlideIndex];
    const progress = ((currentSlideIndex + 1) / presentationData.slides.length) * 100;

    return (
      <div className="min-h-screen bg-slate-950 text-white flex overflow-hidden">
        {/* Main Slide Area */}
        <div className={`flex-grow transition-all duration-300 ease-in-out ${showNotes ? 'w-2/3' : 'w-full'}`}>
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 z-50" style={{ width: `${progress}%` }}></div>
            
            <div className="h-full flex items-center justify-center">
                <Slide 
                    data={currentSlideData} 
                    totalSlides={presentationData.slides.length}
                    currentSlide={currentSlideIndex}
                    isActive={true}
                />
            </div>
        </div>

        {/* Speaker Notes Sidebar */}
        <div className={`fixed right-0 top-0 h-full bg-slate-900 border-l border-slate-800 transition-transform duration-300 ease-in-out z-40 w-full md:w-1/3 flex flex-col ${showNotes ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/90 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Speaker Notes</h3>
                <button onClick={() => setShowNotes(false)} className="text-slate-500 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div className="p-8 overflow-y-auto flex-grow prose prose-invert prose-lg">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {currentSlideData.speakerNotes}
                </p>
                
                <div className="mt-8 pt-6 border-t border-slate-800">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Key Takeaway</h4>
                    <p className="text-yellow-200/90 italic">{currentSlideData.keyMessage}</p>
                </div>
            </div>
        </div>

        <Controls 
            onNext={nextSlide} 
            onPrev={prevSlide} 
            onExit={() => setAppState(AppState.INPUT)}
            toggleNotes={() => setShowNotes(!showNotes)}
            showNotes={showNotes}
            canNext={currentSlideIndex < presentationData.slides.length - 1}
            canPrev={currentSlideIndex > 0}
        />
      </div>
    );
  }

  // View: Input / Setup
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-4xl w-full">
        <header className="mb-12 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 mb-4 tracking-tight">
                AI Presentation Architect
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                Transform your raw ideas into a structured, persuasive slide deck instantly.
            </p>
        </header>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-1 shadow-2xl">
            <div className="bg-slate-900/80 rounded-xl p-6 md:p-8">
                <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                    Your Topic & Rough Notes
                </label>
                <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="w-full h-64 md:h-80 bg-slate-950 text-slate-100 p-6 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none text-lg leading-relaxed font-mono"
                    placeholder="Enter your presentation topic and key points here..."
                />
                
                <label className="block text-sm font-semibold text-slate-300 mb-3 mt-6 uppercase tracking-wider">
                    Gemini API Key
                </label>
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 p-4 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-lg"
                    placeholder="Enter your Gemini API key..."
                />
                
                {error && (
                    <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {error}
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-slate-900"
                    >
                        <span>Generate Deck</span>
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </button>
                </div>
            </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-slate-500 text-sm">
            <div className="p-4 bg-slate-800/30 rounded-lg">
                <strong className="block text-slate-300 text-lg mb-1">Structured Flow</strong>
                AI organizes your scattered thoughts into a logical narrative.
            </div>
            <div className="p-4 bg-slate-800/30 rounded-lg">
                <strong className="block text-slate-300 text-lg mb-1">Key Takeaways</strong>
                Automatically extracts the core message for each slide.
            </div>
            <div className="p-4 bg-slate-800/30 rounded-lg">
                <strong className="block text-slate-300 text-lg mb-1">Speaker Notes</strong>
                Generates a script so you know exactly what to say.
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;