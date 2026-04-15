// Hook para manejar datos de PokéAPI

import { useState, useEffect } from 'react';
import type { Pokemon } from '../types/pokemon';
import { getPokemon, loadPlayerPool, getMoveData } from '../services/pokeApi';
import type { PokeAPIData } from '../services/pokeApi';

interface PokémonLocal extends Omit<Pokemon, 'moves'> {
  moves: Array<{ name: string; type: string; power: number; accuracy: number }>;
}

function convertPokemonData(data: PokeAPIData, level = 50): PokémonLocal {
  const types = data.types.map(t => t.type.name);
  const stats: Record<string, number> = {};
  data.stats.forEach(s => { stats[s.stat.name] = s.base_stat; });
  return {
    id: `${data.id}`,
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    level,
    type: (types[0] || 'normal') as any,
    hp: stats['hp'] || 1,
    maxHp: stats['hp'] || 1,
    attack: stats['attack'] || 1,
    defense: stats['defense'] || 1,
    spAtk: stats['special-attack'] || 1,
    spDef: stats['special-defense'] || 1,
    speed: stats['speed'] || 1,
    moves: [],
    experience: 0,
    avatar: data.sprites.front_default || '',
  };
}

export function usePokeAPI() {
  const [pokémonList, setPokémonList] = useState<PokémonLocal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar Pokémon de Sinnoh al inicio
  useEffect(() => {
    loadSinnohPokémon();
  }, []);

  const loadSinnohPokémon = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadPlayerPool();
      const converted = data.map((poke) => ({
        ...poke,
        moves: poke.moves.map(m => ({ name: m.name, type: m.type, power: m.power, accuracy: m.accuracy })),
      }));
      setPokémonList(converted as PokémonLocal[]);
    } catch (err) {
      setError('Error al cargar Pokémon');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPokémonById = async (id: string | number): Promise<PokémonLocal | null> => {
    try {
      const data = await getPokemon(Number(id));
      if (data) {
        return convertPokemonData(data);
      }
      return null;
    } catch (err) {
      console.error(`Error fetching Pokémon ${id}:`, err);
      return null;
    }
  };

  const getPokémonWithMoves = async (id: string | number): Promise<PokémonLocal | null> => {
    try {
      const data = await getPokemon(Number(id));
      if (data) {
        const converted = convertPokemonData(data);
        
        // Obtener movimientos desde las moves del pokemon
        const moveNames = data.moves.slice(0, 4).map(m => m.move.name);
        const moveResults = await Promise.all(moveNames.map(name => getMoveData(name)));
        converted.moves = moveResults
          .filter((m): m is NonNullable<typeof m> => m !== null)
          .map((move) => ({
            name: move.name,
            type: move.type.name,
            power: move.power || 0,
            accuracy: move.accuracy || 100,
          }));

        return converted;
      }
      return null;
    } catch (err) {
      console.error(`Error fetching Pokémon with moves ${id}:`, err);
      return null;
    }
  };

  return {
    pokémonList,
    loading,
    error,
    loadSinnohPokémon,
    getPokémonById,
    getPokémonWithMoves,
  };
}
