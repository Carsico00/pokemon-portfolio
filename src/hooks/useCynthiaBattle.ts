// Hook para obtener Pokémon de Sinnoh Nivel 100 para la batalla con Cynthia

import { useState, useEffect } from 'react';
import type { Pokemon } from '../types/pokemon';
import { loadPlayerPool, loadCynthiaTeam } from '../services/pokeApi';

export function useCynthiaBattle() {
  const [sinnohPokemon, setSinnohPokemon] = useState<Pokemon[]>([]);
  const [cynthiaTeam, setCynthiaTeam] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar Pokémon de Sinnoh Nivel 100
  const loadSinnohPokemonLv100 = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadPlayerPool();
      setSinnohPokemon(data);
    } catch (err) {
      setError('Error al cargar Pokémon de Sinnoh');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar equipo de Cynthia Nivel 100
  const loadCynthiaTeamLv100 = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadCynthiaTeam();
      setCynthiaTeam(data);
    } catch (err) {
      setError('Error al cargar equipo de Cynthia');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSinnohPokemonLv100();
    loadCynthiaTeamLv100();
  }, []);

  return {
    sinnohPokemon,
    cynthiaTeam,
    loading,
    error,
    loadSinnohPokemonLv100,
    loadCynthiaTeamLv100,
  };
}
