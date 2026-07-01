import { useState, useEffect } from 'react'
import { getPlayerId, useRoomSubscription } from './hooks/useRoom'
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

// Πόσο «φρέσκο» πρέπει να είναι ένα session για να ξαναμπείς αυτόματα μετά από
// reload. Όσο παίζεις κρατάμε ένα heartbeat που ανανεώνει το ts· αν κλείσεις ή
// παρατήσεις τη συσκευή, το ts «παγώνει» και μετά από λίγο το session θεωρείται
// εγκαταλελειμμένο → ξεκινάς από την Αρχή αντί να κολλάς στην παλιά οθόνη.
// Έτσι ένα γρήγορο reload (π.χ. κλείδωμα οθόνης στο κινητό) σε επαναφέρει, αλλά
// μια εγκαταλελειμμένη συσκευή όχι.
const SESSION_TTL_MS = 45_000
const SESSION_BEAT_MS = 15_000

function loadSession() {
  try {
    const s = JSON.parse(localStorage.getItem('kremala-session'))
    if (s && s.ts && Date.now() - s.ts < SESSION_TTL_MS) return s
  } catch { /* corrupt → πέσε στο καθάρισμα */ }
  localStorage.removeItem('kremala-session')
  return null
}

function saveSession(sess) {
  localStorage.setItem('kremala-session', JSON.stringify({ ...sess, ts: Date.now() }))
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

  function handleJoin(sess) {
    setSession(sess)
    saveSession(sess)
  }

  function handleHome() {
    setSession(null)
    localStorage.removeItem('kremala-session')
  }

  // Heartbeat: όσο είσαι σε δωμάτιο ανανέωνε το ts του session, ώστε ένα γρήγορο
  // reload να σε επαναφέρει αλλά μια εγκαταλελειμμένη συσκευή (που σταματά να
  // χτυπά) να ξεκινά από την Αρχή την επόμενη φορά (βλ. loadSession/SESSION_TTL).
  useEffect(() => {
    if (!session) return
    saveSession(session)
    const id = setInterval(() => saveSession(session), SESSION_BEAT_MS)
    return () => clearInterval(id)
  }, [session])

  // Σημαντικό: αυτό το early return πρέπει να έρχεται ΜΕΤΑ από όλα τα hooks
  // παραπάνω, αλλιώς το React μετράει διαφορετικό αριθμό hooks ανάμεσα στο
  // πρώτο render (solo=false) και το re-render μετά το setSolo(true) →
  // "Rendered fewer hooks than expected" crash.
  if (solo) return <Solo onHome={() => setSolo(false)} />

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
