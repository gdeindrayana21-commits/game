import React from 'react';
import { motion } from 'motion/react';
import { Lock, CheckCircle2, Star, Play, Sparkles } from 'lucide-react';
import { GameState } from '../types';
import { CHARACTERS, CharacterSvg } from './HorrorCharacters';
import { sound } from '../utils/audio';

interface Props {
  state: GameState;
  onSelectMission: (missionNum: number) => void;
  onViewCertificate: () => void;
}

export const MISSIONS_INFO = [
  {
    num: 1,
    title: 'CARI PASANGAN HANTU',
    subtitle: 'Buka peti mati & temukan 5 pasangan karakter yang sama!',
    icon: '⚰️',
    color: 'from-amber-950 via-purple-950 to-slate-900',
    border: 'border-amber-600',
    tag: 'Daya Ingat & Konsentrasi',
  },
  {
    num: 2,
    title: 'MISI DRACULA: LABIRIN',
    subtitle: 'Bantu Dracula menyusuri labirin misterius menuju kastil!',
    icon: '🏰',
    color: 'from-red-950 via-slate-950 to-purple-950',
    border: 'border-red-600',
    tag: 'Spasial & Pemecahan Masalah',
  },
  {
    num: 3,
    title: 'TEBALKAN GARIS',
    subtitle: 'Tarik garis putus-putus sampai ke otak zombie!',
    icon: '🧠',
    color: 'from-emerald-950 via-teal-950 to-slate-950',
    border: 'border-emerald-600',
    tag: 'Motorik Halus Prasekolah',
  },
  {
    num: 4,
    title: 'TEBALKAN HURUF & ANGKA',
    subtitle: 'Ikuti titik-titik huruf A-E dan angka 1-5 dengan jari!',
    icon: '✏️',
    color: 'from-blue-950 via-indigo-950 to-slate-950',
    border: 'border-blue-500',
    tag: 'Pengenalan Literasi & Numerasi',
  },
  {
    num: 5,
    title: 'BELAJAR MEMBACA',
    subtitle: 'Kenali huruf vokal (A, E, I, O, U) dan baca kata horor ceria!',
    icon: '📖',
    color: 'from-fuchsia-950 via-purple-950 to-slate-950',
    border: 'border-fuchsia-500',
    tag: 'Fonik & Kosa Kata',
  },
];

export const MissionSelectScreen: React.FC<Props> = ({
  state,
  onSelectMission,
  onViewCertificate,
}) => {
  const currentChar = CHARACTERS.find((c) => c.id === state.player?.characterId) || CHARACTERS[0];
  const allCompleted = state.completedMissions.length >= 5;

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Hero Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel-wood rounded-3xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-4 border-amber-600/80 shadow-2xl"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-purple-950/80 border-3 border-yellow-400 p-1 flex items-center justify-center flex-shrink-0 shadow-lg">
            <CharacterSvg id={currentChar.id} size={85} />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Petualang Tangguh TK A</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black font-horror text-white tracking-wide">
              {state.player?.name || 'Ksatria Cilik'}
            </h2>
            <p className="text-xs md:text-sm text-stone-300 italic mt-0.5 font-kids">
              "{currentChar.quote}"
            </p>
          </div>
        </div>

        {/* Stats and All Complete Certificate Button */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="bg-slate-950/80 border-2 border-yellow-500/60 px-4 py-2 rounded-2xl text-center">
            <span className="text-xs text-yellow-300 block font-semibold">Bintang</span>
            <div className="flex items-center justify-center gap-1 text-xl font-black text-yellow-400 font-horror">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-500" />
              <span>{state.stars}</span>
            </div>
          </div>

          <div className="bg-slate-950/80 border-2 border-emerald-500/60 px-4 py-2 rounded-2xl text-center">
            <span className="text-xs text-emerald-300 block font-semibold">Total Skor</span>
            <span className="text-xl font-black text-emerald-400 font-horror block">
              {state.score}
            </span>
          </div>

          {allCompleted && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                sound.playClick();
                onViewCertificate();
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-horror text-sm md:text-base font-black shadow-[0_0_20px_rgba(251,191,36,0.6)] border-2 border-white cursor-pointer"
            >
              🏆 LIHAT SERTIFIKAT!
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Encouragement Banner */}
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-horror text-yellow-300 tracking-wider">
          PILIH MISI PETUALANGAN
        </h3>
        <p className="text-xs md:text-sm text-stone-300 font-medium mt-1">
          Selesaikan misi berurutan untuk membuka misteri berikutnya. BERANI COBA? JANGAN TAKUT!
        </p>
      </div>

      {/* 5 Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {MISSIONS_INFO.map((m) => {
          const isUnlocked = m.num <= state.unlockedMission;
          const isDone = state.completedMissions.includes(m.num);

          return (
            <motion.div
              key={m.num}
              whileHover={isUnlocked ? { scale: 1.02 } : {}}
              whileTap={isUnlocked ? { scale: 0.98 } : {}}
              onClick={() => {
                if (isUnlocked) {
                  sound.playClick();
                  onSelectMission(m.num);
                } else {
                  sound.playWrong();
                }
              }}
              className={`relative rounded-3xl p-5 flex flex-col justify-between border-4 transition-all shadow-xl ${
                isUnlocked
                  ? `bg-gradient-to-b ${m.color} ${m.border} cursor-pointer hover:shadow-[0_0_25px_rgba(234,179,8,0.3)]`
                  : 'bg-stone-950/80 border-stone-800 opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Top Tag & Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/40 border border-white/20 text-yellow-300">
                  {m.tag}
                </span>

                {isDone ? (
                  <span className="flex items-center gap-1 text-xs font-black text-emerald-400 bg-emerald-950/90 border border-emerald-500 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SELESAI
                  </span>
                ) : isUnlocked ? (
                  <span className="text-xs font-black text-amber-300 bg-amber-950/80 border border-amber-500 px-2 py-0.5 rounded-full">
                    TERBUKA 🔓
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-stone-500 bg-stone-900 border border-stone-700 px-2 py-0.5 rounded-full">
                    <Lock className="w-3.5 h-3.5" /> TERKUNCI
                  </span>
                )}
              </div>

              {/* Title & Icon */}
              <div className="my-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{m.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-stone-400 block">MISI {m.num}</span>
                    <h4 className="text-lg md:text-xl font-horror text-white leading-tight">
                      {m.title}
                    </h4>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-stone-300 mt-2.5 leading-relaxed font-kids">
                  {m.subtitle}
                </p>
              </div>

              {/* Bottom Action */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      className={`w-4 h-4 ${
                        isDone
                          ? 'fill-yellow-400 text-yellow-500'
                          : 'fill-stone-800 text-stone-700'
                      }`}
                    />
                  ))}
                </div>

                {isUnlocked ? (
                  <span className="flex items-center gap-1 text-xs font-black text-yellow-300 uppercase tracking-wider font-horror">
                    <span>MAIN</span>
                    <Play className="w-4 h-4 fill-yellow-300" />
                  </span>
                ) : (
                  <span className="text-[11px] text-stone-500 italic">Selesaikan Misi {m.num - 1}</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
