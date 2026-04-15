// D/P Overworld Trainer Sprites - Dawn (Female Protagonist)
// Generated via canvas pixel art at runtime

// Color palette (D/P Dawn)
const C = {
  _: 'transparent',
  K: '#1a1a2e',   // outline/black
  W: '#f0f0f0',   // white (beanie, scarf)
  Wh: '#d0d0e0',  // white shadow
  H: '#3a2a1a',   // hair (dark blue-black)
  Hd: '#2a1a0a',  // hair dark
  S: '#f8b870',   // skin
  Sd: '#d89850',  // skin shadow
  B: '#4878d0',   // blue outfit
  Bd: '#3858a0',  // blue dark
  Bl: '#68a0f0',  // blue light
  R: '#e03030',   // red (scarf accent)
  Bk: '#505070',  // boots
  Bkd: '#383850', // boots dark
  P: '#f07090',   // pink scarf
};

type PixelGrid = string[][];

// Dawn facing down (front view) — 16x24
const DAWN_DOWN: PixelGrid = [
  /*          0     1     2     3     4     5     6     7     8     9    10    11   12    13    14    15  */
  /* 0 */  [C._, C._, C._, C._, C._, C.W, C.W, C.W, C.W, C.W, C.W, C._, C._, C._, C._, C._],
  /* 1 */  [C._, C._, C._, C._, C.W, C.W, C.W, C.W, C.W, C.W, C.W, C.W, C._, C._, C._, C._],
  /* 2 */  [C._, C._, C._, C.W, C.W, C.Wh,C.W, C.W, C.W, C.Wh,C.W, C.W, C._, C._, C._, C._],
  /* 3 */  [C._, C._, C._, C.K, C.H, C.H, C.H, C.H, C.H, C.H, C.H, C.K, C._, C._, C._, C._],
  /* 4 */  [C._, C._, C.K, C.H, C.H, C.H, C.H, C.H, C.H, C.H, C.H, C.H, C.K, C._, C._, C._],
  /* 5 */  [C._, C._, C.K, C.H, C.H, C.S, C.S, C.S, C.S, C.S, C.H, C.H, C.K, C._, C._, C._],
  /* 6 */  [C._, C._, C.K, C.H, C.S, C.K, C.S, C.S, C.S, C.K, C.S, C.H, C.K, C._, C._, C._],
  /* 7 */  [C._, C._, C._, C.K, C.S, C.S, C.S,C.Sd, C.S, C.S, C.S, C.K, C._, C._, C._, C._],
  /* 8 */  [C._, C._, C._, C.K, C.S, C.S, C.Sd,C.S, C.Sd,C.S, C.S, C.K, C._, C._, C._, C._],
  /* 9 */  [C._, C._, C._, C._, C.K, C.S, C.S, C.S, C.S, C.S, C.K, C._, C._, C._, C._, C._],
  /*10 */  [C._, C._, C._, C.K, C.P, C.P, C.K, C.K, C.K, C.P, C.P, C.K, C._, C._, C._, C._],
  /*11 */  [C._, C._, C.K, C.B, C.B, C.B, C.B, C.B, C.B, C.B, C.B, C.B, C.K, C._, C._, C._],
  /*12 */  [C._, C.K, C.S, C.B, C.B, C.B, C.Bl,C.B, C.Bl,C.B, C.B, C.B, C.S, C.K, C._, C._],
  /*13 */  [C._, C.K, C.S, C.B, C.B, C.Bd,C.B, C.B, C.B, C.Bd,C.B, C.B, C.S, C.K, C._, C._],
  /*14 */  [C._, C.K, C.S, C.K, C.B, C.B, C.B, C.B, C.B, C.B, C.B, C.K, C.S, C.K, C._, C._],
  /*15 */  [C._, C._, C.K, C._, C.K, C.B, C.Bd,C.B, C.Bd,C.B, C.K, C._, C.K, C._, C._, C._],
  /*16 */  [C._, C._, C._, C._, C.K, C.Bd,C.B, C.B, C.B, C.Bd,C.K, C._, C._, C._, C._, C._],
  /*17 */  [C._, C._, C._, C._, C._, C.K, C.B, C.B, C.B, C.K, C._, C._, C._, C._, C._, C._],
  /*18 */  [C._, C._, C._, C._, C._, C.K, C.S, C.K, C.S, C.K, C._, C._, C._, C._, C._, C._],
  /*19 */  [C._, C._, C._, C._, C.K,C.Bk,C.Bk, C.K,C.Bk,C.Bk, C.K, C._, C._, C._, C._, C._],
  /*20 */  [C._, C._, C._, C._, C.K,C.Bk,C.Bkd,C.K,C.Bkd,C.Bk,C.K, C._, C._, C._, C._, C._],
  /*21 */  [C._, C._, C._, C._, C.K,C.Bk,C.Bk, C.K,C.Bk,C.Bk, C.K, C._, C._, C._, C._, C._],
  /*22 */  [C._, C._, C._, C._, C._, C.K, C.K, C._, C.K, C.K, C._, C._, C._, C._, C._, C._],
  /*23 */  [C._, C._, C._, C._, C._, C._, C._, C._, C._, C._, C._, C._, C._, C._, C._, C._],
];

