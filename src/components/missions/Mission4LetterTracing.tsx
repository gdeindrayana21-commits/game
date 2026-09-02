import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Volume2, Star, Sparkles, RefreshCw, ArrowRight, Check } from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  onComplete: (starsEarned: number, scoreEarned: number) => void;
  onNextMission: () => void;
}

interface TracingItem {
  id: string;
  char: string;
  type: 'huruf' | 'angka';
  spokenName: string;
  // Normalized path points (0 to 1 range inside canvas)
  strokes: { x: number; y: number }[][];
}

const TRACING_ITEMS: TracingItem[] = [
  // LETTERS A - E
  {
    id: 'A',
    char: 'A',
    type: 'huruf',
    spokenName: 'Ini huruf A! A seperti Apel atau Hantu Berani!',
    strokes: [
      // Left diagonal
      [{ x: 0.5, y: 0.15 }, { x: 0.25, y: 0.85 }],
      // Right diagonal
      [{ x: 0.5, y: 0.15 }, { x: 0.75, y: 0.85 }],
      // Horizontal bar
      [{ x: 0.35, y: 0.55 }, { x: 0.65, y: 0.55 }],
    ],
  },
  {
    id: 'B',
    char: 'B',
    type: 'huruf',
    spokenName: 'Ini huruf B! B seperti Bulan dan Kelelawar!',
    strokes: [
      // Vertical stem
      [{ x: 0.3, y: 0.15 }, { x: 0.3, y: 0.85 }],
      // Top loop
      [{ x: 0.3, y: 0.15 }, { x: 0.65, y: 0.15 }, { x: 0.7, y: 0.32 }, { x: 0.65, y: 0.5 }, { x: 0.3, y: 0.5 }],
      // Bottom loop
      [{ x: 0.3, y: 0.5 }, { x: 0.7, y: 0.5 }, { x: 0.75, y: 0.68 }, { x: 0.7, y: 0.85 }, { x: 0.3, y: 0.85 }],
    ],
  },
  {
    id: 'C',
    char: 'C',
    type: 'huruf',
    spokenName: 'Ini huruf C! C seperti Ceria dan Cerdas!',
    strokes: [
      [{ x: 0.75, y: 0.25 }, { x: 0.5, y: 0.15 }, { x: 0.3, y: 0.35 }, { x: 0.3, y: 0.65 }, { x: 0.5, y: 0.85 }, { x: 0.75, y: 0.75 }],
    ],
  },
  {
    id: 'D',
    char: 'D',
    type: 'huruf',
    spokenName: 'Ini huruf D! D seperti Dracula!',
    strokes: [
      [{ x: 0.3, y: 0.15 }, { x: 0.3, y: 0.85 }],
      [{ x: 0.3, y: 0.15 }, { x: 0.6, y: 0.15 }, { x: 0.75, y: 0.35 }, { x: 0.75, y: 0.65 }, { x: 0.6, y: 0.85 }, { x: 0.3, y: 0.85 }],
    ],
  },
  {
    id: 'E',
    char: 'E',
    type: 'huruf',
    spokenName: 'Ini huruf E! E seperti Elang dan Ekor hantu!',
    strokes: [
      [{ x: 0.3, y: 0.15 }, { x: 0.3, y: 0.85 }],
      [{ x: 0.3, y: 0.15 }, { x: 0.75, y: 0.15 }],
      [{ x: 0.3, y: 0.5 }, { x: 0.65, y: 0.5 }],
      [{ x: 0.3, y: 0.85 }, { x: 0.75, y: 0.85 }],
    ],
  },
  // NUMBERS 1 - 5
  {
    id: '1',
    char: '1',
    type: 'angka',
    spokenName: 'Ini angka satu! Satu kastil berhantu megah!',
    strokes: [
      [{ x: 0.35, y: 0.3 }, { x: 0.5, y: 0.15 }, { x: 0.5, y: 0.85 }],
      [{ x: 0.3, y: 0.85 }, { x: 0.7, y: 0.85 }],
    ],
  },
  {
    id: '2',
    char: '2',
    type: 'angka',
    spokenName: 'Ini angka dua! Dua taring tajam Dracula!',
    strokes: [
      [{ x: 0.3, y: 0.3 }, { x: 0.5, y: 0.15 }, { x: 0.7, y: 0.3 }, { x: 0.3, y: 0.85 }, { x: 0.75, y: 0.85 }],
    ],
  },
  {
    id: '3',
    char: '3',
    type: 'angka',
    spokenName: 'Ini angka tiga! Tiga kelelawar terbang malam!',
    strokes: [
      [{ x: 0.3, y: 0.2 }, { x: 0.7, y: 0.2 }, { x: 0.45, y: 0.48 }, { x: 0.7, y: 0.65 }, { x: 0.5, y: 0.85 }, { x: 0.3, y: 0.8 }],
    ],
  },
  {
    id: '4',
    char: '4',
    type: 'angka',
    spokenName: 'Ini angka empat! Empat labu kuning bersinar!',
    strokes: [
      [{ x: 0.65, y: 0.15 }, { x: 0.3, y: 0.6 }, { x: 0.75, y: 0.6 }],
      [{ x: 0.65, y: 0.4 }, { x: 0.65, y: 0.85 }],
    ],
  },
  {
    id: '5',
    char: '5',
    type: 'angka',
    spokenName: 'Ini angka lima! Lima jemari tangan zombie!',
    strokes: [
      [{ x: 0.7, y: 0.15 }, { x: 0.35, y: 0.15 }, { x: 0.32, y: 0.45 }, { x: 0.65, y: 0.45 }, { x: 0.72, y: 0.65 }, { x: 0.5, y: 0.85 }, { x: 0.3, y: 0.8 }],
    ],
  },
];

