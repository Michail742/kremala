export default function Character({ wrongGuesses }) {
  function ghost(stage) {
    return wrongGuesses < stage ? { 'data-ghost': '' } : {}
  }
  return (
    <svg viewBox="0 0 188 230" aria-hidden="true" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <rect {...ghost(6)} className="c-skin c-out" x="76" y="182" width="14" height="38" rx="7"/>
      <rect {...ghost(6)} className="c-skin c-out" x="98" y="182" width="14" height="38" rx="7"/>
      <path {...ghost(5)} className="c-line" d="M130 126 q26 -2 34 -22"/>
      <path {...ghost(3)} className="c-skin c-out" d="M94 98 C58 98 50 142 56 170 C62 194 126 194 132 170 C138 142 130 98 94 98 Z"/>
      <path {...ghost(4)} className="c-line" d="M58 130 q-22 -4 -32 -22"/>
      <circle {...ghost(1)} className="c-skin c-out" cx="94" cy="72" r="41"/>
      <path {...ghost(2)} className="c-fill" d="M94 36 C94 16 80 6 62 9 C68 28 80 34 94 36 Z"/>
      <path {...ghost(2)} className="c-fill" d="M94 36 C94 18 108 8 126 13 C118 30 106 34 94 36 Z" opacity=".7"/>
      <circle {...ghost(1)} className="c-ink" cx="82" cy="70" r="5"/>
      <circle {...ghost(1)} className="c-ink" cx="106" cy="70" r="5"/>
      <path {...ghost(1)} className="c-line" d="M82 85 Q94 95 106 85"/>
      <circle {...ghost(2)} data-cheek="" className="c-cheek" cx="72" cy="82" r="6.5"/>
      <circle {...ghost(2)} data-cheek="" className="c-cheek" cx="116" cy="82" r="6.5"/>
    </svg>
  )
}
