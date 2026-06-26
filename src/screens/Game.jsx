import { useState } from 'react'
import Character from '../components/Character'
import Keyboard from '../components/Keyboard'
import WordDisplay from '../components/WordDisplay'
import LivesPips from '../components/LivesPips'
import GuessFeed from '../components/GuessFeed'
import { guessLetter, resetRoom, startClaim, failClaim, winByClaim } from '../hooks/useRoom'

const GREEK_UPPER = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'
const filterGreekUpper = s => s.toUpperCase().split('').filter(c => GREEK_UPPER.includes(c)).join('')

function BrandSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
      <path d="M6 4h12v3a6 6 0 0 1-12 0V4Z"/>
      <path d="M10 12h4v4h-4z"/>
      <rect x="8" y="18" width="8" height="2.4" rx="1.2"/>
    </svg>
  )
}

export default function Game({ room, session, onHome }) {
  const [lastGuessed, setLastGuessed] = useState(null)
  const [claimInput, setClaimInput] = useState('')

  const word = room?.word || ''
  const gameState = room?.gameState || {}
  const guessed = gameState.guessed || {}
  const lives = gameState.livesRemaining ?? 6
  const gameStatus = gameState.status || 'playing'
  const wrongGuesses = 6 - lives
  const isFinished = room?.status === 'finished'
  const isWon = gameStatus === 'won'

  const players = room?.players || {}
  const setterName = players[room?.setterPid]?.name || 'Setter'
  const log = gameState.log || []
  const myId = session?.myId

  // «Το βρήκα» (claim) state
  const claim = room?.claim || { claimer: null, failed: {} }
  const someoneClaiming = !!claim.claimer
  const iAmClaiming = claim.claimer === myId
  const iAmExcluded = !!claim.failed?.[myId]
  const unrevealed = [...new Set(word)].filter(l => l && !guessed[l]).length // διακριτά γράμματα που δεν βρέθηκαν
  const claimerName = claim.claimer ? (players[claim.claimer]?.name || 'Κάποιος') : ''

  async function handleGuess(letter) {
    if (isFinished || gameStatus !== 'playing') return
    if (someoneClaiming || iAmExcluded) return // κλειδωμένο όσο κάποιος δηλώνει «Το βρήκα» / αν έχω αποκλειστεί
    setLastGuessed(letter)
    await guessLetter(session.roomCode, session.myId, letter)
  }

  async function handleClaim() {
    await startClaim(session.roomCode, myId, claim.failed)
  }

  async function submitClaim() {
    const guess = filterGreekUpper(claimInput)
    if (!guess) return
    setClaimInput('')
    if (guess === word) await winByClaim(session.roomCode, myId, word, guessed, log)
    else await failClaim(session.roomCode, myId, claim.failed)
  }

  async function handleReset() {
    setLastGuessed(null)
    setClaimInput('')
    await resetRoom(session.roomCode, room.mode)
  }

  return (
    <div className="app t-mint">
      <nav className="nav">
        <div className="brand">
          <span className="brand-mark"><BrandSvg /></span>
          <span className="brand-name">ΚΡΕΜΑΛΑ</span>
        </div>
        <div className="nav-right">
          <span className="player-badge">vs {setterName}</span>
          <button className="nav-exit" onClick={onHome}>Έξοδος</button>
        </div>
      </nav>

      <div className="stage">
        <LivesPips lives={lives} />
        <div className="char-wrap">
          <div className="char-platform" />
          <Character wrongGuesses={wrongGuesses} />
        </div>
      </div>

      <WordDisplay word={word} guessed={guessed} revealed={gameStatus === 'lost'} lastGuessed={lastGuessed} />

      {!isFinished && gameStatus === 'playing' && (
        <div className="claim-zone">
          {iAmClaiming ? (
            <div className="claim-box">
              <p className="claim-title">Γράψε ολόκληρη τη λέξη:</p>
              <div className="claim-row">
                <input
                  className="field-input claim-input"
                  value={claimInput}
                  onChange={e => setClaimInput(filterGreekUpper(e.target.value))}
                  onKeyDown={e => { if (e.key === 'Enter') submitClaim() }}
                  placeholder="Η ΛΕΞΗ"
                  autoComplete="off" autoCorrect="off" spellCheck={false} autoFocus
                />
                <button className="btn claim-submit" onClick={submitClaim} disabled={!claimInput}>OK</button>
              </div>
              <p className="claim-hint">Αν λάθος, χάνεις τη σειρά σου γι' αυτόν τον γύρο.</p>
            </div>
          ) : someoneClaiming ? (
            <div className="claim-banner">🔒 {claimerName} δηλώνει ότι βρήκε τη λέξη… περίμενε</div>
          ) : iAmExcluded ? (
            <div className="claim-banner muted">Δεν βρήκες τη λέξη — βλέπεις μέχρι το τέλος του γύρου</div>
          ) : unrevealed >= 3 ? (
            <button className="btn claim-btn" onClick={handleClaim}>✋ Το βρήκα!</button>
          ) : null}
        </div>
      )}

      <Keyboard word={word} guessed={guessed} onGuess={handleGuess} disabled={isFinished || someoneClaiming || iAmExcluded} />

      <GuessFeed log={log} players={players} />

      {isFinished && (
        <div className="scrim" role="dialog" aria-modal="true">
          <div className={`modal ${isWon ? 'win' : 'over'}`}>
            <div className="badge">
              {isWon
                ? <BrandSvg />
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" width="40" height="40"><path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4h4"/></svg>
              }
            </div>
            <h3>{isWon ? 'ΝΙΚΗ!' : 'ΚΡΙΜΑ!'}</h3>
            <p className="msg">{isWon ? 'Βρήκες τη λέξη!' : 'Δεν τα κατάφερες'}</p>
            <div className="reveal">
              <span className="lab">Η λέξη</span>
              {[...word].map((l, i) => <span key={i}>{l}</span>)}
            </div>
            <button className="btn" style={{ marginTop: '18px' }} onClick={handleReset}>Νέο παιχνίδι</button>
            <button className="btn ghost" onClick={onHome}>Έξοδος</button>
          </div>
        </div>
      )}
    </div>
  )
}
