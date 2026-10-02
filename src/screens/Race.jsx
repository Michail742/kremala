import { useState } from 'react'
import Character from '../components/Character'
import Keyboard from '../components/Keyboard'
import WordDisplay from '../components/WordDisplay'
import LivesPips from '../components/LivesPips'
import TopBar from '../components/TopBar'
import ResultSheet from '../components/ResultSheet'
import { guessLetterRace, resetRoom } from '../hooks/useRoom'

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
    <div className="pp-screen kr-noinset kr-view">
      <TopBar onBack={onHome} back="close" backLabel="Έξοδος από το δωμάτιο" title="Ποιος πρώτος" sub={`${unique.size} διαφορετικά γράμματα`} />

      <main className="pp-screen__body kr-play">
        {opponents.length > 0 && (
          <div className="kr-opps">
            {opponents.map(o => (
              <div key={o.id} className={`kr-opp${o.status === 'lost' ? ' is-lost' : ''}${o.status === 'won' ? ' is-won' : ''}`}>
                <span className="kr-opp__name">{o.name}</span>
                <span className="kr-opp__lives" role="img" aria-label={`${o.lives} ζωές`}>
                  {Array.from({ length: 6 }, (_, i) => (
                    <span key={i} className={`kr-opp__pip${i < o.lives ? '' : ' lost'}`} />
                  ))}
                </span>
                <span className="kr-opp__state">
                  {o.status === 'won' ? 'Τη βρήκε' : o.status === 'lost' ? 'Έχασε' : `${o.found}/${unique.size}`}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="kr-stage">
          <LivesPips lives={myLives} />
          <div className="kr-char">
            <div className="kr-platform" />
            <Character wrongGuesses={wrongGuesses} />
          </div>
          <p className="kr-cap" aria-live="polite">
            {myStatus === 'lost' && !isFinished ? 'Έχασες. Περιμένεις τους υπόλοιπους.' : ''}
          </p>
        </div>

        <WordDisplay
          word={word}
          guessed={myGuessed}
          revealed={isFinished && myStatus !== 'won'}
          lastGuessed={lastGuessed}
        />
      </main>

      <Keyboard word={word} guessed={myGuessed} onGuess={handleGuess} disabled={!canPlay} />

      {isFinished && (
        <ResultSheet
          label="Ποιος πρώτος"
          title={iWon ? 'Νίκη!' : winnerName ? `Νίκησε ${winnerName}` : 'Κρίμα'}
          msg={iWon ? 'Έλυσες πρώτος!' : winnerName ? 'Ήσουν κοντά.' : 'Δεν τα κατάφερε κανείς.'}
          word={word}
          loss={!iWon}
        >
          <button className="pp-btn pp-btn--lg pp-btn--block" type="button" onClick={handleReset}>Ξανά</button>
          <button className="pp-btn pp-btn--secondary pp-btn--block" type="button" onClick={onHome}>Έξοδος</button>
        </ResultSheet>
      )}
    </div>
  )
}
