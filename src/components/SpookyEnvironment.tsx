import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CharacterSvg } from './HorrorCharacters';

interface Props {
  triggerJumpscare?: boolean;
  onJumpscareEnd?: () => void;
  jumpscareEnabled?: boolean;
}

export const SpookyEnvironment: React.FC<Props> = ({
  triggerJumpscare = false,
  onJumpscareEnd,
  jumpscareEnabled = true,
}) => {
  const [showBoo, setShowBoo] = useState(false);
  const [lightning, setLightning] = useState(false);

  // Trigger gentle lightning occasionally (every 18-25 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setLightning(true);
      setTimeout(() => setLightning(false), 200);
      setTimeout(() => {
        setLightning(true);
        setTimeout(() => setLightning(false), 120);
      }, 350);
    }, 22000);
    return () => clearInterval(timer);
  }, []);

  // Child-friendly jumpscare trigger
  useEffect(() => {
    if (triggerJumpscare && jumpscareEnabled) {
      setShowBoo(true);
      const t = setTimeout(() => {
        setShowBoo(false);
        if (onJumpscareEnd) onJumpscareEnd();
      }, 800);
      return () => clearTimeout(t);
    }
  }, [triggerJumpscare, jumpscareEnabled, onJumpscareEnd]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Gentle Lightning Flash */}
      {lightning && (
        <div className="absolute inset-0 bg-indigo-200/20 backdrop-brightness-150 transition-opacity duration-100 z-50 pointer-events-none" />
      )}

      {/* Spooky Moon in Top Corner */}
      <div className="absolute top-4 right-6 md:top-8 md:right-14 w-24 h-24 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-amber-200 to-yellow-100 shadow-[0_0_60px_rgba(251,191,36,0.35)] opacity-85">
        {/* Moon craters */}
        <div className="absolute top-6 left-5 w-5 h-5 rounded-full bg-amber-300/40" />
        <div className="absolute top-12 left-10 w-7 h-7 rounded-full bg-amber-300/30" />
        <div className="absolute top-8 right-6 w-4 h-4 rounded-full bg-amber-300/35" />
      </div>

      {/* Flying bats */}
      <div className="absolute top-12 left-[10%] animate-flutter-bat opacity-60">
        <svg viewBox="0 0 100 60" width="38" height="24">
          <path d="M 50 40 Q 25 10 0 25 Q 15 45 40 40 Q 50 55 60 40 Q 85 45 100 25 Q 75 10 50 40 Z" fill="#312e81" />
        </svg>
      </div>

      <div className="absolute top-24 left-[45%] animate-flutter-bat opacity-45 delay-700">
        <svg viewBox="0 0 100 60" width="28" height="18">
          <path d="M 50 40 Q 25 10 0 25 Q 15 45 40 40 Q 50 55 60 40 Q 85 45 100 25 Q 75 10 50 40 Z" fill="#1e1b4b" />
        </svg>
      </div>

      <div className="absolute top-8 right-[28%] animate-flutter-bat opacity-70 delay-1000">
        <svg viewBox="0 0 100 60" width="44" height="28">
          <path d="M 50 40 Q 25 10 0 25 Q 15 45 40 40 Q 50 55 60 40 Q 85 45 100 25 Q 75 10 50 40 Z" fill="#4338ca" />
        </svg>
      </div>

      {/* Floating friendly ghost in background */}
      <div className="absolute bottom-24 right-8 md:right-24 animate-float-ghost opacity-25 hidden md:block">
        <CharacterSvg id="hantu" size={110} />
      </div>

      {/* Spooky old twisted trees silhouettes at bottom edges */}
      <div className="absolute bottom-0 left-0 w-48 md:w-72 h-40 opacity-30 pointer-events-none">
        <svg viewBox="0 0 300 200" className="w-full h-full" preserveAspectRatio="none">
          <path d="M 0 200 L 0 80 Q 20 50 40 90 Q 60 120 70 80 Q 90 40 60 20 Q 85 30 90 70 Q 110 50 125 30 Q 120 65 100 110 Q 140 90 160 80 Q 130 130 95 150 L 120 200 Z" fill="#090d16" />
        </svg>
      </div>

      <div className="absolute bottom-0 right-0 w-48 md:w-72 h-40 opacity-30 pointer-events-none transform scale-x-[-1]">
        <svg viewBox="0 0 300 200" className="w-full h-full" preserveAspectRatio="none">
          <path d="M 0 200 L 0 80 Q 20 50 40 90 Q 60 120 70 80 Q 90 40 60 20 Q 85 30 90 70 Q 110 50 125 30 Q 120 65 100 110 Q 140 90 160 80 Q 130 130 95 150 L 120 200 Z" fill="#090d16" />
        </svg>
      </div>

      {/* Drifting fog layers */}
      <div className="absolute -bottom-10 inset-x-0 h-36 bg-gradient-to-t from-purple-950/40 via-indigo-950/20 to-transparent blur-xl pointer-events-none" />
      <div className="absolute bottom-0 w-[140%] -left-[20%] h-24 bg-gradient-to-t from-slate-950/60 to-transparent animate-fog-drift pointer-events-none" />

      {/* JUMPSCARE OVERLAY: 100% Kid-Friendly Cartoon "BOO!" Peek-a-boo */}
      <AnimatePresence>
        {showBoo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.4, x: 200, y: 100 }}
            animate={{ opacity: 1, scale: 1.15, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -100 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto bg-black/40 backdrop-blur-xs"
          >
            <div className="relative flex flex-col items-center bg-purple-900/90 border-4 border-yellow-400 p-8 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.7)] text-center animate-bounce">
              <div className="w-36 h-36 flex items-center justify-center filter drop-shadow-[0_0_20px_#a855f7]">
                <CharacterSvg id="hantu" size={140} />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-yellow-300 font-horror tracking-wider mt-2">
                👻 B O O ! 👻
              </h2>
              <p className="text-xl font-bold text-white mt-1 font-kids">
                Cilukba! Jangan takut ya! Hehehe!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