export const Mission4LetterTracing: React.FC<Props> = ({ onComplete, onNextMission }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isItemDone, setIsItemDone] = useState(false);
  const [isAllDone, setIsAllDone] = useState(false);

  const currentItem = TRACING_ITEMS[activeIdx];
  const userPointsRef = useRef<{ x: number; y: number }[]>([]);

  // Generate interpolated guide dots from item strokes
  const getInterpolatedTargetDots = useCallback((w: number, h: number) => {
    const dots: { x: number; y: number }[] = [];
    currentItem.strokes.forEach((stroke) => {
      for (let i = 0; i < stroke.length - 1; i++) {
        const p1 = stroke[i];
        const p2 = stroke[i + 1];
        const dx = (p2.x - p1.x) * w;
        const dy = (p2.y - p1.y) * h;
        const dist = Math.hypot(dx, dy);
        const numSteps = Math.max(5, Math.floor(dist / 14));

        for (let s = 0; s <= numSteps; s++) {
          const t = s / numSteps;
          dots.push({
            x: (p1.x + t * (p2.x - p1.x)) * w,
            y: (p1.y + t * (p2.y - p1.y)) * h,
          });
        }
      }
    });
    return dots;
  }, [currentItem]);

  // Redraw Canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const targetDots = getInterpolatedTargetDots(w, h);

    // 1. Draw Dotted Guide Circles
    targetDots.forEach((dot, idx) => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = idx === 0 ? '#facc15' : '#78716c';
      ctx.fill();
    });

    // 2. Draw user traced glowing stroke
    if (userPointsRef.current.length > 1) {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 10;

      ctx.moveTo(userPointsRef.current[0].x, userPointsRef.current[0].y);
      for (let i = 1; i < userPointsRef.current.length; i++) {
        ctx.lineTo(userPointsRef.current[i].x, userPointsRef.current[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }
  }, [getInterpolatedTargetDots]);

  // Resize listener
  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const size = Math.min(rect.width, 340);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);

      draw();
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [draw]);

  const resetCanvas = () => {
    userPointsRef.current = [];
    setProgress(0);
    setIsDrawing(false);
    setIsItemDone(false);
    draw();
  };

  useEffect(() => {
    resetCanvas();
    // Pronounce initial instruction for item
    sound.speakIndonesian(currentItem.spokenName);
  }, [activeIdx]);

  const handlePointerDown = (clientX: number, clientY: number) => {
    if (isItemDone || isAllDone) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setIsDrawing(true);
    userPointsRef.current.push({ x, y });
    sound.playClick();
    draw();
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDrawing || isItemDone) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    userPointsRef.current.push({ x, y });
    draw();

    // Check hit coverage of target dots
    const targetDots = getInterpolatedTargetDots(rect.width, rect.height);
    let hitCount = 0;
    targetDots.forEach((dot) => {
      const isHit = userPointsRef.current.some(
        (p) => Math.hypot(p.x - dot.x, p.y - dot.y) < 28
      );
      if (isHit) hitCount++;
    });

    const currentProg = Math.min(100, Math.round((hitCount / targetDots.length) * 100));
    setProgress(currentProg);

    if (currentProg >= 75 && !isItemDone) {
      // Completed current letter/number!
      setIsItemDone(true);
      setIsDrawing(false);
      setProgress(100);

      sound.playCorrect();
      sound.playStar();
      sound.speakIndonesian(currentItem.spokenName);

      const newDone = [...new Set([...completedIds, currentItem.id])];
      setCompletedIds(newDone);

      if (newDone.length >= TRACING_ITEMS.length) {
        setTimeout(() => {
          setIsAllDone(true);
          sound.playMissionComplete();
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#38bdf8', '#facc15', '#a855f7'],
          });
          onComplete(3, 50);
        }, 800);
      }
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-3 py-4 md:py-6">
      {/* Title */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-950/80 border border-blue-500 text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MISI 4 DARI 5</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black font-horror text-yellow-300 tracking-wider">
          4. TEBALKAN HURUF & ANGKA!
        </h2>
        <p className="text-xs sm:text-sm text-stone-200 font-medium font-kids">
          "Ayo belajar huruf dan angka!"
        </p>
      </div>

      {/* Row 1: Huruf A B C D E */}
      <div className="flex flex-col items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
          <span className="text-xs font-bold text-sky-400 mr-1 uppercase">HURUF:</span>
          {TRACING_ITEMS.slice(0, 5).map((item, idx) => {
            const isCurrent = activeIdx === idx;
            const isDone = completedIds.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  setActiveIdx(idx);
                }}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-2 border-yellow-300 scale-110 shadow-lg'
                    : isDone
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                    : 'bg-stone-900 text-stone-300 border border-stone-700'
                }`}
              >
                {item.char}
              </button>
            );
          })}
        </div>

        {/* Row 2: Angka 1 2 3 4 5 */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
          <span className="text-xs font-bold text-amber-400 mr-1 uppercase">ANGKA:</span>
          {TRACING_ITEMS.slice(5).map((item, relIdx) => {
            const idx = 5 + relIdx;
            const isCurrent = activeIdx === idx;
            const isDone = completedIds.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  setActiveIdx(idx);
                }}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-600 text-white border-2 border-yellow-300 scale-110 shadow-lg'
                    : isDone
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                    : 'bg-stone-900 text-stone-300 border border-stone-700'
                }`}
              >
                {item.char}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Canvas Tracing Area */}
      <div className="flex flex-col items-center">
        {/* Active Character Pronunciation Banner */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => sound.speakIndonesian(currentItem.spokenName)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-indigo-950 border border-indigo-400 text-yellow-300 text-xs sm:text-sm font-bold shadow transition-all active:scale-95"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Dengarkan: "{currentItem.char}"</span>
          </button>
        </div>

        <div
          ref={containerRef}
          className="panel-stone p-4 rounded-3xl border-4 border-blue-600/80 shadow-2xl relative select-none flex flex-col items-center"
        >
          {/* Big Ghost Watermark behind letter */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none font-horror text-8xl text-white">
            {currentItem.char}
          </div>

          <canvas
            ref={canvasRef}
            onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
            onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              handlePointerDown(touch.clientX, touch.clientY);
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              handlePointerMove(touch.clientX, touch.clientY);
            }}
            onTouchEnd={handlePointerUp}
            className="block rounded-2xl bg-slate-950/80 border-2 border-stone-700 cursor-crosshair touch-none shadow-inner"
          />

          {/* Progress bar */}
          <div className="w-full mt-3 flex items-center justify-between gap-3 px-2">
            <span className="text-xs text-stone-400 font-bold">Kelengkapan:</span>
            <div className="flex-1 h-3 bg-stone-900 rounded-full overflow-hidden border border-stone-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-black text-amber-300">{progress}%</span>
          </div>
        </div>

        {/* Buttons: Reset & Next Item */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={resetCanvas}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-300 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Ulangi</span>
          </button>

          {isItemDone && !isAllDone && (
            <motion.button
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={() => {
                sound.playClick();
                if (activeIdx < TRACING_ITEMS.length - 1) {
                  setActiveIdx((prev) => prev + 1);
                }
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-horror text-sm tracking-wider border border-yellow-300 flex items-center gap-2 shadow-lg active:scale-95"
            >
              <span>LANJUT BERIKUTNYA</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* ALL COMPLETED CELEBRATION */}
      <AnimatePresence>
        {isAllDone && (
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
              <div className="text-5xl animate-bounce mb-2">⭐✏️</div>
              <h3 className="text-2xl sm:text-3xl font-black font-horror text-yellow-300 tracking-wider">
                LUAR BIASA! KAMU JAGO HURUF DAN ANGKA!
              </h3>
              <p className="text-sm text-amber-100 mt-2 font-kids">
                Huruf A-E dan Angka 1-5 sudah kamu kuasai dengan cemerlang!
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

              <div className="bg-blue-950/80 border border-blue-500 rounded-2xl py-2 px-4 mb-6">
                <span className="text-xs text-blue-300 font-bold block">Hadiah Misi:</span>
                <span className="text-xl font-horror text-amber-300">+50 POIN & 3 BINTANG ⭐</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setActiveIdx(0);
                    setCompletedIds([]);
                    setIsAllDone(false);
                    resetCanvas();
                  }}
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
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-500 hover:from-fuchsia-500 hover:to-purple-400 text-slate-950 font-horror text-lg tracking-wider border-2 border-yellow-300 shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>MISI 5</span>
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
