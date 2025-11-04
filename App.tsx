import React, { useState, useCallback } from 'react';
import { AgentView } from './components/AgentView';
import { GameView } from './components/GameView';
import { VizLabView } from './components/VizLabView';
// Fix: Corrected import path for types.
import { AppMode } from './types';
import { AgentIcon, GamepadIcon, VizLabIcon } from './components/Icons';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('agent');

  const ModeButton = useCallback(<T,>({
    targetMode,
    label,
    icon,
  }: {
    targetMode: AppMode;
    label: string;
    icon: React.ReactNode;
  }) => (
    <button
      onClick={() => setMode(targetMode)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
        mode === targetMode
          ? 'bg-cyan-400 text-gray-900 shadow-lg shadow-cyan-400/20'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  ), [mode]);

  const renderMode = () => {
    switch(mode) {
      case 'agent':
        return <AgentView />;
      case 'game':
        return <GameView />;
      case 'vizlab':
        return <VizLabView />;
      default:
        return <AgentView />;
    }
  }

  return (
    <div className="flex flex-col h-screen font-sans text-gray-200 bg-gray-900">
      <header className="flex items-center justify-between p-3 border-b border-gray-700 shadow-md bg-gray-800/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500"></div>
          <h1 className="text-xl font-bold tracking-wider text-white">Project Neon Quant</h1>
        </div>
        <div className="flex items-center p-1 space-x-1 bg-gray-800 rounded-lg">
          <ModeButton targetMode="agent" label="Agent Mode" icon={<AgentIcon />} />
          <ModeButton targetMode="game" label="Game Mode" icon={<GamepadIcon />} />
          <ModeButton targetMode="vizlab" label="VizLab" icon={<VizLabIcon />} />
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        {renderMode()}
      </main>
    </div>
  );
};

export default App;
