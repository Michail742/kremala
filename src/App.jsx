import { useEffect, useRef, useState } from 'react'
import { getPlayerId, useRoomSubscription, addScore } from './hooks/useRoom'
import { loadSkin, applySkin, saveSkin, SKINS } from './skins'
import Home from './screens/Home'
import Solo from './screens/Solo'
import Lobby from './screens/Lobby'
import SetWord from './screens/SetWord'
import Game from './screens/Game'
import Watch from './screens/Watch'
import Race from './screens/Race'

function deriveScreen(room, myId) {
  if (!room || !myId) return 'home'
  const { mode, status } = room
  if (status === 'ready-check') return 'lobby'
  if (mode === 'setter-guesser') {
    const iAmSetter = room.setterPid === myId
    if (status === 'setting-word')
      return iAmSetter ? 'set-word' : 'lobby'
    if (status === 'playing' || status === 'finished')
      return iAmSetter ? 'watch' : 'game'
  }
  if (mode === 'race') {
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
  const [skinId, setSkinId] = useState(loadSkin)

  function handleSkinChange(id) {
    const skin = SKINS.find(s => s.id === id)
    if (skin) { applySkin(skin); saveSkin(id) }
    setSkinId(id)
  }
  const { room, loaded } = useRoomSubscription(session?.roomCode)

  // Setter scoring (Setter/Guesser): όταν τελειώνει ο γύρος, ο setter παίρνει +1 ανά
  // λάθος γράμμα των guessers (ανταμοιβή για δύσκολη λέξη). Το γράφει ΜΟΝΟ ο host
  // (σταθερά παρών, ένας writer ώστε να μην πολλαπλασιαστεί)· ατομικό increment μέσω
  // RPC. Idempotent ανά γύρο μέσω του awardedRef (μηδενίζει στον επόμενο γύρο).
  const awardedRef = useRef(false)
  useEffect(() => {
    if (room?.status !== 'finished') { awardedRef.current = false; return }
    if (room?.mode !== 'setter-guesser' || awardedRef.current) return
    if (room?.players?.[session?.myId]?.role !== 'host') return
    awardedRef.current = true
    const wrong = (room?.gameState?.log || []).filter(e => !e.hit).length
    if (room?.setterPid && wrong > 0) addScore(room.code, room.setterPid, wrong)
  }, [room?.status, room?.mode, room?.code, session?.myId])

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

  if (screen === 'home') return <Home onJoin={handleJoin} onSolo={() => setSolo(true)} skinId={skinId} onSkinChange={handleSkinChange} />
  if (screen === 'lobby') return <Lobby {...props} />
  if (screen === 'set-word') return <SetWord {...props} />
  if (screen === 'watch') return <Watch {...props} />
  if (screen === 'game') return <Game {...props} />
  if (screen === 'race') return <Race {...props} />
  return null
}
