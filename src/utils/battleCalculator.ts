import type { Pokemon, PokemonType, Move } from '../types/pokemon';

// Tabla de efectividad de tipos
const TYPE_EFFECTIVENESS: Record<PokemonType, Record<PokemonType, number>> = {
  normal: { normal: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 1, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 0, dragon: 1, dark: 1, steel: 2, fairy: 1 },
  fire: { normal: 1, fire: 0.5, water: 2, grass: 0.5, electric: 1, ice: 0.5, fighting: 1, poison: 1, ground: 2, flying: 1, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 0.5, fairy: 0.5 },
  water: { normal: 1, fire: 0.5, water: 0.5, grass: 2, electric: 2, ice: 0.5, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 0.5, dark: 1, steel: 0.5, fairy: 1 },
  grass: { normal: 1, fire: 2, water: 0.5, grass: 0.5, electric: 1, ice: 2, fighting: 1, poison: 2, ground: 0.5, flying: 2, psychic: 1, bug: 2, rock: 1, ghost: 1, dragon: 0.5, dark: 1, steel: 2, fairy: 1 },
  electric: { normal: 1, fire: 1, water: 1, grass: 1, electric: 0.5, ice: 1, fighting: 1, poison: 1, ground: 2, flying: 0.5, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1 },
  ice: { normal: 1, fire: 2, water: 1, grass: 1, electric: 1, ice: 0.5, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1 },
  fighting: { normal: 0.5, fire: 1, water: 1, grass: 1, electric: 1, ice: 0.5, fighting: 1, poison: 0.5, ground: 1, flying: 2, psychic: 2, bug: 0.5, rock: 0.5, ghost: 1, dragon: 1, dark: 0.5, steel: 1, fairy: 2 },
  poison: { normal: 1, fire: 1, water: 1, grass: 0.5, electric: 1, ice: 1, fighting: 1, poison: 0.5, ground: 2, flying: 1, psychic: 2, bug: 0.5, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 0, fairy: 0.5 },
  ground: { normal: 1, fire: 1, water: 2, grass: 2, electric: 0, ice: 2, fighting: 1, poison: 0.5, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 0.5, ghost: 1, dragon: 1, dark: 1, steel: 1, fairy: 1 },
  flying: { normal: 1, fire: 1, water: 1, grass: 0.5, electric: 2, ice: 2, fighting: 0.5, poison: 1, ground: 0, flying: 1, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1 },
  psychic: { normal: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 1, fighting: 0.5, poison: 1, ground: 1, flying: 1, psychic: 0.5, bug: 2, rock: 1, ghost: 2, dragon: 1, dark: 2, steel: 2, fairy: 1 },
  bug: { normal: 1, fire: 2, water: 1, grass: 0.5, electric: 1, ice: 1, fighting: 0.5, poison: 0.5, ground: 0.5, flying: 2, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 1, dark: 0.5, steel: 2, fairy: 1 },
  rock: { normal: 0.5, fire: 0.5, water: 2, grass: 2, electric: 1, ice: 1, fighting: 2, poison: 1, ground: 2, flying: 0.5, psychic: 1, bug: 0.5, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1 },
  ghost: { normal: 0, fire: 1, water: 1, grass: 1, electric: 1, ice: 1, fighting: 0, poison: 0.5, ground: 1, flying: 1, psychic: 1, bug: 0.5, rock: 1, ghost: 2, dragon: 1, dark: 2, steel: 1, fairy: 1 },
  dragon: { normal: 1, fire: 0.5, water: 0.5, grass: 0.5, electric: 0.5, ice: 2, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 2, fairy: 2 },
  dark: { normal: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 1, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 0, bug: 2, rock: 1, ghost: 0.5, dragon: 1, dark: 0.5, steel: 2, fairy: 2 },
  steel: { normal: 0.5, fire: 2, water: 1, grass: 0.5, electric: 1, ice: 0.5, fighting: 2, poison: 0, ground: 2, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 0.5, ghost: 1, dragon: 0.5, dark: 1, steel: 0.5, fairy: 0.5 },
  fairy: { normal: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 1, fighting: 0.5, poison: 2, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 0, dark: 0.5, steel: 2, fairy: 1 },
};

export const calculateDamage = (
  attacker: Pokemon,
  defender: Pokemon,
  move: Move
): number => {
  // Cálculo básico de daño (fórmula simplificada)
  const effectiveness =
    TYPE_EFFECTIVENESS[move.type][defender.type] || 1;
  const attackStat =
    move.type === 'fire' ||
    move.type === 'water' ||
    move.type === 'grass' ||
    move.type === 'electric' ||
    move.type === 'ice' ||
    move.type === 'psychic'
      ? attacker.spAtk
      : attacker.attack;
  const defenseStat =
    move.type === 'fire' ||
    move.type === 'water' ||
    move.type === 'grass' ||
    move.type === 'electric' ||
    move.type === 'ice' ||
    move.type === 'psychic'
      ? defender.spDef
      : defender.defense;

  let damage = Math.floor(
    ((((2 * attacker.level) / 5 + 2) * move.power * attackStat) /
      defenseStat) /
      50 +
      2
  );

  damage = Math.floor(damage * effectiveness);

  // Añadir variación aleatoria (85-100%)
  const variance = 0.85 + Math.random() * 0.15;
  damage = Math.floor(damage * variance);

  return Math.max(1, damage);
};

export const getTypeEffectiveness = (
  moveType: PokemonType,
  defenderType: PokemonType
): number => {
  return TYPE_EFFECTIVENESS[moveType][defenderType] || 1;
};

export const getEffectivenessText = (effectiveness: number): string => {
  if (effectiveness > 1) return 'Muy efectivo!';
  if (effectiveness < 1 && effectiveness > 0) return 'Poco efectivo...';
  if (effectiveness === 0) return 'Sin efecto!';
  return '';
};

export const attemptHit = (accuracy: number): boolean => {
  return Math.random() * 100 <= accuracy;
};

export const selectRandomMove = (pokemon: Pokemon): Move => {
  return pokemon.moves[Math.floor(Math.random() * pokemon.moves.length)];
};
