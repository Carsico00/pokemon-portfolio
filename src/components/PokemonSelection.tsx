import React, { useState } from 'react';
import type { Pokemon } from '../types/pokemon';
import { PLAYER_POKEMON } from '../data/pokemon';
import { usePokeAPI } from '../hooks/usePokeAPI';
import './PokemonSelection.css';

interface PokemonSelectionProps {
  onSelect: (pokemon: Pokemon) => void;
}

export const PokemonSelection: React.FC<PokemonSelectionProps> = ({ onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const { pokémonList, loading, error } = usePokeAPI();
  
  // Usar datos de PokéAPI si están disponibles, sino usar datos locales
  const pokemonOptions = pokémonList.length > 0 ? pokémonList : PLAYER_POKEMON;

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % pokemonOptions.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? pokemonOptions.length - 1 : prev - 1
    );
  };

  const handleSelect = () => {
    setConfirming(true);
    setTimeout(() => {
      const selected = pokemonOptions[selectedIndex];
      // Convertir a formato Pokemon si viene de PokéAPI
      const pokemon: Pokemon = {
        id: selected.id,
        name: selected.name,
        level: 5,
        type: selected.type,
        hp: selected.hp,
        maxHp: selected.maxHp,
        attack: selected.attack,
        defense: selected.defense,
        spAtk: selected.spAtk,
        spDef: selected.spDef,
        speed: selected.speed,
        moves: (selected.moves as any).slice(0, 4),
        experience: 0,
        avatar: selected.avatar,
      };
      onSelect(pokemon);
    }, 800);
  };

  const currentPokemon = pokemonOptions[selectedIndex];

  if (loading) {
    return (
      <div className="pokemon-selection-container">
        <div className="selection-content">
          <div className="selection-header">
            <h1>Cargando...</h1>
            <p>Trayendo Pokémon de Sinnoh</p>
          </div>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pokemon-selection-container">
        <div className="selection-content">
          <div className="selection-header">
            <h1>⚠️ Error</h1>
            <p>{error}</p>
          </div>
          <button className="selection-button" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pokemon-selection-container">
      <div className="selection-content">
        <div className="selection-header">
          <h1>¡Elige tu Pokémon!</h1>
          <p>Selecciona tu compañero para esta aventura</p>
        </div>

        <div className="pokemon-display">
          <button className="nav-button prev" onClick={handlePrev} disabled={confirming}>
            ◄
          </button>

          <div className="pokemon-card">
            <div className="pokemon-large-sprite">
              {typeof currentPokemon.avatar === 'string' ? (
                <img 
                  src={currentPokemon.avatar} 
                  alt={currentPokemon.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    imageRendering: 'pixelated',
                  }}
                />
              ) : (
                currentPokemon.avatar
              )}
            </div>
            <div className="pokemon-info-display">
              <h2>{currentPokemon.name}</h2>
              <p className="pokemon-type">{currentPokemon.type.toUpperCase()}</p>
              <div className="pokemon-stats">
                <div className="stat">
                  <span className="label">ATK</span>
                  <span className="value">{currentPokemon.attack}</span>
                </div>
                <div className="stat">
                  <span className="label">DEF</span>
                  <span className="value">{currentPokemon.defense}</span>
                </div>
                <div className="stat">
                  <span className="label">SPD</span>
                  <span className="value">{currentPokemon.speed}</span>
                </div>
              </div>
              <div className="pokemon-moves">
                <p className="moves-label">Movimientos:</p>
                <div className="moves-list">
                  {currentPokemon.moves && currentPokemon.moves.length > 0 ? (
                    (currentPokemon.moves as any[]).map((move, idx: number) => (
                      <span key={idx} className="move-tag">
                        {typeof move === 'string' ? move : move.name}
                      </span>
                    ))
                  ) : (
                    <span className="move-tag">Cargando movimientos...</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button className="nav-button next" onClick={handleNext} disabled={confirming}>
            ►
          </button>
        </div>

        <div className="selection-indicators">
          {pokemonOptions.map((pokemon, index) => (
            <div
              key={`${pokemon.id}-${index}`}
              className={`indicator ${index === selectedIndex ? 'active' : ''}`}
              onClick={() => !confirming && setSelectedIndex(index)}
              title={pokemon.name}
            >
              {typeof pokemon.avatar === 'string' ? (
                <img 
                  src={pokemon.avatar} 
                  alt={pokemon.name}
                  style={{
                    width: '40px',
                    height: '40px',
                    imageRendering: 'pixelated',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                pokemon.avatar
              )}
            </div>
          ))}
        </div>

        <button
          className={`selection-button ${confirming ? 'confirming' : ''}`}
          onClick={handleSelect}
          disabled={confirming}
        >
          {confirming ? '¡Elegido!' : '¡Seleccionar!'}
        </button>
      </div>
    </div>
  );
};
