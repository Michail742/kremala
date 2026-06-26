import Character from '../components/Character'
import Keyboard from '../components/Keyboard'
import WordDisplay from '../components/WordDisplay'
import LivesPips from '../components/LivesPips'
import GuessFeed from '../components/GuessFeed'
import { resetRoom } from '../hooks/useRoom'

function BrandSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
      <path d="M6 4h12v3a6 6 0 0 1-12 0V4Z"/>
      <path d="M10 12h4v4h-4z"/>
      <rect x="8" y="18" width="8" height="2.4" rx="1.2"/>
    </svg>
  )
}

export default function Watch({ room, session, onHome }) {
  const word = room?.word || ''
  const gameState = room?.gameState || {}
  const guessed = gameState.guessed || {}
  const lives = gameState.livesRemaining ?? 6
  const gameStatus = gameState.status || 'playing'
  const wrongGuesses = 6 - lives
  const isFinished = room?.status === 'finished'
  const isWon = gameStatus === 'won'

  const players = room?.players || {}
  const log = gameState.log || []
  const guesserCount = Object.keys(players).filter(pid => pid !== room?.setterPid).length
  const guesserName = guesserCount === 1 ? 'Ο παίκτης' : 'Οι παίκτες'
  const claimer = room?.claim?.claimer
  const claimerName = claimer ? (players[claimer]?.name || 'Κάποιος') : ''

  async function handleReset() {
    await resetRoom(session.roomCode, room.mode)
  }

  return (
    <div className="app t-mint">
      <nav className="nav">
        <div className="brand">
          <span className="brand-mark"><BrandSvg /></span>
          <span className="brand-name">ΚΡΕΜΑΛΑ</span>
        </div>
        <span className="watch-badge">Παρακολουθείς</span>
      </nav>

      <div className="stage">
        <LivesPips lives={lives} />
        <div className="char-wrap">
          <div className="char-platform" />
          <Character wrongGuesses={wrongGuesses} />
        </div>
        <div className="stage-cap" aria-live="polite">
          {guesserName} {guesserCount === 1 ? 'μαντεύει' : 'μαντεύουν'}…
        </div>
      </div>

      {!isFinished && claimer && (
        <div className="claim-zone">
          <div className="claim-banner">🔒 {claimerName} δηλώνει ότι βρήκε τη λέξη…</div>
        </div>
      )}

      {/* Setter always sees the full word */}
      <WordDisplay word={word} guessed={guessed} revealed={true} />

      {/* Read-only keyboard showing guesser's guesses */}
      <Keyboard word={word} guessed={guessed} onGuess={() => {}} disabled={true} />

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
            <h3>{isWon ? 'Βρήκαν τη λέξη!' : 'Δεν τα κατάφεραν'}</h3>
            <p className="msg">{isWon ? 'Η λέξη σου βρέθηκε!' : 'Η λέξη έμεινε κρυφή'}</p>
            <div className="reveal">
              <span className="lab">Η λέξη σου</span>
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
