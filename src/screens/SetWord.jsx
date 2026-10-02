import { useState } from 'react'
import { setWord } from '../hooks/useRoom'
import TopBar from '../components/TopBar'

const GREEK_UPPER = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'

function filterGreek(str) {
  return str.toUpperCase().split('').filter(c => GREEK_UPPER.includes(c)).join('')
}

export default function SetWord({ room, session, onHome }) {
  const [word, setWordInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const guessers = Object.entries(room?.players || {})
    .filter(([pid]) => pid !== room?.setterPid)
    .map(([, p]) => p)
  const guesserName =
    guessers.length === 1 ? `Ο ${guessers[0].name}`
    : guessers.length > 1 ? `Οι ${guessers.length} παίκτες`
    : 'Οι παίκτες'

  async function handleSubmit() {
    const w = filterGreek(word.trim())
    if (w.length < 3) { setError('Η λέξη θέλει τουλάχιστον 3 γράμματα.'); return }
    setLoading(true)
    try {
      await setWord(session.roomCode, w)
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <div className="pp-screen kr-view">
      <TopBar onBack={onHome} backLabel="Έξοδος από το δωμάτιο" title="Κρεμάλα" sub="Η σειρά σου" />
      <main className="pp-screen__body kr-center">
        <span className="pp-label">{guesserName} θα μαντέψ{guessers.length === 1 ? 'ει' : 'ουν'}</span>
        <h2 className="kr-setword">Δώσε μια λέξη</h2>
        <input
          className="pp-input kr-wordinput"
          type="text"
          placeholder="ΘΑΛΑΣΣΑ"
          aria-label="Η λέξη σου"
          value={word}
          onChange={e => { setWordInput(filterGreek(e.target.value)); setError('') }}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <span className="pp-field__hint">{word ? `${word.length} γράμματα` : 'Μόνο ελληνικά, τουλάχιστον 3 γράμματα'}</span>
        {error && <p className="kr-error" role="alert">{error}</p>}
      </main>
      <footer className="pp-screen__footer">
        <button className="pp-btn pp-btn--lg pp-btn--block" type="button" onClick={handleSubmit} disabled={loading || word.length < 3}>
          {loading ? 'Αποθήκευση…' : 'Έτοιμο'}
        </button>
      </footer>
    </div>
  )
}
