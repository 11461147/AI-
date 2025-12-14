import React from 'react';

interface ControlsProps {
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  toggleNotes: () => void;
  showNotes: boolean;
  canNext: boolean;
  canPrev: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  onNext, 
  onPrev, 
  onExit, 
  toggleNotes, 
  showNotes,
  canNext, 
  canPrev 
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-slate-900/90 p-3 rounded-full border border-slate-700 shadow-2xl backdrop-blur-md">
      
      <button 
        onClick={onExit}
        className="p-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-full transition-colors"
        title="Exit Presentation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </button>

      <div className="h-6 w-px bg-slate-700 mx-1"></div>

      <button 
        onClick={onPrev}
        disabled={!canPrev}
        className={`p-3 rounded-full transition-all ${canPrev ? 'text-slate-200 hover:bg-blue-600 hover:text-white' : 'text-slate-600 cursor-not-allowed'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <button 
        onClick={toggleNotes}
        className={`p-3 rounded-full transition-colors ${showNotes ? 'text-yellow-400 bg-slate-800' : 'text-slate-400 hover:text-yellow-200 hover:bg-slate-800'}`}
        title="Toggle Speaker Notes"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      </button>

      <button 
        onClick={onNext}
        disabled={!canNext}
        className={`p-3 rounded-full transition-all ${canNext ? 'text-slate-200 hover:bg-blue-600 hover:text-white' : 'text-slate-600 cursor-not-allowed'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>

    </div>
  );
};

export default Controls;