// PokéAPI Service - Pokémon Champion Battle (All Generations)

import type { Pokemon, Move, PokemonType, MegaEvolution } from '../types/pokemon';

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

// Gen IV Diamond/Pearl sprites
const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export interface PokeAPIData {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  stats: Array<{ base_stat: number; stat: { name: string } }>;
  sprites: {
    front_default: string;
    back_default: string;
    versions?: {
      'generation-iv'?: {
        'diamond-pearl'?: {
          front_default: string;
          back_default: string;
        };
      };
    };
  };
  moves: Array<{
    move: { name: string; url: string };
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: { name: string };
      version_group: { name: string };
    }>;
  }>;
}

export interface MoveData {
  id: number;
  name: string;
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  type: { name: string };
  damage_class: { name: string };
}

// Cache
const cache = new Map<string, unknown>();

async function fetchCached<T>(url: string): Promise<T | null> {
  if (cache.has(url)) return cache.get(url) as T;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    cache.set(url, data);
    return data as T;
  } catch {
    return null;
  }
}

export async function getPokemon(id: number): Promise<PokeAPIData | null> {
  return fetchCached<PokeAPIData>(`${POKEAPI_BASE}/pokemon/${id}`);
}

export async function getMoveData(name: string): Promise<MoveData | null> {
  return fetchCached<MoveData>(`${POKEAPI_BASE}/move/${name}`);
}

// Get Gen IV sprite URLs
export function getSpriteFront(id: number): string {
  return `${SPRITE_BASE}/versions/generation-iv/diamond-pearl/${id}.png`;
}

export function getSpriteBack(id: number): string {
  return `${SPRITE_BASE}/back/${id}.png`;
}

export function getSpriteFrontFallback(id: number): string {
  return `${SPRITE_BASE}/${id}.png`;
}

export function getSpriteBackFallback(id: number): string {
  return `${SPRITE_BASE}/versions/generation-iv/diamond-pearl/back/${id}.png`;
}

export function getOfficialArtwork(id: number): string {
  return `${SPRITE_BASE}/other/official-artwork/${id}.png`;
}

// ???'s team with their actual levels and moves
interface CynthiaEntry {
  id: number;
  level: number;
  moveNames: string[];
  mega?: MegaEvolution;
}

const CYNTHIA_TEAM_DP: CynthiaEntry[] = [
  { id: 350, level: 65, moveNames: ['surf', 'ice-beam', 'recover', 'dragon-pulse'] }, // Milotic
  { id: 94, level: 65, moveNames: ['shadow-ball', 'sludge-bomb', 'thunderbolt', 'focus-blast'] }, // Gengar
  { id: 448, level: 65, moveNames: ['aura-sphere', 'flash-cannon', 'dragon-pulse', 'extreme-speed'] }, // Lucario
  { id: 6, level: 66, moveNames: ['flamethrower', 'air-slash', 'dragon-pulse', 'solar-beam'],
    mega: {
      megaName: 'Mega Charizard X',
      megaType: 'fire' as PokemonType,
      megaAttack: 130,
      megaDefense: 111,
      megaSpAtk: 130,
      megaSpDef: 85,
      megaSpeed: 100,
      megaSpriteId: 10034,
    }
  }, // Charizard -> Mega Charizard X
  { id: 407, level: 65, moveNames: ['energy-ball', 'sludge-bomb', 'shadow-ball', 'dazzling-gleam'] }, // Roserade
  { id: 491, level: 66, moveNames: ['dark-void', 'dark-pulse', 'shadow-ball', 'dream-eater'] }, // Darkrai
];

// Good Sinnoh Pokémon pool for the player
const PLAYER_POOL_IDS = [
  389, // Torterra
  392, // Infernape
  395, // Empoleon
  398, // Staraptor
  405, // Luxray
  407, // Roserade
  409, // Rampardos
  416, // Vespiquen
  419, // Floatzel
  423, // Gastrodon
  428, // Lopunny
  430, // Honchkrow
  437, // Bronzong
  445, // Garchomp
  448, // Lucario
  461, // Weavile
  466, // Electivire
  467, // Magmortar
  468, // Togekiss
  471, // Glaceon
  472, // Gliscor
  473, // Mamoswine
  475, // Gallade
  477, // Dusknoir
  478, // Froslass
];

