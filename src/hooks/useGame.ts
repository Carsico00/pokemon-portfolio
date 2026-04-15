import { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import type { GameContextType } from '../contexts/GameContext';

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
