import React, { useState, useEffect } from 'react';
import { GAME_MAP, initializeMapTiles } from '../data/map';
import { useGame } from '../hooks/useGame';
import { PlayerInfo } from './PlayerInfo';
import { Pokedex } from './Pokedex';
import './GameMap.css';

interface GameMapProps {
  onLocationEnter?: (location: string) => void;
}

export const GameMapComponent: React.FC<GameMapProps> = ({ onLocationEnter }) => {
  const { playerPosition, setPlayerPosition, playerPokemon, caughtPokemon } = useGame();
  const [tiles] = useState(() => initializeMapTiles());
  const [showPokedex, setShowPokedex] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const { x, y } = playerPosition;
      let newX = x;
      let newY = y;

      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          newY = Math.max(0, y - 1);
          break;
        case 'arrowdown':
        case 's':
          newY = Math.min(GAME_MAP.height - 1, y + 1);
          break;
        case 'arrowleft':
        case 'a':
          newX = Math.max(0, x - 1);
          break;
        case 'arrowright':
        case 'd':
          newX = Math.min(GAME_MAP.width - 1, x + 1);
          break;
        case 'enter':
          checkLocationInteraction();
          return;
        default:
          return;
      }

      setPlayerPosition({ x: newX, y: newY });
      checkLocationInteraction();
    };

    const checkLocationInteraction = () => {
      const currentTile = tiles[playerPosition.y]?.[playerPosition.x];
      if (currentTile && currentTile.location && onLocationEnter) {
        onLocationEnter(currentTile.location);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [playerPosition, tiles, onLocationEnter, setPlayerPosition]);

  return (
    <div className="game-map-container">
      <div className="map-top-section">
        <PlayerInfo pokemon={playerPokemon} />
      </div>
      <div className="map-grid">
        {tiles.map((row, y) =>
          row.map((tile, x) => (
            <div
              key={`${x}-${y}`}
              className={`tile tile-${tile.type} ${
                playerPosition.x === x && playerPosition.y === y
                  ? 'player-here'
                  : ''
              }`}
              title={tile.npc || tile.type}
            >
              {playerPosition.x === x && playerPosition.y === y && (
                <div className="player-avatar">🧑</div>
              )}
              {tile.type === 'building' && !(playerPosition.x === x && playerPosition.y === y) ? (
                <div className="building-icon">🏠</div>
              ) : null}
              {tile.type === 'gym' && !(playerPosition.x === x && playerPosition.y === y) ? (
                <div className="gym-icon">🏛️</div>
              ) : null}
            </div>
          ))
        )}
      </div>

      <div className="map-info">
        <div className="position-info">
          Posición: ({playerPosition.x}, {playerPosition.y})
        </div>
        <button 
          className="pokedex-button" 
          onClick={() => setShowPokedex(true)}
          title="Ver Pokédex"
        >
          📖 Pokédex ({caughtPokemon.length})
        </button>
        <div className="controls-info">
          <p>🎮 Controles:</p>
          <p>↑↓←→ o WASD - Moverte</p>
          <p>ENTER - Interactuar</p>
        </div>
      </div>

      {showPokedex && (
        <Pokedex 
          caughtPokemon={caughtPokemon}
          onClose={() => setShowPokedex(false)}
        />
      )}
    </div>
  );
};
