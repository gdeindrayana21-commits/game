import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Volume2, Star, Sparkles, Trophy, Check, ArrowRight } from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  onComplete: (starsEarned: number, scoreEarned: number) => void;
  onFinishAdventure: () => void;
}

interface ReadingCard {
  id: string;
  emoji: string;
  word: string;
  syllables: string[];
  letters: string[];
  description: string;
  vowels: string[];
}

const VOWELS = ['A', 'E', 'I', 'O', 'U'];

const READING_CARDS: ReadingCard[] = [
  {
    id: 'hantu',
    emoji: '👻',
    word: 'HANTU',
    syllables: ['HAN', 'TU'],
    letters: ['H', 'A', 'N', 'T', 'U'],
    description: 'Hantu putih bersahabat yang suka tersenyum.',
    vowels: ['A', 'U'],
  },
  {
    id: 'kelelawar',
    emoji: '🦇',
    word: 'KELELAWAR',
    syllables: ['KE', 'LE', 'LA', 'WAR'],
    letters: ['K', 'E', 'L', 'E', 'L', 'A', 'W', 'A', 'R'],
    description: 'Kelelawar lincah terbang di langit malam.',
    vowels: ['E', 'A'],
  },
  {
    id: 'labu',
    emoji: '🎃',
    word: 'LABU',
    syllables: ['LA', 'BU'],
    letters: ['L', 'A', 'B', 'U'],
    description: 'Labu oranye terang dengan lampu lilin hangat.',
    vowels: ['A', 'U'],
  },
  {
    id: 'kastil',
    emoji: '🏰',
    word: 'KASTIL',
    syllables: ['KAS', 'TIL'],
    letters: ['K', 'A', 'S', 'T', 'I', 'L'],
    description: 'Kastil megah tempat tinggal Dracula.',
    vowels: ['A', 'I'],
  },
  {
    id: 'zombie',
    emoji: '🧟',
    word: 'ZOMBIE',
    syllables: ['ZOM', 'BIE'],
    letters: ['Z', 'O', 'M', 'B', 'I', 'E'],
    description: 'Zombie pintar yang suka belajar huruf.',
    vowels: ['O', 'I', 'E'],
  },
];

