import { useEffect, useRef } from 'react'
import { markReady, startRace } from '../hooks/useRoom'

export default function RaceLobby({ room, session, onHome }) {
  const startedRef = useRef(false)
  const players = room?.players || {}
  const ready = room?.ready || {}
  const playerIds = Object.keys(players)
  const amIReady = !!ready[session?.myId]

  useEffect(() => {
    const readyCount = Object.keys(ready).length
    const playerCount = Object.keys(players).length
    if (
      readyCount >= 2 &&
      playerCount === 2 &&
      room?.status === 'ready-check' &&
      !startedRef.current
    ) {
      startedRef.current = true
      startRace(session.roomCode, players)
    }
  }, [ready, room?.status])

  async function handleReady() {
    await markReady(session.roomCode, session.myId)
  }

  return (
    <div className="app t-mint">
      <div className="lobby-content">
        <div className="lobby-code-wrap">
          <p className="lobby-code-label">Race — Δωμάτιο</p>
          <div className="lobby-code">{session?.roomCode}</div>
        </div>

        <div className="lobby-players">
          {playerIds.map(id => (
            <div key={id} className="lobby-player">
              <div className={`lobby-dot${ready[id] ? ' ready' : ''}`} />
              <span>{players[id].name}</span>
              {id === session?.myId && <span className="lobby-you">(εσύ)</span>}
              {ready[id] && <span className="lobby-ready-tag">Έτοιμος</span>}
            </div>
          ))}
        </div>

        {!amIReady ? (
          <button className="btn" onClick={handleReady}>Έτοιμος!</button>
        ) : (
          <p className="lobby-status">Αναμονή αντιπάλου...</p>
        )}

        <button className="btn ghost mt-auto" onClick={onHome}>Έξοδος</button>
      </div>
    </div>
  )
}
