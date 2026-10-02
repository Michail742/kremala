import { LETTER_ROWS } from '../data'

// Πληκτρολόγιο Α–Ω του design system (pp-kbd): σωστά πράσινα, λάθος διαγραμμένα, κλειδωμένο όταν δεν παίζεις.
export default function Keyboard({ word, guessed = {}, onGuess, disabled }) {
  return (
    <div className={`pp-kbd${disabled ? ' is-locked' : ''}`} role="group" aria-label="Πληκτρολόγιο">
      {LETTER_ROWS.map((row, i) => (
        <div key={i} className="pp-kbd__row">
          {row.map(letter => {
            const wasGuessed = guessed[letter]
            const isCorrect = wasGuessed && word.includes(letter)
            const isWrong = wasGuessed && !word.includes(letter)
            return (
              <button
                key={letter}
                type="button"
                className={`pp-key${isCorrect ? ' is-correct' : isWrong ? ' is-wrong' : ''}`}
                onClick={() => !disabled && !wasGuessed && onGuess(letter)}
                disabled={disabled || wasGuessed}
                aria-label={letter + (isCorrect ? ', σωστό' : isWrong ? ', λάθος' : '')}
              >
                {letter}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
