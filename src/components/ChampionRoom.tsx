import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Direction } from '../utils/trainerSprites';

const CHAMPION_OVERWORLD_SPRITE = '/sprites/champion-down-stand.png';
import './ChampionRoom.css';

interface ChampionRoomProps {
  onStartTeamSelect: () => void;
  postVictory?: boolean;
  onEnterHallOfFame?: () => void;
}

// Real D/P Dawn overworld sprites (extracted from sprite sheet)
// Note: sprite files were extracted with swapped labels from the sheet
const DAWN_SPRITES: Record<string, string> = {
  down: '/sprites/dawn-down-stand.png',
  up: '/sprites/dawn-left-stand.png',
  left: '/sprites/dawn-right-stand.png',
  right: '/sprites/dawn-up-stand.png',
  downWalk: '/sprites/dawn-down-walk1.png',
  upWalk: '/sprites/dawn-left-walk1.png',
  leftWalk: '/sprites/dawn-right-walk1.png',
  rightWalk: '/sprites/dawn-up-walk1.png',
};

// Champion room layout: 15 columns x 13 rows (D/P faithful)
// 0=floor 1=wall 2=machine 3=ring 4=arena 5=NPC 6=entrance 7=entrance-top 8=wall-top
// 9=north-door (walkable in post-victory)
const ROOM_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1],
  [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
  [1, 2, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 2, 1],
  [1, 0, 0, 0, 3, 4, 4, 4, 4, 4, 3, 0, 0, 0, 1],
  [1, 0, 0, 3, 4, 4, 4, 5, 4, 4, 4, 3, 0, 0, 1],
  [1, 0, 0, 3, 4, 4, 4, 4, 4, 4, 4, 3, 0, 0, 1],
  [1, 0, 0, 0, 3, 4, 4, 4, 4, 4, 3, 0, 0, 0, 1],
  [1, 2, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 2, 1],
  [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1],
];

