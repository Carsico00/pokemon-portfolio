import React, { useState } from 'react';
import type { ReactNode } from 'react';
import type { Pokemon, BattleState } from '../types/pokemon';
import { PLAYER_POKEMON } from '../data/pokemon';
import { GameContext, type GameContextType } from './GameContext';

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameContextType['gameState']>(
    'selection'
  );
  const [playerPokemon, setPlayerPokemonState] = useState<Pokemon>(PLAYER_POKEMON[0]);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [gymDefeated, setGymDefeated] = useState(false);
  const [visitedHouses, setVisitedHouses] = useState<string[]>([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [caughtPokemon, setCaughtPokemon] = useState<Pokemon[]>([]);
  
  // Cynthia Battle
  const [cynthiaDefeated, setCynthiaDefeated] = useState(false);
  const [cynthiaTeam, setCynthiaTeam] = useState<Pokemon[]>([]);
  const [playerCynthiaTeam, setPlayerCynthiaTeam] = useState<Pokemon[]>([]);

  const setPlayerPokemon = (pokemon: Pokemon) => {
    setPlayerPokemonState(pokemon);
    setGameState('exploring');
  };

  const addExperience = (amount: number) => {
    setPlayerPokemonState((prev) => ({
      ...prev,
      experience: prev.experience + amount,
      level: Math.floor((prev.experience + amount) / 100) + 1,
      maxHp: Math.floor((prev.maxHp * (prev.level + 1)) / prev.level),
      hp: Math.floor((prev.hp * (prev.level + 1)) / prev.level),
      attack: Math.floor((prev.attack * (prev.level + 1)) / prev.level),
      defense: Math.floor((prev.defense * (prev.level + 1)) / prev.level),
      spAtk: Math.floor((prev.spAtk * (prev.level + 1)) / prev.level),
      spDef: Math.floor((prev.spDef * (prev.level + 1)) / prev.level),
      speed: Math.floor((prev.speed * (prev.level + 1)) / prev.level),
    }));
  };

  const addCaughtPokemon = (pokemon: Pokemon) => {
    setCaughtPokemon((prev) => [...prev, pokemon]);
  };

  const startBattle = (opponentPokemon: Pokemon) => {
    const newBattleState: BattleState = {
      playerPokemon: playerPokemon,
      opponentPokemon: opponentPokemon,
      playerHp: playerPokemon.hp,
      opponentHp: opponentPokemon.hp,
      currentTurn: 'player',
      battleLog: [`¡${opponentPokemon.name} apareció!`],
      isOver: false,
    };
    setBattleState(newBattleState);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        playerPokemon,
        setPlayerPokemon,
        battleState,
        setBattleState,
        startBattle,
        gymDefeated,
        setGymDefeated,
        visitedHouses,
        setVisitedHouses,
        playerPosition,
        setPlayerPosition,
        addExperience,
        caughtPokemon,
        addCaughtPokemon,
        // Cynthia
        cynthiaDefeated,
        setCynthiaDefeated,
        cynthiaTeam,
        setCynthiaTeam,
        playerCynthiaTeam,
        setPlayerCynthiaTeam,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
