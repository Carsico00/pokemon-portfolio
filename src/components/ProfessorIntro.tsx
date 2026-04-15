import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ProfessorIntro.css';

interface ProfessorIntroProps {
  onComplete: (playerName: string, gender: 'boy' | 'girl') => void;
}

// Showdown trainer sprites
const ROWAN_SPRITE = 'https://play.pokemonshowdown.com/sprites/trainers/rowan.png';
const DAWN_SPRITE = 'https://play.pokemonshowdown.com/sprites/trainers/dawn.png';
const LUCAS_SPRITE = 'https://play.pokemonshowdown.com/sprites/trainers/lucas.png';
// Gen IV Munchlax sprite from PokéAPI
const MUNCHLAX_SPRITE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/446.png';

type IntroPhase =
  | 'press-start'
  | 'fade-in'
  | 'dialog'
  | 'pokeball'
  | 'pokeball-shake'
  | 'pokeball-open'
  | 'pokemon-reveal'
  | 'dialog-post-pokemon'
  | 'gender-select'
  | 'player-reveal'
  | 'name-input'
  | 'farewell'
  | 'fade-out';

const DIALOG_LINES = [
  '¡Hola! ¡Bienvenido al mundo de los Pokémon!',
  'Me llamo Serbal. Pero la gente me conoce como el Profesor Pokémon.',
  'Este mundo está habitado por unas criaturas llamadas Pokémon.',
];

const DIALOG_POST_POKEMON = [
  'Los Pokémon poseen poderes y habilidades misteriosas.',
  'Algunos viven junto a los humanos. Otros habitan en la naturaleza salvaje.',
  'Yo me dedico al estudio de los Pokémon como profesión.',
];

const GENDER_QUESTION = 'Antes de nada, dime. ¿Eres un chico? ¿O eres una chica?';
const NAME_QUESTION = 'Dime, ¿cuál es tu nombre?';