// Map with north door open (row 1, tiles 5-9 become walkable door tiles)
const ROOM_MAP_POST_VICTORY = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 8, 8, 8, 8, 9, 9, 9, 9, 9, 8, 8, 8, 8, 1],
  [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
  [1, 2, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 2, 1],
  [1, 0, 0, 0, 3, 4, 4, 4, 4, 4, 3, 0, 0, 0, 1],
  [1, 0, 0, 3, 4, 4, 4, 5, 4, 4, 4, 3, 0, 0, 1],
  [1, 0, 0, 3, 4, 4, 4, 4, 4, 4, 4, 3, 0, 0, 1],
  [1, 0, 0, 0, 3, 4, 4, 4, 4, 4, 3, 0, 0, 0, 1],
  [1, 2, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 2, 1],
  [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const COLS = 15;
const ROWS = 13;
const NPC_POS = { x: 7, y: 5 };
const MOVE_DURATION = 150; // ms per tile step

const DIALOG_LINES = [
  '¡Bienvenido a este portfolio maravilloso inspirado en Pokémon!',
  'Soy la creadora de este mini juego.',
  'Para contactar conmigo antes tendrás que vencerme a mí y a mis Pokémon en una ardua batalla.',
  '¿Aceptas el desafío?',
];

const POST_VICTORY_DIALOG_LINES = [
  '¡Enhorabuena por ganar el combate!',
  'Se ve que eres un excelente entrenador Pokémon. ¡Ha sido muy divertido!',
  'Te has ganado la Medalla del Campeón. 🏅',
  'Las puertas del Salón de la Fama se han abierto para ti al norte de la sala. ¡Adelante!',
];

export const ChampionRoom: React.FC<ChampionRoomProps> = ({ onStartTeamSelect, postVictory = false, onEnterHallOfFame }) => {
  const [playerPos, setPlayerPos] = useState({ x: 7, y: 10 });
  const [playerDir, setPlayerDir] = useState<Direction>('up');
  const [showDialog, setShowDialog] = useState(postVictory);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [dialogText, setDialogText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [walking, setWalking] = useState(false);
  const [northDoorOpen, setNorthDoorOpen] = useState(false);

  const activeDialogLines = postVictory ? POST_VICTORY_DIALOG_LINES : DIALOG_LINES;
  const activeMap = (postVictory && northDoorOpen) ? ROOM_MAP_POST_VICTORY : ROOM_MAP;

  // Refs for smooth movement system
  const playerPosRef = useRef({ x: 7, y: 10 });
  const isMovingRef = useRef(false);
  const heldDirRef = useRef<Direction | null>(null);
  const showDialogRef = useRef(postVictory);
  const onEnterHofRef = useRef(onEnterHallOfFame);
  const activeMapRef = useRef(activeMap);

  useEffect(() => { activeMapRef.current = activeMap; }, [activeMap]);

  // Type text character by character
  useEffect(() => {
    if (!showDialog) return;
    const fullText = activeDialogLines[dialogIndex];
    if (!fullText) return;

    setIsTyping(true);
    setDialogText('');
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDialogText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [showDialog, dialogIndex]);

  const canWalk = (x: number, y: number): boolean => {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false;
    const tile = activeMapRef.current[y][x];
    return tile === 0 || tile === 4 || tile === 6 || tile === 9;
  };

  const isNextToNPC = (px: number, py: number): boolean => {
    return Math.abs(px - NPC_POS.x) + Math.abs(py - NPC_POS.y) === 1;
  };

  const handleAdvanceDialog = useCallback(() => {
    if (isTyping) {
      setDialogText(activeDialogLines[dialogIndex]);
      setIsTyping(false);
      return;
    }
    if (dialogIndex < activeDialogLines.length - 1) {
      setDialogIndex(prev => prev + 1);
    } else if (postVictory) {
      // Last line of post-victory dialog → close dialog, open north door
      setShowDialog(false);
      showDialogRef.current = false;
      setNorthDoorOpen(true);
    }
    // Normal last line: do nothing — yes/no buttons handle it
  }, [isTyping, dialogIndex, activeDialogLines, postVictory]);

  // Process one movement step
  const processMove = useCallback(() => {
    if (isMovingRef.current || showDialogRef.current) return;
    const dir = heldDirRef.current;
    if (!dir) return;

    const pos = playerPosRef.current;
    let newX = pos.x, newY = pos.y;
    switch (dir) {
      case 'up': newY--; break;
      case 'down': newY++; break;
      case 'left': newX--; break;
      case 'right': newX++; break;
    }

    setPlayerDir(dir);

    if (canWalk(newX, newY)) {
      const newPos = { x: newX, y: newY };
      playerPosRef.current = newPos;
      isMovingRef.current = true;
      setPlayerPos(newPos);
      setWalking(true);

      // Check if stepped on north door → enter Hall of Fame
      if (activeMapRef.current[newY]?.[newX] === 9 && onEnterHofRef.current) {
        setTimeout(() => {
          onEnterHofRef.current?.();
        }, MOVE_DURATION);
        return;
      }

      setTimeout(() => {
        isMovingRef.current = false;
        setWalking(false);
        // Continue walking if key still held
        if (heldDirRef.current && !showDialogRef.current) {
          processMove();
        }
      }, MOVE_DURATION);
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (showDialogRef.current) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'z') {
        e.preventDefault();
        handleAdvanceDialog();
      }
      return;
    }

    let dir: Direction | null = null;
    switch (e.key.toLowerCase()) {
      case 'arrowup': case 'w': dir = 'up'; break;
      case 'arrowdown': case 's': dir = 'down'; break;
      case 'arrowleft': case 'a': dir = 'left'; break;
      case 'arrowright': case 'd': dir = 'right'; break;
      case 'enter': case 'z':
        if (isNextToNPC(playerPosRef.current.x, playerPosRef.current.y)) {
          heldDirRef.current = null;
          setShowDialog(true);
          showDialogRef.current = true;
          setDialogIndex(0);
        }
        return;
      default: return;
    }

    e.preventDefault();
    heldDirRef.current = dir;
    if (!isMovingRef.current) {
      processMove();
    }
  }, [handleAdvanceDialog, processMove]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    let dir: Direction | null = null;
    switch (e.key.toLowerCase()) {
      case 'arrowup': case 'w': dir = 'up'; break;
      case 'arrowdown': case 's': dir = 'down'; break;
      case 'arrowleft': case 'a': dir = 'left'; break;
      case 'arrowright': case 'd': dir = 'right'; break;
    }
    if (dir && heldDirRef.current === dir) {
      heldDirRef.current = null;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const getTileClass = (tile: number): string => {
    switch (tile) {
      case 0: return 'cr-floor';
      case 1: return 'cr-wall';
      case 2: return 'cr-machine';
      case 3: return 'cr-ring';
      case 4: return 'cr-arena';
      case 5: return 'cr-arena cr-npc-tile';
      case 6: return 'cr-entrance';
      case 7: return 'cr-entrance-top';
      case 8: return 'cr-wall-top';
      case 9: return 'cr-north-door';
      default: return 'cr-floor';
    }
  };

  const getPlayerSpriteUrl = (): string => {
    if (walking) {
      return DAWN_SPRITES[`${playerDir}Walk`];
    }
    return DAWN_SPRITES[playerDir];
  };

  return (
    <div className="champion-room-wrapper">
      <div className="cr-top-bar">
        <span className="cr-location-name">{postVictory ? 'LIGA POKÉMON — ¡VICTORIA!' : 'LIGA POKÉMON — SALA DEL CAMPEÓN'}</span>
      </div>

      <div className="cr-room-container">
        <div className="cr-room-grid">
          {activeMap.map((row, y) =>
            row.map((tile, x) => (
              <div
                key={`${x}-${y}`}
                className={`cr-tile ${getTileClass(tile)} ${
                  playerPos.x === x && playerPos.y === y ? 'cr-player-tile' : ''
                }`}
              >
                {/* NPC */}
                {tile === 5 && (
                  <div className={`cr-npc ${isNextToNPC(playerPos.x, playerPos.y) ? 'cr-npc-glow' : ''}`}>
                    <div className="cr-npc-sprite">
                      <img
                        src={CHAMPION_OVERWORLD_SPRITE}
                        alt="???"
                        className="cr-npc-img"
                      />
                    </div>
                    {isNextToNPC(playerPos.x, playerPos.y) && !showDialog && (
                      <div className="cr-interact-hint">
                        <span>ENTER</span>
                      </div>
                    )}
                  </div>
                )}


              </div>
            ))
          )}

          {/* Player overlay — absolute positioned for smooth movement */}
          <div
            className={`cr-player ${walking ? 'cr-walking' : ''}`}
            style={{
              left: `${playerPos.x * (100 / COLS)}%`,
              top: `${playerPos.y * (100 / ROWS)}%`,
              width: `${100 / COLS}%`,
              height: `${100 / ROWS}%`,
            }}
          >
            <img
              src={getPlayerSpriteUrl()}
              alt="Dawn"
              className="cr-player-sprite-img"
            />
            <div className="cr-player-shadow"></div>
          </div>
        </div>
      </div>

      {/* Dialog Box */}
      {showDialog && (
        <div className="cr-dialog-overlay">
          <div className="cr-dialog-box" onClick={handleAdvanceDialog}>
            <div className="cr-dialog-speaker">???</div>
            <div className="cr-dialog-text">
              {dialogText}
              {isTyping && <span className="cr-dialog-cursor">▌</span>}
            </div>
            {!isTyping && dialogIndex < activeDialogLines.length - 1 && (
              <div className="cr-dialog-advance">
                ▼ Pulsa ENTER
              </div>
            )}
            {!isTyping && dialogIndex === activeDialogLines.length - 1 && !postVictory && (
              <div className="cr-dialog-choices">
                <button className="cr-choice-btn cr-choice-yes" onClick={(e) => { e.stopPropagation(); onStartTeamSelect(); }}>SÍ</button>
                <button className="cr-choice-btn cr-choice-no" onClick={(e) => { e.stopPropagation(); setShowDialog(false); showDialogRef.current = false; setDialogIndex(0); }}>NO</button>
              </div>
            )}
            {!isTyping && dialogIndex === activeDialogLines.length - 1 && postVictory && (
              <div className="cr-dialog-advance" onClick={handleAdvanceDialog}>
                ▼ Pulsa ENTER
              </div>
            )}
          </div>
        </div>
      )}

      {/* Controls info */}
      <div className="cr-controls-bar">
        <span>↑↓←→ MOVER</span>
        <span>ENTER INTERACTUAR</span>
      </div>
    </div>
  );
};
