import { useState } from 'react'
import { WORDS } from '../data'
import Character from '../components/Character'
import Keyboard from '../components/Keyboard'
import WordDisplay from '../components/WordDisplay'
import LivesPips from '../components/LivesPips'

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)]
}

function loadScore() {
  try { return JSON.parse(localStorage.getItem('kremala-score') || '{"wins":0,"losses":0}') }
  catch { return { wins: 0, losses: 0 } }
}

function BrandSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
      <path d="M6 4h12v3a6 6 0 0 1-12 0V4Z"/>
      <path d="M10 12h4v4h-4z"/>
      <rect x="8" y="18" width="8" height="2.4" rx="1.2"/>
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
    <div className="app t-mint">
      <nav className="nav">
        <div className="brand">
          <span className="brand-mark"><BrandSvg /></span>
          <span className="brand-name">ΚΡΕΜΑΛΑ</span>
        </div>
        <div className="nav-right">
          <div className="score" aria-label="Σκορ">
            <span className="stat win">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
                <path d="M6 4h12v3a6 6 0 0 1-12 0V4Z"/>
                <path d="M10 12h4v4h-4z"/>
                <rect x="8" y="18" width="8" height="2.4" rx="1.2"/>
              </svg>
              <span>{score.wins}</span>
            </span>
            <span className="sep" aria-hidden="true" />
            <span className="stat loss">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" width="14" height="14" aria-hidden="true">
                <path d="M7 7l10 10M17 7L7 17"/>
              </svg>
              <span>{score.losses}</span>
            </span>
          </div>
          <button className="icon-btn" onClick={newRound} aria-label="Νέα λέξη">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" width="19" height="19">
              <path d="M20 12a8 8 0 1 1-2.5-5.8"/>
              <path d="M20 4v4h-4"/>
            </svg>
          </button>
        </div>
      </nav>

      <div className="stage">
        <LivesPips lives={lives} />
        <div className="char-wrap">
          <div className="char-platform" />
          <Character wrongGuesses={wrongGuesses} />
        </div>
      </div>

      <WordDisplay word={word} guessed={guessed} revealed={isLost} lastGuessed={lastGuessed} />

      <Keyboard word={word} guessed={guessed} onGuess={handleGuess} disabled={status !== 'playing'} />

      {status !== 'playing' && (
        <div className="scrim" role="dialog" aria-modal="true" aria-label={isWon ? 'Νίκη' : 'Ήττα'}>
          <div className={`modal ${isWon ? 'win' : 'over'}`}>
            <div className="badge">
              {isWon
                ? <BrandSvg />
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" width="40" height="40"><path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4h4"/></svg>
              }
            </div>
            <h3>{isWon ? 'ΝΙΚΗ!' : 'ΚΡΙΜΑ!'}</h3>
            <p className="msg">{isWon ? 'Βρήκες τη λέξη!' : 'Σχεδόν τα κατάφερες'}</p>
            <div className="reveal">
              <span className="lab">Η λέξη</span>
              {[...word].map((l, i) => <span key={i}>{l}</span>)}
            </div>
            <div className="score-row">
              <div>Νίκες<b>{score.wins}</b></div>
              <div>Ήττες<b>{score.losses}</b></div>
            </div>
            <button className="btn" onClick={newRound}>Νέα λέξη</button>
            <button className="btn ghost" onClick={onHome}>Αρχική</button>
          </div>
        </div>
      )}
    </div>
  )
}