// Calculate HP stat at a given level (Gen IV formula)
function calcHP(base: number, level: number): number {
  const iv = 31;
  const ev = 85;
  return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
}

// Calculate other stats at a given level
function calcStat(base: number, level: number): number {
  const iv = 31;
  const ev = 85;
  return Math.floor((((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5);
}

function getStats(data: PokeAPIData) {
  const s: Record<string, number> = {};
  data.stats.forEach((st) => { s[st.stat.name] = st.base_stat; });
  return {
    hp: s['hp'] || 1,
    attack: s['attack'] || 1,
    defense: s['defense'] || 1,
    spAtk: s['special-attack'] || 1,
    spDef: s['special-defense'] || 1,
    speed: s['speed'] || 1,
  };
}

// Convert a PokéAPI move to our internal Move type
function apiMoveToMove(m: MoveData): Move {
  return {
    id: `${m.id}`,
    name: m.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    type: (m.type.name || 'normal') as PokemonType,
    power: m.power || 50,
    accuracy: m.accuracy || 100,
    pp: m.pp || 15,
    maxPp: m.pp || 15,
    priority: 0,
    target: 'specific',
    description: '',
    damageClass: m.damage_class.name as 'physical' | 'special' | 'status',
  };
}

// Get 4 best moves for a Pokémon from Gen IV learnset
async function getBestMoves(data: PokeAPIData, specificMoves?: string[]): Promise<Move[]> {
  const moves: Move[] = [];

  if (specificMoves) {
    // Fetch specific moves (for Cynthia's team)
    const results = await Promise.all(specificMoves.map(name => getMoveData(name)));
    for (const m of results) {
      if (m && m.power !== null && m.power > 0) {
        moves.push(apiMoveToMove(m));
      } else if (m) {
        // Status move - still add with power 0
        moves.push({
          ...apiMoveToMove(m),
          power: 0,
        });
      }
    }
    // Ensure at least 2 damaging moves
    if (moves.filter(m => m.power > 0).length < 2) {
      // Add tackle as fallback
      moves.push({
        id: 'tackle', name: 'Tackle', type: 'normal', power: 40,
        accuracy: 100, pp: 35, maxPp: 35, priority: 0, target: 'specific',
        description: '', damageClass: 'physical',
      });
    }
    return moves.slice(0, 4);
  }

  // For player Pokémon: get best damaging moves from any version group
  const allMoveNames = data.moves.map(m => m.move.name);

  // Fetch up to 15 moves and pick best 4
  const fetched = await Promise.all(allMoveNames.slice(0, 15).map(name => getMoveData(name)));
  const validMoves = fetched
    .filter((m): m is MoveData => m !== null && m.damage_class.name !== 'status')
    .sort((a, b) => (b.power || 0) - (a.power || 0));

  // Pick 4 diverse moves (different types)
  const usedTypes = new Set<string>();
  for (const m of validMoves) {
    if (moves.length >= 4) break;
    if (!usedTypes.has(m.type.name) || moves.length < 2) {
      moves.push(apiMoveToMove(m));
      usedTypes.add(m.type.name);
    }
  }

  // Fill remaining slots
  while (moves.length < 4 && validMoves.length > moves.length) {
    const m = validMoves.find(vm => !moves.some(em => em.id === `${vm.id}`));
    if (m) moves.push(apiMoveToMove(m));
    else break;
  }

  // Fallback
  if (moves.length === 0) {
    moves.push({
      id: 'tackle', name: 'Tackle', type: 'normal', power: 40,
      accuracy: 100, pp: 35, maxPp: 35, priority: 0, target: 'specific',
      description: '', damageClass: 'physical',
    });
  }

  return moves.slice(0, 4);
}

// Convert PokéAPI data to internal Pokemon format
function toPokemon(data: PokeAPIData, level: number, moves: Move[], mega?: MegaEvolution): Pokemon {
  const stats = getStats(data);
  const types = data.types.map(t => t.type.name);
  const hp = calcHP(stats.hp, level);

  return {
    id: `${data.id}`,
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    level,
    type: (types[0] || 'normal') as PokemonType,
    hp,
    maxHp: hp,
    attack: calcStat(stats.attack, level),
    defense: calcStat(stats.defense, level),
    spAtk: calcStat(stats.spAtk, level),
    spDef: calcStat(stats.spDef, level),
    speed: calcStat(stats.speed, level),
    moves,
    experience: 0,
    avatar: getOfficialArtwork(data.id),
    spriteFront: getSpriteFront(data.id),
    spriteBack: getSpriteBack(data.id),
    spriteFrontFallback: getSpriteFrontFallback(data.id),
    spriteBackFallback: getSpriteBackFallback(data.id),
    mega,
    isMega: false,
  };
}

// Load ???'s full team with moves
export async function loadCynthiaTeam(): Promise<Pokemon[]> {
  const team: Pokemon[] = [];
  for (const entry of CYNTHIA_TEAM_DP) {
    const data = await getPokemon(entry.id);
    if (!data) continue;
    const moves = await getBestMoves(data, entry.moveNames);
    team.push(toPokemon(data, entry.level, moves, entry.mega));
  }
  return team;
}

// Mega evolution data for Pokémon that can mega evolve
// Key: base pokemon ID, Value: mega evolution info
const MEGA_EVOLUTIONS: Record<number, MegaEvolution> = {
  // Gen I
  3: { megaName: 'Mega Venusaur', megaType: 'grass', megaAttack: 100, megaDefense: 123, megaSpAtk: 122, megaSpDef: 120, megaSpeed: 80, megaSpriteId: 10033 },
  6: { megaName: 'Mega Charizard X', megaType: 'fire', megaAttack: 130, megaDefense: 111, megaSpAtk: 130, megaSpDef: 85, megaSpeed: 100, megaSpriteId: 10034 },
  9: { megaName: 'Mega Blastoise', megaType: 'water', megaAttack: 103, megaDefense: 120, megaSpAtk: 135, megaSpDef: 115, megaSpeed: 78, megaSpriteId: 10036 },
  65: { megaName: 'Mega Alakazam', megaType: 'psychic', megaAttack: 95, megaDefense: 65, megaSpAtk: 175, megaSpDef: 105, megaSpeed: 150, megaSpriteId: 10037 },
  94: { megaName: 'Mega Gengar', megaType: 'ghost', megaAttack: 65, megaDefense: 80, megaSpAtk: 170, megaSpDef: 95, megaSpeed: 130, megaSpriteId: 10038 },
  115: { megaName: 'Mega Kangaskhan', megaType: 'normal', megaAttack: 125, megaDefense: 100, megaSpAtk: 60, megaSpDef: 100, megaSpeed: 100, megaSpriteId: 10039 },
  127: { megaName: 'Mega Pinsir', megaType: 'bug', megaAttack: 155, megaDefense: 120, megaSpAtk: 65, megaSpDef: 90, megaSpeed: 105, megaSpriteId: 10040 },
  130: { megaName: 'Mega Gyarados', megaType: 'water', megaAttack: 155, megaDefense: 109, megaSpAtk: 70, megaSpDef: 130, megaSpeed: 81, megaSpriteId: 10041 },
  142: { megaName: 'Mega Aerodactyl', megaType: 'rock', megaAttack: 135, megaDefense: 85, megaSpAtk: 70, megaSpDef: 95, megaSpeed: 150, megaSpriteId: 10042 },
  150: { megaName: 'Mega Mewtwo X', megaType: 'psychic', megaAttack: 190, megaDefense: 100, megaSpAtk: 154, megaSpDef: 100, megaSpeed: 130, megaSpriteId: 10043 },
  // Gen II
  181: { megaName: 'Mega Ampharos', megaType: 'electric', megaAttack: 95, megaDefense: 105, megaSpAtk: 165, megaSpDef: 110, megaSpeed: 45, megaSpriteId: 10045 },
  208: { megaName: 'Mega Steelix', megaType: 'steel', megaAttack: 125, megaDefense: 230, megaSpAtk: 55, megaSpDef: 95, megaSpeed: 30, megaSpriteId: 10046 },
  212: { megaName: 'Mega Scizor', megaType: 'bug', megaAttack: 150, megaDefense: 140, megaSpAtk: 65, megaSpDef: 100, megaSpeed: 75, megaSpriteId: 10046 },
  214: { megaName: 'Mega Heracross', megaType: 'bug', megaAttack: 185, megaDefense: 115, megaSpAtk: 40, megaSpDef: 105, megaSpeed: 75, megaSpriteId: 10047 },
  248: { megaName: 'Mega Tyranitar', megaType: 'rock', megaAttack: 164, megaDefense: 150, megaSpAtk: 95, megaSpDef: 120, megaSpeed: 71, megaSpriteId: 10049 },
  // Gen III
  254: { megaName: 'Mega Sceptile', megaType: 'grass', megaAttack: 110, megaDefense: 75, megaSpAtk: 145, megaSpDef: 85, megaSpeed: 145, megaSpriteId: 10065 },
  257: { megaName: 'Mega Blaziken', megaType: 'fire', megaAttack: 160, megaDefense: 80, megaSpAtk: 130, megaSpDef: 80, megaSpeed: 100, megaSpriteId: 10050 },
  260: { megaName: 'Mega Swampert', megaType: 'water', megaAttack: 150, megaDefense: 110, megaSpAtk: 95, megaSpDef: 110, megaSpeed: 70, megaSpriteId: 10064 },
  282: { megaName: 'Mega Gardevoir', megaType: 'psychic', megaAttack: 85, megaDefense: 65, megaSpAtk: 165, megaSpDef: 135, megaSpeed: 100, megaSpriteId: 10051 },
  302: { megaName: 'Mega Sableye', megaType: 'dark', megaAttack: 85, megaDefense: 125, megaSpAtk: 85, megaSpDef: 115, megaSpeed: 20, megaSpriteId: 10066 },
  306: { megaName: 'Mega Aggron', megaType: 'steel', megaAttack: 140, megaDefense: 230, megaSpAtk: 60, megaSpDef: 80, megaSpeed: 50, megaSpriteId: 10053 },
  310: { megaName: 'Mega Manectric', megaType: 'electric', megaAttack: 75, megaDefense: 80, megaSpAtk: 135, megaSpDef: 80, megaSpeed: 135, megaSpriteId: 10054 },
  334: { megaName: 'Mega Altaria', megaType: 'dragon', megaAttack: 110, megaDefense: 110, megaSpAtk: 110, megaSpDef: 105, megaSpeed: 80, megaSpriteId: 10067 },
  354: { megaName: 'Mega Banette', megaType: 'ghost', megaAttack: 165, megaDefense: 75, megaSpAtk: 93, megaSpDef: 83, megaSpeed: 75, megaSpriteId: 10056 },
  359: { megaName: 'Mega Absol', megaType: 'dark', megaAttack: 150, megaDefense: 60, megaSpAtk: 115, megaSpDef: 60, megaSpeed: 115, megaSpriteId: 10057 },
  362: { megaName: 'Mega Glalie', megaType: 'ice', megaAttack: 120, megaDefense: 80, megaSpAtk: 120, megaSpDef: 80, megaSpeed: 100, megaSpriteId: 10074 },
  373: { megaName: 'Mega Salamence', megaType: 'dragon', megaAttack: 145, megaDefense: 130, megaSpAtk: 120, megaSpDef: 90, megaSpeed: 120, megaSpriteId: 10070 },
  376: { megaName: 'Mega Metagross', megaType: 'steel', megaAttack: 145, megaDefense: 150, megaSpAtk: 105, megaSpDef: 110, megaSpeed: 110, megaSpriteId: 10072 },
  380: { megaName: 'Mega Latias', megaType: 'dragon', megaAttack: 100, megaDefense: 120, megaSpAtk: 140, megaSpDef: 150, megaSpeed: 110, megaSpriteId: 10062 },
  381: { megaName: 'Mega Latios', megaType: 'dragon', megaAttack: 130, megaDefense: 100, megaSpAtk: 160, megaSpDef: 120, megaSpeed: 110, megaSpriteId: 10063 },
  384: { megaName: 'Mega Rayquaza', megaType: 'dragon', megaAttack: 180, megaDefense: 100, megaSpAtk: 180, megaSpDef: 100, megaSpeed: 115, megaSpriteId: 10079 },
  // Gen IV
  445: { megaName: 'Mega Garchomp', megaType: 'dragon', megaAttack: 170, megaDefense: 115, megaSpAtk: 120, megaSpDef: 95, megaSpeed: 92, megaSpriteId: 10058 },
  448: { megaName: 'Mega Lucario', megaType: 'fighting', megaAttack: 145, megaDefense: 88, megaSpAtk: 140, megaSpDef: 70, megaSpeed: 112, megaSpriteId: 10059 },
  460: { megaName: 'Mega Abomasnow', megaType: 'grass', megaAttack: 132, megaDefense: 105, megaSpAtk: 132, megaSpDef: 105, megaSpeed: 30, megaSpriteId: 10060 },
  475: { megaName: 'Mega Gallade', megaType: 'psychic', megaAttack: 165, megaDefense: 95, megaSpAtk: 65, megaSpDef: 115, megaSpeed: 110, megaSpriteId: 10068 },
  // Gen VI
  719: { megaName: 'Mega Diancie', megaType: 'rock', megaAttack: 160, megaDefense: 110, megaSpAtk: 160, megaSpDef: 110, megaSpeed: 110, megaSpriteId: 10075 },
  // Gen VII
  718: { megaName: 'Mega Audino', megaType: 'normal', megaAttack: 60, megaDefense: 126, megaSpAtk: 80, megaSpDef: 126, megaSpeed: 50, megaSpriteId: 10069 },
};

// Load available Pokémon pool for player selection (level 60-65)
export async function loadPlayerPool(): Promise<Pokemon[]> {
  const pool: Pokemon[] = [];
  // Fetch all in parallel
  const results = await Promise.all(PLAYER_POOL_IDS.map(id => getPokemon(id)));
  
  // Then get moves for each (in batches to avoid overloading)
  for (const data of results) {
    if (!data) continue;
    const level = 60 + Math.floor(Math.random() * 6); // 60-65
    const moves = await getBestMoves(data);
    const mega = MEGA_EVOLUTIONS[data.id];
    pool.push(toPokemon(data, level, moves, mega));
  }
  return pool;
}

// Search and load a specific Pokémon by ID for the player
export async function loadPokemonById(id: number): Promise<Pokemon | null> {
  const data = await getPokemon(id);
  if (!data) return null;
  const level = 65;
  const moves = await getBestMoves(data);
  const mega = MEGA_EVOLUTIONS[data.id];
  return toPokemon(data, level, moves, mega);
}

// Pokémon name list cache for search (all generations)
let allPokemonNames: { id: number; name: string }[] | null = null;

export async function getAllPokemonNames(): Promise<{ id: number; name: string }[]> {
  if (allPokemonNames) return allPokemonNames;
  try {
    const res = await fetch(`${POKEAPI_BASE}/pokemon?limit=1025`);
    if (!res.ok) return [];
    const data = await res.json();
    allPokemonNames = data.results.map((p: { name: string; url: string }, i: number) => ({
      id: i + 1,
      name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
    }));
    return allPokemonNames!;
  } catch {
    return [];
  }
}

// Get mega evolution data for a pokemon ID
export function getMegaEvolution(pokemonId: number): MegaEvolution | undefined {
  return MEGA_EVOLUTIONS[pokemonId];
}

// Load TM/HM-learnable moves for a Pokémon (moves learned via 'machine')
export async function loadTMMoves(pokemonId: number): Promise<Move[]> {
  const data = await getPokemon(pokemonId);
  if (!data) return [];

  // Filter moves that can be learned via TM/HM (machine)
  const tmMoveNames = data.moves
    .filter(m => m.version_group_details.some(d => d.move_learn_method.name === 'machine'))
    .map(m => m.move.name);

  // Fetch move data in parallel (batch of 30 max to avoid overloading)
  const batch = tmMoveNames.slice(0, 30);
  const results = await Promise.all(batch.map(name => getMoveData(name)));

  const moves: Move[] = [];
  for (const m of results) {
    if (!m) continue;
    const move = apiMoveToMove(m);
    // For status moves, keep power as 0 instead of defaulting to 50
    if (m.damage_class.name === 'status' || m.power === null || m.power === 0) {
      move.power = 0;
    }
    moves.push(move);
  }

  // Sort: damaging moves first (by power desc), then status moves alphabetically
  moves.sort((a, b) => {
    if (a.power > 0 && b.power === 0) return -1;
    if (a.power === 0 && b.power > 0) return 1;
    if (a.power > 0 && b.power > 0) return b.power - a.power;
    return a.name.localeCompare(b.name);
  });

  return moves;
}

export function clearCache(): void {
  cache.clear();
}

// Re-export for backward compatibility
export const getCynthiaTeam = loadCynthiaTeam;
export const getSinnohPokémon = loadPlayerPool;
