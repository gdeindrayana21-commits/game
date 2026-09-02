import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { RefreshCw, Star, Sparkles, ArrowRight, Check } from 'lucide-react';
import { CharacterSvg } from '../HorrorCharacters';
import { sound } from '../../utils/audio';

interface Props {
  onComplete: (starsEarned: number, scoreEarned: number) => void;
  onNextMission: () => void;
}

type LineType = 'lurus' | 'zigzag' | 'gelombang' | 'melengkung' | 'kotak';

interface LineStage {
  id: LineType;
  title: string;
  description: string;
}

const LINE_STAGES: LineStage[] = [
  { id: 'lurus', title: 'Garis Lurus', description: 'Tarik garis lurus dari zombie ke otak!' },
  { id: 'zigzag', title: 'Garis Zig-Zag', description: 'Ikuti garis gigi runcing zig-zag!' },
  { id: 'gelombang', title: 'Garis Gelombang', description: 'Gerakkan jari naik turun seperti ombak malam!' },
  { id: 'melengkung', title: 'Garis Melengkung', description: 'Ikuti lengkungan bulan sabit!' },
  { id: 'kotak', title: 'Garis Kotak', description: 'Lompat kotak seperti benteng kastil!' },
];

export const Mission3Tracing: React.FC<Props> = ({ onComplete, onNextMission }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100%
  const [warning, setWarning] = useState<string | null>(null);
  const [isStageDone, setIsStageDone] = useState(false);
  const [isAllCompleted, setIsAllCompleted] = useState(false);

  // User traced strokes on the current stage (array of strokes, each stroke is an array of points)
  const tracedStrokesRef = useRef<{ x: number; y: number }[][]>([]);
  // Covered segment indices of the target curve
  const coveredSegmentsRef = useRef<boolean[]>([]);

  const stage = LINE_STAGES[currentStageIdx];

  // Generate target points along the mathematical curve across width W and height H
  const getCurvePoints = useCallback((type: LineType, w: number, h: number) => {
    const pts: { x: number; y: number }[] = [];
    const paddingX = 70;
    const startX = paddingX;
    const endX = w - paddingX;
    const centerY = h / 2;
    const steps = 140;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = startX + t * (endX - startX);
      let y = centerY;

      if (type === 'lurus') {
        y = centerY;
      } else if (type === 'zigzag') {
        // 4 peaks zig-zag
        const cycles = 4;
        const phase = (t * cycles * 2) % 2;
        const tri = phase < 1 ? phase * 2 - 1 : (2 - phase) * 2 - 1;
        y = centerY + tri * (h * 0.28);
      } else if (type === 'gelombang') {
        // Sine wave
        y = centerY + Math.sin(t * Math.PI * 5) * (h * 0.25);
      } else if (type === 'melengkung') {
        // Parabolic arch
        y = centerY + Math.sin(t * Math.PI) * (h * 0.35);
      } else if (type === 'kotak') {
        // Square wave
        const phase = Math.floor(t * 8) % 2;
        y = centerY + (phase === 0 ? -h * 0.22 : h * 0.22);
      }

      pts.push({ x, y });
    }
    return pts;
  }, []);

  // Redraw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const targetPoints = getCurvePoints(stage.id, w, h);
    if (targetPoints.length === 0) return;

    // 1. Draw Dotted Guide Path (Yellow / Amber Spooky Dotted Line)
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([8, 10]);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.moveTo(targetPoints[0].x, targetPoints[0].y);
    for (let i = 1; i < targetPoints.length; i++) {
      ctx.lineTo(targetPoints[i].x, targetPoints[i].y);
    }
    ctx.stroke();
    ctx.restore();

    // 2. Draw User Traced Glowing Green Strokes (all strokes user has drawn)
    if (tracedStrokesRef.current.length > 0) {
      ctx.save();
      ctx.setLineDash([]);
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 12;

      tracedStrokesRef.current.forEach((stroke) => {
        if (stroke.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
      });

      ctx.restore();
    }
  }, [stage.id, getCurvePoints]);

  // Handle Resize and Canvas Setup
  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = Math.max(260, rect.width * 0.42) * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${Math.max(260, rect.width * 0.42)}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);

      drawCanvas();
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [drawCanvas]);

  // Reset stage
  const resetStage = () => {
    tracedStrokesRef.current = [];
    coveredSegmentsRef.current = [];
    setProgress(0);
    setIsDrawing(false);
    setIsStageDone(false);
    setWarning(null);
    drawCanvas();
  };

  useEffect(() => {
    resetStage();
  }, [currentStageIdx]);

  // Check point proximity
  const handlePointerDown = (clientX: number, clientY: number) => {
    if (isStageDone || isAllCompleted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const targetPoints = getCurvePoints(stage.id, rect.width, rect.height);
    
    // Check distance to any point along the curve (must be near the dotted line)
    let minDist = Infinity;
    targetPoints.forEach((pt) => {
      const d = Math.hypot(x - pt.x, y - pt.y);
      if (d < minDist) minDist = d;
    });

    if (minDist < 50) {
      setIsDrawing(true);
      tracedStrokesRef.current.push([{ x, y }]);
      sound.playClick();
      drawCanvas();
    } else {
      setWarning('Sentuh garis putus-putus untuk mulai menebalkan! ✏️');
      setTimeout(() => setWarning(null), 1500);
    }
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDrawing || isStageDone) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const targetPoints = getCurvePoints(stage.id, rect.width, rect.height);

    // Initialize covered segments array if needed
    if (coveredSegmentsRef.current.length !== targetPoints.length) {
      coveredSegmentsRef.current = new Array(targetPoints.length).fill(false);
    }

    // Find nearest point on curve
    let minDist = Infinity;
    targetPoints.forEach((pt) => {
      const d = Math.hypot(x - pt.x, y - pt.y);
      if (d < minDist) {
        minDist = d;
      }
    });

    // Tolerance check: max 55px deviation
    if (minDist > 55) {
      setWarning('Ups! Ikuti garis putus-putus sampai tebal ya! 🌟');
      sound.playDeadEnd();
      setTimeout(() => setWarning(null), 1200);
      return;
    }

    // Add point to current stroke
    const currentStroke = tracedStrokesRef.current[tracedStrokesRef.current.length - 1];
    if (currentStroke) {
      currentStroke.push({ x, y });
    }
    drawCanvas();

    // Mark covered points along the dotted line
    targetPoints.forEach((pt, idx) => {
      if (!coveredSegmentsRef.current[idx]) {
        const d = Math.hypot(x - pt.x, y - pt.y);
        if (d < 30) {
          coveredSegmentsRef.current[idx] = true;
        }
      }
    });

    // Calculate percentage of target points covered
    const coveredCount = coveredSegmentsRef.current.filter(Boolean).length;
    const currentProg = Math.min(100, Math.round((coveredCount / targetPoints.length) * 100));
    setProgress(currentProg);

    // ONLY declare stage complete when ALL (>=95%) dotted points are actually traced/thickened!
    if (currentProg >= 95 && !isStageDone) {
      // Finished Stage!
      setIsDrawing(false);
      setIsStageDone(true);
      setProgress(100);
      sound.playCorrect();
      sound.playStar();

      const newCompleted = [...new Set([...completedStages, currentStageIdx])];
      setCompletedStages(newCompleted);

      // Check if all 5 lines done
      if (newCompleted.length >= 5) {
        setTimeout(() => {
          setIsAllCompleted(true);
          sound.playMissionComplete();
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#4ade80', '#fbbf24', '#a855f7'],
          });
          onComplete(3, 50);
        }, 500);
      }
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const nextStage = () => {
    sound.playClick();
    if (currentStageIdx < LINE_STAGES.length - 1) {
      setCurrentStageIdx((prev) => prev + 1);
    }
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-3 py-4 md:py-6">
      {/* Title */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MISI 3 DARI 5</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black font-horror text-yellow-300 tracking-wider">
          3. TEBALKAN GARIS!
        </h2>
        <p className="text-xs sm:text-sm text-stone-200 font-medium font-kids">
          "Tebalkan semua garis putus-putus sampai menyala penuh!"
        </p>
      </div>

      {/* Stage Selector Pills (5 stages) */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
        {LINE_STAGES.map((st, idx) => {
          const isDone = completedStages.includes(idx);
          const isCurrent = idx === currentStageIdx;

          return (
            <button
              key={st.id}
              onClick={() => {
                sound.playClick();
                setCurrentStageIdx(idx);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                isCurrent
                  ? 'bg-emerald-600 text-slate-950 border-2 border-yellow-300 shadow-md scale-105'
                  : isDone
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                  : 'bg-stone-900 text-stone-400 border border-stone-700'
              }`}
            >
              {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span>{idx + 1}</span>}
              <span>{st.title}</span>
            </button>
          );
        })}
      </div>

      {/* Warning banner */}
      {warning && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-2"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500 text-xs font-bold shadow">
            {warning}
          </span>
        </motion.div>
      )}

      {/* Main Canvas Tracing Area */}
      <div
        ref={containerRef}
        className="panel-stone rounded-3xl p-3 sm:p-5 border-4 border-amber-700 relative select-none shadow-2xl overflow-hidden"
      >
        {/* Left Marker: Little Zombie */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
          <div className="w-14 h-14 sm:w-18 sm:h-18 flex items-center justify-center filter drop-shadow-[0_0_10px_#4ade80]">
            <CharacterSvg id="zombie" size={54} />
          </div>
          <span className="text-[10px] font-black text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded">
            START 🧟
          </span>
        </div>

        {/* Right Marker: Brain 🧠 */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
          <div className="text-4xl sm:text-5xl animate-bounce drop-shadow-[0_0_12px_#ec4899]">
            🧠
          </div>
          <span className="text-[10px] font-black text-rose-300 bg-black/60 px-1.5 py-0.5 rounded">
            OTAK PINTAR
          </span>
        </div>

        {/* Interactive Tracing Canvas */}
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
          className="w-full block rounded-2xl bg-slate-950/70 cursor-crosshair touch-none"
        />

        {/* Progress Bar under canvas */}
        <div className="mt-3 flex items-center justify-between gap-3 px-2">
          <span className="text-xs text-stone-400 font-bold">Progress Tracing:</span>
          <div className="flex-1 h-3 bg-stone-900 rounded-full overflow-hidden border border-stone-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-yellow-400 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-black text-amber-300">{progress}%</span>
        </div>
      </div>

      {/* Stage Feedback & Next Button */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={resetStage}
          className="px-4 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-300 text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Hapus & Coba Lagi</span>
        </button>

        {isStageDone && !isAllCompleted && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs sm:text-sm font-bold text-emerald-400">
              🌟 Bagus sekali! Garis berhasil ditebalkan!
            </span>
            {currentStageIdx < LINE_STAGES.length - 1 && (
              <button
                onClick={nextStage}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-horror text-sm tracking-wider border-2 border-yellow-300 shadow-md flex items-center gap-2 active:scale-95"
              >
                <span>GARIS BERIKUTNYA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* ALL COMPLETED MODAL */}
      <AnimatePresence>
        {isAllCompleted && (
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
              <div className="text-5xl animate-bounce mb-2">🧠✨</div>
              <h3 className="text-2xl sm:text-3xl font-black font-horror text-yellow-300 tracking-wider">
                HEBAT! TANGANMU SEMAKIN TERAMPIL!
              </h3>
              <p className="text-sm text-amber-100 mt-2 font-kids">
                Semua bentuk garis berhasil kamu tebalkan dengan sangat rapi!
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

              <div className="bg-emerald-950/80 border border-emerald-500 rounded-2xl py-2 px-4 mb-6">
                <span className="text-xs text-emerald-300 font-bold block">Hadiah Misi:</span>
                <span className="text-xl font-horror text-amber-300">+50 POIN & 3 BINTANG ⭐</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setCurrentStageIdx(0);
                    setCompletedStages([]);
                    setIsAllCompleted(false);
                    resetStage();
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
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-slate-950 font-horror text-lg tracking-wider border-2 border-yellow-300 shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>MISI 4</span>
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
