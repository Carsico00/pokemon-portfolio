import { createContext } from 'react';
import type { Pokemon, BattleState } from '../types/pokemon';

interface GameContextType {
  gameState: 'selection' | 'exploring' | 'battle' | 'house' | 'victory' | 'defeat' | 'cynthia_arena' | 'cynthia_team_select' | 'cynthia_battle';
  playerPokemon: Pokemon;
  setPlayerPokemon: (pokemon: Pokemon) => void;
  battleState: BattleState | null;
  setBattleState: (state: BattleState | null) => void;
  startBattle: (opponentPokemon: Pokemon) => void;
  gymDefeated: boolean;
  setGymDefeated: (defeated: boolean) => void;
  visitedHouses: string[];
  setVisitedHouses: (houses: string[]) => void;
  playerPosition: { x: number; y: number };
  setPlayerPosition: (pos: { x: number; y: number }) => void;
  addExperience: (amount: number) => void;
  caughtPokemon: Pokemon[];
  addCaughtPokemon: (pokemon: Pokemon) => void;
  // Cynthia Battle
  cynthiaDefeated: boolean;
  setCynthiaDefeated: (defeated: boolean) => void;
  cynthiaTeam: Pokemon[];
  setCynthiaTeam: (team: Pokemon[]) => void;
  playerCynthiaTeam: Pokemon[];
  setPlayerCynthiaTeam: (team: Pokemon[]) => void;
}

export type { GameContextType };

export const GameContext = createContext<GameContextType | undefined>(undefined);
