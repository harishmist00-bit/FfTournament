/** Original fictional operative illustration (vector). Not based on any existing game artwork. */
export function HeroArt() {
  return (
    <svg viewBox="0 0 560 600" className="h-full w-full" role="img" aria-label="Illustration of a masked esports operative in a neon green jacket">
      <defs>
        <radialGradient id="aura" cx="50%" cy="45%" r="55%"><stop offset="0" stopColor="#39FF14" stopOpacity=".55" /><stop offset="1" stopColor="#39FF14" stopOpacity="0" /></radialGradient>
        <linearGradient id="jacket" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#10261f" /><stop offset="1" stopColor="#040b09" /></linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <circle cx="290" cy="280" r="260" fill="url(#aura)" />
      <g fill="none" stroke="#39FF14" strokeOpacity=".35"><circle cx="290" cy="280" r="215" /><circle cx="290" cy="280" r="245" strokeDasharray="6 14" /></g>
      {/* plane */}
      <path d="M430 70l60 14-8 8 40 10-60 6-12 26-8-24-34-4z" fill="#0b1f1a" stroke="#39FF14" strokeOpacity=".6" />
      {/* torso */}
      <path d="M40 600 80 430q40-80 210-92t210 92l40 170z" fill="url(#jacket)" stroke="#39FF14" strokeWidth="2" />
      <path d="M90 600 130 450l60 20-30 130zM490 600 450 450l-60 20 30 130z" fill="#39FF14" opacity=".85" />
      <path d="M250 340 290 600 330 340z" fill="#020706" stroke="#39FF14" strokeOpacity=".6" />
      <path d="M200 380l30 220M380 380l-30 220" stroke="#B7FF00" strokeWidth="3" filter="url(#glow)" />
      {/* hair */}
      <path d="M190 170 210 90l26 50 22-62 26 58 28-52 12 78z" fill="#d8e3de" />
      {/* hood + head */}
      <path d="M180 250q-6-110 110-120t110 120q-12 80-110 96-98-16-110-96z" fill="#0b1b17" stroke="#39FF14" strokeWidth="2" />
      <path d="M215 235q75-34 150 0-6 62-75 78-69-16-75-78z" fill="#020706" />
      {/* visor */}
      <path d="M222 238l136 0-10 22h-116z" fill="#39FF14" filter="url(#glow)" />
      <path d="M240 290h100M250 304h80" stroke="#39FF14" strokeOpacity=".7" strokeWidth="3" />
      {/* rifle */}
      <g filter="url(#glow)"><path d="M420 470 500 250l16 6-78 222z" fill="#0a1613" stroke="#39FF14" strokeWidth="2" /><path d="M500 250l8-30" stroke="#39FF14" strokeWidth="4" /></g>
      <text x="430" y="560" fontFamily="Oxanium" fontWeight="800" fontStyle="italic" fontSize="42" fill="#39FF14" opacity=".9">FF</text>
    </svg>
  );
}
