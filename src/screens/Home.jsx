import { useState } from 'react'
import { createRoom, joinRoom, getPlayerId } from '../hooks/useRoom'
import SkinPicker from '../components/SkinPicker'
import Character from '../components/Character'
import TopBar from '../components/TopBar'

export const MODES = {
  'setter-guesser': { label: 'Δίνω λέξη', hint: 'Με τη σειρά ο καθένας δίνει λέξη και οι υπόλοιποι μαντεύουν.' },
  race: { label: 'Ποιος πρώτος', hint: 'Ίδια λέξη για όλους. Ποιος τη λύνει πρώτος;' },
}

export default function Home({ onJoin, onSolo, skinId, onSkinChange }) {
  const [view, setView] = useState('main')
  const [nickname, setNickname] = useState(() => localStorage.getItem('kremala-name') || '')
  const [mode, setMode] = useState('setter-guesser')
  const [action, setAction] = useState(null)
  const [joinCode, setJoinCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const myId = getPlayerId()
  const canProceed = nickname.trim().length >= 2

  async function handleCreate() {
    if (!canProceed || !mode) return
    setLoading(true); setError('')
    try {
      const code = await createRoom(myId, nickname.trim(), mode)
      localStorage.setItem('kremala-name', nickname.trim())
      onJoin({ myId, myName: nickname.trim(), roomCode: code })
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  async function handleJoin() {
    const code = joinCode.trim().toUpperCase()
    if (!canProceed || code.length < 4) return
    setLoading(true); setError('')
    try {
      await joinRoom(myId, nickname.trim(), code)
      localStorage.setItem('kremala-name', nickname.trim())
      onJoin({ myId, myName: nickname.trim(), roomCode: code })
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  if (view === 'friends') {
    return (
      <div className="pp-screen kr-view">
        <TopBar onBack={() => { setView('main'); setAction(null); setError('') }} title="Με φίλους" sub="Έως 8 παίκτες" />
        <main className="pp-screen__body">
          <div className="pp-screen__scroll">
            <div className="kr-stack">
              <label className="pp-field">
                <span className="pp-field__label">Το όνομά σου</span>
                <input
                  className="pp-input"
                  type="text"
                  placeholder="π.χ. Μιχάλης"
                  value={nickname}
                  maxLength={16}
                  onChange={e => setNickname(e.target.value)}
                  autoComplete="nickname"
                />
                {nickname && !canProceed && <span className="pp-field__hint">Τουλάχιστον 2 γράμματα.</span>}
              </label>

              {action === 'join' ? (
                <label className="pp-field">
                  <span className="pp-field__label">Κωδικός δωματίου</span>
                  <input
                    className="pp-input pp-input--code"
                    type="text"
                    placeholder="ABCD"
                    value={joinCode}
                    maxLength={4}
                    onChange={e => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    autoComplete="off"
                    autoCapitalize="characters"
                  />
                </label>
              ) : (
                <div className="kr-group">
                  <span className="pp-label">Τρόπος παιχνιδιού</span>
                  <div className="pp-seg">
                    {Object.entries(MODES).map(([key, m]) => (
                      <button key={key} type="button" aria-pressed={mode === key} onClick={() => setMode(key)}>{m.label}</button>
                    ))}
                  </div>
                  <span className="pp-field__hint">{MODES[mode].hint}</span>
                </div>
              )}

              {error && <p className="kr-error" role="alert">{error}</p>}
            </div>
          </div>
        </main>
        <footer className="pp-screen__footer">
          {action === 'join' ? (
            <>
              <button className="pp-btn pp-btn--lg pp-btn--block" type="button" onClick={handleJoin} disabled={loading || !canProceed || joinCode.length < 4}>
                {loading ? 'Σύνδεση…' : 'Συμμετοχή'}
              </button>
              <button className="pp-btn pp-btn--ghost pp-btn--block" type="button" onClick={() => { setAction(null); setError('') }}>Πίσω</button>
            </>
          ) : (
            <>
              <button className="pp-btn pp-btn--lg pp-btn--block" type="button" onClick={handleCreate} disabled={loading || !canProceed}>
                {loading ? 'Δημιουργία…' : 'Νέο δωμάτιο'}
              </button>
              <button className="pp-btn pp-btn--secondary pp-btn--block" type="button" onClick={() => setAction('join')} disabled={!canProceed}>
                Μπες με κωδικό
              </button>
            </>
          )}
        </footer>
      </div>
    )
  }

  return (
    <div className="pp-screen kr-view">
      <TopBar href="/" backLabel="Πίσω στα παιχνίδια" />
      <main className="pp-screen__body kr-home">
        <div className="kr-hero" aria-hidden="true">
          <Character wrongGuesses={6} skinId={skinId} />
        </div>
        <div className="kr-titles">
          <span className="pp-label pp-label--accent">Μάντεψε τη λέξη</span>
          <h1 className="kr-title">Κρεμάλα</h1>
        </div>
        <SkinPicker activeSkinId={skinId} onChange={onSkinChange} />
      </main>
      <footer className="pp-screen__footer">
        <button className="pp-btn pp-btn--lg pp-btn--block" type="button" onClick={onSolo}>Solo</button>
        <button className="pp-btn pp-btn--secondary pp-btn--block" type="button" onClick={() => setView('friends')}>Με φίλους</button>
      </footer>
    </div>
  )
}
