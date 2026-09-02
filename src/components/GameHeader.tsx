import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Home, ArrowLeft, HelpCircle, Star, Award, Ghost } from 'lucide-react';
import { GameState } from '../types';
import { CharacterSvg } from './HorrorCharacters';
import { sound } from '../utils/audio';

interface Props {
  state: GameState;
  onNavigateHome: () => void;
  onNavigateBack: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onToggleJumpscare: () => void;
  showBack?: boolean;
}

export const GameHeader: React.FC<Props> = ({
  state,
  onNavigateHome,
  onNavigateBack,
  onToggleSound,
  onToggleMusic,
  onToggleJumpscare,
  showBack = false,
}) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <header className="relative z-30 w-full px-3 py-2 md:px-6 md:py-3 flex flex-wrap items-center justify-between gap-2 border-b-2 border-amber-900/60 bg-slate-950/85 backdrop-blur-md">
        {/* Left Side: Navigation buttons & Player Info */}
        <div className="flex items-center gap-2 md:gap-3">
          {showBack && (
            <button
              onClick={() => {
                sound.playClick();
                onNavigateBack();
              }}
              className="px-3 py-2 min-h-[44px] flex items-center gap-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 border-2 border-purple-500 text-yellow-300 font-bold text-sm shadow-md transition-all active:scale-95"
              title="Kembali"
            >
              <ArrowLeft className="w-5 h-5 text-yellow-300" />
              <span className="hidden sm:inline">KEMBALI</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onNavigateHome();
            }}
            className="px-3 py-2 min-h-[44px] flex items-center gap-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 border-2 border-amber-600/70 text-amber-200 font-bold text-sm shadow-md transition-all active:scale-95"
            title="Menu Utama"
          >
            <Home className="w-5 h-5 text-amber-400" />
            <span className="hidden sm:inline">MENU</span>
          </button>

          {/* Player Badge */}
          {state.player && (
            <div className="flex items-center gap-2 bg-purple-950/70 border-2 border-purple-600/60 px-3 py-1 rounded-2xl shadow-inner">
              <div className="w-8 h-8 flex items-center justify-center">
                <CharacterSvg id={state.player.characterId} size={30} />
              </div>
              <div className="leading-tight">
                <span className="text-xs text-purple-300 block font-semibold">Pemain:</span>
                <span className="text-sm font-extrabold text-amber-300 tracking-wide truncate max-w-[100px] md:max-w-[140px] block">
                  {state.player.name}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Flickering candle icon + Game Logo mini */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Candle */}
          <div className="flex flex-col items-center animate-flicker-candle">
            <div className="w-2.5 h-3.5 bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 rounded-full" />
            <div className="w-3 h-5 bg-amber-100 rounded-t-sm shadow-sm" />
          </div>
          <span className="font-horror text-amber-400 text-lg tracking-wider">
            KIDS HORROR ADVENTURE
          </span>
        </div>

        {/* Right Side: Score, Stars & Control Toggles */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Stars & Score pill */}
          <div className="flex items-center gap-2 bg-stone-900/90 border-2 border-amber-600/60 px-2.5 py-1.5 rounded-xl text-xs md:text-sm font-bold">
            <div className="flex items-center gap-1 text-yellow-400" title="Bintang">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
              <span>{state.stars}</span>
            </div>
            <span className="text-stone-600">|</span>
            <div className="flex items-center gap-1 text-emerald-400" title="Skor">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>{state.score}</span>
            </div>
          </div>

          {/* Jumpscare Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleJumpscare();
            }}
            className={`p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border-2 transition-all active:scale-95 ${
              state.jumpscareEnabled
                ? 'bg-purple-900/90 border-purple-400 text-purple-200'
                : 'bg-stone-800/80 border-stone-600 text-stone-500'
            }`}
            title={`Jumpscare Lucu: ${state.jumpscareEnabled ? 'ON' : 'OFF'}`}
          >
            <Ghost className="w-5 h-5" />
          </button>

          {/* Music Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleMusic();
            }}
            className={`p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border-2 transition-all active:scale-95 ${
              state.musicEnabled
                ? 'bg-emerald-900/90 border-emerald-400 text-emerald-300'
                : 'bg-stone-800/80 border-stone-600 text-stone-500'
            }`}
            title={`Musik: ${state.musicEnabled ? 'ON' : 'OFF'}`}
          >
            <Music className="w-5 h-5" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            className={`p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border-2 transition-all active:scale-95 ${
              state.soundEnabled
                ? 'bg-amber-900/90 border-amber-400 text-amber-300'
                : 'bg-stone-800/80 border-stone-600 text-stone-500'
            }`}
            title={`Suara: ${state.soundEnabled ? 'ON' : 'OFF'}`}
          >
            {state.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Petunjuk / Help */}
          <button
            onClick={() => {
              sound.playClick();
              setShowHelp(true);
            }}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-blue-900/80 hover:bg-blue-800 border-2 border-blue-400 text-blue-200 transition-all active:scale-95"
            title="Petunjuk Permainan"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="panel-stone max-w-lg w-full p-6 rounded-3xl text-slate-100 relative">
            <div className="flex items-center justify-between pb-3 border-b border-stone-700">
              <h3 className="text-2xl font-horror text-yellow-400 flex items-center gap-2">
                <span>🦇</span> PETUNJUK PETUALANGAN
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="w-10 h-10 rounded-full bg-red-900/80 border border-red-500 text-white font-bold flex items-center justify-center hover:bg-red-800"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm md:text-base leading-relaxed text-slate-200">
              <div className="p-3 bg-purple-950/60 rounded-xl border border-purple-800/60">
                <p className="font-bold text-yellow-300 mb-1">🎯 5 Misi Horor Edukasi:</p>
                <ul className="space-y-1 list-disc list-inside text-slate-300 text-sm">
                  <li><strong className="text-white">Misi 1:</strong> Buka peti mati dan cari pasangan gambar!</li>
                  <li><strong className="text-white">Misi 2:</strong> Arahkan Dracula melewati labirin menuju kastil!</li>
                  <li><strong className="text-white">Misi 3:</strong> Tebalkan garis putus-putus sampai ke otak zombie!</li>
                  <li><strong className="text-white">Misi 4:</strong> Tebalkan huruf A-E dan angka 1-5 dengan jari/mouse!</li>
                  <li><strong className="text-white">Misi 5:</strong> Sentuh gambar dan dengarkan bunyi kata-kata horor ceria!</li>
                </ul>
              </div>
              <p className="text-emerald-300 font-semibold text-center">
                ✨ Kumpulkan semua bintang dan raih Sertifikat Juara Petualang!
              </p>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-5 w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-lg rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              SIAP BERMAIN! 🎮
            </button>
          </div>
        </div>
      )}
    </>
  );
};
