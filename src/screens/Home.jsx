import { useState } from 'react'
import { createRoom, joinRoom, getPlayerId } from '../hooks/useRoom'
import SkinPicker from '../components/SkinPicker'

function IconSolo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M6 4h12v3a6 6 0 0 1-12 0V4Z"/>
      <path d="M10 12h4v4h-4z"/>
      <rect x="8" y="18" width="8" height="2.4" rx="1.2"/>
    </svg>
  )
}

function IconChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function IconBolt() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  )
}

export default function Home({ onJoin, onSolo, skinId, onSkinChange }) {
  const [nickname, setNickname] = useState(() => localStorage.getItem('kremala-name') || '')
  const [mode, setMode] = useState(null)
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

  return (
    <div className="app t-mint">
      <a href="https://paixnidoparea.vercel.app/" aria-label="Επιστροφή στο hub"
        style={{ position: 'absolute', top: 'max(10px, env(safe-area-inset-top))', left: 'max(10px, env(safe-area-inset-left))', zIndex: 50, display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 999, background: 'rgba(15,23,20,.66)', color: '#fff', font: '700 13px/1 Nunito, system-ui, sans-serif', textDecoration: 'none', boxShadow: '0 2px 10px rgba(0,0,0,.28)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}>← Hub</a>
      <div className="home-content">
        <div className="home-brand">
          <div className="brand-mark lg">
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M6 4h12v3a6 6 0 0 1-12 0V4Z"/>
              <path d="M10 12h4v4h-4z"/>
              <rect x="8" y="18" width="8" height="2.4" rx="1.2"/>
            </svg>
          </div>
          <h1 className="home-title">ΚΡΕΜΑΛΑ</h1>
          <p className="home-sub">Παίξτε έως 8 άτομα μαζί</p>
        </div>

        {/* Solo quick-play */}
        <button className="solo-card" onClick={onSolo}>
          <div className="solo-card-left">
            <div className="mode-icon"><IconSolo /></div>
            <div>
              <div className="mode-name">Παίξε Solo</div>
              <div className="mode-desc">Μόνος σου, χωρίς φίλο</div>
            </div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        {/* Divider */}
        <div className="mode-divider"><span>ή παίξε με φίλους (έως 8)</span></div>

        {/* Multiplayer modes */}
        <div className="mode-grid">
          <button
            className={`mode-card${mode === 'setter-guesser' ? ' active' : ''}`}
            onClick={() => { setMode('setter-guesser'); setAction(null) }}
          >
            <div className="mode-icon"><IconChat /></div>
            <span className="mode-name">Setter / Guesser</span>
            <span className="mode-desc">Με τη σειρά ο καθένας δίνει λέξη, οι άλλοι μαντεύουν</span>
          </button>
          <button
            className={`mode-card${mode === 'race' ? ' active' : ''}`}
            onClick={() => { setMode('race'); setAction(null) }}
          >
            <div className="mode-icon"><IconBolt /></div>
            <span className="mode-name">Race</span>
            <span className="mode-desc">Ίδια λέξη — ποιος λύνει πρώτος;</span>
          </button>
        </div>

        {/* Multiplayer action area */}
        {mode && (
          <div className="action-area">
            <div className="field-group">
              <label className="field-label">Nickname</label>
              <input
                className="field-input"
                type="text"
                placeholder="Το όνομά σου..."
                value={nickname}
                maxLength={16}
                onChange={e => setNickname(e.target.value)}
                autoComplete="off"
              />
            </div>
            {action === 'join' ? (
              <div className="join-area">
                <input
                  className="field-input code-input"
                  type="text"
                  placeholder="ΚΩΔΙΚΟΣ"
                  value={joinCode}
                  maxLength={4}
                  onChange={e => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  autoComplete="off"
                />
                <button className="btn" onClick={handleJoin} disabled={loading || !canProceed || joinCode.length < 4}>
                  {loading ? '...' : 'Συμμετοχή'}
                </button>
                <button className="btn ghost" onClick={() => setAction(null)}>Πίσω</button>
              </div>
            ) : (
              <div className="action-btns">
                <button className="btn" onClick={handleCreate} disabled={loading || !canProceed}>
                  {loading ? '...' : 'Δημιουργία δωματίου'}
                </button>
                <button className="btn ghost" onClick={() => setAction('join')} disabled={!canProceed}>
                  Συμμετοχή με κωδικό
                </button>
              </div>
            )}
          </div>
        )}

        {error && <p className="error-msg">{error}</p>}

        <SkinPicker activeSkinId={skinId} onChange={onSkinChange} />
      </div>
    </div>
  )
}
