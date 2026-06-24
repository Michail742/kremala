function Classic({ g }) {
  return <>
    <rect {...g(6)} className="c-skin c-out" x="76" y="182" width="14" height="38" rx="7"/>
    <rect {...g(6)} className="c-skin c-out" x="98" y="182" width="14" height="38" rx="7"/>
    <path {...g(5)} className="c-line" d="M130 126 q26 -2 34 -22"/>
    <path {...g(3)} className="c-skin c-out" d="M94 98 C58 98 50 142 56 170 C62 194 126 194 132 170 C138 142 130 98 94 98 Z"/>
    <path {...g(4)} className="c-line" d="M58 130 q-22 -4 -32 -22"/>
    <circle {...g(1)} className="c-skin c-out" cx="94" cy="72" r="41"/>
    <path {...g(2)} className="c-fill" d="M94 36 C94 16 80 6 62 9 C68 28 80 34 94 36 Z"/>
    <path {...g(2)} className="c-fill" d="M94 36 C94 18 108 8 126 13 C118 30 106 34 94 36 Z" opacity=".7"/>
    <circle {...g(1)} className="c-ink" cx="82" cy="70" r="5"/>
    <circle {...g(1)} className="c-ink" cx="106" cy="70" r="5"/>
    <path {...g(1)} className="c-line" d="M82 85 Q94 95 106 85"/>
    <circle {...g(2)} data-cheek="" className="c-cheek" cx="72" cy="82" r="6.5"/>
    <circle {...g(2)} data-cheek="" className="c-cheek" cx="116" cy="82" r="6.5"/>
  </>
}

function Ghost({ g }) {
  return <>
    <path {...g(4)} fill="#dae5ff" stroke="#1a2f6a" strokeWidth="3.5" strokeLinecap="round"
      d="M52 138 Q34 130 28 114 Q32 106 42 112 Q40 124 52 130 Z"/>
    <path {...g(5)} fill="#dae5ff" stroke="#1a2f6a" strokeWidth="3.5" strokeLinecap="round"
      d="M136 138 Q154 130 160 114 Q156 106 146 112 Q148 124 136 130 Z"/>
    <path {...g(3)} fill="#dae5ff" stroke="#1a2f6a" strokeWidth="3.5" strokeLinejoin="round"
      d="M50 118 Q46 158 54 190 Q64 212 76 196 Q86 216 94 196 Q102 216 112 196 Q124 212 134 190 Q142 158 138 118 Q120 106 94 106 Q68 106 50 118 Z"/>
    <circle {...g(1)} fill="#dae5ff" stroke="#1a2f6a" strokeWidth="4" cx="94" cy="68" r="48"/>
    <path {...g(2)} fill="none" stroke="#1a2f6a" strokeWidth="4" strokeLinecap="round" d="M72 52 Q80 46 88 52"/>
    <path {...g(2)} fill="none" stroke="#1a2f6a" strokeWidth="4" strokeLinecap="round" d="M100 52 Q108 46 116 52"/>
    <ellipse {...g(1)} fill="#1a2f6a" cx="80" cy="68" rx="10" ry="12"/>
    <ellipse {...g(1)} fill="#1a2f6a" cx="108" cy="68" rx="10" ry="12"/>
    <ellipse {...g(1)} fill="#1a2f6a" cx="94" cy="90" rx="8" ry="9"/>
    <ellipse {...g(6)} fill="#dae5ff" cx="80" cy="65" rx="4" ry="5"/>
    <ellipse {...g(6)} fill="#dae5ff" cx="108" cy="65" rx="4" ry="5"/>
  </>
}

