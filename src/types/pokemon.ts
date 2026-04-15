export type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'grass' | 'electric' 
  | 'ice' | 'fighting' | 'poison' | 'ground' | 'flying'
  | 'psychic' | 'bug' | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export type Move = {
  id: string;
  name: string;
  type: PokemonType;
  power: number;
  accuracy: number;
  pp: number;
  maxPp: number;
  priority: number;
  target: 'specific' | 'self' | 'opponent';
  description: string;
  damageClass: 'physical' | 'special' | 'status';
};

export type MegaEvolution = {
  megaName: string;
  megaType: PokemonType;
  megaAttack: number;
  megaDefense: number;
  megaSpAtk: number;
  megaSpDef: number;
  megaSpeed: number;
  megaSpriteId: number;
};

export type Pokemon = {
  id: string;
  name: string;
  level: number;
  type: PokemonType;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  spAtk: number;
  spDef: number;
  speed: number;
  moves: Move[];
  experience: number;
  avatar: string;
  spriteFront?: string;
  spriteBack?: string;
  spriteFrontFallback?: string;
  spriteBackFallback?: string;
  mega?: MegaEvolution;
  isMega?: boolean;
};

export type BattleState = {
  playerPokemon: Pokemon;
  opponentPokemon: Pokemon;
  playerHp: number;
  opponentHp: number;
  currentTurn: 'player' | 'opponent';
  battleLog: string[];
  isOver: boolean;
  winner?: 'player' | 'opponent';
};

export type Player = {
  name: string;
  position: { x: number; y: number };
  pokemon: Pokemon[];
};