export const Mission5Reading: React.FC<Props> = ({ onComplete, onFinishAdventure }) => {
  const [activeVowel, setActiveVowel] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<ReadingCard>(READING_CARDS[0]);
  const [activeLetterIdx, setActiveLetterIdx] = useState<number | null>(null);
  const [completedCardIds, setCompletedCardIds] = useState<string[]>([]);
  const [isAllDone, setIsAllDone] = useState(false);

  // Play Vocal Letter sound & speak
  const handleVowelClick = (vowel: string) => {
    sound.playClick();
    setActiveVowel(vowel);
    sound.speakIndonesian(`Huruf vokal ${vowel}!`);
  };

  // Play word pronunciation and letter-by-letter highlight
  const handleCardClick = (card: ReadingCard) => {
    sound.playClick();
    setSelectedCard(card);

    // Letter-by-letter spelling sequence
    const letters = card.letters;
    letters.forEach((letter, idx) => {
      setTimeout(() => {
        setActiveLetterIdx(idx);
        sound.playClick();
      }, idx * 400);
    });

    // Whole word completion speech
    setTimeout(() => {
      setActiveLetterIdx(null);
      sound.playCorrect();
      sound.speakIndonesian(`${card.letters.join(' ')}. ${card.word}!`);

      const newCompleted = [...new Set([...completedCardIds, card.id])];
      setCompletedCardIds(newCompleted);

      // Check if all 5 cards read
      if (newCompleted.length >= READING_CARDS.length) {
        setTimeout(() => {
          setIsAllDone(true);
          sound.playMissionComplete();
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#c084fc', '#f43f5e', '#fbbf24', '#34d399'],
          });
          onComplete(3, 50);
        }, 1200);
      }
    }, letters.length * 400 + 200);
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-3 py-4 md:py-6">
      {/* Title */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-fuchsia-950/80 border border-fuchsia-500 text-fuchsia-300 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MISI 5 DARI 5</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black font-horror text-yellow-300 tracking-wider">
          5. BELAJAR MEMBACA
        </h2>
        <p className="text-xs sm:text-sm text-stone-200 font-medium font-kids">
          "Kenali huruf vokal dan baca kata!"
        </p>
      </div>

      {/* SECTION 1: HURUF VOKAL BESAR (A, E, I, O, U) */}
      <div className="panel-stone rounded-3xl p-4 sm:p-5 border-4 border-fuchsia-600/80 shadow-2xl mb-6 text-center">
        <span className="text-xs font-bold text-fuchsia-300 uppercase tracking-wider block mb-2">
          PENCET HURUF VOKAL BESAR:
        </span>
        <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          {VOWELS.map((v) => {
            const isSelected = activeVowel === v;
            return (
              <motion.button
                key={v}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleVowelClick(v)}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl font-horror text-2xl sm:text-3xl font-black flex items-center justify-center transition-all cursor-pointer border-3 ${
                  isSelected
                    ? 'bg-gradient-to-b from-fuchsia-500 to-purple-600 text-white border-yellow-300 shadow-[0_0_20px_rgba(217,70,239,0.7)] scale-110'
                    : 'bg-slate-900 text-yellow-300 border-amber-600/70 hover:border-yellow-400'
                }`}
              >
                {v}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: 5 KARTU BERGAMBAR HOROR CERIA */}
      <div className="mb-4">
        <div className="text-center mb-2">
          <span className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
            PILIH KARTU KATA BERGAMBAR:
          </span>
          <p className="text-[11px] text-stone-400">Klik gambar untuk mengeja dan membaca bunyinya!</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          {READING_CARDS.map((card) => {
            const isSelected = selectedCard.id === card.id;
            const isDone = completedCardIds.includes(card.id);

            return (
              <motion.div
                key={card.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCardClick(card)}
                className={`p-3 rounded-2xl flex flex-col items-center justify-between text-center cursor-pointer border-3 transition-all relative ${
                  isSelected
                    ? 'panel-purple-crypt border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] scale-105'
                    : 'panel-wood border-amber-800/80 hover:border-amber-500'
                }`}
              >
                {isDone && (
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-black shadow">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <span className="text-4xl sm:text-5xl my-1 drop-shadow-md">{card.emoji}</span>
                <span className="font-horror text-sm sm:text-base text-yellow-300 tracking-wider">
                  {card.word}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE WORD READING DISPLAY BOARD */}
      <div className="panel-stone rounded-3xl p-5 sm:p-7 border-4 border-amber-600/80 shadow-2xl text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-5xl sm:text-6xl animate-bounce">{selectedCard.emoji}</span>
        </div>

        {/* Syllables breakdown */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {selectedCard.syllables.map((syl, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-xl bg-purple-950 border border-purple-500 text-yellow-300 font-horror text-lg sm:text-xl"
            >
              {syl}
            </span>
          ))}
        </div>

        {/* Letter by Letter Highlights */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 my-4 flex-wrap">
          {selectedCard.letters.map((letter, idx) => {
            const isHighlight = activeLetterIdx === idx;
            const isVowel = VOWELS.includes(letter);

            return (
              <motion.div
                key={idx}
                animate={isHighlight ? { scale: [1, 1.25, 1], y: [0, -8, 0] } : {}}
                className={`w-11 h-13 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black font-horror transition-all border-3 ${
                  isHighlight
                    ? 'bg-yellow-400 text-slate-950 border-white shadow-[0_0_20px_#facc15]'
                    : isVowel
                    ? 'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-500'
                    : 'bg-slate-900 text-stone-200 border-stone-700'
                }`}
              >
                {letter}
              </motion.div>
            );
          })}
        </div>

        {/* Full Spoken Word Button */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              sound.speakIndonesian(`${selectedCard.letters.join(' ')}. ${selectedCard.word}!`);
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-horror text-base sm:text-lg tracking-wider border-2 border-yellow-300 shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Volume2 className="w-5 h-5 text-amber-300" />
            <span>DENGARKAN BACAAN: "{selectedCard.word}"</span>
          </button>
        </div>
      </div>

      {/* MISSION & ALL ADVENTURE COMPLETE MODAL */}
      <AnimatePresence>
        {isAllDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="panel-wood max-w-md w-full p-6 sm:p-8 rounded-3xl border-4 border-yellow-400 text-center shadow-[0_0_60px_rgba(234,179,8,0.7)]"
            >
              <div className="text-6xl animate-bounce mb-2">🏆👻✨</div>
              <h3 className="text-3xl sm:text-4xl font-black font-horror text-yellow-300 tracking-wider">
                MISSION COMPLETE!
              </h3>
              <p className="text-sm sm:text-base text-amber-100 mt-2 font-kids">
                HEBAT! Kamu berhasil menyelesaikan SEMUA kata dan huruf vokal dengan luar biasa!
              </p>

              {/* Stars */}
              <div className="flex justify-center gap-2 my-4">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className="w-10 h-10 fill-yellow-400 text-yellow-500 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]"
                  />
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-950 to-amber-950 border-2 border-yellow-400 rounded-2xl py-3 px-4 mb-6">
                <span className="text-xs text-yellow-300 font-bold block">BONUS PENYELESAIAN:</span>
                <span className="text-2xl font-horror text-emerald-300">+100 POIN JUARA! 🎖️</span>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onFinishAdventure();
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-horror text-xl sm:text-2xl tracking-wider border-3 border-white shadow-[0_0_30px_rgba(250,204,21,0.8)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 animate-gentle-pulse"
              >
                <Trophy className="w-6 h-6" />
                <span>LIHAT SERTIFIKAT JUARA!</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
