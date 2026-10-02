import { useState } from 'react'
import { WORDS } from '../data'
import Character from '../components/Character'
import Keyboard from '../components/Keyboard'
import WordDisplay from '../components/WordDisplay'
import LivesPips from '../components/LivesPips'
import TopBar from '../components/TopBar'
import ResultSheet from '../components/ResultSheet'

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)]
}

function loadScore() {
  try { return JSON.parse(localStorage.getItem('kremala-score') || '{"wins":0,"losses":0}') }
  catch { return { wins: 0, losses: 0 } }
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4h4"/>
    </svg>
  )
}

export default function Solo({ onHome }) {
  const [word, setWord] = useState(randomWord)
  const [guessed, setGuessed] = useState({})
  const [lives, setLives] = useState(6)
  const [status, setStatus] = useState('playing')
  const [score, setScore] = useState(loadScore)
  const [lastGuessed, setLastGuessed] = useState(null)

  const wrongGuesses = 6 - lives

  function handleGuess(letter) {
    if (status !== 'playing' || guessed[letter]) return

    const newGuessed = { ...guessed, [letter]: true }
    const hit = word.includes(letter)
    const newLives = hit ? lives : lives - 1
    const allFound = [...new Set(word)].every(l => newGuessed[l])
    const newStatus = allFound ? 'won' : newLives <= 0 ? 'lost' : 'playing'

    setLastGuessed(letter)
    setGuessed(newGuessed)
    setLives(newLives)
    setStatus(newStatus)

    if (newStatus !== 'playing') {
      const newScore = {
        wins: score.wins + (newStatus === 'won' ? 1 : 0),
        losses: score.losses + (newStatus === 'lost' ? 1 : 0),
      }
      setScore(newScore)
      try { localStorage.setItem('kremala-score', JSON.stringify(newScore)) } catch {}
    }
  }

  function newRound() {
    setWord(randomWord())
    setGuessed({})
    setLives(6)
    setStatus('playing')
    setLastGuessed(null)
  }

  const isWon = status === 'won'
  const isLost = status === 'lost'

  return (
    <div className="pp-screen kr-noinset kr-view">
      <TopBar
        onBack={onHome}
        back="close"
        backLabel="Έξοδος"
        title="Κρεμάλα"
        sub={`Νίκες ${score.wins} · Ήττες ${score.losses}`}
        right={<button className="pp-iconbtn pp-iconbtn--flat" type="button" onClick={newRound} aria-label="Νέα λέξη"><RefreshIcon /></button>}
      />

      <main className="pp-screen__body kr-play">
        <div className="kr-stage">
          <LivesPips lives={lives} />
          <div className="kr-char">
            <div className="kr-platform" />
            <Character wrongGuesses={wrongGuesses} />
          </div>
        </div>
        <WordDisplay word={word} guessed={guessed} revealed={isLost} lastGuessed={lastGuessed} />
      </main>

      <Keyboard word={word} guessed={guessed} onGuess={handleGuess} disabled={status !== 'playing'} />

      {status !== 'playing' && (
        <ResultSheet
          label="Solo"
          title={isWon ? 'Νίκη!' : 'Κρίμα'}
          msg={isWon ? 'Βρήκες τη λέξη!' : 'Σχεδόν τα κατάφερες.'}
          word={word}
          loss={!isWon}
          extra={
            <div className="kr-scores">
              <span className="pp-chip pp-chip--success">Νίκες {score.wins}</span>
              <span className="pp-chip pp-chip--outline">Ήττες {score.losses}</span>
            </div>
          }
        >
          <button className="pp-btn pp-btn--lg pp-btn--block" type="button" onClick={newRound}>Νέα λέξη</button>
          <button className="pp-btn pp-btn--secondary pp-btn--block" type="button" onClick={onHome}>Αρχική</button>
        </ResultSheet>
      )}
    </div>
  )
}
