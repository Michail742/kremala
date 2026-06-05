import { useState } from 'react'
import { getPlayerId, useRoomSubscription } from './hooks/useRoom'
import Home from './screens/Home'
import Solo from './screens/Solo'
import Lobby from './screens/Lobby'
import SetWord from './screens/SetWord'
import Game from './screens/Game'
import Watch from './screens/Watch'
import RaceLobby from './screens/RaceLobby'
import Race from './screens/Race'

function deriveScreen(room, myId) {
  if (!room || !myId) return 'home'
  const { mode, status } = room
  if (status === 'waiting') return 'lobby'
  if (mode === 'setter-guesser') {
    if (status === 'setting-word')
      return room.players?.[myId]?.role === 'setter' ? 'set-word' : 'lobby'
    if (status === 'playing' || status === 'finished')
      return room.players?.[myId]?.role === 'setter' ? 'watch' : 'game'
  }
  if (mode === 'race') {
    if (status === 'ready-check') return 'race-lobby'
    if (status === 'playing' || status === 'finished') return 'race'
  }
  return 'home'
}

function loadSession() {
  try { return JSON.parse(localStorage.getItem('kremala-session')) } catch { return null }
}

export default function App() {
  const [solo, setSolo] = useState(false)
  const [session, setSession] = useState(loadSession)
  const { room, loaded } = useRoomSubscription(session?.roomCode)

  if (solo) return <Solo onHome={() => setSolo(false)} />

  function handleJoin(sess) {
    setSession(sess)
    localStorage.setItem('kremala-session', JSON.stringify(sess))
  }

  function handleHome() {
    setSession(null)
    localStorage.removeItem('kremala-session')
  }

  if (session && !loaded) {
    return (
      <div className="app t-mint" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-dot" />
      </div>
    )
  }

  const screen = session ? deriveScreen(room, session.myId) : 'home'
  const props = { room, session, onHome: handleHome }

  if (screen === 'home') return <Home onJoin={handleJoin} onSolo={() => setSolo(true)} />
  if (screen === 'lobby') return <Lobby {...props} />
  if (screen === 'set-word') return <SetWord {...props} />
  if (screen === 'watch') return <Watch {...props} />
  if (screen === 'game') return <Game {...props} />
  if (screen === 'race-lobby') return <RaceLobby {...props} />
  if (screen === 'race') return <Race {...props} />
  return null
}
