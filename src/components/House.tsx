import React from 'react';
import { GAME_MAP } from '../data/map';
import './House.css';

interface HouseProps {
  houseId: string;
  onExit: () => void;
}

export const House: React.FC<HouseProps> = ({ houseId, onExit }) => {
  const house = GAME_MAP.houses.find((h) => h.id === houseId);

  if (!house) return null;

  const messages: Record<string, string> = {
    'house-1':
      '¡Bienvenido a la casa del Profesor! Aquí es donde todo comienza tu aventura con Pokémon. El profesor te ha entrenado bien. Ahora debes enfrentarte al gimnasio para demostrar tu valía.',
    'house-2':
      '¡Hola! Soy la enfermera Pokémon. Traes tus Pokémon aquí para que los cure. Veo que estás en buena condición. ¡Sigue adelante!',
    'house-3':
      '¡Bienvenido a la tienda! Aquí vendo todo lo que necesitas para tus aventuras. Desafortunadamente, estoy de mantenimiento en este portafolio. ¡Vuelve pronto!',
    'house-4':
      '¡Hola coleccionista! Aquí guardo mis rarezas. Eres bienvenido aquí, pero primero debes vencer al líder del gimnasio para demostrar que eres digno de mi colección.',
  };

  return (
    <div className="house-container">
      <div className="house-interior">
        <div className="house-icon">🏠</div>
        <h2>{house.name}</h2>
        <p className="house-description">{messages[houseId]}</p>
        <button className="exit-button" onClick={onExit}>
          Salir
        </button>
      </div>
    </div>
  );
};