function Skeleton({ g }) {
  return <>
    <line {...g(6)} stroke="#4a380c" strokeWidth="9" strokeLinecap="round" x1="84" y1="192" x2="74" y2="228"/>
    <line {...g(6)} stroke="#4a380c" strokeWidth="9" strokeLinecap="round" x1="104" y1="192" x2="114" y2="228"/>
    <circle {...g(6)} fill="#f0e6c8" stroke="#4a380c" strokeWidth="3" cx="74" cy="228" r="6"/>
    <circle {...g(6)} fill="#f0e6c8" stroke="#4a380c" strokeWidth="3" cx="114" cy="228" r="6"/>
    <line {...g(4)} stroke="#4a380c" strokeWidth="8" strokeLinecap="round" x1="62" y1="118" x2="32" y2="106"/>
    <circle {...g(4)} fill="#f0e6c8" stroke="#4a380c" strokeWidth="3" cx="32" cy="106" r="6"/>
    <line {...g(5)} stroke="#4a380c" strokeWidth="8" strokeLinecap="round" x1="126" y1="118" x2="156" y2="106"/>
    <circle {...g(5)} fill="#f0e6c8" stroke="#4a380c" strokeWidth="3" cx="156" cy="106" r="6"/>
    <line {...g(3)} stroke="#4a380c" strokeWidth="6" strokeLinecap="round" x1="94" y1="100" x2="94" y2="192"/>
    <path {...g(3)} fill="none" stroke="#4a380c" strokeWidth="4" strokeLinecap="round" d="M94 112 Q72 118 66 130 Q72 136 94 128"/>
    <path {...g(3)} fill="none" stroke="#4a380c" strokeWidth="4" strokeLinecap="round" d="M94 112 Q116 118 122 130 Q116 136 94 128"/>
    <path {...g(3)} fill="none" stroke="#4a380c" strokeWidth="4" strokeLinecap="round" d="M94 134 Q70 140 64 152 Q70 158 94 150"/>
    <path {...g(3)} fill="none" stroke="#4a380c" strokeWidth="4" strokeLinecap="round" d="M94 134 Q118 140 124 152 Q118 158 94 150"/>
    <path {...g(3)} fill="none" stroke="#4a380c" strokeWidth="4" strokeLinecap="round" d="M94 156 Q72 162 66 174 Q72 180 94 172"/>
    <path {...g(3)} fill="none" stroke="#4a380c" strokeWidth="4" strokeLinecap="round" d="M94 156 Q116 162 122 174 Q116 180 94 172"/>
    <path {...g(3)} fill="none" stroke="#4a380c" strokeWidth="5" strokeLinecap="round" d="M76 190 Q94 182 112 190"/>
    <circle {...g(1)} fill="#f0e6c8" stroke="#4a380c" strokeWidth="4" cx="94" cy="64" r="38"/>
    <path {...g(1)} fill="#f0e6c8" stroke="#4a380c" strokeWidth="4" d="M68 80 Q94 100 120 80 L120 86 Q94 104 68 86 Z"/>
    <ellipse {...g(2)} fill="#4a380c" cx="80" cy="60" rx="11" ry="13"/>
    <ellipse {...g(2)} fill="#4a380c" cx="108" cy="60" rx="11" ry="13"/>
    <path {...g(2)} fill="#4a380c" d="M90 76 Q94 70 98 76 Q94 83 90 76 Z"/>
    <rect {...g(2)} fill="#f0e6c8" x="74" y="88" width="9" height="11" rx="2"/>
    <rect {...g(2)} fill="#f0e6c8" x="85" y="88" width="9" height="11" rx="2"/>
    <rect {...g(2)} fill="#f0e6c8" x="96" y="88" width="9" height="11" rx="2"/>
    <rect {...g(2)} fill="#f0e6c8" x="107" y="88" width="9" height="11" rx="2"/>
  </>
}

function Robot({ g }) {
  return <>
    <rect {...g(6)} fill="#b8c8d8" stroke="#152030" strokeWidth="4" x="74" y="192" width="16" height="35" rx="4"/>
    <rect {...g(6)} fill="#b8c8d8" stroke="#152030" strokeWidth="4" x="98" y="192" width="16" height="35" rx="4"/>
    <rect {...g(6)} fill="#4878a0" stroke="#152030" strokeWidth="3" x="69" y="221" width="25" height="10" rx="3"/>
    <rect {...g(6)} fill="#4878a0" stroke="#152030" strokeWidth="3" x="94" y="221" width="25" height="10" rx="3"/>
    <rect {...g(4)} fill="#b8c8d8" stroke="#152030" strokeWidth="4" x="28" y="110" width="34" height="14" rx="7"/>
    <circle {...g(4)} fill="#4878a0" stroke="#152030" strokeWidth="3" cx="28" cy="117" r="8"/>
    <rect {...g(5)} fill="#b8c8d8" stroke="#152030" strokeWidth="4" x="126" y="110" width="34" height="14" rx="7"/>
    <circle {...g(5)} fill="#4878a0" stroke="#152030" strokeWidth="3" cx="160" cy="117" r="8"/>
    <rect {...g(3)} fill="#b8c8d8" stroke="#152030" strokeWidth="4" x="58" y="98" width="72" height="96" rx="10"/>
    <rect {...g(3)} fill="#4878a0" x="70" y="110" width="48" height="32" rx="6"/>
    <circle {...g(3)} fill="#a0e0ff" cx="84" cy="124" r="7"/>
    <circle {...g(3)} fill="#ff5050" cx="100" cy="124" r="7"/>
    <circle {...g(3)} fill="#50e050" cx="116" cy="122" r="5"/>
    <circle {...g(3)} fill="#4878a0" cx="64" cy="104" r="4"/>
    <circle {...g(3)} fill="#4878a0" cx="124" cy="104" r="4"/>
    <rect {...g(1)} fill="#b8c8d8" stroke="#152030" strokeWidth="4" x="54" y="26" width="80" height="72" rx="16"/>
    <line {...g(1)} stroke="#152030" strokeWidth="4" strokeLinecap="round" x1="94" y1="26" x2="94" y2="10"/>
    <circle {...g(1)} fill="#a0e0ff" stroke="#152030" strokeWidth="3" cx="94" cy="8" r="7"/>
    <rect {...g(1)} fill="#b8c8d8" stroke="#152030" strokeWidth="3" x="82" y="94" width="24" height="8" rx="4"/>
    <rect {...g(2)} fill="#152030" x="66" y="44" width="24" height="18" rx="5"/>
    <rect {...g(2)} fill="#152030" x="98" y="44" width="24" height="18" rx="5"/>
    <rect {...g(2)} fill="#a0e0ff" x="70" y="48" width="16" height="10" rx="3"/>
    <rect {...g(2)} fill="#a0e0ff" x="102" y="48" width="16" height="10" rx="3"/>
    <rect {...g(2)} fill="#152030" x="68" y="72" width="52" height="16" rx="5"/>
    <line {...g(2)} stroke="#b8c8d8" strokeWidth="3" x1="79" y1="72" x2="79" y2="88"/>
    <line {...g(2)} stroke="#b8c8d8" strokeWidth="3" x1="90" y1="72" x2="90" y2="88"/>
    <line {...g(2)} stroke="#b8c8d8" strokeWidth="3" x1="101" y1="72" x2="101" y2="88"/>
    <line {...g(2)} stroke="#b8c8d8" strokeWidth="3" x1="112" y1="72" x2="112" y2="88"/>
  </>
}

