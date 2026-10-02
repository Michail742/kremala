import { useState } from 'react'
import Character from '../components/Character'
import Keyboard from '../components/Keyboard'
import WordDisplay from '../components/WordDisplay'
import LivesPips from '../components/LivesPips'
import GuessFeed from '../components/GuessFeed'
import TopBar from '../components/TopBar'
import ResultSheet from '../components/ResultSheet'
import { guessLetter, resetRoom, startClaim, failClaim, winByClaim } from '../hooks/useRoom'

const GREEK_UPPER = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'
const filterGreekUpper = s => s.toUpperCase().split('').filter(c => GREEK_UPPER.includes(c)).join('')

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>
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
    <div className="pp-screen kr-noinset kr-view">
      <TopBar onBack={onHome} back="close" backLabel="Έξοδος από το δωμάτιο" title="Κρεμάλα" sub={`Λέξη του ${setterName}`} />

      <main className="pp-screen__body kr-play">
        <div className="kr-stage">
          <LivesPips lives={lives} />
          <div className="kr-char">
            <div className="kr-platform" />
            <Character wrongGuesses={wrongGuesses} />
          </div>
        </div>

        <WordDisplay word={word} guessed={guessed} revealed={gameStatus === 'lost'} lastGuessed={lastGuessed} />

        {!isFinished && gameStatus === 'playing' && (
          <div className="kr-claim">
            {iAmClaiming ? (
              <div className="kr-claimbox">
                <span className="pp-field__label">Γράψε ολόκληρη τη λέξη</span>
                <div className="kr-claimrow">
                  <input
                    className="pp-input"
                    value={claimInput}
                    onChange={e => setClaimInput(filterGreekUpper(e.target.value))}
                    onKeyDown={e => { if (e.key === 'Enter') submitClaim() }}
                    placeholder="Η ΛΕΞΗ"
                    aria-label="Ολόκληρη η λέξη"
                    autoComplete="off" autoCorrect="off" spellCheck={false} autoFocus
                  />
                  <button className="pp-btn" type="button" onClick={submitClaim} disabled={!claimInput}>Στείλε</button>
                </div>
                <span className="pp-field__hint">Αν είναι λάθος, χάνεις τη σειρά σου σε αυτόν τον γύρο.</span>
              </div>
            ) : someoneClaiming ? (
              <div className="kr-banner"><LockIcon />{claimerName} λέει ότι βρήκε τη λέξη. Περίμενε…</div>
            ) : iAmExcluded ? (
              <div className="kr-banner is-muted">Δεν βρήκες τη λέξη. Βλέπεις μέχρι το τέλος του γύρου.</div>
            ) : unrevealed >= 3 ? (
              <button className="pp-btn pp-btn--secondary pp-btn--block" type="button" onClick={handleClaim}>Το βρήκα!</button>
            ) : null}
          </div>
        )}
      </main>

      <Keyboard word={word} guessed={guessed} onGuess={handleGuess} disabled={isFinished || someoneClaiming || iAmExcluded} />

      <GuessFeed log={log} players={players} />

      {isFinished && (
        <ResultSheet
          label={isWon ? 'Βρέθηκε η λέξη' : 'Τέλος γύρου'}
          title={isWon ? 'Νίκη!' : 'Κρίμα'}
          msg={isWon ? 'Βρήκες τη λέξη!' : 'Δεν τα κατάφερες αυτή τη φορά.'}
          word={word}
          loss={!isWon}
        >
          <button className="pp-btn pp-btn--lg pp-btn--block" type="button" onClick={handleReset}>Νέο παιχνίδι</button>
          <button className="pp-btn pp-btn--secondary pp-btn--block" type="button" onClick={onHome}>Έξοδος</button>
        </ResultSheet>
      )}
    </div>
  )
}
