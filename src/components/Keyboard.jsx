import { LETTER_ROWS } from '../data'

export default function Keyboard({ word, guessed = {}, onGuess, disabled }) {
  return (
    <div className={`keyboard${disabled ? ' is-locked' : ''}`} role="group" aria-label="Πληκτρολόγιο">
      {LETTER_ROWS.map((row, i) => (
        <div key={i} className={`krow krow-${i + 1}`}>
          {row.map(letter => {
            const wasGuessed = guessed[letter]
            const isCorrect = wasGuessed && word.includes(letter)
            const isWrong = wasGuessed && !word.includes(letter)
            return (
              <button
                key={letter}
                className={`key${isCorrect ? ' is-correct' : isWrong ? ' is-wrong' : ''}`}
                onClick={() => !disabled && !wasGuessed && onGuess(letter)}
                disabled={disabled || wasGuessed}
                aria-label={letter}
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
