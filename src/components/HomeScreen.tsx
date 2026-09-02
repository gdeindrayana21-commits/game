import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Volume2, VolumeX, Music } from 'lucide-react';
import { CharacterSvg } from './HorrorCharacters';
import { sound } from '../utils/audio';

interface Props {
  onStart: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const HomeScreen: React.FC<Props> = ({
  onStart,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
}) => {
  return (
    <div className="relative z-10 min-h-screen flex flex-col justify-between items-center px-4 py-6 md:py-10 max-w-5xl mx-auto text-center">
      {/* Top Bar on Home: Sound & Music switches */}
      <div className="w-full flex justify-end items-center gap-3">
        <button
          onClick={() => {
            sound.playClick();
            onToggleMusic();
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border-2 font-bold text-sm shadow-lg transition-all active:scale-95 ${
            musicEnabled
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
              : 'bg-stone-900/80 border-stone-700 text-stone-500'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>MUSIK: {musicEnabled ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onToggleSound();
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border-2 font-bold text-sm shadow-lg transition-all active:scale-95 ${
            soundEnabled
              ? 'bg-amber-950/80 border-amber-500 text-amber-300'
              : 'bg-stone-900/80 border-stone-700 text-stone-500'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>SUARA: {soundEnabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Main Title Section */}
      <div className="my-auto py-4 flex flex-col items-center">
        {/* Playful Taglines */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-purple-950/80 border-2 border-purple-500/70 text-purple-200 text-xs md:text-sm font-extrabold tracking-widest uppercase mb-3 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>BELAJAR SAMBIL BERMAIN • BERANI COBA?</span>
        </motion.div>

        {/* Big Game Title */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black font-horror tracking-wider leading-none text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-400 to-orange-600 drop-shadow-[0_8px_15px_rgba(0,0,0,0.9)]">
            KIDS
            <br />
            HORROR
            <br />
            ADVENTURE
          </h1>
          <div className="mt-2 text-base sm:text-xl md:text-2xl font-black text-amber-300 tracking-wide font-kids">
            "BERANI BELAJAR, BERANI HEBAT!"
          </div>
        </motion.div>

        {/* Animated 4 Characters Showcase */}
        <div className="mt-6 sm:mt-10 grid grid-cols-4 gap-2 sm:gap-6 max-w-xl w-full">
          {/* Dracula */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center p-1 rounded-2xl bg-gradient-to-b from-red-950/60 to-purple-950/60 border-2 border-red-500/50 shadow-lg">
              <CharacterSvg id="dracula" size={85} />
            </div>
            <span className="mt-1.5 text-xs font-bold text-red-400 tracking-wider">DRACULA</span>
          </motion.div>

          {/* Zombie */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center p-1 rounded-2xl bg-gradient-to-b from-emerald-950/60 to-slate-950/60 border-2 border-emerald-500/50 shadow-lg">
              <CharacterSvg id="zombie" size={85} />
            </div>
            <span className="mt-1.5 text-xs font-bold text-emerald-400 tracking-wider">ZOMBIE</span>
          </motion.div>

          {/* Hantu */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center p-1 rounded-2xl bg-gradient-to-b from-purple-950/60 to-indigo-950/60 border-2 border-purple-500/50 shadow-lg">
              <CharacterSvg id="hantu" size={85} />
            </div>
            <span className="mt-1.5 text-xs font-bold text-purple-300 tracking-wider">HANTU</span>
          </motion.div>

          {/* Skeleton */}
          <motion.div
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center p-1 rounded-2xl bg-gradient-to-b from-amber-950/60 to-stone-950/60 border-2 border-amber-500/50 shadow-lg">
              <CharacterSvg id="skeleton" size={85} />
            </div>
            <span className="mt-1.5 text-xs font-bold text-amber-300 tracking-wider">SKELETON</span>
          </motion.div>
        </div>

        {/* Big Adventure Play Button */}
        <motion.div
          className="mt-8 sm:mt-12"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={() => {
              sound.playClick();
              sound.startSpookyMusic();
              onStart();
            }}
            className="px-8 sm:px-14 py-4 sm:py-5 min-h-[56px] rounded-3xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-slate-950 font-horror text-2xl sm:text-3xl tracking-wider shadow-[0_0_35px_rgba(239,68,68,0.6)] border-4 border-yellow-300 flex items-center gap-3 mx-auto transition-all cursor-pointer animate-gentle-pulse"
          >
            <Play className="w-8 h-8 fill-slate-950" />
            <span>MULAI PETUALANGAN!</span>
          </button>
        </motion.div>
      </div>

      {/* Footer text */}
      <div className="text-xs text-stone-400/80 font-medium">
        🦇 Game Edukasi Ramah Anak TK A • Belajar Mengenal Karakter, Labirin, Motorik Halus & Membaca
      </div>
    </div>
  );
};
