import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Printer, RotateCcw, Home, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { GameState } from '../types';
import { CHARACTERS, CharacterSvg } from './HorrorCharacters';
import { sound } from '../utils/audio';

interface Props {
  state: GameState;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const VictoryCertificate: React.FC<Props> = ({ state, onPlayAgain, onGoHome }) => {
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const character = CHARACTERS.find((c) => c.id === state.player?.characterId) || CHARACTERS[0];
  const currentDate = state.completionDate || new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 text-center">
      {/* Victory Congratulation Banner */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="panel-wood rounded-3xl p-6 sm:p-10 border-4 border-yellow-400 shadow-2xl relative mb-8"
      >
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-yellow-400/20 border border-yellow-400 text-yellow-300 text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>PETUALANG JUARA SEJATI TK A</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black font-horror text-yellow-300 tracking-wider">
          SELAMAT!
        </h1>
        <p className="text-lg sm:text-2xl font-black text-amber-200 mt-2 font-kids max-w-xl mx-auto leading-snug">
          KAMU TELAH MENYELESAIKAN SEMUA MISI DENGAN HEBAT!
        </p>

        {/* Character & Player Badge */}
        <div className="my-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-purple-950/80 border-4 border-yellow-400 p-2 flex items-center justify-center shadow-xl glow-gold">
            <CharacterSvg id={character.id} size={90} />
          </div>

          <div className="text-center sm:text-left">
            <span className="text-xs text-stone-300 font-bold uppercase block">Pemain Hebat:</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-horror tracking-wide">
              {state.player?.name || 'Petualang Cilik'}
            </h2>
            <div className="flex items-center justify-center sm:justify-start gap-1 text-sm font-bold text-amber-400 font-kids mt-0.5">
              <span>{character.emoji}</span>
              <span>{character.title}</span>
            </div>
          </div>
        </div>

        {/* Score & Stars Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto my-6">
          <div className="bg-slate-900/90 border-2 border-yellow-500/70 p-3 rounded-2xl">
            <span className="text-xs text-stone-400 font-bold block uppercase">Bintang ⭐</span>
            <span className="text-2xl sm:text-3xl font-horror text-yellow-400">{state.stars}</span>
          </div>

          <div className="bg-slate-900/90 border-2 border-emerald-500/70 p-3 rounded-2xl">
            <span className="text-xs text-stone-400 font-bold block uppercase">Total Skor 🏆</span>
            <span className="text-2xl sm:text-3xl font-horror text-emerald-400">{state.score}</span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-900/90 border-2 border-purple-500/70 p-3 rounded-2xl">
            <span className="text-xs text-stone-400 font-bold block uppercase">Badge 🎖️</span>
            <span className="text-lg sm:text-xl font-horror text-purple-300">MASTER HOROR</span>
          </div>
        </div>

        {/* Progress Checklist: MISSION 1 ✓ - 5 ✓ */}
        <div className="bg-purple-950/70 border-2 border-purple-600/60 p-4 rounded-2xl max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-2">
            STATUS MISI TERSELESAIKAN:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left text-xs sm:text-sm font-bold text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>MISSION 1: Cari Pasangan Hantu ✓</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>MISSION 2: Misi Dracula (Labirin) ✓</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>MISSION 3: Tebalkan Garis Zombie ✓</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>MISSION 4: Tebalkan Huruf & Angka ✓</span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>MISSION 5: Belajar Membaca Fonik ✓</span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 no-print">
          <button
            onClick={() => {
              sound.playClick();
              setShowCertificateModal(true);
            }}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-horror text-base sm:text-lg tracking-wider border-2 border-white shadow-[0_0_25px_rgba(250,204,21,0.7)] flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Trophy className="w-5 h-5" />
            <span>📜 LIHAT SERTIFIKAT</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-3.5 rounded-2xl bg-indigo-900 hover:bg-indigo-800 border-2 border-indigo-400 text-indigo-100 font-bold text-sm sm:text-base flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg"
          >
            <Printer className="w-5 h-5 text-indigo-300" />
            <span>⬇ SIMPAN / CETAK SERTIFIKAT</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="px-5 py-3.5 rounded-2xl bg-stone-800 hover:bg-stone-700 border-2 border-stone-600 text-stone-200 font-bold text-sm sm:text-base flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-5 h-5 text-amber-400" />
            <span>🔄 MAIN LAGI</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="px-5 py-3.5 rounded-2xl bg-purple-950 hover:bg-purple-900 border-2 border-purple-500 text-purple-200 font-bold text-sm sm:text-base flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Home className="w-5 h-5 text-purple-300" />
            <span>🏠 MENU UTAMA</span>
          </button>
        </div>
      </motion.div>

      {/* THE OFFICIAL PRINTABLE CERTIFICATE CARD / MODAL */}
      <div
        className={`print-certificate max-w-2xl mx-auto rounded-3xl p-6 sm:p-10 border-8 border-amber-800 shadow-2xl relative text-slate-900 ${
          showCertificateModal ? 'block' : 'hidden print:block'
        }`}
        style={{
          background: 'radial-gradient(circle at center, #fefce8 0%, #fef3c7 70%, #fde68a 100%)',
        }}
      >
        {/* Certificate Spooky Frame Ornaments */}
        <div className="absolute top-3 left-4 text-3xl opacity-75">🕸️</div>
        <div className="absolute top-3 right-4 text-3xl opacity-75">🕸️</div>
        <div className="absolute bottom-3 left-4 text-3xl opacity-75">🦇</div>
        <div className="absolute bottom-3 right-4 text-3xl opacity-75">🦇</div>

        {/* Certificate Header */}
        <div className="border-b-2 border-amber-900/30 pb-4 mb-4">
          <div className="text-xs font-black tracking-widest text-amber-900 uppercase font-horror">
            AKADEMI PETUALANG HOROR CILIK TK A
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-horror text-amber-950 tracking-wider mt-1">
            🏆 SERTIFIKAT PEMBELAJARAN
          </h2>
          <p className="text-xs font-bold text-amber-800 tracking-wider">
            "BERANI BELAJAR, BERANI HEBAT!"
          </p>
        </div>

        {/* Certificate Body */}
        <div className="space-y-4 my-6">
          <p className="text-sm sm:text-base text-amber-900 font-medium italic">
            Sertifikat Keberanian dan Kecerdasan ini resmi diberikan kepada:
          </p>

          {/* Player Name Banner */}
          <div className="py-2 border-b-4 border-amber-800 max-w-md mx-auto">
            <span className="text-3xl sm:text-4xl font-black font-horror text-purple-950 tracking-wider">
              {state.player?.name || 'Anak Hebat'}
            </span>
          </div>

          <p className="text-sm sm:text-base text-amber-900 max-w-lg mx-auto leading-relaxed">
            Karena telah berhasil menyelesaikan seluruh tantangan edukasi dalam petualangan:
          </p>

          <div className="text-xl sm:text-2xl font-black font-horror text-red-900 tracking-wide">
            "KIDS HORROR ADVENTURE"
          </div>

          <p className="text-xs text-amber-800">
            Menguasai daya ingat peti hantu, labirin Dracula, motorik halus garis zombie, pengenalan
            huruf A-E & angka 1-5, serta fonik kata membaca.
          </p>
        </div>

        {/* Certificate Badges & Seal */}
        <div className="pt-4 border-t-2 border-amber-900/30 flex items-center justify-between px-4 sm:px-8">
          {/* Left: Date */}
          <div className="text-left">
            <span className="text-[11px] text-amber-800 font-bold block">Tanggal Terbit:</span>
            <span className="text-xs sm:text-sm font-black text-amber-950">{currentDate}</span>
          </div>

          {/* Center: Character Stamp */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-amber-200 border-2 border-amber-800 flex items-center justify-center shadow-inner">
              <CharacterSvg id={character.id} size={45} />
            </div>
            <span className="text-[10px] font-bold text-amber-900 mt-0.5">{character.name}</span>
          </div>

          {/* Right: Golden Seal */}
          <div className="text-right">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-3 border-amber-700 flex flex-col items-center justify-center text-amber-950 shadow-md ml-auto">
              <Award className="w-5 h-5 stroke-[2.5]" />
              <span className="text-[8px] font-black tracking-tighter">OFFICIAL</span>
            </div>
            <span className="text-[10px] font-bold text-amber-900 block mt-0.5">TERVERIFIKASI</span>
          </div>
        </div>

        {/* Modal Close Button for on-screen viewing */}
        {showCertificateModal && (
          <div className="mt-6 flex justify-center gap-3 no-print">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-md flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sertifikat Ini</span>
            </button>
            <button
              onClick={() => setShowCertificateModal(false)}
              className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm"
            >
              Tutup Tampilan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