export const ProfessorIntro: React.FC<ProfessorIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<IntroPhase>('press-start');
  const [dialogIndex, setDialogIndex] = useState(0);
  const [dialogText, setDialogText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [gender, setGender] = useState<'boy' | 'girl' | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [showPokemon, setShowPokemon] = useState(false);
  const [farewellIndex, setFarewellIndex] = useState(0);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerNameRef = useRef('');

  // Keep refs in sync
  useEffect(() => { playerNameRef.current = playerName; }, [playerName]);

  // Currently active dialog lines based on phase
  const getCurrentLines = useCallback((): string[] => {
    switch (phase) {
      case 'dialog': return DIALOG_LINES;
      case 'dialog-post-pokemon': return DIALOG_POST_POKEMON;
      case 'gender-select': return [GENDER_QUESTION];
      case 'name-input': return [NAME_QUESTION];
      case 'farewell': {
        const name = playerNameRef.current;
        return [
          `Así que te llamas ${name}...`,
          `¡${name}! Tu aventura Pokémon está a punto de comenzar.`,
          'Un mundo de sueños y aventuras con Pokémon te espera. ¡Vamos!',
        ];
      }
      default: return [];
    }
  }, [phase]);

  // Typewriter effect
  const typeText = useCallback((text: string) => {
    setIsTyping(true);
    setDialogText('');
    let i = 0;
    if (typingRef.current) clearInterval(typingRef.current);
    typingRef.current = setInterval(() => {
      i++;
      setDialogText(text.slice(0, i));
      if (i >= text.length) {
        if (typingRef.current) clearInterval(typingRef.current);
        typingRef.current = null;
        setIsTyping(false);
      }
    }, 35);
  }, []);

  // Start typing when phase/index changes
  useEffect(() => {
    const lines = getCurrentLines();
    if (lines.length > 0 && dialogIndex < lines.length) {
      typeText(lines[dialogIndex]);
    }
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
    };
  }, [phase, dialogIndex, typeText, getCurrentLines]);

  // Auto-focus name input
  useEffect(() => {
    if (phase === 'name-input' && !isTyping) {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [phase, isTyping]);

  // Phase transitions
  const handleStart = () => {
    setPhase('fade-in');
    setTimeout(() => {
      setPhase('dialog');
      setDialogIndex(0);
    }, 1500);
  };

  const handleAdvanceDialog = useCallback(() => {
    const lines = getCurrentLines();

    if (isTyping) {
      // Skip typing → show full text
      if (typingRef.current) clearInterval(typingRef.current);
      typingRef.current = null;
      setDialogText(lines[dialogIndex]);
      setIsTyping(false);
      return;
    }

    if (dialogIndex < lines.length - 1) {
      setDialogIndex(prev => prev + 1);
      return;
    }

    // End of current dialog set → transition to next phase
    switch (phase) {
      case 'dialog':
        setPhase('pokeball');
        // Pokéball drops → shakes → opens with flash → Munchlax appears
        setTimeout(() => {
          setPhase('pokeball-shake');
          setTimeout(() => {
            setPhase('pokeball-open');
            setTimeout(() => {
              setShowPokemon(true);
              setPhase('pokemon-reveal');
              setTimeout(() => {
                setPhase('dialog-post-pokemon');
                setDialogIndex(0);
              }, 1800);
            }, 600);
          }, 1200);
        }, 1000);
        break;
      case 'dialog-post-pokemon':
        setPhase('gender-select');
        setDialogIndex(0);
        break;
      case 'gender-select':
        // Don't advance — wait for selection
        break;
      case 'name-input':
        // Don't advance — wait for input
        break;
      case 'farewell':
        if (farewellIndex < 2) {
          setFarewellIndex(prev => prev + 1);
          setDialogIndex(prev => prev + 1);
        } else {
          setPhase('fade-out');
          setTimeout(() => {
            onComplete(playerName || 'Dawn', gender || 'girl');
          }, 1500);
        }
        break;
    }
  }, [isTyping, dialogIndex, phase, getCurrentLines, playerName, gender, farewellIndex, onComplete]);

  const handleGenderSelect = (g: 'boy' | 'girl') => {
    setGender(g);
    setPhase('player-reveal');
    setTimeout(() => {
      setPhase('name-input');
      setDialogIndex(0);
    }, 1500);
  };

  const handleNameSubmit = useCallback(() => {
    const name = playerName.trim();
    if (name.length === 0) return;
    setPhase('farewell');
    setDialogIndex(0);
    setFarewellIndex(0);
  }, [playerName]);

  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase === 'press-start' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleStart();
        return;
      }
      if (phase === 'name-input') {
        if (e.key === 'Enter' && playerName.trim().length > 0) {
          e.preventDefault();
          handleNameSubmit();
        }
        return;
      }
      if (['dialog', 'dialog-post-pokemon', 'farewell'].includes(phase)) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'z') {
          e.preventDefault();
          handleAdvanceDialog();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, handleAdvanceDialog, playerName, handleNameSubmit]);

  const showRowan = !['press-start', 'fade-in', 'fade-out'].includes(phase);
  const showDialogBox = !['press-start', 'fade-in', 'fade-out', 'pokeball', 'pokeball-shake', 'pokeball-open', 'pokemon-reveal', 'player-reveal'].includes(phase);
  const showGenderOptions = phase === 'gender-select' && !isTyping;
  const showNameInput = phase === 'name-input' && !isTyping;


  return (
    <div className="pi-wrapper" onClick={phase === 'press-start' ? handleStart : undefined}>
      {/* Press Start */}
      {phase === 'press-start' && (
        <div className="pi-start-screen">
          <div className="pi-start-title">PORTFOLIO</div>
          <div className="pi-start-subtitle">PODKEMON</div>
          <div className="pi-start-prompt">Pulsa ENTER para comenzar</div>
        </div>
      )}

      {/* Fade in/out overlay */}
      {(phase === 'fade-in' || phase === 'fade-out') && (
        <div className={`pi-fade ${phase === 'fade-out' ? 'pi-fade-out' : 'pi-fade-in'}`} />
      )}

      {phase !== 'press-start' && (
        <>
          {/* === TOP SCREEN === */}
          <div className="pi-top-screen">
            {/* Background */}
            <div className="pi-bg pi-bg-visible" />

            {/* Professor Rowan */}
            {showRowan && !['gender-select', 'player-reveal', 'pokeball', 'pokeball-shake', 'pokeball-open'].includes(phase) && (
              <div className="pi-rowan-container">
                <img
                  src={ROWAN_SPRITE}
                  alt="Professor Rowan"
                  className={`pi-rowan-sprite ${phase === 'dialog' && dialogIndex === 0 ? 'pi-rowan-enter' : ''}`}
                />
              </div>
            )}

            {/* Pokéball opening sequence */}
            {['pokeball', 'pokeball-shake', 'pokeball-open'].includes(phase) && (
              <div className="pi-pokeball-center-area">
                <div className={`pi-pokeball-big ${
                  phase === 'pokeball' ? 'pi-pokeball-drop' :
                  phase === 'pokeball-shake' ? 'pi-pokeball-shaking' :
                  'pi-pokeball-burst'
                }`}>
                  <div className="pi-pokeball-top" />
                  <div className="pi-pokeball-line" />
                  <div className="pi-pokeball-bottom" />
                  <div className="pi-pokeball-button" />
                </div>
                {/* White flash on open */}
                {phase === 'pokeball-open' && <div className="pi-pokeball-flash" />}
              </div>
            )}

            {/* Munchlax next to Rowan after reveal */}
            {showPokemon && ['pokemon-reveal', 'dialog-post-pokemon'].includes(phase) && (
              <div className="pi-munchlax-beside">
                <img src={MUNCHLAX_SPRITE} alt="Munchlax" className="pi-munchlax" />
              </div>
            )}

            {/* Gender selection — both characters side by side */}
            {(phase === 'gender-select' || phase === 'player-reveal') && (
              <div className="pi-gender-sprites">
                <div
                  className={`pi-gender-option ${gender === 'girl' ? 'pi-gender-selected' : ''}`}
                  onClick={() => !gender && handleGenderSelect('girl')}
                >
                  <div className="pi-gender-bg pi-gender-bg-girl" />
                  <img src={DAWN_SPRITE} alt="Dawn" className="pi-gender-img" />
                  {!gender && <div className="pi-gender-label">CHICA</div>}
                </div>
                <div
                  className={`pi-gender-option ${gender === 'boy' ? 'pi-gender-selected' : ''}`}
                  onClick={() => !gender && handleGenderSelect('boy')}
                >
                  <div className="pi-gender-bg pi-gender-bg-boy" />
                  <img src={LUCAS_SPRITE} alt="Lucas" className="pi-gender-img" />
                  {!gender && <div className="pi-gender-label">CHICO</div>}
                </div>
              </div>
            )}

            {/* Player sprite in name/farewell phases */}
            {['name-input', 'farewell'].includes(phase) && gender && (
              <div className="pi-player-sprite-area">
                <img
                  src={gender === 'girl' ? DAWN_SPRITE : LUCAS_SPRITE}
                  alt={gender === 'girl' ? 'Dawn' : 'Lucas'}
                  className="pi-player-sprite"
                />
              </div>
            )}

            {/* Dialog Box — inside top screen, at the bottom */}
            {showDialogBox && (
              <div className="pi-dialog-area" onClick={handleAdvanceDialog}>
                <div className="pi-dialog-box">
                  <div className="pi-dialog-text">
                    {dialogText}
                    {isTyping && <span className="pi-cursor">▌</span>}
                  </div>

                  {/* Gender selection buttons */}
                  {showGenderOptions && (
                    <div className="pi-gender-buttons">
                      <button className="pi-btn" onClick={(e) => { e.stopPropagation(); handleGenderSelect('girl'); }}>CHICA</button>
                      <button className="pi-btn" onClick={(e) => { e.stopPropagation(); handleGenderSelect('boy'); }}>CHICO</button>
                    </div>
                  )}

                  {/* Name input */}
                  {showNameInput && (
                    <div className="pi-name-area">
                      <input
                        ref={nameInputRef}
                        type="text"
                        className="pi-name-input"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value.slice(0, 10))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && playerName.trim().length > 0) {
                            e.preventDefault();
                            e.stopPropagation();
                            handleNameSubmit();
                          }
                        }}
                        placeholder="Tu nombre..."
                        maxLength={10}
                        autoComplete="off"
                      />
                      <button
                        className="pi-btn pi-btn-confirm"
                        onClick={(e) => { e.stopPropagation(); handleNameSubmit(); }}
                        disabled={playerName.trim().length === 0}
                      >
                        CONFIRMAR
                      </button>
                    </div>
                  )}

                  {/* Advance hint */}
                  {!isTyping && !showGenderOptions && !showNameInput && (
                    <div className="pi-dialog-advance">▼</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* DS Hinge */}
          <div className="pi-ds-hinge" />

          {/* === BOTTOM SCREEN — Pokéball === */}
          <div className="pi-bottom-screen">
            <div className="pi-bottom-pokeball">
              <div className="pi-bottom-pokeball-top" />
              <div className="pi-bottom-pokeball-bot" />
              <div className="pi-bottom-pokeball-band" />
              <div className="pi-bottom-pokeball-center">
                <div className="pi-bottom-pokeball-inner" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
