import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RefreshCw, Star, Sparkles } from 'lucide-react';
import { CharacterSvg } from '../HorrorCharacters';
import { sound } from '../../utils/audio';

interface Props {
  onComplete: (starsEarned: number, scoreEarned: number) => void;
  onNextMission: () => void;
}

// 7x7 Kid-Friendly Maze
// 0 = Path, 1 = Stone Wall, 2 = Dead-end Trap with spider web
const MAZE_GRID: number[][] = [
  [0, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 2, 1],
  [1, 1, 1, 0, 1, 0, 1],
  [1, 2, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0], // (5, 6) is castle!
  [1, 1, 1, 1, 1, 1, 0], // finish
];

const START_POS = { r: 0, c: 0 };
const GOAL_POS = { r: 6, c: 6 };

export const Mission2Maze: React.FC<Props> = ({ onComplete, onNextMission }) => {
  const [pos, setPos] = useState(START_POS);
  const [visited, setVisited] = useState<string[]>(['0,0']);
  const [feedback, setFeedback] = useState<string>('Ayo gerakkan Dracula menuju Kastil!');
  const [isDeadEnd, setIsDeadEnd] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Move in direction
  const move = useCallback((dr: number, dc: number) => {
    if (isCompleted) return;

    setPos((current) => {
      const nr = current.r + dr;
      const nc = current.c + dc;

      // Bounds check
      if (nr < 0 || nr >= MAZE_GRID.length || nc < 0 || nc >= MAZE_GRID[0].length) {
        sound.playDeadEnd();
        setIsDeadEnd(true);
        setFeedback('UPS! JALAN BUNTU!');
        setTimeout(() => setIsDeadEnd(false), 500);
        return current;
      }

      // Wall check
      if (MAZE_GRID[nr][nc] === 1) {
        sound.playDeadEnd();
        setIsDeadEnd(true);
        setFeedback('UPS! JALAN BUNTU! Ada tembok batu!');
        setTimeout(() => setIsDeadEnd(false), 500);
        return current;
      }

      // Trap check
      if (MAZE_GRID[nr][nc] === 2) {
        sound.playDeadEnd();
        setIsDeadEnd(true);
        setFeedback('UPS! JALAN BUNTU! Ada jaring laba-laba! 🕸️');
        setTimeout(() => setIsDeadEnd(false), 600);
        return current;
      }

      // Valid move!
      sound.playStep();
      const newKey = `${nr},${nc}`;
      setVisited((prev) => (prev.includes(newKey) ? prev : [...prev, newKey]));
      setFeedback('Langkah tepat! Terus maju!');

      // Check win
      if (nr === GOAL_POS.r && nc === GOAL_POS.c) {
        setTimeout(() => {
          setIsCompleted(true);
          sound.playMissionComplete();
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#dc2626', '#eab308', '#9333ea'],
          });
          onComplete(3, 50);
        }, 300);
      }

      return { r: nr, c: nc };
    });
  }, [isCompleted, onComplete]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        move(-1, 0);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        move(1, 0);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        move(0, -1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        move(0, 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const handleReset = () => {
    sound.playClick();
    setPos(START_POS);
    setVisited(['0,0']);
    setIsCompleted(false);
    setIsDeadEnd(false);
    setFeedback('Ayo gerakkan Dracula menuju Kastil!');
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-3 py-4 md:py-6 flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-950/80 border border-red-500 text-red-300 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MISI 2 DARI 5</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black font-horror text-yellow-300 tracking-wider">
          2. MISI DRACULA
        </h2>
        <p className="text-xs sm:text-sm text-stone-200 font-medium font-kids">
          "Bantu Dracula menemukan kastilnya!"
        </p>
      </div>

      {/* Dynamic Feedback pill */}
      <div className="mb-4">
        <motion.div
          animate={isDeadEnd ? { x: [-8, 8, -6, 6, 0] } : {}}
          className={`px-4 py-1.5 rounded-2xl text-xs sm:text-sm font-bold border-2 transition-all shadow-md ${
            isDeadEnd
              ? 'bg-rose-950 border-rose-500 text-rose-300'
              : 'bg-stone-900 border-amber-600/70 text-yellow-300'
          }`}
        >
          {feedback}
        </motion.div>
      </div>

      {/* Main Maze Canvas / Board */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 w-full">
        {/* The 7x7 Grid */}
        <div
          className={`panel-stone p-2 sm:p-3 rounded-3xl border-4 border-amber-800 shadow-2xl relative select-none ${
            isDeadEnd ? 'animate-shake-wrong' : ''
          }`}
        >
          <div className="grid grid-cols-7 gap-1 sm:gap-2 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px]">
            {MAZE_GRID.map((row, r) =>
              row.map((cell, c) => {
                const isCurrent = pos.r === r && pos.c === c;
                const isStart = r === START_POS.r && c === START_POS.c;
                const isFinish = r === GOAL_POS.r && c === GOAL_POS.c;
                const isVisited = visited.includes(`${r},${c}`);
                const isWall = cell === 1;
                const isTrap = cell === 2;

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => {
                      // Support direct tap on adjacent valid cell
                      const dr = r - pos.r;
                      const dc = c - pos.c;
                      if (Math.abs(dr) + Math.abs(dc) === 1) {
                        move(dr, dc);
                      }
                    }}
                    className={`relative rounded-xl flex items-center justify-center transition-all ${
                      isWall
                        ? 'bg-gradient-to-br from-stone-800 to-stone-950 border border-stone-700 shadow-inner'
                        : isTrap
                        ? 'bg-purple-950/60 border border-purple-800/40'
                        : isFinish
                        ? 'bg-amber-950/80 border-2 border-yellow-400 glow-gold animate-pulse'
                        : isVisited
                        ? 'bg-red-950/40 border border-red-800/40'
                        : 'bg-slate-900/60 border border-slate-800'
                    }`}
                  >
                    {/* Wall brick texture decoration */}
                    {isWall && (
                      <div className="w-full h-full opacity-40 flex flex-col justify-between p-1">
                        <div className="w-full h-0.5 bg-stone-600/50" />
                        <div className="w-full h-0.5 bg-stone-600/50" />
                      </div>
                    )}

                    {/* Spider web trap */}
                    {isTrap && !isCurrent && (
                      <span className="text-sm opacity-60">🕸️</span>
                    )}

                    {/* Start label */}
                    {isStart && !isCurrent && (
                      <span className="text-[10px] font-black text-amber-300 font-horror">
                        START
                      </span>
                    )}

                    {/* Finish Castle Icon */}
                    {isFinish && !isCurrent && (
                      <div className="flex flex-col items-center">
                        <span className="text-xl sm:text-2xl drop-shadow-[0_0_8px_#f59e0b]">
                          🏰
                        </span>
                        <span className="text-[9px] font-bold text-yellow-300">KASTIL</span>
                      </div>
                    )}

                    {/* Active Dracula Player Pin */}
                    {isCurrent && (
                      <motion.div
                        layoutId="dracula-player"
                        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                        className="absolute inset-0 flex items-center justify-center z-20"
                      >
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-red-600/30 ring-2 ring-yellow-400 flex items-center justify-center glow-purple">
                          <CharacterSvg id="dracula" size={38} />
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Mobile & Desktop D-PAD Controls */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
            KONTROL ARAH
          </span>

          <div className="grid grid-cols-3 gap-2 w-48 sm:w-56">
            {/* Top row */}
            <div />
            <button
              onClick={() => move(-1, 0)}
              className="h-14 sm:h-16 rounded-2xl bg-gradient-to-b from-stone-700 to-stone-900 hover:from-stone-600 hover:to-stone-800 border-3 border-amber-600/80 text-yellow-300 flex items-center justify-center shadow-lg active:scale-90 active:bg-amber-600 transition-all cursor-pointer"
              title="Atas"
            >
              <ArrowUp className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
            </button>
            <div />

            {/* Middle row */}
            <button
              onClick={() => move(0, -1)}
              className="h-14 sm:h-16 rounded-2xl bg-gradient-to-b from-stone-700 to-stone-900 hover:from-stone-600 hover:to-stone-800 border-3 border-amber-600/80 text-yellow-300 flex items-center justify-center shadow-lg active:scale-90 active:bg-amber-600 transition-all cursor-pointer"
              title="Kiri"
            >
              <ArrowLeft className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
            </button>

            <button
              onClick={() => move(1, 0)}
              className="h-14 sm:h-16 rounded-2xl bg-gradient-to-b from-stone-700 to-stone-900 hover:from-stone-600 hover:to-stone-800 border-3 border-amber-600/80 text-yellow-300 flex items-center justify-center shadow-lg active:scale-90 active:bg-amber-600 transition-all cursor-pointer"
              title="Bawah"
            >
              <ArrowDown className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
            </button>

            <button
              onClick={() => move(0, 1)}
              className="h-14 sm:h-16 rounded-2xl bg-gradient-to-b from-stone-700 to-stone-900 hover:from-stone-600 hover:to-stone-800 border-3 border-amber-600/80 text-yellow-300 flex items-center justify-center shadow-lg active:scale-90 active:bg-amber-600 transition-all cursor-pointer"
              title="Kanan"
            >
              <ArrowRight className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
            </button>
          </div>

          <button
            onClick={handleReset}
            className="mt-2 px-4 py-2 rounded-xl bg-stone-900 border border-stone-700 hover:bg-stone-800 text-xs text-stone-300 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Mulai Ulang Labirin</span>
          </button>
        </div>
      </div>

      {/* VICTORY MODAL */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="panel-wood max-w-md w-full p-6 sm:p-8 rounded-3xl border-4 border-yellow-400 text-center shadow-[0_0_50px_rgba(234,179,8,0.6)]"
            >
              <div className="text-5xl animate-bounce mb-2">🏰</div>
              <h3 className="text-2xl sm:text-3xl font-black font-horror text-yellow-300 tracking-wider">
                HEBAT! DRACULA MENEMUKAN KASTILNYA!
              </h3>
              <p className="text-sm text-amber-100 mt-2 font-kids">
                Kamu pandai memecahkan labirin misterius kastil tua!
              </p>

              {/* Stars */}
              <div className="flex justify-center gap-2 my-4">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className="w-9 h-9 fill-yellow-400 text-yellow-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.9)]"
                  />
                ))}
              </div>

              <div className="bg-red-950/80 border border-red-500 rounded-2xl py-2 px-4 mb-6">
                <span className="text-xs text-red-300 font-bold block">Hadiah Misi:</span>
                <span className="text-xl font-horror text-amber-300">+50 POIN & 3 BINTANG ⭐</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 border-2 border-stone-600 text-stone-200 font-bold flex items-center justify-center gap-2 active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Main Lagi</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onNextMission();
                  }}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-horror text-lg tracking-wider border-2 border-yellow-300 shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>MISI 3</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
