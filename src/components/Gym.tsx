import React from 'react';
import './Gym.css';

interface GymProps {
  onBattle: () => void;
  onExit: () => void;
}

export const Gym: React.FC<GymProps> = ({ onBattle, onExit }) => {
  return (
    <div className="gym-container">
      <div className="gym-interior">
        <div className="gym-header">
          <div className="gym-icon">🏛️</div>
          <h1>Gimnasio de la Ciudad</h1>
          <p className="gym-leader-title">Líder: Lance</p>
        </div>

        <div className="gym-arena">
          <div className="trainer-info">
            <div className="trainer-avatar">🧔</div>
            <div className="trainer-details">
              <h2>Lance</h2>
              <p>Cuando me derroces, tendrás acceso a mi formulario de contacto. ¡Demuéstrale al mundo que eres un verdadero Maestro Pokémon!</p>
            </div>
          </div>

          <div className="gym-description">
            <p>
              Este es el último desafío de tu viaje. Lance es el campeón del gimnasio. Derrótalo y conseguirás el formulario de contacto para conectar conmigo.
            </p>
          </div>
        </div>

        <div className="gym-controls">
          <button className="battle-button" onClick={onBattle}>
            ⚡ Desafiar a Lance
          </button>
          <button className="exit-button" onClick={onExit}>
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};