// Dawn facing up (back view) — 16x24
const DAWN_UP: PixelGrid = [
  [C._, C._, C._, C._, C._, C.W, C.W, C.W, C.W, C.W, C.W, C._, C._, C._, C._, C._],
  [C._, C._, C._, C._, C.W, C.W, C.W, C.W, C.W, C.W, C.W, C.W, C._, C._, C._, C._],
  [C._, C._, C._, C.W, C.W, C.Wh,C.W, C.W, C.W, C.Wh,C.W, C.W, C._, C._, C._, C._],
  [C._, C._, C._, C.K, C.H, C.H, C.H, C.H, C.H, C.H, C.H, C.K, C._, C._, C._, C._],
  [C._, C._, C.K, C.H, C.H, C.H, C.H, C.H, C.H, C.H, C.H, C.H, C.K, C._, C._, C._],
  [C._, C._, C.K, C.H, C.H, C.Hd,C.H, C.H, C.H, C.Hd,C.H, C.H, C.K, C._, C._, C._],
  [C._, C._, C.K, C.H, C.H, C.H, C.Hd,C.Hd,C.Hd,C.H, C.H, C.H, C.K, C._, C._, C._],
  [C._, C._, C._, C.K, C.H, C.H, C.H, C.H, C.H, C.H, C.H, C.K, C._, C._, C._, C._],
  [C._, C._, C._, C.K, C.H, C.Hd,C.H, C.Hd,C.H, C.Hd,C.H, C.K, C._, C._, C._, C._],
  [C._, C._, C._, C._, C.K, C.H, C.H, C.H, C.H, C.H, C.K, C._, C._, C._, C._, C._],
  [C._, C._, C._, C.K, C.P, C.P, C.K, C.K, C.K, C.P, C.P, C.K, C._, C._, C._, C._],
  [C._, C._, C.K, C.B, C.B, C.B, C.B, C.B, C.B, C.B, C.B, C.B, C.K, C._, C._, C._],
  [C._, C.K, C.S, C.B, C.B, C.Bd,C.B, C.B, C.B, C.Bd,C.B, C.B, C.S, C.K, C._, C._],
  [C._, C.K, C.S, C.B, C.B, C.B, C.Bd,C.Bd,C.Bd,C.B, C.B, C.B, C.S, C.K, C._, C._],
  [C._, C.K, C.S, C.K, C.B, C.B, C.B, C.B, C.B, C.B, C.B, C.K, C.S, C.K, C._, C._],
  [C._, C._, C.K, C._, C.K, C.B, C.B, C.B, C.B, C.B, C.K, C._, C.K, C._, C._, C._],
  [C._, C._, C._, C._, C.K, C.Bd,C.B, C.B, C.B, C.Bd,C.K, C._, C._, C._, C._, C._],
  [C._, C._, C._, C._, C._, C.K, C.B, C.B, C.B, C.K, C._, C._, C._, C._, C._, C._],
  [C._, C._, C._, C._, C._, C.K, C.S, C.K, C.S, C.K, C._, C._, C._, C._, C._,C._],
  [C._, C._, C._, C._, C.K,C.Bk,C.Bk, C.K,C.Bk,C.Bk, C.K, C._, C._, C._, C._, C._],
  [C._, C._, C._, C._, C.K,C.Bk,C.Bkd,C.K,C.Bkd,C.Bk,C.K, C._, C._, C._, C._, C._],
  [C._, C._, C._, C._, C.K,C.Bk,C.Bk, C.K,C.Bk,C.Bk, C.K, C._, C._, C._, C._, C._],
  [C._, C._, C._, C._, C._, C.K, C.K, C._, C.K, C.K, C._, C._, C._, C._, C._, C._],
  [C._, C._, C._, C._, C._, C._, C._, C._, C._, C._, C._, C._, C._, C._, C._, C._],
];

