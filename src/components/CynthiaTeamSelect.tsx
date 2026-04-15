import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Pokemon, Move } from '../types/pokemon';
import { getAllPokemonNames, loadPokemonById, loadTMMoves, getSpriteFront, getSpriteFrontFallback } from '../services/pokeApi';
import './CynthiaTeamSelect.css';

interface CynthiaTeamSelectProps {
  starterEvoId?: number;
  onTeamSelected: (team: Pokemon[]) => void;
}

// Type color mapping for backgrounds
const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', grass: '#78C850',
  electric: '#F8D030', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC',
};

export const CynthiaTeamSelect: React.FC<CynthiaTeamSelectProps> = ({ onTeamSelected }) => {
  const [allNames, setAllNames] = useState<{ id: number; name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: number; name: string }[]>([]);
  const [loadedPokemon, setLoadedPokemon] = useState<Map<number, Pokemon>>(new Map());
  const [selectedTeam, setSelectedTeam] = useState<Pokemon[]>([]);
  const [loadingNames, setLoadingNames] = useState(true);
  const [loadingPokemon, setLoadingPokemon] = useState<Set<number>>(new Set());
  const [hoveredPokemon, setHoveredPokemon] = useState<Pokemon | null>(null);
  const [chosenMegaId, setChosenMegaId] = useState<string | null>(null);
  const [tmEditingId, setTmEditingId] = useState<string | null>(null);
  const [tmMoves, setTmMoves] = useState<Move[]>([]);
  const [loadingTMs, setLoadingTMs] = useState(false);
  const [tmSlotIndex, setTmSlotIndex] = useState<number | null>(null);
  const [tmSearchQuery, setTmSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load all pokemon names on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadingNames(true);
      const names = await getAllPokemonNames();
      if (!cancelled) {
        setAllNames(names);
        // Show first 40 by default
        setSearchResults(names.slice(0, 40));
        setLoadingNames(false);
        setTimeout(() => searchInputRef.current?.focus(), 300);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // Search handler with debounce
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const q = query.toLowerCase().trim();
      if (!q) {
        setSearchResults(allNames.slice(0, 40));
        return;
      }
      const filtered = allNames.filter(p =>
        p.name.toLowerCase().includes(q) || p.id.toString() === q
      );
      setSearchResults(filtered.slice(0, 50));
    }, 200);
  }, [allNames]);

  // Load a Pokemon's full data when clicked
  const handleSelectFromSearch = async (entry: { id: number; name: string }) => {
    // Check if already in team
    if (selectedTeam.find(p => p.id === `${entry.id}`)) return;
    if (selectedTeam.length >= 6) return;

    // Check if we already loaded this pokemon
    const existing = loadedPokemon.get(entry.id);
    if (existing) {
      setSelectedTeam(prev => {
        const newTeam = [...prev, existing];
        if (existing.mega && !chosenMegaId) {
          setChosenMegaId(existing.id);
        }
        return newTeam;
      });
      return;
    }

    // Load from API
    setLoadingPokemon(prev => new Set(prev).add(entry.id));
    const pokemon = await loadPokemonById(entry.id);
    setLoadingPokemon(prev => {
      const next = new Set(prev);
      next.delete(entry.id);
      return next;
    });

    if (pokemon) {
      setLoadedPokemon(prev => new Map(prev).set(entry.id, pokemon));
      setSelectedTeam(prev => {
        if (prev.length >= 6) return prev;
        const newTeam = [...prev, pokemon];
        // Auto-select first mega-capable as candidate
        if (pokemon.mega && !chosenMegaId) {
          setChosenMegaId(pokemon.id);
        }
        return newTeam;
      });
    }
  };

  const removePokemon = (pokemonId: string) => {
    if (tmEditingId === pokemonId) {
      setTmEditingId(null);
      setTmMoves([]);
      setTmSlotIndex(null);
      setTmSearchQuery('');
    }
    setSelectedTeam(prev => {
      const newTeam = prev.filter(p => p.id !== pokemonId);
      // If we removed the chosen mega, pick the next available
      if (chosenMegaId === pokemonId) {
        const nextMega = newTeam.find(p => p.mega);
        setChosenMegaId(nextMega ? nextMega.id : null);
      }
      return newTeam;
    });
  };

  // TM editing handlers
  const openTMEditor = async (pokemon: Pokemon) => {
    if (tmEditingId === pokemon.id) {
      // Toggle off
      setTmEditingId(null);
      setTmMoves([]);
      setTmSlotIndex(null);
      setTmSearchQuery('');
      return;
    }
    setTmEditingId(pokemon.id);
    setTmSlotIndex(null);
    setTmSearchQuery('');
    setLoadingTMs(true);
    const moves = await loadTMMoves(parseInt(pokemon.id));
    setTmMoves(moves);
    setLoadingTMs(false);
  };

  const handleTMSwap = (tmMove: Move) => {
    if (tmSlotIndex === null || !tmEditingId) return;
    setSelectedTeam(prev =>
      prev.map(p => {
        if (p.id !== tmEditingId) return p;
        const newMoves = [...p.moves];
        newMoves[tmSlotIndex] = tmMove;
        return { ...p, moves: newMoves };
      })
    );
    setTmSlotIndex(null);
  };

  const tmEditingPokemon = selectedTeam.find(p => p.id === tmEditingId) || null;
  const filteredTMMoves = tmSearchQuery
    ? tmMoves.filter(m => m.name.toLowerCase().includes(tmSearchQuery.toLowerCase()) || m.type.toLowerCase().includes(tmSearchQuery.toLowerCase()))
    : tmMoves;

  const megaCapable = selectedTeam.filter(p => p.mega);
  const needsMegaChoice = megaCapable.length >= 2 && !chosenMegaId;

  const handleConfirm = () => {
    if (selectedTeam.length < 1) return;
    // Strip mega from non-chosen Pokémon so only 1 can mega in battle
    const finalTeam = selectedTeam.map(p => {
      if (p.mega && p.id !== chosenMegaId) {
        const { mega, ...rest } = p;
        void mega;
        return rest as Pokemon;
      }
      return p;
    });
    onTeamSelected(finalTeam);
  };

  if (loadingNames) {
    return (
      <div className="cts-container">
        <div className="cts-loading">
          <div className="cts-pokeball-loader">
            <div className="cts-pokeball-top"></div>
            <div className="cts-pokeball-center"></div>
            <div className="cts-pokeball-bottom"></div>
          </div>
          <div className="cts-loading-text">Cargando Pokédex completa...</div>
          <div className="cts-progress-bar">
            <div className="cts-progress-fill" style={{ width: '60%' }}></div>
          </div>
          <div className="cts-loading-sub">Conectando con el PC de almacenamiento...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cts-container">
      {/* Header */}
      <div className="cts-header">
        <div className="cts-header-left">
          <div className="cts-title">SISTEMA DE ALMACENAMIENTO POKÉMON</div>
          <div className="cts-subtitle">Selecciona 6 Pokémon de cualquier generación</div>
        </div>
        <div className="cts-header-right">
          <div className="cts-team-count">
            <span className="cts-count-num">{selectedTeam.length}</span>
            <span className="cts-count-sep">/</span>
            <span className="cts-count-max">6</span>
          </div>
        </div>
      </div>

      <div className="cts-main">
        {/* Pokemon search & grid */}
        <div className="cts-grid-area">
          {/* Search bar */}
          <div className="cts-search-bar">
            <span className="cts-search-icon">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              className="cts-search-input"
              placeholder="Buscar Pokémon por nombre o número..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoComplete="off"
            />
            {searchQuery && (
              <button className="cts-search-clear" onClick={() => { setSearchQuery(''); handleSearch(''); }}>✕</button>
            )}
          </div>

          <div className="cts-pokemon-grid">
            {searchResults.map(entry => {
              const isSelected = selectedTeam.find(p => p.id === `${entry.id}`);
              const isLoading = loadingPokemon.has(entry.id);
              const loaded = loadedPokemon.get(entry.id);
              const typeColor = loaded ? (TYPE_COLORS[loaded.type] || '#A8A878') : '#A8A878';
              return (
                <div
                  key={entry.id}
                  className={`cts-pokemon-card ${isSelected ? 'cts-selected' : ''} ${isLoading ? 'cts-loading-card' : ''}`}
                  onClick={() => !isLoading && handleSelectFromSearch(entry)}
                  onMouseEnter={() => loaded && setHoveredPokemon(loaded)}
                  onMouseLeave={() => setHoveredPokemon(null)}
                  style={{ '--type-color': typeColor } as React.CSSProperties}
                >
                  <div className="cts-card-sprite">
                    <img
                      src={getSpriteFront(entry.id)}
                      alt={entry.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getSpriteFrontFallback(entry.id);
                      }}
                    />
                    {isLoading && <div className="cts-card-loading-overlay">...</div>}
                  </div>
                  <div className="cts-card-info">
                    <div className="cts-card-name">{entry.name}</div>
                    <div className="cts-card-meta">
                      <span className="cts-card-id">#{entry.id}</span>
                      {loaded?.mega && <span className="cts-mega-badge">MEGA</span>}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="cts-selected-marker">
                      <span>{selectedTeam.findIndex(p => p.id === `${entry.id}`) + 1}</span>
                    </div>
                  )}
                </div>
              );
            })}
            {searchResults.length === 0 && searchQuery && (
              <div className="cts-no-results">No se encontraron Pokémon</div>
            )}
          </div>
        </div>

        {/* Right panel - Details + Team */}
        <div className="cts-side-panel">
          {/* Pokemon detail / TM Editor */}
          <div className="cts-detail-box">
            {tmEditingPokemon ? (
              <div className="cts-tm-editor">
                <div className="cts-tm-header">
                  <img
                    src={getSpriteFront(parseInt(tmEditingPokemon.id))}
                    alt={tmEditingPokemon.name}
                    className="cts-detail-sprite"
                  />
                  <div>
                    <div className="cts-detail-name">{tmEditingPokemon.name}</div>
                    <div className="cts-tm-label">SELECCIÓN DE MT</div>
                  </div>
                  <button className="cts-tm-close" onClick={() => { setTmEditingId(null); setTmMoves([]); setTmSlotIndex(null); setTmSearchQuery(''); }}>✕</button>
                </div>
                <div className="cts-tm-current">
                  <div className="cts-tm-section-title">MOVIMIENTOS ACTUALES</div>
                  <div className="cts-tm-slots">
                    {tmEditingPokemon.moves.map((move, i) => (
                      <div
                        key={i}
                        className={`cts-tm-slot ${tmSlotIndex === i ? 'cts-tm-slot-selected' : ''}`}
                        onClick={() => setTmSlotIndex(tmSlotIndex === i ? null : i)}
                      >
                        <span className={`cts-move-type type-${move.type}`}>{move.type.slice(0, 3).toUpperCase()}</span>
                        <span className="cts-tm-slot-name">{move.name}</span>
                        <span className="cts-tm-slot-pow">{move.power > 0 ? move.power : '—'}</span>
                      </div>
                    ))}
                  </div>
                  {tmSlotIndex !== null && (
                    <div className="cts-tm-hint">Selecciona una MT para reemplazar <strong>{tmEditingPokemon.moves[tmSlotIndex].name}</strong></div>
                  )}
                  {tmSlotIndex === null && (
                    <div className="cts-tm-hint">Pulsa un movimiento para reemplazarlo</div>
                  )}
                </div>
                <div className="cts-tm-available">
                  <div className="cts-tm-section-title">MTs DISPONIBLES</div>
                  <div className="cts-tm-search">
                    <input
                      type="text"
                      placeholder="Buscar MT..."
                      value={tmSearchQuery}
                      onChange={(e) => setTmSearchQuery(e.target.value)}
                      className="cts-tm-search-input"
                    />
                  </div>
                  {loadingTMs ? (
                    <div className="cts-tm-loading">Cargando MTs...</div>
                  ) : (
                    <div className="cts-tm-list">
                      {filteredTMMoves.map((move) => {
                        const isCurrentMove = tmEditingPokemon.moves.some(m => m.id === move.id);
                        return (
                          <div
                            key={move.id}
                            className={`cts-tm-item ${isCurrentMove ? 'cts-tm-item-current' : ''} ${tmSlotIndex === null ? 'cts-tm-item-disabled' : ''}`}
                            onClick={() => !isCurrentMove && tmSlotIndex !== null && handleTMSwap(move)}
                          >
                            <span className={`cts-move-type type-${move.type}`}>{move.type.slice(0, 3).toUpperCase()}</span>
                            <span className="cts-tm-item-name">{move.name}</span>
                            <span className="cts-tm-item-class">{move.damageClass === 'physical' ? '⚔' : move.damageClass === 'special' ? '✦' : '◈'}</span>
                            <span className="cts-tm-item-pow">{move.power > 0 ? move.power : '—'}</span>
                          </div>
                        );
                      })}
                      {filteredTMMoves.length === 0 && !loadingTMs && (
                        <div className="cts-tm-empty">No se encontraron MTs</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : hoveredPokemon ? (
              <>
                <div className="cts-detail-header">
                  <img
                    src={getSpriteFront(parseInt(hoveredPokemon.id))}
                    alt={hoveredPokemon.name}
                    className="cts-detail-sprite"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = hoveredPokemon.avatar;
                    }}
                  />
                  <div>
                    <div className="cts-detail-name">{hoveredPokemon.name}</div>
                    <div className="cts-detail-level">Lv. {hoveredPokemon.level}</div>
                    <span className={`cts-type-badge type-${hoveredPokemon.type}`}>
                      {hoveredPokemon.type.toUpperCase()}
                    </span>
                    {hoveredPokemon.mega && (
                      <div className="cts-detail-mega-tag">🔮 Puede Mega Evolucionar</div>
                    )}
                  </div>
                </div>
                <div className="cts-detail-stats">
                  <div className="cts-stat-row">
                    <span>HP</span>
                    <div className="cts-stat-bar"><div style={{ width: `${Math.min(100, hoveredPokemon.maxHp / 3)}%` }}></div></div>
                    <span className="cts-stat-val">{hoveredPokemon.maxHp}</span>
                  </div>
                  <div className="cts-stat-row">
                    <span>ATK</span>
                    <div className="cts-stat-bar"><div style={{ width: `${Math.min(100, hoveredPokemon.attack / 2.5)}%` }}></div></div>
                    <span className="cts-stat-val">{hoveredPokemon.attack}</span>
                  </div>
                  <div className="cts-stat-row">
                    <span>DEF</span>
                    <div className="cts-stat-bar"><div style={{ width: `${Math.min(100, hoveredPokemon.defense / 2.5)}%` }}></div></div>
                    <span className="cts-stat-val">{hoveredPokemon.defense}</span>
                  </div>
                  <div className="cts-stat-row">
                    <span>SpA</span>
                    <div className="cts-stat-bar"><div style={{ width: `${Math.min(100, hoveredPokemon.spAtk / 2.5)}%` }}></div></div>
                    <span className="cts-stat-val">{hoveredPokemon.spAtk}</span>
                  </div>
                  <div className="cts-stat-row">
                    <span>SpD</span>
                    <div className="cts-stat-bar"><div style={{ width: `${Math.min(100, hoveredPokemon.spDef / 2.5)}%` }}></div></div>
                    <span className="cts-stat-val">{hoveredPokemon.spDef}</span>
                  </div>
                  <div className="cts-stat-row">
                    <span>SPD</span>
                    <div className="cts-stat-bar"><div style={{ width: `${Math.min(100, hoveredPokemon.speed / 2.5)}%` }}></div></div>
                    <span className="cts-stat-val">{hoveredPokemon.speed}</span>
                  </div>
                </div>
                <div className="cts-detail-moves">
                  <div className="cts-moves-title">MOVIMIENTOS</div>
                  {hoveredPokemon.moves.map((move, i) => (
                    <div key={i} className="cts-move-item">
                      <span className={`cts-move-type type-${move.type}`}>{move.type.slice(0, 3).toUpperCase()}</span>
                      <span className="cts-move-name">{move.name}</span>
                      <span className="cts-move-power">{move.power > 0 ? move.power : '—'}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="cts-detail-empty">
                <div className="cts-detail-empty-icon">?</div>
                <div>Pasa el cursor sobre un Pokémon para ver sus datos</div>
              </div>
            )}
          </div>

          {/* Selected team */}
          <div className="cts-team-panel">
            <div className="cts-team-title">TU EQUIPO</div>
            <div className="cts-team-slots">
              {Array.from({ length: 6 }).map((_, i) => {
                const member = selectedTeam[i];
                return (
                  <div
                    key={i}
                    className={`cts-team-slot ${member ? 'cts-slot-filled' : 'cts-slot-empty'} ${member && tmEditingId === member.id ? 'cts-slot-tm-active' : ''}`}
                  >
                    {member ? (
                      <>
                        <img
                          src={getSpriteFront(parseInt(member.id))}
                          alt={member.name}
                          className="cts-slot-sprite"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = member.avatar;
                          }}
                        />
                        <div className="cts-slot-info">
                          <span className="cts-slot-name">{member.name}</span>
                          <span className="cts-slot-level">Lv.{member.level}</span>
                        </div>
                        <div className="cts-slot-buttons">
                          <button
                            className={`cts-slot-tm-btn ${tmEditingId === member.id ? 'cts-tm-btn-active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); openTMEditor(member); }}
                            title="Editar MTs"
                          >
                            MT
                          </button>
                          {member.mega && (
                            <button
                              className={`cts-slot-mega-btn ${chosenMegaId === member.id ? 'cts-mega-chosen' : ''}`}
                              onClick={(e) => { e.stopPropagation(); setChosenMegaId(member.id); }}
                              title={chosenMegaId === member.id ? 'Mega seleccionada' : 'Elegir como Mega'}
                            >
                              {chosenMegaId === member.id ? '✦M' : 'M'}
                            </button>
                          )}
                          <button
                            className="cts-slot-remove-btn"
                            onClick={(e) => { e.stopPropagation(); removePokemon(member.id); }}
                            title="Quitar del equipo"
                          >
                            ✕
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="cts-slot-placeholder">—</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mega choice warning */}
          {megaCapable.length >= 2 && (
            <div className="cts-mega-warning">
              ⚠ Tienes {megaCapable.length} Pokémon con Mega. Elige cuál megaevolucionará (pulsa la M).
            </div>
          )}

          {/* Confirm button */}
          <button
            className={`cts-confirm-btn ${selectedTeam.length >= 1 && !needsMegaChoice ? 'cts-confirm-ready' : ''}`}
            onClick={handleConfirm}
            disabled={selectedTeam.length < 1 || needsMegaChoice}
          >
            {needsMegaChoice
              ? 'ELIGE TU MEGA EVOLUCIÓN'
              : selectedTeam.length >= 1
                ? `¡DESAFIAR A ???! (${selectedTeam.length} Pokémon)`
                : 'SELECCIONA AL MENOS 1 POKÉMON'}
          </button>
        </div>
      </div>
    </div>
  );
};
