import { useEffect, useRef } from 'react'
import { markReady, startGame } from '../hooks/useRoom'

export default function Lobby({ room, session, onHome }) {
  const startedRef = useRef(false)
  const players = room?.players || {}
  const ready = room?.ready || {}
  const playerIds = Object.keys(players)
  const playerCount = playerIds.length
  const myId = session?.myId
  const amIReady = !!ready[myId]
  const isSettingWord = room?.status === 'setting-word'
  const isReadyCheck = room?.status === 'ready-check'

  const myRole = players[myId]?.role
  const isHost = myRole === 'host' || myRole === 'setter'
  const allReady = playerCount >= 2 && playerIds.every(id => ready[id])

  // Auto-start: μόλις είναι όλοι (≥2) έτοιμοι, ο host ξεκινάει το παιχνίδι.
  useEffect(() => {
    if (isReadyCheck && isHost && allReady && !startedRef.current) {
      startedRef.current = true
      startGame(session.roomCode, room.mode, playerIds)
    }
  }, [isReadyCheck, isHost, allReady])

  // Μήνυμα όσο ο setter διαλέγει λέξη (φάση setting-word, βλέπουν οι guessers)
  let statusMsg = ''
  if (isSettingWord) {
    const setter = Object.values(players).find(p => p.role === 'setter')
    statusMsg = `${setter?.name || 'Ο setter'} επιλέγει λέξη...`
  }

  async function handleReady() {
    await markReady(session.roomCode, myId)
  }

  const modeLabel = room?.mode === 'race' ? 'Race' : 'Setter / Guesser'

  return (
    <div className="app t-mint">
      <div className="lobby-content">
        <div className="lobby-code-wrap">
          <p className="lobby-code-label">{modeLabel} — Κωδικός δωματίου</p>
          <div className="lobby-code">{session?.roomCode}</div>
          {isReadyCheck && (
            <p className="lobby-code-hint">
              Μοιράσου τον κωδικό — έως 8 παίκτες ({playerCount}/8)
            </p>
          )}
        </div>

        <div className="lobby-players">
          {playerIds.map(id => (
            <div key={id} className="lobby-player">
              <div className={`lobby-dot${ready[id] ? ' ready' : ''}`} />
              <span>{players[id].name}</span>
              {id === myId && <span className="lobby-you">(εσύ)</span>}
              {isReadyCheck && ready[id] && <span className="lobby-ready-tag">Έτοιμος</span>}
            </div>
          ))}
        </div>

        {statusMsg && <p className="lobby-status">{statusMsg}</p>}

        {isReadyCheck && !amIReady && (
          <button className="btn" onClick={handleReady}>Έτοιμος!</button>
        )}
        {isReadyCheck && amIReady && (
          <p className="lobby-status">
            {playerCount < 2 ? 'Αναμονή για παίκτες...' : 'Αναμονή για τους υπόλοιπους...'}
          </p>
        )}

        <button className="btn ghost mt-auto" onClick={onHome}>Έξοδος</button>
      </div>
    </div>
  )
}
