import React from 'react';
import './CynthiaArena.css';

interface CynthiaArenaProps {
  onEnter: () => void;
}

export const CynthiaArena: React.FC<CynthiaArenaProps> = ({ onEnter }) => {
  return (
    <div className="cynthia-arena-container">
      <div className="arena-background">
        <div className="arena-floor"></div>
        <div className="arena-pillars">
          <div className="pillar left"></div>
          <div className="pillar right"></div>
        </div>
      </div>

      <div className="cynthia-character">
        <div className="cynthia-sprite">❓</div>
        <div className="cynthia-name">???</div>
        <div className="cynthia-title">CREADORA DEL PORTFOLIO</div>
      </div>

      <div className="arena-dialog">
        <div className="dialog-box">
          <p className="dialog-text">
            He estado esperando este momento.<br />
            Tu Pokémon y el mío...debemos reunirnos aquí.
          </p>
        </div>

        <button className="enter-button" onClick={onEnter}>
          ACEPTAR BATALLA
        </button>
      </div>

      <div className="arena-floor-pattern">
        <div className="tile t1"></div>
        <div className="tile t2"></div>
        <div className="tile t3"></div>
        <div className="tile t4"></div>
      </div>
    </div>
  );
};
