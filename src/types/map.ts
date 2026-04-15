export type Location = 'outside' | 'house' | 'gym' | 'cynthia_arena';

export type MapTile = {
  x: number;
  y: number;
  type: 'grass' | 'water' | 'building' | 'gym' | 'path' | 'arena';
  location?: Location | undefined;
  npc?: string | undefined;
};

export type House = {
  id: string;
  name: string;
  x: number;
  y: number;
  description: string;
};

export type Gym = {
  id: string;
  name: string;
  x: number;
  y: number;
  gymLeader: string;
  defeated: boolean;
};

export type CynthiaArena = {
  id: string;
  name: string;
  x: number;
  y: number;
  champion: string;
  defeated: boolean;
};

export type GameMap = {
  width: number;
  height: number;
  tiles: MapTile[][];
  houses: House[];
  gym: Gym;
  cynthiaArena?: CynthiaArena;
};
