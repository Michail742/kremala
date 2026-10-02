import { useEffect, useRef, useState } from 'react'
import { markReady, startGame } from '../hooks/useRoom'
import TopBar from '../components/TopBar'
import { MODES } from './Home'

// Χρώμα παίκτη: τα γεμίσματα των παιχνιδιών, με τη σειρά που μπήκαν οι παίκτες.
const PALETTE = ['kremala', 'taboo', 'bluffa', 'crossword', 'triliza', 'onomazooprama', 'braintest', 'deka']

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
      <rect x="8.5" y="8.5" width="11.5" height="11.5" rx="3"/>
      <path d="M15.5 8.5V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v5.5a3 3 0 0 0 3 3h1.5"/>
    </svg>
  )
}

export default function Lobby({ room, session, onHome }) {
  const startedRef = useRef(false)
  const [copied, setCopied] = useState(false)
  const players = room?.players || {}
  const ready = room?.ready || {}
  const playerIds = Object.keys(players)
  const playerCount = playerIds.length
  const myId = session?.myId
  const amIReady = !!ready[myId]
  const isSettingWord = room?.status === 'setting-word'
  const isReadyCheck = room?.status === 'ready-check'

  const myRole = players[myId]?.role
  const isHost = myRole === 'host'
  const allReady = playerCount >= 2 && playerIds.every(id => ready[id])

  // Auto-start: μόλις είναι όλοι (≥2) έτοιμοι, ο host ξεκινάει το παιχνίδι.
  useEffect(() => {
    if (isReadyCheck && isHost && allReady && !startedRef.current) {
      startedRef.current = true
      startGame(session.roomCode, room.mode, playerIds)
    }
  }, [isReadyCheck, isHost, allReady])

  // Μήνυμα όσο ο setter του γύρου διαλέγει λέξη (φάση setting-word, βλέπουν οι υπόλοιποι)
  let statusMsg = ''
  if (isSettingWord) {
    const setterName = players[room?.setterPid]?.name
    statusMsg = `${setterName || 'Ο παίκτης'} διαλέγει λέξη…`
  }

  async function handleReady() {
    await markReady(session.roomCode, myId)
  }

  function handleCopy() {
    if (!navigator.clipboard?.writeText) return
    navigator.clipboard.writeText(session?.roomCode || '').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  return (
    <div className="pp-screen kr-view">
      <TopBar onBack={onHome} backLabel="Έξοδος από το δωμάτιο" title="Κρεμάλα" sub={MODES[room?.mode]?.label} />
      <main className="pp-screen__body">
        <div className="pp-screen__scroll">
          <div className="kr-stack">
            <section className="pp-roomcode" aria-label="Κωδικός δωματίου">
              <div className="pp-roomcode__main">
                <span className="pp-label">Κωδικός δωματίου</span>
                <span className="pp-roomcode__code">{session?.roomCode}</span>
                <span className="pp-roomcode__hint">Μοιράσου τον με την παρέα</span>
              </div>
              <div className="pp-roomcode__stub">
                <button className="pp-roomcode__copy" type="button" onClick={handleCopy}>
                  <CopyIcon />
                  {copied ? 'Έγινε' : 'Αντιγραφή'}
                </button>
              </div>
            </section>

            <div className="kr-group">
              <div className="kr-grouphead">
                <span className="pp-label">Παίκτες</span>
                <span className="pp-chip">{playerCount} / 8</span>
              </div>
              <ul className="pp-players">
                {playerIds.map((id, i) => {
                  const isMe = id === myId
                  const isReady = !!ready[id]
                  return (
                    <li key={id} className={`pp-player${isMe ? ' is-me' : ''}`}>
                      <span className="pp-avatar" style={{ '--avatar': `var(--game-${PALETTE[i % PALETTE.length]})` }}>
                        {(players[id].name || '?').trim().charAt(0).toUpperCase()}
                        {players[id].role === 'host' && (
                          <span className="pp-avatar__badge" role="img" aria-label="Οικοδεσπότης">
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.5 8.2l4.6 4.1L12 5.5l3.9 6.8 4.6-4.1-1.9 10.3H5.4z"/></svg>
                          </span>
                        )}
                      </span>
                      <span className="pp-player__text">
                        <span className="pp-player__name">{players[id].name}</span>
                        {isReadyCheck && isReady ? (
                          <span className="pp-player__meta is-ready">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/></svg>
                            Έτοιμος
                          </span>
                        ) : (
                          <span className="pp-player__meta">{isMe ? 'Εσύ' : isReadyCheck ? 'Περιμένει' : 'Μέσα'}</span>
                        )}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>

            {statusMsg && <p className="kr-wait">{statusMsg}</p>}
          </div>
        </div>
      </main>
      <footer className="pp-screen__footer">
        {isReadyCheck && !amIReady && (
          <button className="pp-btn pp-btn--lg pp-btn--block" type="button" onClick={handleReady}>Έτοιμος</button>
        )}
        {isReadyCheck && amIReady && (
          <p className="kr-wait">{playerCount < 2 ? 'Περιμένουμε κι άλλους παίκτες…' : 'Περιμένουμε τους υπόλοιπους…'}</p>
        )}
      </footer>
    </div>
  )
}