function Vampire({ g }) {
  return <>
    <rect {...g(6)} fill="#f2e0e8" stroke="#280810" strokeWidth="4" x="76" y="192" width="14" height="36" rx="7"/>
    <rect {...g(6)} fill="#f2e0e8" stroke="#280810" strokeWidth="4" x="98" y="192" width="14" height="36" rx="7"/>
    <path {...g(4)} fill="#200810" stroke="#280810" strokeWidth="2"
      d="M60 108 Q16 145 14 195 Q38 178 60 188 Z"/>
    <path {...g(5)} fill="#200810" stroke="#280810" strokeWidth="2"
      d="M128 108 Q172 145 174 195 Q150 178 128 188 Z"/>
    <path {...g(3)} fill="#200810" stroke="#280810" strokeWidth="3"
      d="M60 108 Q94 102 128 108 L132 196 Q94 186 56 196 Z"/>
    <path {...g(3)} fill="#b01830" d="M70 106 Q94 120 118 106 Q94 134 70 106 Z"/>
    <circle {...g(1)} fill="#f2e0e8" stroke="#280810" strokeWidth="4" cx="94" cy="72" r="41"/>
    <path {...g(2)} fill="#200810"
      d="M53 58 Q62 28 80 26 Q70 50 72 60 Z"/>
    <path {...g(2)} fill="#200810"
      d="M135 58 Q126 28 108 26 Q118 50 116 60 Z"/>
    <path {...g(2)} fill="#200810"
      d="M94 31 Q86 14 80 20 Q87 34 94 38 Q101 34 108 20 Q102 14 94 31 Z"/>
    <ellipse {...g(1)} fill="#900020" cx="80" cy="68" rx="8" ry="9"/>
    <ellipse {...g(1)} fill="#900020" cx="108" cy="68" rx="8" ry="9"/>
    <ellipse {...g(1)} fill="#ff1040" cx="80" cy="66" rx="4" ry="5"/>
    <ellipse {...g(1)} fill="#ff1040" cx="108" cy="66" rx="4" ry="5"/>
    <path {...g(1)} fill="none" stroke="#280810" strokeWidth="3" strokeLinecap="round" d="M78 84 Q94 90 110 84"/>
    <path {...g(2)} fill="#f2e0e8" stroke="#280810" strokeWidth="1.5" d="M83 84 L79 96 L87 84 Z"/>
    <path {...g(2)} fill="#f2e0e8" stroke="#280810" strokeWidth="1.5" d="M105 84 L101 96 L109 84 Z"/>
  </>
}

