import type { GameMap, MapTile } from '../types/map';

export const GAME_MAP: GameMap = {
  width: 12,
  height: 8,
  tiles: [],
  houses: [
    {
      id: 'house-1',
      name: 'Casa del Profesor',
      x: 1,
      y: 1,
      description: 'Casa del profesor Pokémon en donde todo comenzó',
    },
    {
      id: 'house-2',
      name: 'Casa de la Enfermera',
      x: 3,
      y: 5,
      description: 'Centro Pokémon - Recupera a tus Pokémon aquí',
    },
    {
      id: 'house-3',
      name: 'Tienda de Tecnología',
      x: 7,
      y: 2,
      description: 'Compra objetos y equipamiento',
    },
    {
      id: 'house-4',
      name: 'Casa del Coleccionista',
      x: 10,
      y: 4,
      description: 'Colecciona raridades y curiosidades',
    },
  ],
  gym: {
    id: 'gym-1',
    name: 'Gimnasio de la Ciudad',
    x: 8,
    y: 7,
    gymLeader: 'Lance',
    defeated: false,
  },
  cynthiaArena: {
    id: 'cynthia-arena-1',
    name: 'Arena de Cynthia',
    x: 11,
    y: 0,
    champion: 'Cynthia',
    defeated: false,
  },
};

// Generar tiles del mapa
export const initializeMapTiles = (): Array<Array<MapTile>> => {
  const tiles = Array(GAME_MAP.height)
    .fill(null)
    .map((_, y) =>
      Array(GAME_MAP.width)
        .fill(null)
        .map((_, x): MapTile => ({
          x,
          y,
          type: 
            Math.random() > 0.7
              ? ('path' as const)
              : Math.random() > 0.4
                ? ('water' as const)
                : ('grass' as const),
        }))
    );

  // Marcar ubicaciones de casas
  GAME_MAP.houses.forEach((house) => {
    if (tiles[house.y] && tiles[house.y][house.x]) {
      tiles[house.y][house.x].type = 'building' as const;
      tiles[house.y][house.x].location = 'house' as const;
      tiles[house.y][house.x].npc = house.name;
    }
  });

  // Marcar gimnasio
  const gym = GAME_MAP.gym;
  if (tiles[gym.y] && tiles[gym.y][gym.x]) {
    tiles[gym.y][gym.x].type = 'gym' as const;
    tiles[gym.y][gym.x].location = 'gym' as const;
    tiles[gym.y][gym.x].npc = gym.gymLeader;
  }

  // Marcar Arena de Cynthia
  if (GAME_MAP.cynthiaArena) {
    const cynthia = GAME_MAP.cynthiaArena;
    if (tiles[cynthia.y] && tiles[cynthia.y][cynthia.x]) {
      tiles[cynthia.y][cynthia.x].type = 'arena' as const;
      tiles[cynthia.y][cynthia.x].location = 'cynthia_arena' as const;
      tiles[cynthia.y][cynthia.x].npc = cynthia.champion;
    }
  }

  return tiles;
};
