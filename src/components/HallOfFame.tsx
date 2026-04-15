import React, { useEffect, useState } from 'react';
import type { Pokemon } from '../types/pokemon';
import { getSpriteFront, getSpriteFrontFallback } from '../services/pokeApi';
import { ContactForm } from './ContactForm';
import './HallOfFame.css';

interface HallOfFameProps {
  playerName: string;
  playerTeam: Pokemon[];
  onPlayAgain: () => void;
}

export const HallOfFame: React.FC<HallOfFameProps> = ({ playerName, playerTeam, onPlayAgain }) => {
  const [revealedCount, setRevealedCount] = useState(0);

  // Reveal Pokémon one by one on mount
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    playerTeam.forEach((_, i) => {
      timers.push(setTimeout(() => setRevealedCount(i + 1), 400 + i * 600));
    });
    return () => timers.forEach(clearTimeout);
  }, [playerTeam]);

  return (
    <div className="hof-page">
      <div className="hof-spotlight" />

      {/* ===== HALL OF FAME HEADER ===== */}
      <header className="hof-header">
        <div className="hof-badge">★</div>
        <h1 className="hof-title">SALÓN DE LA FAMA</h1>
        <p className="hof-subtitle">Entrenador/a: {playerName}</p>
      </header>

      {/* ===== WINNING TEAM ===== */}
      <section className="hof-team">
        <div className="hof-team-grid">
          {playerTeam.map((poke, i) => (
            <div
              key={poke.id}
              className={`hof-pokemon-slot ${i < revealedCount ? 'hof-pokemon-revealed' : ''}`}
            >
              <div className="hof-pokemon-glow" />
              <img
                src={getSpriteFront(parseInt(poke.id))}
                alt={poke.name}
                className="hof-pokemon-sprite"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getSpriteFrontFallback(parseInt(poke.id));
                }}
              />
              <div className="hof-pokemon-name">{poke.name}</div>
              <div className="hof-pokemon-level">Lv.{poke.level}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="hof-divider" />

      {/* ===== QUIÉN SOY ===== */}
      <section className="hof-section">
        <h2 className="hof-section-title">QUIÉN SOY</h2>
        <p className="hof-section-text">
          ¡Hola! Soy una desarrolladora apasionada por crear experiencias interactivas
          y divertidas. Este portfolio es mi carta de presentación: si pudiste llegar
          hasta aquí, sabes que me gustan los retos creativos.
        </p>
        <p className="hof-section-text" style={{ marginTop: '10px' }}>
          Me encanta combinar tecnología con diseño para construir aplicaciones
          que sorprendan y enganchen a los usuarios.
        </p>
      </section>

      {/* ===== A QUÉ ME DEDICO ===== */}
      <section className="hof-section">
        <h2 className="hof-section-title">A QUÉ ME DEDICO</h2>
        <div className="hof-dedic-grid">
          <div className="hof-dedic-card">
            <div className="hof-dedic-icon">🌐</div>
            <h3>Desarrollo Web</h3>
            <p>Creación de aplicaciones web modernas con React, TypeScript y las últimas tecnologías del ecosistema frontend.</p>
          </div>
          <div className="hof-dedic-card">
            <div className="hof-dedic-icon">🎨</div>
            <h3>UI / UX</h3>
            <p>Diseño de interfaces intuitivas y atractivas, con animaciones fluidas y atención al detalle.</p>
          </div>
          <div className="hof-dedic-card">
            <div className="hof-dedic-icon">⚙️</div>
            <h3>Backend</h3>
            <p>Desarrollo de APIs y servicios con Node.js, bases de datos y arquitectura de microservicios.</p>
          </div>
        </div>
      </section>

      {/* ===== EXPERIENCIA ===== */}
      <section className="hof-section">
        <h2 className="hof-section-title">EXPERIENCIA</h2>
        <div className="hof-timeline">
          <div className="hof-timeline-item">
            <div className="hof-timeline-dot" />
            <div className="hof-timeline-content">
              <div className="hof-timeline-date">2024 - Presente</div>
              <h3>Desarrolladora Frontend</h3>
              <p>Desarrollo de aplicaciones web con React y TypeScript. Implementación de interfaces interactivas y sistemas de diseño.</p>
            </div>
          </div>
          <div className="hof-timeline-item">
            <div className="hof-timeline-dot" />
            <div className="hof-timeline-content">
              <div className="hof-timeline-date">2023 - 2024</div>
              <h3>Desarrolladora Full Stack Jr.</h3>
              <p>Construcción de APIs REST con Node.js y Express. Integración con bases de datos y servicios externos.</p>
            </div>
          </div>
          <div className="hof-timeline-item">
            <div className="hof-timeline-dot" />
            <div className="hof-timeline-content">
              <div className="hof-timeline-date">2022 - 2023</div>
              <h3>Formación y Proyectos Personales</h3>
              <p>Bootcamp de desarrollo web. Proyectos personales y contribuciones open source.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HABILIDADES TÉCNICAS ===== */}
      <section className="hof-section">
        <h2 className="hof-section-title">HABILIDADES TÉCNICAS</h2>
        <div className="hof-skills-grid">
          {[
            { name: 'React / TypeScript', level: 90 },
            { name: 'CSS / Animaciones', level: 85 },
            { name: 'Node.js / Express', level: 80 },
            { name: 'Git / GitHub', level: 85 },
            { name: 'APIs REST', level: 80 },
            { name: 'SQL / NoSQL', level: 75 },
            { name: 'Testing', level: 70 },
            { name: 'Docker', level: 65 },
          ].map(skill => (
            <div key={skill.name} className="hof-skill-item">
              <div className="hof-skill-name">{skill.name}</div>
              <div className="hof-skill-bar">
                <div className="hof-skill-fill" style={{ width: `${skill.level}%` }} />
              </div>
              <div className="hof-skill-pct">{skill.level}%</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SOFT SKILLS ===== */}
      <section className="hof-section">
        <h2 className="hof-section-title">HABILIDADES BLANDAS</h2>
        <div className="hof-soft-grid">
          {[
            { name: 'Comunicación', icon: '🗣️', desc: 'Capacidad para explicar conceptos técnicos de forma clara y concisa.' },
            { name: 'Trabajo en equipo', icon: '🤝', desc: 'Colaboración efectiva con equipos multidisciplinarios y metodologías ágiles.' },
            { name: 'Resolución de problemas', icon: '🧩', desc: 'Análisis lógico y creatividad para encontrar soluciones eficientes.' },
            { name: 'Adaptabilidad', icon: '🔄', desc: 'Facilidad para aprender nuevas tecnologías y adaptarme a cambios.' },
            { name: 'Creatividad', icon: '✨', desc: 'Pasión por el diseño innovador y las experiencias de usuario únicas.' },
            { name: 'Gestión del tiempo', icon: '⏱️', desc: 'Organización y priorización de tareas para cumplir deadlines.' },
          ].map(skill => (
            <div key={skill.name} className="hof-soft-card">
              <div className="hof-soft-icon">{skill.icon}</div>
              <h3>{skill.name}</h3>
              <p>{skill.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CONTACTO ===== */}
      <section className="hof-section hof-section-contact">
        <h2 className="hof-section-title">CONTACTO</h2>
        <ContactForm onClose={() => {}} />
      </section>

      {/* ===== PLAY AGAIN ===== */}
      <div className="hof-footer">
        <button className="hof-action-btn hof-btn-replay" onClick={onPlayAgain}>
          🔄 JUGAR DE NUEVO
        </button>
      </div>
    </div>
  );
};
