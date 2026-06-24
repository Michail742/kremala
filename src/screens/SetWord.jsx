import { useState } from 'react'
import { setWord } from '../hooks/useRoom'

const GREEK_UPPER = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'

function filterGreek(str) {
  return str.toUpperCase().split('').filter(c => GREEK_UPPER.includes(c)).join('')
}

export default function SetWord({ room, session, onHome }) {
  const [word, setWordInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const guessers = Object.values(room?.players || {}).filter(p => p.role === 'guesser')
  const guesserName =
    guessers.length === 1 ? `Ο ${guessers[0].name}`
    : guessers.length > 1 ? `Οι ${guessers.length} παίκτες`
    : 'Οι παίκτες'

  async function handleSubmit() {
    const w = filterGreek(word.trim())
    if (w.length < 3) { setError('Τουλάχιστον 3 γράμματα'); return }
    setLoading(true)
    try {
      await setWord(session.roomCode, w)
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <div className="app t-mint">
      <div className="set-word-content">
        <div className="set-word-top">
          <p className="set-word-sub">{guesserName} θα μαντέψ{guessers.length === 1 ? 'ει' : 'ουν'}</p>
          <h2 className="set-word-title">Δώσε μια λέξη</h2>
        </div>

        <div className="set-word-input-wrap">
          <input
            className="field-input set-word-input"
            type="text"
            placeholder="π.χ. ΘΑΛΑΣΣΑ"
            value={word}
            onChange={e => { setWordInput(filterGreek(e.target.value)); setError('') }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {word && <p className="char-count">{word.length} γράμματα</p>}
        </div>

        {error && <p className="error-msg">{error}</p>}

        <div className="set-word-btns">
          <button className="btn" onClick={handleSubmit} disabled={loading || word.length < 3}>
            {loading ? '...' : 'Έτοιμο!'}
          </button>
          <button className="btn ghost" onClick={onHome}>Έξοδος</button>
        </div>
      </div>
    </div>
  )
}
