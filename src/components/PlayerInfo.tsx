import React from 'react';
import type { Pokemon } from '../types/pokemon';
import './PlayerInfo.css';

interface PlayerInfoProps {
  pokemon: Pokemon;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({ pokemon }) => {
  const experienceRequired = pokemon.level * 100;
  const currentExp = pokemon.experience % experienceRequired;
  const expPercentage = (currentExp / experienceRequired) * 100;

  return (
    <div className="player-info-panel">
      <div className="pokemon-header">
        <div className="pokemon-avatar">{pokemon.avatar}</div>
        <div className="pokemon-name-level">
          <h3>{pokemon.name}</h3>
          <span className="level-badge">Lv. {pokemon.level}</span>
        </div>
      </div>

      <div className="hp-status">
        <span className="label">Salud</span>
        <div className="hp-bar">
          <div
            className="hp-fill"
            style={{ width: `${(pokemon.hp / pokemon.maxHp) * 100}%` }}
          />
        </div>
        <span className="hp-text">
          {pokemon.hp}/{pokemon.maxHp}
        </span>
      </div>

      <div className="exp-status">
        <span className="label">Experiencia</span>
        <div className="exp-bar">
          <div
            className="exp-fill"
            style={{ width: `${expPercentage}%` }}
          />
        </div>
        <span className="exp-text">
          {currentExp}/{experienceRequired}
        </span>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">ATQ</span>
          <span className="stat-value">{pokemon.attack}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">DEF</span>
          <span className="stat-value">{pokemon.defense}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">VEL</span>
          <span className="stat-value">{pokemon.speed}</span>
        </div>
      </div>
    </div>
  );
};
