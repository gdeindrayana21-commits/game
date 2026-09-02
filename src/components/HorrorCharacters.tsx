import React from 'react';
import { Character, CharacterId } from '../types';

export const CHARACTERS: Character[] = [
  {
    id: 'dracula',
    name: 'DRACULA',
    title: 'Pangeran Vampir Cilik',
    emoji: '🧛',
    quote: 'Aku suka malam hari dan buah stroberi merah!',
    color: 'from-red-950 via-purple-950 to-slate-950',
    accentColor: '#dc2626',
  },
  {
    id: 'zombie',
    name: 'ZOMBIE',
    title: 'Zombie Ceria Pencari Otak Pintar',
    emoji: '🧟',
    quote: 'Aaargh! Belajar bikin otakku makin cerdas!',
    color: 'from-emerald-950 via-teal-950 to-slate-950',
    accentColor: '#10b981',
  },
  {
    id: 'hantu',
    name: 'HANTU',
    title: 'Hantu Glowing Bersahabat',
    emoji: '👻',
    quote: 'Wooo-hooo! Aku bisa terbang melayang santai!',
    color: 'from-purple-950 via-indigo-950 to-slate-950',
    accentColor: '#a855f7',
  },
  {
    id: 'skeleton',
    name: 'SKELETON',
    title: 'Tengkorak Penari Tulang Lucu',
    emoji: '💀',
    quote: 'Klak-klak-klak! Tulangku kuat karena suka minum susu!',
    color: 'from-amber-950 via-stone-900 to-slate-950',
    accentColor: '#eab308',
  },
];

