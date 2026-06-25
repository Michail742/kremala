import { useState } from 'react'
import Character from '../components/Character'
import Keyboard from '../components/Keyboard'
import WordDisplay from '../components/WordDisplay'
import LivesPips from '../components/LivesPips'
import Scoreboard from '../components/Scoreboard'
import RoundBreakdown from '../components/RoundBreakdown'
import { guessLetterRace, resetRoom } from '../hooks/useRoom'
import { raceRoundRows } from '../roundPoints'

function BrandSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
      <path d="M6 4h12v3a6 6 0 0 1-12 0V4Z"/>
      <path d="M10 12h4v4h-4z"/>
      <rect x="8" y="18" width="8" height="2.4" rx="1.2"/>
    </svg>
  )
}

export default function Race({ room, session, onHome }) {
  const [lastGuessed, setLastGuessed] = useState(null)

  const word = room?.word || ''
  const myId = session?.myId
  const players = room?.players || {}
  const raceStates = room?.raceStates || {}

  const myState = raceStates[myId] || { guessed: {}, livesRemaining: 6, status: 'playing' }
  const myGuessed = myState.guessed || {}
  const myLives = myState.livesRemaining ?? 6
  const myStatus = myState.status || 'playing'
  const wrongGuesses = 6 - myLives
  const unique = new Set(word)

  const isFinished = room?.status === 'finished'
  const winner = room?.winner
  const iWon = winner === myId
  const winnerName = winner ? players[winner]?.name : null

  // Όλοι οι αντίπαλοι (όλοι πλην εμένα)
  const opponents = Object.keys(players)
    .filter(id => id !== myId)
    .map(id => {
      const st = raceStates[id] || { guessed: {}, livesRemaining: 6, status: 'playing' }
      const g = st.guessed || {}
      return {
        id,
        name: players[id]?.name || '?',
        lives: st.livesRemaining ?? 6,
        status: st.status || 'playing',
        found: [...unique].filter(l => g[l]).length,
      }
    })

  const canPlay = !isFinished && myStatus === 'playing'

  async function handleGuess(letter) {
    if (!canPlay) return
    setLastGuessed(letter)
    await guessLetterRace(session.roomCode, myId, letter, word, myGuessed, myLives, raceStates)
  }

  async function handleReset() {
    setLastGuessed(null)
    await resetRoom(session.roomCode, room.mode)
  }

  return (
    <div className="app t-mint">
      {/* Κάρτες αντιπάλων */}
      {opponents.length > 0 && (
        <div className="opponent-list">
          {opponents.map(o => (
            <div key={o.id} className={`opponent-card${o.status === 'lost' ? ' lost' : ''}${o.status === 'won' ? ' won' : ''}`}>
              <span className="opp-name">{o.name}</span>
              <div className="opp-lives">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} className={`opp-pip${i < o.lives ? '' : ' lost'}`} />
                ))}
              </div>
              <span className="opp-letters">
                {o.status === 'won' ? '🏆' : o.status === 'lost' ? '💀' : `${o.found}/${unique.size}`}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="stage">
        <LivesPips lives={myLives} />
        <div className="char-wrap">
          <div className="char-platform" />
          <Character wrongGuesses={wrongGuesses} />
        </div>
        <div className="stage-cap" aria-live="polite">
          {myStatus === 'lost' && !isFinished ? 'Έχασες — περιμένεις τους άλλους' : ''}
        </div>
      </div>

      <WordDisplay
        word={word}
        guessed={myGuessed}
        revealed={isFinished && myStatus !== 'won'}
        lastGuessed={lastGuessed}
      />

      <Keyboard word={word} guessed={myGuessed} onGuess={handleGuess} disabled={!canPlay} />

      {isFinished && (
        <div className="scrim" role="dialog" aria-modal="true">
          <div className={`modal ${iWon ? 'win' : 'over'}`}>
            <div className="badge">
              {iWon
                ? <BrandSvg />
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" width="40" height="40"><path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4h4"/></svg>
              }
            </div>
            <h3>{iWon ? 'ΝΙΚΗ!' : winnerName ? `${winnerName} νίκησε!` : 'ΚΡΙΜΑ!'}</h3>
            <p className="msg">
              {iWon ? 'Έλυσες πρώτος!' : winnerName ? 'Ήσουν κοντά' : 'Δεν τα κατάφερε κανείς'}
            </p>
            <div className="reveal">
              <span className="lab">Η λέξη</span>
              {[...word].map((l, i) => <span key={i}>{l}</span>)}
            </div>
            <RoundBreakdown rows={raceRoundRows(raceStates, word, players, winner, myId)} />
            <Scoreboard players={players} scores={room?.scores} myId={myId} />
            <button className="btn" style={{ marginTop: '18px' }} onClick={handleReset}>Ξανά!</button>
            <button className="btn ghost" onClick={onHome}>Έξοδος</button>
          </div>
        </div>
      )}
    </div>
  )
}
