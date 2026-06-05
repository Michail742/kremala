import { LETTERS } from '../data'

export default function Keyboard({ word, guessed = {}, onGuess, disabled }) {
  return (
    <div className="keyboard" role="group" aria-label="Πληκτρολόγιο">
      {LETTERS.map(letter => {
        const wasGuessed = guessed[letter]
        const isCorrect = wasGuessed && word.includes(letter)
        const isWrong = wasGuessed && !word.includes(letter)
        return (
          <button
            key={letter}
            className={`key${isCorrect ? ' is-correct' : isWrong ? ' is-wrong' : ''}`}
            onClick={() => !disabled && !wasGuessed && onGuess(letter)}
            aria-label={letter}
          >
            {letter}
          </button>
        )
      })}
    </div>
  )
}