function Alien({ g }) {
  return <>
    <line {...g(6)} stroke="#0c3205" strokeWidth="6" strokeLinecap="round" x1="87" y1="188" x2="78" y2="224"/>
    <line {...g(6)} stroke="#0c3205" strokeWidth="6" strokeLinecap="round" x1="101" y1="188" x2="110" y2="224"/>
    <line {...g(6)} stroke="#0c3205" strokeWidth="4" strokeLinecap="round" x1="78" y1="224" x2="66" y2="230"/>
    <line {...g(6)} stroke="#0c3205" strokeWidth="4" strokeLinecap="round" x1="78" y1="224" x2="78" y2="233"/>
    <line {...g(6)} stroke="#0c3205" strokeWidth="4" strokeLinecap="round" x1="78" y1="224" x2="90" y2="230"/>
    <line {...g(6)} stroke="#0c3205" strokeWidth="4" strokeLinecap="round" x1="110" y1="224" x2="98" y2="230"/>
    <line {...g(6)} stroke="#0c3205" strokeWidth="4" strokeLinecap="round" x1="110" y1="224" x2="110" y2="233"/>
    <line {...g(6)} stroke="#0c3205" strokeWidth="4" strokeLinecap="round" x1="110" y1="224" x2="122" y2="230"/>
    <path {...g(4)} fill="none" stroke="#0c3205" strokeWidth="5" strokeLinecap="round"
      d="M68 116 Q44 130 34 112"/>
    <circle {...g(4)} fill="#c0f080" stroke="#0c3205" strokeWidth="3" cx="34" cy="112" r="6"/>
    <path {...g(5)} fill="none" stroke="#0c3205" strokeWidth="5" strokeLinecap="round"
      d="M120 116 Q144 130 154 112"/>
    <circle {...g(5)} fill="#c0f080" stroke="#0c3205" strokeWidth="3" cx="154" cy="112" r="6"/>
    <path {...g(3)} fill="#c0f080" stroke="#0c3205" strokeWidth="4"
      d="M72 102 C60 120 60 165 76 188 Q94 196 112 188 C128 165 128 120 116 102 Q94 96 72 102 Z"/>
    <line {...g(3)} stroke="#28a018" strokeWidth="2.5" strokeLinecap="round" x1="94" y1="110" x2="94" y2="182"/>
    <ellipse {...g(1)} fill="#c0f080" stroke="#0c3205" strokeWidth="4" cx="94" cy="60" rx="50" ry="56"/>
    <ellipse {...g(1)} fill="#0c3205" cx="72" cy="56" rx="16" ry="22" transform="rotate(-8 72 56)"/>
    <ellipse {...g(1)} fill="#0c3205" cx="116" cy="56" rx="16" ry="22" transform="rotate(8 116 56)"/>
    <ellipse {...g(1)} fill="#28a018" cx="72" cy="56" rx="9" ry="14" transform="rotate(-8 72 56)"/>
    <ellipse {...g(1)} fill="#28a018" cx="116" cy="56" rx="9" ry="14" transform="rotate(8 116 56)"/>
    <ellipse {...g(1)} fill="#0c3205" cx="72" cy="58" rx="4" ry="7" transform="rotate(-8 72 58)"/>
    <ellipse {...g(1)} fill="#0c3205" cx="116" cy="58" rx="4" ry="7" transform="rotate(8 116 58)"/>
    <line {...g(2)} stroke="#0c3205" strokeWidth="3" strokeLinecap="round" x1="80" y1="20" x2="86" y2="16"/>
    <line {...g(2)} stroke="#0c3205" strokeWidth="3" strokeLinecap="round" x1="108" y1="20" x2="102" y2="16"/>
    <circle {...g(2)} fill="#28a018" stroke="#0c3205" strokeWidth="2" cx="80" cy="20" r="5"/>
    <circle {...g(2)} fill="#28a018" stroke="#0c3205" strokeWidth="2" cx="108" cy="20" r="5"/>
    <line {...g(2)} stroke="#0c3205" strokeWidth="2.5" strokeLinecap="round" x1="88" y1="84" x2="100" y2="84"/>
    <path {...g(2)} fill="none" stroke="#0c3205" strokeWidth="3" strokeLinecap="round" d="M84 96 Q94 101 104 96"/>
  </>
}

const SKIN_MAP = { classic: Classic, ghost: Ghost, skeleton: Skeleton, robot: Robot, vampire: Vampire, alien: Alien }

export default function Character({ wrongGuesses, skinId: skinIdProp }) {
  const skinId = skinIdProp ?? (() => {
    try { return JSON.parse(localStorage.getItem('kremala-skin')) ?? 'classic' } catch { return 'classic' }
  })()

  function g(stage) {
    return wrongGuesses < stage ? { 'data-ghost': '' } : {}
  }

  const SkinComponent = SKIN_MAP[skinId] ?? Classic

  return (
    <svg viewBox="0 0 188 240" aria-hidden="true" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <SkinComponent g={g} />
    </svg>
  )
}