export const CharacterSvg: React.FC<{
  id: CharacterId;
  className?: string;
  size?: number;
}> = ({ id, className = '', size = 120 }) => {
  if (id === 'dracula') {
    return (
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className={`inline-block drop-shadow-xl ${className}`}
      >
        {/* Cape back */}
        <path d="M 40 180 Q 20 80 80 40 L 120 40 Q 180 80 160 180 Z" fill="#7f1d1d" />
        <path d="M 50 180 Q 35 90 85 50 L 115 50 Q 165 90 150 180 Z" fill="#991b1b" />
        
        {/* Collar high vampir */}
        <polygon points="60,60 40,20 85,45" fill="#dc2626" />
        <polygon points="140,60 160,20 115,45" fill="#dc2626" />

        {/* Head */}
        <circle cx="100" cy="85" r="42" fill="#fde047" opacity="0.95" />
        {/* Face skin tone - pale vampir */}
        <ellipse cx="100" cy="85" rx="36" ry="38" fill="#e0e7ff" />

        {/* Widow's peak hair */}
        <path d="M 64 75 Q 85 40 100 65 Q 115 40 136 75 C 136 45 64 45 64 75 Z" fill="#1e1b4b" />

        {/* Eyes big & cute */}
        <ellipse cx="86" cy="82" rx="7" ry="9" fill="#ffffff" />
        <circle cx="87" cy="83" r="5" fill="#dc2626" />
        <circle cx="89" cy="81" r="2" fill="#ffffff" />

        <ellipse cx="114" cy="82" rx="7" ry="9" fill="#ffffff" />
        <circle cx="113" cy="83" r="5" fill="#dc2626" />
        <circle cx="115" cy="81" r="2" fill="#ffffff" />

        {/* Rosy cheeks */}
        <circle cx="78" cy="94" r="5" fill="#fca5a5" opacity="0.6" />
        <circle cx="122" cy="94" r="5" fill="#fca5a5" opacity="0.6" />

        {/* Mouth with cute fangs */}
        <path d="M 88 98 Q 100 112 112 98 Z" fill="#881337" />
        <polygon points="92,98 95,106 97,98" fill="#ffffff" />
        <polygon points="103,98 105,106 108,98" fill="#ffffff" />

        {/* Bow tie / medallion */}
        <circle cx="100" cy="130" r="8" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
        <polygon points="100,130 90,122 90,138" fill="#dc2626" />
        <polygon points="100,130 110,122 110,138" fill="#dc2626" />

        {/* Coat body */}
        <path d="M 75 130 L 125 130 L 135 185 L 65 185 Z" fill="#18181b" />
        <circle cx="100" cy="148" r="3" fill="#eab308" />
        <circle cx="100" cy="162" r="3" fill="#eab308" />
      </svg>
    );
  }

  if (id === 'zombie') {
    return (
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className={`inline-block drop-shadow-xl ${className}`}
      >
        {/* Zombie Head */}
        <rect x="62" y="45" width="76" height="76" rx="20" fill="#4ade80" stroke="#166534" strokeWidth="4" />
        {/* Hair / scruffy tufts */}
        <polygon points="72,45 80,30 88,45" fill="#14532d" />
        <polygon points="95,45 102,28 110,45" fill="#14532d" />
        <polygon points="116,45 124,32 130,45" fill="#14532d" />

        {/* Cute cute stitches on head */}
        <line x1="110" y1="55" x2="130" y2="65" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
        <line x1="114" y1="56" x2="112" y2="64" stroke="#14532d" strokeWidth="2" strokeLinecap="round" />
        <line x1="120" y1="58" x2="118" y2="66" stroke="#14532d" strokeWidth="2" strokeLinecap="round" />
        <line x1="126" y1="61" x2="124" y2="69" stroke="#14532d" strokeWidth="2" strokeLinecap="round" />

        {/* Left eye big spiral / friendly cartoon */}
        <circle cx="82" cy="78" r="12" fill="#fef08a" stroke="#166534" strokeWidth="2" />
        <circle cx="82" cy="78" r="6" fill="#15803d" />
        <circle cx="84" cy="76" r="2" fill="#ffffff" />

        {/* Right eye button X stitch or cute wink */}
        <circle cx="118" cy="78" r="10" fill="#ffffff" stroke="#166534" strokeWidth="2" />
        <circle cx="117" cy="78" r="4" fill="#047857" />
        <circle cx="119" cy="76" r="1.5" fill="#ffffff" />

        {/* Blush spots */}
        <ellipse cx="74" cy="95" rx="6" ry="4" fill="#86efac" />
        <ellipse cx="126" cy="95" rx="6" ry="4" fill="#86efac" />

        {/* Cute mouth with 1 goofy tooth */}
        <path d="M 85 96 Q 100 114 115 96" fill="#14532d" stroke="#166534" strokeWidth="3" />
        <rect x="94" y="96" width="6" height="8" rx="1" fill="#fef9c3" />

        {/* Shirt and body */}
        <path d="M 68 123 L 132 123 L 138 185 L 62 185 Z" fill="#64748b" stroke="#334155" strokeWidth="3" />
        {/* Ripped neck */}
        <polygon points="90,123 100,138 110,123" fill="#4ade80" />
        <polygon points="120,160 135,168 126,178" fill="#475569" />
      </svg>
    );
  }

  if (id === 'hantu') {
    return (
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className={`inline-block drop-shadow-2xl ${className}`}
      >
        {/* Ghost glow aura */}
        <path
          d="M 60 80 C 60 35 140 35 140 80 C 140 130 148 145 130 170 Q 115 185 100 168 Q 85 185 70 170 C 52 145 60 130 60 80 Z"
          fill="#c084fc"
          opacity="0.35"
          filter="blur(6px)"
        />

        {/* Main Ghost Body */}
        <path
          d="M 64 80 C 64 40 136 40 136 80 C 136 125 142 145 128 165 Q 115 178 100 162 Q 85 178 72 165 C 58 145 64 125 64 80 Z"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="3"
        />

        {/* Cute floating ghost arms */}
        <path d="M 65 95 Q 40 85 48 105 Q 58 115 65 105" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M 135 95 Q 160 85 152 105 Q 142 115 135 105" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />

        {/* Big sparkling dark purple eyes */}
        <ellipse cx="86" cy="82" rx="7" ry="10" fill="#3b0764" />
        <circle cx="89" cy="79" r="3" fill="#ffffff" />
        <circle cx="85" cy="85" r="1.5" fill="#ffffff" />

        <ellipse cx="114" cy="82" rx="7" ry="10" fill="#3b0764" />
        <circle cx="117" cy="79" r="3" fill="#ffffff" />
        <circle cx="113" cy="85" r="1.5" fill="#ffffff" />

        {/* Rosy glowing cheeks */}
        <ellipse cx="78" cy="92" rx="6" ry="4" fill="#f472b6" opacity="0.6" />
        <ellipse cx="122" cy="92" rx="6" ry="4" fill="#f472b6" opacity="0.6" />

        {/* Cute happy open mouth "O" */}
        <ellipse cx="100" cy="95" rx="6" ry="8" fill="#581c87" />
        <ellipse cx="100" cy="98" rx="4" ry="3" fill="#ec4899" />
      </svg>
    );
  }

  // Skeleton default
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`inline-block drop-shadow-xl ${className}`}
    >
      {/* Pirate/Spooky Mini Hat */}
      <ellipse cx="100" cy="45" rx="45" ry="10" fill="#4c1d95" />
      <path d="M 70 45 L 80 20 L 120 20 L 130 45 Z" fill="#6d28d9" stroke="#8b5cf6" strokeWidth="2" />
      <circle cx="100" cy="32" r="5" fill="#fbbf24" />

      {/* Skull Head */}
      <path
        d="M 65 85 C 65 50 135 50 135 85 C 135 110 125 112 118 116 L 118 128 L 82 128 L 82 116 C 75 112 65 110 65 85 Z"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="4"
      />

      {/* Big cartoon eye sockets */}
      <circle cx="84" cy="84" r="11" fill="#0f172a" />
      <circle cx="86" cy="82" r="4" fill="#fbbf24" />

      <circle cx="116" cy="84" r="11" fill="#0f172a" />
      <circle cx="114" cy="82" r="4" fill="#fbbf24" />

      {/* Inverted heart nose cavity */}
      <path d="M 96 98 L 100 92 L 104 98 Z" fill="#0f172a" />

      {/* Teeth grinning cute */}
      <rect x="85" y="112" width="6" height="10" rx="2" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
      <rect x="92" y="112" width="6" height="10" rx="2" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
      <rect x="99" y="112" width="6" height="10" rx="2" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
      <rect x="106" y="112" width="6" height="10" rx="2" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />

      {/* Ribs & spine */}
      <line x1="100" y1="130" x2="100" y2="185" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
      {/* Rib 1 */}
      <path d="M 75 145 Q 100 152 125 145" fill="none" stroke="#f1f5f9" strokeWidth="5" strokeLinecap="round" />
      {/* Rib 2 */}
      <path d="M 72 160 Q 100 168 128 160" fill="none" stroke="#f1f5f9" strokeWidth="5" strokeLinecap="round" />
      {/* Rib 3 */}
      <path d="M 80 175 Q 100 182 120 175" fill="none" stroke="#f1f5f9" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
};
