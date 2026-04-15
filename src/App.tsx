import { useState, useEffect, useCallback } from 'react';
import type { Pokemon } from './types/pokemon';
import { ProfessorIntro } from './components/ProfessorIntro';
import { ChampionRoom } from './components/ChampionRoom';
import { CynthiaTeamSelect } from './components/CynthiaTeamSelect';
import { CynthiaBattle } from './components/CynthiaBattle';
import { HallOfFame } from './components/HallOfFame';
import { loadCynthiaTeam } from './services/pokeApi';
import { useMusic } from './hooks/useMusic';
import { musicEngine } from './services/musicService';
import './App.css';

type GamePhase = 'intro' | 'champion-room' | 'team-select' | 'loading-battle' | 'battle' | 'post-victory' | 'hall-of-fame' | 'defeat';

const PHASE_TRACKS: Record<GamePhase, string> = {
  'intro': 'intro',
  'champion-room': 'champion-room',
  'team-select': 'champion-room',
  'loading-battle': 'champion-room',
  'battle': 'champion-room',
  'post-victory': 'victory',
  'hall-of-fame': 'victory',
  'defeat': 'defeat',
};

// Floating music toggle button
function MusicToggle({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="music-toggle"
      title={muted ? 'Activar música' : 'Silenciar música'}
      aria-label={muted ? 'Activar música' : 'Silenciar música'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}

function App() {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [playerName, setPlayerName] = useState('');
  const [playerGender, setPlayerGender] = useState<'boy' | 'girl'>('girl');

  const [playerTeam, setPlayerTeam] = useState<Pokemon[]>([]);
  const [cynthiaTeam, setCynthiaTeam] = useState<Pokemon[]>([]);
  const [userInteracted, setUserInteracted] = useState(false);

  const track = PHASE_TRACKS[phase];
  const { muted, toggleMute } = useMusic(userInteracted ? track : null);

  // Start audio on first user interaction (browser autoplay policy)
  const handleFirstInteraction = useCallback(() => {
    if (!userInteracted) {
      setUserInteracted(true);
      // Resume AudioContext if it was created before interaction
      musicEngine.play(PHASE_TRACKS[phase]);
    }
  }, [userInteracted, phase]);

  useEffect(() => {
    const handler = () => handleFirstInteraction();
    window.addEventListener('click', handler, { once: true });
    window.addEventListener('keydown', handler, { once: true });
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
    };
  }, [handleFirstInteraction]);

  // Pre-load Cynthia's team when entering team select
  useEffect(() => {
    if (phase === 'loading-battle' && playerTeam.length > 0) {
      loadCynthiaTeam().then(team => {
        setCynthiaTeam(team);
        setPhase('battle');
      });
    }
  }, [phase, playerTeam]);

  if (phase === 'intro') {
    return (
      <>
        <ProfessorIntro
          onComplete={(name, gender) => {
            setPlayerName(name);
            setPlayerGender(gender);
            setPhase('champion-room');
          }}
        />
        <MusicToggle muted={muted} onToggle={toggleMute} />
      </>
    );
  }

  if (phase === 'champion-room') {
    return (
      <>
        <ChampionRoom onStartTeamSelect={() => setPhase('team-select')} />
        <MusicToggle muted={muted} onToggle={toggleMute} />
      </>
    );
  }

  if (phase === 'team-select') {
    return (
      <>
        <CynthiaTeamSelect
          onTeamSelected={(team) => {
            setPlayerTeam(team);
            setPhase('loading-battle');
          }}
        />
        <MusicToggle muted={muted} onToggle={toggleMute} />
      </>
    );
  }

  if (phase === 'loading-battle') {
    return (
      <>
        <div style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', background: '#1a1a1a',
          color: '#f8f0d0', fontFamily: "'Orbitron', monospace",
        }}>
          <div style={{ fontSize: '14px', marginBottom: '16px', letterSpacing: '2px' }}>
            PREPARANDO BATALLA...
          </div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>
            {playerName ? `¡${playerName}! ` : ''}??? te está esperando
          </div>
          <div style={{ fontSize: '9px', opacity: 0.4, marginTop: '6px' }}>
            {playerGender === 'boy' ? '♂' : '♀'}
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: '#f88830',
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
        <MusicToggle muted={muted} onToggle={toggleMute} />
      </>
    );
  }

  if (phase === 'battle' && playerTeam.length > 0 && cynthiaTeam.length > 0) {
    return (
      <>
        <CynthiaBattle
          playerTeam={playerTeam}
          cynthiaTeam={cynthiaTeam}
          onVictory={() => setPhase('post-victory')}
          onDefeat={() => setPhase('defeat')}
        />
        <MusicToggle muted={muted} onToggle={toggleMute} />
      </>
    );
  }

  if (phase === 'post-victory') {
    return (
      <>
        <ChampionRoom
          onStartTeamSelect={() => {}}
          postVictory={true}
          onEnterHallOfFame={() => setPhase('hall-of-fame')}
        />
        <MusicToggle muted={muted} onToggle={toggleMute} />
      </>
    );
  }

  if (phase === 'hall-of-fame') {
    return (
      <>
        <HallOfFame
          playerName={playerName}
          playerTeam={playerTeam}
          onPlayAgain={() => {
            setPlayerTeam([]);
            setCynthiaTeam([]);
            setPhase('champion-room');
          }}
        />
        <MusicToggle muted={muted} onToggle={toggleMute} />
      </>
    );
  }

  if (phase === 'defeat') {
    return (
      <>
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #1a1a2a, #0a0a1a)',
        color: '#a0a0c0', fontFamily: "'Orbitron', monospace", gap: '16px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '3px' }}>
          DERROTA
        </div>
        <div style={{ fontSize: '11px', color: '#808090', maxWidth: '280px', lineHeight: 1.6 }}>
          Te has quedado sin Pokémon... ??? sigue invicta.
        </div>
        <button
          onClick={() => {
            setPlayerTeam([]);
            setCynthiaTeam([]);
            setPhase('team-select');
          }}
          style={{
            marginTop: '16px', padding: '10px 30px',
            background: 'linear-gradient(180deg, #48b868, #38a858)',
            color: '#fff', border: '2px solid #585858', borderRadius: '8px',
            fontFamily: "'Orbitron', monospace", fontSize: '12px', fontWeight: 'bold',
            cursor: 'pointer', letterSpacing: '2px',
          }}
        >
          INTENTAR DE NUEVO
        </button>
        <button
          onClick={() => {
            setPlayerTeam([]);
            setCynthiaTeam([]);
            setPhase('champion-room');
          }}
          style={{
            padding: '8px 20px',
            background: 'transparent', color: '#808090',
            border: '1px solid #404050', borderRadius: '6px',
            fontFamily: "'Orbitron', monospace", fontSize: '10px',
            cursor: 'pointer',
          }}
        >
          VOLVER AL INICIO
        </button>
      </div>
      <MusicToggle muted={muted} onToggle={toggleMute} />
      </>
    );
  }

  return null;
}

export default App;

