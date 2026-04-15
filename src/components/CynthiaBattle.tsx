import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Pokemon, Move, PokemonType } from '../types/pokemon';
import { getSpriteFront, getSpriteBack, getSpriteFrontFallback, getSpriteBackFallback } from '../services/pokeApi';
import { CYNTHIA_TRAINER_SPRITE, DAWN_TRAINER_SPRITE } from '../utils/trainerSprites';
import './CynthiaBattle.css';

interface CynthiaBattleProps {
  playerTeam: Pokemon[];
  cynthiaTeam: Pokemon[];
  onVictory: () => void;
  onDefeat: () => void;
}

type BattlePhase = 'intro' | 'action-select' | 'move-select' | 'party-select' | 'executing' | 'faint-switch' | 'victory' | 'defeat';

// Type effectiveness chart
const TYPE_CHART: Record<string, Record<string, number>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  electric: { water: 2, grass: 0.5, electric: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, grass: 0.5, electric: 2, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { grass: 2, electric: 0.5, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

function getEffectiveness(moveType: PokemonType, defType: PokemonType): number {
  return TYPE_CHART[moveType]?.[defType] ?? 1;
}

function calcDamage(attacker: Pokemon, defender: Pokemon, move: Move): number {
  if (move.power <= 0) return 0;

  const isSpecial = move.damageClass === 'special';
  const atk = isSpecial ? attacker.spAtk : attacker.attack;
  const def = isSpecial ? defender.spDef : defender.defense;
  const eff = getEffectiveness(move.type, defender.type);
  const stab = move.type === attacker.type ? 1.5 : 1;
  const rand = 0.85 + Math.random() * 0.15;

  const base = ((2 * attacker.level / 5 + 2) * move.power * atk / def) / 50 + 2;
  return Math.max(1, Math.floor(base * stab * eff * rand));
}

function getEffText(moveType: PokemonType, defType: PokemonType): string {
  const eff = getEffectiveness(moveType, defType);
  if (eff > 1) return '¡Es muy eficaz!';
  if (eff > 0 && eff < 1) return 'No es muy eficaz...';
  if (eff === 0) return 'No afecta al Pokémon enemigo...';
  return '';
}

export const CynthiaBattle: React.FC<CynthiaBattleProps> = ({
  playerTeam: initialPlayerTeam,
  cynthiaTeam: initialCynthiaTeam,
  onVictory,
  onDefeat,
}) => {
  // Deep copy teams to track HP per-pokemon
  const [pTeam, setPTeam] = useState<Pokemon[]>(() => initialPlayerTeam.map(p => ({ ...p })));
  const [cTeam, setCTeam] = useState<Pokemon[]>(() => initialCynthiaTeam.map(p => ({ ...p })));
  const [pIndex, setPIndex] = useState(0);
  const [cIndex, setCIndex] = useState(0);
  const [phase, setPhase] = useState<BattlePhase>('intro');
  const [messages, setMessages] = useState<string[]>([]);
  const [playerAnim, setPlayerAnim] = useState('');
  const [opponentAnim, setOpponentAnim] = useState('');
  const [playerMegaUsed, setPlayerMegaUsed] = useState(false);
  const [pendingPlayerMega, setPendingPlayerMega] = useState(false);
  const [showTrainers, setShowTrainers] = useState(true);
  const [showOpponentPoke, setShowOpponentPoke] = useState(false);
  const [showPlayerPoke, setShowPlayerPoke] = useState(false);
  const [opponentPokeballAnim, setOpponentPokeballAnim] = useState(false);
  const [playerPokeballAnim, setPlayerPokeballAnim] = useState(false);
  const [sendingOutOpponent, setSendingOutOpponent] = useState(false);
  const [sendingOutPlayer, setSendingOutPlayer] = useState(false);

  const logRef = useRef<HTMLDivElement>(null);

  const pMon = pTeam[pIndex];
  const cMon = cTeam[cIndex];

  // Get the sprite ID, using mega sprite if mega-evolved
  const getSpriteId = (pokemon: Pokemon): number => {
    if (pokemon.isMega && pokemon.mega) return pokemon.mega.megaSpriteId;
    return parseInt(pokemon.id);
  };

  // Apply mega evolution to a pokemon, returning a new object
  const applyMega = (pokemon: Pokemon): Pokemon => {
    if (!pokemon.mega || pokemon.isMega) return pokemon;
    return {
      ...pokemon,
      name: pokemon.mega.megaName,
      type: pokemon.mega.megaType as PokemonType,
      attack: pokemon.mega.megaAttack,
      defense: pokemon.mega.megaDefense,
      spAtk: pokemon.mega.megaSpAtk,
      spDef: pokemon.mega.megaSpDef,
      speed: pokemon.mega.megaSpeed,
      isMega: true,
    };
  };

  // Scroll log to bottom
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  // Intro sequence with pokeball throw animation
  useEffect(() => {
    if (phase !== 'intro') return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Step 1: "??? quiere luchar!"
    setMessages(['¡??? quiere luchar!']);

    // Step 2: Opponent throws pokeball
    timers.push(setTimeout(() => {
      setMessages(prev => [...prev, `¡??? envía a ${cMon.name}!`]);
      setOpponentPokeballAnim(true);
    }, 1200));

    // Step 3: Opponent pokemon appears from pokeball
    timers.push(setTimeout(() => {
      setOpponentPokeballAnim(false);
      setShowOpponentPoke(true);
      setSendingOutOpponent(true);
    }, 2200));

    // Clear opponent send-out animation
    timers.push(setTimeout(() => {
      setSendingOutOpponent(false);
    }, 2800));

    // Step 4: Mega evolve if applicable
    const hasMega = cMon.mega && !cMon.isMega;
    const megaDelay = hasMega ? 1200 : 0;

    if (hasMega) {
      timers.push(setTimeout(() => {
        setMessages(prev => [...prev, `¡??? usa la Mega Piedra! ¡${cMon.name} megaevoluciona a ${cMon.mega!.megaName}!`]);
        setCTeam(prev => {
          const next = [...prev];
          next[cIndex] = applyMega(next[cIndex]);
          return next;
        });
      }, 3000));
    }

    // Step 5: Player throws pokeball
    timers.push(setTimeout(() => {
      setMessages(prev => [...prev, `¡Adelante, ${pMon.name}!`]);
      setShowTrainers(false);
      setPlayerPokeballAnim(true);
    }, 3000 + megaDelay));

    // Step 6: Player pokemon appears
    timers.push(setTimeout(() => {
      setPlayerPokeballAnim(false);
      setShowPlayerPoke(true);
      setSendingOutPlayer(true);
    }, 4000 + megaDelay));

    // Clear player send-out animation
    timers.push(setTimeout(() => {
      setSendingOutPlayer(false);
    }, 4600 + megaDelay));

    // Step 7: Battle starts
    timers.push(setTimeout(() => {
      setPhase('action-select');
    }, 4800 + megaDelay));

    return () => timers.forEach(clearTimeout);
  }, []);

  // Add message helper
  const addMsg = useCallback((msg: string) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  // Execute a full turn
  const executeTurn = useCallback(async (playerMove: Move) => {
    setPhase('executing');

    let playerMon = { ...pTeam[pIndex] };
    let cynthiaMon = { ...cTeam[cIndex] };

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Apply player mega evolution if pending
    if (pendingPlayerMega && playerMon.mega && !playerMon.isMega) {
      addMsg(`¡Tu ${playerMon.name} megaevoluciona a ${playerMon.mega.megaName}!`);
      playerMon = applyMega(playerMon);
      setPTeam(prev => {
        const next = [...prev];
        next[pIndex] = { ...next[pIndex], ...playerMon, hp: next[pIndex].hp };
        return next;
      });
      setPlayerMegaUsed(true);
      setPendingPlayerMega(false);
      await wait(1200);
    }

    // Determine turn order by speed
    const playerFirst = playerMon.speed >= cynthiaMon.speed;

    const doAttack = (attacker: Pokemon, defender: Pokemon, move: Move, isPlayer: boolean): { newDefHp: number; fainted: boolean } => {
      const hit = Math.random() * 100 <= move.accuracy;
      if (!hit) {
        addMsg(`¡${attacker.name} usó ${move.name}!`);
        addMsg('¡Pero falló!');
        return { newDefHp: defender.hp, fainted: false };
      }

      const damage = calcDamage(attacker, defender, move);
      const newHp = Math.max(0, defender.hp - damage);

      addMsg(`¡${attacker.name} usó ${move.name}!`);

      // Animation
      if (isPlayer) {
        setPlayerAnim('cb-attack-player');
        setTimeout(() => { setOpponentAnim('cb-hit'); }, 300);
        setTimeout(() => { setPlayerAnim(''); setOpponentAnim(''); }, 800);
      } else {
        setOpponentAnim('cb-attack-opponent');
        setTimeout(() => { setPlayerAnim('cb-hit'); }, 300);
        setTimeout(() => { setPlayerAnim(''); setOpponentAnim(''); }, 800);
      }

      const effText = getEffText(move.type, defender.type);
      if (effText) addMsg(effText);

      if (damage > 0) {
        addMsg(`¡${defender.name} perdió ${damage} PS!`);
      }

      return { newDefHp: newHp, fainted: newHp <= 0 };
    };

    if (playerFirst) {
      // Player attacks first
      const result1 = doAttack(playerMon, cynthiaMon, playerMove, true);
      cynthiaMon.hp = result1.newDefHp;

      // Update cynthia team HP
      setCTeam(prev => {
        const next = [...prev];
        next[cIndex] = { ...next[cIndex], hp: result1.newDefHp };
        return next;
      });

      await wait(1500);

      if (result1.fainted) {
        addMsg(`¡${cynthiaMon.name} se debilitó!`);
        await wait(1000);

        // Find next alive cynthia pokemon
        const nextCI = cTeam.findIndex((p, i) => i !== cIndex && p.hp > 0);
        if (nextCI === -1) {
          // Victory!
          setPhase('victory');
          addMsg('¡Has derrotado a ???!');
          return;
        }

        setCIndex(nextCI);
        const nextPoke = cTeam[nextCI];
        addMsg(`¡??? envía a ${nextPoke.name}!`);

        // Pokeball send-out animation
        setShowOpponentPoke(false);
        setOpponentPokeballAnim(true);
        await wait(800);
        setOpponentPokeballAnim(false);
        setShowOpponentPoke(true);
        setSendingOutOpponent(true);
        await wait(600);
        setSendingOutOpponent(false);

        // Auto mega evolve ???'s pokemon if it has mega data
        if (nextPoke.mega && !nextPoke.isMega) {
          await wait(400);
          addMsg(`¡??? usa la Mega Piedra! ¡${nextPoke.name} megaevoluciona a ${nextPoke.mega.megaName}!`);
          setCTeam(prev => {
            const next = [...prev];
            next[nextCI] = applyMega(next[nextCI]);
            return next;
          });
          await wait(1200);
        }
        setPhase('action-select');
        return;
      }

      // Cynthia's turn
      const cMoves = cynthiaMon.moves.filter(m => m.power > 0);
      const cMove = cMoves.length > 0
        ? cMoves[Math.floor(Math.random() * cMoves.length)]
        : cynthiaMon.moves[0];

      await wait(500);
      const result2 = doAttack(cynthiaMon, playerMon, cMove, false);
      playerMon.hp = result2.newDefHp;

      setPTeam(prev => {
        const next = [...prev];
        next[pIndex] = { ...next[pIndex], hp: result2.newDefHp };
        return next;
      });

      await wait(1500);

      if (result2.fainted) {
        addMsg(`¡${playerMon.name} se debilitó!`);
        await wait(1000);

        const nextPI = pTeam.findIndex((p, i) => i !== pIndex && p.hp > 0);
        if (nextPI === -1) {
          setPhase('defeat');
          addMsg('¡No te quedan Pokémon!');
          return;
        }
        setPhase('faint-switch');
        return;
      }
    } else {
      // Cynthia attacks first
      const cMoves = cynthiaMon.moves.filter(m => m.power > 0);
      const cMove = cMoves.length > 0
        ? cMoves[Math.floor(Math.random() * cMoves.length)]
        : cynthiaMon.moves[0];

      const result1 = doAttack(cynthiaMon, playerMon, cMove, false);
      playerMon.hp = result1.newDefHp;

      setPTeam(prev => {
        const next = [...prev];
        next[pIndex] = { ...next[pIndex], hp: result1.newDefHp };
        return next;
      });

      await wait(1500);

      if (result1.fainted) {
        addMsg(`¡${playerMon.name} se debilitó!`);
        await wait(1000);

        const nextPI = pTeam.findIndex((p, i) => i !== pIndex && p.hp > 0);
        if (nextPI === -1) {
          setPhase('defeat');
          addMsg('¡No te quedan Pokémon!');
          return;
        }
        setPhase('faint-switch');
        return;
      }

      // Player attacks
      await wait(500);
      const result2 = doAttack(playerMon, cynthiaMon, playerMove, true);
      cynthiaMon.hp = result2.newDefHp;

      setCTeam(prev => {
        const next = [...prev];
        next[cIndex] = { ...next[cIndex], hp: result2.newDefHp };
        return next;
      });

      await wait(1500);

      if (result2.fainted) {
        addMsg(`¡${cynthiaMon.name} se debilitó!`);
        await wait(1000);

        const nextCI = cTeam.findIndex((p, i) => i !== cIndex && p.hp > 0);
        if (nextCI === -1) {
          setPhase('victory');
          addMsg('¡Has derrotado a ???!');
          return;
        }

        setCIndex(nextCI);
        const nextPoke2 = cTeam[nextCI];
        addMsg(`¡??? envía a ${nextPoke2.name}!`);

        // Pokeball send-out animation
        setShowOpponentPoke(false);
        setOpponentPokeballAnim(true);
        await wait(800);
        setOpponentPokeballAnim(false);
        setShowOpponentPoke(true);
        setSendingOutOpponent(true);
        await wait(600);
        setSendingOutOpponent(false);

        // Auto mega evolve ???'s pokemon if it has mega data
        if (nextPoke2.mega && !nextPoke2.isMega) {
          await wait(400);
          addMsg(`¡??? usa la Mega Piedra! ¡${nextPoke2.name} megaevoluciona a ${nextPoke2.mega.megaName}!`);
          setCTeam(prev => {
            const next = [...prev];
            next[nextCI] = applyMega(next[nextCI]);
            return next;
          });
          await wait(1200);
        }
        setPhase('action-select');
        return;
      }
    }

    setPhase('action-select');
  }, [pTeam, cTeam, pIndex, cIndex, addMsg, pendingPlayerMega]);

  const handleMoveSelect = (move: Move) => {
    if (phase !== 'move-select') return;
    addMsg('');
    executeTurn(move);
  };

  const handleSwitchPokemon = (index: number) => {
    if (index === pIndex) return;
    if (pTeam[index].hp <= 0) return;

    addMsg(`¡Bien hecho, ${pMon.name}! ¡Adelante, ${pTeam[index].name}!`);
    setShowPlayerPoke(false);
    setPlayerPokeballAnim(true);
    setTimeout(() => {
      setPIndex(index);
      setPlayerPokeballAnim(false);
      setShowPlayerPoke(true);
      setSendingOutPlayer(true);
      setTimeout(() => {
        setSendingOutPlayer(false);
        setPhase('action-select');
      }, 600);
    }, 800);
  };

  const handleFaintSwitch = (index: number) => {
    if (pTeam[index].hp <= 0) return;
    addMsg(`¡Adelante, ${pTeam[index].name}!`);
    setPlayerPokeballAnim(true);
    setTimeout(() => {
      setPIndex(index);
      setPlayerPokeballAnim(false);
      setShowPlayerPoke(true);
      setSendingOutPlayer(true);
      setTimeout(() => {
        setSendingOutPlayer(false);
        setPhase('action-select');
      }, 600);
    }, 800);
  };

  // HP bar color
  const getHpColor = (hp: number, maxHp: number): string => {
    const pct = hp / maxHp;
    if (pct > 0.5) return '#48d048';
    if (pct > 0.2) return '#f8d030';
    return '#f03030';
  };

  // Pokéball indicators
  const renderPartyBalls = (team: Pokemon[]) => (
    <div className="cb-party-balls">
      {team.map((p, i) => (
        <div
          key={i}
          className={`cb-ball ${p.hp > 0 ? 'cb-ball-alive' : 'cb-ball-fainted'}`}
          title={`${p.name} - ${p.hp}/${p.maxHp}`}
        />
      ))}
    </div>
  );

  const numId = (p: Pokemon) => parseInt(p.id);

  return (
    <div className="cb-container">
      {/* DEBUG: auto-win button */}
      <button
        onClick={onVictory}
        style={{
          position: 'fixed', top: 4, right: 4, zIndex: 9999,
          padding: '4px 8px', fontSize: '9px', opacity: 0.5,
          background: '#f00', color: '#fff', border: 'none',
          borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace',
        }}
      >
        DEBUG WIN
      </button>
      {/* === TOP SCREEN: Battle Scene === */}
      <div className="cb-top-screen">
        {/* Opponent info box (top-left in Gen IV) */}
        <div className="cb-info-box cb-info-opponent">
          <div className="cb-info-name">{cMon.name}</div>
          <div className="cb-info-level">Lv{cMon.level}</div>
          <div className="cb-hp-bar-wrap">
            <span className="cb-hp-label">HP</span>
            <div className="cb-hp-bar">
              <div
                className="cb-hp-fill"
                style={{
                  width: `${(cMon.hp / cMon.maxHp) * 100}%`,
                  background: getHpColor(cMon.hp, cMon.maxHp),
                }}
              />
            </div>
          </div>
          {renderPartyBalls(cTeam)}
        </div>

        {/* Battle field */}
        <div className="cb-battlefield">
          {/* Champion trainer sprite (only during intro) */}
          {showTrainers && (
            <img
              src={CYNTHIA_TRAINER_SPRITE}
              alt="???"
              className="cb-trainer-sprite cb-trainer-opponent"
            />
          )}

          {/* Opponent pokeball throw animation */}
          {opponentPokeballAnim && (
            <div className="cb-pokeball-throw cb-pokeball-throw-opponent">
              <div className="cb-throw-ball" />
            </div>
          )}

          {/* Opponent pokemon (front sprite, right side) */}
          {showOpponentPoke && (
            <div className={`cb-poke-opponent ${opponentAnim} ${sendingOutOpponent ? 'cb-send-out' : ''}`}>
              <div className="cb-platform cb-platform-opponent" />
              <img
                src={getSpriteFront(getSpriteId(cMon))}
                alt={cMon.name}
                className="cb-sprite"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getSpriteFrontFallback(getSpriteId(cMon));
                }}
              />
            </div>
          )}

          {/* Player pokeball throw animation */}
          {playerPokeballAnim && (
            <div className="cb-pokeball-throw cb-pokeball-throw-player">
              <div className="cb-throw-ball" />
            </div>
          )}

          {/* Player pokemon (back sprite, left side) */}
          {showPlayerPoke && (
            <div className={`cb-poke-player ${playerAnim} ${sendingOutPlayer ? 'cb-send-out' : ''}`}>
              <div className="cb-platform cb-platform-player" />
              <img
                src={getSpriteBack(getSpriteId(pMon))}
                alt={pMon.name}
                className="cb-sprite cb-sprite-back"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getSpriteBackFallback(getSpriteId(pMon));
                }}
              />
            </div>
          )}

          {/* Dawn trainer sprite (only during intro) */}
          {showTrainers && (
            <img
              src={DAWN_TRAINER_SPRITE}
              alt="Dawn"
              className="cb-trainer-sprite cb-trainer-player"
            />
          )}
        </div>

        {/* Player info box (bottom-right in Gen IV) */}
        <div className="cb-info-box cb-info-player">
          <div className="cb-info-name">{pMon.name}</div>
          <div className="cb-info-level">Lv{pMon.level}</div>
          <div className="cb-hp-bar-wrap">
            <span className="cb-hp-label">HP</span>
            <div className="cb-hp-bar">
              <div
                className="cb-hp-fill"
                style={{
                  width: `${(pMon.hp / pMon.maxHp) * 100}%`,
                  background: getHpColor(pMon.hp, pMon.maxHp),
                }}
              />
            </div>
          </div>
          <div className="cb-hp-numbers">
            {pMon.hp} / {pMon.maxHp}
          </div>
          {renderPartyBalls(pTeam)}
        </div>

        {/* Message bar at bottom of top screen */}
        <div className="cb-top-message" ref={logRef}>
          {messages.slice(-2).map((msg, i) => (
            <div key={i} className="cb-top-msg-text">{msg}</div>
          ))}
        </div>
      </div>

      {/* DS Hinge */}
      <div className="cb-ds-hinge" />

      {/* === BOTTOM SCREEN === */}
      <div className="cb-bottom-screen">

        {/* Action select: LUCHAR / POKÉMON */}
        {phase === 'action-select' && (
          <div className="cb-actions">
            <div className="cb-action-prompt">¿Qué hará {pMon.name}?</div>
            <div className="cb-action-buttons">
              <button className="cb-action-btn cb-btn-fight" onClick={() => setPhase('move-select')}>
                LUCHAR
              </button>
              <button className="cb-action-btn cb-btn-party" onClick={() => setPhase('party-select')}>
                POKÉMON
              </button>
              {pMon.mega && !pMon.isMega && !playerMegaUsed && (
                <button
                  className={`cb-action-btn cb-btn-mega ${pendingPlayerMega ? 'cb-mega-active' : ''}`}
                  onClick={() => setPendingPlayerMega(prev => !prev)}
                >
                  {pendingPlayerMega ? '✦ MEGA ✦' : 'MEGA'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Move select */}
        {phase === 'move-select' && (
          <div className="cb-moves">
            <div className="cb-moves-grid">
              {pMon.moves.map((move, i) => (
                <button
                  key={i}
                  className={`cb-move-btn type-bg-${move.type}`}
                  onClick={() => handleMoveSelect(move)}
                >
                  <span className="cb-move-name">{move.name}</span>
                  <span className="cb-move-info">
                    <span className={`cb-move-type-tag type-${move.type}`}>{move.type.toUpperCase()}</span>
                    <span className="cb-move-pp">PP {move.pp}/{move.maxPp}</span>
                  </span>
                </button>
              ))}
            </div>
            <button className="cb-back-btn" onClick={() => setPhase('action-select')}>ATRÁS</button>
          </div>
        )}

        {/* Party select */}
        {phase === 'party-select' && (
          <div className="cb-party">
            <div className="cb-party-title">Elige un Pokémon</div>
            <div className="cb-party-list">
              {pTeam.map((p, i) => (
                <button
                  key={i}
                  className={`cb-party-member ${p.hp <= 0 ? 'cb-party-fainted' : ''} ${i === pIndex ? 'cb-party-active' : ''}`}
                  onClick={() => handleSwitchPokemon(i)}
                  disabled={p.hp <= 0 || i === pIndex}
                >
                  <img
                    src={getSpriteFront(numId(p))}
                    alt={p.name}
                    className="cb-party-sprite"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getSpriteFrontFallback(numId(p));
                    }}
                  />
                  <div className="cb-party-info">
                    <span className="cb-party-name">{p.name}</span>
                    <span className="cb-party-hp-text">Lv.{p.level}</span>
                    <div className="cb-party-hp-bar">
                      <div style={{ width: `${(p.hp / p.maxHp) * 100}%`, background: getHpColor(p.hp, p.maxHp) }} />
                    </div>
                    <span className="cb-party-hp-num">{p.hp}/{p.maxHp}</span>
                  </div>
                  {p.hp <= 0 && <span className="cb-party-ko">KO</span>}
                </button>
              ))}
            </div>
            <button className="cb-back-btn" onClick={() => setPhase('action-select')}>ATRÁS</button>
          </div>
        )}

        {/* Faint switch - forced */}
        {phase === 'faint-switch' && (
          <div className="cb-party">
            <div className="cb-party-title cb-faint-title">¡Elige tu siguiente Pokémon!</div>
            <div className="cb-party-list">
              {pTeam.map((p, i) => (
                <button
                  key={i}
                  className={`cb-party-member ${p.hp <= 0 ? 'cb-party-fainted' : ''}`}
                  onClick={() => handleFaintSwitch(i)}
                  disabled={p.hp <= 0}
                >
                  <img
                    src={getSpriteFront(numId(p))}
                    alt={p.name}
                    className="cb-party-sprite"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getSpriteFrontFallback(numId(p));
                    }}
                  />
                  <div className="cb-party-info">
                    <span className="cb-party-name">{p.name}</span>
                    <div className="cb-party-hp-bar">
                      <div style={{ width: `${(p.hp / p.maxHp) * 100}%`, background: getHpColor(p.hp, p.maxHp) }} />
                    </div>
                    <span className="cb-party-hp-num">{p.hp}/{p.maxHp}</span>
                  </div>
                  {p.hp <= 0 && <span className="cb-party-ko">KO</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pokéball idle - intro & executing */}
        {(phase === 'intro' || phase === 'executing') && (
          <div className="cb-pokeball-idle">
            <div className="cb-pokeball-big">
              <div className="cb-pokeball-top-half" />
              <div className="cb-pokeball-bottom-half" />
              <div className="cb-pokeball-band-line" />
              <div className="cb-pokeball-center-btn">
                <div className="cb-pokeball-inner-btn" />
              </div>
            </div>
          </div>
        )}

        {/* Victory */}
        {phase === 'victory' && (
          <div className="cb-result cb-result-victory">
            <div className="cb-result-title">¡VICTORIA!</div>
            <div className="cb-result-text">¡Has derrotado a ???!</div>
            <div className="cb-result-text">¡Eres el nuevo Campeón de Sinnoh!</div>
            <button className="cb-result-btn" onClick={onVictory}>CONTINUAR</button>
          </div>
        )}

        {/* Defeat */}
        {phase === 'defeat' && (
          <div className="cb-result cb-result-defeat">
            <div className="cb-result-title">DERROTA</div>
            <div className="cb-result-text">Te has quedado sin Pokémon...</div>
            <button className="cb-result-btn" onClick={onDefeat}>INTENTAR DE NUEVO</button>
          </div>
        )}
      </div>
    </div>
  );
};