// Dawn facing left — 16x24
const DAWN_LEFT: PixelGrid = [
  [C._, C._, C._, C._, C._, C.W, C.W, C.W, C.W, C.W, C._, C._, C._, C._, C._, C._],
  [C._, C._, C._, C._, C.W, C.W, C.W, C.W, C.W, C.W, C.W, C._, C._, C._, C._, C._],
  [C._, C._, C._, C.W, C.W, C.Wh,C.W, C.W, C.W, C.W, C.W, C._, C._, C._, C._, C._],
  [C._, C._, C.K, C.H, C.H, C.H, C.H, C.H, C.H, C.H, C.K, C._, C._, C._, C._, C._],
  [C._, C.K, C.H, C.H, C.H, C.H, C.H, C.H, C.H, C.H, C.H, C.K, C._, C._, C._, C._],
  [C._, C.K, C.H, C.H, C.S, C.S, C.S, C.S, C.S, C.H, C.H, C.K, C._, C._, C._, C._],
  [C._, C.K, C.H, C.S, C.K, C.S, C.S, C.S, C.S, C.S, C.H, C.K, C._, C._, C._, C._],
  [C._, C._, C.K, C.S, C.S, C.S, C.S, C.Sd,C.S, C.S, C.K, C._, C._, C._, C._, C._],
  [C._, C._, C.K, C.S, C.S, C.Sd,C.S, C.S, C.Sd,C.S, C.K, C._, C._, C._, C._, C._],
  [C._, C._, C._, C.K, C.S, C.S, C.S, C.S, C.S, C.K, C._, C._, C._, C._, C._, C._],
  [C._, C._, C.K, C.P, C.P, C.K, C.K, C.K, C.P, C.P, C.K, C._, C._, C._, C._, C._],
  [C._, C._, C.K, C.B, C.B, C.B, C.B, C.B, C.B, C.B, C.K, C._, C._, C._, C._, C._],
  [C._, C.K, C.S, C.B, C.B, C.B, C.Bl,C.B, C.B, C.B, C.B, C.K, C._, C._, C._, C._],
  [C._, C.K, C.S, C.B, C.B, C.Bd,C.B, C.B, C.B, C.B, C.B, C.K, C._, C._, C._, C._],
  [C._, C._, C.K, C.K, C.B, C.B, C.B, C.B, C.B, C.B, C.K, C.S, C.K, C._, C._, C._],
  [C._, C._, C._, C._, C.K, C.B, C.Bd,C.B, C.B, C.K, C._, C.K, C._, C._, C._, C._],
  [C._, C._, C._, C._, C.K, C.Bd,C.B, C.B, C.Bd,C.K, C._, C._, C._, C._, C._, C._],
  [C._, C._, C._, C._, C._, C.K, C.B, C.B, C.K, C._, C._, C._, C._, C._, C._, C._],
  [C._, C._, C._, C._, C._, C.K, C.S, C.K, C._, C._, C._, C._, C._, C._, C._, C._],
  [C._, C._, C._, C._, C.K,C.Bk, C.Bk,C.K, C._, C._, C._, C._, C._, C._, C._, C._],
  [C._, C._, C._, C._, C.K,C.Bk,C.Bkd,C.K, C._, C._, C._, C._, C._, C._, C._, C._],
  [C._, C._, C._, C._, C.K,C.Bk, C.Bk,C.K, C._, C._, C._, C._, C._, C._, C._, C._],
  [C._, C._, C._, C._, C._, C.K, C.K, C._, C._, C._, C._, C._, C._, C._, C._, C._],
  [C._, C._, C._, C._, C._, C._, C._, C._, C._, C._, C._, C._, C._, C._, C._, C._],
];

// Dawn facing right — mirror of left
function mirrorGrid(grid: PixelGrid): PixelGrid {
  return grid.map(row => [...row].reverse());
}

const DAWN_RIGHT: PixelGrid = mirrorGrid(DAWN_LEFT);

// Render pixel grid to canvas data URL
function gridToDataUrl(grid: PixelGrid, scale: number = 2): string {
  const height = grid.length;
  const width = grid[0].length;
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d')!;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = grid[y][x];
      if (color === 'transparent') continue;
      ctx.fillStyle = color;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }

  return canvas.toDataURL('image/png');
}

// Walking frame: slight arm/leg offset
function makeWalkFrame(grid: PixelGrid): PixelGrid {
  const walk = grid.map(row => [...row]);
  // Shift legs slightly — move bottom rows
  if (walk.length >= 22) {
    // Swap leg pixels slightly for walking animation
    const temp19 = [...walk[19]];
    const temp20 = [...walk[20]];
    walk[19] = [...walk[21]];
    walk[20] = temp19;
    walk[21] = temp20;
  }
  return walk;
}

// Cache generated sprites
const spriteCache = new Map<string, string>();

export type Direction = 'down' | 'up' | 'left' | 'right';

export function getDawnSprite(direction: Direction, walking: boolean = false, scale: number = 2): string {
  const key = `dawn-${direction}-${walking ? 'walk' : 'stand'}-${scale}`;
  if (spriteCache.has(key)) return spriteCache.get(key)!;

  const grids: Record<Direction, PixelGrid> = {
    down: DAWN_DOWN,
    up: DAWN_UP,
    left: DAWN_LEFT,
    right: DAWN_RIGHT,
  };

  let grid = grids[direction];
  if (walking) grid = makeWalkFrame(grid);
  const url = gridToDataUrl(grid, scale);
  spriteCache.set(key, url);
  return url;
}

// Champion NPC sprite (custom battle sprite)
export const CYNTHIA_TRAINER_SPRITE = '/sprites/champion-battle.png';
export const CYNTHIA_TRAINER_SPRITE_FALLBACK = '/sprites/champion-battle.png';

// Dawn battle sprite (for player side)
export const DAWN_TRAINER_SPRITE = 'https://play.pokemonshowdown.com/sprites/trainers/dawn.png';
