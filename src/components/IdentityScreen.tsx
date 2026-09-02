import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, AlertCircle } from 'lucide-react';
import { CharacterId, PlayerProfile } from '../types';
import { CHARACTERS, CharacterSvg } from './HorrorCharacters';
import { sound } from '../utils/audio';

interface Props {
  onSaveProfile: (profile: PlayerProfile) => void;
  initialName?: string;
  initialCharacter?: CharacterId;
}

export const IdentityScreen: React.FC<Props> = ({
  onSaveProfile,
  initialName = '',
  initialCharacter,
}) => {
  const [name, setName] = useState(initialName);
  const [selectedChar, setSelectedChar] = useState<CharacterId | null>(initialCharacter || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectChar = (id: CharacterId) => {
    sound.playClick();
    setSelectedChar(id);
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      sound.playWrong();
      setErrorMsg('Tolong ketik nama kamu dulu ya! 🎃');
      return;
    }
    if (!selectedChar) {
      sound.playWrong();
      setErrorMsg('Pilih salah satu karakter horor lucumu di bawah! 👻');
      return;
    }

    sound.playCorrect();
    onSaveProfile({
      name: name.trim(),
      characterId: selectedChar,
    });
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full panel-stone rounded-3xl p-6 sm:p-10 shadow-2xl relative border-4 border-amber-600/70"
      >
        {/* Header Ribbon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500 text-purple-200 text-xs font-bold tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>IDENTITAS PETUALANG CILIK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-horror text-yellow-300 tracking-wide">
            MASUKKAN NAMA PEMAIN
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-1 font-medium">
            Siapa namamu dan siapa jagoan horor favoritmu hari ini?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-bold text-amber-300 mb-2 text-center uppercase tracking-wider">
              Nama Pemain
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                maxLength={20}
                placeholder="Ketik nama kamu..."
                className="w-full text-center px-6 py-4 rounded-2xl bg-slate-900/90 border-3 border-amber-500/80 text-xl sm:text-2xl font-black text-amber-300 placeholder-stone-500 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/30 transition-all"
              />
            </div>
          </div>

          {/* Character Selection */}
          <div>
            <div className="text-center mb-4">
              <span className="text-base sm:text-lg font-horror text-amber-300 tracking-wider">
                PILIH KARAKTER HOROR
              </span>
              <p className="text-xs text-stone-400">Klik salah satu karakter di bawah:</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {CHARACTERS.map((char) => {
                const isSelected = selectedChar === char.id;
                return (
                  <motion.div
                    key={char.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleSelectChar(char.id)}
                    className={`relative cursor-pointer rounded-2xl p-3 sm:p-4 text-center transition-all flex flex-col items-center justify-between border-4 ${
                      isSelected
                        ? 'bg-gradient-to-b from-purple-900 to-indigo-950 border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.6)] scale-105'
                        : 'bg-slate-900/80 border-stone-700 hover:border-amber-600/70 hover:bg-slate-800/80'
                    }`}
                  >
                    {/* Selected Checkmark Badge */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center shadow-lg border-2 border-slate-950 font-black"
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                      </motion.div>
                    )}

                    {/* Character SVG */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center my-1">
                      <CharacterSvg id={char.id} size={85} />
                    </div>

                    <div className="mt-2">
                      <div className="text-base sm:text-lg font-black text-amber-300 font-kids">
                        {char.emoji} {char.name}
                      </div>
                      <div className="text-[11px] text-stone-300 leading-snug line-clamp-2 mt-0.5">
                        {char.title}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Validation message */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-rose-400 bg-rose-950/60 border border-rose-600/60 p-3 rounded-xl text-sm font-bold text-center"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Submit Big Button */}
          <div className="pt-2 text-center">
            <button
              type="submit"
              className="w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-5 min-h-[52px] rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-horror text-xl sm:text-2xl tracking-wider shadow-[0_0_25px_rgba(225,29,72,0.6)] border-3 border-yellow-300 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto"
            >
              <span>🩸 MULAI PETUALANGAN</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
