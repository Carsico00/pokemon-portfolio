import React from 'react';
import type { Pokemon } from '../types/pokemon';
import './Pokedex.css';

interface PokedexProps {
  caughtPokemon: Pokemon[];
  onClose: () => void;
}

export const Pokedex: React.FC<PokedexProps> = ({ caughtPokemon, onClose }) => {
  const totalStats = caughtPokemon.reduce(
    (acc, pokemon) => ({
      avgLevel:
        acc.avgLevel +
        pokemon.level / Math.max(caughtPokemon.length, 1),
      totalExp:
        acc.totalExp + pokemon.experience,
    }),
    { avgLevel: 0, totalExp: 0 }
  );

  return (
    <div className="pokedex-overlay">
      <div className="pokedex-container">
        <div className="pokedex-header">
          <h1>📖 Pokédex</h1>
          <p>Pokémon capturados: {caughtPokemon.length}</p>
        </div>

        {caughtPokemon.length === 0 ? (
          <div className="empty-pokedex">
            <p>Aún no has capturado ningún Pokémon.</p>
            <p>¡Explora y captura Pokémon en el mapa!</p>
          </div>
        ) : (
          <>
            <div className="pokedex-stats">
              <div className="stat-box">
                <span className="stat-label">Nivel Promedio</span>
                <span className="stat-value">
                  {totalStats.avgLevel.toFixed(1)}
                </span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Exp Total</span>
                <span className="stat-value">
                  {totalStats.totalExp}
                </span>
              </div>
            </div>

            <div className="pokedex-list">
              {caughtPokemon.map((pokemon, index) => (
                <div key={index} className="pokedex-entry">
                  <div className="entry-avatar">{pokemon.avatar}</div>
                  <div className="entry-info">
                    <h3>{pokemon.name}</h3>
                    <p className="entry-type">{pokemon.type}</p>
                    <div className="entry-stats">
                      <span>Lv. {pokemon.level}</span>
                      <span>HP: {pokemon.hp}/{pokemon.maxHp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <button className="close-button" onClick={onClose}>
          Cerrar Pokédex
        </button>
      </div>
    </div>
  );
};
