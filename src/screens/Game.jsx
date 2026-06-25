import { useState } from 'react'
import Character from '../components/Character'
import Keyboard from '../components/Keyboard'
import WordDisplay from '../components/WordDisplay'
import LivesPips from '../components/LivesPips'
import GuessFeed from '../components/GuessFeed'
import Scoreboard from '../components/Scoreboard'
import RoundBreakdown from '../components/RoundBreakdown'
import { guessLetter, resetRoom } from '../hooks/useRoom'
import { setterRoundRows } from '../roundPoints'

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

  async function handleGuess(letter) {
    if (isFinished || gameStatus !== 'playing') return
    setLastGuessed(letter)
    await guessLetter(session.roomCode, session.myId, letter)
  }

  async function handleReset() {
    setLastGuessed(null)
    await resetRoom(session.roomCode, room.mode)
  }

  return (
    <div className="app t-mint">
      <nav className="nav">
        <div className="brand">
          <span className="brand-mark"><BrandSvg /></span>
          <span className="brand-name">ΚΡΕΜΑΛΑ</span>
        </div>
        <span className="player-badge">vs {setterName}</span>
      </nav>

      <div className="stage">
        <LivesPips lives={lives} />
        <div className="char-wrap">
          <div className="char-platform" />
          <Character wrongGuesses={wrongGuesses} />
        </div>
      </div>

      <WordDisplay word={word} guessed={guessed} revealed={gameStatus === 'lost'} lastGuessed={lastGuessed} />

      <Keyboard word={word} guessed={guessed} onGuess={handleGuess} disabled={isFinished} />

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
            <RoundBreakdown rows={setterRoundRows(log, players, room?.setterPid, gameStatus, session?.myId)} />
            <Scoreboard players={players} scores={room?.scores} myId={session?.myId} />
            <button className="btn" style={{ marginTop: '18px' }} onClick={handleReset}>Νέο παιχνίδι</button>
            <button className="btn ghost" onClick={onHome}>Έξοδος</button>
          </div>
        </div>
      )}
    </div>
  )
}
