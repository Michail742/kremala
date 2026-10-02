import { useState, useEffect, useRef } from 'react'
import Character from '../components/Character'
import Keyboard from '../components/Keyboard'
import WordDisplay from '../components/WordDisplay'
import LivesPips from '../components/LivesPips'
import GuessFeed from '../components/GuessFeed'
import TopBar from '../components/TopBar'
import ResultSheet from '../components/ResultSheet'
import { resetRoom } from '../hooks/useRoom'

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>
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

  // Ο setter παρακολουθεί τη λέξη να συμπληρώνεται σταδιακά όσο οι guessers
  // βρίσκουν γράμματα. Κρατάμε το τελευταίο πετυχημένο γράμμα από το log ώστε
  // να παίξει το reveal animation στο νέο γράμμα (ίδια αίσθηση με τον guesser).
  const [lastGuessed, setLastGuessed] = useState(null)
  const prevLogLen = useRef(log.length)
  useEffect(() => {
    if (log.length > prevLogLen.current) {
      const newest = log[log.length - 1]
      if (newest?.hit) setLastGuessed(newest.letter)
    }
    prevLogLen.current = log.length
  }, [log])

  const guesserCount = Object.keys(players).filter(pid => pid !== room?.setterPid).length
  const guesserName = guesserCount === 1 ? 'Ο παίκτης' : 'Οι παίκτες'
  const claimer = room?.claim?.claimer
  const claimerName = claimer ? (players[claimer]?.name || 'Κάποιος') : ''

  async function handleReset() {
    await resetRoom(session.roomCode, room.mode)
  }

  return (
    <div className="pp-screen kr-noinset kr-view">
      <TopBar onBack={onHome} back="close" backLabel="Έξοδος από το δωμάτιο" title="Κρεμάλα" sub="Παρακολουθείς" />

      <main className="pp-screen__body kr-play">
        <div className="kr-stage">
          <LivesPips lives={lives} />
          <div className="kr-char">
            <div className="kr-platform" />
            <Character wrongGuesses={wrongGuesses} />
          </div>
          <p className="kr-cap" aria-live="polite">
            {guesserName} {guesserCount === 1 ? 'μαντεύει' : 'μαντεύουν'} τη λέξη σου…
          </p>
        </div>

        {!isFinished && claimer && (
          <div className="kr-claim">
            <div className="kr-banner"><LockIcon />{claimerName} λέει ότι βρήκε τη λέξη…</div>
          </div>
        )}

        {/* Ο setter βλέπει τη λέξη να συμπληρώνεται σταδιακά (μόνο τα γράμματα που
            έχουν βρεθεί), εκτός αν τελείωσε ο γύρος που αποκαλύπτεται όλη. */}
        <WordDisplay word={word} guessed={guessed} revealed={isFinished} lastGuessed={lastGuessed} />
      </main>

      {/* Read-only keyboard showing guesser's guesses */}
      <Keyboard word={word} guessed={guessed} onGuess={() => {}} disabled={true} />

      <GuessFeed log={log} players={players} />

      {isFinished && (
        <ResultSheet
          label="Η λέξη σου"
          title={isWon ? 'Τη βρήκαν!' : 'Δεν τη βρήκαν'}
          msg={isWon ? 'Η λέξη σου βρέθηκε.' : 'Η λέξη έμεινε κρυφή.'}
          word={word}
          wordLabel="Η λέξη σου"
          loss={isWon}
        >
          <button className="pp-btn pp-btn--lg pp-btn--block" type="button" onClick={handleReset}>Νέο παιχνίδι</button>
          <button className="pp-btn pp-btn--secondary pp-btn--block" type="button" onClick={onHome}>Έξοδος</button>
        </ResultSheet>
      )}
    </div>
  )
}
