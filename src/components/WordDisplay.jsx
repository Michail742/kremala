export default function WordDisplay({ word, guessed = {}, revealed = false, lastGuessed = null }) {
  let revealCount = 0
  return (
    <div className="kr-word" style={{ '--n': word.length || 1 }} aria-label="Λέξη" aria-live="polite">
      {[...word].map((letter, i) => {
        const show = revealed || guessed[letter]
        const isNew = lastGuessed === letter && !!guessed[letter]
        const delay = isNew ? (revealCount++) * 55 : 0
        return (
          <div
            key={i}
            className={`kr-tile ${show ? 'filled' : 'blank'}${isNew ? ' anim-reveal' : ''}`}
            style={isNew ? { animationDelay: `${delay}ms` } : undefined}
          >
            {letter}
          </div>
        )
      })}
    </div>
  )
}
