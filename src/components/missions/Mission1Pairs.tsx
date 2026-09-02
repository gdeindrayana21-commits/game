import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Clock, Star, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { CharacterSvg } from '../HorrorCharacters';
import { sound } from '../../utils/audio';

interface Props {
  onComplete: (starsEarned: number, scoreEarned: number) => void;
  onNextMission: () => void;
  triggerJumpscare: () => void;
}

type CardItem = 'hantu' | 'zombie' | 'dracula' | 'skeleton' | 'kelelawar';

interface CoffinCard {
  id: number;
  item: CardItem;
  name: string;
}

const ITEMS_CONFIG: { type: CardItem; name: string }[] = [
  { type: 'hantu', name: 'Hantu Glowing' },
  { type: 'zombie', name: 'Zombie Lucu' },
  { type: 'dracula', name: 'Dracula Cilik' },
  { type: 'skeleton', name: 'Skeleton Menari' },
  { type: 'kelelawar', name: 'Kelelawar Malam' },
];

export const Mission1Pairs: React.FC<Props> = ({
  onComplete,
  onNextMission,
  triggerJumpscare,
}) => {
  const [cards, setCards] = useState<CoffinCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrongShake, setWrongShake] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'wrong' | 'idle' }>({
    text: 'Ayo buka peti dan temukan 2 gambar kembar!',
    type: 'idle',
  });
  const [timeLeft, setTimeLeft] = useState(90); // 01:30
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Initialize and shuffle 10 cards (5 pairs)
  const initGame = useCallback(() => {
    const deck: CoffinCard[] = [];
    let idCounter = 0;
    ITEMS_CONFIG.forEach((config) => {
      deck.push({ id: idCounter++, item: config.type, name: config.name });
      deck.push({ id: idCounter++, item: config.type, name: config.name });
    });

    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setWrongShake([]);
    setTimeLeft(90);
    setIsCompleted(false);
    setIsEvaluating(false);
    setFeedback({
      text: 'Ayo buka peti dan temukan 2 gambar kembar!',
      type: 'idle',
    });
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Timer countdown
  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0; // Soft timer: child can still complete without harsh game over
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  // Card click handler
  const handleCardClick = (id: number) => {
    if (isEvaluating || isCompleted) return;
    if (flipped.includes(id) || matched.includes(id)) return;

    sound.playCreak();

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setIsEvaluating(true);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId)!;
      const secondCard = cards.find((c) => c.id === secondId)!;

      if (firstCard.item === secondCard.item) {
        // Correct Match!
        setTimeout(() => {
          sound.playCorrect();
          sound.playStar();
          const newMatched = [...matched, firstId, secondId];
          setMatched(newMatched);
          setFlipped([]);
          setIsEvaluating(false);
          setFeedback({
            text: 'HEBAT! KAMU MENEMUKAN PASANGANNYA!',
            type: 'success',
          });

          // Check if all 5 pairs found
          if (newMatched.length === 10) {
            handleVictory();
          }
        }, 500);
      } else {
        // Wrong Match!
        setTimeout(() => {
          sound.playWrong();
          sound.playCloseCoffin();
          setWrongShake([firstId, secondId]);
          setFeedback({
            text: 'BELUM TEPAT! COBA LAGI!',
            type: 'wrong',
          });

          // Trigger friendly jumpscare occasionally on mistake
          if (Math.random() < 0.5) {
            triggerJumpscare();
          }

          setTimeout(() => {
            setFlipped([]);
            setWrongShake([]);
            setIsEvaluating(false);
          }, 900);
        }, 600);
      }
    }
  };

  const handleVictory = () => {
    setIsCompleted(true);
    sound.playMissionComplete();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#fbbf24', '#4ade80', '#f43f5e'],
    });
    onComplete(3, 50); // 3 stars, +50 points
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Coffin render helper
  const renderCardContent = (card: CoffinCard) => {
    if (card.item === 'kelelawar') {
      return (
        <div className="flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-5xl animate-flutter-bat">🦇</span>
          <span className="text-[11px] font-bold text-amber-200 mt-1">Kelelawar</span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center">
        <CharacterSvg id={card.item} size={65} />
        <span className="text-[11px] font-bold text-amber-200 mt-1">{card.name}</span>
      </div>
    );
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-3 py-4 md:py-6">
      {/* Title & Instructions */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-950/80 border border-amber-500 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MISI 1 DARI 5</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black font-horror text-yellow-300 tracking-wider">
          1. CARI PASANGAN HANTU!
        </h2>
        <p className="text-xs sm:text-sm text-stone-200 font-medium font-kids">
          "Temukan pasangan gambar yang sama!"
        </p>
      </div>

      {/* Info Status Bar: WAKTU 01:30 & PASANGAN 0/5 */}
      <div className="flex items-center justify-between gap-3 bg-stone-900/90 border-2 border-amber-600/70 p-3 rounded-2xl mb-5 shadow-lg">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-400" />
          <div>
            <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">
              WAKTU
            </span>
            <span className="text-lg sm:text-xl font-horror text-yellow-300">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Dynamic Feedback Banner */}
        <div className="text-center flex-1 mx-2">
          <span
            className={`inline-block px-3 py-1 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              feedback.type === 'success'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                : feedback.type === 'wrong'
                ? 'bg-rose-950 text-rose-300 border border-rose-500'
                : 'bg-stone-800/80 text-stone-300'
            }`}
          >
            {feedback.text}
          </span>
        </div>

        <div className="flex items-center gap-2 text-right">
          <div>
            <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">
              PASANGAN
            </span>
            <span className="text-lg sm:text-xl font-horror text-emerald-400">
              {matched.length / 2}/5
            </span>
          </div>
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-500" />
        </div>
      </div>

      {/* 10 COFFINS (2 rows of 5 coffins) */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4 justify-items-center">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);
          const isShaking = wrongShake.includes(card.id);

          return (
            <motion.div
              key={card.id}
              whileHover={!isFlipped ? { scale: 1.05 } : {}}
              whileTap={!isFlipped ? { scale: 0.95 } : {}}
              onClick={() => handleCardClick(card.id)}
              className={`relative w-full aspect-[3/4.2] max-w-[130px] rounded-2xl cursor-pointer select-none transition-transform ${
                isShaking ? 'animate-shake-wrong' : ''
              }`}
            >
              {/* Coffin Visual Wrapper */}
              <div className="w-full h-full relative perspective-1000">
                {/* CLOSED COFFIN (Front face) */}
                <div
                  className={`absolute inset-0 rounded-2xl panel-wood border-3 flex flex-col items-center justify-between p-2 shadow-xl transition-all duration-300 ${
                    isFlipped
                      ? 'opacity-0 pointer-events-none rotate-y-90 scale-90'
                      : 'opacity-100 border-amber-700/80 hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.4)]'
                  }`}
                  style={{
                    clipPath:
                      'polygon(25% 0%, 75% 0%, 100% 25%, 85% 100%, 15% 100%, 0% 25%)',
                  }}
                >
                  <div className="w-4 h-4 rounded-full bg-amber-700/50 mt-1" />
                  {/* Coffin Cross / Skull Ornament */}
                  <div className="flex flex-col items-center">
                    <span className="text-xl sm:text-2xl text-amber-500 opacity-80">⚰️</span>
                    <span className="text-[10px] font-horror text-amber-300/80 tracking-widest mt-1">
                      BUKA
                    </span>
                  </div>
                  <div className="w-full h-1 bg-amber-800/40 rounded-full mb-1" />
                </div>

                {/* OPENED COFFIN (Revealed character) */}
                <div
                  className={`absolute inset-0 rounded-2xl panel-purple-crypt border-3 flex flex-col items-center justify-center p-2 shadow-2xl transition-all duration-300 ${
                    isFlipped
                      ? 'opacity-100 rotate-y-0 scale-100 border-yellow-400'
                      : 'opacity-0 pointer-events-none -rotate-y-90'
                  } ${isMatched ? 'glow-gold ring-2 ring-yellow-400' : ''}`}
                  style={{
                    clipPath:
                      'polygon(25% 0%, 75% 0%, 100% 25%, 85% 100%, 15% 100%, 0% 25%)',
                  }}
                >
                  {renderCardContent(card)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* MISSION COMPLETE CELEBRATION MODAL */}
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
              <div className="text-5xl animate-bounce mb-2">🎉</div>
              <h3 className="text-3xl sm:text-4xl font-black font-horror text-yellow-300 tracking-wider">
                MISSION COMPLETE!
              </h3>
              <p className="text-sm sm:text-base text-amber-100 mt-2 font-kids">
                HEBAT! Kamu berhasil menemukan semua 5 pasangan gambar hantu!
              </p>

              {/* Reward Stars */}
              <div className="flex justify-center gap-2 my-4">
                {[1, 2, 3].map((s) => (
                  <motion.div
                    key={s}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: s * 0.15 }}
                  >
                    <Star className="w-10 h-10 fill-yellow-400 text-yellow-500 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]" />
                  </motion.div>
                ))}
              </div>

              <div className="bg-purple-950/80 border border-purple-500 rounded-2xl py-2 px-4 mb-6">
                <span className="text-xs text-purple-300 font-bold block">Hadiah:</span>
                <span className="text-xl font-horror text-emerald-300">+50 POIN & 3 BINTANG ⭐</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    sound.playClick();
                    initGame();
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
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-slate-950 font-horror text-lg tracking-wider border-2 border-yellow-300 shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>MISI 2</span>
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
