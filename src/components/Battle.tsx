import React, { useState, useRef, useCallback } from 'react';
import type { BattleState, Move } from '../types/pokemon';
import './Battle.css';

interface BattleProps {
  battleState: BattleState;
  onMoveSelect: (move: Move) => void;
}

export const Battle: React.FC<BattleProps> = ({
  battleState,
  onMoveSelect,
}) => {
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [animating, setAnimating] = useState(false);
  const [effects, setEffects] = useState<Array<{ id: string; x: number; y: number; type: string; damage: number }>>([]);
  const effectIdRef = useRef(0);

  const handleMoveClick = useCallback((move: Move) => {
    if (animating || battleState.isOver) return;
    setSelectedMove(move);
    setAnimating(true);

    // Crear efecto visual del ataque
    effectIdRef.current += 1;
    const effectId = `effect-${effectIdRef.current}`;
    const damage = Math.floor(Math.random() * (move.power - 20)) + 20;

    setEffects((prev) => [...prev, {
      id: effectId,
      x: 50,
      y: 50,
      type: move.type,
      damage,
    }]);

    setTimeout(() => {
      setEffects((prev) => prev.filter((e) => e.id !== effectId));
      onMoveSelect(move);
      setSelectedMove(null);
      setAnimating(false);
    }, 1200);
  }, [animating, battleState.isOver, onMoveSelect]);

  const progressPercentage = (hp: number, maxHp: number) => {
    return Math.max(0, Math.min(100, (hp / maxHp) * 100));
  };

  const getEffectColor = (type: string): string => {
    const colors: Record<string, string> = {
      fire: '#ff6347',
      water: '#1e90ff',
      grass: '#32cd32',
      electric: '#ffd700',
      normal: '#a9a9a9',
      ice: '#87ceeb',
      fighting: '#cd5c5c',
      poison: '#da70d6',
      ground: '#d2691e',
      flying: '#4169e1',
      psychic: '#ff69b4',
      bug: '#90ee90',
      rock: '#696969',
      ghost: '#9370db',
      dragon: '#4169e1',
      dark: '#2f4f4f',
      steel: '#c0c0c0',
      fairy: '#ffb6c1',
    };
    return colors[type] || '#ffffff';
  };

  return (
    <div className="battle-container">
      <div className="battle-arena">
        {/* Pokémon del oponente */}
        <div className="pokemon-section opponent">
          <div className="pokemon-info">
            <h3>{battleState.opponentPokemon.name}</h3>
            <div className="level">Nv. {battleState.opponentPokemon.level}</div>
          </div>
          <div className="pokemon-sprite opponent">{battleState.opponentPokemon.avatar}</div>

          {/* Efectos de ataque */}
          <div className="effects-container">
            {effects.map((effect) => (
              <div
                key={effect.id}
                className="attack-effect"
                style={{
                  background: getEffectColor(effect.type),
                  left: `${effect.x}%`,
                  top: `${effect.y}%`,
                }}
              >
                {effect.damage}
              </div>
            ))}
          </div>
          <div className="hp-bar-container">
            <div className="hp-bar-label">HP</div>
            <div className="hp-bar">
              <div
                className="hp-fill"
                style={{
                  width: `${progressPercentage(battleState.opponentHp, battleState.opponentPokemon.maxHp)}%`,
                }}
              />
            </div>
            <div className="hp-text">
              {battleState.opponentHp}/{battleState.opponentPokemon.maxHp}
            </div>
          </div>
        </div>

        {/* Pokémon del jugador */}
        <div className="pokemon-section player">
          <div className="pokemon-sprite player">{battleState.playerPokemon.avatar}</div>
          <div className="pokemon-info">
            <h3>{battleState.playerPokemon.name}</h3>
            <div className="level">Nv. {battleState.playerPokemon.level}</div>
          </div>
          <div className="hp-bar-container">
            <div className="hp-bar-label">HP</div>
            <div className="hp-bar">
              <div
                className="hp-fill"
                style={{
                  width: `${progressPercentage(battleState.playerHp, battleState.playerPokemon.maxHp)}%`,
                }}
              />
            </div>
            <div className="hp-text">
              {battleState.playerHp}/{battleState.playerPokemon.maxHp}
            </div>
          </div>
        </div>
      </div>

      {/* Log de batalla */}
      <div className="battle-log">
        {battleState.battleLog.map((log, index) => (
          <div key={index} className="log-entry">
            {log}
          </div>
        ))}
      </div>

      {/* Controles */}
      {!battleState.isOver ? (
        <div className="battle-controls">
          <div className="moves-grid">
            {battleState.playerPokemon.moves.map((move) => (
              <button
                key={move.id}
                className={`move-button ${move.type} ${
                  selectedMove?.id === move.id ? 'selected' : ''
                }`}
                onClick={() => handleMoveClick(move)}
                disabled={animating}
              >
                <div className="move-name">{move.name}</div>
                <div className="move-type">{move.type}</div>
                <div className="move-power">PWR: {move.power}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="battle-end">
          <h2>
            {battleState.winner === 'player' ? '¡Ganaste!' : '¡Perdiste!'}
          </h2>
          <p>
            {battleState.winner === 'player'
              ? `¡${battleState.playerPokemon.name} es increíble!`
              : `${battleState.opponentPokemon.name} fue demasiado fuerte...`}
          </p>
        </div>
      )}
    </div>
  );
};
