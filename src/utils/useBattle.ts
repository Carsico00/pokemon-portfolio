import { useState, useCallback } from 'react';
import type { BattleState, Move } from '../types/pokemon';
import {
  calculateDamage,
  attemptHit,
  selectRandomMove,
  getTypeEffectiveness,
  getEffectivenessText,
} from '../utils/battleCalculator';

export const useBattle = (initialBattleState: BattleState) => {
  const [battleState, setBattleState] = useState<BattleState>(initialBattleState);

  const executeTurn = useCallback(
    (playerMove: Move) => {
      setBattleState((prev) => {
        if (prev.isOver) return prev;

        const newState = { ...prev };
        newState.battleLog = [...prev.battleLog];

        // Turno del jugador
        const playerAccuracy = attemptHit(playerMove.accuracy);
        if (!playerAccuracy) {
          newState.battleLog.push(
            `${prev.playerPokemon.name} falló el ataque!`
          );
        } else {
          const damage = calculateDamage(
            prev.playerPokemon,
            prev.opponentPokemon,
            playerMove
          );
          const effectiveness = getTypeEffectiveness(
            playerMove.type,
            prev.opponentPokemon.type
          );

          newState.opponentHp = Math.max(0, prev.opponentHp - damage);
          newState.battleLog.push(
            `${prev.playerPokemon.name} usó ${playerMove.name}!`
          );

          const effectText = getEffectivenessText(effectiveness);
          if (effectText) {
            newState.battleLog.push(effectText);
          }

          newState.battleLog.push(
            `${prev.opponentPokemon.name} perdió ${damage} HP!`
          );
        }

        // Verificar si el oponente fue derrotado
        if (newState.opponentHp <= 0) {
          newState.isOver = true;
          newState.winner = 'player';
          newState.battleLog.push(
            `¡${prev.opponentPokemon.name} fue derrotado!`
          );
          newState.battleLog.push(
            `¡${prev.playerPokemon.name} ganó ${prev.opponentPokemon.level * 10} puntos de experiencia!`
          );
          return newState;
        }

        // Turno del oponente
        newState.battleLog.push('---');
        const opponentMove = selectRandomMove(prev.opponentPokemon);
        const opponentAccuracy = attemptHit(opponentMove.accuracy);

        if (!opponentAccuracy) {
          newState.battleLog.push(
            `${prev.opponentPokemon.name} falló el ataque!`
          );
        } else {
          const damage = calculateDamage(
            prev.opponentPokemon,
            prev.playerPokemon,
            opponentMove
          );
          const effectiveness = getTypeEffectiveness(
            opponentMove.type,
            prev.playerPokemon.type
          );

          newState.playerHp = Math.max(0, prev.playerHp - damage);
          newState.battleLog.push(
            `${prev.opponentPokemon.name} usó ${opponentMove.name}!`
          );

          const effectText = getEffectivenessText(effectiveness);
          if (effectText) {
            newState.battleLog.push(effectText);
          }

          newState.battleLog.push(
            `${prev.playerPokemon.name} perdió ${damage} HP!`
          );
        }

        // Verificar si el jugador fue derrotado
        if (newState.playerHp <= 0) {
          newState.isOver = true;
          newState.winner = 'opponent';
          newState.battleLog.push(
            `¡${prev.playerPokemon.name} fue derrotado!`
          );
          return newState;
        }

        newState.currentTurn = prev.currentTurn === 'player' ? 'opponent' : 'player';
        return newState;
      });
    },
    []
  );

  return { battleState, executeTurn };
};
